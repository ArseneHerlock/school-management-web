'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Save,
  Loader2,
  CheckCircle2,
  Search,
  Scale,
  Ruler,
  AlertTriangle,
  Sparkles,
  Info,
  Activity,
} from 'lucide-react';
import Avatar from '../../components/Avatar';
import { Child } from '../../data';
import { evaluateWhoMetrics } from './whoStandards';

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

  const filteredChildren = childrenList.filter(
    (c) =>
      !search.trim() ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.nickname.toLowerCase().includes(search.toLowerCase())
  );

  // Thống kê nhanh tình trạng lớp theo chuẩn WHO (0 - 5 tuổi)
  let countNormal = 0;
  let countOverweightOrObese = 0;
  let countUnderweightOrStunted = 0;
  let countMeasured = 0;

  childrenList.forEach((c) => {
    const w = parseFloat(weightVals[c.id] || '0');
    const h = parseFloat(heightVals[c.id] || '0');
    if (w > 0 && h > 0) {
      countMeasured++;
      const res = evaluateWhoMetrics(w, h, c.dob, c.gender);
      if (res.canCanThiep) {
        if (res.whz.code === 'BEO_PHI' || res.whz.code === 'THUA_CAN' || res.whz.code === 'NGUY_CO_THUA_CAN') {
          countOverweightOrObese++;
        } else {
          countUnderweightOrStunted++;
        }
      } else {
        countNormal++;
      }
    }
  });

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

      {/* Thống kê thể trạng nhanh theo chuẩn WHO */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-3 border border-slate-200 text-center shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Đã có số đo</span>
          <p className="text-xl font-black text-slate-800 mt-0.5">
            {countMeasured} / {childrenList.length} bé
          </p>
        </div>

        <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-200 text-center shadow-xs">
          <span className="text-[10px] font-bold text-emerald-700 uppercase">Bình thường (WHO)</span>
          <p className="text-xl font-black text-emerald-800 mt-0.5">
            {countNormal} bé
          </p>
        </div>

        <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 text-center shadow-xs">
          <span className="text-[10px] font-bold text-amber-700 uppercase">Thấp còi / Nhẹ cân</span>
          <p className="text-xl font-black text-amber-800 mt-0.5">
            {countUnderweightOrStunted} bé
          </p>
        </div>

        <div className="bg-rose-50 rounded-2xl p-3 border border-rose-200 text-center shadow-xs">
          <span className="text-[10px] font-bold text-rose-700 uppercase">Thừa cân / Béo phì</span>
          <p className="text-xl font-black text-rose-800 mt-0.5">
            {countOverweightOrObese} bé
          </p>
        </div>
      </div>

      {/* Hướng dẫn nghiệp vụ */}
      <div className="flex items-center gap-2 rounded-2xl bg-amber-50/80 border border-amber-200 px-4 py-2.5 text-xs text-amber-900 font-medium">
        <Info size={16} className="text-amber-600 shrink-0" />
        <span>
          <strong>Vai trò giáo viên:</strong> Cô chỉ cần nhập <strong>Cân nặng (kg)</strong> và <strong>Chiều cao (cm)</strong>. Hệ thống Backend sẽ tự động lấy thông tin ngày sinh, giới tính để tính các chỉ số <strong>HAZ, WAZ, WHZ</strong> và đưa ra kết luận chuẩn WHO.
        </span>
      </div>

      {/* Ô tìm kiếm bé */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative min-w-[240px] flex-1 max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên bé..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-orange-400 transition"
          />
        </div>

        <span className="text-xs font-bold text-slate-500">
          Hiển thị: <strong>{filteredChildren.length}</strong> học sinh
        </span>
      </div>

      {/* Bảng nhập số đo thông minh */}
      <div className="rounded-3xl border border-orange-100 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto w-full max-w-full">
          <table className="w-full min-w-[850px] text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-600 bg-orange-50/50">
                <th className="py-3.5 px-4 font-black">Học sinh</th>
                <th className="py-3.5 px-4 font-black">Giới tính & Tuổi</th>
                <th className="py-3.5 px-4 text-center font-black min-w-[130px]">
                  Cân nặng (kg) <span className="text-rose-500">*</span>
                </th>
                <th className="py-3.5 px-4 text-center font-black min-w-[130px]">
                  Chiều cao (cm) <span className="text-rose-500">*</span>
                </th>
                <th className="py-3.5 px-3 text-center font-black">
                  HAZ (CC/Tuổi)
                </th>
                <th className="py-3.5 px-3 text-center font-black">
                  WAZ (CN/Tuổi)
                </th>
                <th className="py-3.5 px-3 text-center font-black">
                  WHZ (Thể trạng)
                </th>
                <th className="py-3.5 px-4 text-right font-black min-w-[160px]">
                  Đánh giá tổng quát WHO
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredChildren.map((c) => {
                const w = parseFloat(weightVals[c.id] || '0');
                const h = parseFloat(heightVals[c.id] || '0');
                const hasValidData = w > 0 && h > 0;
                const gender = c.gender === 'F' ? 'Nữ' : 'Nam';
                const assessment = hasValidData
                  ? evaluateWhoMetrics(w, h, c.dob, gender)
                  : null;

                return (
                  <tr key={c.id} className="hover:bg-orange-50/30 transition">
                    {/* Cột Học sinh */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <Avatar initials={c.avatar} id={c.id} size="sm" />
                        <div>
                          <p className="font-black text-slate-800">{c.name}</p>
                          <p className="text-[11px] text-slate-400 font-medium">({c.nickname})</p>
                        </div>
                      </div>
                    </td>

                    {/* Cột Giới tính & Ngày sinh */}
                    <td className="py-3 px-4 text-slate-500 font-medium">
                      <span
                        className={`font-bold ${
                          c.gender === 'F' ? 'text-rose-500' : 'text-blue-500'
                        }`}
                      >
                        {c.gender === 'F' ? '♀ Bé gái' : '♂ Bé trai'}
                      </span>
                      {c.dob && (
                        <div className="text-[10px] text-slate-400">
                          {c.dob} ({assessment?.ageMonths ?? '--'} tháng)
                        </div>
                      )}
                    </td>

                    {/* Cột Nhập Cân nặng */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="number"
                          step="0.1"
                          min="5"
                          max="80"
                          value={weightVals[c.id] || ''}
                          onChange={(e) =>
                            setWeightVals((prev) => ({
                              ...prev,
                              [c.id]: e.target.value,
                            }))
                          }
                          placeholder="vd: 16.5"
                          className="w-24 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-right font-bold text-slate-800 outline-none focus:border-orange-400 focus:bg-white transition"
                        />
                        <span className="text-[11px] font-bold text-slate-400">kg</span>
                      </div>
                    </td>

                    {/* Cột Nhập Chiều cao */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="number"
                          step="0.1"
                          min="50"
                          max="160"
                          value={heightVals[c.id] || ''}
                          onChange={(e) =>
                            setHeightVals((prev) => ({
                              ...prev,
                              [c.id]: e.target.value,
                            }))
                          }
                          placeholder="vd: 102.0"
                          className="w-24 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-right font-bold text-slate-800 outline-none focus:border-orange-400 focus:bg-white transition"
                        />
                        <span className="text-[11px] font-bold text-slate-400">cm</span>
                      </div>
                    </td>

                    {/* Cột HAZ (Chiều cao / Tuổi) */}
                    <td className="py-3 px-3 text-center">
                      {assessment ? (
                        <div>
                          <span className="font-mono font-bold text-xs text-slate-800">
                            {assessment.haz.zScore > 0 ? `+${assessment.haz.zScore}` : assessment.haz.zScore}
                          </span>
                          <div className={`text-[10px] font-semibold ${assessment.haz.textClass}`}>
                            {assessment.haz.label}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-300 italic">—</span>
                      )}
                    </td>

                    {/* Cột WAZ (Cân nặng / Tuổi) */}
                    <td className="py-3 px-3 text-center">
                      {assessment ? (
                        <div>
                          <span className="font-mono font-bold text-xs text-slate-800">
                            {assessment.waz.zScore > 0 ? `+${assessment.waz.zScore}` : assessment.waz.zScore}
                          </span>
                          <div className={`text-[10px] font-semibold ${assessment.waz.textClass}`}>
                            {assessment.waz.label}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-300 italic">—</span>
                      )}
                    </td>

                    {/* Cột WHZ (Thể trạng Cân nặng / Chiều cao) */}
                    <td className="py-3 px-3 text-center">
                      {assessment ? (
                        <div>
                          <span className="font-mono font-bold text-xs text-slate-800">
                            {assessment.whz.zScore > 0 ? `+${assessment.whz.zScore}` : assessment.whz.zScore}
                          </span>
                          <div className={`text-[10px] font-semibold ${assessment.whz.textClass}`}>
                            {assessment.whz.label}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-300 italic">—</span>
                      )}
                    </td>

                    {/* Cột Phân loại thể trạng WHO tự động */}
                    <td className="py-3 px-4 text-right">
                      {assessment ? (
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black border ${
                            assessment.canCanThiep
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          }`}
                          title={assessment.loiKhuyen}
                        >
                          {assessment.trangThaiTongThe}
                        </span>
                      ) : (
                        <span className="text-slate-300 text-xs italic">Chờ nhập số đo</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
