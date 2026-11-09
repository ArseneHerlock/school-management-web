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
        {/* Phân loại cấp độ: Hoạt động của trường */}
        <div className="flex items-center justify-between rounded-xl bg-indigo-50 border border-indigo-200 p-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            <span className="text-xs font-bold text-indigo-900">
              Cấp độ: Hoạt động của trường (Ban Giám Hiệu)
            </span>
          </div>
          <span className="text-[11px] font-bold text-indigo-700 bg-white px-2 py-0.5 rounded-md border border-indigo-200">
            Toàn trường
          </span>
        </div>

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
            className="mt-1 w-full rounded-xl border border-emerald-200 p-2.5 text-xs outline-none focus:border-emerald-400 font-semibold text-slate-800"
          />
        </div>

        {/* Bắt buộc chọn 1 trong 5 lĩnh vực phát triển */}
        <div>
          <label className="text-xs font-bold text-slate-700">
            Lĩnh vực phát triển mầm non *
          </label>
          <select
            required
            value={formData.domainCode || "GDMN-PHYSICAL"}
            onChange={(e) => {
              const dCode = e.target.value;
              const dNameMap: Record<string, string> = {
                "GDMN-PHYSICAL": "Thể chất",
                "GDMN-COGNITION": "Nhận thức",
                "GDMN-LANGUAGE": "Ngôn ngữ",
                "GDMN-SOCIAL-EMOTIONAL": "Tình cảm - Xã hội",
                "GDMN-AESTHETIC": "Thẩm mỹ",
              };
              setFormData((p) => ({
                ...p,
                domainCode: dCode,
                domainName: dNameMap[dCode] || "Thể chất",
              }));
            }}
            className="mt-1 w-full rounded-xl border border-emerald-200 p-2.5 text-xs outline-none focus:border-emerald-400 font-bold text-slate-800 bg-white"
          >
            <option value="GDMN-PHYSICAL">1. Thể chất (Vận động, thể lực, tự phục vụ)</option>
            <option value="GDMN-COGNITION">2. Nhận thức (Khám phá, tư duy, toán học)</option>
            <option value="GDMN-LANGUAGE">3. Ngôn ngữ (Giao tiếp, kể chuyện, đọc thơ)</option>
            <option value="GDMN-SOCIAL-EMOTIONAL">4. Tình cảm - Xã hội (Hòa đồng, cảm xúc, quy tắc)</option>
            <option value="GDMN-AESTHETIC">5. Thẩm mỹ (Vẽ, múa, hát, sáng tạo nghệ thuật)</option>
          </select>
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
              className="mt-1 w-full rounded-xl border border-emerald-200 p-2.5 text-xs outline-none focus:border-emerald-400"
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
              className="mt-1 w-full rounded-xl border border-emerald-200 p-2.5 text-xs outline-none focus:border-emerald-400"
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
            className="mt-1 w-full rounded-xl border border-emerald-200 p-2.5 text-xs outline-none focus:border-emerald-400"
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
            className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer"
          >
            {saving ? "Đang lưu..." : "Lưu hoạt động"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
