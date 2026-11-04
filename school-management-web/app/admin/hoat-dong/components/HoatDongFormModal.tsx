"use client";

import React from "react";
import Modal from "@/app/components/ui/Modal";
import { ActivityItem, CreateActivityInput } from "@/services/development";

interface HoatDongFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingItem: ActivityItem | null;
  formData: CreateActivityInput;
  setFormData: React.Dispatch<React.SetStateAction<CreateActivityInput>>;
  onSave: (e: React.FormEvent) => Promise<void>;
  saving: boolean;
}

export default function HoatDongFormModal({
  isOpen,
  onClose,
  editingItem,
  formData,
  setFormData,
  onSave,
  saving,
}: HoatDongFormModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        editingItem ? "Chỉnh sửa hoạt động" : "Thêm hoạt động mới vào ngân hàng"
      }
      maxWidth="lg"
    >
      <form onSubmit={onSave} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-700">
            Tên hoạt động rèn luyện *
          </label>
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
            <label className="text-xs font-bold text-slate-700">
              Độ tuổi tối thiểu (tháng)
            </label>
            <input
              type="number"
              value={formData.minAgeMonths ?? 18}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  minAgeMonths: Number(e.target.value),
                }))
              }
              className="mt-1 w-full rounded-xl border border-rose-200 p-2.5 text-xs outline-none focus:border-rose-400"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700">
              Độ tuổi tối đa (tháng)
            </label>
            <input
              type="number"
              value={formData.maxAgeMonths ?? 72}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  maxAgeMonths: Number(e.target.value),
                }))
              }
              className="mt-1 w-full rounded-xl border border-rose-200 p-2.5 text-xs outline-none focus:border-rose-400"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700">
            Mục đích & Mô tả chi tiết
          </label>
          <textarea
            rows={3}
            value={formData.description || ""}
            onChange={(e) =>
              setFormData((p) => ({ ...p, description: e.target.value }))
            }
            placeholder="Mô tả mục tiêu rèn luyện thể chất, ngôn ngữ, kỹ năng giao tiếp..."
            className="mt-1 w-full rounded-xl border border-rose-200 p-2.5 text-xs outline-none focus:border-rose-400"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white hover:bg-rose-700 cursor-pointer"
          >
            {saving ? "Đang lưu..." : "Lưu hoạt động"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
