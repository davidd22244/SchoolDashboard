import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useRouterState, Link } from "@tanstack/react-router";
import { GraduationCap, Clock, Settings, Database, HardDrive, RefreshCw } from "lucide-react";
const DEFAULT_SETTINGS = {
  email: "alex.student@lincolnhigh.edu",
  userName: "Alex Morgan",
  storageMode: "hybrid",
  googleConnected: false,
  googleEmail: void 0
};
const DEFAULT_CLASSES = [
  {
    id: 1,
    name: "AP Calculus BC",
    room: "Room 302 - Math Wing",
    startTime: "08:30",
    endTime: "09:45",
    days: "Mon,Tue,Wed,Thu,Fri",
    instructor: "Dr. Sarah Jenkins",
    color: "#3b82f6",
    scheduleType: "A"
  },
  {
    id: 2,
    name: "Physics Mechanics",
    room: "Lab B-104 - Science Hall",
    startTime: "10:00",
    endTime: "11:15",
    days: "Mon,Tue,Wed,Thu,Fri",
    instructor: "Prof. Alan Vance",
    color: "#8b5cf6",
    scheduleType: "B"
  },
  {
    id: 3,
    name: "English Literature",
    room: "Room 118 - Humanities Wing",
    startTime: "11:30",
    endTime: "12:45",
    days: "Mon,Wed,Fri",
    instructor: "Ms. Clara Oswald",
    color: "#ec4899",
    scheduleType: "A"
  },
  {
    id: 4,
    name: "Lunch Break & Study",
    room: "Student Commons / Cafeteria",
    startTime: "12:45",
    endTime: "13:30",
    days: "Mon,Tue,Wed,Thu,Fri",
    instructor: "N/A",
    color: "#f59e0b",
    scheduleType: "All"
  },
  {
    id: 5,
    name: "Computer Science",
    room: "Tech Center - Room 405",
    startTime: "13:35",
    endTime: "14:50",
    days: "Mon,Tue,Wed,Thu,Fri",
    instructor: "Mr. David Lee",
    color: "#10b981",
    scheduleType: "A"
  },
  {
    id: 6,
    name: "World History",
    room: "Room 205 - Social Studies",
    startTime: "15:00",
    endTime: "16:15",
    days: "Tue,Thu",
    instructor: "Mrs. Rebecca Taylor",
    color: "#6366f1",
    scheduleType: "B"
  }
];
const DEFAULT_EMAILS = [
  {
    id: 1,
    sender: "Principal's Office",
    senderEmail: "admin@lincolnhigh.edu",
    subject: "Upcoming Midterm Exam Schedule & Room Assignments",
    body: "Dear Students, Please review the updated midterm schedule posted on the student portal. Exam rooms have been assigned based on course sections. Good luck with your preparation!",
    date: "Today, 08:15 AM",
    isRead: false,
    category: "announcement"
  },
  {
    id: 2,
    sender: "Dr. Sarah Jenkins",
    senderEmail: "sjenkins@lincolnhigh.edu",
    subject: "AP Calculus BC Problem Set 4 Solutions Posted",
    body: "Hi everyone, I have uploaded the solution set for Problem Set 4. Make sure to review questions 5 and 8 before tomorrow's review session.",
    date: "Yesterday, 04:30 PM",
    isRead: true,
    category: "homework"
  },
  {
    id: 3,
    sender: "Computer Science Club",
    senderEmail: "cs-club@lincolnhigh.edu",
    subject: "Annual High School Hackathon Registration Open",
    body: "Hey coders! Registration for the annual High School Hackathon is officially open. Form teams of 2-4 and register by Friday for early bird t-shirts.",
    date: "Aug 4, 2026",
    isRead: false,
    category: "inbox"
  },
  {
    id: 4,
    sender: "Library Services",
    senderEmail: "library@lincolnhigh.edu",
    subject: "Overdue Book Reminder: Physics Fundamentals",
    body: "This is a friendly reminder that 'Physics Fundamentals 3rd Ed' is due back this Friday. You can renew online or at the circulation desk.",
    date: "Aug 3, 2026",
    isRead: true,
    category: "inbox"
  }
];
const LOCAL_CLASSES_KEY = "school_dashboard_classes";
const LOCAL_EMAILS_KEY = "school_dashboard_emails";
const LOCAL_SETTINGS_KEY = "school_dashboard_settings";
function timeStringToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}
function formatTime12h(timeStr) {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${displayHours}:${displayMinutes} ${period}`;
}
function getWeekdayShortName(date) {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()];
}
function calculateClassStatus(classes, now = /* @__PURE__ */ new Date(), scheduleType = "All") {
  if (!classes || classes.length === 0) {
    return {
      currentClass: null,
      nextClass: null,
      status: "no_classes_today",
      timeRemainingSeconds: 0,
      totalDurationSeconds: 0,
      percentComplete: 0,
      formattedRemaining: "No classes scheduled"
    };
  }
  const sortedClasses = [...classes].sort(
    (a, b) => timeStringToMinutes(a.startTime) - timeStringToMinutes(b.startTime)
  );
  const currentDay = getWeekdayShortName(now);
  const todaysClasses = sortedClasses.filter(
    (c) => c.days.split(",").map((d) => d.trim()).includes(currentDay) && (scheduleType === "All" || c.scheduleType === scheduleType)
  );
  if (todaysClasses.length === 0) {
    return {
      currentClass: null,
      nextClass: null,
      status: "no_classes_today",
      timeRemainingSeconds: 0,
      totalDurationSeconds: 0,
      percentComplete: 0,
      formattedRemaining: "No classes scheduled today"
    };
  }
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentSeconds = now.getSeconds();
  const nowTotalSeconds = currentMinutes * 60 + currentSeconds;
  let currentClass = null;
  let nextClass = null;
  for (let i = 0; i < todaysClasses.length; i++) {
    const c = todaysClasses[i];
    const startSec = timeStringToMinutes(c.startTime) * 60;
    const endSec = timeStringToMinutes(c.endTime) * 60;
    if (nowTotalSeconds >= startSec && nowTotalSeconds < endSec) {
      currentClass = c;
      nextClass = todaysClasses[i + 1] || null;
      break;
    }
    if (nowTotalSeconds < startSec) {
      nextClass = c;
      break;
    }
  }
  if (currentClass) {
    const startSec = timeStringToMinutes(currentClass.startTime) * 60;
    const endSec = timeStringToMinutes(currentClass.endTime) * 60;
    const totalDurationSeconds = Math.max(1, endSec - startSec);
    const timeRemainingSeconds = Math.max(0, endSec - nowTotalSeconds);
    const elapsedSeconds = Math.max(0, nowTotalSeconds - startSec);
    const percentComplete = Math.min(100, Math.round(elapsedSeconds / totalDurationSeconds * 100));
    const mins = Math.floor(timeRemainingSeconds / 60);
    const secs = timeRemainingSeconds % 60;
    const formattedRemaining = mins > 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m ${secs < 10 ? "0" : ""}${secs}s`;
    return {
      currentClass,
      nextClass,
      status: "in_class",
      timeRemainingSeconds,
      totalDurationSeconds,
      percentComplete,
      formattedRemaining
    };
  }
  if (nextClass) {
    const nextStartSec = timeStringToMinutes(nextClass.startTime) * 60;
    const timeRemainingSeconds = Math.max(0, nextStartSec - nowTotalSeconds);
    const mins = Math.floor(timeRemainingSeconds / 60);
    const secs = timeRemainingSeconds % 60;
    const formattedRemaining = mins > 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m ${secs < 10 ? "0" : ""}${secs}s`;
    const firstClassStartSec = timeStringToMinutes(todaysClasses[0].startTime) * 60;
    const status = nowTotalSeconds < firstClassStartSec ? "before_school" : "between_classes";
    return {
      currentClass: null,
      nextClass,
      status,
      timeRemainingSeconds,
      totalDurationSeconds: 0,
      percentComplete: 0,
      formattedRemaining
    };
  }
  return {
    currentClass: null,
    nextClass: null,
    status: "after_school",
    timeRemainingSeconds: 0,
    totalDurationSeconds: 0,
    percentComplete: 100,
    formattedRemaining: "School day finished!"
  };
}
function getLocalSettings() {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(LOCAL_SETTINGS_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}
function saveLocalSettings(settings) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save settings to localStorage", e);
  }
}
function getLocalClasses() {
  if (typeof window === "undefined") return DEFAULT_CLASSES;
  try {
    const raw = localStorage.getItem(LOCAL_CLASSES_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_CLASSES;
  } catch {
    return DEFAULT_CLASSES;
  }
}
function saveLocalClasses(classes) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_CLASSES_KEY, JSON.stringify(classes));
  } catch (e) {
    console.error("Failed to save classes to localStorage", e);
  }
}
function getLocalEmails() {
  if (typeof window === "undefined") return DEFAULT_EMAILS;
  try {
    const raw = localStorage.getItem(LOCAL_EMAILS_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_EMAILS;
  } catch {
    return DEFAULT_EMAILS;
  }
}
function saveLocalEmails(emails) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_EMAILS_KEY, JSON.stringify(emails));
  } catch (e) {
    console.error("Failed to save emails to localStorage", e);
  }
}
function Header({ settings }) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  return /* @__PURE__ */ jsx("header", { className: "bg-slate-900 text-white shadow-md border-b border-slate-800 sticky top-0 z-50", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between h-16", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20", children: /* @__PURE__ */ jsx(GraduationCap, { className: "w-6 h-6 text-white" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("span", { className: "font-bold text-lg tracking-tight text-white block", children: [
          "EduDash ",
          /* @__PURE__ */ jsx("span", { className: "text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-medium border border-blue-500/30", children: "School" })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-400 block -mt-1 truncate max-w-[200px] sm:max-w-none", children: settings.email || "Student Dashboard" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("nav", { className: "flex items-center gap-1 sm:gap-2", children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/",
          className: `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${currentPath === "/" ? "bg-blue-600 text-white shadow-sm" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`,
          children: [
            /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Dashboard" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/customize",
          className: `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${currentPath === "/customize" ? "bg-blue-600 text-white shadow-sm" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`,
          children: [
            /* @__PURE__ */ jsx(Settings, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Customize" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300", children: [
        settings.storageMode === "server" && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Database, { className: "w-3.5 h-3.5 text-emerald-400" }),
          /* @__PURE__ */ jsx("span", { children: "Server DB" })
        ] }),
        settings.storageMode === "local" && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(HardDrive, { className: "w-3.5 h-3.5 text-amber-400" }),
          /* @__PURE__ */ jsx("span", { children: "LocalStorage" })
        ] }),
        settings.storageMode === "hybrid" && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(RefreshCw, { className: "w-3.5 h-3.5 text-blue-400 animate-spin-slow" }),
          /* @__PURE__ */ jsx("span", { children: "Hybrid Storage" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-inner ring-2 ring-indigo-400/30", children: settings.userName ? settings.userName.charAt(0).toUpperCase() : "S" })
    ] })
  ] }) }) });
}
export {
  DEFAULT_SETTINGS as D,
  Header as H,
  getLocalClasses as a,
  getLocalEmails as b,
  saveLocalClasses as c,
  saveLocalEmails as d,
  DEFAULT_CLASSES as e,
  formatTime12h as f,
  getLocalSettings as g,
  DEFAULT_EMAILS as h,
  calculateClassStatus as i,
  saveLocalSettings as s,
  timeStringToMinutes as t
};
