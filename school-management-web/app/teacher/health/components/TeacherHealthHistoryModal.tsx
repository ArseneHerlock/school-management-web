'use client';

import React from 'react';
import { X, HeartPulse } from 'lucide-react';
import WhoGrowthChart from '@/app/components/WhoGrowthChart';

interface TeacherHealthHistoryModalProps {
  child: any;
  historyLogs: any[];
  historyLoading: boolean;
  onClose: () => void;
}

export const TeacherHealthHistoryModal: React.FC<TeacherHealthHistoryModalProps> = ({
  child,
  historyLogs,
  historyLoading,
  onClose,
}) => {
  if (!child) return null;

  const gender = child.gender === 'F' ? 'Nữ' : 'Nam';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-orange-100 px-6 py-4 bg-gradient-to-r from-orange-50 via-amber-50 to-white">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-xs font-black">
              {child.avatar || child.name?.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-100/70 px-2 py-0.5 rounded-md">
                  BIỂU ĐỒ TĂNG TRƯỞNG WHO (0 - 5 TUỔI)
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {gender === 'Nữ' ? '♀ Bé gái' : '♂ Bé trai'} · {child.dob || ''}
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-0.5">
                {child.name} {child.nickname ? `(${child.nickname})` : ''}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nội dung cuộn */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {historyLoading ? (
            <div className="py-16 text-center text-xs font-bold text-slate-400">
              Đang tải dữ liệu biểu đồ và lịch sử các đợt đo...
            </div>
          ) : historyLogs.length === 0 ? (
            <div className="py-16 text-center text-xs font-bold text-slate-400">
              Bé chưa có bản ghi khám sức khỏe nào trong hệ thống.
            </div>
          ) : (
            <WhoGrowthChart
              records={historyLogs}
              gender={gender}
              dob={child.dob}
              studentName={child.name}
              height={360}
            />
          )}
        </div>
      </div>
    </div>
  );
};
