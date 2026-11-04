"use client";

import React from "react";
import { Calendar, Edit2, Trash2, Newspaper } from "lucide-react";

interface NewsListItemCardProps {
  item: any;
  idx: number;
  isAdmin: boolean;
  formatNewsDate: (dateStr?: string) => string;
  onView: (id: string) => void;
  onEdit: (item: any, e: React.MouseEvent) => void;
  onDelete: (item: any, e: React.MouseEvent) => void;
}

export default function NewsListItemCard({
  item,
  idx,
  isAdmin,
  formatNewsDate,
  onView,
  onEdit,
  onDelete,
}: NewsListItemCardProps) {
  const dateStr = formatNewsDate(item.ngayTao || item.ngayXuatBan);
  const hasRealImage = Boolean(
    item.hinhAnh && !item.hinhAnh.includes("unsplash.com")
  );

  return (
    <article
      onClick={() => onView(item.id)}
      className={`group flex flex-col md:flex-row items-start gap-5 p-3 rounded-2xl hover:bg-slate-50/80 transition cursor-pointer border border-transparent hover:border-slate-200 ${
        idx > 0 ? "pt-6" : ""
      }`}
    >
      {/* Left Thumbnail or Badge */}
      {hasRealImage ? (
        <div className="w-full md:w-64 h-48 md:h-40 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-2xs">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.hinhAnh}
            alt={item.tieuDe}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      ) : (
        <div className="w-full md:w-52 h-32 md:h-36 shrink-0 rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-blue-50 flex flex-col items-center justify-center text-sky-600 gap-2 p-3 text-center transition group-hover:bg-blue-100/50 shadow-2xs">
          <Newspaper size={32} />
          <span className="text-xs font-bold text-sky-800 line-clamp-1">
            Bản tin trường
          </span>
        </div>
      )}

      {/* Right Content */}
      <div className="flex-1 min-w-0 space-y-2">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug">
          {item.tieuDe}
          {idx < 2 && (
            <span className="inline-block ml-2 px-2 py-0.5 rounded-full bg-[#f59e0b] text-[10px] font-black text-white uppercase tracking-wider align-middle">
              new
            </span>
          )}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Calendar size={13} className="text-slate-400" />
          <span>{dateStr || "Mới phát hành"}</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed pt-0.5">
          {item.tomTat || item.noiDung || "Nhấn để xem chi tiết bài viết..."}
        </p>

        {isAdmin && (
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={(e) => onEdit(item, e)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition cursor-pointer"
            >
              <Edit2 size={12} />
              <span>Sửa</span>
            </button>
            <button
              onClick={(e) => onDelete(item, e)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition cursor-pointer"
            >
              <Trash2 size={12} />
              <span>Xóa</span>
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
export { NewsListItemCard };
