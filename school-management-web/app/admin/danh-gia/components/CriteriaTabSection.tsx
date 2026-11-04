"use client";

import React from "react";
import CriteriaTab from "./CriteriaTab";
import { DomainItem, CriterionItem } from "@/services/development";

interface CriteriaTabSectionProps {
  domains: DomainItem[];
  criteria: CriterionItem[];
  modalState: any;
}

export default function CriteriaTabSection({
  domains,
  criteria,
  modalState,
}: CriteriaTabSectionProps) {
  return (
    <CriteriaTab
      domains={domains}
      criteria={criteria}
      onOpenCreateDomain={() => {
        modalState.setEditingDomain(null);
        modalState.setDomainForm({ code: "", name: "", description: "", isActive: true });
        modalState.setDomainModalOpen(true);
      }}
      onOpenEditDomain={(d) => {
        modalState.setEditingDomain(d);
        modalState.setDomainForm({
          code: d.code,
          name: d.name,
          description: d.description || "",
          isActive: d.isActive,
        });
        modalState.setDomainModalOpen(true);
      }}
      onDeleteDomain={(d) =>
        modalState.setConfirmDelete({
          open: true,
          type: "domain",
          id: d.id,
          title: `lĩnh vực "${d.name}"`,
        })
      }
      onOpenCreateCriterion={() => {
        modalState.setEditingCriterion(null);
        modalState.setCriterionForm({
          developmentDomainId: domains[0]?.id || "",
          code: "",
          name: "",
          description: "",
          isActive: true,
        });
        modalState.setCriterionModalOpen(true);
      }}
      onOpenEditCriterion={(c) => {
        modalState.setEditingCriterion(c);
        modalState.setCriterionForm({
          developmentDomainId: c.developmentDomainId,
          code: c.code,
          name: c.name,
          description: c.description || "",
          isActive: c.isActive,
        });
        modalState.setCriterionModalOpen(true);
      }}
      onDeleteCriterion={(c) =>
        modalState.setConfirmDelete({
          open: true,
          type: "criterion",
          id: c.id,
          title: `tiêu chí "${c.name}"`,
        })
      }
    />
  );
}
