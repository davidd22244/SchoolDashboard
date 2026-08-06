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

export default async () => {
  try {
    if (!CLIENT_ID || !CLIENT_SECRET) {
      return Response.json(
        { error: 'Google OAuth client credentials are not configured.' },
        { status: 500 }
      );
    }

    const settingsList = await db.select().from(userSettings);
    if (settingsList.length === 0 || !settingsList[0].googleRefreshToken) {
      return Response.json({ error: 'Google account not connected' }, { status: 400 });
    }

    const settings = settingsList[0];
    oauth2Client.setCredentials({ refresh_token: settings.googleRefreshToken });
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    const listRes = await gmail.users.messages.list({ userId: 'me', maxResults: 15, q: 'in:inbox' });
    const messages = listRes.data.messages || [];

    const promiseMessages = messages.map(async (message, index) => {
      const msg = await gmail.users.messages.get({ userId: 'me', id: message.id!, format: 'metadata', metadataHeaders: ['From', 'Subject', 'Date'] });
      const headers = msg.data.payload?.headers || [];
      const headerMap = Object.fromEntries(headers.map((h) => [h.name, h.value]));

      return {
        id: -(index + 1),
        sender: headerMap['From'] || 'Unknown Sender',
        senderEmail: headerMap['From'] || settings.googleEmail || '',
        subject: headerMap['Subject'] || '(No Subject)',
        body: 'Open Gmail to read the full message.',
        date: headerMap['Date'] || '',
        isRead: !msg.data.labelIds?.includes('UNREAD'),
        category: 'inbox',
      };
    });

    const resolved = await Promise.all(promiseMessages);
    return Response.json(resolved);
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to fetch Gmail messages' }, { status: 500 });
  }
};

export const config: Config = {
  path: '/api/gmail',
};
