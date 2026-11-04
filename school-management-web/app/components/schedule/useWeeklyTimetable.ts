"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  TimetableScheduleItem,
  WeeklyTimetableProps,
  CardStyleConfig,
  DayInfo,
  isEvaluableActivity,
} from "./types";

export function useWeeklyTimetable({
  userRole,
  fetchSchedules,
  selectedClassId = "ALL",
  onItemClick,
}: Pick<
  WeeklyTimetableProps,
  "userRole" | "fetchSchedules" | "selectedClassId" | "onItemClick"
>) {
  const [selectedDate, setSelectedDate] = useState<string>(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [filterMode, setFilterMode] = useState<"ALL" | "LESSON" | "ACTIVITY">("ALL");
  const [schedules, setSchedules] = useState<TimetableScheduleItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedItemForModal, setSelectedItemForModal] =
    useState<TimetableScheduleItem | null>(null);
  const [selectedMobileDay, setSelectedMobileDay] = useState<string>(() =>
    new Date().toISOString().slice(0, 10)
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Compute Monday - Sunday week dates based on selectedDate
  const currentWeekDays: DayInfo[] = useMemo(() => {
    const [y, m, d] = selectedDate.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    const dayOfWeek = dateObj.getDay(); // 0 is Sunday
    const diffToMonday = dateObj.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);

    const monday = new Date(y, m - 1, diffToMonday);
    const days: DayInfo[] = [];
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

  // Filter schedules locally
  const filteredSchedules = useMemo(() => {
    return schedules.filter((item) => {
      const isEventOrActivity =
        item.isSchoolWide || item.type === 2 || item.isActivity;

      if (filterMode === "LESSON") return !isEventOrActivity;
      if (filterMode === "ACTIVITY") return isEventOrActivity;
      return true;
    });
  }, [schedules, filterMode]);

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
    if (onItemClick) {
      onItemClick(item);
    } else {
      setSelectedItemForModal(item);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => setIsFullscreen(!isFullscreen));
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(() => setIsFullscreen(false));
    }
  };

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

  const getPeriodLabel = (item: TimetableScheduleItem) => {
    if (item.description && /tiết\s*:\s*\d+/i.test(item.description)) {
      const match = item.description.match(/tiết\s*:\s*[\d\s\-]+/i);
      if (match) return match[0];
    }
    const start = item.startTime || "07:30";
    const end = item.endTime || "09:30";
    return `Giờ: ${start} - ${end}`;
  };

  const getCardStyle = (item: TimetableScheduleItem): CardStyleConfig => {
    const evaluable = isEvaluableActivity(item);

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
      Boolean(
        item.title &&
          /lễ hội|sự kiện|dã ngoại|hội thao|trải nghiệm|toàn trường/i.test(item.title)
      );

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

  const displaySelectedDate = useMemo(() => {
    const [y, m, d] = selectedDate.split("-");
    if (!y || !m || !d) return "";
    return `${d}/${m}/${y}`;
  }, [selectedDate]);

  return {
    selectedDate,
    setSelectedDate,
    filterMode,
    setFilterMode,
    schedules,
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
  };
}
