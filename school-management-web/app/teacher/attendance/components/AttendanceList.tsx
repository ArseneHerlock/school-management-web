'use client';

import React from 'react';
import { Child } from '../../data';
import { AttendanceChildCard } from './AttendanceChildCard';

interface AttendanceListProps {
  childrenList: Child[];
  absentIds: Set<number>;
  lateIds: Set<number>;
  approvedLeaveMap: Map<number, { reason: string; fromDate: string; toDate: string }>;
  noteMap: Record<number, string>;
  mode: 'DEN' | 'VE';
  isLocked: boolean;
  checkedOutIds: Set<number>;
  earlyPickedMap: Map<number, { time: string; nguoiDon: string; lyDo: string }>;
  toggle: (id: number, type: 'absent' | 'late') => void;
  onOpenNote: (id: number) => void;
  onOpenLateArrival: (child: Child) => void;
  onOpenEarlyPickup: (child: Child) => void;
  onCheckOutChild: (child: Child) => void;
}

export const AttendanceList: React.FC<AttendanceListProps> = ({
  childrenList,
  absentIds,
  lateIds,
  approvedLeaveMap,
  noteMap,
  mode,
  isLocked,
  checkedOutIds,
  earlyPickedMap,
  toggle,
  onOpenNote,
  onOpenLateArrival,
  onOpenEarlyPickup,
  onCheckOutChild,
}) => {
  if (childrenList.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
        <p className="text-sm font-bold text-slate-500">
          Không tìm thấy học sinh nào phù hợp với bộ lọc.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 font-sans">
      {childrenList.map((child, index) => {
        const isAbsent = absentIds.has(child.id);
        const isLate = lateIds.has(child.id);
        const isPresent = !isAbsent && !isLate;
        const approvedLeave = approvedLeaveMap.get(child.id);
        const noteText = noteMap[child.id];
        const isCheckedOut = checkedOutIds.has(child.id);
        const earlyPickupInfo = earlyPickedMap.get(child.id);

        return (
          <AttendanceChildCard
            key={child.id || index}
            child={child}
            isAbsent={isAbsent}
            isLate={isLate}
            isPresent={isPresent}
            approvedLeave={approvedLeave}
            noteText={noteText}
            mode={mode}
            isLocked={isLocked}
            isCheckedOut={isCheckedOut}
            earlyPickupInfo={earlyPickupInfo}
            toggle={toggle}
            onOpenNote={onOpenNote}
            onOpenLateArrival={onOpenLateArrival}
            onOpenEarlyPickup={onOpenEarlyPickup}
            onCheckOutChild={onCheckOutChild}
          />
        );
      })}
    </div>
  );
};
