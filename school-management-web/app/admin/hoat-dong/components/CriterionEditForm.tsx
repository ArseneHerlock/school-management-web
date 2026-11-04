"use client";

import React from "react";
import { CriterionItem, DomainItem } from "@/services/development";

interface CriterionEditFormProps {
  editingCriterion: CriterionItem | null;
  critForm: {
    name: string;
    description: string;
    developmentDomainId: string;
  };
  setCritForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      description: string;
      developmentDomainId: string;
    }>
  >;
  domains: DomainItem[];
  savingCriterion: boolean;
  onSave: (e: React.FormEvent) => Promise<void>;
  onClose: () => void;
}

export default function CriterionEditForm({
  editingCriterion,
  critForm,
  setCritForm,
  domains,
  savingCriterion,
  onSave,
  onClose,
}: CriterionEditFormProps) {
  return (
    <form
      onSubmit={onSave}
      className="rounded-2xl border border-rose-200 bg-rose-50/40 p-3.5 space-y-2.5"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-black text-rose-700">
          {editingCriterion
            ? "Chỉnh sửa tiêu chí đánh giá"
            : "Thêm tiêu chí đánh giá mới"}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          Đóng
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div>
          <label className="text-[11px] font-bold text-slate-700">
            Tên tiêu chí *
          </label>
          <input
            type="text"
            required
            value={critForm.name}
            onChange={(e) =>
              setCritForm((p) => ({ ...p, name: e.target.value }))
            }
            placeholder="VD: Trẻ hát đúng giai điệu, phối hợp nhóm..."
            className="mt-1 w-full rounded-xl border border-rose-200 bg-white px-2.5 py-2 text-xs font-semibold outline-none focus:border-rose-400"
          />
        </div>
        <div>
          <label className="text-[11px] font-bold text-slate-700">
            Lĩnh vực phát triển
          </label>
          <select
            value={critForm.developmentDomainId}
            onChange={(e) =>
              setCritForm((p) => ({
                ...p,
                developmentDomainId: e.target.value,
              }))
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
        <label className="text-[11px] font-bold text-slate-700">
          Mô tả yêu cầu cần đạt
        </label>
        <input
          type="text"
          value={critForm.description}
          onChange={(e) =>
            setCritForm((p) => ({ ...p, description: e.target.value }))
          }
          placeholder="Mô tả biểu hiện đạt của trẻ trong hoạt động..."
          className="mt-1 w-full rounded-xl border border-rose-200 bg-white px-2.5 py-2 text-xs outline-none focus:border-rose-400"
        />
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onClose}
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
            ? "Đang lưu..."
            : editingCriterion
              ? "Cập nhật tiêu chí"
              : "Lưu & Gắn vào hoạt động"}
        </button>
      </div>
    </form>
  );
}
