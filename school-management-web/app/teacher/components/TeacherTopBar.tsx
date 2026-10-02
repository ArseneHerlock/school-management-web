'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { CLASS_INFO } from '../data/mockData';

const PAGE_TITLES: Record<string, string> = {
  '/teacher':            'Trang chủ',
  '/teacher/attendance': 'Điểm danh',
  '/teacher/health':     'Sức khỏe',
  '/teacher/assessment': 'Đánh giá',
  '/teacher/album':      'Album ảnh',
  '/teacher/schedule':   'Lịch công tác',
  '/teacher/messages':   'Tin nhắn',
  '/teacher/leave':      'Xin nghỉ phép',
  '/teacher/profile':    'Hồ sơ cá nhân',
};

export default function TeacherTopBar() {
  const pathname = usePathname();
  const [time, setTime]  = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const teacher = CLASS_INFO.teachers.find(t => t.id === CLASS_INFO.currentTeacher)!;
  const title   = PAGE_TITLES[pathname] ?? 'Trang chủ';

  return (
    <header className="bg-white border-b border-orange-100 px-6 py-3 flex items-center gap-4 flex-shrink-0">
      <div>
        <h1 className="font-bold text-slate-800 text-base">{title}</h1>
        <p className="text-xs text-slate-400">{CLASS_INFO.name} · {CLASS_INFO.room}</p>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <div className="text-right hidden sm:block" suppressHydrationWarning>
          <div className="font-mono font-bold text-orange-500 text-base" suppressHydrationWarning>
            {time.toLocaleTimeString('vi-VN', { hour:'2-digit', minute:'2-digit', second:'2-digit' })}
          </div>
          <div className="text-xs text-slate-400" suppressHydrationWarning>
            {time.toLocaleDateString('vi-VN', { weekday:'long', day:'2-digit', month:'2-digit' })}
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3 py-1">
          <span className="w-2 h-2 rounded-full bg-green-400 pulse-dot" />
          <span className="text-xs text-green-700 font-semibold hidden sm:inline">Đang hoạt động</span>
        </div>
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold cursor-pointer"
             style={{ background: teacher.color }}>
          {teacher.avatar}
        </div>
      </div>
    </header>
  );
}
