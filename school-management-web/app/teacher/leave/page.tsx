'use client';

import React from 'react';
import { useTeacherLeave } from './useTeacherLeave';
import { LeaveHeader } from './components/LeaveHeader';
import { LeaveFilterBar } from './components/LeaveFilterBar';
import { LeaveList } from './components/LeaveList';

export default function TeacherLeavePage() {
  const {
    leaveApplications,
    isLoading,
    processingId,
    feedbackMessage,
    setFeedbackMessage,
    errorMessage,
    setErrorMessage,
    statusFilter,
    setStatusFilter,
    searchKeyword,
    setSearchKeyword,
    pendingCount,
    approvedCount,
    filteredApplications,
    loadLeaveData,
    handleReviewApplication,
  } = useTeacherLeave();

  return (
    <div className="space-y-6">
      <LeaveHeader
        isLoading={isLoading}
        onRefresh={() => void loadLeaveData()}
        feedbackMessage={feedbackMessage}
        setFeedbackMessage={setFeedbackMessage}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        pendingCount={pendingCount}
        approvedCount={approvedCount}
        totalCount={leaveApplications.length}
      />

      <LeaveFilterBar
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <LeaveList
        isLoading={isLoading}
        filteredApplications={filteredApplications}
        processingId={processingId}
        onReviewApplication={handleReviewApplication}
      />
    </div>
  );
}
