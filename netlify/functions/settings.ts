import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { userSettings } from "../../db/schema.js";
import { DEFAULT_SETTINGS } from "../../src/lib/default-data.js";
import { eq } from "drizzle-orm";

export default async (req: Request) => {
  try {
    if (req.method === "GET") {
      let settingsList = await db.select().from(userSettings);
      if (settingsList.length === 0) {
        const [inserted] = await db
          .insert(userSettings)
          .values({
            email: DEFAULT_SETTINGS.email,
            userName: DEFAULT_SETTINGS.userName,
            storageMode: DEFAULT_SETTINGS.storageMode,
          })
          .returning();
        return Response.json(inserted);
      }
      return Response.json(settingsList[0]);
    }

    if (req.method === "POST" || req.method === "PUT") {
      const body = await req.json();

      let settingsList = await db.select().from(userSettings);
      let updated;

      if (settingsList.length === 0) {
        [updated] = await db
          .insert(userSettings)
          .values({
            email: body.email || DEFAULT_SETTINGS.email,
            userName: body.userName || DEFAULT_SETTINGS.userName,
            storageMode: body.storageMode || DEFAULT_SETTINGS.storageMode,
          })
          .returning();
      } else {
        [updated] = await db
          .update(userSettings)
          .set({
            email: body.email ?? settingsList[0].email,
            userName: body.userName ?? settingsList[0].userName,
            storageMode: body.storageMode ?? settingsList[0].storageMode,
            updatedAt: new Date(),
          })
          .where(eq(userSettings.id, settingsList[0].id))
          .returning();
      }

      return Response.json(updated);
    }

    return Response.json({ error: "Method not allowed" }, { status: 405 });
  } catch (err: any) {
    return Response.json({ error: err.message || "Server error" }, { status: 500 });
  }
};

export const config: Config = {
  path: "/api/settings",
};
