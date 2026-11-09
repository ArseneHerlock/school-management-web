'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/app/components/ui/Modal';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { StudentCompetencyProfile } from '../assessmentBatchHelpers';
import { ChildCompetencyProfileModal } from './ChildCompetencyProfileModal';

interface TeacherAssessmentModalsProps {
  cellDetailModal: {
    open: boolean;
    studentId: string;
    criterionId: string;
    studentName: string;
    criterionName: string;
    comment: string;
    evidence: string;
  };
  onCloseCellDetail: () => void;
  onSaveCellDetail: (comment: string, evidence: string) => void;

  childRadarModal: {
    open: boolean;
    student: any | null;
  };
  onCloseRadar: () => void;
  radarData: any[];
  competencyProfile?: StudentCompetencyProfile | null;
  onGoToMatrix?: () => void;

  confirmModalOpen: boolean;
  onCloseConfirmModal: () => void;
  onConfirmSave: () => void;
  dirtyCount: number;
  isSaving: boolean;
}

export default function TeacherAssessmentModals({
  cellDetailModal,
  onCloseCellDetail,
  onSaveCellDetail,
  childRadarModal,
  onCloseRadar,
  radarData,
  competencyProfile,
  onGoToMatrix,
  confirmModalOpen,
  onCloseConfirmModal,
  onConfirmSave,
  dirtyCount,
  isSaving,
}: TeacherAssessmentModalsProps) {
  const [tempComment, setTempComment] = useState('');
  const [tempEvidence, setTempEvidence] = useState('');

  useEffect(() => {
    if (cellDetailModal.open) {
      setTempComment(cellDetailModal.comment || '');
      setTempEvidence(cellDetailModal.evidence || '');
    }
  }, [cellDetailModal.open, cellDetailModal.comment, cellDetailModal.evidence]);

  return (
    <>
      {/* 1. Modal Chi tiết Ô Đánh Giá */}
      <Modal
        isOpen={cellDetailModal.open}
        onClose={onCloseCellDetail}
        title={`Đánh giá: ${cellDetailModal.studentName}`}
        subtitle={`Tiêu chí: ${cellDetailModal.criterionName}`}
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700">Nhận xét chi tiết của cô</label>
            <textarea
              rows={3}
              className="mt-1 w-full rounded-2xl border border-rose-200 p-3 text-xs outline-none focus:border-rose-400"
              value={tempComment}
              onChange={(e) => setTempComment(e.target.value)}
              placeholder="VD: Bé thực hiện rất tự tin, hoàn thành tốt..."
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700">Minh chứng / Hình ảnh</label>
            <input
              type="text"
              className="mt-1 w-full rounded-xl border border-rose-200 p-2.5 text-xs outline-none focus:border-rose-400"
              value={tempEvidence}
              onChange={(e) => setTempEvidence(e.target.value)}
              placeholder="Link hình ảnh hoặc ghi chú minh chứng..."
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={onCloseCellDetail}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                onSaveCellDetail(tempComment, tempEvidence);
                onCloseCellDetail();
              }}
              className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 cursor-pointer"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </Modal>

      {/* 2. Modal Hồ Sơ Năng Lực Chuẩn 5 Lĩnh Vực Của Bé */}
      <ChildCompetencyProfileModal
        isOpen={childRadarModal.open}
        onClose={onCloseRadar}
        student={childRadarModal.student}
        radarData={radarData}
        competencyProfile={competencyProfile}
        onGoToMatrix={onGoToMatrix}
      />

      {/* 3. Confirm Modal Lưu Hàng Loạt */}
      <ConfirmModal
        isOpen={confirmModalOpen}
        onClose={onCloseConfirmModal}
        onConfirm={onConfirmSave}
        title="Lưu đánh giá hàng loạt"
        message={`Bạn đang lưu ${dirtyCount} thay đổi đánh giá cho các bé trong lớp. Bạn có chắc chắn muốn lưu lại không?`}
        confirmText="Lưu ngay"
        variant="primary"
        loading={isSaving}
      />
    </>
  );
}
