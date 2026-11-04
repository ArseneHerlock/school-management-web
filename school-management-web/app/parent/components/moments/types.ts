import { MOMENT_CATEGORIES, parseMomentDescription } from '@/lib/moments'

export interface MediaItem {
  id: string
  url: string
  title: string
  description?: string
  date: string
  monthKey?: string
  type: 'image' | 'video'
  category: string
  scope: 'class' | 'child'
  childId?: string
  childName?: string
  classId?: string
  activityId?: string
  activityTitle?: string
  likes: number
  isLiked?: boolean
}

export const CATEGORIES = Array.from(MOMENT_CATEGORIES)

export function cleanDescription(desc?: string): string {
  if (!desc) return ''
  return parseMomentDescription(desc).cleanText
}

export function extractCategory(desc?: string): string {
  if (!desc) return 'Hoạt động học tập'
  return parseMomentDescription(desc).category || 'Hoạt động học tập'
}
