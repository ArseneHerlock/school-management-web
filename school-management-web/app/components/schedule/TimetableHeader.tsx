"use client";

import React, { RefObject } from "react";
import {
  Calendar as CalendarIcon,
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
    <div className="space-y-3">
      {/* Top Header: Title, Radio Filters, Date Picker, Buttons */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 min-w-0">
          <h1 className="text-lg sm:text-2xl font-black tracking-tight text-slate-800">
            Thời khóa biểu & Lịch sinh hoạt
          </h1>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs sm:text-sm font-semibold text-slate-700">
            <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="radio"
                name="scheduleTypeFilter"
                checked={filterMode === "ALL"}
                onChange={() => setFilterMode("ALL")}
                className="h-4 w-4 text-[#0284c7] focus:ring-[#0284c7] cursor-pointer"
              />
              <span>Tất cả</span>
            </label>

            <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="radio"
                name="scheduleTypeFilter"
                checked={filterMode === "LESSON"}
                onChange={() => setFilterMode("LESSON")}
                className="h-4 w-4 text-[#0284c7] focus:ring-[#0284c7] cursor-pointer"
              />
              <span>Sinh hoạt & Học tập</span>
            </label>

            <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="radio"
                name="scheduleTypeFilter"
                checked={filterMode === "ACTIVITY"}
                onChange={() => setFilterMode("ACTIVITY")}
                className="h-4 w-4 text-[#0284c7] focus:ring-[#0284c7] cursor-pointer"
              />
              <span>Sự kiện & Ngoại khóa</span>
            </label>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative inline-flex items-center">
            <input
              type="date"
              ref={dateInputRef}
              value={selectedDate}
              onChange={(e) => {
                if (e.target.value) setSelectedDate(e.target.value);
              }}
              className="absolute inset-0 opacity-0 pointer-events-auto cursor-pointer w-full h-full"
            />
            <div className="flex items-center gap-1.5 border border-slate-300 rounded-md bg-white px-2.5 py-1.5 text-xs sm:text-sm text-slate-800 font-medium pointer-events-none shadow-2xs">
              <span>{displaySelectedDate}</span>
              <CalendarIcon size={14} className="text-slate-500" />
            </div>
          </div>

          <button
            onClick={handleGoToday}
            className="inline-flex items-center gap-1.5 rounded-md bg-[#0284c7] hover:bg-[#0369a1] px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-white shadow-xs transition"
            title="Trở về tuần hiện tại"
          >
            <CalendarIcon size={14} />
            <span>Hiện tại</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-md bg-[#0284c7] hover:bg-[#0369a1] px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-white shadow-xs transition"
            title="In thời khóa biểu"
          >
            <Printer size={14} />
            <span>In lịch</span>
          </button>

          <button
            onClick={handlePrevWeek}
            className="inline-flex items-center gap-1 rounded-md bg-[#0284c7] hover:bg-[#0369a1] px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-white shadow-xs transition"
            title="Tuần trước"
          >
            <span>&lt; Trở về</span>
          </button>

          <button
            onClick={handleNextWeek}
            className="inline-flex items-center gap-1 rounded-md bg-[#0284c7] hover:bg-[#0369a1] px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-white shadow-xs transition"
            title="Tuần kế tiếp"
          >
            <span>Tiếp &gt;</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="inline-flex items-center justify-center rounded-md bg-[#0284c7] hover:bg-[#0369a1] p-1.5 text-white shadow-xs transition h-8 w-8"
            title={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>

      {/* Role Actions Sub-bar */}
      {(userRole === "admin" || extraHeaderInfo) && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
          <div className="flex items-center gap-3">
            {userRole === "admin" && classes.length > 0 && onClassChange && (
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-slate-500" />
                <span className="text-xs font-semibold text-slate-700">Lớp:</span>
                <select
                  value={selectedClassId}
                  onChange={(e) => onClassChange(e.target.value)}
                  className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
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
              className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 px-3 py-1 text-xs font-semibold text-white shadow-2xs transition"
            >
              <Plus size={14} /> Thêm lịch mới
            </button>
          )}
        </div>
      )}
    </div>
  );
}
export { TimetableHeader };
