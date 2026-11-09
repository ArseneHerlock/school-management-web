import { useEffect, useMemo, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { currentUser } from '@/services';
import { DomainItem, CriterionItem, AssessmentItem, ActivityItem } from '@/services/development';
import {
  findFocusedActivity,
  buildBatchItems,
  calculateProgressStats,
  calculateClassBreakdown,
  calculateRadarData,
  calculateStudentCompetencyProfile,
} from './assessmentBatchHelpers';
import { fetchAssessmentInitialData, buildMatrixAndRemarks } from './assessmentMatrixBuilder';
import { useAssessmentModals } from './useAssessmentModals';

export type TeacherViewTab = 'dashboard' | 'matrix';

export function useTeacherAssessment() {
  const searchParams = useSearchParams();
  const queryTab = searchParams.get('tab');

  const [focusedScheduleContext, setFocusedScheduleContext] = useState<{
    scheduleId?: string;
    activityId?: string;
    title?: string;
    classId?: string;
    date?: string;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<TeacherViewTab>(
    queryTab === 'matrix' ? 'matrix' : 'dashboard'
  );
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const [authorizedClasses, setAuthorizedClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [currentClassName, setCurrentClassName] = useState<string>('Lớp học');
  const [currentTeacherName, setCurrentTeacherName] = useState<string>('Giáo viên');
  const [classStudents, setClassStudents] = useState<any[]>([]);

  const [domains, setDomains] = useState<DomainItem[]>([]);
  const [selectedDomainId, setSelectedDomainId] = useState<string>('ALL');
  const [allCriteria, setAllCriteria] = useState<CriterionItem[]>([]);
  const [searchCriterion, setSearchCriterion] = useState<string>('');

  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [selectedActivityId, setSelectedActivityId] = useState<string>('');
  const [targetActivityTitle, setTargetActivityTitle] = useState<string>('');
  const [childActivityRemarks, setChildActivityRemarks] = useState<Record<string, any>>({});

  const [existingAssessments, setExistingAssessments] = useState<AssessmentItem[]>([]);
  const [matrix, setMatrix] = useState<Record<string, Record<string, any>>>({});
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());
  const [auditMode, setAuditMode] = useState(false);

  const modals = useAssessmentModals();

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('teacher_focused_activity');
      if (stored) {
        const parsed = JSON.parse(stored);
        setFocusedScheduleContext(parsed);
        setActiveTab('matrix');
        if (parsed.classId) setSelectedClassId(parsed.classId);
        if (parsed.title) setTargetActivityTitle(parsed.title);
      }
    } catch {}
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const {
        assignedClsId,
        assignedClsName,
        teacherName,
        focusedObj,
        activeCls,
        actItems,
        allCrits,
        batchItems,
        stuList,
      } = await fetchAssessmentInitialData(focusedScheduleContext, selectedClassId);

      setCurrentTeacherName(teacherName);
      setCurrentClassName(assignedClsName);
      setSelectedClassId(activeCls);

      if (assignedClsId) {
        setAuthorizedClasses([{
          id: assignedClsId,
          tenLop: assignedClsName,
          siSo: 30,
          teacherName,
        }]);
      }

      setActivities(actItems);
      setAllCriteria(allCrits);
      setExistingAssessments(batchItems);
      setClassStudents(stuList);
      setSelectedStudentIds(new Set(stuList.map((s: any) => s.id)));

      if (focusedObj) {
        setActiveTab('matrix');
        const matchResult = findFocusedActivity(actItems, focusedObj);
        if (matchResult?.found) {
          setSelectedActivityId(matchResult.found.id);
          setTargetActivityTitle(matchResult.rawTitle || matchResult.found.name);
        } else if (matchResult?.rawTitle) {
          setTargetActivityTitle(matchResult.rawTitle);
        }
      } else if (!selectedActivityId && actItems.length > 0) {
        setSelectedActivityId(actItems[0].id);
        setTargetActivityTitle(actItems[0].name);
      }
    } finally {
      setLoading(false);
    }
  }, [focusedScheduleContext, selectedClassId, selectedActivityId]);

  useEffect(() => {
    void loadData();
  }, []);

  const displayCriteria = useMemo(() => {
    let list: CriterionItem[] = [];
    if (!selectedActivityId) {
      list = allCriteria;
    } else {
      const act = (activities as any[]).find(
        (a) => a.id === selectedActivityId || a.code === selectedActivityId
      );
      list = (act?.criteria || []).map((c: any) => ({
        id: c.id,
        code: c.code,
        name: c.name,
        description: c.description || c.observationGuide,
        developmentDomainId: act?.id || '',
        activityId: act?.id || '',
        activityName: act?.name || '',
        isActive: true,
      }));
    }

    if (searchCriterion) {
      const q = searchCriterion.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
    }
    return list;
  }, [activities, selectedActivityId, searchCriterion, allCriteria]);

  useEffect(() => {
    if (classStudents.length === 0) return;
    const { newMatrix, newRemarks } = buildMatrixAndRemarks(
      classStudents,
      allCriteria,
      displayCriteria,
      existingAssessments
    );
    setMatrix(newMatrix);
    setChildActivityRemarks(newRemarks);
  }, [classStudents, displayCriteria, allCriteria, existingAssessments, selectedActivityId]);

  const dirtyCount = useMemo(() => {
    let c = 0;
    Object.values(matrix).forEach((row) =>
      Object.values(row).forEach((cell) => {
        if (cell.isDirty) c++;
      })
    );
    Object.values(childActivityRemarks).forEach((rem) => {
      if (rem?.isDirty) c++;
    });
    return c;
  }, [matrix, childActivityRemarks]);

  const handleCellClick = (sId: string, cId: string) => {
    setMatrix((prev) => {
      const row = { ...(prev[sId] || {}) };
      const cur = row[cId] || { result: null };
      const next = cur.result === null ? true : cur.result === true ? false : null;
      row[cId] = { ...cur, result: next, isDirty: true };
      return { ...prev, [sId]: row };
    });
  };

  const handleSaveBatch = async () => {
    setIsSaving(true);
    try {
      const batchItems = buildBatchItems(matrix, childActivityRemarks, displayCriteria, selectedActivityId);

      if (batchItems.length === 0) {
        modals.setConfirmModalOpen(false);
        setToast({ msg: 'Không có thay đổi nào cần lưu.', type: 'success' });
        setIsSaving(false);
        return;
      }

      const res = await fetch('/api/assessment/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: batchItems,
          activityId: selectedActivityId || undefined,
          assessedBy: currentUser()?.id,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Lưu đánh giá thất bại');
      }

      modals.setConfirmModalOpen(false);
      setToast({ msg: `Đã lưu thành công ${batchItems.length} chỉ số đánh giá hoạt động!`, type: 'success' });
      await loadData();
    } catch (err: any) {
      console.error('Lỗi khi lưu đánh giá:', err);
      setToast({ msg: err.message || 'Lỗi khi lưu kết quả đánh giá', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const progressStats = useMemo(() => {
    return calculateProgressStats(classStudents, allCriteria, matrix);
  }, [classStudents, allCriteria, matrix]);

  const classBreakdown = useMemo(() => {
    return calculateClassBreakdown(activities, allCriteria, classStudents, matrix);
  }, [activities, allCriteria, classStudents, matrix]);

  const radarData = useMemo(() => {
    return calculateRadarData(modals.childRadarModal.student, activities, allCriteria, matrix);
  }, [modals.childRadarModal.student, activities, allCriteria, matrix]);

  const competencyProfile = useMemo(() => {
    return calculateStudentCompetencyProfile(
      modals.childRadarModal.student,
      activities,
      allCriteria,
      matrix,
      childActivityRemarks
    );
  }, [modals.childRadarModal.student, activities, allCriteria, matrix, childActivityRemarks]);

  return {
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
    ...modals,
    loadData,
    displayCriteria,
    dirtyCount,
    handleCellClick,
    handleSaveBatch,
    progressStats,
    classBreakdown,
    radarData,
    competencyProfile,
  };
}
