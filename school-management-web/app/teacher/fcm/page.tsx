'use client';

import React from 'react';
import { useTeacherFcm } from './useTeacherFcm';
import { FcmHeader } from './components/FcmHeader';
import { FcmClusterStats } from './components/FcmClusterStats';
import { FcmTable } from './components/FcmTable';
import { FcmChildTimelineModal } from './components/FcmChildTimelineModal';

export default function TeacherFCMPage() {
  const {
    className,
    month,
    setMonth,
    year,
    setYear,
    successToast,
    fcmData,
    selectedChild,
    setSelectedChild,
    childHistory,
    loadingHistory,
    handleViewChildTimeline,
  } = useTeacherFcm();

  return (
    <div className="mx-auto max-w-6xl space-y-6 font-sans">
      <FcmHeader
        classNameStr={className}
        month={month}
        setMonth={setMonth}
        year={year}
        setYear={setYear}
        successToast={successToast}
      />

      <FcmClusterStats stats={fcmData?.stats} />

      <FcmTable
        month={month}
        year={year}
        totalChildren={fcmData?.stats.totalChildren || 0}
        childrenList={fcmData?.children || []}
        onViewChildTimeline={handleViewChildTimeline}
      />

      <FcmChildTimelineModal
        selectedChild={selectedChild}
        onClose={() => setSelectedChild(null)}
        loadingHistory={loadingHistory}
        childHistory={childHistory}
      />
    </div>
  );
}
