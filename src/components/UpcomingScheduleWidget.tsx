import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Search,
  ChevronRight,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { ClassScheduleItem } from '../lib/default-data';
import { formatTime12h, timeStringToMinutes } from '../lib/store';

interface UpcomingScheduleWidgetProps {
  classes: ClassScheduleItem[];
  activeClassId?: number | null;
  scheduleType: string;
  onScheduleTypeChange: (type: string) => void;
}

export function UpcomingScheduleWidget({ classes, activeClassId, scheduleType, onScheduleTypeChange }: UpcomingScheduleWidgetProps) {
  const [selectedDay, setSelectedDay] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const daysList = ['All', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const scheduleTypes = ['All', 'A', 'B'];

  const filteredClasses = [...classes]
    .filter((c) => {
      const matchesDay = selectedDay === 'All' || c.days.includes(selectedDay);
      const matchesType = scheduleType === 'All' || c.scheduleType === scheduleType;
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.instructor && c.instructor.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesDay && matchesType && matchesSearch;
    })
    .sort((a, b) => timeStringToMinutes(a.startTime) - timeStringToMinutes(b.startTime));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[560px]">
      
      {/* Widget Header */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Upcoming Schedule</h2>
            <p className="text-xs text-slate-500">
              {classes.length} total classes in schedule
            </p>
          </div>
        </div>

        {/* Day Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
            {daysList.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-2.5 py-1 rounded-md transition ${
                  selectedDay === day
                    ? 'bg-white text-indigo-600 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
            {scheduleTypes.map((type) => (
              <button
                key={type}
                onClick={() => onScheduleTypeChange(type)}
                className={`px-2.5 py-1 rounded-md transition ${
                  scheduleType === type
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {type} Day
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-slate-100 bg-white">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search class name, room or instructor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Class Schedule List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredClasses.length === 0 ? (
          <div className="p-8 text-center text-slate-400 space-y-2">
            <BookOpen className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-sm font-medium">No classes found for this filter</p>
          </div>
        ) : (
          filteredClasses.map((item) => {
            const isActive = activeClassId === item.id;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isActive
                    ? 'bg-indigo-50/80 border-indigo-300 shadow-md ring-2 ring-indigo-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                {/* Left Color Indicator Bar */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1.5"
                  style={{ backgroundColor: item.color || '#3b82f6' }}
                />

                <div className="pl-2 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-900 text-base tracking-tight">
                      {item.name}
                    </h3>

                    {isActive && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
                        Active Now
                      </span>
                    )}
                  </div>

                  {/* Room string display as required */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                    <div className="flex items-center gap-1 font-semibold text-indigo-900">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{item.room}</span>
                    </div>

                    {item.instructor && (
                      <div className="flex items-center gap-1 text-slate-500">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.instructor}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Time & Days Badges */}
                <div className="pl-2 sm:pl-0 sm:text-right shrink-0 space-y-1 border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0">
                  <div className="flex items-center sm:justify-end gap-1 font-mono font-bold text-xs text-slate-800">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {formatTime12h(item.startTime)} - {formatTime12h(item.endTime)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center sm:justify-end gap-1">
                    {item.scheduleType && (
                      <span className="px-1.5 py-0.5 text-[10px] rounded bg-indigo-50 text-indigo-700 font-medium border border-indigo-100">
                        {item.scheduleType} Day
                      </span>
                    )}
                    {item.days.split(',').map((d) => (
                      <span
                        key={d}
                        className="px-1.5 py-0.5 text-[10px] rounded bg-slate-100 text-slate-600 font-medium border border-slate-200"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
