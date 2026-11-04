"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import {
  TimetableScheduleItem,
  WeeklyTimetableProps,
  isEvaluableActivity,
} from "./types";
import { useWeeklyTimetable } from "./useWeeklyTimetable";
import TimetableHeader from "./TimetableHeader";
import TimetableMobileView from "./TimetableMobileView";
import TimetableDesktopGrid from "./TimetableDesktopGrid";
import TimetableDetailModal from "./TimetableDetailModal";

export type { TimetableScheduleItem, WeeklyTimetableProps };
export { isEvaluableActivity };

export default function WeeklyTimetable({
  userRole,
  fetchSchedules,
  classes = [],
  selectedClassId = "ALL",
  onClassChange,
  onAddSchedule,
  onEditSchedule,
  onDeleteSchedule,
  onItemClick,
  extraHeaderInfo,
}: WeeklyTimetableProps) {
  const {
    selectedDate,
    setSelectedDate,
    filterMode,
    setFilterMode,
    loading,
    isFullscreen,
    selectedItemForModal,
    setSelectedItemForModal,
    selectedMobileDay,
    setSelectedMobileDay,
    containerRef,
    dateInputRef,
    currentWeekDays,
    filteredSchedules,
    displaySelectedDate,
    handlePrevWeek,
    handleNextWeek,
    handleGoToday,
    handleCardClick,
    handlePrint,
    toggleFullscreen,
    getEventsForCell,
    getPeriodLabel,
    getCardStyle,
  } = useWeeklyTimetable({
    userRole,
    fetchSchedules,
    selectedClassId,
    onItemClick,
  });

  return (
    <div
      ref={containerRef}
      className={`timetable-root bg-white font-sans ${
        isFullscreen
          ? "fixed inset-0 z-50 overflow-y-auto p-6 bg-slate-50"
          : "space-y-4"
      }`}
    >
      {/* Top Header & Role Filter Sub-bar */}
      <TimetableHeader
        userRole={userRole}
        classes={classes}
        selectedClassId={selectedClassId}
        onClassChange={onClassChange}
        onAddSchedule={onAddSchedule}
        extraHeaderInfo={extraHeaderInfo}
        filterMode={filterMode}
        setFilterMode={setFilterMode}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        displaySelectedDate={displaySelectedDate}
        dateInputRef={dateInputRef}
        isFullscreen={isFullscreen}
        handleGoToday={handleGoToday}
        handlePrint={handlePrint}
        handlePrevWeek={handlePrevWeek}
        handleNextWeek={handleNextWeek}
        toggleFullscreen={toggleFullscreen}
      />

      {/* Loading Bar */}
      {loading && (
        <div className="flex items-center justify-center gap-2 py-2 text-xs font-medium text-sky-600 bg-sky-50 rounded-md border border-sky-100">
          <Loader2 size={14} className="animate-spin" />
          <span>Đang tải dữ liệu lịch từ hệ thống...</span>
        </div>
      )}

      {/* Mobile Day View */}
      <TimetableMobileView
        currentWeekDays={currentWeekDays}
        selectedMobileDay={selectedMobileDay}
        setSelectedMobileDay={setSelectedMobileDay}
        filteredSchedules={filteredSchedules}
        userRole={userRole}
        getEventsForCell={getEventsForCell}
        getPeriodLabel={getPeriodLabel}
        getCardStyle={getCardStyle}
        onEditSchedule={onEditSchedule}
        onDeleteSchedule={onDeleteSchedule}
        handleCardClick={handleCardClick}
      />

      {/* Desktop Grid View */}
      <TimetableDesktopGrid
        currentWeekDays={currentWeekDays}
        userRole={userRole}
        getEventsForCell={getEventsForCell}
        getPeriodLabel={getPeriodLabel}
        getCardStyle={getCardStyle}
        onEditSchedule={onEditSchedule}
        onDeleteSchedule={onDeleteSchedule}
        handleCardClick={handleCardClick}
      />

      {/* Item Details Modal */}
      <TimetableDetailModal
        item={selectedItemForModal}
        onClose={() => setSelectedItemForModal(null)}
        getPeriodLabel={getPeriodLabel}
      />
    </div>
  );
}
