'use client'

import React from 'react'
import Modal from '@/app/components/ui/Modal'
import { ActivityItem, CriterionItem } from "@/services/development"

interface ActivityLinkModalsProps {
  activityModalOpen: boolean
  onCloseActivityModal: () => void
  editingActivity: ActivityItem | null
  activityForm: {
    code: string
    name: string
    description: string
    instructions: string
    minAgeMonths: number
    maxAgeMonths: number
    isActive: boolean
  }
  setActivityForm: React.Dispatch<React.SetStateAction<any>>
  onSaveActivity: () => void
  isSubmitting: boolean

  linkModalOpen: boolean
  onCloseLinkModal: () => void
  linkingActivity: ActivityItem | null
  criteria: CriterionItem[]
  selectedCriterionIdToLink: string
  setSelectedCriterionIdToLink: (val: string) => void
  observationGuide: string
  setObservationGuide: (val: string) => void
  onSaveLink: () => void
}

export default function ActivityLinkModals({
  activityModalOpen,
  onCloseActivityModal,
  editingActivity,
  activityForm,
  setActivityForm,
  onSaveActivity,
  isSubmitting,
  linkModalOpen,
  onCloseLinkModal,
  linkingActivity,
  criteria,
  selectedCriterionIdToLink,
  setSelectedCriterionIdToLink,
  observationGuide,
  setObservationGuide,
  onSaveLink,
}: ActivityLinkModalsProps) {
  return (
    <>
      <Modal
        isOpen={activityModalOpen}
        onClose={onCloseActivityModal}
        title={editingActivity ? 'Chỉnh sửa hoạt động' : 'Thêm hoạt động phát triển'}
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-600">Mã hoạt động</label>
              <input
                className="mt-1 w-full rounded-xl border border-emerald-200 p-2.5 text-xs outline-none focus:border-emerald-400"
                value={activityForm.code}
                onChange={(e) => setActivityForm((p: any) => ({ ...p, code: e.target.value }))}
                placeholder="VD: ACT-01"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600">Tên hoạt động</label>
              <input
                className="mt-1 w-full rounded-xl border border-emerald-200 p-2.5 text-xs outline-none focus:border-emerald-400"
                value={activityForm.name}
                onChange={(e) => setActivityForm((p: any) => ({ ...p, name: e.target.value }))}
                placeholder="VD: Xếp hình sáng tạo"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600">Mô tả mục tiêu</label>
            <textarea
              rows={2}
              className="mt-1 w-full rounded-xl border border-emerald-200 p-2.5 text-xs outline-none focus:border-emerald-400"
              value={activityForm.description}
              onChange={(e) => setActivityForm((p: any) => ({ ...p, description: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={onCloseActivityModal}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              onClick={onSaveActivity}
              disabled={isSubmitting}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu hoạt động'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={linkModalOpen}
        onClose={onCloseLinkModal}
        title={`Gán tiêu chí cho "${linkingActivity?.name}"`}
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-600">Chọn tiêu chí phát triển</label>
            <select
              className="mt-1 w-full rounded-xl border border-emerald-200 p-2.5 text-xs outline-none focus:border-emerald-400"
              value={selectedCriterionIdToLink}
              onChange={(e) => setSelectedCriterionIdToLink(e.target.value)}
            >
              <option value="">-- Chọn tiêu chí --</option>
              {criteria.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600">Hướng dẫn quan sát</label>
            <textarea
              rows={3}
              className="mt-1 w-full rounded-xl border border-emerald-200 p-2.5 text-xs outline-none focus:border-emerald-400"
              value={observationGuide}
              onChange={(e) => setObservationGuide(e.target.value)}
              placeholder="Gợi ý cô giáo quan sát khi bé thực hiện..."
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={onCloseLinkModal}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              onClick={onSaveLink}
              disabled={isSubmitting || !selectedCriterionIdToLink}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Đang lưu...' : 'Xác nhận gán'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
