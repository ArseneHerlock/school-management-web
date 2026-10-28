'use client'

import { useEffect, useMemo, useState } from 'react'
import { Sparkles, BarChart3, ListTodo, Activity, Loader2 } from 'lucide-react'
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
} from '@/lib/development'
import { ChildInfo } from '../types'
import TabsNav, { TabItem } from '@/app/components/ui/TabsNav'
import AssessmentDashboard from './assessment/AssessmentDashboard'
import AssessmentCriteriaList from './assessment/AssessmentCriteriaList'
import AssessmentActivitiesHistory from './assessment/AssessmentActivitiesHistory'

type AssessmentSubTab = 'dashboard' | 'criteria_list' | 'activities'

export default function AssessmentTab({ child }: { child: ChildInfo }) {
  const [loading, setLoading] = useState(true)
  const [assessments, setAssessments] = useState<AssessmentItem[]>([])
  const [criteria, setCriteria] = useState<CriterionItem[]>([])
  const [domains, setDomains] = useState<DomainItem[]>([])
  const [activities, setActivities] = useState<ActivityItem[]>([])

  const [subTab, setSubTab] = useState<AssessmentSubTab>('dashboard')
  const [selectedDomainId, setSelectedDomainId] = useState<string>('ALL')

  const loadData = async () => {
    if (!child.id) return
    setLoading(true)
    try {
      const [historyRes, criteriaRes, domainsRes, activitiesRes] = await Promise.allSettled([
        getChildAssessmentHistory(child.id),
        getCriteria({ page: 1, pageSize: 500 }),
        getDomains({ page: 1, pageSize: 100 }),
        getActivities({ page: 1, pageSize: 200, includeInactive: false }),
      ])

      let childAssessments = historyRes.status === 'fulfilled' ? historyRes.value : []
      if (childAssessments.length === 0) {
        try {
          const assRes = await getAssessments({ childId: child.id, page: 1, pageSize: 500 })
          childAssessments = assRes.items
        } catch {}
      }

      setAssessments(childAssessments)
      if (criteriaRes.status === 'fulfilled') setCriteria(criteriaRes.value.items)
      if (domainsRes.status === 'fulfilled') setDomains(domainsRes.value.items)
      if (activitiesRes.status === 'fulfilled') setActivities(activitiesRes.value.items)
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
      const dCriteria = criteria.filter((c) => c.developmentDomainId === domain.id)
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
    { id: 'criteria_list', label: 'Tiêu chí theo lĩnh vực', icon: ListTodo, badge: criteria.length },
    { id: 'activities', label: 'Nhật ký đánh giá của cô', icon: Activity, badge: assessments.length },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-rose-500 uppercase">Sự phát triển của bé</span>
          <h2 className="text-xl font-black text-slate-800">Đánh giá & Theo dõi con yêu</h2>
        </div>
        {loading && <div className="flex items-center gap-2 text-xs font-bold text-rose-500"><Loader2 size={16} className="animate-spin" /> Đang đồng bộ...</div>}
      </div>

      <TabsNav tabs={tabs} activeTab={subTab} onChange={setSubTab} />

      {subTab === 'dashboard' && (
        <AssessmentDashboard generalStats={generalStats} radarChartData={radarChartData} barChartData={barChartData} domainBreakdown={domainBreakdown} />
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
