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

  const codeOrClass =
    item.description || item.className || (item.isSchoolWide ? "Toàn trường" : "");

  return (
    <div
      onClick={onClick}
      className={`group relative rounded-md p-2.5 transition cursor-pointer ${styleConfig.containerClass}`}
    >
      {/* Admin Action Buttons on Hover */}
      {userRole === "admin" && (onEdit || onDelete) && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-1.5 right-1.5 hidden group-hover:flex items-center gap-1 bg-white/90 backdrop-blur-xs rounded p-0.5 shadow-xs"
        >
          {onEdit && (
            <button
              onClick={() => onEdit(item)}
              className="p-1 text-slate-600 hover:text-sky-600 rounded"
              title="Chỉnh sửa lịch"
            >
              <Pencil size={11} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(item.id)}
              className="p-1 text-slate-600 hover:text-rose-600 rounded"
              title="Xóa lịch"
            >
              <Trash2 size={11} />
            </button>
          )}
        </div>
      )}

      {/* Badge if exam */}
      {styleConfig.badge && (
        <div className="mb-1">
          <span
            className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${styleConfig.badgeClass}`}
          >
            {styleConfig.badge}
          </span>
        </div>
      )}

      {/* Bold Subject / Activity Title */}
      <h4 className={styleConfig.titleClass}>{item.title}</h4>

      {/* Sub-details: Code/Class, Period, Room, Teacher */}
      <div className={`mt-1 space-y-0.5 ${styleConfig.textClass}`}>
        {codeOrClass && <p className="truncate">{codeOrClass}</p>}
        <p>{periodLabel}</p>
        {item.location && <p className="truncate">Địa điểm: {item.location}</p>}
        {teacherText && <p className="truncate">Phụ trách: {teacherText}</p>}
      </div>

      {/* Role-specific Action Hint */}
      {userRole === "teacher" && (
        <div className="mt-2 pt-1 border-t border-slate-900/10 flex items-center justify-between">
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
        <div className="mt-2 pt-1 border-t border-slate-900/10 flex items-center justify-between">
          <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-md shadow-2xs">
            🔍 Xem đánh giá hoạt động
          </span>
        </div>
      )}
    </div>
  );
}
export { TimetableCard };
