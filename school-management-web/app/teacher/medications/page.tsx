'use client';

import React from 'react';
import { useTeacherMedications } from './useTeacherMedications';
import { MedicationHeader } from './components/MedicationHeader';
import { MedicationTabs } from './components/MedicationTabs';
import { MedicationTodayTab } from './components/MedicationTodayTab';
import { MedicationSpecialTab } from './components/MedicationSpecialTab';
import { MedicationAllClassTab } from './components/MedicationAllClassTab';
import { MedicationConfirmModal } from './components/MedicationConfirmModal';

export default function TeacherMedicationPage() {
  const {
    className,
    teacherName,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    loading,
    todayMeds,
    filteredTodayMeds,
    conditions,
    filteredConditions,
    confirmModalItem,
    confirmType,
    issueNote,
    setIssueNote,
    updating,
    loadData,
    handleConfirmSubmit,
    openConfirm,
    closeConfirm,
  } = useTeacherMedications();

  return (
    <div className="mx-auto max-w-6xl space-y-6 font-sans">
      <MedicationHeader
        classNameStr={className}
        loading={loading}
        onRefresh={() => void loadData()}
      />

      <MedicationTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        todayCount={todayMeds.length}
        conditionCount={conditions.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {activeTab === 'TODAY' && (
        <MedicationTodayTab
          filteredTodayMeds={filteredTodayMeds}
          onOpenConfirm={openConfirm}
        />
      )}

      {activeTab === 'SPECIAL' && (
        <MedicationSpecialTab filteredConditions={filteredConditions} />
      )}

      {activeTab === 'ALL' && (
        <MedicationAllClassTab
          classNameStr={className}
          todayMeds={todayMeds}
          conditions={conditions}
        />
      )}

      <MedicationConfirmModal
        confirmModalItem={confirmModalItem}
        confirmType={confirmType}
        issueNote={issueNote}
        setIssueNote={setIssueNote}
        updating={updating}
        teacherName={teacherName}
        onClose={closeConfirm}
        onSubmit={handleConfirmSubmit}
      />
    </div>
  );
}
