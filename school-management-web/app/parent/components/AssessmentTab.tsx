'use client'

import { useEffect, useMemo, useState } from 'react'
import { Sparkles, BarChart3, ListTodo, Activity, Loader2, TrendingUp } from 'lucide-react'
import {
  getChildAssessmentHistory,
  getAssessments,
  getCriteria,
  getDomains,
  getActivities,
  CriterionItem,
  DomainItem,
  ActivityItem,
  AssessmentItem,
} from "@/services/development"
import { ChildInfo } from '../types'
import TabsNav, { TabItem } from '@/app/components/ui/TabsNav'
import AssessmentDashboard from './assessment/AssessmentDashboard'
import AssessmentCriteriaList from './assessment/AssessmentCriteriaList'
import AssessmentActivitiesHistory from './assessment/AssessmentActivitiesHistory'
import ChildFCMGrowthTimeline from './assessment/ChildFCMGrowthTimeline'
import ChildDevelopmentClusterHeroCard, { FCMHistoryItem } from './assessment/ChildDevelopmentClusterHeroCard'

type AssessmentSubTab = 'dashboard' | 'growth_timeline' | 'criteria_list' | 'activities'

const DOMAIN_FALLBACKS: DomainItem[] = [
  { id: 'd62c00ba-1aa1-3e6b-4795-b37a42099c76', name: 'Phát triển thể chất', code: 'GDMN-PHYSICAL', isActive: true },
  { id: 'f12a3fb0-6832-38cf-470d-3b97b70b238f', name: 'Phát triển nhận thức', code: 'GDMN-COGNITION', isActive: true },
  { id: 'c7e896f7-1630-6b39-a0bb-21554638bc85', name: 'Phát triển ngôn ngữ', code: 'GDMN-LANGUAGE', isActive: true },
  { id: '8b2f117b-2183-d6f3-0937-e7cd680bfa2b', name: 'Phát triển tình cảm và kỹ năng xã hội', code: 'GDMN-SOCIAL-EMOTIONAL', isActive: true },
  { id: '65056cb0-8c7a-3fb6-e64b-d62a855ad2dc', name: 'Phát triển thẩm mỹ', code: 'GDMN-AESTHETIC', isActive: true },
];

function resolveDomainForActivity(act: any, liveDomains: DomainItem[]): DomainItem {
  const code = (act?.code || '').toUpperCase();
  let matchedCode = 'GDMN-PHYSICAL';
  if (code.includes('PTTCXH')) matchedCode = 'GDMN-SOCIAL-EMOTIONAL';
  else if (code.includes('PTTC')) matchedCode = 'GDMN-PHYSICAL';
  else if (code.includes('PTNT')) matchedCode = 'GDMN-COGNITION';
  else if (code.includes('PTNN')) matchedCode = 'GDMN-LANGUAGE';
  else if (code.includes('PTTM')) matchedCode = 'GDMN-AESTHETIC';

  const fallback = DOMAIN_FALLBACKS.find((f) => f.code === matchedCode)!;
  const live = liveDomains.find(
    (d) =>
      d.id === fallback.id ||
      d.code === fallback.code ||
      d.name.toLowerCase().includes(fallback.name.toLowerCase().replace('phát triển ', ''))
  );
  return live || fallback;
}

export default function AssessmentTab({ child }: { child: ChildInfo }) {
  const [loading, setLoading] = useState(true)
  const [assessments, setAssessments] = useState<AssessmentItem[]>([])
  const [criteria, setCriteria] = useState<CriterionItem[]>([])
  const [domains, setDomains] = useState<DomainItem[]>([])
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [fcmHistory, setFcmHistory] = useState<FCMHistoryItem[]>([])
  const [latestFCM, setLatestFCM] = useState<FCMHistoryItem | null>(null)

  const [subTab, setSubTab] = useState<AssessmentSubTab>('dashboard')
  const [selectedDomainId, setSelectedDomainId] = useState<string>('ALL')

  const loadData = async () => {
    if (!child.id) return
    setLoading(true)
    try {
      const [historyRes, criteriaRes, domainsRes, activitiesRes, fcmRes, actCritRes] =
        await Promise.allSettled([
          getChildAssessmentHistory(child.id),
          getCriteria({ page: 1, pageSize: 500 }),
          getDomains({ page: 1, pageSize: 100 }),
          getActivities({ page: 1, pageSize: 200, includeInactive: false }),
          fetch(`/api/fcm?childId=${child.id}`).then((r) => (r.ok ? r.json() : null)),
          fetch('/api/activities-with-criteria').then((r) => (r.ok ? r.json() : [])),
        ])

      let childAssessments = historyRes.status === 'fulfilled' ? historyRes.value : []
      if (childAssessments.length === 0) {
        try {
          const assRes = await getAssessments({ childId: child.id, page: 1, pageSize: 500 })
          childAssessments = assRes.items
        } catch {}
      }
      setAssessments(childAssessments)

      const liveDomains =
        domainsRes.status === 'fulfilled' && domainsRes.value.items.length > 0
          ? domainsRes.value.items
          : DOMAIN_FALLBACKS;
      setDomains(liveDomains);

      const actWithCrit: any[] =
        actCritRes.status === 'fulfilled' && Array.isArray(actCritRes.value)
          ? actCritRes.value
          : [];

      let allCriteriaItems: CriterionItem[] = [];
      if (actWithCrit.length > 0) {
        allCriteriaItems = actWithCrit.flatMap((act: any) => {
          const matchedDomain = resolveDomainForActivity(act, liveDomains);
          return (act.criteria || []).map((c: any) => ({
            id: c.id,
            code: c.code,
            name: c.name,
            description: c.description || c.observationGuide,
            developmentDomainId: matchedDomain.id,
            domainName: matchedDomain.name,
            activityId: act.id,
            activityName: act.name,
            isActive: true,
          }));
        });
        setActivities(actWithCrit);
      } else {
        if (criteriaRes.status === 'fulfilled') allCriteriaItems = criteriaRes.value.items;
        if (activitiesRes.status === 'fulfilled') setActivities(activitiesRes.value.items);
      }
      setCriteria(allCriteriaItems);

      if (fcmRes.status === 'fulfilled' && fcmRes.value) {
        const h = fcmRes.value.history || []
        setFcmHistory(h)
        setLatestFCM(fcmRes.value.latest || (h.length > 0 ? h[h.length - 1] : null))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void loadData() }, [child.id])

  const { generalStats, domainBreakdown, radarChartData, barChartData } = useMemo(() => {
    const assessmentsByCriterion = new Map<string, AssessmentItem[]>()
    assessments.forEach((a) => {
      const list = assessmentsByCriterion.get(a.developmentCriterionId) || []
      list.push(a)
      assessmentsByCriterion.set(a.developmentCriterionId, list)
    })

    let totalMastered = 0, totalNeedWork = 0, totalAssessed = 0

    const breakdown = domains.map((domain) => {
      const dCriteria = criteria.filter(
        (c) => c.developmentDomainId === domain.id || (c as any).domainName === domain.name
      )
      let sumScores = 0, assessedCrit = 0, passInDomain = 0, failInDomain = 0

      const criteriaDetails = dCriteria.map((crit) => {
        const evals = assessmentsByCriterion.get(crit.id) || []
        const count = evals.length
        if (count > 0) {
          assessedCrit++
          const passes = evals.filter((e) => e.result === true).length
          const score = Math.round((passes / count) * 100)
          sumScores += score
          if (score >= 50) passInDomain++
          else failInDomain++
          return { criterion: crit, count, passes, score, evals }
        }
        return { criterion: crit, count: 0, passes: 0, score: 0, evals: [] }
      })

      const domainScore = dCriteria.length > 0 ? Math.round(sumScores / dCriteria.length) : 0
      totalMastered += passInDomain
      totalNeedWork += failInDomain
      totalAssessed += assessedCrit

      return {
        id: domain.id,
        name: domain.name,
        description: domain.description,
        totalCrit: dCriteria.length,
        domainScore,
        passInDomain,
        failInDomain,
        criteriaDetails,
      }
    })

    const overallRate = domains.length > 0
      ? Math.round(breakdown.reduce((acc, d) => acc + d.domainScore, 0) / domains.length)
      : 0

    const radarData = breakdown.map((b) => ({
      domain: b.name.replace('Phát triển ', ''),
      'Điểm phát triển (%)': b.domainScore,
    }))

    const barData = breakdown.map((b) => ({
      name: b.name.replace('Phát triển ', ''),
      'Đạt chuẩn': b.passInDomain,
      'Cần rèn luyện': b.failInDomain,
    }))

    return {
      generalStats: {
        totalPass: totalMastered,
        totalFail: totalNeedWork,
        totalAssessed,
        totalCriteria: criteria.length,
        overallRate,
      },
      domainBreakdown: breakdown,
      radarChartData: radarData,
      barChartData: barData,
    }
  }, [assessments, criteria, domains])

  const tabs: TabItem<AssessmentSubTab>[] = [
    { id: 'dashboard', label: 'Tổng quan phát triển', icon: BarChart3 },
    { id: 'growth_timeline', label: 'Hành trình phát triển theo tháng', icon: TrendingUp },
    { id: 'criteria_list', label: 'Tiêu chí theo lĩnh vực', icon: ListTodo, badge: criteria.length },
    { id: 'activities', label: 'Nhật ký đánh giá của cô', icon: Activity, badge: assessments.length },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-rose-500 uppercase">Sự phát triển của bé</span>
          <h2 className="text-xl font-black text-slate-800">Đánh giá phát triển con yêu</h2>
        </div>
        {loading && <div className="flex items-center gap-2 text-xs font-bold text-rose-500"><Loader2 size={16} className="animate-spin" /> Đang đồng bộ...</div>}
      </div>

      {/* Hero: Phân nhóm phát triển nổi bật của bé */}
      <ChildDevelopmentClusterHeroCard
        childName={child.hoTen || 'Bé'}
        fcmHistory={fcmHistory}
        latestFCM={latestFCM}
        loading={loading}
      />

      <TabsNav tabs={tabs} activeTab={subTab} onChange={setSubTab} />

      {subTab === 'dashboard' && (
        <AssessmentDashboard generalStats={generalStats} radarChartData={radarChartData} barChartData={barChartData} domainBreakdown={domainBreakdown} />
      )}

      {subTab === 'growth_timeline' && (
        <ChildFCMGrowthTimeline childId={child.id} />
      )}

      {subTab === 'criteria_list' && (
        <AssessmentCriteriaList domainBreakdown={domainBreakdown} selectedDomainId={selectedDomainId} setSelectedDomainId={setSelectedDomainId} />
      )}

      {subTab === 'activities' && (
        <AssessmentActivitiesHistory assessments={assessments} getCriterionName={(id) => criteria.find((c) => c.id === id)?.name || id} getActivityName={(id) => (id ? activities.find((a) => a.id === id)?.name || 'Hoạt động trải nghiệm' : 'Hoạt động thường nhật')} />
      )}
    </div>
  )
}
