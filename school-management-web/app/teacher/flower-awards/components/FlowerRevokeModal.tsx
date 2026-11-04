import React from 'react';
import { FlowerRecord } from '../types';

interface FlowerRevokeModalProps {
  flowerToRevoke: FlowerRecord | null;
  onClose: () => void;
  revokeReason: string;
  setRevokeReason: (reason: string) => void;
  isSubmitting: boolean;
  onConfirmRevoke: () => void;
}

export function FlowerRevokeModal({
  flowerToRevoke,
  onClose,
  revokeReason,
  setRevokeReason,
  isSubmitting,
  onConfirmRevoke,
}: FlowerRevokeModalProps) {
  if (!flowerToRevoke) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl space-y-4">
        <h4 className="text-sm font-black text-rose-800">Xác nhận thu hồi hoa</h4>
        <p className="text-xs text-slate-500">
          Vui lòng nhập lý do thu hồi hoa (bắt buộc):
        </p>
        <textarea
          className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-rose-400"
          rows={2}
          value={revokeReason}
          onChange={(e) => setRevokeReason(e.target.value)}
          placeholder="Nhập lý do thu hồi..."
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            disabled={isSubmitting || !revokeReason.trim()}
            onClick={onConfirmRevoke}
            className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-40 cursor-pointer"
          >
            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận thu hồi'}
          </button>
        </div>
      </div>
    </div>
  );
}
