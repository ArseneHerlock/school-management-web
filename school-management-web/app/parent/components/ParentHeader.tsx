'use client';

import React from 'react';
import { ParentProfile } from '../types';

interface ParentHeaderProps {
  title: string;
  subtitle: string;
  onToggleSidebar: () => void;
  onOpenCall: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  parent: ParentProfile;
}

export default function ParentHeader({
  title,
  subtitle,
  onToggleSidebar,
  onOpenCall,
  onOpenNotifications,
  onOpenProfile,
  parent,
}: ParentHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 lg:px-6 py-3.5 flex items-center justify-between">
      {/* Left side: hamburger + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-hidden"
          title="Mở menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
          </svg>
        </button>
        <div>
          <h2 className="text-lg lg:text-xl font-extrabold text-slate-800">{title}</h2>
          <p className="text-xs text-slate-500 font-semibold hidden sm:block">{subtitle}</p>
        </div>
      </div>

      {/* Right side: attendance badge + action buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Attendance status pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Bé đã đến trường (07:42)
        </div>

        {/* Notification Button */}
        <button
          onClick={onOpenNotifications}
          title="Xem thông báo"
          className="relative p-2.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-xl border border-slate-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
          </svg>
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* Quick Teacher Call button in Top Bar */}
        <button
          onClick={onOpenCall}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          <span className="hidden sm:inline">Gọi cô giáo</span>
        </button>

        {/* Parent Avatar / Profile */}
        <button
          onClick={onOpenProfile}
          title="Hồ sơ phụ huynh"
          className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-300 text-sky-700 flex items-center justify-center font-bold text-xs hover:bg-sky-100 transition-colors"
        >
          {parent.hoTen.split(' ').slice(-1)[0]?.slice(0, 2).toUpperCase() || 'PH'}
        </button>
      </div>
    </header>
  );
}
