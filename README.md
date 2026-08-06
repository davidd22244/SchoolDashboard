# EduDash - School Dashboard Application

A modern, feature-rich School Dashboard web application built with TanStack Start, React 19, Tailwind CSS 4, Drizzle ORM, and Netlify Database (managed Postgres).

## Features

- ⏳ **Time Until End of Class (Countdown Widget)**:
  - Real-time live countdown timer showing remaining minutes/seconds until current active class ends.
  - Active class information: Course Name, Room location (stored as string), Instructor, Start & End times.
  - Dynamic visual progress bar indicating class completion percentage.
  - Next class countdown and between-classes status tracking.
  - Time Simulation tool to test countdown behavior at any hour of the school day.

- 📧 **Emails Widget**:
  - Interactive student email inbox with unread status counters.
  - Filter by categories (*All*, *Inbox*, *Homework*, *Announcements*) and live search.
  - Email reader modal with mark read/unread and delete capabilities.
  - Ability to compose and add custom incoming emails.

- 📅 **Upcoming Schedule Widget**:
  - Full course schedule timeline storing start/end time, course name, and room location as string.
  - Highlighting for currently active classes ("Active Now").
  - Day of week filtering (*Mon*, *Tue*, *Wed*, *Thu*, *Fri*) and instructor search.

- ⚙️ **Customization Page (`/customize`)**:
  - Customize student email address and name.
  - Manage course schedule (Add new classes, Edit start/end time, Room string, Instructor, Color tags, Delete classes).
  - Storage Preference selector: Choose between **Local Storage** (browser), **Netlify Database (Server Postgres)**, or **Hybrid Sync**.

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/router)
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS 4, Lucide React Icons
- **Backend Storage**: Netlify Database (Managed Postgres) with [Drizzle ORM](https://orm.drizzle.team/)
- **Deployment**: Netlify Functions & Serverless API Routes

## Getting Started Locally

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open `http://localhost:3000` in your browser.

## Database Migrations

Database schema is defined in `db/schema.ts` and managed via Drizzle Kit:
```bash
npx drizzle-kit generate --name create_school_dashboard_tables
```
Migrations are automatically applied on deploy by Netlify.
