import { loadLiveTeacherContext } from '../data';
import { getStudents } from '@/services';
import { CriterionItem, AssessmentItem } from '@/services/development';

export async function fetchAssessmentInitialData(
  focusedScheduleContext: any,
  selectedClassId: string
) {
  const teacherCtx = await loadLiveTeacherContext().catch(() => null);
  const assignedCls = teacherCtx?.cls;
  const assignedClsId = (assignedCls as any)?.id || (assignedCls as any)?.Id || '';
  const assignedClsName = assignedCls?.tenLop || (assignedCls as any)?.TenLop || 'Lớp Mầm 1';
  const teacherName =
    (teacherCtx?.me as any)?.name ||
    (teacherCtx?.me as any)?.fullName ||
    (teacherCtx?.me as any)?.hoTen ||
    'Giáo viên';

  let focusedObj = focusedScheduleContext;
  if (!focusedObj && typeof window !== 'undefined') {
    try {
      const raw = sessionStorage.getItem('teacher_focused_activity');
      if (raw) focusedObj = JSON.parse(raw);
    } catch {}
  }

  const activeCls = assignedClsId || focusedObj?.classId || selectedClassId || '';

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

  const batchItems = Array.isArray(assRes?.items) ? assRes.items : [];
  const rawStuList = Array.isArray(stuRes) ? stuRes : [];
  const stuList = rawStuList.map((s: any) => ({
    ...s,
    id: s.id || s.Id,
    tenHocSinh: s.tenHocSinh || s.TenHocSinh,
    lopId: s.lopId || s.LopId,
  }));

  return {
    assignedClsId,
    assignedClsName,
    teacherName,
    focusedObj,
    activeCls,
    actItems,
    allCrits,
    batchItems,
    stuList,
  };
}

export function buildMatrixAndRemarks(
  classStudents: any[],
  allCriteria: CriterionItem[],
  displayCriteria: CriterionItem[],
  existingAssessments: AssessmentItem[]
) {
  const newMatrix: Record<string, Record<string, any>> = {};
  const newRemarks: Record<string, any> = {};
  const critsToPopulate = allCriteria.length > 0 ? allCriteria : displayCriteria;
  const displayIds = new Set(displayCriteria.map((c) => c.id));

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

  return { newMatrix, newRemarks };
}
