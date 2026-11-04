import React from 'react';
import { X, Plus, Loader2, Trash2 } from 'lucide-react';
import { Student } from '@/services/students';
import { FlowerRecord, GoodChildRecord } from '../types';
import { padZero } from '../useFlowerAwards';

interface FlowerAwardsModalProps {
  selectedStudentForAward: {
    student: Student;
    record?: GoodChildRecord;
  } | null;
  onClose: () => void;
  selectedMonth: number;
  selectedYear: number;
  lastDayOfMonth: number;
  awardDate: string;
  setAwardDate: (date: string) => void;
  awardReason: string;
  setAwardReason: (reason: string) => void;
  isSubmitting: boolean;
  onAwardFlower: () => void;
  onSelectFlowerToRevoke: (flower: FlowerRecord) => void;
}

export function FlowerAwardsModal({
  selectedStudentForAward,
  onClose,
  selectedMonth,
  selectedYear,
  lastDayOfMonth,
  awardDate,
  setAwardDate,
  awardReason,
  setAwardReason,
  isSubmitting,
  onAwardFlower,
  onSelectFlowerToRevoke,
}: FlowerAwardsModalProps) {
  if (!selectedStudentForAward) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600">
              Tặng hoa Tháng {selectedMonth}/{selectedYear}
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-0.5">
              {selectedStudentForAward.student.tenHocSinh}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {selectedStudentForAward.record ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-rose-50 p-3.5 border border-rose-100 text-center">
                <p className="text-[11px] font-bold text-rose-700">Hoa nhỏ đã nhận</p>
                <p className="text-2xl font-black text-rose-800 mt-1">
                  {selectedStudentForAward.record.dailyFlowerCount} / 4
                </p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-3.5 border border-amber-100 text-center">
                <p className="text-[11px] font-bold text-amber-700">Hoa lớn đạt được</p>
                <p className="text-2xl font-black text-amber-800 mt-1">
                  🏅 {selectedStudentForAward.record.bonusFlowerCount}
                </p>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl bg-slate-50/80 p-4 border border-slate-100">
              <h4 className="text-xs font-bold text-slate-700">Ghi nhận hoa mới cho bé</h4>
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500">Ngày tặng hoa</label>
                  <input
                    type="date"
                    min={`${selectedYear}-${padZero(selectedMonth)}-01`}
                    max={`${selectedYear}-${padZero(selectedMonth)}-${padZero(lastDayOfMonth)}`}
                    className="w-full mt-1 rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold text-slate-800"
                    value={awardDate}
                    onChange={(e) => setAwardDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500">Lý do đáng khen</label>
                  <input
                    className="w-full mt-1 rounded-xl border border-slate-200 bg-white p-2 text-xs font-medium text-slate-800"
                    value={awardReason}
                    onChange={(e) => setAwardReason(e.target.value)}
                    placeholder="Ví dụ: Giúp đỡ bạn, ăn hết suất..."
                  />
                </div>
              </div>

              <button
                disabled={
                  isSubmitting ||
                  Number(selectedStudentForAward.record.dailyFlowerCount || 0) >= 4
                }
                onClick={onAwardFlower}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-rose-500 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-rose-600 disabled:opacity-40 transition cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Plus size={15} />
                )}
                <span>
                  {Number(selectedStudentForAward.record.dailyFlowerCount || 0) >= 4
                    ? 'Bé đã đủ 4/4 hoa nhỏ tháng này'
                    : 'Tặng hoa nhỏ cho bé'}
                </span>
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700">Lịch sử hoa trong tháng</h4>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {(selectedStudentForAward.record.flowers || []).length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">Chưa có hoa nào được ghi nhận.</p>
                ) : (
                  (selectedStudentForAward.record.flowers || []).map((flower) => (
                    <div
                      key={flower.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white p-2.5"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">
                          {flower.flowerType === 2 ? '🏅' : '🌹'}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            {flower.flowerType === 2 ? 'Hoa lớn danh dự' : 'Hoa nhỏ bé ngoan'}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {flower.flowerDate} • {flower.reason || 'Khen thưởng'}
                          </p>
                        </div>
                      </div>

                      {!flower.isRevoked && flower.flowerType === 1 && (
                        <button
                          onClick={() => onSelectFlowerToRevoke(flower)}
                          className="text-xs text-rose-600 hover:text-rose-800 font-semibold p-1 cursor-pointer"
                          title="Thu hồi hoa"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-2xl bg-amber-50 p-6 text-center text-xs text-amber-800">
            Bé chưa có sổ theo dõi tháng này. Vui lòng mở chức năng <b>Sổ bé ngoan</b> để khởi tạo sổ tháng cho trẻ trước khi tặng hoa.
          </div>
        )}
      </div>
    </div>
  );
}
