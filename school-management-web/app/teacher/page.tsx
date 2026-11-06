'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CalendarDays,
  Users,
  Award,
  Bell,
  Sparkles,
} from 'lucide-react';
import LoadingScreen from '@/app/components/LoadingScreen';
import { TeacherHeroCard } from './components/dashboard/TeacherHeroCard';
import { TeacherQuickActions } from './components/dashboard/TeacherQuickActions';
import { ClassroomSafetyWatchlist } from './components/dashboard/ClassroomSafetyWatchlist';
import { TeacherAssessmentWidget } from './components/dashboard/TeacherAssessmentWidget';
import { TeacherTodaySchedule } from './components/dashboard/TeacherTodaySchedule';
import { TeacherKpiCards } from './components/dashboard/TeacherKpiCards';
import { TeacherClassStudentsList } from './components/dashboard/TeacherClassStudentsList';
import { TeacherAlertsWidget } from './components/dashboard/TeacherAlertsWidget';
import { useTeacherDashboard } from './useTeacherDashboard';

type TeacherTab = 'today' | 'students' | 'assessment' | 'alerts';

export default function TeacherDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TeacherTab>('today');

  const {
    currentTime,
    isLoading,
    assignedClassInfo,
    classStudentsList,
    pendingLeaveCount,
    safetyItems,
    todayScheduleItems,
    teacherAlerts,
    assessmentStatistics,
    presentCount,
    absentCount,
    totalStudents,
    attendanceRate,
    todayDateFormatted,
  } = useTeacherDashboard();

  if (isLoading) {
    return (
      <LoadingScreen
        message="Đang tải thông tin lớp học..."
        subMessage="Đồng bộ danh sách học sinh, điểm danh và lịch sinh hoạt trong ngày"
        theme="orange"
      />
    );
  }

  const teacherTabs = [
    { id: 'today' as TeacherTab, label: 'Nhật ký & An toàn', icon: CalendarDays, badge: safetyItems.length > 0 ? `${safetyItems.length}` : undefined },
    { id: 'students' as TeacherTab, label: `Danh sách lớp (${totalStudents})`, icon: Users },
    { id: 'assessment' as TeacherTab, label: 'Đánh giá trẻ', icon: Award },
    { id: 'alerts' as TeacherTab, label: 'Lời nhắc & Tin báo', icon: Bell, badge: teacherAlerts.length > 0 ? `${teacherAlerts.length}` : undefined },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full min-w-0">
      {/* 1. Header Lớp Phụ trách (Hiển thị cố định Lớp Mầm 1, sĩ số & thời gian thực) */}
      <TeacherHeroCard
        today={todayDateFormatted}
        time={currentTime}
        classInfo={assignedClassInfo}
      />

      {/* 2. Nghiệp vụ sư phạm hàng ngày */}
      <TeacherQuickActions onNavigate={(targetPath) => router.push(targetPath)} />

      {/* 3. Bộ Chuyển Chuyên Mục Thông Minh (Segmented Tabs - Nằm ngay trong màn hình đầu, không cuộn) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1.5 bg-orange-100/60 rounded-2xl max-w-full">
        {teacherTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[110px] sm:min-w-0 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-white text-orange-600 shadow-sm shadow-orange-300/40'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-orange-600' : 'text-slate-400'} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  isActive ? 'bg-orange-100 text-orange-700' : 'bg-orange-200 text-orange-800'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 4. Vùng Nội Dung Chuyên Sâu Từng Tab (Tối ưu hóa không gian hiển thị di động) */}
      <div className="space-y-4 sm:space-y-6">
        {activeTab === 'today' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Bộ 4 Chỉ số Điểm danh & Sĩ số hôm nay */}
            <TeacherKpiCards
              presentCount={presentCount}
              totalStudents={totalStudents}
              attendanceRate={attendanceRate}
              absentCount={absentCount}
              pendingLeaveCount={pendingLeaveCount}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Thời khóa biểu nề nếp hôm nay */}
              <TeacherTodaySchedule
                schedule={todayScheduleItems.map((scheduleItem) => {
                  const startTimeStr = String(
                    scheduleItem.startTime || scheduleItem.gioBatDau || '08:00'
                  ).slice(0, 5);
                  const endTimeStr = scheduleItem.endTime || scheduleItem.gioKetThuc
                    ? ` - ${String(scheduleItem.endTime || scheduleItem.gioKetThuc).slice(0, 5)}`
                    : '';

                  return {
                    time: `${startTimeStr}${endTimeStr}`,
                    activity: scheduleItem.title || scheduleItem.tieuDe || scheduleItem.tenSuKien || 'Hoạt động học tập',
                    room: scheduleItem.room || scheduleItem.phongHoc || '',
                    done: false,
                    current: false,
                  };
                })}
              />

              {/* Sổ an toàn lớp học & Dặn thuốc */}
              <ClassroomSafetyWatchlist
                items={safetyItems}
                onNavigateLeave={() => router.push('/teacher/leave')}
                onNavigateAttendance={() => router.push('/teacher/attendance')}
              />
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="w-full min-w-0">
            {/* Danh sách 25 học sinh lớp Mầm 1 */}
            <TeacherClassStudentsList
              studentsList={classStudentsList}
              classNameTitle={assignedClassInfo.name}
            />
          </div>
        )}

        {activeTab === 'assessment' && (
          <div className="w-full min-w-0">
            {/* Widget theo dõi đánh giá 5 lĩnh vực & hoạt động giáo dục */}
            <TeacherAssessmentWidget
              stats={assessmentStatistics}
              onNavigate={(targetPath) => router.push(targetPath)}
            />
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="w-full min-w-0">
            {/* Bảng tin thông báo & nhắc việc nội bộ */}
            <TeacherAlertsWidget alerts={teacherAlerts} />
          </div>
        )}
      </div>
    </div>
  );
}
