'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileText,
  RotateCcw,
  Check,
  Share2,
  BookmarkCheck,
  Loader2,
} from 'lucide-react';

interface TeacherCommentEditorProps {
  childDisplayName: string;
  month: number;
  year: number;
  comment: string;
  setComment: (val: string) => void;
  parentFeedback: string;
  isDelivered: boolean;
  saving: boolean;
  onToggleDeliver: () => void;
  onSaveComment: () => void;
}

export function TeacherCommentEditor({
  childDisplayName,
  month,
  year,
  comment,
  setComment,
  parentFeedback,
  isDelivered,
  saving,
  onToggleDeliver,
  onSaveComment,
}: TeacherCommentEditorProps) {
  return (
    <div className="lg:col-span-7 space-y-4 rounded-3xl border border-amber-200/80 bg-white p-5 sm:p-6 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
            SOẠN THẢO SỔ BÉ NGOAN THÁNG {month}/{year}
          </span>
          <h2 className="mt-1.5 text-base sm:text-lg font-black text-slate-800 flex items-center gap-2">
            <FileText size={18} className="text-amber-500 shrink-0" />
            <span>Nội dung nhận xét Sổ Bé Ngoan của {childDisplayName}</span>
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-400">
            {comment.length} ký tự
          </span>
          {comment.trim().length > 0 && (
            <button
              type="button"
              onClick={() => setComment('')}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Xóa trắng</span>
            </button>
          )}
        </div>
      </div>

      <textarea
        rows={14}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={`Nhấn nút "Tổng hợp tất cả đánh giá & nhận xét hoạt động" ở cột bên trái, chọn "Đưa vào sổ" từ từng hoạt động, hoặc trực tiếp viết nhận xét tháng ${month}/${year} cho bé ${childDisplayName} tại đây...`}
        className="w-full min-h-[320px] sm:min-h-[420px] rounded-2xl border-2 border-amber-200/90 bg-amber-50/10 p-4 text-sm sm:text-base font-medium text-slate-800 leading-relaxed outline-none focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-100 transition"
      />

      {parentFeedback && (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4">
          <p className="text-xs font-black uppercase tracking-wider text-indigo-900">
            Ý kiến phản hồi từ Phụ huynh:
          </p>
          <p className="mt-1 text-sm text-slate-700 italic">“{parentFeedback}”</p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
        <Link
          href={`/teacher/good-child?month=${month}&year=${year}`}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
        >
          Quay lại danh sách lớp
        </Link>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onToggleDeliver}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-extrabold transition cursor-pointer ${
              isDelivered
                ? 'border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                : 'border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            {isDelivered ? (
              <>
                <Check size={14} />
                <span>Đã giao PH</span>
              </>
            ) : (
              <>
                <Share2 size={14} />
                <span>Giao sổ cho PH</span>
              </>
            )}
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={onSaveComment}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-black text-white shadow-md shadow-amber-500/20 hover:bg-amber-600 disabled:opacity-50 transition cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <BookmarkCheck size={16} />
                <span>Lưu nhận xét Sổ Bé Ngoan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
