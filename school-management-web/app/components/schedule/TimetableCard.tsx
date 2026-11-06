"use client";

import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { TimetableScheduleItem, CardStyleConfig, isEvaluableActivity } from "./types";

interface ScheduleCardProps {
  item: TimetableScheduleItem;
  periodLabel: string;
  styleConfig: CardStyleConfig;
  userRole: "admin" | "teacher" | "parent";
  onEdit?: (item: TimetableScheduleItem) => void;
  onDelete?: (id: string) => void;
  onClick: () => void;
}

export default function TimetableCard({
  item,
  periodLabel,
  styleConfig,
  userRole,
  onEdit,
  onDelete,
  onClick,
}: ScheduleCardProps) {
  const rawSubject = item.teachers?.[0]?.subject || "";
  const cleanSubject = rawSubject.startsWith("ACT:") ? "" : rawSubject;
  const teacherText =
    item.teacherName ||
    item.teachers?.[0]?.teacherId ||
    cleanSubject ||
    "";

  // Identify class scope badge
  const classLabel = item.isSchoolWide
    ? "Toàn trường"
    : item.className || (item.classId ? `Lớp ${item.classId.slice(0, 4)}` : "");

  return (
    <div
      onClick={onClick}
      className={`group relative rounded-lg p-2.5 transition-all duration-150 cursor-pointer border shadow-2xs hover:shadow-sm ${styleConfig.containerClass}`}
    >
      {/* Admin Action Buttons on Hover */}
      {userRole === "admin" && (onEdit || onDelete) && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-1.5 right-1.5 hidden group-hover:flex items-center gap-1 bg-white/95 backdrop-blur-xs rounded-md p-0.5 shadow-xs border border-slate-200 z-10"
        >
          {onEdit && (
            <button
              onClick={() => onEdit(item)}
              className="p-1 text-slate-600 hover:text-sky-600 rounded transition cursor-pointer"
              title="Chỉnh sửa lịch"
            >
              <Pencil size={11} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(item.id)}
              className="p-1 text-slate-600 hover:text-rose-600 rounded transition cursor-pointer"
              title="Xóa lịch"
            >
              <Trash2 size={11} />
            </button>
          )}
        </div>
      )}

      {/* Badges: Activity Type & Class Scope */}
      <div className="flex flex-wrap items-center gap-1 mb-1.5">
        {styleConfig.badge && (
          <span
            className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${styleConfig.badgeClass}`}
          >
            {styleConfig.badge}
          </span>
        )}
        {classLabel && (
          <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-700 border border-slate-200 truncate max-w-[120px]">
            {classLabel}
          </span>
        )}
      </div>

      {/* Bold Subject / Activity Title */}
      <h4 className={`${styleConfig.titleClass} font-bold text-xs leading-snug line-clamp-2`}>
        {item.title}
      </h4>

      {/* Sub-details: Time, Room, Teacher */}
      <div className={`mt-1.5 space-y-0.5 ${styleConfig.textClass} text-[11px]`}>
        <p className="font-semibold text-slate-700 flex items-center gap-1">
          <span>⏰</span> {periodLabel}
        </p>
        {item.location && (
          <p className="truncate text-slate-500" title={item.location}>
            📍 {item.location}
          </p>
        )}
        {teacherText && (
          <p className="truncate text-slate-500" title={teacherText}>
            👤 {teacherText}
          </p>
        )}
        {item.description && (
          <p className="truncate text-[10px] text-slate-400 italic" title={item.description}>
            💬 {item.description}
          </p>
        )}
      </div>

      {/* Role-specific Action Hint */}
      {userRole === "teacher" && (
        <div className="mt-2 pt-1.5 border-t border-slate-900/10 flex items-center justify-between">
          {isEvaluableActivity(item) ? (
            <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-md shadow-2xs group-hover:bg-rose-200 transition">
              📝 Đánh giá hoạt động →
            </span>
          ) : (
            <span className="text-[10px] font-medium text-slate-500">
              ⏰ Sinh hoạt hàng ngày
            </span>
          )}
        </div>
      )}

      {userRole === "parent" && isEvaluableActivity(item) && (
        <div className="mt-2 pt-1.5 border-t border-slate-900/10 flex items-center justify-between">
          <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-md shadow-2xs">
            🔍 Xem đánh giá hoạt động
          </span>
        </div>
      )}
    </div>
  );
}
export { TimetableCard };