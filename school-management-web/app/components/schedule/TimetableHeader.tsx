"use client";

import React, { RefObject } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Printer,
  Maximize2,
  Minimize2,
  Plus,
  Filter,
} from "lucide-react";
import { WeeklyTimetableProps } from "./types";

interface TimetableHeaderProps {
  userRole: WeeklyTimetableProps["userRole"];
  classes?: WeeklyTimetableProps["classes"];
  selectedClassId?: string;
  onClassChange?: (classId: string) => void;
  onAddSchedule?: (date?: string) => void;
  extraHeaderInfo?: React.ReactNode;
  filterMode: "ALL" | "LESSON" | "ACTIVITY";
  setFilterMode: (mode: "ALL" | "LESSON" | "ACTIVITY") => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  displaySelectedDate: string;
  dateInputRef: RefObject<HTMLInputElement | null>;
  isFullscreen: boolean;
  handleGoToday: () => void;
  handlePrint: () => void;
  handlePrevWeek: () => void;
  handleNextWeek: () => void;
  toggleFullscreen: () => void;
}

export default function TimetableHeader({
  userRole,
  classes = [],
  selectedClassId = "ALL",
  onClassChange,
  onAddSchedule,
  extraHeaderInfo,
  filterMode,
  setFilterMode,
  selectedDate,
  setSelectedDate,
  displaySelectedDate,
  dateInputRef,
  isFullscreen,
  handleGoToday,
  handlePrint,
  handlePrevWeek,
  handleNextWeek,
  toggleFullscreen,
}: TimetableHeaderProps) {
  return (
    <div className="space-y-3 font-sans">
      {/* Row 1: Title & Grouped Date Navigation Controls (No wrapping breaking buttons) */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-3">
        <div>
          <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">
            Lịch biểu & Thời khóa biểu
          </span>
          <h1 className="text-lg sm:text-2xl font-black tracking-tight text-slate-800">
            Thời khóa biểu & Lịch sinh hoạt
          </h1>
        </div>

        {/* Date Controls & Action Buttons - Grouped in single cohesive toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Week Navigation Group (Previous, Date Picker, Next) */}
          <div className="inline-flex items-center rounded-lg border border-slate-300 bg-white shadow-2xs overflow-hidden">
            <button
              onClick={handlePrevWeek}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 border-r border-slate-200 transition cursor-pointer"
              title="Tuần trước"
            >
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">Trở về</span>
            </button>

            {/* Date Display with native picker */}
            <div className="relative inline-flex items-center px-2.5 py-1.5 text-xs sm:text-sm text-slate-800 font-semibold bg-sky-50/60">
              <input
                type="date"
                ref={dateInputRef}
                value={selectedDate}
                onChange={(e) => {
                  if (e.target.value) setSelectedDate(e.target.value);
                }}
                className="absolute inset-0 opacity-0 pointer-events-auto cursor-pointer w-full h-full"
              />
              <span className="pointer-events-none select-none">{displaySelectedDate}</span>
              <CalendarIcon size={14} className="ml-1.5 text-sky-600 pointer-events-none" />
            </div>

            <button
              onClick={handleNextWeek}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 border-l border-slate-200 transition cursor-pointer"
              title="Tuần kế tiếp"
            >
              <span className="hidden sm:inline">Tiếp</span>
              <ChevronRight size={16} />
            </button>
          </div>

          <button
            onClick={handleGoToday}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs transition cursor-pointer"
            title="Trở về tuần hiện tại"
          >
            <CalendarIcon size={14} className="text-slate-500" />
            <span>Hiện tại</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs transition cursor-pointer"
            title="In thời khóa biểu"
          >
            <Printer size={14} className="text-slate-500" />
            <span className="hidden sm:inline">In lịch</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white hover:bg-slate-50 p-1.5 text-slate-700 shadow-2xs transition h-8 w-8 sm:h-9 sm:w-9 cursor-pointer"
            title={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Row 2: Sub-toolbar with Segmented Filter Pills, Class Selector, Extra Info & Add Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50/90 p-2.5 rounded-xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-3 min-w-0">
          {/* Segmented Filter Pills */}
          <div className="inline-flex items-center bg-slate-200/80 p-0.5 rounded-lg gap-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setFilterMode("ALL")}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                filterMode === "ALL"
                  ? "bg-white text-sky-800 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("LESSON")}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                filterMode === "LESSON"
                  ? "bg-white text-sky-800 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sinh hoạt & Học tập
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("ACTIVITY")}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                filterMode === "ACTIVITY"
                  ? "bg-white text-sky-800 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sự kiện & Ngoại khóa
            </button>
          </div>

          {/* Admin Class Selector */}
          {userRole === "admin" && classes.length > 0 && onClassChange && (
            <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg px-2.5 py-1 shadow-2xs">
              <Filter size={13} className="text-slate-400" />
              <span className="text-xs font-semibold text-slate-600">Lớp:</span>
              <select
                value={selectedClassId}
                onChange={(e) => onClassChange(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="ALL">Tất cả các lớp</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name || c.tenLop || c.id}
                  </option>
                ))}
              </select>
            </div>
          )}

          {extraHeaderInfo}
        </div>

        {userRole === "admin" && onAddSchedule && (
          <button
            onClick={() => onAddSchedule(selectedDate)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition cursor-pointer"
          >
            <Plus size={15} /> Thêm lịch mới
          </button>
        )}
      </div>
    </div>
  );
}
export { TimetableHeader };