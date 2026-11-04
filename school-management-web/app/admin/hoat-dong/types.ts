import { ActivityItem, DomainItem, CriterionItem } from "@/services/development";
import { ActivityScheduleEvent } from "@/services/schedule";

export type HoatDongTab = "catalog" | "scheduled";

export interface HoatDongStats {
  totalActivities: number;
  activeCount: number;
  scheduledCount: number;
  totalCriteriaCount: number;
}
