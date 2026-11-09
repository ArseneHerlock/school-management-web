import { useMemo, useState, useEffect } from 'react';
import { CHILDREN, loadLiveTeacherChildren, Child } from '../data';
import { fetchAttendanceHistory } from './components/attendanceData';
import {
  getLocalDateString,
  submitLockMorningAction,
  submitLateArrivalAction,
  submitEarlyPickupAction,
  submitCheckOutAction,
} from './attendanceActions';
import { useDailyAttendanceQuery } from './useDailyAttendanceQuery';

export type FilterTab = 'ALL' | 'PRESENT' | 'LATE' | 'ABSENT' | 'APPROVED_LEAVE';

export function useAttendanceManager() {
  const [selectedDate, setSelectedDate] = useState<string>(getLocalDateString());
  const [mode, setMode] = useState<'DEN' | 'VE'>('DEN');
  const [noteMap, setNoteMap] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilterTab, setActiveFilterTab] = useState<FilterTab>('ALL');
  const [openNoteChildId, setOpenNoteChildId] = useState<number | null>(null);
  const [tempNoteText, setTempNoteText] = useState<string>('');
  const [childrenVersion, setChildrenVersion] = useState<number>(0);
  const [historyRows, setHistoryRows] = useState<
    Array<{ childId: string; childName: string; rows: any[] }>
  >([]);
  const [historyFromDate, setHistoryFromDate] = useState<string>(() =>
    getLocalDateString(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  );
  const [historyToDate, setHistoryToDate] = useState<string>(getLocalDateString());
  const [historyChildId, setHistoryChildId] = useState<string>('ALL');

  const [lateModalChild, setLateModalChild] = useState<Child | null>(null);
  const [earlyModalChild, setEarlyModalChild] = useState<Child | null>(null);

  useEffect(() => {
    void loadLiveTeacherChildren()
      .catch(() => undefined)
      .finally(() => setChildrenVersion((v) => v + 1));
  }, []);

  const {
    absentIds,
    setAbsentIds,
    lateIds,
    setLateIds,
    approvedLeaveMap,
    isLocked,
    setIsLocked,
    checkedOutIds,
    setCheckedOutIds,
    earlyPickedMap,
    setEarlyPickedMap,
    loadingData,
  } = useDailyAttendanceQuery(selectedDate, childrenVersion);

  useEffect(() => {
    if (!CHILDREN.some((child) => child.apiId)) return;
    let isCancelled = false;
    fetchAttendanceHistory(CHILDREN, historyFromDate, historyToDate)
      .then((rows) => {
        if (!isCancelled) setHistoryRows(rows);
      })
      .catch(() => {});

    return () => {
      isCancelled = true;
    };
  }, [historyFromDate, historyToDate, childrenVersion, submitted]);

  const totalCount = CHILDREN.length;
  const presentCount = totalCount - absentIds.size - lateIds.size;
  const approvedLeaveCount = Array.from(approvedLeaveMap.keys()).filter((id) =>
    CHILDREN.some((child) => child.id === id)
  ).length;

  const selectedDateLabel = new Date(`${selectedDate}T00:00:00`).toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const handleToggleStatus = (id: number, type: 'absent' | 'late') => {
    if (isLocked) {
      alert('Sổ điểm danh sáng đã được chốt sổ (Khóa). Để thay đổi trạng thái, vui lòng dùng tính năng "Đến muộn" hoặc "Đón về sớm".');
      return;
    }

    setSubmitted(false);
    if (type === 'absent') {
      setAbsentIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
          setLateIds((prevLate) => {
            const nextLate = new Set(prevLate);
            nextLate.delete(id);
            return nextLate;
          });
        }
        return next;
      });
    } else {
      setLateIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
          setAbsentIds((prevAbsent) => {
            const nextAbsent = new Set(prevAbsent);
            nextAbsent.delete(id);
            return nextAbsent;
          });
        }
        return next;
      });
    }
  };

  const handleMarkAllPresent = () => {
    if (isLocked) return;
    setSubmitted(false);
    const leaveSet = new Set(approvedLeaveMap.keys());
    setAbsentIds(new Set(leaveSet));
    setLateIds(new Set());
  };

  const handleSubmitAndLockMorning = async () => {
    setSaving(true);
    setErrorMessage('');
    try {
      await submitLockMorningAction(selectedDate, CHILDREN, absentIds, lateIds);
      setIsLocked(true);
      setSubmitted(true);
    } catch (cause: any) {
      setErrorMessage(
        cause instanceof Error ? cause.message : 'Không thể chốt sổ điểm danh lên hệ thống.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLateArrivalSubmit = async (data: {
    time: string;
    note: string;
  }) => {
    if (!lateModalChild?.apiId) return;

    await submitLateArrivalAction(lateModalChild.apiId, selectedDate, data);

    setAbsentIds((prev) => {
      const next = new Set(prev);
      next.delete(lateModalChild.id);
      return next;
    });

    setLateIds((prev) => {
      const next = new Set(prev);
      next.add(lateModalChild.id);
      return next;
    });

    setNoteMap((prev) => ({
      ...prev,
      [lateModalChild.id]: `[Đến muộn ${data.time}] ${data.note || 'Tiếp nhận vào lớp'}`,
    }));

    setLateModalChild(null);
  };

  const handleEarlyPickupSubmit = async (data: {
    time: string;
    nguoiDon: string;
    lyDo: string;
    note: string;
  }) => {
    if (!earlyModalChild?.apiId) return;

    await submitEarlyPickupAction(earlyModalChild.apiId, selectedDate, data);

    setEarlyPickedMap((prev) => {
      const next = new Map(prev);
      next.set(earlyModalChild.id, {
        time: data.time,
        nguoiDon: data.nguoiDon,
        lyDo: data.lyDo,
      });
      return next;
    });

    setCheckedOutIds((prev) => {
      const next = new Set(prev);
      next.add(earlyModalChild.id);
      return next;
    });

    setNoteMap((prev) => ({
      ...prev,
      [earlyModalChild.id]: `[Về sớm ${data.time}] ${data.nguoiDon} đón (${data.lyDo})`,
    }));

    setEarlyModalChild(null);
  };

  const handleCheckOutSingleChild = async (child: Child) => {
    if (!child.apiId || checkedOutIds.has(child.id)) return;

    try {
      await submitCheckOutAction(child.apiId, selectedDate);
      setCheckedOutIds((prev) => {
        const next = new Set(prev);
        next.add(child.id);
        return next;
      });
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xác nhận trả trẻ.');
    }
  };

  const filteredChildren = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return CHILDREN.filter((child) => {
      if (q && !child.name.toLowerCase().includes(q) && !child.nickname.toLowerCase().includes(q)) return false;
      const isAbsent = absentIds.has(child.id);
      const isLate = lateIds.has(child.id);
      const isPresent = !isAbsent && !isLate;
      const isApprovedLeave = approvedLeaveMap.has(child.id);

      if (activeFilterTab === 'PRESENT') return isPresent;
      if (activeFilterTab === 'LATE') return isLate;
      if (activeFilterTab === 'ABSENT') return isAbsent && !isApprovedLeave;
      if (activeFilterTab === 'APPROVED_LEAVE') return isApprovedLeave;
      return true;
    });
  }, [searchQuery, activeFilterTab, childrenVersion, absentIds, lateIds, approvedLeaveMap]);

  return {
    selectedDate,
    setSelectedDate,
    absentIds,
    lateIds,
    approvedLeaveMap,
    mode,
    setMode,
    noteMap,
    setNoteMap,
    submitted,
    setSubmitted,
    saving,
    errorMessage,
    searchQuery,
    setSearchQuery,
    activeFilterTab,
    setActiveFilterTab,
    openNoteChildId,
    setOpenNoteChildId,
    tempNoteText,
    setTempNoteText,
    historyRows,
    historyFromDate,
    setHistoryFromDate,
    historyToDate,
    setHistoryToDate,
    historyChildId,
    setHistoryChildId,
    loadingData,
    isLocked,
    checkedOutIds,
    earlyPickedMap,
    lateModalChild,
    setLateModalChild,
    earlyModalChild,
    setEarlyModalChild,
    totalCount,
    presentCount,
    approvedLeaveCount,
    selectedDateLabel,
    handleToggleStatus,
    handleMarkAllPresent,
    handleSubmitAndLockMorning,
    handleLateArrivalSubmit,
    handleEarlyPickupSubmit,
    handleCheckOutSingleChild,
    filteredChildren,
  };
}
