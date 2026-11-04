import React from 'react';
import { X } from 'lucide-react';
import { MedicationItem } from '@/services/medications';

interface MedicationConfirmModalProps {
  confirmModalItem: MedicationItem | null;
  confirmType: 'SUCCESS' | 'ISSUE';
  issueNote: string;
  setIssueNote: (val: string) => void;
  updating: boolean;
  teacherName: string;
  onClose: () => void;
  onSubmit: () => void;
}

export function MedicationConfirmModal({
  confirmModalItem,
  confirmType,
  issueNote,
  setIssueNote,
  updating,
  teacherName,
  onClose,
  onSubmit,
}: MedicationConfirmModalProps) {
  if (!confirmModalItem) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-extrabold text-slate-900">
            {confirmType === 'SUCCESS' ? 'Xác Nhận Đã Cho Bé Uống Thuốc' : 'Báo Cáo Sự Cố / Nôn Trớ'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="text-xs text-slate-600 space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
          <div>
            Học sinh: <strong className="text-slate-900">{confirmModalItem.TenHocSinh}</strong>
          </div>
          <div>
            Thuốc & Liều lượng: <strong className="text-slate-900">{confirmModalItem.TenThuoc} ({confirmModalItem.LieuLuong})</strong>
          </div>
          <div>
            Giờ dặn: <span className="font-semibold text-slate-700">{confirmModalItem.GioUongDuKien}</span>
          </div>
        </div>

        {confirmType === 'SUCCESS' ? (
          <p className="text-xs text-slate-600 leading-relaxed">
            Hệ thống sẽ ghi nhận giáo viên <strong className="text-slate-900">{teacherName}</strong> đã cho bé uống thuốc an toàn vào lúc{' '}
            <strong className="text-emerald-700">
              {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </strong>{' '}
            và tự động gửi thông báo xác nhận tới điện thoại phụ huynh.
          </p>
        ) : (
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">Ghi chú tình trạng sự cố:</label>
            <textarea
              rows={3}
              value={issueNote}
              onChange={(e) => setIssueNote(e.target.value)}
              placeholder="VD: Bé uống được 1 nửa thì nôn trớ / Bé quấy khóc không chịu uống..."
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-rose-500 focus:outline-none"
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            disabled={updating}
            onClick={onSubmit}
            className={`px-5 py-2 rounded-xl text-white text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-50 ${
              confirmType === 'SUCCESS'
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-rose-600 hover:bg-rose-700'
            }`}
          >
            {updating ? 'Đang lưu...' : confirmType === 'SUCCESS' ? 'Xác nhận hoàn thành' : 'Gửi báo cáo sự cố'}
          </button>
        </div>
      </div>
    </div>
  );
}
