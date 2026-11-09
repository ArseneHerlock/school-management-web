'use client';

import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  CheckCircle2,
  Table as TableIcon,
  ArrowUpDown,
} from 'lucide-react';
import { ActivityBreakdownChart } from './ActivityBreakdownChart';

interface ActivityBreakdownSectionProps {
  classBreakdown: any[];
  classStudents: any[];
  onGoToMatrix: () => void;
}

export function ActivityBreakdownSection({
  classBreakdown,
  classStudents,
  onGoToMatrix,
}: ActivityBreakdownSectionProps) {
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');
  const [sortBy, setSortBy] = useState<'fail' | 'pass' | 'name'>('fail');
  const [domainFilter, setDomainFilter] = useState<string>('ALL');

  const processedBreakdown = useMemo(() => {
    let list = [...(classBreakdown || [])];
    if (domainFilter !== 'ALL') {
      list = list.filter((item) => item.domainShortName === domainFilter);
    }
    if (sortBy === 'fail') {
      list.sort((a, b) => (b.failRate || 0) - (a.failRate || 0) || (b.failSlots || 0) - (a.failSlots || 0));
    } else if (sortBy === 'pass') {
      list.sort((a, b) => (b.passRate || 0) - (a.passRate || 0));
    } else if (sortBy === 'name') {
      list.sort((a, b) => (a.fullName || '').localeCompare(b.fullName || ''));
    }
    return list;
  }, [classBreakdown, sortBy, domainFilter]);

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-rose-100 p-3 sm:p-5 shadow-xs lg:col-span-2 flex flex-col justify-between max-w-full overflow-hidden">
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-800">
                Thống kê Đạt chuẩn theo Hoạt động
              </h3>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full shrink-0">
                {classBreakdown.length}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 hidden sm:block">
              {viewMode === 'table'
                ? 'Bảng chi tiết tỷ lệ tiêu chí Đạt chuẩn, Cần rèn luyện của học sinh'
                : 'Tỷ lệ % tiêu chí Đạt chuẩn và Cần rèn luyện (Chuẩn hóa thang đo 100%)'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 w-full md:w-auto">
            {viewMode === 'table' && (
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/80 rounded-xl px-2 py-1 text-xs w-full sm:w-auto">
                <ArrowUpDown size={12} className="text-slate-400 shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  aria-label="Sắp xếp danh sách hoạt động"
                  className="bg-transparent text-slate-700 font-bold text-xs focus:outline-none cursor-pointer w-full py-0.5"
                >
                  <option value="fail">Cần rèn luyện nhiều nhất</option>
                  <option value="pass">Tỷ lệ Đạt chuẩn cao nhất</option>
                  <option value="name">Tên hoạt động (A - Z)</option>
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 sm:flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/60 w-full sm:w-auto">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-rose-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Bảng trực quan"
              >
                <TableIcon size={12} className="shrink-0" />
                <span className="whitespace-nowrap">Bảng</span>
              </button>
              <button
                onClick={() => setViewMode('chart')}
                className={`flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === 'chart'
                    ? 'bg-white text-rose-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Biểu đồ tỷ lệ %"
              >
                <BarChart3 size={12} className="shrink-0" />
                <span className="whitespace-nowrap">Biểu đồ</span>
              </button>
            </div>
          </div>
        </div>

        {/* Lĩnh vực filter pills: cuộn ngang mượt mà trên mobile, không bao giờ bị cắt chữ */}
        <div className="flex items-center gap-1.5 pt-1.5 pb-1 border-t border-slate-100 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setDomainFilter('ALL')}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap shrink-0 transition cursor-pointer ${
              domainFilter === 'ALL'
                ? 'bg-rose-500 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả ({classBreakdown.length})
          </button>
          {['Thể chất', 'Nhận thức', 'Ngôn ngữ', 'Tình cảm - Xã hội', 'Thẩm mỹ'].map((dName) => {
            const count = classBreakdown.filter((c) => c.domainShortName === dName).length;
            return (
              <button
                key={dName}
                type="button"
                onClick={() => setDomainFilter(dName)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap shrink-0 transition cursor-pointer ${
                  domainFilter === dName
                    ? 'bg-rose-500 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {dName} ({count})
              </button>
            );
          })}
        </div>

        {viewMode === 'table' ? (
          <div className="mt-2">
            {processedBreakdown.length > 0 ? (
              <div className="max-h-80 overflow-y-auto pr-1 divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white">
                {processedBreakdown.map((item, idx) => {
                  const passRate =
                    item.passRate ??
                    (item.totalSlots > 0
                      ? Math.round((item.passSlots / item.totalSlots) * 100)
                      : 0);
                  const failRate =
                    item.failRate ??
                    (item.totalSlots > 0
                      ? Math.round((item.failSlots / item.totalSlots) * 100)
                      : 0);
                  const unassessedRate =
                    item.unassessedRate ?? Math.max(0, 100 - passRate - failRate);
                  const hasFail = (item.failSlots || 0) > 0;

                  return (
                    <div
                      key={item.id || idx}
                      className="p-2.5 sm:p-3 hover:bg-rose-50/20 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 text-xs"
                    >
                      <div className="min-w-0 sm:w-5/12">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {item.domainShortName && (
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md border ${
                                item.domainBadgeBg || 'bg-slate-50'
                              } ${item.domainBadgeText || 'text-slate-700'} ${
                                item.domainBadgeBorder || 'border-slate-200'
                              }`}
                            >
                              {item.domainShortName}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 font-mono">
                            {item.code || ''}
                          </span>
                        </div>
                        <p
                          className="font-bold text-slate-800 leading-snug text-[12px] truncate"
                          title={item.fullName}
                        >
                          {item.fullName}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400">
                          <span className="font-semibold text-slate-500">
                            {item.criteriaCount || 4} tiêu chí
                          </span>
                          <span>•</span>
                          <span>
                            {item.studentCount || classStudents.length} học sinh
                          </span>
                        </div>
                      </div>

                      <div className="sm:w-4/12 flex flex-col justify-center gap-1">
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className="text-emerald-600">{passRate}% Đạt</span>
                          {failRate > 0 && (
                            <span className="text-rose-500">{failRate}% Cần rèn</span>
                          )}
                          {unassessedRate > 0 && (
                            <span className="text-slate-400 font-normal">
                              {unassessedRate}% Chưa chấm
                            </span>
                          )}
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden flex">
                          {passRate > 0 && (
                            <div
                              className="h-full bg-emerald-500 transition-all duration-300"
                              style={{ width: `${passRate}%` }}
                              title={`Đạt chuẩn: ${passRate}% (${item.passSlots} lượt)`}
                            />
                          )}
                          {failRate > 0 && (
                            <div
                              className="h-full bg-rose-500 transition-all duration-300"
                              style={{ width: `${failRate}%` }}
                              title={`Cần rèn luyện: ${failRate}% (${item.failSlots} lượt)`}
                            />
                          )}
                          {unassessedRate > 0 && (
                            <div
                              className="h-full bg-slate-300 transition-all duration-300"
                              style={{ width: `${unassessedRate}%` }}
                              title={`Chưa đánh giá: ${unassessedRate}% (${item.unassessedSlots} lượt)`}
                            />
                          )}
                        </div>
                      </div>

                      <div className="sm:w-3/12 flex items-center justify-between sm:justify-end gap-1.5 shrink-0">
                        {hasFail ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-bold">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                            {item.failSlots} lượt ({item.failStudentsCount || 1} trẻ)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                            <CheckCircle2 size={11} />
                            100% Đạt
                          </span>
                        )}
                        <button
                          onClick={onGoToMatrix}
                          className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-rose-500 hover:text-white text-slate-700 text-[10px] font-bold transition cursor-pointer shrink-0"
                          title="Mở ma trận để chấm điểm"
                        >
                          Chấm điểm
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400">
                Không có hoạt động nào phù hợp với bộ lọc đã chọn.
              </div>
            )}
          </div>
        ) : (
          <ActivityBreakdownChart
            processedBreakdown={processedBreakdown}
            classStudents={classStudents}
            classBreakdownLength={classBreakdown.length}
          />
        )}
      </div>
    </div>
  );
}
