'use client'

import React from 'react'
import ActivityLinkModals from './ActivityLinkModals'
import DanhGiaModals from './DanhGiaModals'
import ConfirmModal from '@/app/components/ui/ConfirmModal'
import {
  createActivity,
  updateActivity,
  linkActivityCriterion,
  createDomain,
  updateDomain,
  createCriterion,
  updateCriterion,
  deleteActivity,
  deleteDomain,
  deleteCriterion,
  deleteAssessment,
  ActivityItem,
  DomainItem,
  CriterionItem,
} from "@/services/development"
import { AdminMatrixDetail } from '../types'

interface DanhGiaModalManagerProps {
  activityModalOpen: boolean
  setActivityModalOpen: (v: boolean) => void
  editingActivity: ActivityItem | null
  activityForm: any
  setActivityForm: (v: any) => void
  linkModalOpen: boolean
  setLinkModalOpen: (v: boolean) => void
  linkingActivity: ActivityItem | null
  criteria: CriterionItem[]
  selectedCriterionIdToLink: string
  setSelectedCriterionIdToLink: (v: string) => void
  observationGuide: string
  setObservationGuide: (v: string) => void
  domainModalOpen: boolean
  setDomainModalOpen: (v: boolean) => void
  editingDomain: DomainItem | null
  domainForm: any
  setDomainForm: (v: any) => void
  domains: DomainItem[]
  criterionModalOpen: boolean
  setCriterionModalOpen: (v: boolean) => void
  editingCriterion: CriterionItem | null
  criterionForm: any
  setCriterionForm: (v: any) => void
  adminMatrixDetailModal: AdminMatrixDetail
  setAdminMatrixDetailModal: React.Dispatch<React.SetStateAction<AdminMatrixDetail>>
  confirmDelete: { open: boolean; type: string; id: string; title: string }
  setConfirmDelete: (v: any) => void
  onRefresh: () => Promise<void>
}

export default function DanhGiaModalManager({
  activityModalOpen,
  setActivityModalOpen,
  editingActivity,
  activityForm,
  setActivityForm,
  linkModalOpen,
  setLinkModalOpen,
  linkingActivity,
  criteria,
  selectedCriterionIdToLink,
  setSelectedCriterionIdToLink,
  observationGuide,
  setObservationGuide,
  domainModalOpen,
  setDomainModalOpen,
  editingDomain,
  domainForm,
  setDomainForm,
  domains,
  criterionModalOpen,
  setCriterionModalOpen,
  editingCriterion,
  criterionForm,
  setCriterionForm,
  adminMatrixDetailModal,
  setAdminMatrixDetailModal,
  confirmDelete,
  setConfirmDelete,
  onRefresh,
}: DanhGiaModalManagerProps) {
  const [submitting, setSubmitting] = React.useState(false)

  const handleSaveActivity = async () => {
    setSubmitting(true)
    try {
      if (editingActivity) await updateActivity(editingActivity.id, activityForm)
      else await createActivity(activityForm)
      setActivityModalOpen(false)
      await onRefresh()
    } finally {
      setSubmitting(false)
    }
  }

  const handleSaveLink = async () => {
    if (!linkingActivity || !selectedCriterionIdToLink) return
    setSubmitting(true)
    try {
      await linkActivityCriterion(linkingActivity.id, selectedCriterionIdToLink, observationGuide)
      setLinkModalOpen(false)
      await onRefresh()
    } finally {
      setSubmitting(false)
    }
  }

  const handleSaveDomain = async () => {
    if (editingDomain) await updateDomain(editingDomain.id, domainForm)
    else await createDomain(domainForm)
    setDomainModalOpen(false)
    await onRefresh()
  }

  const handleSaveCriterion = async () => {
    if (editingCriterion) await updateCriterion(editingCriterion.id, criterionForm)
    else await createCriterion(criterionForm)
    setCriterionModalOpen(false)
    await onRefresh()
  }

  const handleDeleteConfirmed = async () => {
    if (!confirmDelete.id) return
    setSubmitting(true)
    try {
      if (confirmDelete.type === 'activity') await deleteActivity(confirmDelete.id)
      else if (confirmDelete.type === 'domain') await deleteDomain(confirmDelete.id)
      else if (confirmDelete.type === 'criterion') await deleteCriterion(confirmDelete.id)
      else if (confirmDelete.type === 'assessment') await deleteAssessment(confirmDelete.id)
      setConfirmDelete({ open: false, type: 'activity', id: '', title: '' })
      await onRefresh()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <ActivityLinkModals
        activityModalOpen={activityModalOpen}
        onCloseActivityModal={() => setActivityModalOpen(false)}
        editingActivity={editingActivity}
        activityForm={activityForm}
        setActivityForm={setActivityForm}
        onSaveActivity={handleSaveActivity}
        isSubmitting={submitting}
        linkModalOpen={linkModalOpen}
        onCloseLinkModal={() => setLinkModalOpen(false)}
        linkingActivity={linkingActivity}
        criteria={criteria}
        selectedCriterionIdToLink={selectedCriterionIdToLink}
        setSelectedCriterionIdToLink={setSelectedCriterionIdToLink}
        observationGuide={observationGuide}
        setObservationGuide={setObservationGuide}
        onSaveLink={handleSaveLink}
      />

      <DanhGiaModals
        domainModalOpen={domainModalOpen}
        onCloseDomainModal={() => setDomainModalOpen(false)}
        editingDomain={editingDomain}
        domainForm={domainForm}
        setDomainForm={setDomainForm}
        onSaveDomain={handleSaveDomain}
        criterionModalOpen={criterionModalOpen}
        onCloseCriterionModal={() => setCriterionModalOpen(false)}
        editingCriterion={editingCriterion}
        criterionForm={criterionForm}
        setCriterionForm={setCriterionForm}
        domains={domains}
        onSaveCriterion={handleSaveCriterion}
        adminMatrixDetailModal={adminMatrixDetailModal}
        onCloseDetailModal={() => setAdminMatrixDetailModal((p) => ({ ...p, open: false }))}
        onSaveDetailModal={() => setAdminMatrixDetailModal((p) => ({ ...p, open: false }))}
      />

      <ConfirmModal
        isOpen={confirmDelete.open}
        onClose={() => setConfirmDelete((p: any) => ({ ...p, open: false }))}
        onConfirm={handleDeleteConfirmed}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa ${confirmDelete.title}?`}
        confirmText="Xóa vĩnh viễn"
        loading={submitting}
      />
    </>
  )
}
