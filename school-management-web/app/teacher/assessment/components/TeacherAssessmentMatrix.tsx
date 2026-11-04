'use client';

import React, { useState } from 'react';
import { ActivityItem, DomainItem, CriterionItem } from '@/services/development';
import { MatrixToolbar } from './matrix/MatrixToolbar';
import { MatrixTable } from './matrix/MatrixTable';
import { CriterionGuideModal } from './matrix/CriterionGuideModal';

export interface TeacherAssessmentMatrixProps {
  activities: ActivityItem[];
  selectedActivityId: string;
  targetActivityTitle?: string;
  onSelectActivity: (id: string) => void;
  searchCriterion: string;
  onSearchCriterionChange: (q: string) => void;
  auditMode: boolean;
  onToggleAuditMode: () => void;
  dirtyCount: number;
  isSaving: boolean;
  onOpenConfirmSave: () => void;
  classStudents: any[];
  displayCriteria: CriterionItem[];
  matrix: Record<string, Record<string, any>>;
  selectedStudentIds: Set<string>;
  onToggleSelectAll: () => void;
  onToggleStudent: (id: string) => void;
  onCellClick: (studentId: string, criterionId: string) => void;
  onMarkRowPass: (studentId: string) => void;
  onMarkColPass: (criterionId: string) => void;
  onOpenCellDetail: (info: any) => void;
  childActivityRemarks: Record<string, any>;
  onChangeChildRemark: (studentId: string, val: string) => void;
}

export default function TeacherAssessmentMatrix(props: TeacherAssessmentMatrixProps) {
  const [guideCriterion, setGuideCriterion] = useState<CriterionItem | null>(null);

  return (
    <div className="space-y-4">
      <MatrixToolbar
        activities={props.activities}
        selectedActivityId={props.selectedActivityId}
        targetActivityTitle={props.targetActivityTitle}
        onSelectActivity={props.onSelectActivity}
        searchCriterion={props.searchCriterion}
        onSearchCriterionChange={props.onSearchCriterionChange}
        auditMode={props.auditMode}
        onToggleAuditMode={props.onToggleAuditMode}
        dirtyCount={props.dirtyCount}
        isSaving={props.isSaving}
        onOpenConfirmSave={props.onOpenConfirmSave}
      />

      <MatrixTable
        classStudents={props.classStudents}
        displayCriteria={props.displayCriteria}
        matrix={props.matrix}
        selectedStudentIds={props.selectedStudentIds}
        auditMode={props.auditMode}
        onToggleSelectAll={props.onToggleSelectAll}
        onToggleStudent={props.onToggleStudent}
        onCellClick={props.onCellClick}
        onMarkRowPass={props.onMarkRowPass}
        onMarkColPass={props.onMarkColPass}
        onOpenCellDetail={props.onOpenCellDetail}
        childActivityRemarks={props.childActivityRemarks}
        onChangeChildRemark={props.onChangeChildRemark}
        onOpenCriterionGuide={(crit) => setGuideCriterion(crit)}
      />

      <CriterionGuideModal
        criterion={guideCriterion}
        onClose={() => setGuideCriterion(null)}
      />
    </div>
  );
}
