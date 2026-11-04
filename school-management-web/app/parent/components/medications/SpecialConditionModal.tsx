'use client';

import React from 'react';
import { X } from 'lucide-react';
import { FormConditionState } from './types';

interface SpecialConditionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formCondition: FormConditionState;
  setFormCondition: React.Dispatch<React.SetStateAction<FormConditionState>>;
  submitting: boolean;
}

export function SpecialConditionModal({
  isOpen,
  onClose,
  onSubmit,
  formCondition,
  setFormCondition,
  submitting,
}: SpecialConditionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-slate-200 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-rose-900">
              Khai Báo Bệnh Lý & Dị Ứng Của Bé
            </h3>
            <p className="text-xs text-slate-500">
              Thông tin này giúp giáo viên và nhà bếp lưu ý chăm sóc an toàn.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nhóm bệnh lý *</label>
            <select
              value={formCondition.loaiBenh}
              onChange={(e) =>
                setFormCondition({ ...formCondition, loaiBenh: e.target.value })
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:border-rose-500 focus:outline-none bg-white"
            >
              <option value="TIM_MACH">Bệnh Tim mạch bẩm sinh</option>
              <option value="DI_UNG">Dị ứng thực phẩm / Kháng sinh</option>
              <option value="THAN_KINH_CO_GIAT">Thần kinh / Tiền sử sốt co giật</option>
              <option value="HEN_SUYEN">Hen suyễn / Bệnh hô hấp mãn tính</option>
              <option value="KHAC">Bệnh lý nền khác</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Tên bệnh / Dị ứng chi tiết *
            </label>
            <input
              type="text"
              required
              placeholder="VD: Dị ứng đậu phộng, Tim thông liên thất nhẹ..."
              value={formCondition.tenBenh}
              onChange={(e) =>
                setFormCondition({ ...formCondition, tenBenh: e.target.value })
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Mức độ cảnh báo</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 1, label: 'Theo dõi nhẹ' },
                { val: 2, label: 'Cần chú ý' },
                { val: 3, label: 'Nguy hiểm' },
              ].map((level) => (
                <button
                  type="button"
                  key={level.val}
                  onClick={() =>
                    setFormCondition({ ...formCondition, mucDoNguyHiem: level.val })
                  }
                  className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer text-center ${
                    formCondition.mucDoNguyHiem === level.val
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Lưu ý khi vận động & vui chơi
            </label>
            <input
              type="text"
              placeholder="VD: Không tham gia chạy nhảy quá 10 phút, tránh trời nắng gắt..."
              value={formCondition.luuYVanDong}
              onChange={(e) =>
                setFormCondition({ ...formCondition, luuYVanDong: e.target.value })
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Kiêng cữ ăn uống (Báo cho nhà bếp)
            </label>
            <input
              type="text"
              placeholder="VD: Tuyệt đối không ăn tôm, cua, đậu phộng, sữa bò..."
              value={formCondition.luuYAnUong}
              onChange={(e) =>
                setFormCondition({ ...formCondition, luuYAnUong: e.target.value })
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Hướng dẫn sơ cứu khẩn cấp cho cô
            </label>
            <textarea
              rows={2}
              placeholder="VD: Đặt bé nằm nghiêng, nới lỏng áo, lấy bình xịt hen ở ngăn ngoài balo..."
              value={formCondition.phacDoSoCuu}
              onChange={(e) =>
                setFormCondition({ ...formCondition, phacDoSoCuu: e.target.value })
              }
              className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Số điện thoại khẩn cấp của gia đình *
            </label>
            <input
              type="tel"
              placeholder="VD: 0988 123 456 (Mẹ bé)"
              value={formCondition.soDienThoaiKhanCap}
              onChange={(e) =>
                setFormCondition({ ...formCondition, soDienThoaiKhanCap: e.target.value })
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition shadow-sm cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Đang lưu...' : 'Lưu hồ sơ sức khỏe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
