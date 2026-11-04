import React from 'react';
import { Clock, ShieldAlert, UserCheck, Search } from 'lucide-react';
import { ActiveTab } from '../useTeacherMedications';
import { CHILDREN } from '../../data';

interface MedicationTabsProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  todayCount: number;
  conditionCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function MedicationTabs({
  activeTab,
  setActiveTab,
  todayCount,
  conditionCount,
  searchQuery,
  setSearchQuery,
}: MedicationTabsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
      {/* Tab Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveTab('TODAY')}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'TODAY'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock size={14} />
          <span>Cần cho uống hôm nay</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
              activeTab === 'TODAY' ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-700'
            }`}
          >
            {todayCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('SPECIAL')}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'SPECIAL'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldAlert size={14} />
          <span>Trẻ có bệnh nền đặc biệt</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
              activeTab === 'SPECIAL' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'
            }`}
          >
            {conditionCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('ALL')}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'ALL'
              ? 'bg-slate-800 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UserCheck size={14} />
          <span>Cả lớp ({CHILDREN.length})</span>
        </button>
      </div>

      {/* Search Box */}
      <div className="relative w-full sm:w-64">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Tìm theo tên bé, tên thuốc..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-8.5 pr-3 py-1.5 text-xs font-semibold focus:border-orange-500 focus:bg-white focus:outline-none"
        />
      </div>
    </div>
  );
}
