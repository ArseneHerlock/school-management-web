"use client";

import React from "react";
import { X, Save, Loader2 } from "lucide-react";
import { CriterionItem, DomainItem } from "@/services/development";

interface CriteriaSubFormProps {
  editingCriterion: CriterionItem | null;
  critDomainId: string;
  setCritDomainId: (val: string) => void;
  critCode: string;
  setCritCode: (val: string) => void;
  critName: string;
  setCritName: (val: string) => void;
  critDesc: string;
  setCritDesc: (val: string) => void;
  domains: DomainItem[];
  savingCriterion: boolean;
  onSave: () => Promise<void>;
  onClose: () => void;
}

export default function CriteriaSubForm({
  editingCriterion,
  critDomainId,
  setCritDomainId,
  critCode,
  setCritCode,
  critName,
  setCritName,
  critDesc,
  setCritDesc,
  domains,
  savingCriterion,
  onSave,
  onClose,
}: CriteriaSubFormProps) {
  return (
    <div className="rounded-xl border border-indigo-200 bg-white p-3 space-y-2.5 shadow-xs">
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold text-indigo-800">
          {editingCriterion
            ? `Chỉnh sửa tiêu chí: ${editingCriterion.code}`
            : "Tạo tiêu chí đánh giá mới & gắn vào hoạt động này"}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <select
          value={critDomainId}
          onChange={(e) => setCritDomainId(e.target.value)}
          className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 outline-none"
        >
          {domains.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={critCode}
          onChange={(e) => setCritCode(e.target.value)}
          placeholder="Mã TC (VD: TC-01)"
          className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-mono outline-none"
        />
        <input
          type="text"
          value={critName}
          onChange={(e) => setCritName(e.target.value)}
          placeholder="Tên tiêu chí đánh giá *"
          className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold outline-none"
        />
      </div>

      <input
        type="text"
        value={critDesc}
        onChange={(e) => setCritDesc(e.target.value)}
        placeholder="Mô tả chi tiết yêu cầu cần đạt của trẻ..."
        className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs outline-none"
      />

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-bold text-slate-600"
        >
          Hủy
        </button>
        <button
          type="button"
          disabled={savingCriterion || !critName.trim()}
          onClick={onSave}
          className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
        >
          {savingCriterion ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Save size={12} />
          )}
          <span>{editingCriterion ? "Cập nhật tiêu chí" : "Tạo & Gắn"}</span>
        </button>
      </div>
    </div>
  );
}
