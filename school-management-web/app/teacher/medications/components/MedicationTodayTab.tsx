import React from 'react';
import { CheckCircle2, AlertTriangle, Clock, Check } from 'lucide-react';
import { MedicationItem } from '@/services/medications';

interface MedicationTodayTabProps {
  filteredTodayMeds: MedicationItem[];
  onOpenConfirm: (item: MedicationItem, type: 'SUCCESS' | 'ISSUE') => void;
}

export function MedicationTodayTab({
  filteredTodayMeds,
  onOpenConfirm,
}: MedicationTodayTabProps) {
  if (filteredTodayMeds.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
          <CheckCircle2 size={28} />
        </div>
        <h3 className="text-base font-extrabold text-slate-800">
          Lớp không có bé nào phải uống thuốc trưa nay
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Tất cả học sinh đều khỏe mạnh hoặc gia đình chưa gửi đơn thuốc mới nào cho ngày hôm nay.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {filteredTodayMeds.map((med) => {
        const isGiven = med.TrangThai === 'DA_CHO_UONG';
        const isIssue = med.TrangThai === 'SU_CO';

        return (
          <div
            key={med.Id}
            className={`rounded-3xl border transition p-5 space-y-4 shadow-xs ${
              isGiven
                ? 'bg-emerald-50/40 border-emerald-200'
                : isIssue
                ? 'bg-rose-50/40 border-rose-200'
                : 'bg-white border-slate-200 hover:border-orange-300'
            }`}
          >
            {/* Header bé & tình trạng */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center font-black text-sm shrink-0">
                  {med.TenHocSinh ? med.TenHocSinh.slice(0, 2).toUpperCase() : 'BE'}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {med.TenHocSinh || 'Học sinh'}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">
                    Người gửi: <span className="text-slate-800">{med.TenNguoiGui || 'Phụ huynh'}</span>
                  </p>
                </div>
              </div>

              {isGiven ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <Check size={13} /> Đã cho uống
                </span>
              ) : isIssue ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                  <AlertTriangle size={13} /> Có sự cố
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  <Clock size={13} /> Chờ đến giờ uống
                </span>
              )}
            </div>

            {/* Chi tiết thuốc & Liều lượng */}
            <div className="bg-slate-50/80 rounded-2xl p-3.5 space-y-2 text-xs border border-slate-100">
              <div className="flex items-baseline justify-between">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Tên thuốc:</span>
                <strong className="text-sm font-extrabold text-slate-900">{med.TenThuoc}</strong>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Liều lượng:</span>
                <strong className="text-xs font-bold text-orange-600">{med.LieuLuong}</strong>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Giờ dặn uống:</span>
                <span className="font-semibold text-slate-800">{med.GioUongDuKien}</span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Bảo quản:</span>
                <span className="font-medium text-slate-600">{med.BaoQuan || 'Nhiệt độ phòng'}</span>
              </div>
            </div>

            {/* Lời nhắn dặn dò của mẹ */}
            {med.LoiNhan && (
              <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900 leading-relaxed">
                <strong className="block text-amber-950 font-bold mb-0.5">Lời dặn của phụ huynh:</strong>
                {med.LoiNhan}
              </div>
            )}

            {isGiven && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-2.5 text-xs text-emerald-900">
                Đã uống lúc <strong>{med.GioUongThucTe}</strong> · Người cho uống: <strong>{med.GiaoVienXacNhan}</strong>
              </div>
            )}

            {isIssue && med.GhiChuGiaoVien && (
              <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-2.5 text-xs text-rose-900">
                Ghi chú sự cố: <strong>{med.GhiChuGiaoVien}</strong>
              </div>
            )}

            {/* Action Buttons */}
            {!isGiven && (
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => onOpenConfirm(med, 'SUCCESS')}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                >
                  <CheckCircle2 size={16} />
                  <span>Xác nhận đã cho uống</span>
                </button>

                <button
                  onClick={() => onOpenConfirm(med, 'ISSUE')}
                  className="inline-flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 text-rose-700 font-bold text-xs transition cursor-pointer"
                  title="Báo cáo nôn trớ / Chưa uống được"
                >
                  <AlertTriangle size={15} />
                  <span className="hidden sm:inline">Sự cố</span>
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
