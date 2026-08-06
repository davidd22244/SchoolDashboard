import { createFileRoute, useNavigate } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import {
  Clock,
  Mail,
  Calendar,
  Settings,
  GraduationCap,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Database,
  ArrowRight
} from 'lucide-react';
import {
  ClassScheduleItem,
  EmailItem,
  UserSettings,
  DEFAULT_CLASSES,
  DEFAULT_EMAILS,
  DEFAULT_SETTINGS
} from '../lib/default-data';
import {
  getLocalClasses,
  saveLocalClasses,
  getLocalEmails,
  saveLocalEmails,
  getLocalSettings,
  saveLocalSettings,
  calculateClassStatus
} from '../lib/store';
import { Header } from '../components/Header';
import { ClassCountdownWidget } from '../components/ClassCountdownWidget';
import { EmailsWidget } from '../components/EmailsWidget';
import { UpcomingScheduleWidget } from '../components/UpcomingScheduleWidget';

export const Route = createFileRoute('/')({
  component: SchoolDashboard,
});

function SchoolDashboard() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [classes, setClasses] = useState<ClassScheduleItem[]>([]);
  const [emails, setEmails] = useState<EmailItem[]>([]);
  const [scheduleType, setScheduleType] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initial load
  useEffect(() => {
    const s = getLocalSettings();
    setSettings(s);
    setClasses(getLocalClasses());
    setEmails(getLocalEmails());
    setIsLoading(false);

    // Fetch updated data from server API and Gmail if connected.
    fetchServerData(s.storageMode, s.googleEmail);
  }, []);

  const fetchServerData = async (
    storageMode: 'local' | 'server' | 'hybrid' = 'hybrid',
    googleEmailToUse?: string
  ) => {
    let latestGoogleEmail = googleEmailToUse;
    let fetchedSettings: UserSettings | null = null;

    if (storageMode !== 'local') {
      try {
        const [resSettings, resClasses, resEmails] = await Promise.all([
          fetch('/api/settings').then((r) => (r.ok ? r.json() : null)),
          fetch('/api/schedule').then((r) => (r.ok ? r.json() : null)),
          fetch('/api/emails').then((r) => (r.ok ? r.json() : null)),
        ]);

        if (resSettings && resSettings.email) {
          setSettings(resSettings);
          saveLocalSettings(resSettings);
          fetchedSettings = resSettings;
          latestGoogleEmail = resSettings.googleEmail || latestGoogleEmail;
        }
        if (resClasses && Array.isArray(resClasses) && resClasses.length > 0) {
          setClasses(resClasses);
          saveLocalClasses(resClasses);
        }
        if (resEmails && Array.isArray(resEmails) && resEmails.length > 0) {
          setEmails(resEmails);
          saveLocalEmails(resEmails);
        }
      } catch {
        // Local storage fallback is already active
      }
    }

    if (fetchedSettings?.googleEmail || latestGoogleEmail) {
      try {
        const gmailRes = await fetch('/api/gmail');
        if (gmailRes.ok) {
          const gmailEmails = await gmailRes.json();
          if (Array.isArray(gmailEmails) && gmailEmails.length > 0) {
            setEmails(gmailEmails);
            saveLocalEmails(gmailEmails);
          }
        }
      } catch {
        // Gmail fetch may fail if token is invalid or not connected
      }
    }
  };

  // Email handlers
  const handleUpdateEmail = async (updatedEmail: EmailItem) => {
    const newList = emails.map((e) => (e.id === updatedEmail.id ? updatedEmail : e));
    setEmails(newList);
    saveLocalEmails(newList);

    if (settings.storageMode === 'local') return;

    try {
      await fetch('/api/emails', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEmail),
      });
    } catch {}
  };

  const handleDeleteEmail = async (id: number) => {
    const newList = emails.filter((e) => e.id !== id);
    setEmails(newList);
    saveLocalEmails(newList);

    if (settings.storageMode === 'local') return;

    try {
      await fetch(`/api/emails?id=${id}`, { method: 'DELETE' });
    } catch {}
  };

  const handleAddEmail = async (newEmailData: Omit<EmailItem, 'id'>) => {
    const tempId = Date.now();
    const tempEmail: EmailItem = { ...newEmailData, id: tempId };

    const newList = [tempEmail, ...emails];
    setEmails(newList);
    saveLocalEmails(newList);

    if (settings.storageMode === 'local') return;

    try {
      const res = await fetch('/api/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmailData),
      });
      if (res.ok) {
        const created = await res.json();
        if (created && created.id) {
          const synced = newList.map((e) => (e.id === tempId ? created : e));
          setEmails(synced);
          saveLocalEmails(synced);
        }
      }
    } catch {}
  };

  const classStatus = calculateClassStatus(classes);
  const activeClassId = classStatus.currentClass ? classStatus.currentClass.id : null;
  const unreadEmailCount = emails.filter((e) => !e.isRead).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      <Header settings={settings} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Welcome Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              <span>Student Portal</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
              Welcome back, {settings.userName || 'Student'}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Here is your active school countdown, emails, and upcoming schedule parameters.
            </p>
          </div>

          <button
            onClick={() => navigate({ to: '/customize' })}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition"
          >
            <Settings className="w-4 h-4" />
            <span>Customize Parameters</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Status</div>
              <div className="text-sm font-bold text-white capitalize">
                {classStatus.status.replace('_', ' ')}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-lg border border-indigo-500/30">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Total Classes</div>
              <div className="text-lg font-bold text-white">
                {classes.length} Courses Scheduled
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-lg border border-cyan-500/30">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Emails</div>
              <div className="text-lg font-bold text-white">
                {unreadEmailCount} Unread Emails
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Storage Mode</div>
              <div className="text-sm font-bold text-emerald-300 capitalize">
                {settings.storageMode} Storage
              </div>
            </div>
          </div>

        </div>

        {/* Real-Time Class Countdown Timer Widget */}
<ClassCountdownWidget classes={classes} scheduleType={scheduleType} />

        {/* Dashboard Main Grid: Emails & Upcoming Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Emails Widget */}
          <EmailsWidget
            emails={emails}
            userEmail={settings.googleEmail || settings.email}
            onUpdateEmail={handleUpdateEmail}
            onDeleteEmail={handleDeleteEmail}
            onAddEmail={handleAddEmail}
          />

          {/* Upcoming Schedule Widget */}
          <UpcomingScheduleWidget
            classes={classes}
            activeClassId={activeClassId}
            scheduleType={scheduleType}
            onScheduleTypeChange={setScheduleType}
          />

        </div>

      </main>
    </div>
  );
}
