'use client';
import { useState } from 'react';
import { CHILDREN, ASSESSMENT_CRITERIA, BADGE_TYPES, DEFAULT_BADGES } from '../data/mockData';
import Avatar from '../components/Avatar';
import StarRating from '../components/StarRating';

type Tab = 'criteria' | 'badge' | 'report';

export default function AssessmentPage() {
  const [tab, setTab] = useState<Tab>('criteria');
  const [selectedChild, setSelectedChild] = useState<number | null>(null);
  const [scores, setScores] = useState<Record<number, Record<string, number>>>({});
  const [badges, setBadges] = useState<Record<number, string[]>>(DEFAULT_BADGES);
  const [groupMode, setGroupMode] = useState(false);
  const [groupSelected, setGroupSelected] = useState<Set<number>>(new Set());
  const [groupScore, setGroupScore] = useState<Record<string, number>>({});
  const [comment, setComment] = useState<Record<number, string>>({});
  const [saved, setSaved] = useState(false);

  const child = CHILDREN.find(c => c.id === selectedChild);

  const handleGroupApply = () => {
    const updatedScores = { ...scores };
    groupSelected.forEach(id => {
      updatedScores[id] = { ...updatedScores[id], ...groupScore };
    });
    setScores(updatedScores);
    setSaved(true);
    setGroupMode(false);
    setGroupSelected(new Set());
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSave = () => {
    setSelectedChild(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const getAvgScore = (childId: number) => {
    const s = scores[childId];
    if (!s || Object.keys(s).length === 0) return 3.5 + (childId % 3) * 0.3;
    return Object.values(s).reduce((a, b) => a + b, 0) / Object.keys(s).length;
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-4">
      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { k: 'criteria', label: '📊 Đánh giá tiêu chí' },
          { k: 'badge', label: '🌹 Trao huy hiệu' },
          { k: 'report', label: '📄 Nhận xét' },
        ].map(t => (
          <button
            key={t.k}
            onClick={() => setTab(t.k as Tab)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              tab === t.k
                ? 'bg-orange-400 text-white shadow-md'
                : 'bg-white border border-orange-200 text-orange-600 hover:bg-orange-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── CRITERIA TAB ─────────────────────────────────── */}
      {tab === 'criteria' && (
        <>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-orange-50 border border-orange-200 rounded-xl p-2 flex items-center gap-2">
              <span>💡</span>
              <p className="text-xs text-orange-800">
                {groupMode
                  ? `Đã chọn ${groupSelected.size} bé. Đánh giá nhóm cùng lúc!`
                  : 'Chọn từng bé hoặc bật chế độ nhóm để đánh giá nhiều bé cùng lúc.'}
              </p>
            </div>
            <button
              onClick={() => { setGroupMode(!groupMode); setGroupSelected(new Set()); }}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                groupMode
                  ? 'bg-orange-400 text-white'
                  : 'bg-white border border-orange-300 text-orange-600'
              }`}
            >
              {groupMode ? '✓ Nhóm ON' : 'Chọn nhóm'}
            </button>
          </div>

          {/* Group assessment panel */}
          {groupMode && groupSelected.size > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 slide-in">
              <p className="font-bold text-blue-800 mb-3">
                Đánh giá nhóm ({groupSelected.size} bé đã chọn)
              </p>
              {ASSESSMENT_CRITERIA.slice(0, 2).map(cat => (
                <div key={cat.category} className="mb-3">
                  <p className="text-sm font-semibold text-slate-600 mb-2">
                    {cat.icon} {cat.category}
                  </p>
                  {cat.items.slice(0, 3).map(item => (
                    <div key={item.id} className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs text-slate-600 flex-1">{item.label}</span>
                      <StarRating
                        value={groupScore[item.id] || 0}
                        onChange={v => setGroupScore(p => ({ ...p, [item.id]: v }))}
                      />
                    </div>
                  ))}
                </div>
              ))}
              <button
                onClick={handleGroupApply}
                className="w-full bg-blue-500 text-white py-2 rounded-xl font-bold text-sm mt-2 hover:bg-blue-600 transition-colors"
              >
                Áp dụng cho {groupSelected.size} bé đã chọn
              </button>
            </div>
          )}

          {/* Children grid */}
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
            {CHILDREN.map(c => {
              const avg = getAvgScore(c.id);
              const isSelected = groupMode && groupSelected.has(c.id);
              return (
                <button
                  key={c.id}
                  onClick={() =>
                    groupMode
                      ? setGroupSelected(p => {
                          const n = new Set(p);
                          n.has(c.id) ? n.delete(c.id) : n.add(c.id);
                          return n;
                        })
                      : setSelectedChild(c.id)
                  }
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'bg-orange-100 border-orange-400'
                      : 'bg-white border-orange-100 hover:border-orange-300'
                  }`}
                >
                  <div className="relative">
                    <Avatar initials={c.avatar} id={c.id} size="sm" />
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-full text-white text-xs flex items-center justify-center">
                        ✓
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 text-center truncate w-full">
                    {c.nickname}
                  </span>
                  <div className="flex gap-0.5 justify-center">
                    {[1, 2, 3, 4, 5].map(s => (
                      <span key={s} className={`text-xs ${s <= Math.round(avg) ? 'text-orange-400' : 'text-slate-200'}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-0.5">
                    {(badges[c.id] || []).slice(0, 2).map((b, i) => (
                      <span key={i} className="text-xs">{b}</span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Child detail modal */}
          {selectedChild !== null && child && (
            <div
              className="fixed inset-0 bg-black/40 z-50 overflow-y-auto flex"
              onClick={() => setSelectedChild(null)}
            >
              <div
                className="bg-white w-full max-w-lg mx-auto my-4 rounded-2xl overflow-hidden slide-in"
                onClick={e => e.stopPropagation()}
              >
                <div className="bg-gradient-to-br from-orange-400 to-orange-500 p-5 flex items-center gap-3">
                  <button onClick={() => setSelectedChild(null)} className="text-white text-2xl">
                    ←
                  </button>
                  <Avatar initials={child.avatar} id={child.id} size="md" />
                  <div className="flex-1">
                    <h3 className="text-white font-bold">{child.name}</h3>
                    <p className="text-orange-100 text-sm" suppressHydrationWarning>Đánh giá tháng {new Date().toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' })}</p>
                  </div>
                  <div className="flex gap-1">
                    {(badges[child.id] || []).map((b, i) => (
                      <span key={i} className="text-2xl">{b}</span>
                    ))}
                  </div>
                </div>
                <div className="p-4 flex flex-col gap-5 overflow-y-auto max-h-[70vh]">
                  {ASSESSMENT_CRITERIA.map(cat => (
                    <div key={cat.category}>
                      <div className="flex items-center gap-2 mb-3 pb-1 border-b border-slate-100">
                        <span className="text-lg">{cat.icon}</span>
                        <span className="font-bold text-slate-800">{cat.category}</span>
                        <span
                          className="ml-auto text-xs px-2 py-0.5 rounded-full text-white font-semibold"
                          style={{ background: cat.color }}
                        >
                          {cat.items.length} tiêu chí
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        {cat.items.map(item => (
                          <div key={item.id} className="flex items-center gap-2">
                            <span className="text-sm text-slate-600 flex-1">{item.label}</span>
                            <StarRating
                              value={scores[child.id]?.[item.id] || 0}
                              onChange={v =>
                                setScores(p => ({
                                  ...p,
                                  [child.id]: { ...p[child.id], [item.id]: v },
                                }))
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div>
                    <p className="text-sm font-bold text-slate-700 mb-2">Nhận xét tổng thể</p>
                    <textarea
                      value={comment[child.id] || ''}
                      onChange={e => setComment(p => ({ ...p, [child.id]: e.target.value }))}
                      className="w-full border border-orange-200 rounded-xl p-3 text-sm focus:outline-none focus:border-orange-400 resize-none"
                      rows={3}
                      placeholder={`Nhận xét về bé ${child.nickname}...`}
                    />
                  </div>
                  <button
                    onClick={handleSave}
                    className="w-full bg-orange-400 text-white py-3 rounded-xl font-bold hover:bg-orange-500 transition-colors"
                  >
                    Lưu đánh giá
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── BADGE TAB ─────────────────────────────────────── */}
      {tab === 'badge' && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-600 font-semibold">
            Chọn bé và trao huy hiệu phù hợp — nhấn lại để bỏ:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BADGE_TYPES.map(b => (
              <div key={b.emoji} className="bg-white border border-orange-100 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{b.emoji}</span>
                  <div>
                    <p className="font-bold text-slate-800">{b.label}</p>
                    <p className="text-xs text-slate-500">{b.desc}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {CHILDREN.map(c => {
                    const has = (badges[c.id] || []).includes(b.emoji);
                    return (
                      <button
                        key={c.id}
                        title={c.name}
                        onClick={() =>
                          setBadges(p => ({
                            ...p,
                            [c.id]: has
                              ? (p[c.id] || []).filter(x => x !== b.emoji)
                              : [...(p[c.id] || []), b.emoji],
                          }))
                        }
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                          has
                            ? 'border-orange-400 bg-orange-100 scale-110'
                            : 'border-slate-200 bg-slate-50 hover:border-orange-200'
                        }`}
                      >
                        <Avatar initials={c.avatar} id={c.id} size="xs" />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── REPORT TAB ────────────────────────────────────── */}
      {tab === 'report' && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-slate-600">
            Nhận xét cuối tháng dựa theo kết quả đánh giá:
          </p>
          {CHILDREN.map(c => {
            const avg = getAvgScore(c.id);
            const childBadges = badges[c.id] || [];
            const autoComment =
              avg >= 4.5
                ? `Bé ${c.nickname} xuất sắc trong tháng, tiến bộ vượt bậc ở nhiều lĩnh vực.`
                : avg >= 3.5
                ? `Bé ${c.nickname} có nhiều tiến bộ, đặc biệt về kỹ năng xã hội và nhận thức.`
                : `Bé ${c.nickname} đang cố gắng, cần thêm sự hỗ trợ từ giáo viên và gia đình.`;

            return (
              <div key={c.id} className="bg-white border border-orange-100 rounded-2xl p-4 card-hover">
                <div className="flex items-center gap-3">
                  <Avatar initials={c.avatar} id={c.id} size="md" />
                  <div className="flex-1">
                    <p className="font-bold text-slate-800">{c.nickname}</p>
                    <p className="text-xs text-slate-500">{c.name}</p>
                    <div className="flex gap-1 mt-1">
                      {childBadges.map((bd, i) => <span key={i}>{bd}</span>)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-orange-500">{avg.toFixed(1)}</div>
                    <div className="text-xs text-slate-400">/ 5.0</div>
                  </div>
                </div>
                <div className="flex gap-0.5 mt-2 mb-2">
                  {[1, 2, 3, 4, 5].map(s => (
                    <span key={s} className={`text-base ${s <= Math.round(avg) ? 'text-orange-400' : 'text-slate-200'}`}>
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-sm text-slate-600 italic">
                  {comment[c.id] || autoComment}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2 slide-in fixed bottom-6 right-6 shadow-lg z-40">
          <span>✅</span>
          <span className="text-green-700 font-semibold text-sm">Đã lưu đánh giá thành công!</span>
        </div>
      )}
    </div>
  );
}
