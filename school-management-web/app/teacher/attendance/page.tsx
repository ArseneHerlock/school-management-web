'use client';

import React from 'react';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { CHILDREN } from '../data';
import { AttendanceSummaryCard } from './components/AttendanceSummaryCard';
import { AttendanceList } from './components/AttendanceList';
import { AttendanceHistory } from './components/AttendanceHistory';
import { AttendanceNoteModal } from './components/AttendanceNoteModal';
import { TeacherLateArrivalModal } from './components/TeacherLateArrivalModal';
import { TeacherEarlyPickupModal } from './components/TeacherEarlyPickupModal';
import { AttendanceLockBanner } from './components/AttendanceLockBanner';
import { AttendanceActionBar } from './components/AttendanceActionBar';
import { AttendanceBottomLockBar } from './components/AttendanceBottomLockBar';
import { useAttendanceManager } from './useAttendanceManager';

export default function AttendancePage() {
  const {
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
  } = useAttendanceManager();

  return (
    <div className="mx-auto max-w-6xl space-y-6 font-sans">
      <AttendanceSummaryCard
        mode={mode}
        setMode={(newMode) => {
          setMode(newMode);
          setSubmitted(false);
        }}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedLabel={selectedDateLabel}
        presentCount={presentCount}
        absentCount={absentIds.size}
        lateCount={lateIds.size}
        approvedLeaveCount={approvedLeaveCount}
        totalCount={totalCount}
      />

      {mode === 'DEN' && <AttendanceLockBanner isLocked={isLocked} />}

      <AttendanceActionBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilterTab={activeFilterTab}
        setActiveFilterTab={setActiveFilterTab}
        totalCount={totalCount}
        presentCount={presentCount}
        lateCount={lateIds.size}
        absentCount={absentIds.size}
        mode={mode}
        isLocked={isLocked}
        onMarkAllPresent={handleMarkAllPresent}
      />

      {errorMessage && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-700 flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {submitted && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 flex items-center gap-2 text-emerald-800 text-xs font-bold">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>
            {mode === 'DEN'
              ? `Đã chốt sổ và khóa điểm danh sáng thành công! (${presentCount}/${totalCount} học sinh có mặt, ${approvedLeaveCount} bé duyệt nghỉ phép).`
              : 'Đã xác nhận trả trẻ vào hệ thống!'}
          </span>
        </div>
      )}

      {loadingData ? (
        <div className="flex flex-col items-center justify-center p-20 bg-white rounded-3xl border border-orange-100 shadow-sm min-h-[300px]">
          <Loader2 className="h-10 w-10 animate-spin text-orange-500 mb-3" />
          <p className="text-sm font-bold text-slate-700">Đang đồng bộ dữ liệu điểm danh...</p>
        </div>
      ) : (
        <AttendanceList
          childrenList={filteredChildren}
          absentIds={absentIds}
          lateIds={lateIds}
          approvedLeaveMap={approvedLeaveMap}
          noteMap={noteMap}
          mode={mode}
          isLocked={isLocked}
          checkedOutIds={checkedOutIds}
          earlyPickedMap={earlyPickedMap}
          toggle={handleToggleStatus}
          onOpenNote={(childId) => {
            setTempNoteText(noteMap[childId] || '');
            setOpenNoteChildId(childId);
          }}
          onOpenLateArrival={(child) => setLateModalChild(child)}
          onOpenEarlyPickup={(child) => setEarlyModalChild(child)}
          onCheckOutChild={(child) => void handleCheckOutSingleChild(child)}
        />
      )}

      {mode === 'DEN' && !isLocked && (
        <AttendanceBottomLockBar
          selectedDateLabel={selectedDateLabel}
          presentCount={presentCount}
          lateCount={lateIds.size}
          absentCount={absentIds.size}
          saving={saving}
          onSubmitAndLock={() => void handleSubmitAndLockMorning()}
        />
      )}

      <TeacherLateArrivalModal
        child={lateModalChild}
        isOpen={Boolean(lateModalChild)}
        onClose={() => setLateModalChild(null)}
        onSubmit={handleLateArrivalSubmit}
      />

      <TeacherEarlyPickupModal
        child={earlyModalChild}
        isOpen={Boolean(earlyModalChild)}
        onClose={() => setEarlyModalChild(null)}
        onSubmit={handleEarlyPickupSubmit}
      />

      {openNoteChildId !== null && (
        <AttendanceNoteModal
          childName={CHILDREN.find((c) => c.id === openNoteChildId)?.name || ''}
          tempNote={tempNoteText}
          setTempNote={setTempNoteText}
          onClose={() => setOpenNoteChildId(null)}
          onSave={() => {
            if (openNoteChildId !== null) {
              setNoteMap((prev) => ({
                ...prev,
                [openNoteChildId]: tempNoteText.trim(),
              }));
              setOpenNoteChildId(null);
            }
          }}
        />
      )}

      <AttendanceHistory
        historyRows={historyRows}
        historyFrom={historyFromDate}
        historyTo={historyToDate}
        setHistoryFrom={setHistoryFromDate}
        setHistoryTo={setHistoryToDate}
        historyChildId={historyChildId}
        setHistoryChildId={setHistoryChildId}
        childrenList={CHILDREN}
        loadingData={loadingData}
      />
    </div>
  );
}
