"use client";

import { useState } from "react";
import { ActivityItem, CreateActivityInput } from "@/services/development";
import { scheduleActivityByAdmin } from "@/services/schedule";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import { HoatDongTab } from "./types";
import { useHoatDong } from "./useHoatDong";
import HoatDongHeader from "./components/HoatDongHeader";
import HoatDongCatalog from "./components/HoatDongCatalog";
import HoatDongScheduled from "./components/HoatDongScheduled";
import HoatDongFormModal from "./components/HoatDongFormModal";
import HoatDongScheduleModal from "./components/HoatDongScheduleModal";
import HoatDongCriteriaModal from "./components/HoatDongCriteriaModal";

export default function HoatDongPage() {
  const [activeTab, setActiveTab] = useState<HoatDongTab>("catalog");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  const {
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
  } = useHoatDong();

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action: () => Promise<void>;
  }>({
    isOpen: false,
    title: "",
    message: "",
    action: async () => {},
  });
  const [deletingLoading, setDeletingLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ActivityItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<CreateActivityInput>({
    code: "",
    name: "",
    description: "",
    minAgeMonths: 18,
    maxAgeMonths: 72,
  });

  const [linkModalActivity, setLinkModalActivity] = useState<ActivityItem | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [schedulingActivity, setSchedulingActivity] = useState<ActivityItem | null>(null);
  const [scheduleForm, setScheduleForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    startTime: "08:30",
    endTime: "10:00",
    classId: "",
    location: "Khuôn viên trường mầm non",
  });
  const [isScheduling, setIsScheduling] = useState(false);

  const handleOpenScheduleModal = (act: ActivityItem) => {
    setSchedulingActivity(act);
    setScheduleForm({
      date: new Date().toISOString().slice(0, 10),
      startTime: "08:30",
      endTime: "10:00",
      classId: classesList[0]?.id || "",
      location: "Khuôn viên trường mầm non",
    });
    setIsScheduleModalOpen(true);
  };

  const handleConfirmSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedulingActivity) return;
    setIsScheduling(true);
    try {
      const selectedClass = classesList.find((c) => c.id === scheduleForm.classId);
      const isSchoolWide =
        !scheduleForm.classId || scheduleForm.classId === "SCHOOL_WIDE";
      const targetCriteria = (schedulingActivity.developmentCriteria || []).map((dc) => {
        const found = criteria.find((c) => c.id === dc.developmentCriterionId);
        return {
          id: dc.developmentCriterionId,
          name: found?.name || "Tiêu chí rèn luyện",
        };
      });

      const newScheduled = await scheduleActivityByAdmin({
        activityId: schedulingActivity.id,
        activityCode: schedulingActivity.code,
        title: schedulingActivity.name,
        description: schedulingActivity.description || "",
        date: scheduleForm.date,
        startTime: scheduleForm.startTime,
        endTime: scheduleForm.endTime,
        location: scheduleForm.location,
        classId: isSchoolWide ? null : scheduleForm.classId,
        className: isSchoolWide ? "Toàn trường" : selectedClass?.tenLop || "Lớp chỉ định",
        isSchoolWide,
        criteria: targetCriteria,
      });

      setScheduledList((prev) => [newScheduled, ...prev]);
      setNotice(`Đã xếp lịch hoạt động "${schedulingActivity.name}" vào ngày ${scheduleForm.date}!`);
      setIsScheduleModalOpen(false);
    } finally {
      setIsScheduling(false);
    }
  };

  const handleDeleteSchedule = (id: string, title: string) => {
    setDeleteModal({
      isOpen: true,
      title: "Hủy lịch hoạt động",
      message: `Bạn có chắc chắn muốn hủy lịch hoạt động "${title}"?`,
      action: async () => {
        await removeSchedule(id, title);
      },
    });
  };

  const handleSaveActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveActivity(editingItem, formData);
      setIsModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteActivity = (act: ActivityItem) => {
    setDeleteModal({
      isOpen: true,
      title: "Xóa hoạt động phát triển",
      message: `Bạn có chắc chắn muốn xóa hoạt động "${act.name}"?`,
      action: async () => {
        await removeActivity(act);
      },
    });
  };

  return (
    <div className="space-y-6">
      <HoatDongHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activitiesCount={activities.length}
        scheduledCount={scheduledList.length}
        loading={loading}
        onRefresh={() => void load()}
        onOpenCreate={() => {
          setEditingItem(null);
          setFormData({
            code: "",
            name: "",
            description: "",
            minAgeMonths: 18,
            maxAgeMonths: 72,
          });
          setIsModalOpen(true);
        }}
        notice={notice}
        onClearNotice={() => setNotice("")}
      />

      {activeTab === "catalog" ? (
        <HoatDongCatalog
          activities={activities}
          criteria={criteria}
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onToggleActive={toggleActive}
          onOpenSchedule={handleOpenScheduleModal}
          onOpenLinkModal={setLinkModalActivity}
          onOpenEdit={(act) => {
            setEditingItem(act);
            setFormData({
              code: act.code,
              name: act.name,
              description: act.description || "",
              minAgeMonths: act.minAgeMonths ?? 18,
              maxAgeMonths: act.maxAgeMonths ?? 72,
            });
            setIsModalOpen(true);
          }}
          onDelete={handleDeleteActivity}
        />
      ) : (
        <HoatDongScheduled
          scheduledList={scheduledList}
          onDeleteSchedule={handleDeleteSchedule}
        />
      )}

      <HoatDongFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingItem={editingItem}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSaveActivity}
        saving={saving}
      />

      <HoatDongScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        schedulingActivity={schedulingActivity}
        scheduleForm={scheduleForm}
        setScheduleForm={setScheduleForm}
        classesList={classesList}
        scheduledList={scheduledList}
        onConfirmSchedule={handleConfirmSchedule}
        isScheduling={isScheduling}
      />

      <HoatDongCriteriaModal
        activity={linkModalActivity}
        onClose={() => setLinkModalActivity(null)}
        domains={domains}
        criteria={criteria}
        onLinkCriterion={async (critId) => {
          if (linkModalActivity) await linkCriterion(linkModalActivity.id, critId);
        }}
        onUnlinkCriterion={async (critId) => {
          if (linkModalActivity) await unlinkCriterion(linkModalActivity.id, critId);
        }}
        onCreateCriterion={async (input) => {
          if (linkModalActivity) await addCriterion(linkModalActivity.id, input);
        }}
        onUpdateCriterion={(critId, input) => editCriterion(critId, input)}
        onDeleteCriterion={(critId) => removeCriterion(linkModalActivity?.id || null, critId)}
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal((p) => ({ ...p, isOpen: false }))}
        onConfirm={async () => {
          setDeletingLoading(true);
          try {
            await deleteModal.action();
            setDeleteModal((p) => ({ ...p, isOpen: false }));
          } finally {
            setDeletingLoading(false);
          }
        }}
        title={deleteModal.title}
        message={deleteModal.message}
        confirmText="Xác nhận xóa"
        cancelText="Hủy bỏ"
        variant="danger"
        loading={deletingLoading}
      />
    </div>
  );
}
