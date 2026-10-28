'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  HeartPulse,
  Sparkles,
  TrendingUp,
  Users,
  Ruler,
  Scale,
  Activity,
  ArrowRight,
  Info,
} from 'lucide-react';
import Avatar from '../../components/Avatar';
import { Child } from '../../data';
import { evaluateWhoMetrics, WhoAssessmentResult } from './whoStandards';

interface TeacherHealthFCMProps {
  childrenList: Child[];
  liveHealth: Record<string, any>;
  onSelectChildToInspect?: (child: Child) => void;
}

export const TeacherHealthFCM: React.FC<TeacherHealthFCMProps> = ({
  childrenList,
  liveHealth,
  onSelectChildToInspect,
}) => {
  const [filterGroup, setFilterGroup] = useState<'ALL' | 'NORMAL' | 'STUNTED' | 'UNDERWEIGHT' | 'WASTED' | 'OVERWEIGHT'>('ALL');

  // Phân loại từng học sinh theo 3 chỉ số WHO
  const assessedList: Array<{
    child: Child;
    weight: number;
    height: number;
    assessment: WhoAssessmentResult;
  }> = [];

  const unmeasuredList: Child[] = [];

  childrenList.forEach((c) => {
    const rec = liveHealth[c.id];
    const weight = rec?.canNang != null ? Number(rec.canNang) : null;
    const height = rec?.chieuCao != null ? Number(rec.chieuCao) : null;

    if (weight && height && weight > 0 && height > 0) {
      const assessment = evaluateWhoMetrics(weight, height, c.dob, c.gender);
      assessedList.push({ child: c, weight, height, assessment });
    } else {
      unmeasuredList.push(c);
    }
  });

  const normalGroup = assessedList.filter((x) => !x.assessment.canCanThiep);
  const stuntedGroup = assessedList.filter((x) => x.assessment.haz.isAlert); // Thấp còi (HAZ < -2SD)
  const underweightGroup = assessedList.filter((x) => x.assessment.waz.isAlert); // Nhẹ cân (WAZ < -2SD)
  const wastedGroup = assessedList.filter((x) => x.assessment.whz.code.startsWith('GAY_COM')); // Gầy còm (WHZ < -2SD)
  const overweightGroup = assessedList.filter((x) => x.assessment.whz.code === 'THUA_CAN' || x.assessment.whz.code === 'BEO_PHI'); // Thừa cân/Béo phì

  const totalAssessed = assessedList.length;
  const normalRate = totalAssessed > 0 ? Math.round((normalGroup.length / totalAssessed) * 100) : 0;

  // Lọc danh sách theo nhóm đang chọn
  const displayList = assessedList.filter((x) => {
    if (filterGroup === 'NORMAL') return !x.assessment.canCanThiep;
    if (filterGroup === 'STUNTED') return x.assessment.haz.isAlert;
    if (filterGroup === 'UNDERWEIGHT') return x.assessment.waz.isAlert;
    if (filterGroup === 'WASTED') return x.assessment.whz.code.startsWith('GAY_COM');
    if (filterGroup === 'OVERWEIGHT') return x.assessment.whz.code === 'THUA_CAN' || x.assessment.whz.code === 'BEO_PHI';
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Banner Tổng quan thể trạng lớp theo WHO */}
      <div className="rounded-3xl border border-orange-200 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 p-6 text-white shadow-md shadow-orange-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-black uppercase tracking-wider backdrop-blur-md">
              BÁO CÁO THỂ TRẠNG WHO (0 - 5 TUỔI)
            </span>
            <h2 className="text-xl sm:text-2xl font-black mt-2">
              Giám Sát Thể Trạng & Cảnh Báo Sớm
            </h2>
            <p className="text-xs text-orange-100 font-medium mt-1">
              Hệ thống tự động phân loại theo 3 chỉ số <strong>HAZ (Thấp còi)</strong>, <strong>WAZ (Nhẹ cân)</strong> và <strong>WHZ (Gầy còm / Thừa cân)</strong> để cô giáo kịp thời phối hợp can thiệp.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/15 px-5 py-3 rounded-2xl border border-white/20 backdrop-blur-md text-center">
            <div>
              <p className="text-2xl font-black">{normalRate}%</p>
              <p className="text-[10px] uppercase font-bold text-orange-100">Chuẩn WHO</p>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div>
              <p className="text-2xl font-black">{totalAssessed}</p>
              <p className="text-[10px] uppercase font-bold text-orange-100">Bé đã đo</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Thẻ Phân Nhóm Thể Trạng Cho Cô Giáo Quan Sát */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Bình thường */}
        <button
          type="button"
          onClick={() => setFilterGroup(filterGroup === 'NORMAL' ? 'ALL' : 'NORMAL')}
          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
            filterGroup === 'NORMAL'
              ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
              : 'bg-white border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <CheckCircle2 size={18} className={filterGroup === 'NORMAL' ? 'text-white' : 'text-emerald-500'} />
            <span className="text-lg font-black">{normalGroup.length}</span>
          </div>
          <p className="text-xs font-black mt-2">Bình thường (Đạt)</p>
          <p className={`text-[10px] ${filterGroup === 'NORMAL' ? 'text-emerald-100' : 'text-slate-400'}`}>Thể trạng cân đối</p>
        </button>

        {/* Thấp còi (HAZ) */}
        <button
          type="button"
          onClick={() => setFilterGroup(filterGroup === 'STUNTED' ? 'ALL' : 'STUNTED')}
          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
            filterGroup === 'STUNTED'
              ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
              : 'bg-white border-slate-200 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <Ruler size={18} className={filterGroup === 'STUNTED' ? 'text-white' : 'text-blue-500'} />
            <span className="text-lg font-black">{stuntedGroup.length}</span>
          </div>
          <p className="text-xs font-black mt-2">Thấp còi (HAZ)</p>
          <p className={`text-[10px] ${filterGroup === 'STUNTED' ? 'text-blue-100' : 'text-slate-400'}`}>Chiều cao &lt; -2 SD</p>
        </button>

        {/* Nhẹ cân (WAZ) */}
        <button
          type="button"
          onClick={() => setFilterGroup(filterGroup === 'UNDERWEIGHT' ? 'ALL' : 'UNDERWEIGHT')}
          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
            filterGroup === 'UNDERWEIGHT'
              ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
              : 'bg-white border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <Scale size={18} className={filterGroup === 'UNDERWEIGHT' ? 'text-white' : 'text-amber-500'} />
            <span className="text-lg font-black">{underweightGroup.length}</span>
          </div>
          <p className="text-xs font-black mt-2">Nhẹ cân (WAZ)</p>
          <p className={`text-[10px] ${filterGroup === 'UNDERWEIGHT' ? 'text-amber-100' : 'text-slate-400'}`}>Cân nặng &lt; -2 SD</p>
        </button>

        {/* Gầy còm (WHZ) */}
        <button
          type="button"
          onClick={() => setFilterGroup(filterGroup === 'WASTED' ? 'ALL' : 'WASTED')}
          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
            filterGroup === 'WASTED'
              ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
              : 'bg-white border-slate-200 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <Activity size={18} className={filterGroup === 'WASTED' ? 'text-white' : 'text-rose-500'} />
            <span className="text-lg font-black">{wastedGroup.length}</span>
          </div>
          <p className="text-xs font-black mt-2">Gầy còm (WHZ)</p>
          <p className={`text-[10px] ${filterGroup === 'WASTED' ? 'text-rose-100' : 'text-slate-400'}`}>Cấp tính &lt; -2 SD</p>
        </button>

        {/* Thừa cân / Béo phì */}
        <button
          type="button"
          onClick={() => setFilterGroup(filterGroup === 'OVERWEIGHT' ? 'ALL' : 'OVERWEIGHT')}
          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
            filterGroup === 'OVERWEIGHT'
              ? 'bg-orange-500 text-white border-orange-600 shadow-sm'
              : 'bg-white border-slate-200 hover:border-orange-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <AlertTriangle size={18} className={filterGroup === 'OVERWEIGHT' ? 'text-white' : 'text-orange-500'} />
            <span className="text-lg font-black">{overweightGroup.length}</span>
          </div>
          <p className="text-xs font-black mt-2">Thừa cân / Béo phì</p>
          <p className={`text-[10px] ${filterGroup === 'OVERWEIGHT' ? 'text-orange-100' : 'text-slate-400'}`}>WHZ &gt; +2 SD</p>
        </button>
      </div>

      {/* Hướng dẫn can thiệp kịp thời cho giáo viên */}
      <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200/80 text-xs text-indigo-950 flex items-start gap-3">
        <Info size={18} className="text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Biện pháp điều chỉnh kịp thời cho giáo viên: </span>
          {filterGroup === 'STUNTED' && 'Với các bé thấp còi: Nhắc nhở phụ huynh bổ sung vi chất (Canxi, Kẽm, Vitamin D3); khuyến khích bé uống đủ sữa tại lớp và tham gia các hoạt động vươn vai, kéo giãn ngoài trời.'}
          {filterGroup === 'UNDERWEIGHT' && 'Với các bé nhẹ cân: Phối hợp nhà bếp tăng khẩu phần đạm và dầu mỡ lành mạnh; theo dõi bé ăn hết suất và bổ sung bữa phụ buổi chiều.'}
          {filterGroup === 'WASTED' && 'Với các bé gầy còm (suy dinh dưỡng cấp): Báo ngay cho phụ huynh và nhân viên y tế trường để có chế độ chăm sóc và theo dõi cân nặng hàng tuần.'}
          {filterGroup === 'OVERWEIGHT' && 'Với các bé thừa cân / béo phì: Hạn chế cho bé ăn thêm tinh bột hoặc uống nước ngọt có đường; khuyến khích bé làm "trực nhật", tăng cường chạy nhảy vận động ngoài trời ít nhất 60 phút mỗi ngày.'}
          {(filterGroup === 'ALL' || filterGroup === 'NORMAL') && 'Bấm vào từng nhóm ở trên để lọc danh sách các bé cần hỗ trợ đặc biệt. Cô có thể bấm vào từng học sinh để xem chi tiết biểu đồ phát triển.'}
        </div>
      </div>

      {/* Danh sách học sinh theo trạng thái phân loại */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {displayList.map(({ child, weight, height, assessment }) => {
          return (
            <div
              key={child.id}
              onClick={() => onSelectChildToInspect?.(child)}
              className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-orange-300 hover:shadow-sm transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Avatar initials={child.avatar} id={child.id} size="sm" />
                    <div>
                      <p className="font-black text-slate-800 text-xs">{child.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {child.gender === 'F' ? '♀ Bé gái' : '♂ Bé trai'} · {assessment.ageMonths} tháng
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      assessment.canCanThiep
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    {assessment.trangThaiTongThe}
                  </span>
                </div>

                {/* 3 chỉ số Z-score */}
                <div className="grid grid-cols-3 gap-1.5 mt-3 pt-2.5 border-t border-slate-100 text-center">
                  <div className="bg-slate-50 rounded-xl p-1.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">HAZ</span>
                    <p className={`text-xs font-black ${assessment.haz.isAlert ? 'text-blue-700' : 'text-slate-700'}`}>
                      {assessment.haz.zScore > 0 ? `+${assessment.haz.zScore}` : assessment.haz.zScore}
                    </p>
                    <p className="text-[9px] text-slate-500 truncate">{assessment.haz.label}</p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-1.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">WAZ</span>
                    <p className={`text-xs font-black ${assessment.waz.isAlert ? 'text-amber-700' : 'text-slate-700'}`}>
                      {assessment.waz.zScore > 0 ? `+${assessment.waz.zScore}` : assessment.waz.zScore}
                    </p>
                    <p className="text-[9px] text-slate-500 truncate">{assessment.waz.label}</p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-1.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">WHZ</span>
                    <p className={`text-xs font-black ${assessment.whz.isAlert ? 'text-rose-700' : 'text-slate-700'}`}>
                      {assessment.whz.zScore > 0 ? `+${assessment.whz.zScore}` : assessment.whz.zScore}
                    </p>
                    <p className="text-[9px] text-slate-500 truncate">{assessment.whz.label}</p>
                  </div>
                </div>
              </div>

              {/* Lời khuyên tóm tắt */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 text-[10px] text-slate-500 flex items-center justify-between">
                <span className="truncate">{assessment.loiKhuyen}</span>
                <ArrowRight size={13} className="text-slate-400 shrink-0 ml-1" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
