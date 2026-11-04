"use client";

import React from "react";
import ActivitiesTab from "./ActivitiesTab";
import { ActivityItem, CriterionItem, setActivityActive, unlinkActivityCriterion } from "@/services/development";

interface ActivitiesTabSectionProps {
  activities: ActivityItem[];
  criteria: CriterionItem[];
  loadAllData: () => Promise<void>;
  modalState: any;
}

export default function ActivitiesTabSection({
  activities,
  criteria,
  loadAllData,
  modalState,
}: ActivitiesTabSectionProps) {
  return (
    <ActivitiesTab
      activities={activities}
      getCriterionName={(id) => criteria.find((c) => c.id === id)?.name || id}
      onToggleStatus={async (act) => {
        await setActivityActive(act.id, !act.isActive);
        await loadAllData();
      }}
      onOpenEdit={(act) => {
        modalState.setEditingActivity(act);
        modalState.setActivityForm({
          code: act.code,
          name: act.name,
          description: act.description || "",
          instructions: act.instructions || "",
          minAgeMonths: act.minAgeMonths ?? 36,
          maxAgeMonths: act.maxAgeMonths ?? 72,
          isActive: act.isActive,
        });
        modalState.setActivityModalOpen(true);
      }}
      onOpenLinkModal={(act) => {
        modalState.setLinkingActivity(act);
        modalState.setSelectedCriterionIdToLink("");
        modalState.setObservationGuide("");
        modalState.setLinkModalOpen(true);
      }}
      onUnlinkCriterion={async (aId, cId) => {
        await unlinkActivityCriterion(aId, cId);
        await loadAllData();
      }}
      onDeleteClick={(act) =>
        modalState.setConfirmDelete({
          open: true,
          type: "activity",
          id: act.id,
          title: `hoạt động "${act.name}"`,
        })
      }
    />
  );
}
