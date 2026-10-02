'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CLASS_INFO, CHILDREN, SCHEDULE_TODAY, MESSAGES_DATA } from './data/mockData';

const GOOD_KIDS  = [1,3,6,10,13,17];
const QUICK_ACTIONS = [
  { icon:'📋', label:'Điểm danh',  path:'/teacher/attendance' },
  { icon:'📐', label:'Sức khỏe',   path:'/teacher/health'     },
  { icon:'⭐', label:'Đánh giá',   path:'/teacher/assessment' },
  { icon:'📸', label:'Album',       path:'/teacher/album'      },
  { icon:'📅', label:'Lịch',        path:'/teacher/schedule'   },
  { icon:'💬', label:'Tin nhắn',   path:'/teacher/messages'   },
  { icon:'📝', label:'Xin nghỉ',   path:'/teacher/leave'      },
  { icon:'👤', label:'Hồ sơ',      path:'/teacher/profile'    },
];

export default function TeacherDashboard() {
  const [time, setTime] = useState(new Date());
  const router = useRouter();

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const presentCount   = 20;
  const absentCount    = CHILDREN.length - presentCount;
  const unreadMessages = MESSAGES_DATA.filter(m => !m.read).length;
  const currentAct     = SCHEDULE_TODAY.find(s => s.current);

  const today = time.toLocaleDateString('vi-VN', { weekday:'long', day:'2-digit', month:'2-digit', year:'numeric' });
  const AVAIL_COLORS = ['#f97316','#ec4899','#3b82f6','#a855f7','#22c55e','#f59e0b'];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">

      {/* ── Hero card ── */}
      <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg shadow-orange-200">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/10 rounded-full translate-y-10 -translate-x-8" />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-orange-100 text-sm" suppressHydrationWarning>{today}</p>
              <h2 className="text-2xl font-bold mt-1">{CLASS_INFO.name}</h2>
              <p className="text-orange-100 text-sm">{CLASS_INFO.room} · {CLASS_INFO.ageGroup}</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black font-mono" suppressHydrationWarning>
                {time.toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}
              </div>
              <div className="flex items-center gap-1 justify-end mt-1">
                <span className="w-2 h-2 rounded-full bg-green-300 pulse-dot" />
                <span className="text-xs text-orange-100">Đang hoạt động</span>
              </div>
            </div>
          </div>
          {/* 2 teachers */}
          <div className="flex gap-3">
            {CLASS_INFO.teachers.map(t => (
              <div key={t.id} className="flex items-center gap-2 bg-white/20 rounded-xl px-3 py-2 flex-1 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-xs font-bold">{t.avatar}</div>
                <div>
                  <p className="text-sm font-semibold leading-none">{t.name}</p>
                  <p className="text-xs text-orange-100 mt-0.5">{t.id===CLASS_INFO.currentTeacher?'👑 Chủ nhiệm':'🤝 Hỗ trợ'}</p>
                </div>
                {t.id===CLASS_INFO.currentTeacher&&<span className="ml-auto text-xs bg-white/30 px-2 py-0.5 rounded-full">Online</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label:'Có mặt',      value:presentCount,   icon:'✅', color:'text-green-600', bg:'bg-green-50',  border:'border-green-200',  path:'/teacher/attendance' },
          { label:'Vắng mặt',    value:absentCount,    icon:'❌', color:'text-red-500',   bg:'bg-red-50',    border:'border-red-200',    path:'/teacher/attendance' },
          { label:'Tổng số bé',  value:CHILDREN.length,icon:'👶', color:'text-orange-500',bg:'bg-orange-50', border:'border-orange-200', path:'/teacher/attendance' },
          { label:'Tin chưa đọc',value:unreadMessages, icon:'💬', color:'text-blue-600',  bg:'bg-blue-50',   border:'border-blue-200',   path:'/teacher/messages'  },
        ].map(s=>(
          <button key={s.label} onClick={()=>router.push(s.path)}
            className={`${s.bg} border ${s.border} rounded-2xl p-4 text-center card-hover w-full`}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-500 font-semibold mt-1">{s.label}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          {/* Current activity */}
          {currentAct&&(
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">{currentAct.icon}</div>
              <div className="flex-1">
                <p className="text-xs text-orange-500 font-semibold uppercase tracking-wide">Đang diễn ra • {currentAct.time}</p>
                <p className="font-bold text-orange-900 text-base">{currentAct.activity}</p>
              </div>
              <span className="px-3 py-1 bg-orange-400 text-white text-xs rounded-full font-bold animate-pulse">LIVE</span>
            </div>
          )}

          {/* Quick actions */}
          <div>
            <p className="text-sm font-bold text-slate-600 mb-3">Thao tác nhanh</p>
            <div className="grid grid-cols-4 gap-2">
              {QUICK_ACTIONS.map(a=>(
                <button key={a.label} onClick={()=>router.push(a.path)}
                  className="flex flex-col items-center gap-1.5 p-3 bg-white border border-orange-100 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition-all card-hover">
                  <span className="text-2xl">{a.icon}</span>
                  <span className="text-xs font-semibold text-slate-600 text-center leading-tight">{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Good kids */}
          <div className="bg-white border border-orange-100 rounded-2xl p-4">
            <p className="text-sm font-bold text-slate-700 mb-3">🌹 Bé ngoan tuần này</p>
            <div className="flex gap-3 flex-wrap">
              {CHILDREN.filter(c=>GOOD_KIDS.includes(c.id)).map(c=>(
                <div key={c.id} className="flex flex-col items-center gap-1">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                         style={{background:AVAIL_COLORS[c.id%6]}}>{c.avatar.slice(0,2)}</div>
                    <span className="absolute -bottom-1 -right-1 text-sm">🌹</span>
                  </div>
                  <p className="text-xs text-slate-600 font-semibold w-10 text-center truncate">{c.nickname}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div>
          <p className="text-sm font-bold text-slate-600 mb-3">📅 Thời khóa biểu hôm nay</p>
          <div className="bg-white border border-orange-100 rounded-2xl overflow-hidden">
            {SCHEDULE_TODAY.map((s,i)=>(
              <div key={i} className={`flex items-center gap-3 px-4 py-3 border-b border-orange-50 last:border-0 transition-colors ${s.current?'bg-orange-50':''}`}>
                <span className="text-lg w-7 text-center">{s.icon}</span>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${s.done?'text-slate-300 line-through':s.current?'text-orange-700':'text-slate-700'}`}>{s.activity}</p>
                </div>
                <span className={`text-xs font-mono ${s.current?'text-orange-600 font-bold':'text-slate-400'}`}>{s.time}</span>
                {s.done&&<span className="text-green-400 text-sm">✓</span>}
                {s.current&&<span className="w-2.5 h-2.5 rounded-full bg-orange-400 pulse-dot flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
