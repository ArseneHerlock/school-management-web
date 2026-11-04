export interface ChildEvaluationSummary {
  rating?: string;
  comment?: string;
  score?: number;
}

export interface ScheduleItem {
  id?: string;
  title: string;
  description?: string;
  date?: string;
  startTime: string;
  endTime: string;
  location?: string;
  teacherName?: string;
  type: number;
  isActivity?: boolean;
  activityId?: string;
  childEvaluation?: ChildEvaluationSummary;
}

export const TYPE_COLORS: Record<number, { border: string; bg: string; text: string }> = {
  0: { border: 'border-slate-200', bg: 'bg-slate-50', text: 'text-slate-800' },
  1: { border: 'border-sky-200', bg: 'bg-sky-50', text: 'text-sky-900' },
  2: { border: 'border-purple-200', bg: 'bg-purple-50', text: 'text-purple-900' },
  3: { border: 'border-emerald-200', bg: 'bg-emerald-50', text: 'text-emerald-900' },
  4: { border: 'border-amber-200', bg: 'bg-amber-50', text: 'text-amber-900' },
};

export function normalizeTitleForMatch(str?: string): string {
  return String(str || '')
    .toLowerCase()
    .replace(
      /^(hoạt động học|hoạt động góc|hoạt động ngoài trời|vui chơi|sinh hoạt|chủ đề)\s*:\s*/i,
      ''
    )
    .trim();
}
