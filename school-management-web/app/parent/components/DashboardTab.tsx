'use client';

import React, { useState } from 'react';
import { Loader2, Sparkles, Award, HeartPulse } from 'lucide-react';
import { ChildInfo, ParentProfile } from '../types';
import { AttendanceStatCards } from './dashboard/AttendanceStatCards';
import { DevelopmentProgressCard } from './dashboard/DevelopmentProgressCard';
import { ChildHealthTeacherSummary } from './dashboard/ChildHealthTeacherSummary';
import { ParentQuickActionsDock } from './dashboard/ParentQuickActionsDock';
import { ChildDailyStoryFeed } from './dashboard/ChildDailyStoryFeed';
import { DashboardHeroBanner } from './dashboard/DashboardHeroBanner';
import { DashboardChildSelector } from './dashboard/DashboardChildSelector';
import { ChildAlertsBanner } from './dashboard/ChildAlertsBanner';
import { useParentDashboardTab } from './dashboard/useParentDashboardTab';

export default function DashboardTab({
  childrenData,
  parent,
  onNavigateTab,
}: {
  childrenData: ChildInfo[];
  parent: ParentProfile;
  onNavigateTab: (tab: string) => void;
}) {
  const {
    setSelectedChildId,
    activeChild,
    loading,
    attendanceRecords,
    classSchedules,
    healthRecord,
    childAlerts,
    fcmLatest,
    attendanceStats,
    developmentStats,
  } = useParentDashboardTab(childrenData);

  const [activeTab, setActiveTab] = useState<'today' | 'assessment' | 'health'>('today');

  const parentTabs = [
    {
      id: 'today' as const,
      label: 'Hôm nay của bé',
      mobileLabel: 'Hôm nay',
      icon: Sparkles,
      badge: childAlerts.length > 0 ? `${childAlerts.length}` : undefined,
    },
    {
      id: 'assessment' as const,
      label: 'Đánh giá 5 lĩnh vực',
      mobileLabel: 'Đánh giá',
      icon: Award,
    },
    {
      id: 'health' as const,
      label: 'Sức khỏe & Giáo viên',
      mobileLabel: 'Sức khỏe',
      icon: HeartPulse,
    },
  ];

  return (
    <section className="space-y-4 sm:space-y-6 max-w-full min-w-0">
      <DashboardHeroBanner parentName={parent.hoTen} onNavigateTab={onNavigateTab} />

      <DashboardChildSelector
        childrenData={childrenData}
        selectedChildId={activeChild?.id}
        onSelectChild={setSelectedChildId}
      />

      <ParentQuickActionsDock onNavigateTab={onNavigateTab} />

      {/* Segmented Tab control */}
      <div className="grid grid-cols-3 gap-1 sm:gap-2 p-1.5 bg-blue-100/60 rounded-2xl max-w-full">
        {parentTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 sm:px-3 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap min-w-0 ${
                isActive
                  ? 'bg-white text-blue-700 shadow-sm shadow-blue-300/40'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              <Icon size={14} className={`shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              <span className="truncate">
                <span className="sm:hidden">{tab.mobileLabel}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </span>
              {tab.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black shrink-0 ${
                  isActive ? 'bg-rose-100 text-rose-700' : 'bg-blue-200 text-blue-800'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-xs border border-blue-50">
          <Loader2 className="animate-spin text-blue-500 mb-3" size={36} />
          <p className="text-slate-500 font-bold text-sm">
            Đang tải thông tin của bé {activeChild?.hoTen}...
          </p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {activeTab === 'today' && (
            <>
              <ChildAlertsBanner
                childAlerts={childAlerts}
                childName={activeChild?.hoTen}
                onNavigateTab={onNavigateTab}
              />
              <ChildDailyStoryFeed
                childName={activeChild?.hoTen || 'Bé'}
                className={activeChild?.lop}
                todayAttendance={attendanceRecords.find(
                  (r) => String(r.ngay || '').slice(0, 10) === new Date().toISOString().slice(0, 10)
                )}
                todaySchedules={classSchedules}
              />
              <AttendanceStatCards
                stats={attendanceStats}
                childName={activeChild?.hoTen}
                className={activeChild?.lop}
                onNavigateDetail={() => onNavigateTab('attendance')}
              />
            </>
          )}

          {activeTab === 'assessment' && (
            <DevelopmentProgressCard
              stats={developmentStats}
              childName={activeChild?.hoTen}
              clusterId={fcmLatest?.ClusterId || fcmLatest?.clusterId}
              clusterName={fcmLatest?.ClusterName || fcmLatest?.clusterName}
              trend={fcmLatest?.Trend || fcmLatest?.trend}
              onNavigateDetail={() => onNavigateTab('assessment')}
            />
          )}

          {activeTab === 'health' && (
            <ChildHealthTeacherSummary
              healthRecord={healthRecord}
              teacherName={activeChild?.giaoVienChuNhiem}
              teacherPhone={activeChild?.sdtGiaoVien}
              className={activeChild?.lop}
              onNavigateHealth={() => onNavigateTab('health')}
              onNavigateMessages={() => onNavigateTab('messages')}
            />
          )}
        </div>
      )}
    </section>
  );
}
