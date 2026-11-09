import React from 'react';
import { Pill, RefreshCw } from 'lucide-react';

interface MedicationHeaderProps {
  classNameStr: string;
  loading: boolean;
  onRefresh: () => void;
}

export function MedicationHeader({ classNameStr, loading, onRefresh }: MedicationHeaderProps) {
  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
          Dặn thuốc & Y tế {classNameStr ? `— ${classNameStr}` : ''}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Làm mới</span>
        </button>
      </div>
    </div>
  );
}
