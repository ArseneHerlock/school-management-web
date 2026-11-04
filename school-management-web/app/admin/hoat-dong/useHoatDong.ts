"use client";

import { useState, useEffect } from "react";
import {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  setActivityActive,
  getDomains,
  getCriteria,
  createCriterion,
  updateCriterion,
  deleteCriterion,
  linkActivityCriterion,
  unlinkActivityCriterion,
  ActivityItem,
  CreateActivityInput,
  DomainItem,
  CriterionItem,
} from "@/services/development";
import {
  loadScheduledActivities,
  scheduleActivityByAdmin,
  deleteScheduledActivity,
  ActivityScheduleEvent,
} from "@/services/schedule";
import { getClasses } from "@/services";

export function useHoatDong() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [domains, setDomains] = useState<DomainItem[]>([]);
  const [criteria, setCriteria] = useState<CriterionItem[]>([]);
  const [scheduledList, setScheduledList] = useState<ActivityScheduleEvent[]>([]);
  const [classesList, setClassesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [actRes, domRes, criRes, classesRes, schItems] = await Promise.all([
        getActivities({ page: 1, pageSize: 200, includeInactive: true }).catch(() => ({
          total: 0,
          items: [],
          page: 1,
          pageSize: 0,
        })),
        getDomains({ page: 1, pageSize: 100 }).catch(() => ({
          total: 0,
          items: [],
          page: 1,
          pageSize: 0,
        })),
        getCriteria({ page: 1, pageSize: 500, includeInactive: false }).catch(() => ({
          total: 0,
          items: [],
          page: 1,
          pageSize: 0,
        })),
        getClasses().catch(() => []),
        loadScheduledActivities(),
      ]);
      setActivities(actRes.items || []);
      setDomains(domRes.items || []);
      setCriteria(criRes.items || []);
      setClassesList(Array.isArray(classesRes) ? classesRes : []);
      setScheduledList(schItems);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const toggleActive = async (act: ActivityItem) => {
    await setActivityActive(act.id, !act.isActive);
    await load();
  };

  const removeSchedule = async (id: string, title: string) => {
    await deleteScheduledActivity(id);
    setScheduledList((prev) => prev.filter((s) => s.id !== id));
    setNotice(`Đã hủy lịch hoạt động "${title}".`);
  };

  const saveActivity = async (
    editingItem: ActivityItem | null,
    formData: CreateActivityInput,
  ) => {
    if (editingItem) {
      await updateActivity(editingItem.id, {
        ...formData,
        isActive: editingItem.isActive,
      });
    } else {
      await createActivity(formData);
    }
    setNotice("Đã lưu thông tin hoạt động!");
    await load();
  };

  const removeActivity = async (act: ActivityItem) => {
    await deleteActivity(act.id);
    setNotice(`Đã xóa hoạt động "${act.name}".`);
    await load();
  };

  const linkCriterion = async (activityId: string, critId: string) => {
    await linkActivityCriterion(activityId, critId);
    await load();
  };

  const unlinkCriterion = async (activityId: string, critId: string) => {
    await unlinkActivityCriterion(activityId, critId);
    await load();
  };

  const addCriterion = async (activityId: string, input: any) => {
    const created = await createCriterion(input);
    if (created?.id) {
      await linkActivityCriterion(activityId, created.id);
    }
    setNotice(`Đã thêm và gắn tiêu chí "${input.name}" vào hoạt động!`);
    await load();
  };

  const editCriterion = async (critId: string, input: any) => {
    await updateCriterion(critId, input);
    setNotice(`Đã cập nhật tiêu chí "${input.name}"!`);
    await load();
  };

  const removeCriterion = async (activityId: string | null, critId: string) => {
    if (activityId) {
      await unlinkActivityCriterion(activityId, critId).catch(() => {});
    }
    await deleteCriterion(critId);
    setNotice("Đã xóa tiêu chí đánh giá!");
    await load();
  };

  return {
    activities,
    domains,
    criteria,
    scheduledList,
    setScheduledList,
    classesList,
    loading,
    notice,
    setNotice,
    load,
    toggleActive,
    removeSchedule,
    saveActivity,
    removeActivity,
    linkCriterion,
    unlinkCriterion,
    addCriterion,
    editCriterion,
    removeCriterion,
  };
}
