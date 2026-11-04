"use client";

import React from "react";
import { X, Save, Loader2 } from "lucide-react";
import { Grade, GradeFormData } from "../types";

interface GradeModalProps {
  editingGrade: Grade | null;
  isCreatingNew: boolean;
  formData: GradeFormData;
  setFormData: (data: GradeFormData) => void;
  isSaving: boolean;
  onSave: () => void;
  onClose: () => void;
}

export default function GradeModal({
  editingGrade,
  isCreatingNew,
  formData,
  setFormData,
  isSaving,
  onSave,
  onClose,
}: GradeModalProps) {
  if (!editingGrade) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-955/45 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black">
            {isCreatingNew ? "Thêm khối học mới" : "Chỉnh sửa khối học"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-600">
              Mã khối
            </label>
            <input
              className="admin-input disabled:bg-slate-100"
              disabled={!isCreatingNew}
              value={formData.maKhoi}
              onChange={(e) =>
                setFormData({ ...formData, maKhoi: e.target.value })
              }
              placeholder="Ví dụ: K1, K2, K3..."
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-600">
              Tên khối
            </label>
            <input
              className="admin-input"
              value={formData.tenKhoi}
              onChange={(e) =>
                setFormData({ ...formData, tenKhoi: e.target.value })
              }
              placeholder="Ví dụ: Khối Mầm, Khối Chồi..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-600">
                Độ tuổi bắt đầu (tuổi)
              </label>
              <input
                className="admin-input"
                type="number"
                min="0"
                max="18"
                value={formData.doTuoiBatDau}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    doTuoiBatDau: Number(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-600">
                Độ tuổi kết thúc (tuổi)
              </label>
              <input
                className="admin-input"
                type="number"
                min="0"
                max="18"
                value={formData.doTuoiKetThuc}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    doTuoiKetThuc: Number(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-600">
              Mô tả chương trình học
            </label>
            <textarea
              className="admin-input min-h-[90px]"
              value={formData.moTa}
              onChange={(e) =>
                setFormData({ ...formData, moTa: e.target.value })
              }
              placeholder="Mô tả mục tiêu đào tạo, đặc điểm khối..."
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="admin-btn admin-btn-secondary"
          >
            Hủy
          </button>
          <button
            disabled={isSaving}
            onClick={onSave}
            className="admin-btn admin-btn-primary"
          >
            {isSaving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}{" "}
            Lưu khối
          </button>
        </div>
      </div>
    </div>
  );
}
