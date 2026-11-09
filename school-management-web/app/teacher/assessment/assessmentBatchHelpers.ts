import { currentUser } from '@/services';
import { ActivityItem, CriterionItem } from '@/services/development';
import { StandardDomain, GDMN_5_DOMAINS, resolveStandardDomain } from './gdmnDomains';
export * from './gdmnDomains';
export * from './studentCompetencyHelpers';

export function findFocusedActivity(actItems: ActivityItem[], focusedObj: any) {
  if (!focusedObj) return null;
  const rawTitle = (focusedObj.title || '').trim();
  const cleanTitle = rawTitle.replace(/\s*-\s*lớp\s+.*$/i, '').trim().toLowerCase();

  let found = actItems.find((a) => {
    if (focusedObj?.activityId && (a.id === focusedObj.activityId || a.code === focusedObj.activityId)) {
      return true;
    }
    if (cleanTitle) {
      const name = a.name.trim().toLowerCase();
      return cleanTitle === name || cleanTitle.includes(name) || name.includes(cleanTitle);
    }
    return false;
  });

  if (!found && cleanTitle && actItems.length > 0) {
    const keywords = [
      'âm nhạc', 'hát', 'múa', 'vận động', 'thể chất', 'thể thao',
      'tạo hình', 'vẽ', 'mỹ thuật', 'khám phá', 'ngoài trời', 'dã ngoại',
      'toán', 'chữ cái', 'văn học', 'kể chuyện', 'kỹ năng',
    ];
    const matchedKw = keywords.find((kw) => cleanTitle.includes(kw));
    if (matchedKw) {
      found = actItems.find((a) => {
        const hay = `${a.name} ${a.description || ''}`.toLowerCase();
        return hay.includes(matchedKw);
      });
    }
  }

  return { found, rawTitle };
}

export function buildBatchItems(
  matrix: Record<string, Record<string, any>>,
  childActivityRemarks: Record<string, any>,
  displayCriteria: CriterionItem[],
  selectedActivityId: string
) {
  const displayCritIds = new Set(displayCriteria.map((c) => c.id));
  const batchItems: any[] = [];
  const currentUserId = currentUser()?.id;

  for (const [stId, row] of Object.entries(matrix)) {
    const studentRemarkObj = childActivityRemarks[stId];
    const remarkText = studentRemarkObj?.comment?.trim() ?? '';
    const remarkChanged = Boolean(studentRemarkObj?.isDirty);
    let remarkSavedForStudent = false;

    for (const [crId, cell] of Object.entries(row)) {
      const isDisplayedCrit = displayCritIds.has(crId);
      const shouldAttachRemark = isDisplayedCrit && (cell.isDirty || remarkChanged);
      const finalComment = shouldAttachRemark
        ? remarkText || cell.comment || ''
        : cell.comment || '';

      if (!cell.isDirty && !(remarkChanged && isDisplayedCrit && cell.result !== null)) {
        continue;
      }

      batchItems.push({
        childId: stId,
        developmentCriterionId: crId,
        result: cell.result,
        comment: finalComment,
        evidence: cell.evidence,
        existingId: cell.existingId,
        activityId: selectedActivityId || undefined,
        assessedBy: currentUserId,
      });

      if (isDisplayedCrit && cell.result !== null) {
        remarkSavedForStudent = true;
      }
    }

    if (remarkChanged && remarkText && !remarkSavedForStudent && displayCriteria.length > 0) {
      const firstCritId = displayCriteria[0].id;
      const firstCell = row[firstCritId];
      batchItems.push({
        childId: stId,
        developmentCriterionId: firstCritId,
        result: firstCell?.result ?? true,
        comment: remarkText,
        evidence: firstCell?.evidence,
        existingId: firstCell?.existingId,
        activityId: selectedActivityId || undefined,
        assessedBy: currentUserId,
      });
    }
  }

  return batchItems;
}

export function calculateProgressStats(
  classStudents: any[],
  allCriteria: CriterionItem[],
  matrix: Record<string, Record<string, any>>
) {
  const totalStudents = classStudents.length;
  let completedCells = 0, passCells = 0;
  classStudents.forEach((st) => {
    const sId = st.id || st.Id;
    allCriteria.forEach((cr) => {
      const c = matrix[sId]?.[cr.id];
      if (c?.result !== null && c?.result !== undefined) {
        completedCells++;
        if (c.result === true || c.result === 'true' || c.result === 1) passCells++;
      }
    });
  });
  return {
    totalStudents,
    completedCells,
    passCells,
    passRate: completedCells > 0 ? Math.round((passCells / completedCells) * 100) : 0,
    fullyCompletedStudentsCount: classStudents.filter((st) => {
      const sId = st.id || st.Id;
      return allCriteria.every((cr) => {
        const r = matrix[sId]?.[cr.id]?.result;
        return r === true || r === 'true' || r === 1;
      });
    }).length,
  };
}

export function calculateClassBreakdown(
  activities: ActivityItem[],
  allCriteria: CriterionItem[],
  classStudents: any[],
  matrix: Record<string, Record<string, any>>
) {
  if (!activities || activities.length === 0) return [];
  return activities.map((act) => {
    const actCritIds = allCriteria
      .filter((c) => c.developmentDomainId === act.id || (c as any).activityId === act.id)
      .map((c) => c.id);
    let passSlots = 0, failSlots = 0, unassessedSlots = 0;
    const failStudentSet = new Set<string>();

    classStudents.forEach((st) => {
      const sId = st.id || st.Id;
      let hasFail = false;
      actCritIds.forEach((cId) => {
        const res = matrix[sId]?.[cId]?.result;
        if (res === true || res === 'true' || res === 1) passSlots++;
        else if (res === false || res === 'false' || res === 0) {
          failSlots++;
          hasFail = true;
        } else {
          unassessedSlots++;
        }
      });
      if (hasFail) failStudentSet.add(sId);
    });

    const totalSlots = passSlots + failSlots + unassessedSlots;
    const passRate = totalSlots > 0 ? Math.round((passSlots / totalSlots) * 100) : 0;
    const failRate = totalSlots > 0 ? Math.round((failSlots / totalSlots) * 100) : 0;
    const unassessedRate = totalSlots > 0 ? Math.max(0, 100 - passRate - failRate) : 0;

    const domain = resolveStandardDomain(act);
    const shortName = act.name.length > 20 ? act.name.slice(0, 18) + '...' : act.name;

    return {
      id: act.id,
      code: act.code,
      shortName,
      fullName: act.name,
      domain,
      domainShortName: domain.shortName,
      domainColor: domain.color,
      domainBadgeBg: domain.badgeBg,
      domainBadgeText: domain.badgeText,
      domainBadgeBorder: domain.badgeBorder,
      criteriaCount: actCritIds.length,
      studentCount: classStudents.length,
      failStudentsCount: failStudentSet.size,
      passSlots,
      failSlots,
      unassessedSlots,
      totalSlots,
      passRate,
      failRate,
      unassessedRate,
    };
  });
}
