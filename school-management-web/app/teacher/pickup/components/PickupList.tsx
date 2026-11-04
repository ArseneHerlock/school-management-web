import React from 'react';
import { StudentPickupItem } from '../types';
import { PickupCard } from './PickupCard';

interface PickupListProps {
  loading: boolean;
  filteredList: StudentPickupItem[];
  processingId: string | null;
  onConfirmPickup: (student: StudentPickupItem, personName: string) => void;
  onCancelPickup: (studentId: string, studentName: string) => void;
}

export function PickupList({
  loading,
  filteredList,
  processingId,
  onConfirmPickup,
  onCancelPickup,
}: PickupListProps) {
  if (loading) {
    return (
      <div className="py-16 text-center text-slate-400 font-semibold">
        Đang tải danh sách học sinh và người đón...
      </div>
    );
  }

  if (filteredList.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 text-slate-500 space-y-2">
        <p className="font-bold text-slate-700">Không tìm thấy học sinh nào phù hợp.</p>
        <p className="text-xs text-slate-400">
          Hãy thử tìm bằng từ khóa khác hoặc bấm chọn "Tất cả".
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredList.map((st) => (
        <PickupCard
          key={st.studentId}
          student={st}
          processingId={processingId}
          onConfirmPickup={onConfirmPickup}
          onCancelPickup={onCancelPickup}
        />
      ))}
    </div>
  );
}
