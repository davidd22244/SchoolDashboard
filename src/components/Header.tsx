import { Link, useRouterState } from '@tanstack/react-router';
import { Clock, Mail, Calendar, Settings, GraduationCap, Database, HardDrive, RefreshCw } from 'lucide-react';
import { UserSettings } from '../lib/default-data';

interface HeaderProps {
  settings: UserSettings;
}

export function Header({ settings }: HeaderProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <header className="bg-slate-900 text-white shadow-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo / Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white block">
                EduDash <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-medium border border-blue-500/30">School</span>
              </span>
              <span className="text-xs text-slate-400 block -mt-1 truncate max-w-[200px] sm:max-w-none">
                {settings.email || 'Student Dashboard'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentPath === '/'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>

            <Link
              to="/customize"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentPath === '/customize'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Customize</span>
            </Link>
          </nav>

          {/* User & Storage Indicator */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300">
              {settings.storageMode === 'server' && (
                <>
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Server DB</span>
                </>
              )}
              {settings.storageMode === 'local' && (
                <>
                  <HardDrive className="w-3.5 h-3.5 text-amber-400" />
                  <span>LocalStorage</span>
                </>
              )}
              {settings.storageMode === 'hybrid' && (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin-slow" />
                  <span>Hybrid Storage</span>
                </>
              )}
            </div>

            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-inner ring-2 ring-indigo-400/30">
              {settings.userName ? settings.userName.charAt(0).toUpperCase() : 'S'}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
