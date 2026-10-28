'use client';

import React, { useMemo, useState } from 'react';
import Modal from '@/app/components/ui/Modal';
import {
  CalendarDays,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Info,
  Plus,
  Edit3,
  Trash2,
} from 'lucide-react';
import {
  ActivityItem,
  CreateActivityInput,
  CriterionItem,
  DomainItem,
  CreateCriterionInput,
  UpdateCriterionInput,
} from '@/lib/development';
import { ActivityScheduleEvent } from '@/lib/activitySchedule';

interface HoatDongModalsProps {
  isModalOpen: boolean;
  onCloseModal: () => void;
  editingItem: ActivityItem | null;
  formData: CreateActivityInput;
  setFormData: React.Dispatch<React.SetStateAction<CreateActivityInput>>;
  onSaveActivity: (e: React.FormEvent) => Promise<void>;
  saving: boolean;

  isScheduleModalOpen: boolean;
  onCloseScheduleModal: () => void;
  schedulingActivity: ActivityItem | null;
  scheduleForm: {
    date: string;
    startTime: string;
    endTime: string;
    classId: string;
    location: string;
  };
  setScheduleForm: React.Dispatch<React.SetStateAction<any>>;
  classesList: any[];
  scheduledList?: ActivityScheduleEvent[];
  onConfirmSchedule: (e: React.FormEvent) => Promise<void>;
  isScheduling: boolean;

  linkModalActivity: ActivityItem | null;
  onCloseLinkModal: () => void;
  domains?: DomainItem[];
  criteria: CriterionItem[];
  onLinkCriterion: (critId: string) => Promise<void>;
  onUnlinkCriterion: (critId: string) => Promise<void>;
  onCreateCriterion?: (input: CreateCriterionInput) => Promise<void>;
  onUpdateCriterion?: (critId: string, input: UpdateCriterionInput) => Promise<void>;
  onDeleteCriterion?: (critId: string) => Promise<void>;
}

export default function HoatDongModals({
  isModalOpen,
  onCloseModal,
  editingItem,
  formData,
  setFormData,
  onSaveActivity,
  saving,
  isScheduleModalOpen,
  onCloseScheduleModal,
  schedulingActivity,
  scheduleForm,
  setScheduleForm,
  classesList,
  scheduledList = [],
  onConfirmSchedule,
  isScheduling,
  linkModalActivity,
  onCloseLinkModal,
  domains = [],
  criteria,
  onLinkCriterion,
  onUnlinkCriterion,
  onCreateCriterion,
  onUpdateCriterion,
  onDeleteCriterion,
}: HoatDongModalsProps) {
  const [isCriterionFormOpen, setIsCriterionFormOpen] = useState(false);
  const [editingCriterion, setEditingCriterion] = useState<CriterionItem | null>(null);
  const [critForm, setCritForm] = useState({
    name: '',
    description: '',
    developmentDomainId: '',
  });
  const [savingCriterion, setSavingCriterion] = useState(false);

  const handleOpenAddCriterion = () => {
    setEditingCriterion(null);
    setCritForm({
      name: '',
      description: '',
      developmentDomainId: domains[0]?.id || '',
    });
    setIsCriterionFormOpen(true);
  };

  const handleOpenEditCriterion = (c: CriterionItem) => {
    setEditingCriterion(c);
    setCritForm({
      name: c.name,
      description: c.description || '',
      developmentDomainId: c.developmentDomainId || domains[0]?.id || '',
    });
    setIsCriterionFormOpen(true);
  };

  const handleSaveCriterionForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!critForm.name.trim()) return;
    setSavingCriterion(true);
    try {
      const domainId = critForm.developmentDomainId || domains[0]?.id || '';
      if (editingCriterion && onUpdateCriterion) {
        await onUpdateCriterion(editingCriterion.id, {
          developmentDomainId: domainId,
          code: editingCriterion.code,
          name: critForm.name.trim(),
          description: critForm.description.trim() || undefined,
          isActive: true,
        });
      } else if (onCreateCriterion) {
        await onCreateCriterion({
          developmentDomainId: domainId,
          code: '',
          name: critForm.name.trim(),
          description: critForm.description.trim() || undefined,
        });
      }
      setIsCriterionFormOpen(false);
      setEditingCriterion(null);
    } finally {
      setSavingCriterion(false);
    }
  };
  // Find scheduled events on the selected date
  const eventsOnDate = useMemo(() => {
    if (!scheduleForm.date) return [];
    return scheduledList.filter((ev) => ev.date === scheduleForm.date);
  }, [scheduledList, scheduleForm.date]);

  // Check for time collision on the selected date
  const conflictEvent = useMemo(() => {
    if (!eventsOnDate.length || !scheduleForm.startTime || !scheduleForm.endTime) return null;
    return eventsOnDate.find((ev) => {
      // Overlap condition: start < ev.end && end > ev.start
      return scheduleForm.startTime < ev.endTime && scheduleForm.endTime > ev.startTime;
    });
  }, [eventsOnDate, scheduleForm.startTime, scheduleForm.endTime]);

  const quickSlots = [
    { label: 'Sáng 1', start: '08:00', end: '09:30' },
    { label: 'Sáng 2', start: '09:30', end: '11:00' },
    { label: 'Chiều 1', start: '14:00', end: '15:30' },
    { label: 'Chiều 2', start: '15:30', end: '17:00' },
  ];

  return (
    <>
      {/* 1. Modal Thêm / Sửa Hoạt động (No manual code input needed) */}
      <Modal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        title={editingItem ? 'Chỉnh sửa hoạt động' : 'Thêm hoạt động mới vào ngân hàng'}
        maxWidth="lg"
      >
        <form onSubmit={onSaveActivity} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700">Tên hoạt động rèn luyện *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  name: e.target.value,
                }))
              }
              placeholder="VD: Dã ngoại trang trại, Ngày hội thể thao, Lễ hội bánh chưng..."
              className="mt-1 w-full rounded-xl border border-rose-200 p-2.5 text-xs outline-none focus:border-rose-400 font-semibold text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700">Độ tuổi tối thiểu (tháng)</label>
              <input
                type="number"
                value={formData.minAgeMonths ?? 18}
                onChange={(e) => setFormData((p) => ({ ...p, minAgeMonths: Number(e.target.value) }))}
                className="mt-1 w-full rounded-xl border border-rose-200 p-2.5 text-xs outline-none focus:border-rose-400"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700">Độ tuổi tối đa (tháng)</label>
              <input
                type="number"
                value={formData.maxAgeMonths ?? 72}
                onChange={(e) => setFormData((p) => ({ ...p, maxAgeMonths: Number(e.target.value) }))}
                className="mt-1 w-full rounded-xl border border-rose-200 p-2.5 text-xs outline-none focus:border-rose-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Mục đích & Mô tả chi tiết</label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              placeholder="Mô tả mục tiêu rèn luyện thể chất, ngôn ngữ, kỹ năng giao tiếp..."
              className="mt-1 w-full rounded-xl border border-rose-200 p-2.5 text-xs outline-none focus:border-rose-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onCloseModal}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white hover:bg-rose-700 cursor-pointer"
            >
              {saving ? 'Đang lưu...' : 'Lưu hoạt động'}
            </button>
          </div>
        </form>
      </Modal>

      {/* 2. Modal Lên lịch hoạt động thông minh (Có hỗ trợ xem lịch trống / trùng lịch) */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={onCloseScheduleModal}
        title={`Lên lịch hoạt động: ${schedulingActivity?.name || ''}`}
        subtitle="Hệ thống hỗ trợ kiểm tra khung giờ trống và cảnh báo trùng lịch tự động"
        maxWidth="lg"
      >
        <form onSubmit={onConfirmSchedule} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left column: Scheduling form inputs */}
            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <CalendarDays size={14} className="text-rose-500" />
                  Ngày diễn ra *
                </label>
                <input
                  type="date"
                  required
                  value={scheduleForm.date}
                  onChange={(e) => setScheduleForm((p: any) => ({ ...p, date: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-rose-200 p-2.5 outline-none focus:border-rose-400 font-semibold"
                />
              </div>

              {/* Quick time slots */}
              <div>
                <label className="font-bold text-slate-600 block mb-1">
                  Chọn nhanh khung giờ đề xuất:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {quickSlots.map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() =>
                        setScheduleForm((p: any) => ({
                          ...p,
                          startTime: s.start,
                          endTime: s.end,
                        }))
                      }
                      className={`p-1.5 rounded-lg border text-center font-bold text-[11px] transition cursor-pointer ${
                        scheduleForm.startTime === s.start && scheduleForm.endTime === s.end
                          ? 'bg-rose-50 border-rose-400 text-rose-700'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {s.label}: {s.start} - {s.end}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 flex items-center gap-1">
                    <Clock size={13} className="text-slate-400" />
                    Bắt đầu *
                  </label>
                  <input
                    type="time"
                    required
                    value={scheduleForm.startTime}
                    onChange={(e) => setScheduleForm((p: any) => ({ ...p, startTime: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-rose-200 p-2 outline-none focus:border-rose-400 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 flex items-center gap-1">
                    <Clock size={13} className="text-slate-400" />
                    Kết thúc *
                  </label>
                  <input
                    type="time"
                    required
                    value={scheduleForm.endTime}
                    onChange={(e) => setScheduleForm((p: any) => ({ ...p, endTime: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-rose-200 p-2 outline-none focus:border-rose-400 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Phạm vi tham gia *</label>
                <select
                  value={scheduleForm.classId}
                  onChange={(e) => setScheduleForm((p: any) => ({ ...p, classId: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-rose-200 p-2.5 outline-none focus:border-rose-400 font-semibold"
                >
                  <option value="SCHOOL_WIDE">Toàn trường (Tất cả các lớp)</option>
                  {classesList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.tenLop}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 flex items-center gap-1">
                  <MapPin size={13} className="text-slate-400" />
                  Địa điểm tổ chức
                </label>
                <input
                  type="text"
                  value={scheduleForm.location}
                  onChange={(e) => setScheduleForm((p: any) => ({ ...p, location: e.target.value }))}
                  placeholder="VD: Sân cỏ trường, Hội trường lớn, Phòng thể chất..."
                  className="mt-1 w-full rounded-xl border border-rose-200 p-2.5 outline-none focus:border-rose-400"
                />
              </div>
            </div>

            {/* Right column: Live Schedule Timeline & Availability Assistant */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-extrabold text-slate-700 text-xs">
                    Lịch hoạt động ngày {scheduleForm.date || 'đã chọn'}:
                  </span>
                  <span className="text-[11px] font-bold text-rose-600">
                    {eventsOnDate.length} sự kiện
                  </span>
                </div>

                {/* Conflict Status Alert */}
                <div className="my-2.5">
                  {conflictEvent ? (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 text-[11px] font-bold flex items-start gap-2">
                      <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-black text-rose-700">CẢNH BÁO TRÙNG GIỜ!</p>
                        <p className="font-medium text-slate-700 mt-0.5">
                          Trùng khung giờ với <b>{conflictEvent.title}</b> ({conflictEvent.startTime} - {conflictEvent.endTime})
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-bold flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <span>Khung giờ {scheduleForm.startTime} - {scheduleForm.endTime} ĐANG TRỐNG!</span>
                    </div>
                  )}
                </div>

                {/* Events list for date */}
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {eventsOnDate.length === 0 ? (
                    <div className="py-6 text-center text-slate-400 text-xs">
                      Ngày này chưa có hoạt động nào được xếp lịch. Khung giờ hoàn toàn tự do!
                    </div>
                  ) : (
                    eventsOnDate.map((ev) => (
                      <div
                        key={ev.id}
                        className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-bold text-slate-800 truncate">{ev.title}</p>
                          <p className="text-[10px] text-slate-500">
                            {ev.location} · {ev.isSchoolWide ? 'Toàn trường' : ev.className || 'Lớp'}
                          </p>
                        </div>
                        <span className="font-mono font-bold text-[11px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md shrink-0">
                          {ev.startTime} - {ev.endTime}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex items-center gap-1">
                <Info size={13} className="text-slate-400" />
                Giúp ban giám hiệu lên lịch trực quan mà không cần rời trang
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onCloseScheduleModal}
              className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isScheduling}
              className="rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 px-5 py-2 font-bold text-white hover:from-rose-600 hover:to-amber-600 shadow-md cursor-pointer"
            >
              {isScheduling ? 'Đang xếp lịch...' : 'Xác nhận xếp lịch'}
            </button>
          </div>
        </form>
      </Modal>

      {/* 3. Modal Quản lý & Gắn Tiêu chí đánh giá (CRUD đầy đủ) */}
      <Modal
        isOpen={Boolean(linkModalActivity)}
        onClose={() => {
          setIsCriterionFormOpen(false);
          setEditingCriterion(null);
          onCloseLinkModal();
        }}
        title={`Quản lý tiêu chí đánh giá: "${linkModalActivity?.name || ''}"`}
        subtitle="Thêm, sửa, xóa và liên kết tiêu chí rèn luyện cho hoạt động này"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-slate-600 font-medium">
              Các tiêu chí được gắn sẽ hiển thị trực tiếp khi giáo viên bấm đánh giá hoạt động này:
            </p>
            <button
              type="button"
              onClick={handleOpenAddCriterion}
              className="inline-flex items-center gap-1 rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-700 transition cursor-pointer shrink-0"
            >
              <Plus size={13} /> Tạo tiêu chí mới
            </button>
          </div>

          {isCriterionFormOpen && (
            <form
              onSubmit={handleSaveCriterionForm}
              className="rounded-2xl border border-rose-200 bg-rose-50/40 p-3.5 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-rose-700">
                  {editingCriterion ? 'Chỉnh sửa tiêu chí đánh giá' : 'Thêm tiêu chí đánh giá mới'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsCriterionFormOpen(false);
                    setEditingCriterion(null);
                  }}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600"
                >
                  Đóng
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-700">Tên tiêu chí *</label>
                  <input
                    type="text"
                    required
                    value={critForm.name}
                    onChange={(e) => setCritForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="VD: Trẻ hát đúng giai điệu, phối hợp nhóm..."
                    className="mt-1 w-full rounded-xl border border-rose-200 bg-white px-2.5 py-2 text-xs font-semibold outline-none focus:border-rose-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700">Lĩnh vực phát triển</label>
                  <select
                    value={critForm.developmentDomainId}
                    onChange={(e) =>
                      setCritForm((p) => ({ ...p, developmentDomainId: e.target.value }))
                    }
                    className="mt-1 w-full rounded-xl border border-rose-200 bg-white px-2.5 py-2 text-xs font-semibold outline-none focus:border-rose-400"
                  >
                    {domains.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700">Mô tả yêu cầu cần đạt</label>
                <input
                  type="text"
                  value={critForm.description}
                  onChange={(e) => setCritForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Mô tả biểu hiện đạt của trẻ trong hoạt động..."
                  className="mt-1 w-full rounded-xl border border-rose-200 bg-white px-2.5 py-2 text-xs outline-none focus:border-rose-400"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsCriterionFormOpen(false);
                    setEditingCriterion(null);
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={savingCriterion}
                  className="rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-rose-700 cursor-pointer"
                >
                  {savingCriterion
                    ? 'Đang lưu...'
                    : editingCriterion
                      ? 'Cập nhật tiêu chí'
                      : 'Lưu & Gắn vào hoạt động'}
                </button>
              </div>
            </form>
          )}

          <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
            {criteria.map((c) => {
              const isLinked = (linkModalActivity?.developmentCriteria || []).some(
                (dc) => dc.developmentCriterionId === c.id
              );
              const domainName = domains.find((d) => d.id === c.developmentDomainId)?.name;
              return (
                <div
                  key={c.id}
                  className={`flex items-center justify-between gap-2 p-2.5 rounded-xl border transition ${
                    isLinked
                      ? 'border-emerald-200 bg-emerald-50/40'
                      : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-800 truncate">{c.name}</span>
                      {isLinked && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-700 shrink-0">
                          Đã gắn
                        </span>
                      )}
                    </div>
                    {(domainName || c.description) && (
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {domainName ? `[${domainName}] ` : ''}
                        {c.description || ''}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEditCriterion(c)}
                      className="p-1.5 rounded-lg text-slate-500 hover:bg-amber-50 hover:text-amber-600 transition cursor-pointer"
                      title="Sửa tiêu chí"
                    >
                      <Edit3 size={13} />
                    </button>
                    {onDeleteCriterion && (
                      <button
                        type="button"
                        onClick={() => void onDeleteCriterion(c.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
                        title="Xóa tiêu chí khỏi hệ thống"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => (isLinked ? onUnlinkCriterion(c.id) : onLinkCriterion(c.id))}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        isLinked
                          ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {isLinked ? 'Gỡ liên kết' : 'Gắn tiêu chí'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </>
  );
}
