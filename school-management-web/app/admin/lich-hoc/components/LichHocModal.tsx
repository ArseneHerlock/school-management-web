"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import Modal from "@/app/components/ui/Modal";
import { ScheduleItem } from "../types";
import {
  getActivities,
  getDomains,
  getCriteria,
  ActivityItem,
  DomainItem,
  CriterionItem,
} from "@/services/development";
import SchoolActivitySelector from "./SchoolActivitySelector";
import CriteriaManagerSection from "./CriteriaManagerSection";
import ConflictAndSlotHelper from "./ConflictAndSlotHelper";
import LichHocDetailFields from "./LichHocDetailFields";
import {
  getFilteredDaySchedules,
  findScheduleConflicts,
  computeAvailableSlots,
} from "../scheduleCalculations";

interface LichHocModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingItem: ScheduleItem | null;
  form: {
    activityId?: string;
    title: string;
    description: string;
    type: number;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    classId: string;
    isSchoolWide: boolean;
    teacherName: string;
  };
  setForm: React.Dispatch<React.SetStateAction<any>>;
  classes: any[];
  existingSchedules?: ScheduleItem[];
  onSave: () => void;
  isSubmitting: boolean;
}

export default function LichHocModal({
  isOpen,
  onClose,
  editingItem,
  form,
  setForm,
  classes,
  existingSchedules = [],
  onSave,
  isSubmitting,
}: LichHocModalProps) {
  const [schoolActivities, setSchoolActivities] = useState<ActivityItem[]>([]);
  const [domains, setDomains] = useState<DomainItem[]>([]);
  const [criteriaList, setCriteriaList] = useState<CriterionItem[]>([]);
  const [loadingBank, setLoadingBank] = useState(false);

  const loadActivityAndCriteriaBank = useCallback(async () => {
    setLoadingBank(true);
    try {
      const [actRes, domRes, criRes] = await Promise.all([
        getActivities({ page: 1, pageSize: 200, includeInactive: false }),
        getDomains({ page: 1, pageSize: 100 }),
        getCriteria({ page: 1, pageSize: 500 }),
      ]);
      const acts = actRes.items || [];
      setSchoolActivities(acts);
      setDomains(domRes.items || []);
      setCriteriaList(criRes.items || []);

      if (form.title && !form.activityId) {
        const matched = acts.find(
          (a) =>
            a.name.trim().toLowerCase() === form.title.trim().toLowerCase() ||
            form.title.toLowerCase().includes(a.name.trim().toLowerCase()),
        );
        if (matched) {
          setForm((p: any) => ({ ...p, activityId: matched.id }));
        }
      }
    } finally {
      setLoadingBank(false);
    }
  }, [form.title, form.activityId, setForm]);

  useEffect(() => {
    if (isOpen) {
      void loadActivityAndCriteriaBank();
    }
  }, [isOpen, loadActivityAndCriteriaBank]);

  const selectedActivity = useMemo(() => {
    if (form.activityId) {
      const byId = schoolActivities.find((a) => a.id === form.activityId);
      if (byId) return byId;
    }
    if (form.title) {
      const q = form.title.trim().toLowerCase();
      return (
        schoolActivities.find((a) => a.name.trim().toLowerCase() === q) || null
      );
    }
    return null;
  }, [schoolActivities, form.activityId, form.title]);

  const linkedCriteria = useMemo(() => {
    if (!selectedActivity?.developmentCriteria?.length) return [];
    return selectedActivity.developmentCriteria
      .map((dc) => {
        const found = criteriaList.find((c) => c.id === dc.developmentCriterionId);
        return found ? { ...found, observationGuide: dc.observationGuide } : null;
      })
      .filter(Boolean) as Array<CriterionItem & { observationGuide?: string | null }>;
  }, [selectedActivity, criteriaList]);

  const unlinkedCriteria = useMemo(() => {
    const linkedIds = new Set(
      (selectedActivity?.developmentCriteria || []).map(
        (dc) => dc.developmentCriterionId,
      ),
    );
    return criteriaList.filter((c) => !linkedIds.has(c.id));
  }, [selectedActivity, criteriaList]);

  const daySchedules = useMemo(() => {
    return getFilteredDaySchedules(
      existingSchedules,
      form.date,
      form.classId,
      form.isSchoolWide,
      editingItem,
    );
  }, [existingSchedules, form.date, form.classId, form.isSchoolWide, editingItem]);

  const conflicts = useMemo(() => {
    return findScheduleConflicts(daySchedules, form.startTime, form.endTime);
  }, [daySchedules, form.startTime, form.endTime]);

  const availableSlots = useMemo(() => {
    return computeAvailableSlots(daySchedules);
  }, [daySchedules]);

  const selectedClassName = form.isSchoolWide
    ? "Toàn trường"
    : classes.find((c) => c.id === form.classId)?.tenLop || "Lớp đã chọn";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingItem ? "Chỉnh sửa hoạt động lịch học" : "Thêm hoạt động từ Ngân hàng vào lịch"}
      maxWidth="2xl"
    >
      <div className="space-y-4 max-h-[82vh] overflow-y-auto px-1 pr-2">
        <SchoolActivitySelector
          schoolActivities={schoolActivities}
          selectedActivity={selectedActivity}
          onSelectActivity={(act) =>
            setForm((p: any) => ({
              ...p,
              activityId: act.id,
              title: act.name,
              description: act.description || p.description || "",
              type: 2,
            }))
          }
          formTitle={form.title}
          onTitleChange={(val) => setForm((p: any) => ({ ...p, title: val }))}
          loadingBank={loadingBank}
          onReloadBank={loadActivityAndCriteriaBank}
        />

        {selectedActivity && (
          <CriteriaManagerSection
            selectedActivity={selectedActivity}
            linkedCriteria={linkedCriteria}
            unlinkedCriteria={unlinkedCriteria}
            domains={domains}
            onReloadBank={loadActivityAndCriteriaBank}
          />
        )}

        <LichHocDetailFields
          form={form}
          setForm={setForm}
          classes={classes}
        />

        <ConflictAndSlotHelper
          conflicts={conflicts}
          startTime={form.startTime}
          endTime={form.endTime}
          selectedClassName={selectedClassName}
          availableSlots={availableSlots}
          onApplySlot={(start, end) => setForm((p: any) => ({ ...p, startTime: start, endTime: end }))}
        />

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            Hủy
          </button>
          <div className="flex items-center gap-2">
            {conflicts.length > 0 && (
              <span className="text-[11px] font-bold text-rose-600 hidden sm:inline">
                Đang bị trùng lịch!
              </span>
            )}
            <button
              type="button"
              onClick={onSave}
              disabled={isSubmitting || !form.title.trim()}
              className={`rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-sm transition disabled:opacity-50 cursor-pointer ${
                conflicts.length > 0 ? "bg-amber-600 hover:bg-amber-700" : "bg-rose-600 hover:bg-rose-700"
              }`}
            >
              {isSubmitting
                ? "Đang lưu..."
                : conflicts.length > 0
                ? "Vẫn lưu (Chấp nhận trùng)"
                : "Lưu hoạt động vào lịch"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
