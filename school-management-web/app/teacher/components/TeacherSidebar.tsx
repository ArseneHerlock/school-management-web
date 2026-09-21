'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { CLASS_INFO } from '../data/mockData';

const NAV = [
  { path:'/teacher',              icon:'🏠', label:'Trang chủ',   exact:true },
  { path:'/teacher/attendance',   icon:'📋', label:'Điểm danh'              },
  { path:'/teacher/health',       icon:'📐', label:'Sức khỏe'               },
  { path:'/teacher/assessment',   icon:'⭐', label:'Đánh giá'               },
  { path:'/teacher/album',        icon:'📸', label:'Album'                   },
  { path:'/teacher/schedule',     icon:'📅', label:'Lịch công tác'          },
  { path:'/teacher/messages',     icon:'💬', label:'Tin nhắn'               },
  { path:'/teacher/leave',        icon:'📝', label:'Xin nghỉ'               },
  { path:'/teacher/profile',      icon:'👤', label:'Hồ sơ'                  },
];

export default function TeacherSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('vi-VN', { hour:'2-digit', minute:'2-digit', second:'2-digit' }));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const teacher = CLASS_INFO.teachers.find(t => t.id === CLASS_INFO.currentTeacher)!;

  return (
    <aside className={`${collapsed?'w-16':'w-56'} flex-shrink-0 bg-white border-r border-orange-100 flex flex-col transition-all duration-200 h-screen sticky top-0`}>
      {/* Brand */}
      <div className="p-4 border-b border-orange-100 flex items-center gap-3">
        <div className="w-9 h-9 bg-orange-400 rounded-xl flex items-center justify-center text-white font-black flex-shrink-0">K</div>
        {!collapsed && <div><p className="font-black text-orange-500 text-sm leading-tight">KinderCare</p><p className="text-xs text-slate-400">Mầm non thông minh</p></div>}
      </div>

      {/* Teacher mini-card */}
      {!collapsed && (
        <div className="m-3 p-3 bg-orange-50 border border-orange-100 rounded-xl flex items-center gap-2">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{background:teacher.color}}>
            {teacher.avatar}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate">{teacher.name}</p>
            <p className="text-xs text-orange-500 truncate font-mono">{time}</p>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 flex flex-col gap-1 overflow-y-auto">
        {NAV.map(item => {
          const active = item.exact ? pathname === item.path : pathname.startsWith(item.path);
          return (
            <Link key={item.path} href={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${active?'bg-orange-400 text-white shadow-sm':'text-slate-500 hover:bg-orange-50 hover:text-orange-600'}`}>
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button onClick={()=>setCollapsed(p=>!p)}
        className="m-3 p-2 bg-orange-50 hover:bg-orange-100 rounded-xl text-orange-500 text-sm font-bold transition-colors">
        {collapsed ? '▶' : '◀ Thu gọn'}
      </button>
    </aside>
  );
}
