"use client";

import { useEffect, useState } from "react";
import { Sparkles, RefreshCw, Plus, CalendarDays } from "lucide-react";
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
} from "@/lib/development";
import {
  loadScheduledActivities,
  scheduleActivityByAdmin,
  deleteScheduledActivity,
  ActivityScheduleEvent,
} from "@/lib/activitySchedule";
import { getClasses } from "@/services";
import TabsNav, { TabItem } from "@/app/components/ui/TabsNav";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import { HoatDongTab } from "./hoat-dong/types";
import HoatDongCatalog from "./hoat-dong/HoatDongCatalog";
import HoatDongScheduled from "./hoat-dong/HoatDongScheduled";
import HoatDongModals from "./hoat-dong/HoatDongModals";

export default function HoatDong() {
  const [activeTab, setActiveTab] = useState<HoatDongTab>("catalog");
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [domains, setDomains] = useState<DomainItem[]>([]);
  const [criteria, setCriteria] = useState<CriterionItem[]>([]);
  const [scheduledList, setScheduledList] = useState<ActivityScheduleEvent[]>(
    [],
  );
  const [classesList, setClassesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "INACTIVE"
  >("ALL");
  const [notice, setNotice] = useState("");

  // Delete modal state
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

  // Modals state
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

  const [linkModalActivity, setLinkModalActivity] =
    useState<ActivityItem | null>(null);

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [schedulingActivity, setSchedulingActivity] =
    useState<ActivityItem | null>(null);
  const [scheduleForm, setScheduleForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    startTime: "08:30",
    endTime: "10:00",
    classId: "",
    location: "Khuôn viên trường mầm non",
  });
  const [isScheduling, setIsScheduling] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [actRes, domRes, criRes, classesRes, schItems] = await Promise.all([
        getActivities({ page: 1, pageSize: 200, includeInactive: true }).catch(
          () => ({ total: 0, items: [], page: 1, pageSize: 0 }),
        ),
        getDomains({ page: 1, pageSize: 100 }).catch(() => ({
          total: 0,
          items: [],
          page: 1,
          pageSize: 0,
        })),
        getCriteria({ page: 1, pageSize: 500, includeInactive: false }).catch(
          () => ({ total: 0, items: [], page: 1, pageSize: 0 }),
        ),
        getClasses().catch(() => []),
        loadScheduledActivities(),
      ]);
      const actItems = actRes.items || [];
      setActivities(actItems);
      setDomains(domRes.items || []);
      setCriteria(criRes.items || []);
      setClassesList(Array.isArray(classesRes) ? classesRes : []);
      setScheduledList(schItems);
      setLinkModalActivity((prev) =>
        prev ? actItems.find((a) => a.id === prev.id) || prev : null,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

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
      const selectedClass = classesList.find(
        (c) => c.id === scheduleForm.classId,
      );
      const isSchoolWide =
        !scheduleForm.classId || scheduleForm.classId === "SCHOOL_WIDE";
      const targetCriteria = (schedulingActivity.developmentCriteria || []).map(
        (dc) => {
          const found = criteria.find(
            (c) => c.id === dc.developmentCriterionId,
          );
          return {
            id: dc.developmentCriterionId,
            name: found?.name || "Tiêu chí rèn luyện",
          };
        },
      );

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
        className: isSchoolWide
          ? "Toàn trường"
          : selectedClass?.tenLop || "Lớp chỉ định",
        isSchoolWide,
        criteria: targetCriteria,
      });

      setScheduledList((prev) => [newScheduled, ...prev]);
      setNotice(
        `Đã xếp lịch hoạt động "${schedulingActivity.name}" vào ngày ${scheduleForm.date}!`,
      );
      setIsScheduleModalOpen(false);
    } finally {
      setIsScheduling(false);
    }
  };

  const handleDeleteSchedule = (id: string, title: string) => {
    setDeleteModal({
      isOpen: true,
      title: "Hủy lịch hoạt động",
      message: `Bạn có chắc chắn muốn hủy lịch hoạt động "${title}"? Sự kiện này sẽ bị gỡ khỏi thời khóa biểu.`,
      action: async () => {
        await deleteScheduledActivity(id);
        setScheduledList((prev) => prev.filter((s) => s.id !== id));
        setNotice(`Đã hủy lịch hoạt động "${title}".`);
      },
    });
  };

  const handleSaveActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingItem) {
        await updateActivity(editingItem.id, {
          ...formData,
          isActive: editingItem.isActive,
        });
      } else {
        await createActivity(formData);
      }
      setIsModalOpen(false);
      setNotice("Đã lưu thông tin hoạt động!");
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteActivity = (act: ActivityItem) => {
    setDeleteModal({
      isOpen: true,
      title: "Xóa hoạt động phát triển",
      message: `Bạn có chắc chắn muốn xóa hoạt động "${act.name}" khỏi ngân hàng hoạt động?`,
      action: async () => {
        await deleteActivity(act.id);
        setNotice(`Đã xóa hoạt động "${act.name}".`);
        await load();
      },
    });
  };

  const handleToggleActive = async (act: ActivityItem) => {
    await setActivityActive(act.id, !act.isActive);
    await load();
  };

  const tabs: TabItem<HoatDongTab>[] = [
    {
      id: "catalog",
      label: "Ngân hàng hoạt động",
      icon: Sparkles,
      badge: activities.length,
    },
    {
      id: "scheduled",
      label: "Lịch hoạt động đã xếp",
      icon: CalendarDays,
      badge: scheduledList.length,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-bold text-rose-500 uppercase">
            Hoạt động trải nghiệm
          </span>
          <h1 className="text-2xl font-black text-slate-800">
            Hoạt động toàn trường & Kỹ năng
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => void load()}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-rose-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-rose-50 transition"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />{" "}
            Cập nhật
          </button>
          <button
            onClick={() => {
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
            className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:from-rose-600 hover:to-rose-700 transition"
          >
            <Plus size={15} /> Thêm hoạt động mới
          </button>
        </div>
      </div>

      <TabsNav tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      {notice && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-bold text-emerald-800 flex justify-between">
          {notice} <button onClick={() => setNotice("")}>×</button>
        </div>
      )}

      {activeTab === "catalog" ? (
        <HoatDongCatalog
          activities={activities}
          criteria={criteria}
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onToggleActive={handleToggleActive}
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

      <HoatDongModals
        isModalOpen={isModalOpen}
        onCloseModal={() => setIsModalOpen(false)}
        editingItem={editingItem}
        formData={formData}
        setFormData={setFormData}
        onSaveActivity={handleSaveActivity}
        saving={saving}
        isScheduleModalOpen={isScheduleModalOpen}
        onCloseScheduleModal={() => setIsScheduleModalOpen(false)}
        schedulingActivity={schedulingActivity}
        scheduleForm={scheduleForm}
        setScheduleForm={setScheduleForm}
        classesList={classesList}
        scheduledList={scheduledList}
        onConfirmSchedule={handleConfirmSchedule}
        isScheduling={isScheduling}
        linkModalActivity={linkModalActivity}
        onCloseLinkModal={() => setLinkModalActivity(null)}
        domains={domains}
        criteria={criteria}
        onLinkCriterion={async (critId) => {
          if (!linkModalActivity) return;
          await linkActivityCriterion(linkModalActivity.id, critId);
          await load();
        }}
        onUnlinkCriterion={async (critId) => {
          if (!linkModalActivity) return;
          await unlinkActivityCriterion(linkModalActivity.id, critId);
          await load();
        }}
        onCreateCriterion={async (input) => {
          if (!linkModalActivity) return;
          const created = await createCriterion(input);
          if (created?.id) {
            await linkActivityCriterion(linkModalActivity.id, created.id);
          }
          setNotice(`Đã thêm và gắn tiêu chí "${input.name}" vào hoạt động!`);
          await load();
        }}
        onUpdateCriterion={async (critId, input) => {
          await updateCriterion(critId, input);
          setNotice(`Đã cập nhật tiêu chí "${input.name}"!`);
          await load();
        }}
        onDeleteCriterion={async (critId) => {
          if (linkModalActivity) {
            await unlinkActivityCriterion(linkModalActivity.id, critId).catch(() => {});
          }
          await deleteCriterion(critId);
          setNotice("Đã xóa tiêu chí đánh giá!");
          await load();
        }}
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
