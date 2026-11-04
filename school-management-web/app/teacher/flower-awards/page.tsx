'use client';

import React from 'react';
import { useFlowerAwards } from './useFlowerAwards';
import { FlowerAwardsHeader } from './components/FlowerAwardsHeader';
import { FlowerAwardsGrid } from './components/FlowerAwardsGrid';
import { FlowerAwardsModal } from './components/FlowerAwardsModal';
import { FlowerRevokeModal } from './components/FlowerRevokeModal';

export default function FlowerAwardsPage() {
  const {
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    lastDayOfMonth,
    studentsList,
    selectedStudentForAward,
    setSelectedStudentForAward,
    awardDate,
    setAwardDate,
    awardReason,
    setAwardReason,
    flowerToRevoke,
    setFlowerToRevoke,
    revokeReason,
    setRevokeReason,
    isLoading,
    isSubmitting,
    feedbackMessage,
    setFeedbackMessage,
    errorMessage,
    setErrorMessage,
    loadFlowerAwardsData,
    getRecordForStudent,
    handleOpenAwardModal,
    handleAwardFlower,
    handleConfirmRevokeFlower,
  } = useFlowerAwards();

  return (
    <div className="space-y-6">
      <FlowerAwardsHeader
        isLoading={isLoading}
        onRefresh={() => void loadFlowerAwardsData()}
        feedbackMessage={feedbackMessage}
        setFeedbackMessage={setFeedbackMessage}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        lastDayOfMonth={lastDayOfMonth}
      />

      <FlowerAwardsGrid
        isLoading={isLoading}
        studentsList={studentsList}
        getRecordForStudent={getRecordForStudent}
        onOpenAwardModal={handleOpenAwardModal}
      />

      <FlowerAwardsModal
        selectedStudentForAward={selectedStudentForAward}
        onClose={() => setSelectedStudentForAward(null)}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        lastDayOfMonth={lastDayOfMonth}
        awardDate={awardDate}
        setAwardDate={setAwardDate}
        awardReason={awardReason}
        setAwardReason={setAwardReason}
        isSubmitting={isSubmitting}
        onAwardFlower={() => void handleAwardFlower()}
        onSelectFlowerToRevoke={(flower) => {
          setFlowerToRevoke(flower);
          setRevokeReason('');
        }}
      />

      <FlowerRevokeModal
        flowerToRevoke={flowerToRevoke}
        onClose={() => setFlowerToRevoke(null)}
        revokeReason={revokeReason}
        setRevokeReason={setRevokeReason}
        isSubmitting={isSubmitting}
        onConfirmRevoke={() => void handleConfirmRevokeFlower()}
      />
    </div>
  );
}
