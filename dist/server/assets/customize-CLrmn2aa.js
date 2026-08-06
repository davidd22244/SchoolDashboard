import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Settings, RotateCcw, ArrowLeft, CheckCircle2, Mail, Save, Database, RefreshCw, HardDrive, ShieldCheck, Edit2, Plus, MapPin, Calendar, Clock, Trash2 } from "lucide-react";
import { D as DEFAULT_SETTINGS, g as getLocalSettings, a as getLocalClasses, b as getLocalEmails, s as saveLocalSettings, c as saveLocalClasses, d as saveLocalEmails, H as Header, f as formatTime12h, e as DEFAULT_CLASSES, h as DEFAULT_EMAILS } from "./Header-_gAc3kcI.js";
function CustomizePage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [classes, setClasses] = useState([]);
  const [emails, setEmails] = useState([]);
  const [statusMessage, setStatusMessage] = useState(null);
  const [isLoadingServer, setIsLoadingServer] = useState(false);
  const [editingClassId, setEditingClassId] = useState(null);
  const [className, setClassName] = useState("");
  const [classRoom, setClassRoom] = useState("");
  const [classStartTime, setClassStartTime] = useState("09:00");
  const [classEndTime, setClassEndTime] = useState("10:15");
  const [classDays, setClassDays] = useState(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [classScheduleType, setClassScheduleType] = useState("All");
  const [classInstructor, setClassInstructor] = useState("");
  const [classColor, setClassColor] = useState("#3b82f6");
  useEffect(() => {
    const s = getLocalSettings();
    setSettings(s);
    setClasses(getLocalClasses());
    setEmails(getLocalEmails());
    const params = new URLSearchParams(window.location.search);
    const googleConnected = params.get("google_connected");
    const googleError = params.get("google_error");
    if (googleConnected) {
      showNotification("Google account connected successfully!");
      fetchServerData("server");
      window.history.replaceState(null, "", window.location.pathname);
    } else if (googleError) {
      showNotification("Google connection failed. Please try again.");
      window.history.replaceState(null, "", window.location.pathname);
    } else {
      fetchServerData(s.storageMode);
    }
  }, []);
  const fetchServerData = async (storageMode = "hybrid") => {
    if (storageMode === "local") return;
    setIsLoadingServer(true);
    try {
      const [resSettings, resClasses, resEmails] = await Promise.all([fetch("/api/settings").then((r) => r.ok ? r.json() : null), fetch("/api/schedule").then((r) => r.ok ? r.json() : null), fetch("/api/emails").then((r) => r.ok ? r.json() : null)]);
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
      console.warn("Server storage offline or unavailable, using local storage.", err);
    } finally {
      setIsLoadingServer(false);
    }
  };
  const showNotification = (msg) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    saveLocalSettings(settings);
    if (settings.storageMode !== "local") {
      try {
        await fetch("/api/settings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(settings)
        });
      } catch {
      }
    }
    showNotification("Email & User Profile preferences saved successfully!");
  };
  const handleGoogleDisconnect = async () => {
    const updatedSettings = {
      ...settings,
      googleEmail: void 0
    };
    setSettings(updatedSettings);
    saveLocalSettings(updatedSettings);
    if (settings.storageMode !== "local") {
      try {
        await fetch("/api/settings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ...updatedSettings,
            googleRefreshToken: null
          })
        });
      } catch {
      }
    }
    showNotification("Google account disconnected.");
  };
  const handleGoogleConnect = () => {
    window.location.href = "/api/google-auth";
  };
  const handleSaveClass = async (e) => {
    e.preventDefault();
    if (!className || !classRoom || !classStartTime || !classEndTime) {
      alert("Please fill out Class Name, Room, Start Time, and End Time");
      return;
    }
    const daysStr = classDays.length > 0 ? classDays.join(",") : "Mon,Tue,Wed,Thu,Fri";
    if (editingClassId) {
      const updatedList = classes.map((c) => c.id === editingClassId ? {
        ...c,
        name: className,
        room: classRoom,
        startTime: classStartTime,
        endTime: classEndTime,
        days: daysStr,
        scheduleType: classScheduleType,
        instructor: classInstructor,
        color: classColor
      } : c);
      setClasses(updatedList);
      saveLocalClasses(updatedList);
      if (settings.storageMode !== "local") {
        try {
          await fetch("/api/schedule", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              id: editingClassId,
              name: className,
              room: classRoom,
              startTime: classStartTime,
              endTime: classEndTime,
              days: daysStr,
              scheduleType: classScheduleType,
              instructor: classInstructor,
              color: classColor
            })
          });
        } catch {
        }
      }
      showNotification(`Class "${className}" updated!`);
    } else {
      const newId = Date.now();
      const newClass = {
        id: newId,
        name: className,
        room: classRoom,
        startTime: classStartTime,
        endTime: classEndTime,
        days: daysStr,
        scheduleType: classScheduleType,
        instructor: classInstructor,
        color: classColor
      };
      const updatedList = [...classes, newClass];
      setClasses(updatedList);
      saveLocalClasses(updatedList);
      if (settings.storageMode !== "local") {
        try {
          const res = await fetch("/api/schedule", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(newClass)
          });
          if (res.ok) {
            const serverClass = await res.json();
            if (serverClass && serverClass.id) {
              const syncedList = updatedList.map((c) => c.id === newId ? serverClass : c);
              setClasses(syncedList);
              saveLocalClasses(syncedList);
            }
          }
        } catch {
        }
      }
      showNotification(`Added new class "${className}"!`);
    }
    resetClassForm();
  };
  const resetClassForm = () => {
    setEditingClassId(null);
    setClassName("");
    setClassRoom("");
    setClassStartTime("09:00");
    setClassEndTime("10:15");
    setClassDays(["Mon", "Tue", "Wed", "Thu", "Fri"]);
    setClassScheduleType("All");
    setClassInstructor("");
    setClassColor("#3b82f6");
  };
  const handleEditClass = (item) => {
    setEditingClassId(item.id);
    setClassName(item.name);
    setClassRoom(item.room);
    setClassStartTime(item.startTime);
    setClassEndTime(item.endTime);
    setClassDays(item.days ? item.days.split(",") : []);
    setClassScheduleType(item.scheduleType || "All");
    setClassInstructor(item.instructor || "");
    setClassColor(item.color || "#3b82f6");
  };
  const handleDeleteClass = async (id) => {
    if (!confirm("Are you sure you want to delete this class?")) return;
    const updatedList = classes.filter((c) => c.id !== id);
    setClasses(updatedList);
    saveLocalClasses(updatedList);
    if (settings.storageMode !== "local") {
      try {
        await fetch(`/api/schedule?id=${id}`, {
          method: "DELETE"
        });
      } catch {
      }
    }
    showNotification("Class removed from schedule.");
  };
  const handleResetDefaults = async () => {
    if (!confirm("Reset all classes, emails, and settings to default values?")) return;
    setSettings(DEFAULT_SETTINGS);
    setClasses(DEFAULT_CLASSES);
    setEmails(DEFAULT_EMAILS);
    saveLocalSettings(DEFAULT_SETTINGS);
    saveLocalClasses(DEFAULT_CLASSES);
    saveLocalEmails(DEFAULT_EMAILS);
    if (settings.storageMode !== "local") {
      try {
        await Promise.all([fetch("/api/schedule", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            action: "reset"
          })
        }), fetch("/api/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            action: "reset"
          })
        })]);
      } catch {
      }
    }
    showNotification("Reset to default schedule, emails, and settings!");
  };
  const toggleDay = (day) => {
    if (classDays.includes(day)) {
      setClassDays(classDays.filter((d) => d !== day));
    } else {
      setClassDays([...classDays, day]);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-slate-950 text-slate-100 pb-16", children: [
    /* @__PURE__ */ jsx(Header, { settings }),
    /* @__PURE__ */ jsxs("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider", children: [
            /* @__PURE__ */ jsx(Settings, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx("span", { children: "Dashboard Customization" })
          ] }),
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-extrabold text-white tracking-tight mt-1", children: "Customize Your Parameters" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-400 mt-1", children: "Manage your email, classes, schedule times, room assignments, and choose between Local Storage and Netlify Server Storage." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxs("button", { onClick: handleResetDefaults, className: "flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition", children: [
            /* @__PURE__ */ jsx(RotateCcw, { className: "w-4 h-4 text-slate-400" }),
            "Reset Defaults"
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: () => navigate({
            to: "/"
          }), className: "flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition", children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }),
            "Back to Dashboard"
          ] })
        ] })
      ] }),
      statusMessage && /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-sm font-medium flex items-center gap-2 animate-fade-in", children: [
        /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-emerald-400 shrink-0" }),
        /* @__PURE__ */ jsx("span", { children: statusMessage })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 border-b border-slate-800 pb-4", children: [
            /* @__PURE__ */ jsx("div", { className: "p-2.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl", children: /* @__PURE__ */ jsx(Mail, { className: "w-5 h-5" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-white", children: "Student Profile & Email" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400", children: "Set the student email address displayed on your dashboard inbox" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: handleSaveSettings, className: "space-y-4 text-xs", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block font-medium text-slate-300 mb-1.5", children: "Student Name" }),
              /* @__PURE__ */ jsx("input", { type: "text", required: true, value: settings.userName, onChange: (e) => setSettings({
                ...settings,
                userName: e.target.value
              }), className: "w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 text-sm", placeholder: "e.g. Alex Morgan" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block font-medium text-slate-300 mb-1.5", children: "School Email Address" }),
              /* @__PURE__ */ jsx("input", { type: "email", required: true, value: settings.email, onChange: (e) => setSettings({
                ...settings,
                email: e.target.value
              }), className: "w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 text-sm font-mono", placeholder: "e.g. student@school.edu" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxs("button", { type: "submit", className: "w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition", children: [
              /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
              "Save Profile Settings"
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 rounded-2xl bg-slate-800 border border-slate-700 p-4 space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-[0.24em] text-slate-400", children: "Google Gmail Integration" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-200 mt-1", children: settings.googleEmail ? `Connected to ${settings.googleEmail}` : "Connect your Gmail inbox for live messages." })
              ] }),
              /* @__PURE__ */ jsx("div", { children: settings.googleEmail ? /* @__PURE__ */ jsx("button", { onClick: handleGoogleDisconnect, className: "px-3 py-1.5 rounded-lg bg-slate-700 text-slate-200 text-xs font-semibold hover:bg-slate-600", children: "Disconnect" }) : /* @__PURE__ */ jsx("button", { onClick: handleGoogleConnect, className: "px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-400", children: "Connect Gmail" }) })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-500", children: "Requires Google OAuth credentials configured in Netlify environment variables." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 border-b border-slate-800 pb-4", children: [
            /* @__PURE__ */ jsx("div", { className: "p-2.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl", children: /* @__PURE__ */ jsx(Database, { className: "w-5 h-5" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-white", children: "Storage Selection" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400", children: "Choose where your schedule & data are stored" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3", children: [{
            id: "hybrid",
            title: "Hybrid Sync (Recommended)",
            desc: "Saves in browser localStorage for offline speed and syncs with Netlify Database Postgres.",
            icon: RefreshCw,
            badge: "Postgres + Local"
          }, {
            id: "server",
            title: "Server Storage Only",
            desc: "Persists all classes and emails strictly via Netlify Database Postgres backend.",
            icon: Database,
            badge: "Netlify Postgres"
          }, {
            id: "local",
            title: "LocalStorage Only",
            desc: "Stores schedule parameters strictly inside your local browser memory.",
            icon: HardDrive,
            badge: "Browser Local"
          }].map((opt) => /* @__PURE__ */ jsxs("div", { onClick: () => {
            const newS = {
              ...settings,
              storageMode: opt.id
            };
            setSettings(newS);
            saveLocalSettings(newS);
            showNotification(`Storage mode set to ${opt.title}`);
          }, className: `p-4 rounded-xl border cursor-pointer transition flex items-start gap-3.5 ${settings.storageMode === opt.id ? "bg-blue-600/10 border-blue-500 ring-2 ring-blue-500/30" : "bg-slate-800/40 border-slate-700/60 hover:border-slate-600"}`, children: [
            /* @__PURE__ */ jsx("div", { className: `p-2 rounded-lg mt-0.5 ${settings.storageMode === opt.id ? "bg-blue-500 text-white" : "bg-slate-800 text-slate-400"}`, children: /* @__PURE__ */ jsx(opt.icon, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold text-sm text-white", children: opt.title }),
                /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 text-[10px] rounded-full bg-slate-800 text-slate-300 font-mono border border-slate-700", children: opt.badge })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 mt-1", children: opt.desc })
            ] })
          ] }, opt.id)) }),
          /* @__PURE__ */ jsxs("div", { className: "pt-2 flex items-center justify-between text-xs text-slate-400", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4 text-emerald-400" }),
              "Netlify Database Status: ",
              /* @__PURE__ */ jsx("strong", { className: "text-emerald-300", children: "Connected" })
            ] }),
            /* @__PURE__ */ jsxs("button", { onClick: () => fetchServerData(settings.storageMode), disabled: isLoadingServer, className: "flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 font-medium border border-slate-700 transition", children: [
              /* @__PURE__ */ jsx(RefreshCw, { className: `w-3.5 h-3.5 ${isLoadingServer ? "animate-spin" : ""}` }),
              "Sync Now"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5 lg:col-span-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-slate-800 pb-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ jsx("div", { className: "p-2 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-xl", children: editingClassId ? /* @__PURE__ */ jsx(Edit2, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx(Plus, { className: "w-5 h-5" }) }),
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-white", children: editingClassId ? "Edit Class" : "Add New Class" })
            ] }),
            editingClassId && /* @__PURE__ */ jsx("button", { onClick: resetClassForm, className: "text-xs text-slate-400 hover:text-white", children: "Cancel Edit" })
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: handleSaveClass, className: "space-y-4 text-xs", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block font-medium text-slate-300 mb-1", children: "Class Name *" }),
              /* @__PURE__ */ jsx("input", { type: "text", required: true, placeholder: "e.g. AP Chemistry", value: className, onChange: (e) => setClassName(e.target.value), className: "w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block font-medium text-slate-300 mb-1", children: "Room Location (Stored as String) *" }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 absolute left-3 top-2.5 text-slate-400" }),
                /* @__PURE__ */ jsx("input", { type: "text", required: true, placeholder: "e.g. Room 302 - Math Wing", value: classRoom, onChange: (e) => setClassRoom(e.target.value), className: "w-full pl-9 pr-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block font-medium text-slate-300 mb-1", children: "Start Time *" }),
                /* @__PURE__ */ jsx("input", { type: "time", required: true, value: classStartTime, onChange: (e) => setClassStartTime(e.target.value), className: "w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 font-mono" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block font-medium text-slate-300 mb-1", children: "End Time *" }),
                /* @__PURE__ */ jsx("input", { type: "time", required: true, value: classEndTime, onChange: (e) => setClassEndTime(e.target.value), className: "w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 font-mono" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block font-medium text-slate-300 mb-1", children: "Instructor Name" }),
              /* @__PURE__ */ jsx("input", { type: "text", placeholder: "e.g. Dr. Sarah Jenkins", value: classInstructor, onChange: (e) => setClassInstructor(e.target.value), className: "w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block font-medium text-slate-300 mb-1", children: "Days of Week" }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: ["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => {
                const selected = classDays.includes(day);
                return /* @__PURE__ */ jsx("button", { type: "button", onClick: () => toggleDay(day), className: `px-2.5 py-1 rounded-lg text-xs font-medium border transition ${selected ? "bg-indigo-600 border-indigo-500 text-white" : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700"}`, children: day }, day);
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block font-medium text-slate-300 mb-1", children: "Schedule Type" }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: ["All", "A", "B"].map((type) => {
                const selected = classScheduleType === type;
                return /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setClassScheduleType(type), className: `px-3 py-1 rounded-lg text-xs font-medium border transition ${selected ? "bg-emerald-600 border-emerald-500 text-white" : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700"}`, children: [
                  type,
                  " Day"
                ] }, type);
              }) }),
              /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-500 mt-2", children: "Select whether this class belongs to your A day, B day, or all schedules." })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block font-medium text-slate-300 mb-1", children: "Color Tag" }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: ["#3b82f6", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b", "#6366f1"].map((c) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setClassColor(c), className: `w-7 h-7 rounded-full border-2 transition ${classColor === c ? "scale-110 border-white ring-2 ring-indigo-500" : "border-transparent"}`, style: {
                backgroundColor: c
              } }, c)) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxs("button", { type: "submit", className: "w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2", children: [
              /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
              editingClassId ? "Update Class" : "Save Class to Schedule"
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4 lg:col-span-2 flex flex-col", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-slate-800 pb-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("h2", { className: "text-lg font-bold text-white", children: [
                "Stored Classes (",
                classes.length,
                ")"
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400", children: "Classes stored with start time, end time, name, and room string" })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "text-xs text-indigo-400 font-mono", children: [
              settings.storageMode.toUpperCase(),
              " STORED"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto space-y-3 max-h-[500px] pr-1", children: classes.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "p-12 text-center text-slate-500 space-y-2", children: [
            /* @__PURE__ */ jsx(Calendar, { className: "w-10 h-10 mx-auto text-slate-600" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm", children: "No classes in schedule. Use the form to add classes!" })
          ] }) : classes.map((item) => /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 hover:border-slate-600 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-hidden", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute left-0 top-0 bottom-0 w-1.5", style: {
              backgroundColor: item.color || "#3b82f6"
            } }),
            /* @__PURE__ */ jsxs("div", { className: "pl-3 space-y-1", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-white text-base", children: item.name }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3 text-xs text-slate-300", children: [
                /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 font-semibold text-blue-300", children: [
                  /* @__PURE__ */ jsx(MapPin, { className: "w-3.5 h-3.5 text-blue-400" }),
                  item.room
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 font-mono text-slate-400", children: [
                  /* @__PURE__ */ jsx(Clock, { className: "w-3.5 h-3.5" }),
                  formatTime12h(item.startTime),
                  " - ",
                  formatTime12h(item.endTime)
                ] }),
                item.instructor && /* @__PURE__ */ jsxs("span", { className: "text-slate-400", children: [
                  "(",
                  item.instructor,
                  ")"
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700", children: [
                  item.scheduleType || "All",
                  " Day"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pl-3 sm:pl-0 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("button", { onClick: () => handleEditClass(item), className: "p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs transition", title: "Edit Class", children: /* @__PURE__ */ jsx(Edit2, { className: "w-4 h-4" }) }),
              /* @__PURE__ */ jsx("button", { onClick: () => handleDeleteClass(item.id), className: "p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs transition border border-red-500/30", title: "Delete Class", children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }) })
            ] })
          ] }, item.id)) })
        ] })
      ] })
    ] })
  ] });
}
export {
  CustomizePage as component
};
