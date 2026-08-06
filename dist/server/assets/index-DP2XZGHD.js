import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Clock, MapPin, User, CheckCircle2, CalendarDays, Sparkles, RotateCcw, Mail, Plus, Search, Inbox, X, Trash2, Send, Calendar, BookOpen, GraduationCap, Settings, ArrowRight, Database } from "lucide-react";
import { i as calculateClassStatus, f as formatTime12h, t as timeStringToMinutes, D as DEFAULT_SETTINGS, g as getLocalSettings, a as getLocalClasses, b as getLocalEmails, s as saveLocalSettings, c as saveLocalClasses, d as saveLocalEmails, H as Header } from "./Header-_gAc3kcI.js";
function ClassCountdownWidget({ classes, scheduleType = "All" }) {
  const [simulatedTime, setSimulatedTime] = useState("");
  const [useSimulation, setSimulated] = useState(false);
  const [now, setNow] = useState(/* @__PURE__ */ new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      if (!useSimulation || !simulatedTime) {
        setNow(/* @__PURE__ */ new Date());
        return;
      }
      const [h, m] = simulatedTime.split(":").map(Number);
      const simDate = /* @__PURE__ */ new Date();
      simDate.setHours(h || 0, m || 0, simDate.getSeconds());
      setNow(simDate);
    }, 1e3);
    return () => clearInterval(timer);
  }, [useSimulation, simulatedTime]);
  const handleTimeSim = (timeVal) => {
    setSimulatedTime(timeVal);
    setSimulated(true);
    if (timeVal) {
      const [h, m] = timeVal.split(":").map(Number);
      const simDate = /* @__PURE__ */ new Date();
      simDate.setHours(h || 0, m || 0, 0);
      setNow(simDate);
    }
  };
  const resetToRealTime = () => {
    setSimulated(false);
    setSimulatedTime("");
    setNow(/* @__PURE__ */ new Date());
  };
  const timeStatus = calculateClassStatus(classes, now, scheduleType);
  const { currentClass, nextClass, status, percentComplete, formattedRemaining } = timeStatus;
  const currentTimeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  return /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl shadow-xl border border-indigo-900/50 p-6 text-white relative overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute -top-24 -right-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" }),
    /* @__PURE__ */ jsx("div", { className: "absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-indigo-900/40", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2 rounded-lg bg-blue-500/20 border border-blue-400/30 text-blue-400", children: /* @__PURE__ */ jsx(Clock, { className: "w-5 h-5 animate-pulse" }) }),
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold tracking-tight text-white", children: "Class Countdown" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 mt-1", children: "Real-time timer & active schedule status" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-400", children: "Current Time" }),
          /* @__PURE__ */ jsx("div", { className: "font-mono text-lg font-bold text-blue-300", children: currentTimeString })
        ] }),
        useSimulation && /* @__PURE__ */ jsx("span", { className: "px-2.5 py-1 text-xs rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium", children: "Simulated" })
      ] })
    ] }),
    status === "in_class" && currentClass && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between bg-slate-800/60 rounded-xl p-5 border border-indigo-500/30 backdrop-blur-sm gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40", children: [
              /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-400 animate-ping" }),
              "CLASS IN PROGRESS"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "text-xs text-slate-400 font-mono", children: [
              formatTime12h(currentClass.startTime),
              " - ",
              formatTime12h(currentClass.endTime)
            ] })
          ] }),
          /* @__PURE__ */ jsx("h3", { className: "text-2xl font-extrabold text-white tracking-tight", children: currentClass.name }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-4 text-sm text-slate-300", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 bg-slate-900/60 px-3 py-1 rounded-lg border border-slate-700/50", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 text-blue-400" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium text-blue-200", children: currentClass.room })
            ] }),
            currentClass.instructor && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 bg-slate-900/60 px-3 py-1 rounded-lg border border-slate-700/50", children: [
              /* @__PURE__ */ jsx(User, { className: "w-4 h-4 text-indigo-400" }),
              /* @__PURE__ */ jsx("span", { children: currentClass.instructor })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-start md:items-end justify-center bg-slate-900/80 p-4 rounded-xl border border-indigo-500/20 min-w-[200px]", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs uppercase tracking-wider text-slate-400 font-medium mb-1", children: "Time Until End of Class" }),
          /* @__PURE__ */ jsx("div", { className: "text-3xl sm:text-4xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300", children: formattedRemaining }),
          /* @__PURE__ */ jsxs("span", { className: "text-xs text-emerald-400 mt-1 font-medium", children: [
            percentComplete,
            "% Completed"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-slate-400 font-mono", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            "Start (",
            formatTime12h(currentClass.startTime),
            ")"
          ] }),
          /* @__PURE__ */ jsxs("span", { children: [
            percentComplete,
            "% completed"
          ] }),
          /* @__PURE__ */ jsxs("span", { children: [
            "End (",
            formatTime12h(currentClass.endTime),
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-1000 shadow-sm shadow-cyan-500/50",
            style: { width: `${percentComplete}%` }
          }
        ) })
      ] })
    ] }),
    (status === "between_classes" || status === "before_school") && nextClass && /* @__PURE__ */ jsxs("div", { className: "bg-slate-800/60 rounded-xl p-5 border border-blue-500/30 backdrop-blur-sm space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40", children: [
            /* @__PURE__ */ jsx(Clock, { className: "w-3.5 h-3.5" }),
            status === "before_school" ? "BEFORE SCHOOL" : "NEXT CLASS COUNTDOWN"
          ] }),
          /* @__PURE__ */ jsxs("h3", { className: "text-xl font-bold text-white mt-2", children: [
            "Up Next: ",
            nextClass.name
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-slate-900/80 px-4 py-2 rounded-xl border border-amber-500/20 text-left sm:text-right", children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-400", children: "Starts In" }),
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-mono font-bold text-amber-300", children: formattedRemaining })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-4 text-sm text-slate-300 bg-slate-900/50 p-3 rounded-lg", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 text-amber-400" }),
          /* @__PURE__ */ jsx("span", { className: "font-medium text-white", children: nextClass.room })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4 text-slate-400" }),
          /* @__PURE__ */ jsxs("span", { children: [
            formatTime12h(nextClass.startTime),
            " - ",
            formatTime12h(nextClass.endTime)
          ] })
        ] }),
        nextClass.instructor && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx(User, { className: "w-4 h-4 text-indigo-400" }),
          /* @__PURE__ */ jsx("span", { children: nextClass.instructor })
        ] })
      ] })
    ] }),
    status === "after_school" && /* @__PURE__ */ jsxs("div", { className: "bg-slate-800/60 rounded-xl p-6 border border-emerald-500/30 text-center space-y-3", children: [
      /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "w-6 h-6" }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white", children: "School Day Complete!" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-300 max-w-md mx-auto", children: "All your scheduled classes for today are done. Enjoy your evening and check your homework/upcoming schedule below!" })
    ] }),
    status === "no_classes_today" && /* @__PURE__ */ jsxs("div", { className: "bg-slate-800/60 rounded-xl p-6 border border-slate-700 text-center space-y-3", children: [
      /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-blue-500/20 border border-blue-500/40 rounded-full flex items-center justify-center mx-auto text-blue-400", children: /* @__PURE__ */ jsx(CalendarDays, { className: "w-6 h-6" }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white", children: "No Classes Listed" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-300", children: "You don't have any classes added yet. Go to the Customize page to add your classes and schedule!" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 pt-4 border-t border-indigo-900/40 flex flex-wrap items-center justify-between gap-3 text-xs", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-slate-400", children: [
        /* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5 text-blue-400" }),
        /* @__PURE__ */ jsx("span", { children: "Test Countdown at any time:" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleTimeSim("08:45"),
            className: "px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition",
            children: "08:45 AM (Calculus)"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleTimeSim("10:30"),
            className: "px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition",
            children: "10:30 AM (Physics)"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleTimeSim("12:50"),
            className: "px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition",
            children: "12:50 PM (Lunch)"
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "time",
            value: simulatedTime,
            onChange: (e) => handleTimeSim(e.target.value),
            className: "bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-xs text-white focus:outline-none focus:border-blue-500"
          }
        ),
        useSimulation && /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: resetToRealTime,
            className: "flex items-center gap-1 px-2.5 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 transition",
            children: [
              /* @__PURE__ */ jsx(RotateCcw, { className: "w-3 h-3" }),
              "Reset"
            ]
          }
        )
      ] })
    ] })
  ] });
}
function EmailsWidget({
  emails,
  userEmail,
  onUpdateEmail,
  onDeleteEmail,
  onAddEmail
}) {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [newSender, setNewSender] = useState("Guidance Counselor");
  const [newSenderEmail, setNewSenderEmail] = useState("guidance@lincolnhigh.edu");
  const [newSubject, setNewSubject] = useState("College Application Workshop Next Week");
  const [newBody, setNewBody] = useState("Hello students, Join us for a step-by-step application walkthrough in the Auditorium at 3 PM on Tuesday.");
  const [newCategory, setNewCategory] = useState("announcement");
  const unreadCount = emails.filter((e) => !e.isRead).length;
  const filteredEmails = emails.filter((e) => {
    const matchesCategory = filterCategory === "all" || e.category === filterCategory;
    const matchesSearch = e.subject.toLowerCase().includes(searchQuery.toLowerCase()) || e.sender.toLowerCase().includes(searchQuery.toLowerCase()) || e.body.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  const handleOpenEmail = (email) => {
    setSelectedEmail(email);
    if (!email.isRead) {
      onUpdateEmail({ ...email, isRead: true });
    }
  };
  const handleToggleRead = (email, e) => {
    e.stopPropagation();
    onUpdateEmail({ ...email, isRead: !email.isRead });
  };
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newSubject || !newBody) return;
    onAddEmail({
      sender: newSender || "School Admin",
      senderEmail: newSenderEmail || "admin@school.edu",
      subject: newSubject,
      body: newBody,
      date: "Just now",
      isRead: false,
      category: newCategory
    });
    setShowCompose(false);
    setNewSubject("");
    setNewBody("");
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[560px]", children: [
    /* @__PURE__ */ jsxs("div", { className: "p-5 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsx("div", { className: "p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100", children: /* @__PURE__ */ jsx(Mail, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-slate-900", children: "My Emails" }),
            unreadCount > 0 ? /* @__PURE__ */ jsxs("span", { className: "px-2 py-0.5 rounded-full bg-blue-600 text-white text-xs font-bold shadow-xs", children: [
              unreadCount,
              " new"
            ] }) : /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-xs font-medium", children: "All read" })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500", children: [
            "Inbox for ",
            userEmail
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setShowCompose(true),
          className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition",
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx("span", { children: "New Email" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-3 border-b border-slate-100 bg-white space-y-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(Search, { className: "w-4 h-4 absolute left-3 top-2.5 text-slate-400" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Search emails or subject...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: "w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 overflow-x-auto text-xs pb-1", children: ["all", "inbox", "homework", "announcement"].map((cat) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setFilterCategory(cat),
          className: `px-2.5 py-1 rounded-md capitalize font-medium transition ${filterCategory === cat ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"}`,
          children: cat
        },
        cat
      )) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto divide-y divide-slate-100", children: filteredEmails.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "p-8 text-center text-slate-400 space-y-2", children: [
      /* @__PURE__ */ jsx(Inbox, { className: "w-8 h-8 mx-auto text-slate-300" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: "No emails found" })
    ] }) : filteredEmails.map((email) => /* @__PURE__ */ jsxs(
      "div",
      {
        onClick: () => handleOpenEmail(email),
        className: `p-3.5 hover:bg-slate-50 cursor-pointer transition flex items-start gap-3 ${!email.isRead ? "bg-blue-50/40 border-l-4 border-l-blue-600" : ""}`,
        children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: `w-2 h-2 rounded-full mt-2 shrink-0 ${!email.isRead ? "bg-blue-600" : "bg-transparent"}`
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: `text-xs font-semibold truncate ${!email.isRead ? "text-slate-900" : "text-slate-600"}`,
                  children: email.sender
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400 shrink-0 font-mono", children: email.date })
            ] }),
            /* @__PURE__ */ jsx("div", { className: `text-xs truncate ${!email.isRead ? "font-bold text-slate-900" : "text-slate-700"}`, children: email.subject }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 truncate mt-0.5", children: email.body })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 opacity-0 hover:opacity-100 transition shrink-0", children: /* @__PURE__ */ jsx(
            "button",
            {
              onClick: (e) => handleToggleRead(email, e),
              title: email.isRead ? "Mark as Unread" : "Mark as Read",
              className: "p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-200",
              children: /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5" })
            }
          ) })
        ]
      },
      email.id
    )) }),
    selectedEmail && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between border-b border-slate-100 pb-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 text-[10px] rounded font-semibold uppercase bg-slate-100 text-slate-700 border border-slate-200", children: selectedEmail.category }),
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-slate-900 mt-2", children: selectedEmail.subject })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setSelectedEmail(null),
            className: "p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700",
            children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "font-semibold text-slate-800", children: selectedEmail.sender }),
          /* @__PURE__ */ jsx("div", { className: "text-slate-400", children: selectedEmail.senderEmail })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-right font-mono text-slate-400", children: selectedEmail.date })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "text-sm text-slate-700 leading-relaxed whitespace-pre-wrap pt-2", children: selectedEmail.body }),
      /* @__PURE__ */ jsxs("div", { className: "border-t border-slate-100 pt-4 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => {
              onDeleteEmail(selectedEmail.id);
              setSelectedEmail(null);
            },
            className: "flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-medium",
            children: [
              /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }),
              "Delete Email"
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setSelectedEmail(null),
            className: "px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800",
            children: "Close"
          }
        )
      ] })
    ] }) }),
    showCompose && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50", children: /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: handleAddSubmit,
        className: "bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 space-y-4",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-slate-100 pb-3", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-lg font-bold text-slate-900 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Send, { className: "w-4 h-4 text-blue-600" }),
              "Add Incoming Email"
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setShowCompose(false),
                className: "text-slate-400 hover:text-slate-600",
                children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 text-xs", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block font-medium text-slate-700 mb-1", children: "Sender Name" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  required: true,
                  value: newSender,
                  onChange: (e) => setNewSender(e.target.value),
                  className: "w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block font-medium text-slate-700 mb-1", children: "Sender Email" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "email",
                  required: true,
                  value: newSenderEmail,
                  onChange: (e) => setNewSenderEmail(e.target.value),
                  className: "w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs", children: [
            /* @__PURE__ */ jsx("label", { className: "block font-medium text-slate-700 mb-1", children: "Subject" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                required: true,
                value: newSubject,
                onChange: (e) => setNewSubject(e.target.value),
                className: "w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs", children: [
            /* @__PURE__ */ jsx("label", { className: "block font-medium text-slate-700 mb-1", children: "Category" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: newCategory,
                onChange: (e) => setNewCategory(e.target.value),
                className: "w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "inbox", children: "Inbox" }),
                  /* @__PURE__ */ jsx("option", { value: "homework", children: "Homework" }),
                  /* @__PURE__ */ jsx("option", { value: "announcement", children: "Announcement" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs", children: [
            /* @__PURE__ */ jsx("label", { className: "block font-medium text-slate-700 mb-1", children: "Email Content" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                rows: 4,
                required: true,
                value: newBody,
                onChange: (e) => setNewBody(e.target.value),
                className: "w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2 pt-2 border-t border-slate-100", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setShowCompose(false),
                className: "px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                className: "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs",
                children: "Add Email"
              }
            )
          ] })
        ]
      }
    ) })
  ] });
}
function UpcomingScheduleWidget({ classes, activeClassId, scheduleType, onScheduleTypeChange }) {
  const [selectedDay, setSelectedDay] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const daysList = ["All", "Mon", "Tue", "Wed", "Thu", "Fri"];
  const scheduleTypes = ["All", "A", "B"];
  const filteredClasses = [...classes].filter((c) => {
    const matchesDay = selectedDay === "All" || c.days.includes(selectedDay);
    const matchesType = scheduleType === "All" || c.scheduleType === scheduleType;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.room.toLowerCase().includes(searchQuery.toLowerCase()) || c.instructor && c.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDay && matchesType && matchesSearch;
  }).sort((a, b) => timeStringToMinutes(a.startTime) - timeStringToMinutes(b.startTime));
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[560px]", children: [
    /* @__PURE__ */ jsxs("div", { className: "p-5 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsx("div", { className: "p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100", children: /* @__PURE__ */ jsx(Calendar, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-slate-900", children: "Upcoming Schedule" }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500", children: [
            classes.length,
            " total classes in schedule"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium", children: daysList.map((day) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setSelectedDay(day),
            className: `px-2.5 py-1 rounded-md transition ${selectedDay === day ? "bg-white text-indigo-600 font-bold shadow-xs" : "text-slate-600 hover:text-slate-900"}`,
            children: day
          },
          day
        )) }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium", children: scheduleTypes.map((type) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => onScheduleTypeChange(type),
            className: `px-2.5 py-1 rounded-md transition ${scheduleType === type ? "bg-white text-slate-900 font-bold shadow-xs" : "text-slate-600 hover:text-slate-900"}`,
            children: [
              type,
              " Day"
            ]
          },
          type
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "p-3 border-b border-slate-100 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(Search, { className: "w-4 h-4 absolute left-3 top-2.5 text-slate-400" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "Search class name, room or instructor...",
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value),
          className: "w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-4 space-y-3", children: filteredClasses.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "p-8 text-center text-slate-400 space-y-2", children: [
      /* @__PURE__ */ jsx(BookOpen, { className: "w-8 h-8 mx-auto text-slate-300" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: "No classes found for this filter" })
    ] }) : filteredClasses.map((item) => {
      const isActive = activeClassId === item.id;
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: `p-4 rounded-xl border transition-all relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isActive ? "bg-indigo-50/80 border-indigo-300 shadow-md ring-2 ring-indigo-500/20" : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs"}`,
          children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "absolute left-0 top-0 bottom-0 w-1.5",
                style: { backgroundColor: item.color || "#3b82f6" }
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "pl-2 space-y-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900 text-base tracking-tight", children: item.name }),
                isActive && /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-xs", children: "Active Now" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 font-semibold text-indigo-900", children: [
                  /* @__PURE__ */ jsx(MapPin, { className: "w-3.5 h-3.5 text-indigo-500" }),
                  /* @__PURE__ */ jsx("span", { children: item.room })
                ] }),
                item.instructor && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-slate-500", children: [
                  /* @__PURE__ */ jsx(User, { className: "w-3.5 h-3.5 text-slate-400" }),
                  /* @__PURE__ */ jsx("span", { children: item.instructor })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pl-2 sm:pl-0 sm:text-right shrink-0 space-y-1 border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center sm:justify-end gap-1 font-mono font-bold text-xs text-slate-800", children: [
                /* @__PURE__ */ jsx(Clock, { className: "w-3.5 h-3.5 text-slate-400" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  formatTime12h(item.startTime),
                  " - ",
                  formatTime12h(item.endTime)
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center sm:justify-end gap-1", children: [
                item.scheduleType && /* @__PURE__ */ jsxs("span", { className: "px-1.5 py-0.5 text-[10px] rounded bg-indigo-50 text-indigo-700 font-medium border border-indigo-100", children: [
                  item.scheduleType,
                  " Day"
                ] }),
                item.days.split(",").map((d) => /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "px-1.5 py-0.5 text-[10px] rounded bg-slate-100 text-slate-600 font-medium border border-slate-200",
                    children: d
                  },
                  d
                ))
              ] })
            ] })
          ]
        },
        item.id
      );
    }) })
  ] });
}
function SchoolDashboard() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [classes, setClasses] = useState([]);
  const [emails, setEmails] = useState([]);
  const [scheduleType, setScheduleType] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const s = getLocalSettings();
    setSettings(s);
    setClasses(getLocalClasses());
    setEmails(getLocalEmails());
    setIsLoading(false);
    fetchServerData(s.storageMode, s.googleEmail);
  }, []);
  const fetchServerData = async (storageMode = "hybrid", googleEmailToUse) => {
    let latestGoogleEmail = googleEmailToUse;
    let fetchedSettings = null;
    if (storageMode !== "local") {
      try {
        const [resSettings, resClasses, resEmails] = await Promise.all([fetch("/api/settings").then((r) => r.ok ? r.json() : null), fetch("/api/schedule").then((r) => r.ok ? r.json() : null), fetch("/api/emails").then((r) => r.ok ? r.json() : null)]);
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
      }
    }
    if (fetchedSettings?.googleEmail || latestGoogleEmail) {
      try {
        const gmailRes = await fetch("/api/gmail");
        if (gmailRes.ok) {
          const gmailEmails = await gmailRes.json();
          if (Array.isArray(gmailEmails) && gmailEmails.length > 0) {
            setEmails(gmailEmails);
            saveLocalEmails(gmailEmails);
          }
        }
      } catch {
      }
    }
  };
  const handleUpdateEmail = async (updatedEmail) => {
    const newList = emails.map((e) => e.id === updatedEmail.id ? updatedEmail : e);
    setEmails(newList);
    saveLocalEmails(newList);
    if (settings.storageMode === "local") return;
    try {
      await fetch("/api/emails", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedEmail)
      });
    } catch {
    }
  };
  const handleDeleteEmail = async (id) => {
    const newList = emails.filter((e) => e.id !== id);
    setEmails(newList);
    saveLocalEmails(newList);
    if (settings.storageMode === "local") return;
    try {
      await fetch(`/api/emails?id=${id}`, {
        method: "DELETE"
      });
    } catch {
    }
  };
  const handleAddEmail = async (newEmailData) => {
    const tempId = Date.now();
    const tempEmail = {
      ...newEmailData,
      id: tempId
    };
    const newList = [tempEmail, ...emails];
    setEmails(newList);
    saveLocalEmails(newList);
    if (settings.storageMode === "local") return;
    try {
      const res = await fetch("/api/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newEmailData)
      });
      if (res.ok) {
        const created = await res.json();
        if (created && created.id) {
          const synced = newList.map((e) => e.id === tempId ? created : e);
          setEmails(synced);
          saveLocalEmails(synced);
        }
      }
    } catch {
    }
  };
  const classStatus = calculateClassStatus(classes);
  const activeClassId = classStatus.currentClass ? classStatus.currentClass.id : null;
  const unreadEmailCount = emails.filter((e) => !e.isRead).length;
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-slate-950 text-slate-100 pb-16", children: [
    /* @__PURE__ */ jsx(Header, { settings }),
    /* @__PURE__ */ jsxs("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider", children: [
            /* @__PURE__ */ jsx(GraduationCap, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx("span", { children: "Student Portal" })
          ] }),
          /* @__PURE__ */ jsxs("h1", { className: "text-3xl font-extrabold text-white tracking-tight mt-1", children: [
            "Welcome back, ",
            settings.userName || "Student"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-400 mt-1", children: "Here is your active school countdown, emails, and upcoming schedule parameters." })
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: () => navigate({
          to: "/customize"
        }), className: "flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition", children: [
          /* @__PURE__ */ jsx(Settings, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsx("span", { children: "Customize Parameters" }),
          /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "p-3 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30", children: /* @__PURE__ */ jsx(Clock, { className: "w-6 h-6" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-400 font-medium", children: "Status" }),
            /* @__PURE__ */ jsx("div", { className: "text-sm font-bold text-white capitalize", children: classStatus.status.replace("_", " ") })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "p-3 bg-indigo-500/20 text-indigo-400 rounded-lg border border-indigo-500/30", children: /* @__PURE__ */ jsx(BookOpen, { className: "w-6 h-6" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-400 font-medium", children: "Total Classes" }),
            /* @__PURE__ */ jsxs("div", { className: "text-lg font-bold text-white", children: [
              classes.length,
              " Courses Scheduled"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "p-3 bg-cyan-500/20 text-cyan-400 rounded-lg border border-cyan-500/30", children: /* @__PURE__ */ jsx(Mail, { className: "w-6 h-6" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-400 font-medium", children: "Emails" }),
            /* @__PURE__ */ jsxs("div", { className: "text-lg font-bold text-white", children: [
              unreadEmailCount,
              " Unread Emails"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "p-3 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30", children: /* @__PURE__ */ jsx(Database, { className: "w-6 h-6" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-400 font-medium", children: "Storage Mode" }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm font-bold text-emerald-300 capitalize", children: [
              settings.storageMode,
              " Storage"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(ClassCountdownWidget, { classes, scheduleType }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ jsx(EmailsWidget, { emails, userEmail: settings.googleEmail || settings.email, onUpdateEmail: handleUpdateEmail, onDeleteEmail: handleDeleteEmail, onAddEmail: handleAddEmail }),
        /* @__PURE__ */ jsx(UpcomingScheduleWidget, { classes, activeClassId, scheduleType, onScheduleTypeChange: setScheduleType })
      ] })
    ] })
  ] });
}
export {
  SchoolDashboard as component
};
