'use client';

import React from 'react';
import { Search, Calendar, Download, RefreshCw } from 'lucide-react';
import { AdminFilterState } from '../types';

interface Props {
  filters: AdminFilterState;
  onChangeFilter: (key: keyof AdminFilterState, val: string) => void;
  onReset: () => void;
  onExportAll: () => void;
}

const ALL_CLASSES = [
  'Lớp Mầm 1',
  'Lớp Mầm 2',
  'Lớp Mầm 3',
  'Lớp Mầm 4',
  'Lớp Chồi 1',
  'Lớp Chồi 2',
  'Lớp Chồi 3',
  'Lớp Chồi 4',
  'Lớp Lá 1',
  'Lớp Lá 2',
  'Lớp Lá 3',
  'Lớp Lá 4',
];

export const AdminReportFilterBar: React.FC<Props> = ({
  filters,
  onChangeFilter,
  onReset,
  onExportAll,
}) => {
  const visibleClasses = ALL_CLASSES.filter((cls) => {
    if (filters.gradeId === 'all') return true;
    return cls.toLowerCase().includes(filters.gradeId.toLowerCase());
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      {/* Search & Selectors */}
      <div className="flex flex-wrap items-center gap-3 flex-1">
        {/* Search Keyword */}
        <div className="relative min-w-[200px] flex-1 max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo khối, lớp, giáo viên..."
            value={filters.searchKeyword}
            onChange={(e) => onChangeFilter('searchKeyword', e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Khối */}
        <select
          value={filters.gradeId}
          onChange={(e) => {
            onChangeFilter('gradeId', e.target.value);
            onChangeFilter('classId', 'all');
          }}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tất cả Khối</option>
          <option value="Mầm">Khối Mầm (3 - 4 tuổi)</option>
          <option value="Chồi">Khối Chồi (4 - 5 tuổi)</option>
          <option value="Lá">Khối Lá (5 - 6 tuổi)</option>
        </select>

        {/* Lớp */}
        <select
          value={filters.classId}
          onChange={(e) => onChangeFilter('classId', e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tất cả 12 Lớp học</option>
          {visibleClasses.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>

        {/* Kỳ báo cáo */}
        <div className="flex items-center gap-1.5 border border-gray-300 rounded-lg px-3 py-1.5 bg-white">
          <Calendar className="w-4 h-4 text-gray-500" />
          <select
            value={filters.period}
            onChange={(e) => onChangeFilter('period', e.target.value)}
            className="text-sm bg-transparent border-none focus:outline-none pr-2 font-medium text-gray-700"
          >
            <option value="thang_10">Tháng 10 / 2026</option>
            <option value="thang_11">Tháng 11 / 2026</option>
            <option value="hoc_ky_1">Học kỳ I (2026-2027)</option>
            <option value="ca_nam">Cả năm học (2026-2027)</option>
          </select>
        </div>

        {/* Reset button */}
        <button
          onClick={onReset}
          title="Đặt lại bộ lọc"
          className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Primary Export Action */}
      <div className="flex items-center gap-2">
        <button
          onClick={onExportAll}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-all shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Xuất Báo cáo Toàn trường</span>
        </button>
      </div>
    </div>
  );
};
