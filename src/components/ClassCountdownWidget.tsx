import React, { useState, useEffect } from 'react';
import {
  Clock,
  MapPin,
  User,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  CalendarDays
} from 'lucide-react';
import { ClassScheduleItem } from '../lib/default-data';
import { calculateClassStatus, ClassTimeStatus, formatTime12h } from '../lib/store';

interface ClassCountdownWidgetProps {
  classes: ClassScheduleItem[];
  scheduleType?: string;
}

export function ClassCountdownWidget({ classes, scheduleType = 'All' }: ClassCountdownWidgetProps) {
  const [simulatedTime, setSimulatedTime] = useState<string>(''); // e.g. "08:45"
  const [useSimulation, setSimulated] = useState<boolean>(false);
  const [now, setNow] = useState<Date>(new Date());

  // Tick every second
  useEffect(() => {
    const timer = setInterval(() => {
      if (!useSimulation || !simulatedTime) {
        setNow(new Date());
        return;
      }

      const [h, m] = simulatedTime.split(':').map(Number);
      const simDate = new Date();
      simDate.setHours(h || 0, m || 0, simDate.getSeconds());
      setNow(simDate);
    }, 1000);

    return () => clearInterval(timer);
  }, [useSimulation, simulatedTime]);

  // Handle simulation time change
  const handleTimeSim = (timeVal: string) => {
    setSimulatedTime(timeVal);
    setSimulated(true);
    if (timeVal) {
      const [h, m] = timeVal.split(':').map(Number);
      const simDate = new Date();
      simDate.setHours(h || 0, m || 0, 0);
      setNow(simDate);
    }
  };

  const resetToRealTime = () => {
    setSimulated(false);
    setSimulatedTime('');
    setNow(new Date());
  };

  const timeStatus: ClassTimeStatus = calculateClassStatus(classes, now, scheduleType);
  const { currentClass, nextClass, status, percentComplete, formattedRemaining } = timeStatus;

  // Formatting clock time
  const currentTimeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl shadow-xl border border-indigo-900/50 p-6 text-white relative overflow-hidden">
      
      {/* Subtle Background Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Widget Header & Real Time Display */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-indigo-900/40">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/30 text-blue-400">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Class Countdown
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time timer & active schedule status
          </p>
        </div>

        {/* Current Time Badge & Simulation controls */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-400">Current Time</div>
            <div className="font-mono text-lg font-bold text-blue-300">
              {currentTimeString}
            </div>
          </div>

          {useSimulation && (
            <span className="px-2.5 py-1 text-xs rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
              Simulated
            </span>
          )}
        </div>
      </div>

      {/* Countdown Card Body */}
      {status === 'in_class' && currentClass && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between bg-slate-800/60 rounded-xl p-5 border border-indigo-500/30 backdrop-blur-sm gap-4">
            
            {/* Active Class Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  CLASS IN PROGRESS
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {formatTime12h(currentClass.startTime)} - {formatTime12h(currentClass.endTime)}
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-white tracking-tight">
                {currentClass.name}
              </h3>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                <div className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1 rounded-lg border border-slate-700/50">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="font-medium text-blue-200">{currentClass.room}</span>
                </div>
                {currentClass.instructor && (
                  <div className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1 rounded-lg border border-slate-700/50">
                    <User className="w-4 h-4 text-indigo-400" />
                    <span>{currentClass.instructor}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Huge Remaining Time Display */}
            <div className="flex flex-col items-start md:items-end justify-center bg-slate-900/80 p-4 rounded-xl border border-indigo-500/20 min-w-[200px]">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-medium mb-1">
                Time Until End of Class
              </span>
              <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">
                {formattedRemaining}
              </div>
              <span className="text-xs text-emerald-400 mt-1 font-medium">
                {percentComplete}% Completed
              </span>
            </div>

          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>Start ({formatTime12h(currentClass.startTime)})</span>
              <span>{percentComplete}% completed</span>
              <span>End ({formatTime12h(currentClass.endTime)})</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
              <div
                className="bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-1000 shadow-sm shadow-cyan-500/50"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Between Classes or Before School */}
      {(status === 'between_classes' || status === 'before_school') && nextClass && (
        <div className="bg-slate-800/60 rounded-xl p-5 border border-blue-500/30 backdrop-blur-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <Clock className="w-3.5 h-3.5" />
                {status === 'before_school' ? 'BEFORE SCHOOL' : 'NEXT CLASS COUNTDOWN'}
              </span>
              <h3 className="text-xl font-bold text-white mt-2">
                Up Next: {nextClass.name}
              </h3>
            </div>

            <div className="bg-slate-900/80 px-4 py-2 rounded-xl border border-amber-500/20 text-left sm:text-right">
              <div className="text-xs text-slate-400">Starts In</div>
              <div className="text-2xl font-mono font-bold text-amber-300">
                {formattedRemaining}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300 bg-slate-900/50 p-3 rounded-lg">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span className="font-medium text-white">{nextClass.room}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>
                {formatTime12h(nextClass.startTime)} - {formatTime12h(nextClass.endTime)}
              </span>
            </div>
            {nextClass.instructor && (
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-indigo-400" />
                <span>{nextClass.instructor}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* After School */}
      {status === 'after_school' && (
        <div className="bg-slate-800/60 rounded-xl p-6 border border-emerald-500/30 text-center space-y-3">
          <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">School Day Complete!</h3>
          <p className="text-sm text-slate-300 max-w-md mx-auto">
            All your scheduled classes for today are done. Enjoy your evening and check your homework/upcoming schedule below!
          </p>
        </div>
      )}

      {/* No Classes Scheduled */}
      {status === 'no_classes_today' && (
        <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700 text-center space-y-3">
          <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/40 rounded-full flex items-center justify-center mx-auto text-blue-400">
            <CalendarDays className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">No Classes Listed</h3>
          <p className="text-sm text-slate-300">
            You don't have any classes added yet. Go to the Customize page to add your classes and schedule!
          </p>
        </div>
      )}

      {/* Time Simulation Tool (Super helpful for testing user's schedule at any time) */}
      <div className="mt-6 pt-4 border-t border-indigo-900/40 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Test Countdown at any time:</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleTimeSim('08:45')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            08:45 AM (Calculus)
          </button>
          <button
            onClick={() => handleTimeSim('10:30')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            10:30 AM (Physics)
          </button>
          <button
            onClick={() => handleTimeSim('12:50')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            12:50 PM (Lunch)
          </button>
          
          <input
            type="time"
            value={simulatedTime}
            onChange={(e) => handleTimeSim(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-xs text-white focus:outline-none focus:border-blue-500"
          />

          {useSimulation && (
            <button
              onClick={resetToRealTime}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 transition"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
