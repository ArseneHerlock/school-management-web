'use client';

import React from 'react';
import { Upload, Loader2, AlertCircle, CheckCircle2, Tag } from 'lucide-react';
import { MOMENT_CATEGORIES } from '@/lib/moments';
import { PostMomentHeader } from './post-moment/PostMomentHeader';
import { ScopeSelector } from './post-moment/ScopeSelector';
import { ChildSelectSection } from './post-moment/ChildSelectSection';
import { FileUploadSection } from './post-moment/FileUploadSection';
import { usePostMomentForm } from './post-moment/usePostMomentForm';
import { TeacherPostMomentModalProps } from './post-moment/types';

export type { TeacherPostMomentModalProps };

export default function TeacherPostMomentModal(props: TeacherPostMomentModalProps) {
  const { isOpen, onClose, defaultActivityTitle } = props;
  const {
    children,
    activities,
    activityId,
    setActivityId,
    activityTitle,
    setActivityTitle,
    activityDate,
    setActivityDate,
    scope,
    setScope,
    selectedChildIds,
    studentSearch,
    setStudentSearch,
    category,
    setCategory,
    teacherNote,
    setTeacherNote,
    files,
    isUploading,
    uploadProgressText,
    errorMessage,
    successMessage,
    filteredChildren,
    handleFileChange,
    removeFile,
    toggleSelectChild,
    selectAllChildren,
    clearAllChildren,
    handleSubmit,
    currentClassNameResolved,
  } = usePostMomentForm(props);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={isUploading ? undefined : onClose}
      />

      <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200">
        <PostMomentHeader
          activityTitle={activityTitle}
          activityDate={activityDate}
          currentClassNameResolved={currentClassNameResolved}
          isUploading={isUploading}
          onClose={onClose}
        />

        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-slate-700">
          {errorMessage && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-rose-800 font-bold flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-emerald-800 font-bold flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {!defaultActivityTitle && (
            <div className="space-y-1.5">
              <label className="font-black text-slate-800 flex items-center gap-1.5 text-xs">
                <Tag size={13} className="text-orange-500" />
                Hoạt động gắn liền
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <select
                  value={activityId}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    setActivityId(selectedId);
                    const act = activities.find((a) => a.id === selectedId);
                    if (act) setActivityTitle(act.name);
                  }}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-orange-500"
                >
                  <option value="">-- Chọn hoạt động từ danh mục --</option>
                  {activities.map((act) => (
                    <option key={act.id} value={act.id}>{act.name}</option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Hoặc nhập tên hoạt động tùy biến..."
                  value={activityTitle}
                  onChange={(e) => setActivityTitle(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-orange-500"
                />
              </div>
            </div>
          )}

          <ScopeSelector scope={scope} onSelectScope={setScope} />

          {scope === 'child' && (
            <ChildSelectSection
              childrenList={children}
              filteredChildren={filteredChildren}
              selectedChildIds={selectedChildIds}
              studentSearch={studentSearch}
              setStudentSearch={setStudentSearch}
              toggleSelectChild={toggleSelectChild}
              selectAllChildren={selectAllChildren}
              clearAllChildren={clearAllChildren}
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-black text-slate-800 text-xs">Chuyên mục hoạt động</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-orange-500"
              >
                {MOMENT_CATEGORIES.filter((c) => c !== 'Tất cả').map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-black text-slate-800 text-xs">Ngày ghi nhận khoảnh khắc</label>
              <input
                type="date"
                value={activityDate}
                onChange={(e) => setActivityDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <FileUploadSection
            files={files}
            isUploading={isUploading}
            handleFileChange={handleFileChange}
            removeFile={removeFile}
          />

          <div className="space-y-1">
            <label className="font-black text-slate-800 text-xs">
              Lời nhắn hoặc cảm nghĩ của cô (tùy chọn)
            </label>
            <textarea
              rows={2}
              placeholder="VD: Các con hôm nay rất hào hứng, biết chia sẻ đồ chơi và hoàn thành xuất sắc nhiệm vụ..."
              value={teacherNote}
              onChange={(e) => setTeacherNote(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-medium outline-none focus:border-orange-500"
            />
          </div>
        </div>

        <div className="border-t border-slate-100 bg-slate-50 px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 font-semibold">
            {isUploading && (
              <span className="flex items-center gap-1.5 text-orange-600 font-bold">
                <Loader2 size={13} className="animate-spin" />
                {uploadProgressText}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer disabled:opacity-50"
            >
              Hủy
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isUploading || files.length === 0}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black shadow-md shadow-orange-500/20 transition cursor-pointer disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Đang đăng tải...</span>
                </>
              ) : (
                <>
                  <Upload size={14} />
                  <span>Đăng khoảnh khắc ngay</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
