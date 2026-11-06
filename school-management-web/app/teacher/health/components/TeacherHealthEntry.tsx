'use client';

import React, { useState } from 'react';
import { Calendar, Save, Loader2, CheckCircle2, Search, Info } from 'lucide-react';
import { Child } from '../../data';
import { evaluateWhoMetrics } from './whoStandards';
import { TeacherHealthCategoryCards } from './TeacherHealthCategoryCards';
import { TeacherHealthEntryTable } from './TeacherHealthEntryTable';
import { getWhoCategoryCards } from './whoCategoryCardsData';

interface TeacherHealthEntryProps {
  quarter: string;
  setQuarter: (q: string) => void;
  childrenList: Child[];
  weightVals: Record<number, string>;
  setWeightVals: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  heightVals: Record<number, string>;
  setHeightVals: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  saved: boolean;
  saving: boolean;
  onSave: () => Promise<void>;
}

export const TeacherHealthEntry: React.FC<TeacherHealthEntryProps> = ({
  quarter,
  setQuarter,
  childrenList,
  weightVals,
  setWeightVals,
  heightVals,
  setHeightVals,
  saved,
  saving,
  onSave,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  let countMeasured = 0;
  let countNormal = 0;
  let countThapCoi = 0;
  let countThapCoiNang = 0;
  let countNheCan = 0;
  let countNheCanNang = 0;
  let countGayCom = 0;
  let countGayComNang = 0;
  let countThuaCan = 0;
  let countBeoPhi = 0;

  const childAssessments = new Map<number, ReturnType<typeof evaluateWhoMetrics>>();

  childrenList.forEach((c) => {
    const w = parseFloat(weightVals[c.id] || '0');
    const h = parseFloat(heightVals[c.id] || '0');
    if (w > 0 && h > 0) {
      countMeasured++;
      const res = evaluateWhoMetrics(w, h, c.dob, c.gender);
      childAssessments.set(c.id, res);

      if (!res.canCanThiep) countNormal++;
      if (res.haz.code === 'THAP_COI') countThapCoi++;
      if (res.haz.code === 'THAP_COI_NANG') countThapCoiNang++;
      if (res.waz.code === 'NHE_CAN') countNheCan++;
      if (res.waz.code === 'NHE_CAN_NANG') countNheCanNang++;
      if (res.whz.code === 'GAY_COM') countGayCom++;
      if (res.whz.code === 'GAY_COM_NANG') countGayComNang++;
      if (res.whz.code === 'THUA_CAN' || res.waz.code === 'THUA_CAN') countThuaCan++;
      if (res.whz.code === 'BEO_PHI' || res.waz.code === 'BEO_PHI') countBeoPhi++;
    }
  });

  const matchesStatusFilter = (c: Child) => {
    if (statusFilter === 'ALL') return true;
    const res = childAssessments.get(c.id);
    if (!res) return false;
    switch (statusFilter) {
      case 'DAT_CHUAN_WHO':
        return !res.canCanThiep;
      case 'THAP_COI':
        return res.haz.code === 'THAP_COI';
      case 'THAP_COI_NANG':
        return res.haz.code === 'THAP_COI_NANG';
      case 'NHE_CAN':
        return res.waz.code === 'NHE_CAN';
      case 'NHE_CAN_NANG':
        return res.waz.code === 'NHE_CAN_NANG';
      case 'GAY_COM':
        return res.whz.code === 'GAY_COM';
      case 'GAY_COM_NANG':
        return res.whz.code === 'GAY_COM_NANG';
      case 'THUA_CAN':
        return res.whz.code === 'THUA_CAN' || res.waz.code === 'THUA_CAN';
      case 'BEO_PHI':
        return res.whz.code === 'BEO_PHI' || res.waz.code === 'BEO_PHI';
      default:
        return true;
    }
  };

  const filteredChildren = childrenList.filter(
    (c) =>
      (!search.trim() ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.nickname.toLowerCase().includes(search.toLowerCase())) &&
      matchesStatusFilter(c)
  );

  const whoCategoryCards = getWhoCategoryCards(
    countMeasured,
    childrenList.length,
    countNormal,
    countThapCoi,
    countThapCoiNang,
    countNheCan,
    countNheCanNang,
    countGayCom,
    countGayComNang,
    countThuaCan,
    countBeoPhi
  );

  return (
    <div className="space-y-4">
      {/* Thanh cấu hình đợt khám & Thống kê nhanh */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-orange-100 bg-white p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 shadow-2xs">
            <Calendar size={20} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 block">
              ĐỢT CÂN ĐO ĐỊNH KỲ (CHUẨN WHO 0 - 5 TUỔI)
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <select
                value={quarter}
                onChange={(e) => setQuarter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-black text-slate-800 outline-none focus:border-orange-400 focus:bg-white transition cursor-pointer"
              >
                <option value="Quý 1">Đợt 1 - Quý 1 (Tháng 1 - Tháng 3)</option>
                <option value="Quý 2">Đợt 2 - Quý 2 (Tháng 4 - Tháng 6)</option>
                <option value="Quý 3">Đợt 3 - Quý 3 (Tháng 7 - Tháng 9)</option>
                <option value="Quý 4">Đợt 4 - Quý 4 (Tháng 10 - Tháng 12)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Nút lưu chỉ số */}
        <button
          onClick={() => void onSave()}
          disabled={saving}
          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 text-xs font-black text-white shadow-sm shadow-orange-500/30 hover:from-orange-600 hover:to-amber-600 transition disabled:opacity-50 cursor-pointer"
        >
          {saving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Đang lưu lên hệ thống Backend...</span>
            </>
          ) : saved ? (
            <>
              <CheckCircle2 size={16} className="text-white" />
              <span>Đã lưu & tính toán thành công!</span>
            </>
          ) : (
            <>
              <Save size={16} />
              <span>Lưu số đo cả lớp ({countMeasured} bé)</span>
            </>
          )}
        </button>
      </div>

      <TeacherHealthCategoryCards
        cards={whoCategoryCards}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* Hướng dẫn nghiệp vụ */}
      <div className="flex items-center gap-2 rounded-2xl bg-amber-50/80 border border-amber-200 px-4 py-2.5 text-xs text-amber-900 font-medium">
        <Info size={16} className="text-amber-600 shrink-0" />
        <span>
          <strong>Lưu ý:</strong> Giáo viên nhập <strong>Cân nặng (kg)</strong> và <strong>Chiều cao (cm)</strong> theo đợt cân đo. Hệ thống sẽ tự động cập nhật phân loại thể trạng của từng bé vào sổ y tế.
        </span>
      </div>

      {/* Ô tìm kiếm & Bộ lọc trạng thái WHO */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative min-w-[220px] flex-1 max-w-sm">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên bé..."
              className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-orange-400 transition"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-orange-400 cursor-pointer"
          >
            <option value="ALL">Tất cả phân loại WHO ({childrenList.length} bé)</option>
            <option value="DAT_CHUAN_WHO">1. Đạt chuẩn WHO ({countNormal} bé)</option>
            <option value="THAP_COI">2. Thấp còi ({countThapCoi} bé)</option>
            <option value="THAP_COI_NANG">3. Thấp còi nặng ({countThapCoiNang} bé)</option>
            <option value="NHE_CAN">4. Nhẹ cân ({countNheCan} bé)</option>
            <option value="NHE_CAN_NANG">5. Nhẹ cân nặng ({countNheCanNang} bé)</option>
            <option value="GAY_COM">6. Gầy còm ({countGayCom} bé)</option>
            <option value="GAY_COM_NANG">7. Gầy còm nặng ({countGayComNang} bé)</option>
            <option value="THUA_CAN">8. Thừa cân ({countThuaCan} bé)</option>
            <option value="BEO_PHI">9. Béo phì ({countBeoPhi} bé)</option>
          </select>

          {statusFilter !== 'ALL' && (
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className="text-xs font-bold text-orange-600 hover:underline cursor-pointer"
            >
              Xóa lọc
            </button>
          )}
        </div>

        <span className="text-xs font-bold text-slate-500">
          Hiển thị: <strong>{filteredChildren.length}</strong> / {childrenList.length} học sinh
        </span>
      </div>

      <TeacherHealthEntryTable
        filteredChildren={filteredChildren}
        weightVals={weightVals}
        setWeightVals={setWeightVals}
        heightVals={heightVals}
        setHeightVals={setHeightVals}
      />
    </div>
  );
};
