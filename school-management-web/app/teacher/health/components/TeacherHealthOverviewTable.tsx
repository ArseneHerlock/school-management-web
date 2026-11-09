'use client';

import React, { useState, useMemo } from 'react';
import { History, Search, Filter } from 'lucide-react';
import Avatar from '../../components/Avatar';
import { Child } from '../../data';
import { evaluateWhoMetrics } from './whoStandards';
import { TeacherHealthCategoryBadge } from './TeacherHealthCategoryBadge';

interface TeacherHealthOverviewTableProps {
  childrenList: Child[];
  liveHealth: Record<string, any>;
  onOpenHistoryModal: (c: Child) => void;
}

export function TeacherHealthOverviewTable({
  childrenList,
  liveHealth,
  onOpenHistoryModal,
}: TeacherHealthOverviewTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  const evaluatedChildren = useMemo(() => {
    return childrenList.map((c) => {
      const rec = liveHealth[c.id];
      const w = rec?.canNang != null ? Number(rec.canNang) : null;
      const h = rec?.chieuCao != null ? Number(rec.chieuCao) : null;
      const gender = c.gender === 'F' ? 'F' : 'M';
      const who = w && h && w > 0 && h > 0
        ? evaluateWhoMetrics(w, h, c.dob, gender, rec?.ngayDo)
        : null;

      let categoryCode = 'CHUA_DO';
      let categoryLabel = 'Chưa đo';

      if (who) {
        if (!who.canCanThiep) {
          categoryCode = 'DAT_CHUAN';
          categoryLabel = 'Đạt chuẩn WHO';
        } else if (who.haz.code === 'THAP_COI_NANG') {
          categoryCode = 'THAP_COI_NANG';
          categoryLabel = 'Thấp còi nặng';
        } else if (who.haz.code === 'THAP_COI') {
          categoryCode = 'THAP_COI';
          categoryLabel = 'Thấp còi';
        } else if (who.waz.code === 'NHE_CAN_NANG') {
          categoryCode = 'NHE_CAN_NANG';
          categoryLabel = 'Nhẹ cân nặng';
        } else if (who.waz.code === 'NHE_CAN') {
          categoryCode = 'NHE_CAN';
          categoryLabel = 'Nhẹ cân';
        } else if (who.whz.code === 'GAY_COM_NANG') {
          categoryCode = 'GAY_COM_NANG';
          categoryLabel = 'Gầy còm nặng';
        } else if (who.whz.code === 'GAY_COM') {
          categoryCode = 'GAY_COM';
          categoryLabel = 'Gầy còm';
        } else if (who.whz.code === 'BEO_PHI' || who.waz.code === 'BEO_PHI') {
          categoryCode = 'BEO_PHI';
          categoryLabel = 'Béo phì';
        } else if (who.whz.code === 'THUA_CAN' || who.waz.code === 'THUA_CAN') {
          categoryCode = 'THUA_CAN';
          categoryLabel = 'Thừa cân';
        } else {
          categoryCode = 'DAT_CHUAN';
          categoryLabel = 'Đạt chuẩn WHO';
        }
      }

      return {
        child: c,
        rec,
        w,
        h,
        who,
        categoryCode,
        categoryLabel,
      };
    });
  }, [childrenList, liveHealth]);

  const filteredChildren = useMemo(() => {
    return evaluatedChildren.filter(({ child, categoryCode }) => {
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        child.name.toLowerCase().includes(q) ||
        (child.nickname && child.nickname.toLowerCase().includes(q));

      const matchCategory =
        selectedFilter === 'ALL' ||
        categoryCode === selectedFilter ||
        (selectedFilter === 'CAN_CAN_THIEP' && categoryCode !== 'DAT_CHUAN' && categoryCode !== 'CHUA_DO');

      return matchSearch && matchCategory;
    });
  }, [evaluatedChildren, searchQuery, selectedFilter]);



  return (
    <div className="rounded-3xl border border-orange-100 bg-white overflow-hidden shadow-xs space-y-4">
      {/* Header & Bộ lọc tìm kiếm */}
      <div className="p-5 bg-orange-50/60 border-b border-orange-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-black uppercase text-slate-800 tracking-wide">
            Bảng tổng hợp chỉ số thể lực & Phân loại 9 nhóm WHO lớp học
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi chi tiết các chỉ số HAZ (Chiều cao/Tuổi), WAZ (Cân nặng/Tuổi) và WHZ (Thể trạng).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Ô tìm kiếm */}
          <div className="relative min-w-[180px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tên bé..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-orange-200 bg-white focus:outline-none focus:ring-1 focus:ring-orange-400"
            />
          </div>

          {/* Chọn 9 nhóm WHO */}
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="py-1.5 px-3 text-xs font-bold rounded-xl border border-orange-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-orange-400 cursor-pointer"
          >
            <option value="ALL">Tất cả thể trạng ({childrenList.length})</option>
            <option value="DAT_CHUAN">Đạt chuẩn WHO</option>
            <option value="THAP_COI">Thấp còi</option>
            <option value="THAP_COI_NANG">Thấp còi nặng</option>
            <option value="NHE_CAN">Nhẹ cân</option>
            <option value="NHE_CAN_NANG">Nhẹ cân nặng</option>
            <option value="GAY_COM">Gầy còm</option>
            <option value="GAY_COM_NANG">Gầy còm nặng</option>
            <option value="THUA_CAN">Thừa cân</option>
            <option value="BEO_PHI">Béo phì</option>
            <option value="CHUA_DO">Chưa có số đo</option>
          </select>

          <span className="text-xs text-orange-700 font-extrabold bg-orange-100 px-3 py-1.5 rounded-xl shrink-0">
            {filteredChildren.length} học sinh
          </span>
        </div>
      </div>

      <div className="overflow-x-auto px-3 sm:px-5 pb-5 w-full max-w-full">
        <div className="sm:hidden text-[10px] text-orange-600 font-bold mb-2 text-right">
          Vuốt ngang để xem đầy đủ cột →
        </div>
        <table className="w-full min-w-[760px] text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-500 bg-slate-50/60">
              <th className="py-3 px-4 font-bold">Học sinh</th>
              <th className="py-3 px-4 font-bold">Giới tính & Tuổi</th>
              <th className="py-3 px-4 text-center font-bold">Chiều cao / Cân nặng</th>
              <th className="py-3 px-4 text-center font-bold">Chiều cao / Tuổi</th>
              <th className="py-3 px-4 text-center font-bold">Cân nặng / Tuổi</th>
              <th className="py-3 px-4 text-center font-bold">Thể trạng</th>
              <th className="py-3 px-4 text-center font-bold">Kết luận thể trạng</th>
              <th className="py-3 px-4 text-right font-bold">Lịch sử tiến trình</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredChildren.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  Không tìm thấy học sinh nào phù hợp.
                </td>
              </tr>
            ) : (
              filteredChildren.map(({ child: c, rec, w, h, who, categoryCode, categoryLabel }) => {
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

                    <td className="py-3 px-4 text-center font-bold text-slate-700">
                      {h != null && w != null ? `${h} cm · ${w} kg` : (h ? `${h} cm` : (w ? `${w} kg` : '—'))}
                    </td>

                    {/* Chiều cao / Tuổi */}
                    <td className="py-3 px-4 text-center">
                      {who ? (
                        <span className={`text-[11px] font-bold ${who.haz.isAlert ? 'text-blue-700' : 'text-slate-700'}`}>
                          {who.haz.code === 'BINH_THUONG' ? 'Đạt chuẩn' : who.haz.label}
                        </span>
                      ) : (
                        <span className="text-slate-300 italic">—</span>
                      )}
                    </td>

                    {/* Cân nặng / Tuổi */}
                    <td className="py-3 px-4 text-center">
                      {who ? (
                        <span className={`text-[11px] font-bold ${who.waz.isAlert ? 'text-amber-700' : 'text-slate-700'}`}>
                          {who.waz.code === 'BINH_THUONG' ? 'Đạt chuẩn' : who.waz.label}
                        </span>
                      ) : (
                        <span className="text-slate-300 italic">—</span>
                      )}
                    </td>

                    {/* Thể trạng */}
                    <td className="py-3 px-4 text-center">
                      {who ? (
                        <span className={`text-[11px] font-bold ${who.whz.isAlert ? 'text-rose-700' : 'text-slate-700'}`}>
                          {who.whz.code === 'BINH_THUONG' ? 'Cân đối' : who.whz.label}
                        </span>
                      ) : (
                        <span className="text-slate-300 italic">—</span>
                      )}
                    </td>

                    {/* Đánh giá WHO (9 Nhóm) */}
                    <td className="py-3 px-4 text-center">
                      <TeacherHealthCategoryBadge code={categoryCode} label={categoryLabel} />
                    </td>

                    {/* Lịch sử */}
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onOpenHistoryModal(c)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-orange-200 bg-white px-3 py-1.5 text-xs font-bold text-orange-600 hover:bg-orange-50 transition cursor-pointer shadow-2xs"
                      >
                        <History size={13} />
                        Chi tiết & Lịch sử
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
