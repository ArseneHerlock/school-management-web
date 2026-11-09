export const CATEGORIES = [
  'Hoạt động học tập',
  'Vui chơi ngoài trời',
  'Nề nếp - Giấc ngủ',
  'Sự kiện & Dã ngoại',
]

export function cleanDescription(desc?: string): string {
  if (!desc) return ''
  return desc
    .replace(/\[CLASS:[^\]]*\]/gi, '')
    .replace(/\[CHILD:[^\]]*\]/gi, '')
    .replace(/\[CAT:[^\]]*\]/gi, '')
    .trim()
}

export function extractCategory(desc?: string): string {
  if (!desc) return 'Hoạt động học tập'
  const match = desc.match(/\[CAT:([^\]]+)\]/i)
  if (match && CATEGORIES.includes(match[1].trim())) {
    return match[1].trim()
  }
  return 'Hoạt động học tập'
}
