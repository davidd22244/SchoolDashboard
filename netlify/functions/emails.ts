import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { emails } from "../../db/schema.js";
import { DEFAULT_EMAILS } from "../../src/lib/default-data.js";
import { eq } from "drizzle-orm";

export default async (req: Request) => {
  try {
    const url = new URL(req.url);

    if (req.method === "GET") {
      let emailList = await db.select().from(emails);
      if (emailList.length === 0) {
        // Seed default emails
        for (const item of DEFAULT_EMAILS) {
          await db.insert(emails).values({
            sender: item.sender,
            senderEmail: item.senderEmail,
            subject: item.subject,
            body: item.body,
            date: item.date,
            isRead: item.isRead ? 1 : 0,
            category: item.category,
          });
        }
        emailList = await db.select().from(emails);
      }
      return Response.json(
        emailList.map((e) => ({
          ...e,
          isRead: Boolean(e.isRead),
        }))
      );
    }

    if (req.method === "POST") {
      const body = await req.json();
      if (body.action === "reset") {
        await db.delete(emails);
        for (const item of DEFAULT_EMAILS) {
          await db.insert(emails).values({
            sender: item.sender,
            senderEmail: item.senderEmail,
            subject: item.subject,
            body: item.body,
            date: item.date,
            isRead: item.isRead ? 1 : 0,
            category: item.category,
          });
        }
        const resetList = await db.select().from(emails);
        return Response.json(
          resetList.map((e) => ({
            ...e,
            isRead: Boolean(e.isRead),
          }))
        );
      }

      const [newEmail] = await db
        .insert(emails)
        .values({
          sender: body.sender,
          senderEmail: body.senderEmail,
          subject: body.subject,
          body: body.body,
          date: body.date || new Date().toLocaleString([], { hour: "2-digit", minute: "2-digit", month: "short", day: "numeric" }),
          isRead: body.isRead ? 1 : 0,
          category: body.category || "inbox",
        })
        .returning();

      return Response.json(
        { ...newEmail, isRead: Boolean(newEmail.isRead) },
        { status: 201 }
      );
    }

    if (req.method === "PUT") {
      const body = await req.json();
      if (!body.id) {
        return Response.json({ error: "Missing id" }, { status: 400 });
      }

      const updateData: Record<string, any> = {};
      if (typeof body.isRead !== "undefined") {
        updateData.isRead = body.isRead ? 1 : 0;
      }
      if (body.subject) updateData.subject = body.subject;
      if (body.body) updateData.body = body.body;

      const [updated] = await db
        .update(emails)
        .set(updateData)
        .where(eq(emails.id, body.id))
        .returning();

      return Response.json({ ...updated, isRead: Boolean(updated.isRead) });
    }

    if (req.method === "DELETE") {
      const id = url.searchParams.get("id");
      if (!id) {
        return Response.json({ error: "Missing id parameter" }, { status: 400 });
      }
      await db.delete(emails).where(eq(emails.id, Number(id)));
      return Response.json({ success: true, deletedId: id });
    }

    return Response.json({ error: "Method not allowed" }, { status: 405 });
  } catch (err: any) {
    return Response.json({ error: err.message || "Server error" }, { status: 500 });
  }
};

export const config: Config = {
  path: "/api/emails",
};
