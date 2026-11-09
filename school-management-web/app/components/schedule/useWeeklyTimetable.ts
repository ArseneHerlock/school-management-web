"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  TimetableScheduleItem,
  WeeklyTimetableProps,
  DayInfo,
} from "./types";
import { computeWeekDays, getPeriodLabel, getCardStyle } from "./timetableHelpers";

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
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedItemForModal, setSelectedItemForModal] =
    useState<TimetableScheduleItem | null>(null);
  const [selectedMobileDay, setSelectedMobileDay] = useState<string>(() =>
    new Date().toISOString().slice(0, 10)
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const fetchSchedulesRef = useRef(fetchSchedules);
  fetchSchedulesRef.current = fetchSchedules;

  const currentWeekDays: DayInfo[] = useMemo(() => {
    return computeWeekDays(selectedDate);
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

  useEffect(() => {
    let isCancelled = false;
    const load = async () => {
      if (schedules.length === 0) {
        setIsInitialLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setLoading(true);

      try {
        const typeQuery =
          filterMode === "LESSON" ? 1 : filterMode === "ACTIVITY" ? 2 : undefined;

        const data = await fetchSchedulesRef.current({
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
          setIsInitialLoading(false);
          setIsRefreshing(false);
        }
      }
    };

    void load();
    return () => {
      isCancelled = true;
    };
  }, [weekRange.from, weekRange.to, selectedClassId, filterMode]);

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
        if (!item.date || item.date.slice(0, 10) !== isoDate) return false;
        const cleanTime = (item.startTime || "").trim();
        const match = cleanTime.match(/^(\d{1,2})/);
        const hour = match ? parseInt(match[1], 10) : 8;
        if (session === "morning") return hour < 12;
        if (session === "afternoon") return hour >= 12 && hour < 17;
        return hour >= 17;
      })
      .sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));
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
  };
}
