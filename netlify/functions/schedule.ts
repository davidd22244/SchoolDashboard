import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { classes } from "../../db/schema.js";
import { DEFAULT_CLASSES } from "../../src/lib/default-data.js";
import { eq } from "drizzle-orm";

export default async (req: Request) => {
  try {
    const url = new URL(req.url);

    if (req.method === "GET") {
      let classList = await db.select().from(classes);
      if (classList.length === 0) {
        // Seed default classes if database is empty
        for (const item of DEFAULT_CLASSES) {
          await db.insert(classes).values({
            name: item.name,
            room: item.room,
            startTime: item.startTime,
            endTime: item.endTime,
            days: item.days,
            instructor: item.instructor,
            color: item.color,
          });
        }
        classList = await db.select().from(classes);
      }
      return Response.json(classList);
    }

    if (req.method === "POST") {
      const body = await req.json();
      if (body.action === "reset") {
        await db.delete(classes);
        for (const item of DEFAULT_CLASSES) {
          await db.insert(classes).values({
            name: item.name,
            room: item.room,
            startTime: item.startTime,
            endTime: item.endTime,
            days: item.days,
            instructor: item.instructor,
            color: item.color,
          });
        }
        const resetList = await db.select().from(classes);
        return Response.json(resetList);
      }

      const [newClass] = await db
        .insert(classes)
        .values({
          name: body.name,
          room: body.room,
          startTime: body.startTime,
          endTime: body.endTime,
          days: body.days || "Mon,Tue,Wed,Thu,Fri",
          instructor: body.instructor || "",
          color: body.color || "#3b82f6",
        })
        .returning();
      return Response.json(newClass, { status: 201 });
    }

    if (req.method === "PUT") {
      const body = await req.json();
      if (!body.id) {
        return Response.json({ error: "Missing id" }, { status: 400 });
      }
      const [updatedClass] = await db
        .update(classes)
        .set({
          name: body.name,
          room: body.room,
          startTime: body.startTime,
          endTime: body.endTime,
          days: body.days,
          instructor: body.instructor,
          color: body.color,
        })
        .where(eq(classes.id, body.id))
        .returning();
      return Response.json(updatedClass);
    }

    if (req.method === "DELETE") {
      const id = url.searchParams.get("id");
      if (!id) {
        return Response.json({ error: "Missing id parameter" }, { status: 400 });
      }
      await db.delete(classes).where(eq(classes.id, Number(id)));
      return Response.json({ success: true, deletedId: id });
    }

    return Response.json({ error: "Method not allowed" }, { status: 405 });
  } catch (err: any) {
    return Response.json({ error: err.message || "Server error" }, { status: 500 });
  }
};

export const config: Config = {
  path: "/api/schedule",
};
