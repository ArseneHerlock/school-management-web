"use client";

import { useState, useEffect } from "react";
import { getStudents, getClasses } from "@/services";
import {
  getActivities,
  getDomains,
  getCriteria,
  getAssessments,
  ActivityItem,
  DomainItem,
  CriterionItem,
  AssessmentItem,
} from "@/services/development";

export function useDanhGiaData() {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [domains, setDomains] = useState<DomainItem[]>([]);
  const [criteria, setCriteria] = useState<CriterionItem[]>([]);
  const [assessments, setAssessments] = useState<AssessmentItem[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [adminMatrixClassId, setAdminMatrixClassId] = useState("");

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [actRes, domRes, criRes, assRes, stuRes, clsRes] =
        await Promise.all([
          getActivities({ page: 1, pageSize: 100 }),
          getDomains(),
          getCriteria({ page: 1, pageSize: 100 }),
          getAssessments({ page: 1, pageSize: 500 }),
          getStudents().catch(() => []),
          getClasses().catch(() => []),
        ]);
      setActivities(actRes?.items || []);
      setDomains(domRes?.items || []);
      setCriteria(criRes?.items || []);
      setAssessments(assRes?.items || []);
      setStudents(Array.isArray(stuRes) ? stuRes : []);
      const clsList = Array.isArray(clsRes) ? clsRes : [];
      setClasses(clsList);
      if (clsList.length > 0 && !adminMatrixClassId) {
        setAdminMatrixClassId(clsList[0].id);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAllData();
  }, []);

  return {
    loading,
    activities,
    domains,
    criteria,
    assessments,
    students,
    classes,
    adminMatrixClassId,
    setAdminMatrixClassId,
    loadAllData,
  };
}
