"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Calendar as CalendarIcon,
  Printer,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Plus,
  Pencil,
  Trash2,
  Clock,
  MapPin,
  User,
  Filter,
  CheckCircle2,
  X,
  Loader2,
} from "lucide-react";

export interface TimetableScheduleItem {
  id: string;
  title: string;
  description?: string;
  type?: number;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  location?: string;
  classId?: string | null;
  className?: string;
  isSchoolWide?: boolean;
  status?: number | string;
  teacherName?: string;
  teachers?: Array<{ teacherId: string; subject?: string }>;
  criteria?: any[];
  isActivity?: boolean;
  childEvaluation?: any;
  [key: string]: any;
}

export interface WeeklyTimetableProps {
  userRole: "admin" | "teacher" | "parent";
  // Data fetcher function provided by parent (must call backend API)
  fetchSchedules: (params: {
    from: string;
    to: string;
    type?: number;
    classId?: string;
  }) => Promise<TimetableScheduleItem[]>;
  // Classes list for Admin class filter
  classes?: Array<{ id: string; name?: string; tenLop?: string }>;
  selectedClassId?: string;
  onClassChange?: (classId: string) => void;
  // Admin actions
  onAddSchedule?: (date?: string) => void;
  onEditSchedule?: (item: TimetableScheduleItem) => void;
  onDeleteSchedule?: (id: string) => void;
  // Card click (e.g. view details or teacher evaluation)
  onItemClick?: (item: TimetableScheduleItem) => void;
  // Subtitle or banner info (e.g. child info for parent)
  extraHeaderInfo?: React.ReactNode;
}

export function isEvaluableActivity(item: {
  title?: string;
  type?: number;
  isActivity?: boolean;
  isSchoolWide?: boolean;
  activityId?: string;
  teachers?: Array<{ teacherId?: string; subject?: string }>;
}): boolean {
  const title = (item.title || "").toLowerCase();
  // Routine daily care tasks - NEVER evaluable
  if (
    title.includes("đón trẻ") ||
    title.includes("thể dục sáng") ||
    title.includes("điểm danh") ||
    title.includes("bữa trưa") ||
    title.includes("ăn trưa") ||
    title.includes("ngủ trưa") ||
    title.includes("giấc ngủ") ||
    title.includes("ăn xế") ||
    title.includes("vệ sinh") ||
    title.includes("trả trẻ") ||
    title.includes("nêu gương") ||
    title.includes("uống sữa")
  ) {
    return false;
  }

  // Linked directly to a School Activity or explicit type 2 / isActivity flag
  const hasActivityLink =
    Boolean(item.activityId) ||
    Boolean(item.teachers?.[0]?.subject?.startsWith("ACT:"));
  if (hasActivityLink || item.type === 2 || item.isActivity) return true;

  // Educational / developmental keywords
  if (
    title.includes("hoạt động") ||
    title.includes("học") ||
    title.includes("tạo hình") ||
    title.includes("ngoài trời") ||
    title.includes("vận động") ||
    title.includes("khám phá") ||
    title.includes("kỹ năng") ||
    title.includes("góc chơi") ||
    title.includes("âm nhạc") ||
    title.includes("kể chuyện") ||
    title.includes("sự kiện") ||
    title.includes("trải nghiệm") ||
    title.includes("toán") ||
    title.includes("văn học") ||
    title.includes("chữ cái")
  ) {
    return true;
  }

  return false;
}

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
  // Current selected reference date (YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().slice(0, 10);
  });

  // Filter mode: 'ALL' | 'LESSON' | 'ACTIVITY'
  const [filterMode, setFilterMode] = useState<"ALL" | "LESSON" | "ACTIVITY">("ALL");

  // Raw schedules fetched from Backend API
  const [schedules, setSchedules] = useState<TimetableScheduleItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedItemForModal, setSelectedItemForModal] = useState<TimetableScheduleItem | null>(null);
  const [selectedMobileDay, setSelectedMobileDay] = useState<string>(() => {
    return new Date().toISOString().slice(0, 10);
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Compute Monday - Sunday week dates based on selectedDate
  const currentWeekDays = useMemo(() => {
    const [y, m, d] = selectedDate.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    const dayOfWeek = dateObj.getDay(); // 0 is Sunday
    const diffToMonday = dateObj.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);

    const monday = new Date(y, m - 1, diffToMonday);
    const days = [];
    const dayNames = [
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
      "Chủ nhật",
    ];

    const todayStr = new Date().toISOString().slice(0, 10);

    for (let i = 0; i < 7; i++) {
      const current = new Date(monday);
      current.setDate(monday.getDate() + i);

      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, "0");
      const day = String(current.getDate()).padStart(2, "0");
      const isoDate = `${year}-${month}-${day}`;
      const formattedDate = `${day}/${month}/${year}`;

      days.push({
        dayIndex: i,
        dayName: dayNames[i],
        isoDate,
        formattedDate,
        isToday: isoDate === todayStr,
      });
    }

    return days;
  }, [selectedDate]);

  useEffect(() => {
    if (currentWeekDays.length > 0) {
      const match = currentWeekDays.find((d) => d.isoDate === selectedMobileDay);
      if (!match) {
        const today = currentWeekDays.find((d) => d.isToday);
        setSelectedMobileDay(today ? today.isoDate : currentWeekDays[0].isoDate);
      }
    }
  }, [currentWeekDays, selectedMobileDay]);

  const weekRange = useMemo(() => {
    if (currentWeekDays.length === 0) return { from: "", to: "" };
    return {
      from: currentWeekDays[0].isoDate,
      to: currentWeekDays[6].isoDate,
    };
  }, [currentWeekDays]);

  // Load schedules from backend API whenever week range or class filter changes
  useEffect(() => {
    let isCancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const typeQuery =
          filterMode === "LESSON" ? 1 : filterMode === "ACTIVITY" ? 2 : undefined;

        const data = await fetchSchedules({
          from: weekRange.from,
          to: weekRange.to,
          type: typeQuery,
          classId: selectedClassId !== "ALL" ? selectedClassId : undefined,
        });

        if (!isCancelled) {
          setSchedules(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error("Lỗi khi tải lịch từ backend API:", err);
          setSchedules([]);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    void load();
    return () => {
      isCancelled = true;
    };
  }, [fetchSchedules, weekRange.from, weekRange.to, selectedClassId, filterMode]);

  // Filter schedules locally (ALL vs Sinh hoạt học tập vs Sự kiện ngoại khóa)
  const filteredSchedules = useMemo(() => {
    return schedules.filter((item) => {
      const isEventOrActivity =
        item.isSchoolWide ||
        item.type === 2 ||
        item.isActivity;

      if (filterMode === "LESSON") {
        return !isEventOrActivity;
      }
      if (filterMode === "ACTIVITY") {
        return isEventOrActivity;
      }
      return true; // 'ALL'
    });
  }, [schedules, filterMode]);

  // Navigate weeks
  const handlePrevWeek = () => {
    const [y, m, d] = selectedDate.split("-").map(Number);
    const prev = new Date(y, m - 1, d - 7);
    setSelectedDate(prev.toISOString().slice(0, 10));
  };

  const handleNextWeek = () => {
    const [y, m, d] = selectedDate.split("-").map(Number);
    const next = new Date(y, m - 1, d + 7);
    setSelectedDate(next.toISOString().slice(0, 10));
  };

  const handleGoToday = () => {
    setSelectedDate(new Date().toISOString().slice(0, 10));
  };

  const handleCardClick = (item: TimetableScheduleItem) => {
    const evaluable = isEvaluableActivity(item);
    if (userRole === "teacher") {
      if (evaluable && onItemClick) {
        onItemClick(item);
      } else {
        setSelectedItemForModal(item);
      }
    } else {
      if (onItemClick) {
        onItemClick(item);
      } else {
        setSelectedItemForModal(item);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {
        setIsFullscreen(!isFullscreen);
      });
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Group events by cell: date & session (Sáng / Chiều / Tối)
  const getEventsForCell = (
    isoDate: string,
    session: "morning" | "afternoon" | "evening"
  ) => {
    return filteredSchedules
      .filter((item) => {
        if (item.date !== isoDate) return false;
        const time = item.startTime || "08:00";
        const hour = parseInt(time.split(":")[0], 10);
        if (session === "morning") return hour < 12;
        if (session === "afternoon") return hour >= 12 && hour < 17;
        return hour >= 17;
      })
      .sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));
  };

  // Calculate Vietnamese period ("Tiết") based on start & end time
  const getPeriodLabel = (item: TimetableScheduleItem) => {
    if (item.description && /tiết\s*:\s*\d+/i.test(item.description)) {
      const match = item.description.match(/tiết\s*:\s*[\d\s\-]+/i);
      if (match) return match[0];
    }
    const start = item.startTime || "07:30";
    const end = item.endTime || "09:30";
    const sHour = parseInt(start.split(":")[0], 10);
    const sMin = parseInt(start.split(":")[1] || "0", 10);
    const eHour = parseInt(end.split(":")[0], 10);
    const eMin = parseInt(end.split(":")[1] || "0", 10);

    const startTotal = sHour * 60 + sMin;
    const endTotal = eHour * 60 + eMin;

    return `Giờ: ${start} - ${end}`;
  };

  // Determine card variant for Kindergarten:
  // 1. 'event': Warm Amber card for School-wide events / Special activities
  // 2. 'outdoor': Soft Vibrant Green card for Outdoor / Physical / Craft activities
  // 3. 'routine': Light Sky-blue card for Regular learning / Daily routines
  const getCardStyle = (item: TimetableScheduleItem) => {
    const evaluable = isEvaluableActivity(item);

    // If it's a daily care routine (not an evaluable educational activity)
    if (!evaluable) {
      return {
        variant: "routine",
        containerClass:
          "bg-slate-50 border border-slate-200 text-slate-700 shadow-2xs hover:bg-slate-100/80 transition",
        titleClass: "font-semibold text-[11px] text-slate-700 leading-tight",
        textClass: "text-[10px] text-slate-500 leading-snug",
        badge: "⏰ SINH HOẠT",
        badgeClass: "bg-slate-200 text-slate-600 font-bold",
      };
    }

    const isEvent =
      Boolean(item.isSchoolWide) ||
      item.type === 2 ||
      Boolean(item.title && /lễ hội|sự kiện|dã ngoại|hội thao|trải nghiệm|toàn trường/i.test(item.title));

    if (isEvent) {
      return {
        variant: "event",
        containerClass:
          "bg-[#fef3c7] border border-[#fde68a] text-amber-950 shadow-2xs hover:shadow-xs",
        titleClass: "font-bold text-[12px] text-amber-950 leading-tight",
        textClass: "text-[11px] text-amber-900 leading-snug",
        badge: item.isSchoolWide ? "TOÀN TRƯỜNG" : "⭐ SỰ KIỆN - HOẠT ĐỘNG",
        badgeClass: "bg-amber-200 text-amber-900 font-bold",
      };
    }

    const textToScan = `${item.title || ""} ${item.description || ""} ${
      item.location || ""
    }`.toLowerCase();

    const isOutdoor =
      textToScan.includes("vận động") ||
      textToScan.includes("ngoài trời") ||
      textToScan.includes("sân trường") ||
      textToScan.includes("thể chất");

    if (isOutdoor) {
      return {
        variant: "outdoor",
        containerClass:
          "bg-[#dcfce7] border border-[#bbf7d0] text-emerald-950 shadow-2xs hover:shadow-xs",
        titleClass: "font-bold text-[12px] text-emerald-950 leading-tight",
        textClass: "text-[11px] text-emerald-900 leading-snug",
        badge: "🏃 VẬN ĐỘNG / NGOÀI TRỜI",
        badgeClass: "bg-emerald-200 text-emerald-900 font-bold",
      };
    }

    // Default evaluable educational activity (soft sky-blue)
    return {
      variant: "routine",
      containerClass:
        "bg-[#e0f2fe] border border-[#bae6fd] text-sky-950 shadow-2xs hover:shadow-xs",
      titleClass: "font-bold text-[12px] text-sky-950 leading-tight",
      textClass: "text-[11px] text-sky-800 leading-snug",
      badge: "🎨 HOẠT ĐỘNG GIÁO DỤC",
      badgeClass: "bg-sky-200 text-sky-800 font-bold",
    };
  };

  // Format date display for input (DD/MM/YYYY)
  const displaySelectedDate = useMemo(() => {
    const [y, m, d] = selectedDate.split("-");
    if (!y || !m || !d) return "";
    return `${d}/${m}/${y}`;
  }, [selectedDate]);

  return (
    <div
      ref={containerRef}
      className={`timetable-root bg-white font-sans ${
        isFullscreen ? "fixed inset-0 z-50 overflow-y-auto p-6 bg-slate-50" : "space-y-4"
      }`}
    >
      {/* ============================================================== */}
      {/* TOP HEADER: Title, Filters (Tất cả, Lịch học, Lịch thi), Date, Buttons */}
      {/* ============================================================== */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-3">
        {/* Title & Radio Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 min-w-0">
          <h1 className="text-lg sm:text-2xl font-black tracking-tight text-slate-800">
            Thời khóa biểu & Lịch sinh hoạt
          </h1>

          {/* Radio filter group */}
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

        {/* Date Selector & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Picker Input */}
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

          {/* Button: Hiện tại */}
          <button
            onClick={handleGoToday}
            className="inline-flex items-center gap-1.5 rounded-md bg-[#0284c7] hover:bg-[#0369a1] px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-white shadow-xs transition"
            title="Trở về tuần hiện tại"
          >
            <CalendarIcon size={14} />
            <span>Hiện tại</span>
          </button>

          {/* Button: In lịch */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-md bg-[#0284c7] hover:bg-[#0369a1] px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-white shadow-xs transition"
            title="In thời khóa biểu"
          >
            <Printer size={14} />
            <span>In lịch</span>
          </button>

          {/* Button: < Trở về */}
          <button
            onClick={handlePrevWeek}
            className="inline-flex items-center gap-1 rounded-md bg-[#0284c7] hover:bg-[#0369a1] px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-white shadow-xs transition"
            title="Tuần trước"
          >
            <span>&lt; Trở về</span>
          </button>

          {/* Button: Tiếp > */}
          <button
            onClick={handleNextWeek}
            className="inline-flex items-center gap-1 rounded-md bg-[#0284c7] hover:bg-[#0369a1] px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-white shadow-xs transition"
            title="Tuần kế tiếp"
          >
            <span>Tiếp &gt;</span>
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="inline-flex items-center justify-center rounded-md bg-[#0284c7] hover:bg-[#0369a1] p-1.5 text-white shadow-xs transition h-8 w-8"
            title={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>

      {/* Sub-bar for Role Actions (Admin Class selector & Add button / Parent Child info) */}
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

      {/* Loading state bar */}
      {loading && (
        <div className="flex items-center justify-center gap-2 py-2 text-xs font-medium text-sky-600 bg-sky-50 rounded-md border border-sky-100">
          <Loader2 size={14} className="animate-spin" />
          <span>Đang tải dữ liệu lịch từ hệ thống...</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* MOBILE DAY-VIEW: Cho màn hình điện thoại (< md)                */}
      {/* ============================================================== */}
      <div className="block md:hidden space-y-3.5">
        {/* Thanh chọn ngày trong tuần (scroll ngang mượt mà) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
          {currentWeekDays.map((day) => {
            const isSelected = day.isoDate === selectedMobileDay;
            const dayEvents = filteredSchedules.filter((item) => item.date === day.isoDate);
            return (
              <button
                key={day.isoDate}
                type="button"
                onClick={() => setSelectedMobileDay(day.isoDate)}
                className={`shrink-0 flex flex-col items-center justify-center min-w-[58px] py-2 px-1 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#0284c7] text-white border-[#0284c7] shadow-sm font-bold"
                    : day.isToday
                    ? "bg-sky-50 text-sky-800 border-sky-300 font-semibold"
                    : "bg-white text-slate-700 border-slate-200"
                }`}
              >
                <span className="text-[10px] uppercase font-bold">{day.dayName}</span>
                <span className={`text-xs font-black mt-0.5 ${isSelected ? "text-white" : "text-slate-800"}`}>
                  {day.formattedDate.slice(0, 5)}
                </span>
                {dayEvents.length > 0 && (
                  <span
                    className={`mt-1 text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                      isSelected ? "bg-white/20 text-white" : "bg-sky-100 text-sky-700"
                    }`}
                  >
                    {dayEvents.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Danh sách hoạt động của ngày được chọn */}
        <div className="space-y-3">
          {/* Ca Sáng */}
          <div className="rounded-3xl border border-slate-200 bg-white p-3.5 shadow-2xs space-y-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="flex items-center gap-1.5 text-xs font-black text-[#785412] bg-[#fef9c3] px-2.5 py-1 rounded-xl">
                🌅 Ca sáng
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                {getEventsForCell(selectedMobileDay, "morning").length} hoạt động
              </span>
            </div>
            {getEventsForCell(selectedMobileDay, "morning").length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2 text-center">Không có lịch học/hoạt động buổi sáng</p>
            ) : (
              <div className="space-y-2">
                {getEventsForCell(selectedMobileDay, "morning").map((item) => (
                  <ScheduleCard
                    key={item.id}
                    item={item}
                    periodLabel={getPeriodLabel(item)}
                    styleConfig={getCardStyle(item)}
                    userRole={userRole}
                    onEdit={onEditSchedule}
                    onDelete={onDeleteSchedule}
                    onClick={() => handleCardClick(item)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Ca Chiều */}
          <div className="rounded-3xl border border-slate-200 bg-white p-3.5 shadow-2xs space-y-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="flex items-center gap-1.5 text-xs font-black text-[#785412] bg-[#fef9c3] px-2.5 py-1 rounded-xl">
                🌇 Ca chiều
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                {getEventsForCell(selectedMobileDay, "afternoon").length} hoạt động
              </span>
            </div>
            {getEventsForCell(selectedMobileDay, "afternoon").length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2 text-center">Không có lịch học/hoạt động buổi chiều</p>
            ) : (
              <div className="space-y-2">
                {getEventsForCell(selectedMobileDay, "afternoon").map((item) => (
                  <ScheduleCard
                    key={item.id}
                    item={item}
                    periodLabel={getPeriodLabel(item)}
                    styleConfig={getCardStyle(item)}
                    userRole={userRole}
                    onEdit={onEditSchedule}
                    onDelete={onDeleteSchedule}
                    onClick={() => handleCardClick(item)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TIMETABLE GRID TABLE: Dành cho Desktop & Tablet (md+)            */}
      {/* ============================================================== */}
      <div className="hidden md:block border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table
            className="w-full min-w-[1050px] border-collapse text-left"
            style={{
              tableLayout: "fixed",
            }}
          >
            {/* Header Columns: Ca học (w: ~90px), 7 Days (w: 1fr each) */}
            <thead>
              <tr className="bg-[#f0f9ff] border-b border-slate-200">
                <th className="w-24 p-3 text-center font-bold text-sm text-[#0284c7] border-r border-slate-200">
                  Ca học
                </th>

                {currentWeekDays.map((day) => (
                  <th
                    key={day.isoDate}
                    className={`p-2.5 text-center border-r border-slate-200 last:border-r-0 transition-colors ${
                      day.isToday ? "bg-sky-100/90 text-[#0369a1]" : "text-[#0284c7]"
                    }`}
                  >
                    <div className="text-sm font-bold">{day.dayName}</div>
                    <div className="text-xs font-semibold mt-0.5 opacity-90">
                      {day.formattedDate}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body Rows: Sáng, Chiều, Tối */}
            <tbody className="divide-y divide-slate-200 bg-white">
              {/* ROW 1: SÁNG */}
              <tr>
                <td className="w-24 p-3 text-center font-bold text-sm bg-[#fef9c3] text-[#785412] border-r border-slate-200 align-middle">
                  Sáng
                </td>
                {currentWeekDays.map((day) => {
                  const events = getEventsForCell(day.isoDate, "morning");
                  return (
                    <td
                      key={day.isoDate}
                      className="p-2 border-r border-slate-200 last:border-r-0 align-top min-h-[160px] h-[160px]"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, #f8fafc 1px, transparent 1px), linear-gradient(to bottom, #f8fafc 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                      }}
                    >
                      <div className="space-y-2 h-full">
                        {events.map((item) => (
                          <ScheduleCard
                            key={item.id}
                            item={item}
                            periodLabel={getPeriodLabel(item)}
                            styleConfig={getCardStyle(item)}
                            userRole={userRole}
                            onEdit={onEditSchedule}
                            onDelete={onDeleteSchedule}
                            onClick={() => handleCardClick(item)}
                          />
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* ROW 2: CHIỀU */}
              <tr>
                <td className="w-24 p-3 text-center font-bold text-sm bg-[#fef9c3] text-[#785412] border-r border-slate-200 align-middle">
                  Chiều
                </td>
                {currentWeekDays.map((day) => {
                  const events = getEventsForCell(day.isoDate, "afternoon");
                  return (
                    <td
                      key={day.isoDate}
                      className="p-2 border-r border-slate-200 last:border-r-0 align-top min-h-[160px] h-[160px]"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, #f8fafc 1px, transparent 1px), linear-gradient(to bottom, #f8fafc 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                      }}
                    >
                      <div className="space-y-2 h-full">
                        {events.map((item) => (
                          <ScheduleCard
                            key={item.id}
                            item={item}
                            periodLabel={getPeriodLabel(item)}
                            styleConfig={getCardStyle(item)}
                            userRole={userRole}
                            onEdit={onEditSchedule}
                            onDelete={onDeleteSchedule}
                            onClick={() => handleCardClick(item)}
                          />
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* ROW 3: TỐI */}
              <tr>
                <td className="w-24 p-3 text-center font-bold text-sm bg-[#fef9c3] text-[#785412] border-r border-slate-200 align-middle">
                  Tối
                </td>
                {currentWeekDays.map((day) => {
                  const events = getEventsForCell(day.isoDate, "evening");
                  return (
                    <td
                      key={day.isoDate}
                      className="p-2 border-r border-slate-200 last:border-r-0 align-top min-h-[160px] h-[160px]"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, #f8fafc 1px, transparent 1px), linear-gradient(to bottom, #f8fafc 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                      }}
                    >
                      <div className="space-y-2 h-full">
                        {events.map((item) => (
                          <ScheduleCard
                            key={item.id}
                            item={item}
                            periodLabel={getPeriodLabel(item)}
                            styleConfig={getCardStyle(item)}
                            userRole={userRole}
                            onEdit={onEditSchedule}
                            onDelete={onDeleteSchedule}
                            onClick={() => handleCardClick(item)}
                          />
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Item Details Modal */}
      {selectedItemForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-sky-600 bg-sky-50 px-2 py-0.5 rounded">
                  Chi tiết lịch
                </span>
                <h3 className="mt-1 text-base font-bold text-slate-800">
                  {selectedItemForModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedItemForModal(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              {selectedItemForModal.description && (
                <p className="text-slate-700 font-medium">
                  {selectedItemForModal.description}
                </p>
              )}
              <div className="flex items-center gap-2">
                <Clock size={13} className="text-slate-400" />
                <span>
                  {selectedItemForModal.startTime} - {selectedItemForModal.endTime} (
                  {getPeriodLabel(selectedItemForModal)})
                </span>
              </div>
              {selectedItemForModal.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={13} className="text-slate-400" />
                  <span>{selectedItemForModal.location}</span>
                </div>
              )}
              {selectedItemForModal.teacherName && (
                <div className="flex items-center gap-2">
                  <User size={13} className="text-slate-400" />
                  <span>GV: {selectedItemForModal.teacherName}</span>
                </div>
              )}
              {selectedItemForModal.className && (
                <div className="flex items-center gap-2 font-medium text-sky-700">
                  <span>Lớp: {selectedItemForModal.className}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedItemForModal(null)}
                className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponent: Schedule Card
interface ScheduleCardProps {
  item: TimetableScheduleItem;
  periodLabel: string;
  styleConfig: {
    variant: string;
    containerClass: string;
    titleClass: string;
    textClass: string;
    badge: string | null;
    badgeClass: string;
  };
  userRole: "admin" | "teacher" | "parent";
  onEdit?: (item: TimetableScheduleItem) => void;
  onDelete?: (id: string) => void;
  onClick: () => void;
}

function ScheduleCard({
  item,
  periodLabel,
  styleConfig,
  userRole,
  onEdit,
  onDelete,
  onClick,
}: ScheduleCardProps) {
  const rawSubject = item.teachers?.[0]?.subject || "";
  const cleanSubject = rawSubject.startsWith("ACT:") ? "" : rawSubject;
  const teacherText =
    item.teacherName ||
    item.teachers?.[0]?.teacherId ||
    cleanSubject ||
    "";

  const codeOrClass =
    item.description || item.className || (item.isSchoolWide ? "Toàn trường" : "");

  return (
    <div
      onClick={onClick}
      className={`group relative rounded-md p-2.5 transition cursor-pointer ${styleConfig.containerClass}`}
    >
      {/* Admin Action Buttons on Hover */}
      {userRole === "admin" && (onEdit || onDelete) && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-1.5 right-1.5 hidden group-hover:flex items-center gap-1 bg-white/90 backdrop-blur-xs rounded p-0.5 shadow-xs"
        >
          {onEdit && (
            <button
              onClick={() => onEdit(item)}
              className="p-1 text-slate-600 hover:text-sky-600 rounded"
              title="Chỉnh sửa lịch"
            >
              <Pencil size={11} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(item.id)}
              className="p-1 text-slate-600 hover:text-rose-600 rounded"
              title="Xóa lịch"
            >
              <Trash2 size={11} />
            </button>
          )}
        </div>
      )}

      {/* Badge if exam */}
      {styleConfig.badge && (
        <div className="mb-1">
          <span
            className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${styleConfig.badgeClass}`}
          >
            {styleConfig.badge}
          </span>
        </div>
      )}

      {/* Bold Subject / Activity Title */}
      <h4 className={styleConfig.titleClass}>{item.title}</h4>

      {/* Sub-details: Code/Class, Period, Room, Teacher */}
      <div className={`mt-1 space-y-0.5 ${styleConfig.textClass}`}>
        {codeOrClass && <p className="truncate">{codeOrClass}</p>}
        <p>{periodLabel}</p>
        {item.location && <p className="truncate">Địa điểm: {item.location}</p>}
        {teacherText && <p className="truncate">Phụ trách: {teacherText}</p>}
      </div>

      {/* Role-specific Action Hint */}
      {userRole === "teacher" && (
        <div className="mt-2 pt-1 border-t border-slate-900/10 flex items-center justify-between">
          {isEvaluableActivity(item) ? (
            <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-md shadow-2xs group-hover:bg-rose-200 transition">
              📝 Đánh giá hoạt động →
            </span>
          ) : (
            <span className="text-[10px] font-medium text-slate-500">
              ⏰ Sinh hoạt hàng ngày
            </span>
          )}
        </div>
      )}

      {userRole === "parent" && isEvaluableActivity(item) && (
        <div className="mt-2 pt-1 border-t border-slate-900/10 flex items-center justify-between">
          <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-md shadow-2xs">
            🔍 Xem đánh giá hoạt động
          </span>
        </div>
      )}
    </div>
  );
}
