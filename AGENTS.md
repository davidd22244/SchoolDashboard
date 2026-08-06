# AGENTS.md

This document outlines the architecture, directory structure, conventions, and key decisions for developers and AI agents working on this codebase.

## System Architecture

```
├── db/
│   ├── index.ts                     # Drizzle ORM client initialization with Netlify Database adapter
│   └── schema.ts                    # Postgres schema (user_settings, classes, emails)
├── netlify/
│   ├── database/migrations/         # Drizzle generated SQL migration files
│   └── functions/                   # Netlify serverless functions (/api/schedule, /api/emails, /api/settings)
├── src/
│   ├── components/
│   │   ├── ClassCountdownWidget.tsx # Real-time countdown timer to end of class + time simulator
│   │   ├── EmailsWidget.tsx         # Student email inbox, modal view, compose email
│   │   ├── Header.tsx               # Top navigation header and storage indicator
│   │   └── UpcomingScheduleWidget.tsx # Interactive class schedule timeline
│   ├── lib/
│   │   ├── default-data.ts          # Initial seed schedules, emails, and settings interfaces
│   │   └── store.ts                 # Time calculation engine and localStorage helpers
│   ├── routes/
│   │   ├── __root.tsx               # Root document layout
│   │   ├── customize.tsx            # Customization page for student email, schedule, storage choice
│   │   └── index.tsx                # Main School Dashboard view
│   ├── router.tsx                   # TanStack Router instance setup
│   └── styles.css                   # Tailwind CSS imports
├── drizzle.config.ts                # Drizzle Kit configuration (out: netlify/database/migrations)
└── netlify.toml                     # Netlify build & dev server config
```

## Key Parameters & Specifications

- **Class Schedule Data Structure**:
  - `name`: string
  - `room`: string (Room location stored as string, e.g. "Room 302 - Math Wing")
  - `startTime`: string ("HH:MM" 24h format, e.g. "08:30")
  - `endTime`: string ("HH:MM" 24h format, e.g. "09:45")
  - `days`: string (comma-separated days, e.g. "Mon,Tue,Wed,Thu,Fri")
  - `instructor`: string
  - `color`: string (hex color code)

- **Storage Architecture**:
  - Netlify Database (Postgres) via `@netlify/database` and `drizzle-orm@beta`.
  - LocalStorage fallback (`school_dashboard_classes`, `school_dashboard_emails`, `school_dashboard_settings`).
  - Storage selection modes: `hybrid`, `server`, `local`.

- **Time Calculation Logic**:
  - `calculateClassStatus` in `src/lib/store.ts` computes active class state, elapsed percentage, remaining minutes/seconds, and next class.
