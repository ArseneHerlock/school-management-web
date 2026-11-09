import { useState } from 'react';

export function useAssessmentModals() {
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [cellDetailModal, setCellDetailModal] = useState({
    open: false,
    studentId: '',
    criterionId: '',
    studentName: '',
    criterionName: '',
    comment: '',
    evidence: '',
  });
  const [childRadarModal, setChildRadarModal] = useState<{ open: boolean; student: any | null }>({
    open: false,
    student: null,
  });

  return {
    confirmModalOpen,
    setConfirmModalOpen,
    cellDetailModal,
    setCellDetailModal,
    childRadarModal,
    setChildRadarModal,
  };
}
