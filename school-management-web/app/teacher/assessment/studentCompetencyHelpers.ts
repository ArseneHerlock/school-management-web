import { ActivityItem, CriterionItem } from '@/services/development';
import { GDMN_5_DOMAINS, resolveStandardDomain } from './gdmnDomains';

export interface StudentDomainProgress {
  domainId: string;
  domainCode: string;
  domainName: string;
  domainShortName: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  iconName: string;
  description: string;
  score: number;
  passCount: number;
  failCount: number;
  unassessedCount: number;
  totalCriteria: number;
  statusText: string;
  statusBadge: string;
  criteriaDetails: {
    id: string;
    code: string;
    name: string;
    activityName: string;
    result: boolean | null;
    comment: string;
    evidence: string;
  }[];
}

export interface StudentCompetencyProfile {
  student: any;
  studentName: string;
  overallScore: number;
  overallTier: {
    name: string;
    tag: string;
    color: string;
    badgeBg: string;
    badgeText: string;
    description: string;
  };
  totalAssessedCriteria: number;
  totalCriteria: number;
  totalPassedCriteria: number;
  totalFailedCriteria: number;
  strongestDomain: string;
  weakestDomain: string;
  radarData: { domain: string; score: number; fullMark: number }[];
  domainProgress: StudentDomainProgress[];
  strengths: { id: string; name: string; activityName: string; domainShortName: string; comment?: string }[];
  focusAreas: { id: string; name: string; activityName: string; domainShortName: string; comment?: string }[];
  activitiesParticipated: {
    id: string;
    name: string;
    code: string;
    domainShortName: string;
    domainColor: string;
    passedCriteria: number;
    totalCriteria: number;
    passRate: number;
    hasFail: boolean;
    remarks?: string;
  }[];
}

export function calculateStudentCompetencyProfile(
  student: any | null,
  activities: ActivityItem[],
  allCriteria: CriterionItem[],
  matrix: Record<string, Record<string, any>>,
  childActivityRemarks?: Record<string, any>
): StudentCompetencyProfile | null {
  if (!student) return null;
  const stId = student.id || student.Id;
  const studentName = student.tenHocSinh || student.TenHocSinh || 'Bé';

  const domainProgress: StudentDomainProgress[] = GDMN_5_DOMAINS.map((domain) => {
    const domainCriteria = allCriteria.filter((crit) => {
      const act = activities.find((a) => a.id === (crit as any).activityId || a.id === crit.developmentDomainId);
      const critDomain = resolveStandardDomain(act || crit);
      return critDomain.code === domain.code;
    });

    let passCount = 0;
    let failCount = 0;
    let unassessedCount = 0;

    const criteriaDetails = domainCriteria.map((c) => {
      const cell = matrix[stId]?.[c.id];
      const result = cell?.result !== undefined && cell?.result !== null ? Boolean(cell.result) : null;
      if (result === true) passCount++;
      else if (result === false) failCount++;
      else unassessedCount++;

      return {
        id: c.id,
        code: c.code,
        name: c.name,
        activityName: (c as any).activityName || '',
        result,
        comment: cell?.comment || '',
        evidence: cell?.evidence || '',
      };
    });

    const assessedCount = passCount + failCount;
    const score = assessedCount > 0 ? Math.round((passCount / assessedCount) * 100) : 0;

    let statusText = 'Chưa đánh giá';
    let statusBadge = 'bg-slate-100 text-slate-600 border-slate-200';
    if (assessedCount > 0) {
      if (score >= 80) {
        statusText = 'Đạt chuẩn vững vàng';
        statusBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      } else if (score >= 50) {
        statusText = 'Đang hoàn thiện';
        statusBadge = 'bg-amber-50 text-amber-800 border-amber-200';
      } else {
        statusText = 'Cần đồng hành rèn luyện';
        statusBadge = 'bg-rose-50 text-rose-700 border-rose-200';
      }
    }

    return {
      domainId: domain.id,
      domainCode: domain.code,
      domainName: domain.name,
      domainShortName: domain.shortName,
      color: domain.color,
      badgeBg: domain.badgeBg,
      badgeText: domain.badgeText,
      badgeBorder: domain.badgeBorder,
      iconName: domain.iconName,
      description: domain.description,
      score,
      passCount,
      failCount,
      unassessedCount,
      totalCriteria: domainCriteria.length,
      statusText,
      statusBadge,
      criteriaDetails,
    };
  });

  const radarData = domainProgress.map((d) => ({
    domain: d.domainShortName,
    score: d.score,
    fullMark: 100,
  }));

  let totalAssessed = 0;
  let totalPassed = 0;
  let totalFailed = 0;
  domainProgress.forEach((d) => {
    totalAssessed += d.passCount + d.failCount;
    totalPassed += d.passCount;
    totalFailed += d.failCount;
  });

  const overallScore = totalAssessed > 0 ? Math.round((totalPassed / totalAssessed) * 100) : 0;

  let overallTier = {
    name: 'Chưa có dữ liệu đánh giá',
    tag: 'Chưa đánh giá',
    color: '#64748b',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-600',
    description: 'Bé cần được quan sát thêm trong các hoạt động để có hồ sơ năng lực đầy đủ.',
  };

  if (totalAssessed > 0) {
    if (overallScore >= 85) {
      overallTier = {
        name: 'Cụm 1: Phát triển Toàn diện / Vượt trội',
        tag: 'Vượt trội',
        color: '#8b5cf6',
        badgeBg: 'bg-purple-100',
        badgeText: 'text-purple-700',
        description: 'Bé phát triển toàn diện trên cả 5 miền, tự tin, hòa đồng và nắm bắt kỹ năng rất nhanh.',
      };
    } else if (overallScore >= 70) {
      overallTier = {
        name: 'Cụm 2: Phát triển Đạt chuẩn / Vững vàng',
        tag: 'Đạt chuẩn',
        color: '#10b981',
        badgeBg: 'bg-emerald-100',
        badgeText: 'text-emerald-700',
        description: 'Bé phát triển đồng đều, nề nếp sinh hoạt và các kỹ năng vận động, nhận thức đạt chuẩn vững vàng.',
      };
    } else if (overallScore >= 50) {
      overallTier = {
        name: 'Cụm 3: Đang phát triển / Cần củng cố một số mặt',
        tag: 'Đang hoàn thiện',
        color: '#f59e0b',
        badgeBg: 'bg-amber-100',
        badgeText: 'text-amber-800',
        description: 'Bé tiếp thu tốt ở một số kỹ năng nhất định nhưng cần được rèn luyện thêm để phát triển đồng đều.',
      };
    } else {
      overallTier = {
        name: 'Cụm 4: Cần đồng hành hỗ trợ tích cực',
        tag: 'Cần hỗ trợ',
        color: '#ef4444',
        badgeBg: 'bg-rose-100',
        badgeText: 'text-rose-700',
        description: 'Bé cần thêm sự ân cần động viên, phối hợp chặt chẽ giữa cô giáo và gia đình để tiến bộ.',
      };
    }
  }

  const allDetails = domainProgress.flatMap((d) =>
    d.criteriaDetails.map((c) => ({ ...c, domainShortName: d.domainShortName }))
  );
  const strengths = allDetails
    .filter((c) => c.result === true)
    .slice(0, 6)
    .map((c) => ({ id: c.id, name: c.name, activityName: c.activityName, domainShortName: c.domainShortName, comment: c.comment }));

  const focusAreas = allDetails
    .filter((c) => c.result === false)
    .slice(0, 6)
    .map((c) => ({ id: c.id, name: c.name, activityName: c.activityName, domainShortName: c.domainShortName, comment: c.comment }));

  const sortedDomains = [...domainProgress].sort((a, b) => b.score - a.score);
  const strongestDomain = sortedDomains[0]?.domainShortName || 'Đang theo dõi';
  const weakestDomain = sortedDomains[sortedDomains.length - 1]?.domainShortName || 'Đang theo dõi';

  const activitiesParticipated = (activities || []).map((act) => {
    const actDomain = resolveStandardDomain(act);
    const actCritIds = allCriteria
      .filter((c) => c.developmentDomainId === act.id || (c as any).activityId === act.id)
      .map((c) => c.id);

    let pass = 0;
    let fail = 0;
    let comments: string[] = [];

    actCritIds.forEach((cId) => {
      const cell = matrix[stId]?.[cId];
      if (cell?.result === true || cell?.result === 'true' || cell?.result === 1) pass++;
      else if (cell?.result === false || cell?.result === 'false' || cell?.result === 0) fail++;
      if (cell?.comment) comments.push(cell.comment);
    });

    const evaluated = pass + fail;
    const passRate = evaluated > 0 ? Math.round((pass / evaluated) * 100) : 0;
    const globalRemark = childActivityRemarks?.[stId]?.comment || '';

    return {
      id: act.id,
      name: act.name,
      code: act.code,
      domainShortName: actDomain.shortName,
      domainColor: actDomain.color,
      passedCriteria: pass,
      totalCriteria: actCritIds.length,
      passRate,
      hasFail: fail > 0,
      remarks: comments[0] || globalRemark || '',
    };
  });

  return {
    student,
    studentName,
    overallScore,
    overallTier,
    totalAssessedCriteria: totalAssessed,
    totalCriteria: allCriteria.length,
    totalPassedCriteria: totalPassed,
    totalFailedCriteria: totalFailed,
    strongestDomain,
    weakestDomain,
    radarData,
    domainProgress,
    strengths,
    focusAreas,
    activitiesParticipated,
  };
}

export function calculateRadarData(
  student: any | null,
  activities: ActivityItem[],
  allCriteria: CriterionItem[],
  matrix: Record<string, Record<string, any>>
) {
  if (!student) return [];
  const profile = calculateStudentCompetencyProfile(student, activities, allCriteria, matrix);
  return profile?.radarData || [];
}
