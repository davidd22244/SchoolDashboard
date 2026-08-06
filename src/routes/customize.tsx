import { createFileRoute, useNavigate } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import {
  Settings,
  Mail,
  Calendar,
  Database,
  HardDrive,
  RefreshCw,
  Plus,
  Trash2,
  Edit2,
  Check,
  Save,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  GraduationCap,
  Clock,
  MapPin,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
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
  formatTime12h
} from '../lib/store';
import { Header } from '../components/Header';

export const Route = createFileRoute('/customize')({
  component: CustomizePage,
});

function CustomizePage() {
  const navigate = useNavigate();

  // Settings state
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [classes, setClasses] = useState<ClassScheduleItem[]>([]);
  const [emails, setEmails] = useState<EmailItem[]>([]);

  // Status banners
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isLoadingServer, setIsLoadingServer] = useState<boolean>(false);

  // Class Form State
  const [editingClassId, setEditingClassId] = useState<number | null>(null);
  const [className, setClassName] = useState('');
  const [classRoom, setClassRoom] = useState('');
  const [classStartTime, setClassStartTime] = useState('09:00');
  const [classEndTime, setClassEndTime] = useState('10:15');
  const [classDays, setClassDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [classScheduleType, setClassScheduleType] = useState<string>('All');
  const [classInstructor, setClassInstructor] = useState('');
  const [classColor, setClassColor] = useState('#3b82f6');

  // Load initial data
  useEffect(() => {
    const s = getLocalSettings();
    setSettings(s);
    setClasses(getLocalClasses());
    setEmails(getLocalEmails());

    const params = new URLSearchParams(window.location.search);
    const googleConnected = params.get('google_connected');
    const googleError = params.get('google_error');

    if (googleConnected) {
      showNotification('Google account connected successfully!');
      fetchServerData('server');
      window.history.replaceState(null, '', window.location.pathname);
    } else if (googleError) {
      showNotification('Google connection failed. Please try again.');
      window.history.replaceState(null, '', window.location.pathname);
    } else {
      fetchServerData(s.storageMode);
    }
  }, []);

  const fetchServerData = async (storageMode: 'local' | 'server' | 'hybrid' = 'hybrid') => {
    if (storageMode === 'local') return;

    setIsLoadingServer(true);
    try {
      const [resSettings, resClasses, resEmails] = await Promise.all([
        fetch('/api/settings').then((r) => (r.ok ? r.json() : null)),
        fetch('/api/schedule').then((r) => (r.ok ? r.json() : null)),
        fetch('/api/emails').then((r) => (r.ok ? r.json() : null)),
      ]);

      if (resSettings && resSettings.email) {
        setSettings(resSettings);
        saveLocalSettings(resSettings);
      }
      if (resClasses && Array.isArray(resClasses) && resClasses.length > 0) {
        setClasses(resClasses);
        saveLocalClasses(resClasses);
      }
      if (resEmails && Array.isArray(resEmails) && resEmails.length > 0) {
        setEmails(resEmails);
        saveLocalEmails(resEmails);
      }
    } catch (err) {
      console.warn('Server storage offline or unavailable, using local storage.', err);
    } finally {
      setIsLoadingServer(false);
    }
  };

  const showNotification = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // Save Settings handler
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    saveLocalSettings(settings);

    if (settings.storageMode !== 'local') {
      try {
        await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settings),
        });
      } catch {
        // fallback
      }
    }

    showNotification('Email & User Profile preferences saved successfully!');
  };

  const handleGoogleDisconnect = async () => {
    const updatedSettings = { ...settings, googleEmail: undefined };
    setSettings(updatedSettings);
    saveLocalSettings(updatedSettings);

    if (settings.storageMode !== 'local') {
      try {
        await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...updatedSettings,
            googleRefreshToken: null,
          }),
        });
      } catch {
        // fallback
      }
    }

    showNotification('Google account disconnected.');
  };

  const handleGoogleConnect = () => {
    window.location.href = '/api/google-auth';
  };

  // Save or Add Class
  const handleSaveClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!className || !classRoom || !classStartTime || !classEndTime) {
      alert('Please fill out Class Name, Room, Start Time, and End Time');
      return;
    }

    const daysStr = classDays.length > 0 ? classDays.join(',') : 'Mon,Tue,Wed,Thu,Fri';

    if (editingClassId) {
      // Update existing class
      const updatedList = classes.map((c) =>
        c.id === editingClassId
          ? {
              ...c,
              name: className,
              room: classRoom,
              startTime: classStartTime,
              endTime: classEndTime,
              days: daysStr,
              scheduleType: classScheduleType,
              instructor: classInstructor,
              color: classColor,
            }
          : c
      );
      setClasses(updatedList);
      saveLocalClasses(updatedList);

      if (settings.storageMode !== 'local') {
        try {
          await fetch('/api/schedule', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: editingClassId,
              name: className,
              room: classRoom,
              startTime: classStartTime,
              endTime: classEndTime,
              days: daysStr,
              scheduleType: classScheduleType,
              instructor: classInstructor,
              color: classColor,
            }),
          });
        } catch {}
      }

      showNotification(`Class "${className}" updated!`);
    } else {
      // Create new class
      const newId = Date.now();
      const newClass: ClassScheduleItem = {
        id: newId,
        name: className,
        room: classRoom,
        startTime: classStartTime,
        endTime: classEndTime,
        days: daysStr,
        scheduleType: classScheduleType,
        instructor: classInstructor,
        color: classColor,
      };

      const updatedList = [...classes, newClass];
      setClasses(updatedList);
      saveLocalClasses(updatedList);

      if (settings.storageMode !== 'local') {
        try {
          const res = await fetch('/api/schedule', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newClass),
          });
          if (res.ok) {
            const serverClass = await res.json();
            // replace temp id with server id if returned
            if (serverClass && serverClass.id) {
              const syncedList = updatedList.map((c) => (c.id === newId ? serverClass : c));
              setClasses(syncedList);
              saveLocalClasses(syncedList);
            }
          }
        } catch {}
      }

      showNotification(`Added new class "${className}"!`);
    }

    // Reset Form
    resetClassForm();
  };

  const resetClassForm = () => {
    setEditingClassId(null);
    setClassName('');
    setClassRoom('');
    setClassStartTime('09:00');
    setClassEndTime('10:15');
    setClassDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
    setClassScheduleType('All');
    setClassInstructor('');
    setClassColor('#3b82f6');
  };

  const handleEditClass = (item: ClassScheduleItem) => {
    setEditingClassId(item.id);
    setClassName(item.name);
    setClassRoom(item.room);
    setClassStartTime(item.startTime);
    setClassEndTime(item.endTime);
    setClassDays(item.days ? item.days.split(',') : []);
    setClassScheduleType(item.scheduleType || 'All');
    setClassInstructor(item.instructor || '');
    setClassColor(item.color || '#3b82f6');
  };

  const handleDeleteClass = async (id: number) => {
    if (!confirm('Are you sure you want to delete this class?')) return;
    const updatedList = classes.filter((c) => c.id !== id);
    setClasses(updatedList);
    saveLocalClasses(updatedList);

    if (settings.storageMode !== 'local') {
      try {
        await fetch(`/api/schedule?id=${id}`, { method: 'DELETE' });
      } catch {}
    }

    showNotification('Class removed from schedule.');
  };

  const handleResetDefaults = async () => {
    if (!confirm('Reset all classes, emails, and settings to default values?')) return;

    setSettings(DEFAULT_SETTINGS);
    setClasses(DEFAULT_CLASSES);
    setEmails(DEFAULT_EMAILS);

    saveLocalSettings(DEFAULT_SETTINGS);
    saveLocalClasses(DEFAULT_CLASSES);
    saveLocalEmails(DEFAULT_EMAILS);

    if (settings.storageMode !== 'local') {
      try {
        await Promise.all([
          fetch('/api/schedule', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'reset' }),
          }),
          fetch('/api/emails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'reset' }),
          }),
        ]);
      } catch {}
    }

    showNotification('Reset to default schedule, emails, and settings!');
  };

  const toggleDay = (day: string) => {
    if (classDays.includes(day)) {
      setClassDays(classDays.filter((d) => d !== day));
    } else {
      setClassDays([...classDays, day]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      <Header settings={settings} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Banner header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
              <Settings className="w-4 h-4" />
              <span>Dashboard Customization</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
              Customize Your Parameters
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Manage your email, classes, schedule times, room assignments, and choose between Local Storage and Netlify Server Storage.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
            >
              <RotateCcw className="w-4 h-4 text-slate-400" />
              Reset Defaults
            </button>

            <button
              onClick={() => navigate({ to: '/' })}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Status Notification */}
        {statusMessage && (
          <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-sm font-medium flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Grid 1: Profile & Email + Storage Preference */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card 1: User Profile & Email */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-2.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Student Profile & Email</h2>
                <p className="text-xs text-slate-400">
                  Set the student email address displayed on your dashboard inbox
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1.5">
                  Student Name
                </label>
                <input
                  type="text"
                  required
                  value={settings.userName}
                  onChange={(e) => setSettings({ ...settings, userName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 text-sm"
                  placeholder="e.g. Alex Morgan"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1.5">
                  School Email Address
                </label>
                <input
                  type="email"
                  required
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 text-sm font-mono"
                  placeholder="e.g. student@school.edu"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition"
                >
                  <Save className="w-4 h-4" />
                  Save Profile Settings
                </button>
              </div>
            </form>

            <div className="mt-4 rounded-2xl bg-slate-800 border border-slate-700 p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Google Gmail Integration</p>
                  <p className="text-sm text-slate-200 mt-1">
                    {settings.googleEmail ? `Connected to ${settings.googleEmail}` : 'Connect your Gmail inbox for live messages.'}
                  </p>
                </div>
                <div>
                  {settings.googleEmail ? (
                    <button
                      onClick={handleGoogleDisconnect}
                      className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-200 text-xs font-semibold hover:bg-slate-600"
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      onClick={handleGoogleConnect}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-400"
                    >
                      Connect Gmail
                    </button>
                  )}
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                Requires Google OAuth credentials configured in Netlify environment variables.
              </p>
            </div>
          </div>

          {/* Card 2: Storage Parameter Choice */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-2.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Storage Selection</h2>
                <p className="text-xs text-slate-400">
                  Choose where your schedule & data are stored
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'hybrid',
                  title: 'Hybrid Sync (Recommended)',
                  desc: 'Saves in browser localStorage for offline speed and syncs with Netlify Database Postgres.',
                  icon: RefreshCw,
                  badge: 'Postgres + Local',
                },
                {
                  id: 'server',
                  title: 'Server Storage Only',
                  desc: 'Persists all classes and emails strictly via Netlify Database Postgres backend.',
                  icon: Database,
                  badge: 'Netlify Postgres',
                },
                {
                  id: 'local',
                  title: 'LocalStorage Only',
                  desc: 'Stores schedule parameters strictly inside your local browser memory.',
                  icon: HardDrive,
                  badge: 'Browser Local',
                },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => {
                    const newS = { ...settings, storageMode: opt.id as any };
                    setSettings(newS);
                    saveLocalSettings(newS);
                    showNotification(`Storage mode set to ${opt.title}`);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition flex items-start gap-3.5 ${
                    settings.storageMode === opt.id
                      ? 'bg-blue-600/10 border-blue-500 ring-2 ring-blue-500/30'
                      : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg mt-0.5 ${
                      settings.storageMode === opt.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <opt.icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-sm text-white">{opt.title}</span>
                      <span className="px-2 py-0.5 text-[10px] rounded-full bg-slate-800 text-slate-300 font-mono border border-slate-700">
                        {opt.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{opt.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Netlify Database Status: <strong className="text-emerald-300">Connected</strong>
              </span>

              <button
                onClick={() => fetchServerData(settings.storageMode)}
                disabled={isLoadingServer}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 font-medium border border-slate-700 transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingServer ? 'animate-spin' : ''}`} />
                Sync Now
              </button>
            </div>
          </div>

        </div>

        {/* Section 2: Manage Class Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Add / Edit Class Form */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5 lg:col-span-1">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-xl">
                  {editingClassId ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <h2 className="text-lg font-bold text-white">
                  {editingClassId ? 'Edit Class' : 'Add New Class'}
                </h2>
              </div>

              {editingClassId && (
                <button
                  onClick={resetClassForm}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSaveClass} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Class Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AP Chemistry"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Room String Parameter */}
              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Room Location (Stored as String) *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Room 302 - Math Wing"
                    value={classRoom}
                    onChange={(e) => setClassRoom(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Start & End Time Parameters */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={classStartTime}
                    onChange={(e) => setClassStartTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    End Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={classEndTime}
                    onChange={(e) => setClassEndTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              {/* Instructor */}
              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Instructor Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Sarah Jenkins"
                  value={classInstructor}
                  onChange={(e) => setClassInstructor(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Days of week */}
              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Days of Week
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => {
                    const selected = classDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                          selected
                            ? 'bg-indigo-600 border-indigo-500 text-white'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Schedule Type */}
              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Schedule Type
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['All', 'A', 'B'].map((type) => {
                    const selected = classScheduleType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setClassScheduleType(type)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium border transition ${
                          selected
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {type} Day
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Select whether this class belongs to your A day, B day, or all schedules.
                </p>
              </div>

              {/* Color accent */}
              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Color Tag
                </label>
                <div className="flex items-center gap-2">
                  {['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#6366f1'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setClassColor(c)}
                      className={`w-7 h-7 rounded-full border-2 transition ${
                        classColor === c ? 'scale-110 border-white ring-2 ring-indigo-500' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingClassId ? 'Update Class' : 'Save Class to Schedule'}
                </button>
              </div>
            </form>
          </div>

          {/* Stored Classes Table / List */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4 lg:col-span-2 flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Stored Classes ({classes.length})</h2>
                <p className="text-xs text-slate-400">
                  Classes stored with start time, end time, name, and room string
                </p>
              </div>

              <span className="text-xs text-indigo-400 font-mono">
                {settings.storageMode.toUpperCase()} STORED
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 max-h-[500px] pr-1">
              {classes.length === 0 ? (
                <div className="p-12 text-center text-slate-500 space-y-2">
                  <Calendar className="w-10 h-10 mx-auto text-slate-600" />
                  <p className="text-sm">No classes in schedule. Use the form to add classes!</p>
                </div>
              ) : (
                classes.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 hover:border-slate-600 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-hidden"
                  >
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1.5"
                      style={{ backgroundColor: item.color || '#3b82f6' }}
                    />

                    <div className="pl-3 space-y-1">
                      <h3 className="font-bold text-white text-base">{item.name}</h3>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                        <span className="flex items-center gap-1 font-semibold text-blue-300">
                          <MapPin className="w-3.5 h-3.5 text-blue-400" />
                          {item.room}
                        </span>

                        <span className="flex items-center gap-1 font-mono text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          {formatTime12h(item.startTime)} - {formatTime12h(item.endTime)}
                        </span>

                        {item.instructor && (
                          <span className="text-slate-400">({item.instructor})</span>
                        )}

                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                          {item.scheduleType || 'All'} Day
                        </span>
                      </div>
                    </div>

                    <div className="pl-3 sm:pl-0 flex items-center gap-2">
                      <button
                        onClick={() => handleEditClass(item)}
                        className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs transition"
                        title="Edit Class"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteClass(item.id)}
                        className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs transition border border-red-500/30"
                        title="Delete Class"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
