'use client';
import { useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

type EventType = 'activity' | 'meeting' | 'exam' | 'holiday' | 'reminder';

type CalEvent = {
  id: number;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  endTime?: string;
  title: string;
  type: EventType;
  desc?: string;
  color?: string;
};

type ViewMode = 'week' | 'month';

// ─── Mock Events ─────────────────────────────────────────────────────────────

function buildEvents(): CalEvent[] {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = (n: number) => `${y}-${m}-${String(n).padStart(2, '0')}`;

  return [
    // current month
    { id: 1, date: d(1), time: '07:00', endTime: '07:30', title: 'Thể dục sáng', type: 'activity', desc: 'Khởi động + vận động nhịp điệu' },
    { id: 2, date: d(2), time: '08:30', endTime: '09:15', title: 'Dạy toán – Đếm số', type: 'activity', desc: '5 lĩnh vực nhận thức' },
    { id: 3, date: d(3), time: '09:00', endTime: '10:00', title: 'Họp phụ huynh', type: 'meeting', desc: 'Phòng họp B – báo cáo kết quả tháng 8' },
    { id: 4, date: d(5), time: '07:30', endTime: '08:00', title: 'Kiểm tra sức khoẻ định kỳ', type: 'exam', desc: 'Cân – đo chiều cao toàn lớp' },
    { id: 5, date: d(8), title: 'Ngày Quốc tế Phụ nữ', type: 'holiday', desc: '🌸 Chào mừng 8/3' },
    { id: 6, date: d(10), time: '14:00', endTime: '15:30', title: 'Tập huấn STEAM', type: 'meeting', desc: 'Phòng đào tạo – tầng 2' },
    { id: 7, date: d(12), time: '08:30', endTime: '09:30', title: 'Tiết học tạo hình', type: 'activity', desc: 'Làm bưu thiếp từ vật liệu tái chế' },
    { id: 8, date: d(15), time: '10:00', endTime: '11:00', title: 'Ngoại khoá vườn trường', type: 'activity', desc: 'Quan sát thiên nhiên + vẽ lá cây' },
    { id: 9, date: d(17), time: '14:30', endTime: '15:00', title: 'Nhận xét học sinh', type: 'reminder', desc: 'Hoàn thành sổ theo dõi tháng 9' },
    { id: 10, date: d(19), time: '08:00', endTime: '09:00', title: 'Kiểm tra đánh giá định kỳ', type: 'exam', desc: '5 lĩnh vực phát triển' },
    { id: 11, date: d(22), time: '15:00', endTime: '16:30', title: 'Họp hội đồng sư phạm', type: 'meeting', desc: 'Phòng họp chính – ban giám hiệu chủ trì' },
    { id: 12, date: d(24), time: '08:30', endTime: '09:30', title: 'Tiết âm nhạc – Dạy bài hát mới', type: 'activity', desc: 'Bài "Trường chúng cháu là trường mầm non"' },
    { id: 13, date: d(25), title: 'Nhắc nộp kế hoạch tháng 10', type: 'reminder', desc: 'Hạn cuối nộp BGH' },
    { id: 14, date: d(27), time: '09:00', endTime: '11:00', title: 'Lễ tốt nghiệp mầm non', type: 'holiday', desc: '🎓 Buổi lễ trang trọng cuối năm học' },
    { id: 15, date: d(29), time: '14:00', endTime: '15:30', title: 'Họp nhóm giáo viên', type: 'meeting', desc: 'Chia sẻ kinh nghiệm giảng dạy' },
    // also add events for the next month first days so week view can show them
    { id: 16, date: `${y}-${String(now.getMonth() + 2).padStart(2, '0')}-01`, time: '07:00', title: 'Đầu tháng mới – nộp báo cáo', type: 'reminder' },
  ];
}

const EVENTS: CalEvent[] = buildEvents();

// ─── Helpers ─────────────────────────────────────────────────────────────────

const TYPE_META: Record<EventType, { label: string; emoji: string; bg: string; text: string; border: string; dot: string }> = {
  activity: { label: 'Hoạt động', emoji: '🎯', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-300', dot: 'bg-orange-400' },
  meeting:  { label: 'Họp',       emoji: '👥', bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-300',   dot: 'bg-blue-500'   },
  exam:     { label: 'Kiểm tra',  emoji: '📝', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-300', dot: 'bg-purple-500' },
  holiday:  { label: 'Lễ / nghỉ', emoji: '🎉', bg: 'bg-rose-50',   text: 'text-rose-700',   border: 'border-rose-300',   dot: 'bg-rose-400'   },
  reminder: { label: 'Nhắc nhở',  emoji: '🔔', bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-300',  dot: 'bg-amber-400'  },
};

function toDateStr(d: Date) {
  return d.toISOString().split('T')[0];
}

function addDays(d: Date, n: number) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function startOfWeek(d: Date) {
  const r = new Date(d);
  const day = r.getDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day; // Monday-based
  r.setDate(r.getDate() + diff);
  r.setHours(0, 0, 0, 0);
  return r;
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function daysInMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

const VI_DAYS_SHORT = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const VI_MONTHS = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
                   'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];

// ─── Sub-components ──────────────────────────────────────────────────────────

function EventPill({ ev, onClick }: { ev: CalEvent; onClick: () => void }) {
  const m = TYPE_META[ev.type];
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-1.5 py-0.5 rounded text-xs font-semibold truncate ${m.bg} ${m.text} border ${m.border} hover:opacity-80 transition-opacity`}
    >
      {m.emoji} {ev.time && <span className="opacity-70">{ev.time} </span>}{ev.title}
    </button>
  );
}

function EventDetail({ ev, onClose }: { ev: CalEvent; onClose: () => void }) {
  const m = TYPE_META[ev.type];
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl slide-in"
        onClick={e => e.stopPropagation()}
      >
        <div className={`p-5 ${m.bg} border-b ${m.border}`}>
          <div className="flex items-start gap-3">
            <span className="text-3xl">{m.emoji}</span>
            <div className="flex-1">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${m.bg} ${m.text} border ${m.border}`}>
                {m.label}
              </span>
              <h3 className={`text-lg font-bold mt-1 ${m.text}`}>{ev.title}</h3>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
          </div>
        </div>
        <div className="p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>📅</span>
            <span>{new Date(ev.date).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
          </div>
          {ev.time && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>⏰</span>
              <span>{ev.time}{ev.endTime ? ` – ${ev.endTime}` : ''}</span>
            </div>
          )}
          {ev.desc && (
            <div className="flex items-start gap-2 text-sm text-slate-600">
              <span className="mt-0.5">📋</span>
              <span>{ev.desc}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────


export default function SchedulePage() {
  const [view, setView] = useState<ViewMode>('week');
  const [cursorDate, setCursorDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalEvent | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: toDateStr(new Date()), time: '', type: 'activity' as EventType, desc: '' });
  const [localEvents, setLocalEvents] = useState<CalEvent[]>(EVENTS);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekStart = startOfWeek(cursorDate);
  const weekEnd = addDays(weekStart, 6);

  // Navigation labels
  const weekLabel = `${weekStart.toLocaleDateString('vi-VN', { day: '2-digit', month: 'short' })} – ${weekEnd.toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' })}`;
  const monthLabel = `${VI_MONTHS[cursorDate.getMonth()]} ${cursorDate.getFullYear()}`;

  const goBack = () => {
    const d = new Date(cursorDate);
    if (view === 'week') d.setDate(d.getDate() - 7);
    else d.setMonth(d.getMonth() - 1);
    setCursorDate(d);
  };

  const goForward = () => {
    const d = new Date(cursorDate);
    if (view === 'week') d.setDate(d.getDate() + 7);
    else d.setMonth(d.getMonth() + 1);
    setCursorDate(d);
  };

  const goToday = () => setCursorDate(new Date());

  // Upcoming events (next 7 days from today)
  const upcoming = localEvents
    .filter(e => {
      const ed = new Date(e.date);
      const diff = Math.ceil((ed.getTime() - today.getTime()) / 86400000);
      return diff >= 0 && diff <= 7;
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  const handleAddEvent = () => {
    if (!newEvent.title.trim() || !newEvent.date) return;
    const ev: CalEvent = {
      id: localEvents.length + 100,
      ...newEvent,
    };
    setLocalEvents(p => [...p, ev]);
    setShowAddModal(false);
    setNewEvent({ title: '', date: toDateStr(new Date()), time: '', type: 'activity', desc: '' });
  };

  const eventsOnLocal = (date: Date) => {
    const s = toDateStr(date);
    return localEvents.filter(e => e.date === s).sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-5">
      {/* Page header */}
      <div className="flex items-center gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-slate-800">📅 Lịch công tác</h1>
          <p className="text-sm text-slate-500">Theo dõi lịch tuần – tháng của lớp {' '}
            <span className="text-orange-500 font-semibold">Hoa Hướng Dương</span>
          </p>
        </div>

        <div className="ml-auto flex items-center gap-2 flex-wrap">
          {/* View toggle */}
          <div className="flex bg-white border border-orange-200 rounded-xl overflow-hidden">
            {(['week', 'month'] as ViewMode[]).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-2 text-sm font-bold transition-all ${
                  view === v ? 'bg-orange-400 text-white' : 'text-orange-600 hover:bg-orange-50'
                }`}
              >
                {v === 'week' ? '📆 Tuần' : '📅 Tháng'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm"
          >
            + Thêm sự kiện
          </button>
        </div>
      </div>

      <div className="flex gap-5 items-start">
        {/* ── Main calendar ── */}
        <div className="flex-1 min-w-0">
          {/* Nav bar */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={goBack}
              className="w-9 h-9 flex items-center justify-center bg-white border border-orange-200 rounded-xl hover:bg-orange-50 text-orange-600 font-bold transition-colors"
            >
              ‹
            </button>
            <div className="flex-1 text-center font-bold text-slate-700 text-sm" suppressHydrationWarning>
              {view === 'week' ? weekLabel : monthLabel}
            </div>
            <button
              onClick={goForward}
              className="w-9 h-9 flex items-center justify-center bg-white border border-orange-200 rounded-xl hover:bg-orange-50 text-orange-600 font-bold transition-colors"
            >
              ›
            </button>
            <button
              onClick={goToday}
              className="px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-xl text-xs font-bold text-orange-600 hover:bg-orange-100 transition-colors"
            >
              Hôm nay
            </button>
          </div>

          {/* Calendar body */}
          <div className="bg-white border border-orange-100 rounded-2xl p-4 shadow-sm">
            {view === 'week' ? (
              /* ── Week ── */
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((d, i) => {
                    const isToday = toDateStr(d) === toDateStr(today);
                    return (
                      <div key={i} className={`text-center rounded-xl py-2 ${isToday ? 'bg-orange-400 text-white' : 'bg-orange-50 border border-orange-100'}`}>
                        <div className={`text-xs font-semibold ${isToday ? 'text-orange-100' : 'text-slate-500'}`}>{VI_DAYS_SHORT[i]}</div>
                        <div className={`text-lg font-black ${isToday ? 'text-white' : 'text-slate-800'}`}>{d.getDate()}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="grid grid-cols-7 gap-2 items-start">
                  {weekDays.map((d, i) => {
                    const dayEvs = eventsOnLocal(d);
                    const isToday = toDateStr(d) === toDateStr(today);
                    return (
                      <div key={i} className={`min-h-[110px] rounded-xl p-2 flex flex-col gap-1 ${isToday ? 'bg-orange-50 border-2 border-orange-300' : 'bg-slate-50 border border-slate-100'}`}>
                        {dayEvs.length === 0
                          ? <span className="text-xs text-slate-300 italic text-center mt-4">—</span>
                          : dayEvs.map(ev => <EventPill key={ev.id} ev={ev} onClick={() => setSelectedEvent(ev)} />)
                        }
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-3 pt-1">
                  {Object.entries(TYPE_META).map(([, m]) => (
                    <div key={m.label} className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${m.dot}`} />
                      <span className="text-xs text-slate-400 font-semibold">{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* ── Month ── */
              (() => {
                const firstDay = startOfMonth(cursorDate);
                const totalDays = daysInMonth(cursorDate);
                const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
                const cells: (Date | null)[] = [
                  ...Array.from({ length: startOffset }, () => null),
                  ...Array.from({ length: totalDays }, (_, i) => addDays(firstDay, i)),
                ];
                while (cells.length % 7 !== 0) cells.push(null);

                return (
                  <div className="flex flex-col gap-1.5">
                    <div className="grid grid-cols-7 gap-1 mb-1">
                      {VI_DAYS_SHORT.map(d => (
                        <div key={d} className="text-center text-xs font-bold text-slate-400 py-1">{d}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {cells.map((d, i) => {
                        if (!d) return <div key={i} className="min-h-[80px]" />;
                        const ds = toDateStr(d);
                        const isToday = ds === toDateStr(today);
                        const dayEvs = eventsOnLocal(d);
                        const shown = dayEvs.slice(0, 2);
                        const extra = dayEvs.length - 2;
                        return (
                          <div key={i} className={`min-h-[80px] rounded-xl p-1.5 flex flex-col border ${isToday ? 'bg-orange-50 border-orange-400 border-2' : 'bg-white border-slate-100 hover:border-orange-200'} transition-colors`}>
                            <span className={`text-xs font-black mb-0.5 self-start px-1 rounded-full ${isToday ? 'bg-orange-400 text-white' : 'text-slate-600'}`}>
                              {d.getDate()}
                            </span>
                            {shown.map(ev => <EventPill key={ev.id} ev={ev} onClick={() => setSelectedEvent(ev)} />)}
                            {extra > 0 && <span className="text-xs text-slate-400 px-1">+{extra}</span>}
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex flex-wrap gap-3 pt-2">
                      {Object.entries(TYPE_META).map(([, m]) => (
                        <div key={m.label} className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${m.dot}`} />
                          <span className="text-xs text-slate-400 font-semibold">{m.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        </div>

        {/* ── Sidebar: Upcoming ── */}
        <div className="w-64 flex-shrink-0 flex flex-col gap-3">
          <div className="bg-white border border-orange-100 rounded-2xl p-4 shadow-sm">
            <h3 className="font-bold text-slate-700 text-sm mb-3">⏳ 7 ngày tới</h3>
            {upcoming.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Không có sự kiện nào</p>
            ) : (
              <div className="flex flex-col gap-2">
                {upcoming.map(ev => {
                  const m = TYPE_META[ev.type];
                  const daysDiff = Math.ceil((new Date(ev.date).getTime() - today.getTime()) / 86400000);
                  return (
                    <button
                      key={ev.id}
                      onClick={() => setSelectedEvent(ev)}
                      className={`w-full text-left rounded-xl p-2.5 border ${m.bg} ${m.border} card-hover`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-base">{m.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-bold truncate ${m.text}`}>{ev.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {daysDiff === 0 ? '🟢 Hôm nay' : daysDiff === 1 ? '🟡 Ngày mai' : `📅 ${daysDiff} ngày nữa`}
                            {ev.time ? ` · ${ev.time}` : ''}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Monthly summary */}
          <div className="bg-white border border-orange-100 rounded-2xl p-4 shadow-sm">
            <h3 className="font-bold text-slate-700 text-sm mb-3">📊 Tháng này</h3>
            {Object.entries(TYPE_META).map(([type, m]) => {
              const cnt = localEvents.filter(e => {
                const ed = new Date(e.date);
                return e.type === type && ed.getMonth() === today.getMonth() && ed.getFullYear() === today.getFullYear();
              }).length;
              return (
                <div key={type} className="flex items-center gap-2 mb-2">
                  <span className="text-sm">{m.emoji}</span>
                  <span className="text-xs text-slate-600 flex-1">{m.label}</span>
                  <span className={`text-xs font-black ${m.text} px-2 py-0.5 rounded-full ${m.bg} border ${m.border}`}>
                    {cnt}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Event detail modal ── */}
      {selectedEvent && (
        <EventDetail ev={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}

      {/* ── Add event modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end" onClick={() => setShowAddModal(false)}>
          <div className="bg-white w-full max-w-lg mx-auto rounded-t-3xl p-5 slide-in" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-slate-800 text-lg mb-4">+ Thêm sự kiện mới</h3>

            <div className="flex flex-col gap-3">
              <input
                value={newEvent.title}
                onChange={e => setNewEvent(p => ({ ...p, title: e.target.value }))}
                className="w-full border border-orange-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                placeholder="Tên sự kiện..."
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Ngày</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={e => setNewEvent(p => ({ ...p, date: e.target.value }))}
                    className="w-full border border-orange-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Giờ (tuỳ chọn)</label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={e => setNewEvent(p => ({ ...p, time: e.target.value }))}
                    className="w-full border border-orange-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 mb-2 block">Loại sự kiện</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(Object.entries(TYPE_META) as [EventType, typeof TYPE_META[EventType]][]).map(([type, m]) => (
                    <button
                      key={type}
                      onClick={() => setNewEvent(p => ({ ...p, type }))}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-xs font-semibold transition-all ${
                        newEvent.type === type ? `${m.bg} ${m.border} ${m.text}` : 'bg-white border-slate-200 text-slate-500 hover:border-orange-200'
                      }`}
                    >
                      <span className="text-lg">{m.emoji}</span>
                      <span className="leading-none text-center">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={newEvent.desc}
                onChange={e => setNewEvent(p => ({ ...p, desc: e.target.value }))}
                className="w-full border border-orange-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 resize-none"
                rows={2}
                placeholder="Mô tả thêm (tuỳ chọn)..."
              />
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 transition-colors"
              >
                Huỷ
              </button>
              <button
                onClick={handleAddEvent}
                disabled={!newEvent.title.trim()}
                className="flex-1 bg-orange-400 text-white py-3 rounded-xl font-bold hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Lưu sự kiện
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
