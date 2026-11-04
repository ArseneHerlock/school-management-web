'use client'

import React from 'react'
import Modal from '@/app/components/ui/Modal'
import { DomainItem, CriterionItem } from "@/services/development"
import { AdminMatrixDetail } from '../types'

interface DanhGiaModalsProps {
  domainModalOpen: boolean
  onCloseDomainModal: () => void
  editingDomain: DomainItem | null
  domainForm: { code: string; name: string; description: string; isActive: boolean }
  setDomainForm: React.Dispatch<React.SetStateAction<any>>
  onSaveDomain: () => void

  criterionModalOpen: boolean
  onCloseCriterionModal: () => void
  editingCriterion: CriterionItem | null
  criterionForm: { developmentDomainId: string; code: string; name: string; description: string; isActive: boolean }
  setCriterionForm: React.Dispatch<React.SetStateAction<any>>
  domains: DomainItem[]
  onSaveCriterion: () => void

  adminMatrixDetailModal: AdminMatrixDetail
  onCloseDetailModal: () => void
  onSaveDetailModal: () => void
}

export default function DanhGiaModals({
  domainModalOpen,
  onCloseDomainModal,
  editingDomain,
  domainForm,
  setDomainForm,
  onSaveDomain,
  criterionModalOpen,
  onCloseCriterionModal,
  editingCriterion,
  criterionForm,
  setCriterionForm,
  domains,
  onSaveCriterion,
  adminMatrixDetailModal,
  onCloseDetailModal,
  onSaveDetailModal,
}: DanhGiaModalsProps) {
  return (
    <>
      {/* Modal Lĩnh vực */}
      <Modal
        isOpen={domainModalOpen}
        onClose={onCloseDomainModal}
        title={editingDomain ? 'Sửa Lĩnh vực' : 'Thêm Lĩnh vực mới'}
        maxWidth="sm"
      >
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-600">Mã lĩnh vực</label>
            <input
              className="mt-1 w-full rounded-xl border border-rose-200 p-2 text-xs outline-none"
              value={domainForm.code}
              onChange={(e) => setDomainForm((p: any) => ({ ...p, code: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600">Tên lĩnh vực</label>
            <input
              className="mt-1 w-full rounded-xl border border-rose-200 p-2 text-xs outline-none"
              value={domainForm.name}
              onChange={(e) => setDomainForm((p: any) => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onCloseDomainModal} className="rounded-xl border px-3 py-1.5 text-xs">
              Hủy
            </button>
            <button onClick={onSaveDomain} className="rounded-xl bg-rose-600 px-3 py-1.5 text-xs text-white">
              Lưu
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Tiêu chí */}
      <Modal
        isOpen={criterionModalOpen}
        onClose={onCloseCriterionModal}
        title={editingCriterion ? 'Sửa Tiêu chí' : 'Thêm Tiêu chí mới'}
        maxWidth="md"
      >
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-600">Thuộc lĩnh vực</label>
            <select
              className="mt-1 w-full rounded-xl border border-rose-200 p-2 text-xs outline-none"
              value={criterionForm.developmentDomainId}
              onChange={(e) => setCriterionForm((p: any) => ({ ...p, developmentDomainId: e.target.value }))}
            >
              <option value="">-- Chọn lĩnh vực --</option>
              {domains.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold text-slate-600">Mã tiêu chí</label>
              <input
                className="mt-1 w-full rounded-xl border border-rose-200 p-2 text-xs outline-none"
                value={criterionForm.code}
                onChange={(e) => setCriterionForm((p: any) => ({ ...p, code: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600">Tên tiêu chí</label>
              <input
                className="mt-1 w-full rounded-xl border border-rose-200 p-2 text-xs outline-none"
                value={criterionForm.name}
                onChange={(e) => setCriterionForm((p: any) => ({ ...p, name: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onCloseCriterionModal} className="rounded-xl border px-3 py-1.5 text-xs">
              Hủy
            </button>
            <button onClick={onSaveCriterion} className="rounded-xl bg-rose-600 px-3 py-1.5 text-xs text-white">
              Lưu
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Chi tiết nhận xét ma trận */}
      <Modal
        isOpen={adminMatrixDetailModal.open}
        onClose={onCloseDetailModal}
        title={`Chi tiết: ${adminMatrixDetailModal.studentName}`}
        subtitle={`Tiêu chí: ${adminMatrixDetailModal.criterionName}`}
        maxWidth="md"
      >
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-600">Ghi chú / Nhận xét của giáo viên</label>
            <textarea
              rows={3}
              className="mt-1 w-full rounded-xl border border-rose-200 p-2.5 text-xs outline-none"
              value={adminMatrixDetailModal.comment}
              onChange={() => onSaveDetailModal()}
              placeholder="Nhập ghi chú quan sát..."
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600">Minh chứng / Hình ảnh</label>
            <input
              className="mt-1 w-full rounded-xl border border-rose-200 p-2.5 text-xs outline-none"
              value={adminMatrixDetailModal.evidence}
              onChange={() => {}}
              placeholder="Link hình ảnh hoặc ghi chú minh chứng..."
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onCloseDetailModal} className="rounded-xl border px-4 py-2 text-xs font-bold">
              Đóng
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
