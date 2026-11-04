'use client';

import React from 'react';
import { useTeacherPickup } from './useTeacherPickup';
import { PickupHeader } from './components/PickupHeader';
import { PickupFilterBar } from './components/PickupFilterBar';
import { PickupList } from './components/PickupList';

export default function TeacherPickupPage() {
  const {
    classes,
    selectedClassId,
    setSelectedClassId,
    loading,
    students,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    processingId,
    toastMessage,
    setToastMessage,
    filteredList,
    waitingCount,
    pickedUpCount,
    handleConfirmPickup,
    handleCancelPickup,
  } = useTeacherPickup();

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 font-sans">
      <PickupHeader
        classes={classes}
        selectedClassId={selectedClassId}
        setSelectedClassId={setSelectedClassId}
        toastMessage={toastMessage}
        setToastMessage={setToastMessage}
      />

      <PickupFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterType={filterType}
        setFilterType={setFilterType}
        totalCount={students.length}
        waitingCount={waitingCount}
        pickedUpCount={pickedUpCount}
      />

      <PickupList
        loading={loading}
        filteredList={filteredList}
        processingId={processingId}
        onConfirmPickup={handleConfirmPickup}
        onCancelPickup={handleCancelPickup}
      />
    </div>
  );
}
