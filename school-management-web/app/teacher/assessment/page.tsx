'use client';

import React, { Suspense } from 'react';
import TeacherAssessmentStats from './components/TeacherAssessmentStats';
import TeacherAssessmentMatrix from './components/TeacherAssessmentMatrix';
import TeacherAssessmentModals from './components/TeacherAssessmentModals';
import { TeacherAssessmentHeader } from './components/TeacherAssessmentHeader';
import { useTeacherAssessment } from './useTeacherAssessment';

function TeacherAssessmentContent() {
  const {
    focusedScheduleContext,
    setFocusedScheduleContext,
    activeTab,
    setActiveTab,
    loading,
    isSaving,
    toast,
    setToast,
    authorizedClasses,
    selectedClassId,
    setSelectedClassId,
    currentClassName,
    currentTeacherName,
    classStudents,
    domains,
    selectedDomainId,
    setSelectedDomainId,
    allCriteria,
    searchCriterion,
    setSearchCriterion,
    activities,
    selectedActivityId,
    setSelectedActivityId,
    targetActivityTitle,
    setTargetActivityTitle,
    childActivityRemarks,
    setChildActivityRemarks,
    matrix,
    setMatrix,
    selectedStudentIds,
    setSelectedStudentIds,
    auditMode,
    setAuditMode,
    confirmModalOpen,
    setConfirmModalOpen,
    cellDetailModal,
    setCellDetailModal,
    childRadarModal,
    setChildRadarModal,
    loadData,
    displayCriteria,
    dirtyCount,
    handleCellClick,
    handleSaveBatch,
    progressStats,
    classBreakdown,
    radarData,
  } = useTeacherAssessment();

  const handleClearFocusedContext = () => {
    try {
      sessionStorage.removeItem('teacher_focused_activity');
    } catch {}
    setFocusedScheduleContext(null);
    setSelectedActivityId('');
    setTargetActivityTitle('');
  };

  return (
    <div className="space-y-6 min-w-0 max-w-full overflow-x-hidden">
      <TeacherAssessmentHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        loading={loading}
        onRefresh={() => void loadData()}
        toast={toast}
        onCloseToast={() => setToast(null)}
        dirtyCount={dirtyCount}
        targetActivityTitle={targetActivityTitle}
        selectedActivityId={selectedActivityId}
        focusedScheduleContext={focusedScheduleContext}
        authorizedClasses={authorizedClasses}
        selectedClassId={selectedClassId}
        activities={activities}
        onClearFocusedContext={handleClearFocusedContext}
      />

      {activeTab === 'dashboard' && (
        <TeacherAssessmentStats
          selectedClassId={selectedClassId}
          authorizedClasses={authorizedClasses}
          currentClassName={currentClassName}
          currentTeacherName={currentTeacherName}
          onClassChange={setSelectedClassId}
          activitiesCount={activities.length}
          progressStats={progressStats}
          classBreakdown={classBreakdown}
          tierPieData={[
            { name: 'Tốt', value: progressStats.passCells, color: '#10b981' },
            {
              name: 'Cần rèn luyện',
              value: progressStats.completedCells - progressStats.passCells,
              color: '#f43f5e',
            },
          ]}
          classStudents={classStudents}
          getStudentProgress={(stId) => {
            let pass = 0;
            let comp = 0;
            const targetCriteria = allCriteria.length > 0 ? allCriteria : displayCriteria;
            targetCriteria.forEach((cr) => {
              const r = matrix[stId]?.[cr.id]?.result;
              if (r !== null && r !== undefined) {
                comp++;
                if (r === true || r === 'true' || r === 1) pass++;
              }
            });
            return {
              completed: comp,
              total: targetCriteria.length,
              pass,
              rate: comp > 0 ? Math.round((pass / comp) * 100) : 0,
            };
          }}
          onOpenRadar={(st) => setChildRadarModal({ open: true, student: st })}
          onGoToMatrix={() => setActiveTab('matrix')}
        />
      )}

      {activeTab === 'matrix' && (
        <div className="space-y-4">
          <TeacherAssessmentMatrix
            activities={activities}
            selectedActivityId={selectedActivityId}
            targetActivityTitle={targetActivityTitle}
            onSelectActivity={(actId) => {
              setSelectedActivityId(actId);
              if (actId) {
                const foundAct = activities.find((a) => a.id === actId);
                if (foundAct) setTargetActivityTitle(foundAct.name);
              } else {
                setTargetActivityTitle('');
              }
            }}
            searchCriterion={searchCriterion}
            onSearchCriterionChange={setSearchCriterion}
            auditMode={auditMode}
            onToggleAuditMode={() => setAuditMode(!auditMode)}
            dirtyCount={dirtyCount}
            isSaving={isSaving}
            onOpenConfirmSave={() => setConfirmModalOpen(true)}
            classStudents={classStudents}
            displayCriteria={displayCriteria}
            matrix={matrix}
            selectedStudentIds={selectedStudentIds}
            onToggleSelectAll={() =>
              setSelectedStudentIds(
                selectedStudentIds.size === classStudents.length
                  ? new Set()
                  : new Set(classStudents.map((s) => s.id))
              )
            }
            onToggleStudent={(id) =>
              setSelectedStudentIds((prev) => {
                const next = new Set(prev);
                next.has(id) ? next.delete(id) : next.add(id);
                return next;
              })
            }
            onCellClick={handleCellClick}
            onMarkRowPass={(stId) =>
              setMatrix((prev) => {
                const row = { ...(prev[stId] || {}) };
                displayCriteria.forEach((cr) => {
                  row[cr.id] = { ...(row[cr.id] || {}), result: true, isDirty: true };
                });
                return { ...prev, [stId]: row };
              })
            }
            onMarkColPass={(cId) =>
              setMatrix((prev) => {
                let allTrue = classStudents.length > 0;
                let allFalse = classStudents.length > 0;
                for (const st of classStudents) {
                  const res = prev[st.id]?.[cId]?.result;
                  if (res !== true) allTrue = false;
                  if (res !== false) allFalse = false;
                }

                let nextVal: boolean | null = true;
                if (allTrue) nextVal = false;
                else if (allFalse) nextVal = null;
                else nextVal = true;

                const next = { ...prev };
                classStudents.forEach((st) => {
                  const row = { ...(next[st.id] || {}) };
                  row[cId] = { ...(row[cId] || {}), result: nextVal, isDirty: true };
                  next[st.id] = row;
                });
                return next;
              })
            }
            onOpenCellDetail={(info) => setCellDetailModal({ ...info, open: true })}
            childActivityRemarks={childActivityRemarks}
            onChangeChildRemark={(stId, val) =>
              setChildActivityRemarks((prev) => ({
                ...prev,
                [stId]: { ...prev[stId], comment: val, isDirty: true },
              }))
            }
          />
        </div>
      )}

      <TeacherAssessmentModals
        cellDetailModal={cellDetailModal}
        onCloseCellDetail={() => setCellDetailModal((prev) => ({ ...prev, open: false }))}
        onSaveCellDetail={(comment, evidence) => {
          setMatrix((prev) => {
            const row = { ...(prev[cellDetailModal.studentId] || {}) };
            row[cellDetailModal.criterionId] = {
              ...row[cellDetailModal.criterionId],
              comment,
              evidence,
              isDirty: true,
            };
            return { ...prev, [cellDetailModal.studentId]: row };
          });
        }}
        childRadarModal={childRadarModal}
        onCloseRadar={() => setChildRadarModal({ open: false, student: null })}
        radarData={radarData}
        confirmModalOpen={confirmModalOpen}
        onCloseConfirmModal={() => setConfirmModalOpen(false)}
        onConfirmSave={() => void handleSaveBatch()}
        dirtyCount={dirtyCount}
        isSaving={isSaving}
      />
    </div>
  );
}

export default function TeacherAssessmentPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Đang chuẩn bị dữ liệu lớp học...</div>}>
      <TeacherAssessmentContent />
    </Suspense>
  );
}
