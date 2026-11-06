"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Plus, Grid, List } from "lucide-react";
import {
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getClasses,
  getSchedules,
} from "@/services";
import { getActivities, createActivity } from "@/services/development";
import { ScheduleItem } from "./types";
import WeeklyTimetable, {
  TimetableScheduleItem,
  isEvaluableActivity,
} from "@/app/components/schedule/WeeklyTimetable";
import { formatScheduleItems, buildSchedulePayload } from "./scheduleHelpers";
import LichHocTable from "./components/LichHocTable";
import LichHocModal from "./components/LichHocModal";
import ConfirmModal from "@/app/components/ui/ConfirmModal";

export default function LichHocPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [classFilter, setClassFilter] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [refreshKey, setRefreshKey] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [form, setForm] = useState({
    activityId: "",
    title: "",
    description: "",
    type: 2,
    date: new Date().toISOString().slice(0, 10),
    startTime: "07:30",
    endTime: "09:30",
    location: "",
    classId: "",
    isSchoolWide: true,
    teacherName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [tableSchedules, setTableSchedules] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    getClasses()
      .then((c) => {
        if (Array.isArray(c)) {
          setClasses(c);
          if (c.length > 0) {
            setClassFilter((prev) => (prev === "ALL" ? c[0].id : prev));
          }
        }
      })
      .catch(() => {});
  }, []);

  const classesRef = useRef(classes);
  classesRef.current = classes;

  const fetchAdminSchedules = useCallback(
    async (params: {
      from: string;
      to: string;
      type?: number;
      classId?: string;
    }): Promise<TimetableScheduleItem[]> => {
      const res = await getSchedules({
        from: params.from,
        to: params.to,
        type: params.type,
        classId: params.classId && params.classId !== "ALL" ? params.classId : undefined,
      }).catch(() => []);

      const fetchedList = Array.isArray(res) ? res : [];
      const formatted = formatScheduleItems(fetchedList, classesRef.current);
      setTableSchedules(formatted as ScheduleItem[]);
      return formatted;
    },
    [],
  );

  const handleOpenCreate = (targetDate?: string) => {
    const defaultCls = classFilter !== "ALL" ? classFilter : classes[0]?.id || "";
    setEditingItem(null);
    setForm({
      activityId: "",
      title: "",
      description: "",
      type: 2,
      date: targetDate || new Date().toISOString().slice(0, 10),
      startTime: "08:30",
      endTime: "09:30",
      location: "",
      classId: defaultCls,
      isSchoolWide: !defaultCls,
      teacherName: "",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setForm({
      activityId: item.activityId || "",
      title: item.title,
      description: item.description || "",
      type: item.type,
      date: item.date,
      startTime: item.startTime,
      endTime: item.endTime,
      location: item.location || "",
      classId: item.classId || "",
      isSchoolWide: item.isSchoolWide,
      teacherName: item.teacherName || "",
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setIsSubmitting(true);
    try {
      let resolvedActivityId = form.activityId || "";
      if (!resolvedActivityId && isEvaluableActivity({ title: form.title, type: Number(form.type) })) {
        try {
          const actRes = await getActivities({ page: 1, pageSize: 200, includeInactive: true });
          const matched = (actRes.items || []).find(
            (a) => a.name.trim().toLowerCase() === form.title.trim().toLowerCase(),
          );
          if (matched) {
            resolvedActivityId = matched.id;
          } else {
            const created = await createActivity({
              code: `HD-${Date.now().toString().slice(-5)}`,
              name: form.title.trim(),
              description: form.description.trim() || "Hoạt động giáo dục mầm non",
              minAgeMonths: 18,
              maxAgeMonths: 72,
            });
            resolvedActivityId = created.id;
          }
        } catch {}
      }

      const payload = buildSchedulePayload(form, resolvedActivityId);
      if (editingItem) {
        await updateSchedule(editingItem.id, payload);
      } else {
        await createSchedule(payload);
      }
      setModalOpen(false);
      setRefreshKey((k) => k + 1);
    } catch (err: any) {
      alert("Không thể lưu lịch: " + (err?.message || err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await deleteSchedule(deleteTargetId);
      setDeleteTargetId(null);
      setRefreshKey((k) => k + 1);
    } catch (err: any) {
      alert("Không thể xóa lịch: " + (err?.message || err));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4 p-4 md:p-6 bg-white min-h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Phân hệ Quản trị / Lịch biểu
        </span>
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
          <button
            onClick={() => setViewMode("grid")}
            className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition ${
              viewMode === "grid" ? "bg-white text-sky-700 shadow-2xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Grid size={13} /> Lưới tuần
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition ${
              viewMode === "table" ? "bg-white text-sky-700 shadow-2xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <List size={13} /> Danh sách
          </button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <WeeklyTimetable
          key={refreshKey}
          userRole="admin"
          fetchSchedules={fetchAdminSchedules}
          classes={classes}
          selectedClassId={classFilter}
          onClassChange={setClassFilter}
          onAddSchedule={handleOpenCreate}
          onEditSchedule={handleOpenEdit}
          onDeleteSchedule={(id) => setDeleteTargetId(id)}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">Danh sách lịch hoạt động</h2>
            <button
              onClick={() => handleOpenCreate()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 cursor-pointer"
            >
              <Plus size={14} /> Thêm hoạt động
            </button>
          </div>
          <LichHocTable
            schedules={tableSchedules}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={10}
            onOpenEdit={handleOpenEdit}
            onDelete={(id) => setDeleteTargetId(id)}
          />
        </div>
      )}

      <LichHocModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editingItem={editingItem}
        form={form}
        setForm={setForm}
        classes={classes}
        existingSchedules={tableSchedules}
        onSave={handleSave}
        isSubmitting={isSubmitting}
      />

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa lịch"
        message="Bạn có chắc chắn muốn xóa lịch này khỏi hệ thống?"
        confirmText="Xác nhận xóa"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}
