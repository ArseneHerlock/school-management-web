export interface ActivityCriterion {
  id: string;
  developmentCriterionId: string;
  observationGuide?: string | null;
}

export interface ActivityItem {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  instructions?: string | null;
  minAgeMonths?: number | null;
  maxAgeMonths?: number | null;
  isActive: boolean;
  createdAt: string;
  scope?: "SCHOOL" | "CLASS";
  classId?: string | null;
  className?: string | null;
  domainCode?: string;
  domainName?: string;
  developmentCriteria: ActivityCriterion[];
}

export interface CreateActivityInput {
  code: string;
  name: string;
  description?: string;
  instructions?: string;
  minAgeMonths?: number;
  maxAgeMonths?: number;
  scope?: "SCHOOL" | "CLASS";
  classId?: string | null;
  domainCode?: string;
  domainName?: string;
}

export interface UpdateActivityInput extends CreateActivityInput {
  isActive: boolean;
}

export interface DomainItem {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  isActive: boolean;
}

export interface CreateDomainInput {
  code: string;
  name: string;
  description?: string;
}

export interface UpdateDomainInput extends CreateDomainInput {
  isActive: boolean;
}

export interface CriterionItem {
  id: string;
  developmentDomainId: string;
  code: string;
  name: string;
  description?: string | null;
  isActive: boolean;
}

export interface CreateCriterionInput {
  developmentDomainId: string;
  code: string;
  name: string;
  description?: string;
}

export interface UpdateCriterionInput extends CreateCriterionInput {
  isActive: boolean;
}

export interface AssessmentItem {
  id: string;
  childId: string;
  developmentCriterionId: string;
  activityId?: string | null;
  result: boolean;
  notes?: string | null;
  comment?: string | null;
  evidence?: string | null;
  assessedAt: string;
  assessedByUserId?: string;
  assessedBy?: string;
  assessedByName?: string;
  [key: string]: any;
}

export interface CreateAssessmentInput {
  childId: string;
  developmentCriterionId: string;
  activityId?: string;
  result: boolean;
  notes?: string;
  comment?: string;
  evidence?: string;
  assessedBy?: string;
  assessedAt?: string;
  [key: string]: any;
}

export interface UpdateAssessmentInput {
  result?: boolean;
  notes?: string;
  comment?: string;
  evidence?: string;
  [key: string]: any;
}
