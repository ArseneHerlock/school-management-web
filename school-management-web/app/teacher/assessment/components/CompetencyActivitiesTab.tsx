'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { StudentCompetencyProfile } from '../assessmentBatchHelpers';

interface CompetencyActivitiesTabProps {
  competencyProfile?: StudentCompetencyProfile | null;
}

export function CompetencyActivitiesTab({
  competencyProfile,
}: CompetencyActivitiesTabProps) {
  const [activityDomainFilter, setActivityDomainFilter] = useState<string>('ALL');
  const [activitySearch, setActivitySearch] = useState<string>('');

  const filteredActivities = (competencyProfile?.activitiesParticipated || []).filter((act) => {
    const matchDomain =
      activityDomainFilter === 'ALL' || act.domainShortName === activityDomainFilter;
    const matchSearch =
      !activitySearch.trim() ||
      act.name.toLowerCase().includes(activitySearch.toLowerCase().trim()) ||
      act.code.toLowerCase().includes(activitySearch.toLowerCase().trim());
    return matchDomain && matchSearch;
  });

  return (
    <div className="space-y-3">
      {/* Thanh tìm kiếm & lọc theo miền */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => setActivityDomainFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              activityDomainFilter === 'ALL'
                ? 'bg-rose-500 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả lĩnh vực
          </button>
          {['Thể chất', 'Nhận thức', 'Ngôn ngữ', 'Tình cảm - Xã hội', 'Thẩm mỹ'].map((domName) => (
            <button
              key={domName}
              type="button"
              onClick={() => setActivityDomainFilter(domName)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                activityDomainFilter === domName
                  ? 'bg-rose-500 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {domName}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-48">
          <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm tên hoạt động..."
            value={activitySearch}
            onChange={(e) => setActivitySearch(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-rose-400"
          />
        </div>
      </div>

      {/* Danh sách các hoạt động đã đánh giá cho bé */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((act) => (
            <div
              key={act.id}
              className="p-3 hover:bg-slate-50/70 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                    style={{
                      color: act.domainColor,
                      backgroundColor: `${act.domainColor}15`,
                    }}
                  >
                    {act.domainShortName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {act.code}
                  </span>
                </div>
                <p className="font-bold text-slate-800 leading-snug">
                  {act.name}
                </p>
                {act.remarks && (
                  <p className="text-[11px] text-slate-500 mt-1 italic flex items-center gap-1">
                    <span className="text-slate-400">Lời cô:</span> {act.remarks}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                <div className="text-right">
                  <span className="text-[11px] font-bold text-slate-700 block">
                    {act.passedCriteria}/{act.totalCriteria} tiêu chí đạt
                  </span>
                  <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${act.passRate}%` }}
                    />
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border shrink-0 ${
                    act.passRate === 100
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : act.passRate >= 50
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {act.passRate}% Đạt
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-xs text-slate-400">
            Không tìm thấy hoạt động giáo dục nào phù hợp với bộ lọc.
          </div>
        )}
      </div>
    </div>
  );
}
