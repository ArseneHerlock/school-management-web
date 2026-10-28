'use client';

import { useState, useMemo, useEffect } from 'react';
import { getAllHealthRecords, getHealthRecords, createBatchHealthRecords } from '@/services/health';
import { CHILDREN, loadLiveTeacherChildren, Child } from '../data';
import Avatar from '../components/Avatar';
import {
  History,
  Activity,
  HeartPulse,
  TrendingUp,
  Scale,
  Ruler,
  PieChart,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { TeacherHealthHistoryModal } from './components/TeacherHealthHistoryModal';
import { TeacherHealthFCM } from './components/TeacherHealthFCM';
import { TeacherHealthEntry } from './components/TeacherHealthEntry';
import { calculateBmi, classifyWhoBmi } from './components/whoStandards';

type Mode = 'entry' | 'who' | 'view';

export default function HealthPage() {
  useEffect(() => {
    void loadLiveTeacherChildren().catch(() => undefined);
  }, []);

  const [mode, setMode] = useState<Mode>('entry');
  const [quarter, setQuarter] = useState<string>('Quý 4');
  const [weightVals, setWeightVals] = useState<Record<number, string>>({});
  const [heightVals, setHeightVals] = useState<Record<number, string>>({});
  const [saved, setSaved] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [liveHealth, setLiveHealth] = useState<Record<string, any>>({});
  const [historyModalChild, setHistoryModalChild] = useState<Child | null>(null);
  const [historyLogs, setHistoryLogs] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);

  const loadLiveHealth = async () => {
    try {
      const allRows = await getAllHealthRecords();
      const records = (Array.isArray(allRows) ? allRows : []).sort((a: any, b: any) =>
        String(b.ngayDo || '').localeCompare(String(a.ngayDo || ''))
      );

      const latestByApiId = new Map<string, any>();
      for (const rec of records) {
        const sid = String(rec.hocSinhId || rec.HocSinhId);
        if (!latestByApiId.has(sid)) {
          latestByApiId.set(sid, rec);
        }
      }

      const live: Record<string, any> = {};
      const initialWeight: Record<number, string> = {};
      const initialHeight: Record<number, string> = {};

      CHILDREN.forEach((c) => {
        if (c.apiId && latestByApiId.has(String(c.apiId))) {
          const rec = latestByApiId.get(String(c.apiId));
          live[c.id] = rec;
          if (rec.canNang) initialWeight[c.id] = String(rec.canNang);
          if (rec.chieuCao) initialHeight[c.id] = String(rec.chieuCao);
        } else {
          live[c.id] = null;
        }
      });

      setLiveHealth(live);
      setWeightVals((prev) => ({ ...initialWeight, ...prev }));
      setHeightVals((prev) => ({ ...initialHeight, ...prev }));
    } catch {
      setLiveHealth({});
    }
  };

  useEffect(() => {
    void loadLiveHealth();
  }, []);

  const handleSaveMetrics = async () => {
    try {
      setSaving(true);
      const batchList: any[] = [];

      CHILDREN.forEach((c) => {
        const wStr = weightVals[c.id];
        const hStr = heightVals[c.id];
        const numWeight = parseFloat(wStr || '0');
        const numHeight = parseFloat(hStr || '0');

        if (c.apiId && (numWeight > 0 || numHeight > 0)) {
          batchList.push({
            hocSinhId: c.apiId,
            canNang: numWeight > 0 ? numWeight : undefined,
            chieuCao: numHeight > 0 ? numHeight : undefined,
            ngaySinh: c.dob,
            gioiTinh: c.gender === 'F' ? 'Nữ' : 'Nam',
            ghiChu: `[Khám ${quarter}/${new Date().getFullYear()}] Khám sức khỏe định kỳ mầm non (Chuẩn WHO)`,
          });
        }
      });

      if (batchList.length > 0) {
        await createBatchHealthRecords({
          thang: new Date().getMonth() + 1,
          nam: new Date().getFullYear(),
          danhSach: batchList as any,
        });
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      await loadLiveHealth();
    } catch (err) {
      console.error('Lỗi lưu chỉ số sức khỏe:', err);
    } finally {
      setSaving(false);
    }
  };

  const openHistoryModal = async (child: Child) => {
    setHistoryModalChild(child);
    setHistoryLoading(true);
    try {
      if (child.apiId) {
        const rows = await getHealthRecords(child.apiId, {
          ngaySinh: child.dob,
          gioiTinh: child.gender === 'F' ? 'Nữ' : 'Nam',
        });
        setHistoryLogs(Array.isArray(rows) ? rows : []);
      } else {
        setHistoryLogs([]);
      }
    } catch {
      setHistoryLogs([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-full min-w-0 space-y-4 sm:space-y-6 overflow-x-hidden">
      {/* Header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-sm">
            <HeartPulse size={22} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200/60 truncate">
                Chăm sóc y tế & thể trạng mầm non
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 mt-1 truncate">
              Sổ Theo Dõi Sức Khỏe & Thể Trạng WHO
            </h1>
          </div>
        </div>

        <button
          onClick={() => void loadLiveHealth()}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-orange-200 bg-white px-4 py-2 text-xs font-black text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition shadow-2xs cursor-pointer shrink-0"
        >
          <RefreshCw size={15} />
          <span>Cập nhật số đo</span>
        </button>
      </header>

      {/* 3 Tabs chính */}
      <div className="flex rounded-2xl sm:rounded-3xl bg-slate-100 p-1 sm:p-1.5 border border-slate-200/80 overflow-x-auto gap-1">
        {[
          ['entry', 'Nhập số đo định kỳ', 'Nhập số đo định kỳ (Cân nặng & Chiều cao)'],
          ['who', 'Phân loại WHO', 'Phân loại thể trạng WHO & Cảnh báo béo phì'],
          ['view', 'Sổ theo dõi & Lịch sử', 'Sổ theo dõi & Lịch sử tiến trình tăng trưởng'],
        ].map(([key, shortLabel, fullLabel]) => (
          <button
            key={key}
            onClick={() => setMode(key as Mode)}
            className={`flex-1 min-w-[100px] py-2 sm:py-3 px-2 sm:px-3 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-black transition-all cursor-pointer text-center ${
              mode === key
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <span className="sm:hidden">{shortLabel}</span>
            <span className="hidden sm:inline">{fullLabel}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Nhập số đo cả lớp */}
      {mode === 'entry' && (
        <TeacherHealthEntry
          quarter={quarter}
          setQuarter={setQuarter}
          childrenList={CHILDREN}
          weightVals={weightVals}
          setWeightVals={setWeightVals}
          heightVals={heightVals}
          setHeightVals={setHeightVals}
          saved={saved}
          saving={saving}
          onSave={handleSaveMetrics}
        />
      )}

      {/* Tab 2: Phân nhóm thể trạng WHO & Cảnh báo béo phì */}
      {mode === 'who' && (
        <TeacherHealthFCM
          childrenList={CHILDREN}
          liveHealth={liveHealth}
          onSelectChildToInspect={(child) => void openHistoryModal(child)}
        />
      )}

      {/* Tab 3: Sổ theo dõi & Lịch sử tiến trình */}
      {mode === 'view' && (
        <div className="rounded-3xl border border-orange-100 bg-white overflow-hidden shadow-xs space-y-4">
          <div className="p-5 bg-orange-50/60 border-b border-orange-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black uppercase text-slate-800 tracking-wide">
                Bảng tổng hợp chỉ số thể lực & Phân loại WHO lớp học
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Chỉ số BMI được tự động tính từ cân nặng và chiều cao mới nhất.
              </p>
            </div>
            <span className="text-xs text-orange-600 font-extrabold bg-orange-100 px-3 py-1 rounded-full">
              {CHILDREN.length} học sinh
            </span>
          </div>

          <div className="overflow-x-auto px-3 sm:px-5 pb-5 w-full max-w-full">
            <div className="sm:hidden text-[10px] text-orange-600 font-bold mb-2 text-right">
              Vuốt ngang để xem đầy đủ cột →
            </div>
            <table className="w-full min-w-[680px] text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 bg-slate-50/60">
                  <th className="py-3 px-4 font-bold">Học sinh</th>
                  <th className="py-3 px-4 font-bold">Giới tính & Tuổi</th>
                  <th className="py-3 px-4 text-center font-bold">Cân nặng (kg)</th>
                  <th className="py-3 px-4 text-center font-bold">Chiều cao (cm)</th>
                  <th className="py-3 px-4 text-center font-bold">BMI (Tự tính)</th>
                  <th className="py-3 px-4 text-center font-bold">Thể trạng WHO</th>
                  <th className="py-3 px-4 text-right font-bold">Lịch sử tiến trình</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {CHILDREN.map((c) => {
                  const rec = liveHealth[c.id];
                  const w = rec?.canNang != null ? Number(rec.canNang) : null;
                  const h = rec?.chieuCao != null ? Number(rec.chieuCao) : null;
                  const bmi = calculateBmi(w, h);
                  const gender = c.gender === 'F' ? 'F' : 'M';
                  const classification = classifyWhoBmi(bmi, gender, c.dob);

                  return (
                    <tr key={c.id} className="hover:bg-orange-50/30 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <Avatar initials={c.avatar} id={c.id} size="xs" />
                          <div>
                            <p className="font-black text-slate-800">{c.name}</p>
                            <p className="text-[11px] text-slate-400 font-medium">({c.nickname})</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-500">
                        <span className={c.gender === 'F' ? 'text-rose-500 font-bold' : 'text-blue-500 font-bold'}>
                          {c.gender === 'F' ? '♀ Nữ' : '♂ Nam'}
                        </span>
                        {c.dob && <span className="ml-2 text-slate-400">· {c.dob}</span>}
                      </td>

                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">
                        {w != null ? `${w} kg` : '—'}
                      </td>

                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">
                        {h != null ? `${h} cm` : '—'}
                      </td>

                      <td className="py-3 px-4 text-center">
                        {bmi != null ? (
                          <span className="font-mono font-black text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/50">
                            {bmi}
                          </span>
                        ) : (
                          <span className="text-slate-300 italic">—</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center">
                        {bmi != null ? (
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black border ${classification.badgeBg} ${classification.textClass} ${classification.borderClass}`}
                          >
                            {classification.shortLabel}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">Chưa đo</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => void openHistoryModal(c)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-orange-200 bg-orange-50 text-xs font-black text-orange-600 hover:bg-orange-100 transition cursor-pointer"
                        >
                          <History size={13} />
                          <span>Xem tiến trình</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Lịch sử khám & Tiến trình tăng trưởng của từng bé */}
      <TeacherHealthHistoryModal
        child={historyModalChild}
        historyLogs={historyLogs}
        historyLoading={historyLoading}
        onClose={() => setHistoryModalChild(null)}
      />
    </div>
  );
}
