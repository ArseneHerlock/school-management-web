'use client';

import React from 'react';
import { useYearEndAwards } from './useYearEndAwards';
import { YearEndAwardsHeader } from './components/YearEndAwardsHeader';
import { YearEndAwardsActionBar } from './components/YearEndAwardsActionBar';
import { YearEndAwardsCriteriaTable } from './components/YearEndAwardsCriteriaTable';
import { YearEndAwardsTable } from './components/YearEndAwardsTable';

export default function TeacherYearEndAwardsPage() {
  const {
    className,
    schoolYear,
    setSchoolYear,
    semester,
    setSemester,
    loading,
    saving,
    successToast,
    awards,
    isSubmitted,
    isApproved,
    unassignedCount,
    handleTitleChange,
    handleNoteChange,
    handleApplyAllSuggestions,
    handleSave,
  } = useYearEndAwards();

  return (
    <div className="mx-auto max-w-6xl space-y-6 font-sans max-w-full min-w-0 overflow-x-hidden">
      <YearEndAwardsHeader
        classNameStr={className}
        schoolYear={schoolYear}
        setSchoolYear={setSchoolYear}
        semester={semester}
        setSemester={setSemester}
        successToast={successToast}
      />

      <YearEndAwardsActionBar
        isApproved={isApproved}
        isSubmitted={isSubmitted}
        unassignedCount={unassignedCount}
        saving={saving}
        onApplyAllSuggestions={handleApplyAllSuggestions}
        onSave={handleSave}
      />

      <YearEndAwardsCriteriaTable />

      <YearEndAwardsTable
        loading={loading}
        awards={awards}
        isApproved={isApproved}
        onTitleChange={handleTitleChange}
        onNoteChange={handleNoteChange}
      />
    </div>
  );
}
