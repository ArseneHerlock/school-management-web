'use client';

import React from 'react';
import { Pill, Clock, Plus } from 'lucide-react';
import { MedicationItem } from '@/services/medications';
import { getStatusBadge } from './types';

interface TodayMedicationsSectionProps {
  todayMeds: MedicationItem[];
  onOpenCreate: () => void;
}

export function TodayMedicationsSection({
  todayMeds,
  onOpenCreate,
}: TodayMedicationsSectionProps) {
  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600">
            <Clock size={15} />
          </span>
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-wide">
            Đơn dặn thuốc hôm nay (Ngày {new Date().toLocaleDateString('vi-VN')})
          </h2>
        </div>
        <span className="text-xs font-bold text-indigo-600">{todayMeds.length} đơn</span>
      </div>

      {todayMeds.length === 0 ? (
        <div className="text-center py-10 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Pill size={24} />
          </div>
          <p className="text-xs font-semibold text-slate-500">
            Hôm nay gia đình chưa gửi đơn dặn thuốc nào cho bé.
          </p>
          <button
            onClick={onOpenCreate}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
          >
            <Plus size={14} /> Gửi thuốc hôm nay
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {todayMeds.map((med) => {
            const statusInfo = getStatusBadge(med.TrangThai);
            return (
              <div
                key={med.Id}
                className="rounded-2xl border border-slate-200 p-4 sm:p-5 bg-slate-50/50 hover:bg-slate-50 transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                      <Pill size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                        {med.TenThuoc}
                      </h3>
                      <p className="text-xs font-semibold text-indigo-600">
                        Liều lượng: {med.LieuLuong}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${statusInfo.color}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${statusInfo.dot}`}></span>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Thời gian dặn uống:
                    </span>
                    <strong className="text-slate-800 text-xs">{med.GioUongDuKien}</strong>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Bảo quản:
                    </span>
                    <span className="text-slate-800 font-medium">
                      {med.BaoQuan || 'Nhiệt độ phòng'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Kết quả thực tế:
                    </span>
                    {med.TrangThai === 'DA_CHO_UONG' ? (
                      <span className="text-emerald-700 font-bold">
                        Đã uống lúc {med.GioUongThucTe || 'đúng giờ'} (
                        {med.GiaoVienXacNhan || 'Cô phụ trách'})
                      </span>
                    ) : (
                      <span className="text-slate-500 italic">
                        Chưa đến giờ hoặc đang xử lý
                      </span>
                    )}
                  </div>
                </div>

                {med.LoiNhan && (
                  <div className="bg-amber-50/70 border border-amber-200/70 rounded-xl p-3 text-xs text-amber-900 leading-relaxed">
                    <strong className="text-amber-950 font-bold block mb-0.5">
                      Lời dặn gửi cô giáo:
                    </strong>
                    {med.LoiNhan}
                  </div>
                )}

                {med.GhiChuGiaoVien && (
                  <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 text-xs text-sky-900 leading-relaxed">
                    <strong className="text-sky-950 font-bold block mb-0.5">
                      Phản hồi từ cô giáo:
                    </strong>
                    {med.GhiChuGiaoVien}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
