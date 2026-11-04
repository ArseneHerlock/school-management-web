"use client";

import React, { useState } from "react";
import { Sparkles, Plus, Save, Loader2 } from "lucide-react";
import { ActivityItem, createActivity } from "@/services/development";

interface SchoolActivitySelectorProps {
  schoolActivities: ActivityItem[];
  selectedActivity: ActivityItem | null;
  onSelectActivity: (act: ActivityItem) => void;
  formTitle: string;
  onTitleChange: (val: string) => void;
  loadingBank: boolean;
  onReloadBank: () => Promise<void>;
}

export default function SchoolActivitySelector({
  schoolActivities,
  selectedActivity,
  onSelectActivity,
  formTitle,
  onTitleChange,
  loadingBank,
  onReloadBank,
}: SchoolActivitySelectorProps) {
  const [creatingNewActivity, setCreatingNewActivity] = useState(false);
  const [newActName, setNewActName] = useState("");
  const [newActDesc, setNewActDesc] = useState("");
  const [savingNewAct, setSavingNewAct] = useState(false);

  const handleCreateNewActivity = async () => {
    if (!newActName.trim()) return;
    setSavingNewAct(true);
    try {
      const autoCode = `HD-${Date.now().toString().slice(-5)}`;
      const created = await createActivity({
        code: autoCode,
        name: newActName.trim(),
        description: newActDesc.trim() || "Hoạt động giáo dục mầm non",
        minAgeMonths: 18,
        maxAgeMonths: 72,
      });
      await onReloadBank();
      onSelectActivity(created);
      setCreatingNewActivity(false);
      setNewActName("");
      setNewActDesc("");
    } catch (err: any) {
      alert("Không thể tạo hoạt động mới: " + (err?.message || err));
    } finally {
      setSavingNewAct(false);
    }
  };

  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-3.5 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
          <Sparkles size={14} className="text-rose-600" />
          <span>
            1. Chọn hoạt động từ Ngân hàng ({schoolActivities.length} hoạt động) *
          </span>
        </label>
        <button
          type="button"
          onClick={() => setCreatingNewActivity((v) => !v)}
          className="inline-flex items-center gap-1 rounded-xl bg-white border border-rose-200 px-2.5 py-1 text-[11px] font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
        >
          <Plus size={12} />
          <span>{creatingNewActivity ? "Đóng tạo mới" : "Tạo hoạt động trường mới"}</span>
        </button>
      </div>

      {creatingNewActivity && (
        <div className="rounded-xl border border-rose-200 bg-white p-3 space-y-2.5 shadow-2xs">
          <p className="text-[11px] font-bold text-rose-700">
            Thêm hoạt động mới trực tiếp vào Ngân hàng Hoạt động của trường:
          </p>
          <input
            type="text"
            value={newActName}
            onChange={(e) => setNewActName(e.target.value)}
            placeholder="Tên hoạt động mới..."
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold outline-none focus:border-rose-400"
          />
          <input
            type="text"
            value={newActDesc}
            onChange={(e) => setNewActDesc(e.target.value)}
            placeholder="Mô tả mục tiêu rèn luyện..."
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-rose-400"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setCreatingNewActivity(false)}
              className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-bold text-slate-600"
            >
              Hủy
            </button>
            <button
              type="button"
              disabled={savingNewAct || !newActName.trim()}
              onClick={handleCreateNewActivity}
              className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
            >
              {savingNewAct ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Save size={12} />
              )}
              <span>Lưu & Chọn hoạt động này</span>
            </button>
          </div>
        </div>
      )}

      <select
        value={selectedActivity?.id || ""}
        onChange={(e) => {
          const act = schoolActivities.find((a) => a.id === e.target.value);
          if (act) onSelectActivity(act);
        }}
        className="w-full rounded-xl border border-rose-200 bg-white p-2.5 text-xs font-bold text-slate-800 outline-none focus:border-rose-400"
      >
        <option value="">
          {loadingBank
            ? "Đang tải danh sách hoạt động..."
            : "-- Chọn hoạt động từ danh mục Hoạt động của trường --"}
        </option>
        {schoolActivities.map((act) => (
          <option key={act.id} value={act.id}>
            [{act.code}] {act.name} ({act.developmentCriteria?.length || 0} tiêu chí)
          </option>
        ))}
      </select>

      {schoolActivities.length > 0 && (
        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
          {schoolActivities.map((act) => {
            const isSelected = selectedActivity?.id === act.id;
            return (
              <button
                key={act.id}
                type="button"
                onClick={() => onSelectActivity(act)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border transition cursor-pointer ${
                  isSelected
                    ? "border-rose-600 bg-rose-600 text-white shadow-2xs"
                    : "border-rose-200 bg-white hover:bg-rose-100/70 text-slate-700"
                }`}
              >
                {act.name} ({act.developmentCriteria?.length || 0} TC)
              </button>
            );
          })}
        </div>
      )}

      <div>
        <label className="text-[11px] font-bold text-slate-600">
          Tên hiển thị trên lịch học *
        </label>
        <input
          type="text"
          value={formTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Chọn hoạt động ở trên hoặc nhập tiêu đề lịch..."
          className="mt-1 w-full rounded-xl border border-rose-200 bg-white p-2.5 text-xs font-bold text-slate-800 outline-none focus:border-rose-400"
        />
      </div>
    </div>
  );
}
