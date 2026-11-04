export interface LearningItem {
  id: string;
  childId: string;
  activityId?: string;
  mediaId: string;
  title: string;
  description?: string;
  createdAtUtc?: string;
}

export interface EnrichedLearningItem extends LearningItem {
  displayTitle: string;
  cleanDesc: string;
  dateStr: string;
  monthKey: string;
  category: string;
  resolvedActId: string;
  resolvedActTitle: string;
}
