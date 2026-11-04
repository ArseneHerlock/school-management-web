"use client";

import React from "react";
import { Edit3, Trash2, Layers, Loader2 } from "lucide-react";
import { Grade } from "../types";

interface GradeCardGridProps {
  grades: Grade[];
  isLoading: boolean;
  onEdit: (grade: Grade) => void;
  onDelete: (grade: Grade) => void;
}

export default function GradeCardGrid({
  grades,
  isLoading,
  onEdit,
  onDelete,
}: GradeCardGridProps) {
  if (isLoading) {
    return (
      <div className="admin-card col-span-full flex justify-center py-16">
        <Loader2 className="animate-spin text-emerald-500" size={28} />
      </div>
    );
  }

  if (grades.length === 0) {
    return (
      <div className="admin-card col-span-full py-16 text-center text-slate-400">
        Không tìm thấy khối học nào.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {grades.map((gradeItem) => (
        <div
          key={gradeItem.id}
          className="admin-card p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Layers size={20} />
              </div>
              <div>
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                  {gradeItem.maKhoi}
                </span>
                <h2 className="mt-1 text-lg font-black text-slate-900">
                  {gradeItem.tenKhoi}
                </h2>
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => onEdit(gradeItem)}
                className="icon-btn"
                title="Chỉnh sửa"
              >
                <Edit3 size={15} />
              </button>
              <button
                onClick={() => onDelete(gradeItem)}
                className="icon-btn danger"
                title="Xóa"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl bg-slate-50 p-2.5">
              <p className="text-slate-400">Độ tuổi</p>
              <p className="mt-0.5 font-bold text-slate-700">
                {gradeItem.doTuoiBatDau} - {gradeItem.doTuoiKetThuc} tuổi
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-2.5">
              <p className="text-slate-400">Trạng thái</p>
              <p className="mt-0.5 font-bold text-emerald-600">
                Đang hoạt động
              </p>
            </div>
          </div>

          {gradeItem.moTa && (
            <p className="mt-3 line-clamp-2 text-xs text-slate-500">
              {gradeItem.moTa}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
