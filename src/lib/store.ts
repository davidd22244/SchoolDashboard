import {
  ClassScheduleItem,
  EmailItem,
  UserSettings,
  DEFAULT_CLASSES,
  DEFAULT_EMAILS,
  DEFAULT_SETTINGS,
} from './default-data';

const LOCAL_CLASSES_KEY = 'school_dashboard_classes';
const LOCAL_EMAILS_KEY = 'school_dashboard_emails';
const LOCAL_SETTINGS_KEY = 'school_dashboard_settings';

export interface ClassTimeStatus {
  currentClass: ClassScheduleItem | null;
  nextClass: ClassScheduleItem | null;
  status: 'in_class' | 'before_school' | 'between_classes' | 'after_school' | 'no_classes_today';
  timeRemainingSeconds: number; // For current class end OR next class start
  totalDurationSeconds: number; // Total duration of current class
  percentComplete: number;      // 0 to 100
  formattedRemaining: string;  // e.g. "24m 12s" or "1h 15m"
}

// Helper to convert "HH:MM" string to minutes from midnight
export function timeStringToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

// Helper to format minutes from midnight back to 12h or 24h string
export function formatTime12h(timeStr: string): string {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${displayHours}:${displayMinutes} ${period}`;
}

function getWeekdayShortName(date: Date): string {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
}

// Calculate status for current time
export function calculateClassStatus(
  classes: ClassScheduleItem[],
  now: Date = new Date(),
  scheduleType: string = 'All'
): ClassTimeStatus {
  if (!classes || classes.length === 0) {
    return {
      currentClass: null,
      nextClass: null,
      status: 'no_classes_today',
      timeRemainingSeconds: 0,
      totalDurationSeconds: 0,
      percentComplete: 0,
      formattedRemaining: 'No classes scheduled',
    };
  }

  // Sort classes by start time, then filter for today
  const sortedClasses = [...classes].sort(
    (a, b) => timeStringToMinutes(a.startTime) - timeStringToMinutes(b.startTime)
  );

  const currentDay = getWeekdayShortName(now);
  const todaysClasses = sortedClasses.filter((c) =>
    c.days
      .split(',')
      .map((d) => d.trim())
      .includes(currentDay) &&
    (scheduleType === 'All' || c.scheduleType === scheduleType)
  );

  if (todaysClasses.length === 0) {
    return {
      currentClass: null,
      nextClass: null,
      status: 'no_classes_today',
      timeRemainingSeconds: 0,
      totalDurationSeconds: 0,
      percentComplete: 0,
      formattedRemaining: 'No classes scheduled today',
    };
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentSeconds = now.getSeconds();
  const nowTotalSeconds = currentMinutes * 60 + currentSeconds;

  let currentClass: ClassScheduleItem | null = null;
  let nextClass: ClassScheduleItem | null = null;

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
    const percentComplete = Math.min(100, Math.round((elapsedSeconds / totalDurationSeconds) * 100));

    const mins = Math.floor(timeRemainingSeconds / 60);
    const secs = timeRemainingSeconds % 60;
    const formattedRemaining = mins > 60
      ? `${Math.floor(mins / 60)}h ${mins % 60}m`
      : `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;

    return {
      currentClass,
      nextClass,
      status: 'in_class',
      timeRemainingSeconds,
      totalDurationSeconds,
      percentComplete,
      formattedRemaining,
    };
  }

  if (nextClass) {
    const nextStartSec = timeStringToMinutes(nextClass.startTime) * 60;
    const timeRemainingSeconds = Math.max(0, nextStartSec - nowTotalSeconds);
    const mins = Math.floor(timeRemainingSeconds / 60);
    const secs = timeRemainingSeconds % 60;
    const formattedRemaining = mins > 60
      ? `${Math.floor(mins / 60)}h ${mins % 60}m`
      : `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;

    const firstClassStartSec = timeStringToMinutes(todaysClasses[0].startTime) * 60;
    const status = nowTotalSeconds < firstClassStartSec ? 'before_school' : 'between_classes';

    return {
      currentClass: null,
      nextClass,
      status,
      timeRemainingSeconds,
      totalDurationSeconds: 0,
      percentComplete: 0,
      formattedRemaining,
    };
  }

  // After all classes for the day
  return {
    currentClass: null,
    nextClass: null,
    status: 'after_school',
    timeRemainingSeconds: 0,
    totalDurationSeconds: 0,
    percentComplete: 100,
    formattedRemaining: 'School day finished!',
  };
}

// Local Storage helpers
export function getLocalSettings(): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(LOCAL_SETTINGS_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveLocalSettings(settings: UserSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings to localStorage', e);
  }
}

export function getLocalClasses(): ClassScheduleItem[] {
  if (typeof window === 'undefined') return DEFAULT_CLASSES;
  try {
    const raw = localStorage.getItem(LOCAL_CLASSES_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_CLASSES;
  } catch {
    return DEFAULT_CLASSES;
  }
}

export function saveLocalClasses(classes: ClassScheduleItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_CLASSES_KEY, JSON.stringify(classes));
  } catch (e) {
    console.error('Failed to save classes to localStorage', e);
  }
}

export function getLocalEmails(): EmailItem[] {
  if (typeof window === 'undefined') return DEFAULT_EMAILS;
  try {
    const raw = localStorage.getItem(LOCAL_EMAILS_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_EMAILS;
  } catch {
    return DEFAULT_EMAILS;
  }
}

export function saveLocalEmails(emails: EmailItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_EMAILS_KEY, JSON.stringify(emails));
  } catch (e) {
    console.error('Failed to save emails to localStorage', e);
  }
}
