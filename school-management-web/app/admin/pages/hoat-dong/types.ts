import { ActivityItem, DomainItem, CriterionItem } from '@/lib/development'
import { ActivityScheduleEvent } from '@/lib/activitySchedule'

export type HoatDongTab = 'catalog' | 'scheduled'

export interface HoatDongStats {
  totalActivities: number
  activeCount: number
  scheduledCount: number
  totalCriteriaCount: number
}
