CREATE TABLE "classes" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"room" text NOT NULL,
	"start_time" text NOT NULL,
	"end_time" text NOT NULL,
	"days" text DEFAULT 'Mon,Tue,Wed,Thu,Fri',
	"instructor" text DEFAULT '',
	"color" text DEFAULT '#3b82f6',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "emails" (
	"id" serial PRIMARY KEY,
	"sender" text NOT NULL,
	"sender_email" text NOT NULL,
	"subject" text NOT NULL,
	"body" text NOT NULL,
	"date" text NOT NULL,
	"is_read" integer DEFAULT 0,
	"category" text DEFAULT 'inbox',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_settings" (
	"id" serial PRIMARY KEY,
	"email" text NOT NULL,
	"user_name" text DEFAULT 'Student',
	"storage_mode" text DEFAULT 'hybrid',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
