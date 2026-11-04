import { useEffect, useMemo, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { currentUser, getClasses, getStudents } from '@/services';
import { loadLiveTeacherContext } from '../data';
import {
  getActivities,
  getDomains,
  getCriteria,
  getAssessments,
  ActivityItem,
  DomainItem,
  CriterionItem,
  AssessmentItem,
} from '@/services/development';
import {
  findFocusedActivity,
  buildBatchItems,
  calculateProgressStats,
  calculateClassBreakdown,
  calculateRadarData,
} from './assessmentBatchHelpers';

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

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [cellDetailModal, setCellDetailModal] = useState({
    open: false,
    studentId: '',
    criterionId: '',
    studentName: '',
    criterionName: '',
    comment: '',
    evidence: '',
  });
  const [childRadarModal, setChildRadarModal] = useState<{ open: boolean; student: any | null }>({
    open: false,
    student: null,
  });

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
      // 1. Tải thông tin lớp học được phân công của giáo viên hiện tại
      const teacherCtx = await loadLiveTeacherContext().catch(() => null);
      const assignedCls = teacherCtx?.cls;
      const assignedClsId = (assignedCls as any)?.id || (assignedCls as any)?.Id || '';
      const assignedClsName = assignedCls?.tenLop || (assignedCls as any)?.TenLop || 'Lớp Mầm 1';
      const teacherName = (teacherCtx?.me as any)?.name || (teacherCtx?.me as any)?.fullName || (teacherCtx?.me as any)?.hoTen || 'Giáo viên';

      setCurrentTeacherName(teacherName);
      setCurrentClassName(assignedClsName);

      let focusedObj = focusedScheduleContext;
      if (!focusedObj) {
        try {
          const raw = sessionStorage.getItem('teacher_focused_activity');
          if (raw) focusedObj = JSON.parse(raw);
        } catch {}
      }

      const activeCls = assignedClsId || focusedObj?.classId || selectedClassId || '';
      setSelectedClassId(activeCls);

      if (assignedClsId) {
        setAuthorizedClasses([{
          id: assignedClsId,
          tenLop: assignedClsName,
          siSo: 30,
          teacherName,
        }]);
      }

      // 2. Tải song song: Hoạt động kèm tiêu chí riêng, danh sách học sinh và đánh giá theo lớp
      const batchUrl = activeCls ? `/api/assessment/batch?classId=${activeCls}` : '/api/assessment/batch';
      const [actRes, assRes, stuRes] = await Promise.all([
        fetch('/api/activities-with-criteria')
          .then((r) => (r.ok ? r.json() : []))
          .catch(() => []),
        fetch(batchUrl)
          .then((r) => (r.ok ? r.json() : { items: [] }))
          .catch(() => ({ items: [] })),
        activeCls ? getStudents({ lopId: activeCls }).catch(() => []) : Promise.resolve([]),
      ]);

      const actItems: any[] = Array.isArray(actRes) ? actRes : [];
      setActivities(actItems);

      const allCrits: CriterionItem[] = actItems.flatMap((a: any) =>
        (a.criteria || []).map((c: any) => ({
          id: c.id,
          code: c.code,
          name: c.name,
          description: c.description || c.observationGuide,
          developmentDomainId: a.id,
          activityId: a.id,
          activityName: a.name,
          isActive: true,
        }))
      );
      setAllCriteria(allCrits);

      const batchItems = Array.isArray(assRes?.items) ? assRes.items : [];
      setExistingAssessments(batchItems);

      const rawStuList = Array.isArray(stuRes) ? stuRes : [];
      const stuList = rawStuList.map((s: any) => ({
        ...s,
        id: s.id || s.Id,
        tenHocSinh: s.tenHocSinh || s.TenHocSinh,
        lopId: s.lopId || s.LopId,
      }));
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
        // Tự động chọn hoạt động đầu tiên để giáo viên đánh giá
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
    const newMatrix: Record<string, Record<string, any>> = {};
    const newRemarks: Record<string, any> = {};
    const critsToPopulate = allCriteria.length > 0 ? allCriteria : displayCriteria;
    const displayIds = new Set(displayCriteria.map((c) => c.id));

    // Fast lookup map for existing assessments
    const assessmentLookup = new Map<string, any>();
    existingAssessments.forEach((a: any) => {
      const cId = a.childId || a.ChildId;
      const crId = a.developmentCriterionId || a.DevelopmentCriterionId;
      if (cId && crId) {
        assessmentLookup.set(`${cId}_${crId}`, a);
      }
    });

    classStudents.forEach((st) => {
      const sId = st.id || st.Id;
      newMatrix[sId] = {};
      let latestRemark = '';
      critsToPopulate.forEach((crit) => {
        const found = assessmentLookup.get(`${sId}_${crit.id}`);

        newMatrix[sId][crit.id] = found
          ? {
              result: found.result ?? found.Result ?? null,
              existingId: found.id || found.Id,
              comment: found.comment || found.Comment || '',
              evidence: found.evidence || found.Evidence || '',
              isDirty: false,
            }
          : { result: null, isDirty: false };

        if ((found?.comment || found?.Comment) && displayIds.has(crit.id) && !latestRemark) {
          latestRemark = found.comment || found.Comment;
        }
      });

      newRemarks[sId] = { comment: latestRemark, isDirty: false };
    });

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
        setConfirmModalOpen(false);
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

      setConfirmModalOpen(false);
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
    return calculateRadarData(childRadarModal.student, activities, allCriteria, matrix);
  }, [childRadarModal.student, activities, allCriteria, matrix]);

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
  };
}
