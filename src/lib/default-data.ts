export interface ClassScheduleItem {
  id: number;
  name: string;
  room: string;
  startTime: string; // "HH:MM" 24h format
  endTime: string;   // "HH:MM" 24h format
  days: string;      // e.g. "Mon,Tue,Wed,Thu,Fri"
  instructor: string;
  color: string;
}

export interface EmailItem {
  id: number;
  sender: string;
  senderEmail: string;
  subject: string;
  body: string;
  date: string;
  isRead: boolean;
  category: 'inbox' | 'homework' | 'announcement';
}

export interface UserSettings {
  id?: number;
  email: string;
  userName: string;
  storageMode: 'local' | 'server' | 'hybrid';
  googleConnected?: boolean;
  googleEmail?: string;
}

export const DEFAULT_SETTINGS: UserSettings = {
  email: 'alex.student@lincolnhigh.edu',
  userName: 'Alex Morgan',
  storageMode: 'hybrid',
  googleConnected: false,
  googleEmail: undefined,
};

export const DEFAULT_CLASSES: ClassScheduleItem[] = [
  {
    id: 1,
    name: 'AP Calculus BC',
    room: 'Room 302 - Math Wing',
    startTime: '08:30',
    endTime: '09:45',
    days: 'Mon,Tue,Wed,Thu,Fri',
    instructor: 'Dr. Sarah Jenkins',
    color: '#3b82f6',
  },
  {
    id: 2,
    name: 'Physics Mechanics',
    room: 'Lab B-104 - Science Hall',
    startTime: '10:00',
    endTime: '11:15',
    days: 'Mon,Tue,Wed,Thu,Fri',
    instructor: 'Prof. Alan Vance',
    color: '#8b5cf6',
  },
  {
    id: 3,
    name: 'English Literature',
    room: 'Room 118 - Humanities Wing',
    startTime: '11:30',
    endTime: '12:45',
    days: 'Mon,Wed,Fri',
    instructor: 'Ms. Clara Oswald',
    color: '#ec4899',
  },
  {
    id: 4,
    name: 'Lunch Break & Study',
    room: 'Student Commons / Cafeteria',
    startTime: '12:45',
    endTime: '13:30',
    days: 'Mon,Tue,Wed,Thu,Fri',
    instructor: 'N/A',
    color: '#f59e0b',
  },
  {
    id: 5,
    name: 'Computer Science',
    room: 'Tech Center - Room 405',
    startTime: '13:35',
    endTime: '14:50',
    days: 'Mon,Tue,Wed,Thu,Fri',
    instructor: 'Mr. David Lee',
    color: '#10b981',
  },
  {
    id: 6,
    name: 'World History',
    room: 'Room 205 - Social Studies',
    startTime: '15:00',
    endTime: '16:15',
    days: 'Tue,Thu',
    instructor: 'Mrs. Rebecca Taylor',
    color: '#6366f1',
  },
];

export const DEFAULT_EMAILS: EmailItem[] = [
  {
    id: 1,
    sender: "Principal's Office",
    senderEmail: 'admin@lincolnhigh.edu',
    subject: 'Upcoming Midterm Exam Schedule & Room Assignments',
    body: 'Dear Students, Please review the updated midterm schedule posted on the student portal. Exam rooms have been assigned based on course sections. Good luck with your preparation!',
    date: 'Today, 08:15 AM',
    isRead: false,
    category: 'announcement',
  },
  {
    id: 2,
    sender: 'Dr. Sarah Jenkins',
    senderEmail: 'sjenkins@lincolnhigh.edu',
    subject: 'AP Calculus BC Problem Set 4 Solutions Posted',
    body: "Hi everyone, I have uploaded the solution set for Problem Set 4. Make sure to review questions 5 and 8 before tomorrow's review session.",
    date: 'Yesterday, 04:30 PM',
    isRead: true,
    category: 'homework',
  },
  {
    id: 3,
    sender: 'Computer Science Club',
    senderEmail: 'cs-club@lincolnhigh.edu',
    subject: 'Annual High School Hackathon Registration Open',
    body: 'Hey coders! Registration for the annual High School Hackathon is officially open. Form teams of 2-4 and register by Friday for early bird t-shirts.',
    date: 'Aug 4, 2026',
    isRead: false,
    category: 'inbox',
  },
  {
    id: 4,
    sender: 'Library Services',
    senderEmail: 'library@lincolnhigh.edu',
    subject: 'Overdue Book Reminder: Physics Fundamentals',
    body: "This is a friendly reminder that 'Physics Fundamentals 3rd Ed' is due back this Friday. You can renew online or at the circulation desk.",
    date: 'Aug 3, 2026',
    isRead: true,
    category: 'inbox',
  },
];
