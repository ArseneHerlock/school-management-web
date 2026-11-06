import React from 'react';
import { ShieldAlert, Phone } from 'lucide-react';
import { SpecialConditionItem } from '@/services/medications';

interface MedicationSpecialTabProps {
  filteredConditions: SpecialConditionItem[];
}

export function MedicationSpecialTab({ filteredConditions }: MedicationSpecialTabProps) {
  if (filteredConditions.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
          <ShieldAlert size={28} />
        </div>
        <h3 className="text-base font-extrabold text-slate-800">
          Chưa có trẻ nào ghi nhận bệnh nền đặc biệt trong lớp
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Khi phụ huynh khai báo hồ sơ nhập học hoặc cập nhật bệnh lý (tim mạch, dị ứng, co giật...), thông tin sẽ tự động hiển thị tại đây.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {filteredConditions.map((cond) => (
        <div
          key={cond.Id}
          className="rounded-3xl border border-rose-200 bg-white p-5 space-y-3.5 shadow-xs"
        >
          <div className="flex items-start justify-between gap-3 border-b border-rose-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-black text-sm shrink-0">
                {cond.TenHocSinh ? cond.TenHocSinh.slice(0, 2).toUpperCase() : 'BE'}
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {cond.TenHocSinh || 'Học sinh'}
                </h3>
                <p className="text-xs font-bold text-rose-700">{cond.TenBenh}</p>
              </div>
            </div>

            <span
              className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                cond.MucDoNguyHiem === 3
                  ? 'bg-rose-600 text-white'
                  : cond.MucDoNguyHiem === 2
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {cond.MucDoNguyHiem === 3
                ? 'Cực kỳ nguy hiểm'
                : cond.MucDoNguyHiem === 2
                ? 'Cần chú ý'
                : 'Theo dõi nhẹ'}
            </span>
          </div>

          {cond.LuuYVanDong && (
            <div className="text-xs text-slate-700">
              <strong className="text-slate-900 block font-bold mb-0.5">Lưu ý khi vận động thể chất:</strong>
              {cond.LuuYVanDong}
            </div>
          )}

          {cond.LuuYAnUong && (
            <div className="text-xs text-slate-700">
              <strong className="text-slate-900 block font-bold mb-0.5">Kiêng cữ thức ăn (Báo nhà bếp):</strong>
              {cond.LuuYAnUong}
            </div>
          )}

          {cond.PhacDoSoCuu && (
            <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3 text-xs text-rose-900 leading-relaxed">
              <strong className="block text-rose-950 font-bold mb-0.5">Phác đồ sơ cứu khẩn cấp:</strong>
              {cond.PhacDoSoCuu}
            </div>
          )}

          {cond.SoDienThoaiKhanCap && (
            <div className="pt-1 flex items-center justify-between text-xs">
              <span className="text-slate-500">Người liên hệ khẩn cấp:</span>
              <span
                className="inline-flex items-center gap-1.5 font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200"
                title="Số điện thoại liên hệ khẩn cấp"
              >
                <span className="text-slate-400 font-medium">SĐT:</span>
                <span className="font-mono">{cond.SoDienThoaiKhanCap}</span>
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
