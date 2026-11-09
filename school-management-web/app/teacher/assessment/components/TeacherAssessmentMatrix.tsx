'use client';

import React, { useState, useEffect } from 'react';
import { ActivityItem, DomainItem, CriterionItem } from '@/services/development';
import { MatrixToolbar } from './matrix/MatrixToolbar';
import { MatrixTable } from './matrix/MatrixTable';
import { StudentAssessmentCardsView } from './StudentAssessmentCardsView';
import { CriterionGuideModal } from './matrix/CriterionGuideModal';
import { Save, Check } from 'lucide-react';

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
  const [viewMode, setViewMode] = useState<'cards' | 'grid'>('cards');

  // Tự động chọn chế độ tối ưu theo kích thước màn hình khi tải trang
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 768) {
        setViewMode('grid');
      } else {
        setViewMode('cards');
      }
    }
  }, []);

  return (
    <div className="space-y-4 relative pb-16 sm:pb-0">
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
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {viewMode === 'cards' ? (
        <StudentAssessmentCardsView
          classStudents={props.classStudents}
          displayCriteria={props.displayCriteria}
          matrix={props.matrix}
          onCellClick={props.onCellClick}
          onMarkRowPass={props.onMarkRowPass}
          onOpenCriterionGuide={(crit) => setGuideCriterion(crit)}
          onOpenCellDetail={props.onOpenCellDetail}
          childActivityRemarks={props.childActivityRemarks}
          onChangeChildRemark={props.onChangeChildRemark}
          auditMode={props.auditMode}
        />
      ) : (
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
      )}

      {/* Floating Sticky Save Bar on Mobile */}
      {props.dirtyCount > 0 && (
        <div className="fixed bottom-16 sm:bottom-6 inset-x-3 sm:inset-x-auto sm:right-6 sm:w-auto z-40 bg-slate-900/95 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200 border border-slate-700/60">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-bold">
              {props.dirtyCount} thay đổi chưa lưu
            </span>
          </div>
          <button
            type="button"
            onClick={props.onOpenConfirmSave}
            disabled={props.isSaving}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-extrabold text-xs transition cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Save size={13} />
            <span>{props.isSaving ? 'Đang lưu...' : 'Lưu ngay'}</span>
          </button>
        </div>
      )}

      <CriterionGuideModal
        criterion={guideCriterion}
        onClose={() => setGuideCriterion(null)}
      />
    </div>
  );
}
