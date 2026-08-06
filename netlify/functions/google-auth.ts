import type { Config } from '@netlify/functions';
import { google } from 'googleapis';
import { db } from '../../db/index.js';
import { userSettings } from '../../db/schema.js';
import { eq } from 'drizzle-orm';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const SITE_URL = process.env.SITE_URL || process.env.URL || 'http://localhost:8888';
const REDIRECT_URI = `${SITE_URL.replace(/\/$/, '')}/api/google-auth`;

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

function getAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/userinfo.email',
      'openid',
    ],
  });
}

export default async (req: Request) => {
  try {
    if (!CLIENT_ID || !CLIENT_SECRET) {
      return Response.json(
        { error: 'Google OAuth client credentials are not configured.' },
        { status: 500 }
      );
    }

    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');

    if (error) {
      return Response.redirect('/customize?google_error=access_denied');
    }

    if (!code) {
      return Response.redirect(getAuthUrl());
    }

    const tokenResponse = await oauth2Client.getToken(code);
    const tokens = tokenResponse.tokens;

    if (!tokens.refresh_token) {
      return Response.redirect('/customize?google_error=no_refresh_token');
    }

    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2' });
    const profile = await oauth2.userinfo.get();
    const googleEmail = profile.data.email;

    const settingsList = await db.select().from(userSettings);
    if (settingsList.length === 0) {
      await db.insert(userSettings).values({
        email: googleEmail || 'unknown@example.com',
        userName: profile.data.name || 'Google User',
        storageMode: 'hybrid',
        googleEmail: googleEmail || null,
        googleRefreshToken: tokens.refresh_token,
      });
    } else {
      await db
        .update(userSettings)
        .set({
          googleEmail: googleEmail || null,
          googleRefreshToken: tokens.refresh_token,
          updatedAt: new Date(),
        })
        .where(eq(userSettings.id, settingsList[0].id));
    }

    return Response.redirect('/customize?google_connected=true');
  } catch (err: any) {
    return Response.json({ error: err.message || 'Google OAuth error' }, { status: 500 });
  }
};

export const config: Config = {
  path: '/api/google-auth',
};
