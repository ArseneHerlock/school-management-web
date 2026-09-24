'use client';
import { useState } from 'react';
import { CHILDREN, ASSESSMENT_CRITERIA, BADGE_TYPES, DEFAULT_BADGES } from '../data/mockData';
import Avatar from '../components/Avatar';
import StarRating from '../components/StarRating';

// ─── Types ────────────────────────────────────────────────────────────────────

type SessionType = 'morning' | 'art' | 'music' | 'outdoor' | 'math' | 'language' | 'science' | 'other';

const SESSION_TYPES: Record<SessionType, { label: string; icon: string; color: string }> = {
  morning:  { label: 'Hoạt động sáng',      icon: '🌅', color: 'text-orange-600' },
  art:      { label: 'Tạo hình / Nghệ thuật',icon: '🎨', color: 'text-pink-600'   },
  music:    { label: 'Âm nhạc',              icon: '🎵', color: 'text-purple-600' },
  outdoor:  { label: 'Hoạt động ngoài trời', icon: '⛅', color: 'text-green-600'  },
  math:     { label: 'Toán / Nhận thức',     icon: '🔢', color: 'text-blue-600'   },
  language: { label: 'Ngôn ngữ / Tiếng Việt',icon: '💬', color: 'text-indigo-600' },
  science:  { label: 'Khám phá khoa học',    icon: '🔬', color: 'text-teal-600'   },
  other:    { label: 'Tiết học khác',         icon: '📚', color: 'text-slate-600'  },
};

// Criteria IDs visible per session type. null = show ALL
const SESSION_CRITERIA: Record<SessionType, string[] | null> = {
  morning:  ['run','balance','selfcare','share','cooperate','emotion','respect','friend'],
  art:      ['draw','craft','finemotor','creative'],
  music:    ['music','dance','sing','speak','vocab'],
  outdoor:  ['run','balance','finemotor','creative','puzzle','share','cooperate','friend'],
  math:     ['counting','shape','memory','creative','puzzle'],
  language: ['speak','vocab','story','listen','sing','memory'],
  science:  ['creative','puzzle','shape','finemotor'],
  other:    null, // all
};

// Badges that can be awarded per session type (🌹 is attendance-only, excluded from sessions)
const SESSION_BADGES: Record<SessionType, string[]> = {
  morning:  ['💪','🤝'],
  art:      ['🎨','🏆','⭐'],
  music:    ['🎨','⭐','🏆'],
  outdoor:  ['💪','🤝','⭐'],
  math:     ['⭐','🏆'],
  language: ['⭐','🏆'],
  science:  ['🎨','⭐','🏆'],
  other:    ['⭐','🏆','🎨','💪','🤝'],
};

type LessonRecord = {
  id: string;
  date: string;       // YYYY-MM-DD
  sessionType: SessionType;
  topic: string;
  childId: number;
  scores: Record<string, number>;
  comment: string;
  badges: string[];
};

// Mock history data
function initHistory(): LessonRecord[] {
  const toStr = (d: Date) => d.toISOString().split('T')[0];
  const today = new Date();
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const twoDays   = new Date(today); twoDays.setDate(today.getDate() - 2);

  return [
    // Yesterday - art session - a few children
    { id:'1', date: toStr(yesterday), sessionType:'art', topic:'Vẽ tranh gia đình', childId:1, scores:{ draw:5, craft:4, creative:5 }, comment:'Bé Anh vẽ rất sinh động, màu sắc đẹp, thể hiện tốt cảm xúc.', badges:['🎨'] },
    { id:'2', date: toStr(yesterday), sessionType:'art', topic:'Vẽ tranh gia đình', childId:3, scores:{ draw:4, craft:4, creative:4 }, comment:'Bé Ngọc hoàn thành đúng giờ, nét vẽ khá chắc chắn.', badges:[] },
    { id:'3', date: toStr(yesterday), sessionType:'art', topic:'Vẽ tranh gia đình', childId:10, scores:{ draw:5, craft:5, creative:5 }, comment:'Xuất sắc! Bé Bảo có khiếu thẩm mỹ rất tốt.', badges:['🏆','🎨'] },
    // Two days ago - math session
    { id:'4', date: toStr(twoDays), sessionType:'math', topic:'Đếm số 1-10', childId:1, scores:{ counting:5, memory:4 }, comment:'Bé đếm nhanh và chính xác.', badges:['⭐'] },
    { id:'5', date: toStr(twoDays), sessionType:'math', topic:'Đếm số 1-10', childId:6, scores:{ counting:3, memory:3 }, comment:'Bé cần ôn luyện thêm phần đếm ngược.', badges:[] },
  ];
}

// ─── Mock Attendance Data (current month) ────────────────────────────────────
// absentCount per child (mock)
const MOCK_ABSENT: Record<number, number> = {
  4: 2, 7: 1, 11: 3, 15: 1, 18: 2,
};

// ─── Auto-badge Rules ─────────────────────────────────────────────────────────

type BadgeRule = {
  badge: string;
  label: string;
  description: string;
  check: (childId: number, history: LessonRecord[], absentCount: number) => { earned: boolean; reason: string };
};

const AUTO_BADGE_RULES: BadgeRule[] = [
  {
    badge: '🌹',
    label: 'Bé chăm ngoan',
    description: 'Không vắng quá 1 buổi học trong tháng',
    check: (_id, _hist, absent) => ({
      earned: absent <= 1,
      reason: absent <= 1
        ? `Vắng ${absent} buổi — đủ điều kiện 🌹`
        : `Vắng ${absent} buổi — KHÔNG đủ điều kiện (cần ≤1 buổi)`,
    }),
  },
  {
    badge: '⭐',
    label: 'Bé xuất sắc',
    description: 'Điểm trung bình ≥ 4.5 qua ít nhất 3 tiết học',
    check: (_id, hist, _absent) => {
      const sessions = hist.filter(r => r.childId === _id && Object.keys(r.scores).length > 0);
      if (sessions.length < 3) return { earned: false, reason: `Chỉ có ${sessions.length}/3 tiết có đánh giá` };
      const avg = sessions.reduce((sum, r) => {
        const vals = Object.values(r.scores);
        return sum + (vals.length ? vals.reduce((a,b)=>a+b,0)/vals.length : 0);
      }, 0) / sessions.length;
      return {
        earned: avg >= 4.5,
        reason: avg >= 4.5 ? `Điểm TB: ${avg.toFixed(1)} ≥ 4.5 ⭐` : `Điểm TB: ${avg.toFixed(1)} — chưa đạt 4.5`,
      };
    },
  },
  {
    badge: '🏆',
    label: 'Bé tài năng',
    description: 'Đạt điểm 5/5 ít nhất 5 tiêu chí trong tháng',
    check: (_id, hist, _absent) => {
      const perfect = hist.filter(r => r.childId === _id).flatMap(r => Object.values(r.scores)).filter(v => v === 5).length;
      return {
        earned: perfect >= 5,
        reason: perfect >= 5 ? `Có ${perfect} tiêu chí đạt 5★ 🏆` : `Mới có ${perfect}/5 tiêu chí đạt 5★`,
      };
    },
  },
  {
    badge: '💪',
    label: 'Bé dũng cảm',
    description: 'Dù vắng ≥1 buổi nhưng điểm vẫn đạt ≥4.0',
    check: (_id, hist, absent) => {
      if (absent < 1) return { earned: false, reason: 'Điều kiện: phải có vắng ≥1 buổi' };
      const sessions = hist.filter(r => r.childId === _id && Object.keys(r.scores).length > 0);
      if (sessions.length === 0) return { earned: false, reason: 'Chưa có đánh giá' };
      const avg = sessions.reduce((sum, r) => {
        const vals = Object.values(r.scores);
        return sum + (vals.length ? vals.reduce((a,b)=>a+b,0)/vals.length : 0);
      }, 0) / sessions.length;
      return {
        earned: avg >= 4.0,
        reason: avg >= 4.0 ? `Vắng ${absent} buổi nhưng TB ${avg.toFixed(1)} ≥ 4.0 💪` : `TB ${avg.toFixed(1)} — chưa đạt 4.0`,
      };
    },
  },
  {
    badge: '🎨',
    label: 'Bé sáng tạo',
    description: 'Điểm tạo hình/âm nhạc đạt 5★ ít nhất 2 lần',
    check: (_id, hist, _absent) => {
      const creativeHigh = hist.filter(r => r.childId === _id &&
        ['art','music'].includes(r.sessionType) &&
        Object.values(r.scores).some(v => v === 5)
      ).length;
      return {
        earned: creativeHigh >= 2,
        reason: creativeHigh >= 2 ? `Đạt 5★ trong ${creativeHigh} tiết nghệ thuật 🎨` : `Mới đạt ${creativeHigh}/2 tiết nghệ thuật 5★`,
      };
    },
  },
  {
    badge: '🤝',
    label: 'Bé đoàn kết',
    description: 'Điểm Tình cảm-Xã hội trung bình ≥ 4.0',
    check: (_id, hist, _absent) => {
      const socialScores = hist.filter(r => r.childId === _id)
        .flatMap(r => ['share','cooperate','emotion','respect','friend'].map(k => r.scores[k]).filter(Boolean));
      if (socialScores.length === 0) return { earned: false, reason: 'Chưa có đánh giá tiêu chí xã hội' };
      const avg = socialScores.reduce((a,b)=>a+b,0) / socialScores.length;
      return {
        earned: avg >= 4.0,
        reason: avg >= 4.0 ? `TB kỹ năng xã hội: ${avg.toFixed(1)} 🤝` : `TB kỹ năng xã hội: ${avg.toFixed(1)} — chưa đạt 4.0`,
      };
    },
  },
];


export default function AssessmentPage() {
  const [tab, setTab] = useState<'session' | 'profile' | 'badge'>('session');

  // ── Session assessment state ──
  const [step, setStep] = useState<'pick-session' | 'pick-child' | 'assess' | 'done'>('pick-session');
  const [sessionDate,   setSessionDate]   = useState(new Date().toISOString().split('T')[0]);
  const [sessionType,   setSessionType]   = useState<SessionType>('art');
  const [sessionTopic,  setSessionTopic]  = useState('');
  const [selectedChild, setSelectedChild] = useState<number | null>(null);
  const [currentScores, setCurrentScores] = useState<Record<string, number>>({});
  const [currentComment,setCurrentComment]= useState('');
  const [currentBadges, setCurrentBadges] = useState<string[]>([]);
  const [history,       setHistory]       = useState<LessonRecord[]>(initHistory);

  // ── Profile tab state ──
  const [profileChild,  setProfileChild]  = useState<number | null>(null);

  // ── Badge tab state ──
  const [badges, setBadges] = useState<Record<number, string[]>>(DEFAULT_BADGES);

  const childRecord = CHILDREN.find(c => c.id === selectedChild);
  const profileRecord = CHILDREN.find(c => c.id === profileChild);

  // Save one child's session assessment
  const saveAssessment = () => {
    if (!selectedChild) return;
    const rec: LessonRecord = {
      id: Date.now().toString(),
      date: sessionDate,
      sessionType,
      topic: sessionTopic,
      childId: selectedChild,
      scores: currentScores,
      comment: currentComment,
      badges: currentBadges,
    };
    setHistory(p => [rec, ...p]);
    // Also persist badges to global
    if (currentBadges.length > 0) {
      setBadges(p => ({
        ...p,
        [selectedChild]: [...new Set([...(p[selectedChild] || []), ...currentBadges])],
      }));
    }
    // Reset child assessment
    setCurrentScores({});
    setCurrentComment('');
    setCurrentBadges([]);
    setSelectedChild(null);
    setStep('pick-child');
  };

  const sessionFmt = (date: string) => new Date(date).toLocaleDateString('vi-VN', { weekday:'short', day:'2-digit', month:'2-digit' });

  // Children already assessed in current session (same date+type+topic)
  const assessedInSession = new Set(
    history.filter(r => r.date === sessionDate && r.sessionType === sessionType && r.topic === sessionTopic).map(r => r.childId)
  );

  const getChildHistory = (childId: number) => history.filter(r => r.childId === childId).sort((a,b) => b.date.localeCompare(a.date));

  const avgScore = (scores: Record<string,number>) => {
    const vals = Object.values(scores);
    return vals.length ? (vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(1) : '—';
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-4">

      {/* ── Tabs ── */}
      <div className="flex gap-2">
        {([
          ['session', '📝 Đánh giá tiết học'],
          ['profile', '📂 Hồ sơ phát triển'],
          ['badge',   '🌹 Danh hiệu'],
        ] as const).map(([k, l]) => (
          <button key={k} onClick={() => { setTab(k); setStep('pick-session'); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              tab === k ? 'bg-orange-400 text-white shadow-md' : 'bg-white border border-orange-200 text-orange-600 hover:bg-orange-50'
            }`}>{l}</button>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════
          TAB 1 — SESSION ASSESSMENT
         ════════════════════════════════════════════════════════ */}
      {tab === 'session' && (
        <>
          {/* Step indicator */}
          <div className="flex items-center gap-1">
            {(['pick-session','pick-child','assess'] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-1 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 transition-all ${
                  step === s ? 'bg-orange-400 text-white' :
                  (['pick-child','assess','done'].indexOf(step) > i) ? 'bg-green-400 text-white' : 'bg-slate-100 text-slate-400'
                }`}>{(['pick-child','assess','done'].indexOf(step) > i) ? '✓' : i+1}</div>
                <span className="text-xs text-slate-400 flex-1 truncate">
                  {s === 'pick-session' ? 'Chọn tiết học' : s === 'pick-child' ? 'Chọn bé' : 'Đánh giá'}
                </span>
                {i < 2 && <div className="w-4 h-px bg-slate-200 flex-shrink-0" />}
              </div>
            ))}
          </div>

          {/* ── Step 1: Pick session ── */}
          {step === 'pick-session' && (
            <div className="flex flex-col gap-4">
              <div className="bg-white border border-orange-100 rounded-2xl p-5">
                <h3 className="font-bold text-slate-800 mb-4">Thông tin tiết học</h3>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">Ngày học</label>
                    <input type="date" value={sessionDate} onChange={e => setSessionDate(e.target.value)}
                      className="w-full border border-orange-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">Chủ đề / nội dung</label>
                    <input value={sessionTopic} onChange={e => setSessionTopic(e.target.value)}
                      placeholder="VD: Vẽ tranh mùa hè..."
                      className="w-full border border-orange-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
                  </div>
                </div>

                <label className="text-xs font-semibold text-slate-500 mb-2 block">Loại tiết học</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(SESSION_TYPES) as [SessionType, typeof SESSION_TYPES[SessionType]][]).map(([k, v]) => (
                    <button key={k} onClick={() => setSessionType(k)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold transition-all ${
                        sessionType === k ? 'bg-orange-100 border-orange-400 text-orange-800' : 'bg-white border-slate-200 text-slate-600 hover:border-orange-200'
                      }`}>
                      <span>{v.icon}</span><span>{v.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent sessions */}
              {history.length > 0 && (
                <div>
                  <p className="text-sm font-bold text-slate-600 mb-2">📋 Đánh giá gần đây</p>
                  <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
                    {[...new Map(history.map(r => [`${r.date}-${r.sessionType}-${r.topic}`, r])).values()].map(r => (
                      <div key={`${r.date}-${r.sessionType}-${r.topic}`}
                        className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl px-4 py-2.5">
                        <span className="text-lg">{SESSION_TYPES[r.sessionType].icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-700 truncate">{r.topic || SESSION_TYPES[r.sessionType].label}</p>
                          <p className="text-xs text-slate-400">{sessionFmt(r.date)} · {history.filter(h=>h.date===r.date&&h.sessionType===r.sessionType&&h.topic===r.topic).length} bé đã đánh giá</p>
                        </div>
                        <button onClick={() => {
                          setSessionDate(r.date); setSessionType(r.sessionType); setSessionTopic(r.topic); setStep('pick-child');
                        }} className="text-xs bg-orange-50 border border-orange-200 text-orange-600 px-2 py-1 rounded-lg font-semibold hover:bg-orange-100 transition-colors">
                          Tiếp tục →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={() => setStep('pick-child')}
                disabled={!sessionType}
                className="w-full bg-orange-400 hover:bg-orange-500 text-white py-3 rounded-2xl font-bold transition-colors disabled:opacity-50">
                Bắt đầu đánh giá →
              </button>
            </div>
          )}

          {/* ── Step 2: Pick child ── */}
          {step === 'pick-child' && (
            <div className="flex flex-col gap-3">
              {/* Session info banner */}
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border bg-orange-50 border-orange-200`}>
                <span className="text-2xl">{SESSION_TYPES[sessionType].icon}</span>
                <div className="flex-1">
                  <p className="font-bold text-orange-800 text-sm">{sessionTopic || SESSION_TYPES[sessionType].label}</p>
                  <p className="text-xs text-orange-600" suppressHydrationWarning>{sessionFmt(sessionDate)} · {assessedInSession.size}/{CHILDREN.length} bé đã đánh giá</p>
                </div>
                <button onClick={() => setStep('pick-session')} className="text-xs text-slate-400 hover:text-slate-600">← Đổi tiết</button>
              </div>

              {/* Progress bar */}
              <div className="bg-white border border-orange-100 rounded-xl p-3">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Tiến độ đánh giá</span>
                  <span className="font-bold text-orange-600">{assessedInSession.size}/{CHILDREN.length}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-orange-400 h-2 rounded-full transition-all" style={{ width: `${(assessedInSession.size/CHILDREN.length)*100}%` }} />
                </div>
              </div>

              {assessedInSession.size === CHILDREN.length && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
                  <span>🎉</span><span className="text-green-700 font-semibold text-sm">Đã đánh giá xong tất cả {CHILDREN.length} bé trong tiết này!</span>
                </div>
              )}

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {CHILDREN.map(c => {
                  const done = assessedInSession.has(c.id);
                  return (
                    <button key={c.id} onClick={() => { setSelectedChild(c.id); setStep('assess'); }}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                        done
                          ? 'bg-green-50 border-green-300'
                          : 'bg-white border-orange-100 hover:border-orange-400 hover:bg-orange-50'
                      }`}>
                      <div className="relative">
                        <Avatar initials={c.avatar} id={c.id} size="sm" />
                        {done && <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full text-white text-xs flex items-center justify-center">✓</span>}
                      </div>
                      <span className="text-xs font-semibold text-center truncate w-full">{c.nickname}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Step 3: Assess child ── */}
          {step === 'assess' && childRecord && (
            <div className="flex flex-col gap-4">
              {/* Header */}
              <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-4 flex items-center gap-3 text-white">
                <button onClick={() => setStep('pick-child')} className="text-xl">←</button>
                <Avatar initials={childRecord.avatar} id={childRecord.id} size="md" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{childRecord.name}</h3>
                  <p className="text-orange-100 text-xs">{SESSION_TYPES[sessionType].icon} {sessionTopic || SESSION_TYPES[sessionType].label} · <span suppressHydrationWarning>{sessionFmt(sessionDate)}</span></p>
                </div>
              </div>

              {/* Criteria filtered by session type */}
              {(() => {
                const allowedIds = SESSION_CRITERIA[sessionType];
                const filtered = ASSESSMENT_CRITERIA.map(cat => ({
                  ...cat,
                  items: allowedIds ? cat.items.filter(item => allowedIds.includes(item.id)) : cat.items,
                })).filter(cat => cat.items.length > 0);
                return (
                  <div className="flex flex-col gap-3">
                    {filtered.map(cat => (
                      <div key={cat.category} className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-orange-100">
                          <span className="text-lg">{cat.icon}</span>
                          <span className="font-bold text-slate-800">{cat.category}</span>
                          <span className="ml-auto text-xs bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full font-semibold">
                            {cat.items.length} tiêu chí
                          </span>
                        </div>
                        <div className="flex flex-col gap-3">
                          {cat.items.map(item => (
                            <div key={item.id} className="flex items-center gap-2 bg-white rounded-xl px-3 py-2">
                              <span className="text-sm text-slate-600 flex-1">{item.label}</span>
                              <StarRating value={currentScores[item.id] || 0}
                                onChange={v => setCurrentScores(p => ({ ...p, [item.id]: v }))} />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Comment */}
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
                <label className="text-sm font-bold text-slate-700 mb-2 block">💬 Nhận xét của giáo viên</label>
                <textarea value={currentComment} onChange={e => setCurrentComment(e.target.value)} rows={3}
                  placeholder={`Nhận xét về bé ${childRecord.nickname} trong tiết học hôm nay...`}
                  className="w-full border border-orange-200 bg-white rounded-xl p-3 text-sm focus:outline-none focus:border-orange-400 resize-none" />
              </div>

              {/* Session-specific badges only */}
              {(() => {
                const allowedBadges = SESSION_BADGES[sessionType];
                const sessionBadgeTypes = BADGE_TYPES.filter(b => allowedBadges.includes(b.emoji));
                if (sessionBadgeTypes.length === 0) return null;
                return (
                  <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
                    <label className="text-sm font-bold text-slate-700 mb-1 block">🏅 Trao danh hiệu tiết học này</label>
                    <p className="text-xs text-slate-400 mb-3">
                      Chỉ hiện danh hiệu phù hợp với tiết <strong>{SESSION_TYPES[sessionType].label}</strong>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {sessionBadgeTypes.map(b => {
                        const has = currentBadges.includes(b.emoji);
                        return (
                          <button key={b.emoji} onClick={() => setCurrentBadges(p => has ? p.filter(x=>x!==b.emoji) : [...p, b.emoji])}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold transition-all ${
                              has ? 'bg-orange-100 border-orange-400 text-orange-800' : 'bg-white border-slate-200 text-slate-600 hover:border-orange-300'
                            }`}>
                            <span>{b.emoji}</span><span>{b.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              <div className="flex gap-2">
                <button onClick={() => setStep('pick-child')}
                  className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50">
                  Bỏ qua bé này
                </button>
                <button onClick={saveAssessment}
                  className="flex-1 bg-orange-400 hover:bg-orange-500 text-white py-3 rounded-xl font-bold transition-colors">
                  💾 Lưu vào hồ sơ bé
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ════════════════════════════════════════════════════════
          TAB 2 — CHILD DEVELOPMENT PROFILE
         ════════════════════════════════════════════════════════ */}
      {tab === 'profile' && (
        <div className="flex flex-col gap-4">
          {!profileChild ? (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex gap-2 text-sm text-blue-800">
                <span>📂</span><span>Chọn bé để xem hồ sơ phát triển đầy đủ qua từng tiết học.</span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {CHILDREN.map(c => {
                  const childHist = getChildHistory(c.id);
                  return (
                    <button key={c.id} onClick={() => setProfileChild(c.id)}
                      className="flex flex-col items-center gap-1.5 p-3 bg-white border border-orange-100 rounded-xl hover:border-orange-400 hover:bg-orange-50 transition-all card-hover">
                      <Avatar initials={c.avatar} id={c.id} size="sm" />
                      <span className="text-xs font-semibold text-slate-700 truncate w-full text-center">{c.nickname}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${childHist.length > 0 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>
                        {childHist.length} tiết
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              {/* Profile header */}
              <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-5 text-white flex items-center gap-4">
                <button onClick={() => setProfileChild(null)} className="text-xl">←</button>
                <Avatar initials={profileRecord!.avatar} id={profileRecord!.id} size="lg" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{profileRecord!.name}</h3>
                  <p className="text-orange-100 text-sm">Phụ huynh: {profileRecord!.parentName}</p>
                  <p className="text-orange-100 text-sm">{profileRecord!.notes && `⚠️ ${profileRecord!.notes}`}</p>
                  <div className="flex gap-1 mt-1">
                    {(badges[profileRecord!.id] || []).map((b, i) => <span key={i} className="text-xl">{b}</span>)}
                  </div>
                </div>
                <div className="text-center bg-white/20 rounded-xl px-4 py-2">
                  <div className="text-3xl font-black">{getChildHistory(profileRecord!.id).length}</div>
                  <div className="text-orange-100 text-xs">tiết đã lưu</div>
                </div>
              </div>

              {/* Parent-view banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2">
                <span>👨‍👩‍👦</span>
                <p className="text-sm text-amber-800 flex-1">Phụ huynh <strong>{profileRecord!.parentName}</strong> sẽ thấy thông tin này.</p>
                <button className="text-xs bg-amber-400 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-amber-500 transition-colors">
                  📤 Gửi báo cáo
                </button>
              </div>

              {/* Session history */}
              {getChildHistory(profileRecord!.id).length === 0 ? (
                <div className="bg-white border border-orange-100 rounded-2xl p-8 text-center">
                  <p className="text-slate-400 text-4xl mb-3">📭</p>
                  <p className="text-slate-500 font-semibold">Chưa có đánh giá nào cho bé này.</p>
                  <button onClick={() => { setTab('session'); setSelectedChild(profileRecord!.id); setStep('pick-session'); }}
                    className="mt-3 bg-orange-400 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-orange-500 transition-colors">
                    Thêm đánh giá đầu tiên
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {getChildHistory(profileRecord!.id).map(rec => (
                    <div key={rec.id} className="bg-white border border-orange-100 rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">{SESSION_TYPES[rec.sessionType].icon}</span>
                        <div className="flex-1">
                          <p className="font-bold text-slate-800">{rec.topic || SESSION_TYPES[rec.sessionType].label}</p>
                          <p className="text-xs text-slate-400" suppressHydrationWarning>
                            {new Date(rec.date).toLocaleDateString('vi-VN', { weekday:'long', day:'2-digit', month:'2-digit', year:'numeric' })}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-orange-500">{avgScore(rec.scores)}</div>
                          <div className="text-xs text-slate-400">/ 5.0</div>
                        </div>
                      </div>

                      {/* Stars summary */}
                      {Object.keys(rec.scores).length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {Object.entries(rec.scores).slice(0,4).map(([k, v]) => {
                            const criteria = ASSESSMENT_CRITERIA.flatMap(c => c.items).find(i => i.id === k);
                            return (
                              <div key={k} className="flex items-center gap-1 bg-orange-50 rounded-lg px-2 py-1">
                                <span className="text-xs text-slate-500 max-w-[80px] truncate">{criteria?.label || k}</span>
                                <div className="flex gap-0.5">
                                  {[1,2,3,4,5].map(s => <span key={s} className={`text-xs ${s<=v?'text-orange-400':'text-slate-200'}`}>★</span>)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {rec.comment && (
                        <div className="bg-slate-50 rounded-xl p-3">
                          <p className="text-sm text-slate-600 italic">💬 &quot;{rec.comment}&quot;</p>
                        </div>
                      )}

                      {rec.badges.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {rec.badges.map((b,i) => (
                            <span key={i} className="text-xl" title={BADGE_TYPES.find(bt=>bt.emoji===b)?.label}>{b}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          TAB 3 — AUTO-BADGES
         ════════════════════════════════════════════════════════ */}
      {tab === 'badge' && (
        <div className="flex flex-col gap-5">
          {/* Sub-tabs: rules overview vs per-child */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex gap-2 text-sm text-blue-800">
            <span>🤖</span>
            <span>Huy hiệu <strong>tự động</strong> được cấp/thu hồi theo điều kiện thực tế — không cần trao tay!</span>
          </div>

          {/* Rules table */}
          <div>
            <p className="text-sm font-bold text-slate-700 mb-3">📋 Quy tắc huy hiệu tự động</p>
            <div className="flex flex-col gap-2">
              {AUTO_BADGE_RULES.map(rule => (
                <div key={rule.badge} className="bg-white border border-orange-100 rounded-2xl p-4 flex items-start gap-3">
                  <span className="text-3xl flex-shrink-0">{rule.badge}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-800">{rule.label}</p>
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold">Tự động</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5">✅ Điều kiện: {rule.description}</p>
                    {/* Count earned */}
                    {(() => {
                      const earned = CHILDREN.filter(c => rule.check(c.id, history, MOCK_ABSENT[c.id] || 0).earned);
                      return (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          <span className="text-xs text-slate-400 self-center">{earned.length}/{CHILDREN.length} bé đạt:</span>
                          {earned.slice(0, 8).map(c => (
                            <div key={c.id} className="relative" title={c.name}>
                              <Avatar initials={c.avatar} id={c.id} size="xs" />
                            </div>
                          ))}
                          {earned.length > 8 && <span className="text-xs text-orange-500 font-bold self-center">+{earned.length - 8}</span>}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Per-child danh hiệu overview — compact table, all children visible */}
          <div>
            <p className="text-sm font-bold text-slate-700 mb-3">👶 Danh sách danh hiệu tất cả bé tháng này</p>

            {/* Header row */}
            <div className="bg-orange-400 rounded-t-2xl px-4 py-2 grid items-center gap-2"
              style={{ gridTemplateColumns: '1fr repeat(6, 28px)' }}>
              <span className="text-white text-xs font-bold">Bé</span>
              {AUTO_BADGE_RULES.map(r => (
                <span key={r.badge} className="text-center text-base" title={r.label}>{r.badge}</span>
              ))}
            </div>

            <div className="flex flex-col divide-y divide-orange-100 border border-orange-200 border-t-0 rounded-b-2xl overflow-hidden">
              {CHILDREN.map((c, idx) => {
                const absent = MOCK_ABSENT[c.id] || 0;
                const results = AUTO_BADGE_RULES.map(rule => ({
                  ...rule,
                  result: rule.check(c.id, history, absent),
                }));
                const earnedCount = results.filter(r => r.result.earned).length;
                return (
                  <div key={c.id}
                    className={`grid items-center gap-2 px-4 py-2.5 ${idx % 2 === 0 ? 'bg-white' : 'bg-orange-50/40'}`}
                    style={{ gridTemplateColumns: '1fr repeat(6, 28px)' }}>
                    {/* Child info */}
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar initials={c.avatar} id={c.id} size="xs" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{c.nickname}</p>
                        {absent > 0 && (
                          <p className={`text-xs font-semibold leading-none ${absent >= 2 ? 'text-red-400' : 'text-amber-400'}`}>
                            ⚠️ vắng {absent}
                          </p>
                        )}
                      </div>
                      <span className={`text-xs font-black flex-shrink-0 ${
                        earnedCount === AUTO_BADGE_RULES.length ? 'text-green-500' :
                        earnedCount >= 3 ? 'text-orange-500' : 'text-slate-300'
                      }`}>{earnedCount}/{AUTO_BADGE_RULES.length}</span>
                    </div>
                    {/* Badge cells */}
                    {results.map(r => (
                      <div key={r.badge} className="flex justify-center" title={r.result.reason}>
                        {r.result.earned
                          ? <span className="text-green-500 text-sm font-black">✓</span>
                          : <span className="text-slate-200 text-sm font-black">✗</span>
                        }
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-3 flex flex-wrap gap-3">
              {AUTO_BADGE_RULES.map(r => (
                <div key={r.badge} className="flex items-center gap-1 text-xs text-slate-500">
                  <span>{r.badge}</span><span>{r.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
