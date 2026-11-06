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
    schedules,
    loading,
    isInitialLoading,
    isRefreshing,
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

      {/* Top Background Sync Progress Bar */}
      {isRefreshing && (
        <div className="h-0.5 w-full bg-slate-100 overflow-hidden rounded-full">
          <div className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-sky-500 animate-pulse w-full" />
        </div>
      )}

      {/* Initial Loading Skeleton */}
      {isInitialLoading && schedules.length === 0 ? (
        <div className="hidden sm:grid sm:grid-cols-7 gap-2 p-4 rounded-3xl border border-slate-100 bg-slate-50/50 animate-pulse">
          {currentWeekDays.map((d, i) => (
            <div key={i} className="space-y-3">
              <div className="h-10 bg-slate-200/70 rounded-2xl" />
              <div className="h-24 bg-slate-200/50 rounded-2xl" />
              <div className="h-24 bg-slate-200/50 rounded-2xl" />
              <div className="h-24 bg-slate-200/50 rounded-2xl" />
            </div>
          ))}
        </div>
      ) : (
        <>
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
        </>
      )}

      {/* Item Details Modal */}
      <TimetableDetailModal
        item={selectedItemForModal}
        onClose={() => setSelectedItemForModal(null)}
        getPeriodLabel={getPeriodLabel}
      />
    </div>
  );
}
