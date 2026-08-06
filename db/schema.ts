import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  userName: text("user_name").default("Student"),
  storageMode: text("storage_mode").default("hybrid"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const classes = pgTable("classes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  room: text("room").notNull(), // room stored as string
  startTime: text("start_time").notNull(), // format HH:MM
  endTime: text("end_time").notNull(),   // format HH:MM
  days: text("days").default("Mon,Tue,Wed,Thu,Fri"),
  instructor: text("instructor").default(""),
  color: text("color").default("#3b82f6"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const emails = pgTable("emails", {
  id: serial("id").primaryKey(),
  sender: text("sender").notNull(),
  senderEmail: text("sender_email").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  date: text("date").notNull(),
  isRead: integer("is_read").default(0),
  category: text("category").default("inbox"),
  createdAt: timestamp("created_at").defaultNow(),
});
