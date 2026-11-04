"use client";

import { useState } from "react";
import { ActivityItem, DomainItem, CriterionItem } from "@/services/development";
import { AdminMatrixDetail } from "./types";

export function useDanhGiaModals() {
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ActivityItem | null>(null);
  const [activityForm, setActivityForm] = useState({
    code: "",
    name: "",
    description: "",
    instructions: "",
    minAgeMonths: 36,
    maxAgeMonths: 72,
    isActive: true,
  });

  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkingActivity, setLinkingActivity] = useState<ActivityItem | null>(null);
  const [selectedCriterionIdToLink, setSelectedCriterionIdToLink] = useState("");
  const [observationGuide, setObservationGuide] = useState("");

  const [domainModalOpen, setDomainModalOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState<DomainItem | null>(null);
  const [domainForm, setDomainForm] = useState({
    code: "",
    name: "",
    description: "",
    isActive: true,
  });

  const [criterionModalOpen, setCriterionModalOpen] = useState(false);
  const [editingCriterion, setEditingCriterion] = useState<CriterionItem | null>(null);
  const [criterionForm, setCriterionForm] = useState({
    developmentDomainId: "",
    code: "",
    name: "",
    description: "",
    isActive: true,
  });

  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    type: string;
    id: string;
    title: string;
  }>({ open: false, type: "activity", id: "", title: "" });

  const [adminMatrixDetailModal, setAdminMatrixDetailModal] =
    useState<AdminMatrixDetail>({
      open: false,
      studentId: "",
      criterionId: "",
      studentName: "",
      criterionName: "",
      comment: "",
      evidence: "",
    });

  return {
    activityModalOpen,
    setActivityModalOpen,
    editingActivity,
    setEditingActivity,
    activityForm,
    setActivityForm,
    linkModalOpen,
    setLinkModalOpen,
    linkingActivity,
    setLinkingActivity,
    selectedCriterionIdToLink,
    setSelectedCriterionIdToLink,
    observationGuide,
    setObservationGuide,
    domainModalOpen,
    setDomainModalOpen,
    editingDomain,
    setEditingDomain,
    domainForm,
    setDomainForm,
    criterionModalOpen,
    setCriterionModalOpen,
    editingCriterion,
    setEditingCriterion,
    criterionForm,
    setCriterionForm,
    confirmDelete,
    setConfirmDelete,
    adminMatrixDetailModal,
    setAdminMatrixDetailModal,
  };
}
