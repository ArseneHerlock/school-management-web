'use client'

import React from 'react'
import { Upload, Loader2, Plus, Users, Sparkles, X } from 'lucide-react'
import { Child } from '../../data'
import { CATEGORIES } from './types'

interface LearningProductFormProps {
  activeTab: 'class' | 'child'
  className: string
  children: Child[]
  selectedChildId: string
  setSelectedChildId: (id: string) => void
  title: string
  setTitle: (t: string) => void
  description: string
  setDescription: (d: string) => void
  category: string
  setCategory: (c: string) => void
  mediaPreview: string
  uploadingMedia: boolean
  submitting: boolean
  onFileUpload: (file: File) => Promise<void>
  onClearMedia: () => void
  onSubmit: () => Promise<void>
  disabled: boolean
}

export const LearningProductForm: React.FC<LearningProductFormProps> = ({
  activeTab,
  className,
  children,
  selectedChildId,
  setSelectedChildId,
  title,
  setTitle,
  description,
  setDescription,
  category,
  setCategory,
  mediaPreview,
  uploadingMedia,
  submitting,
  onFileUpload,
  onClearMedia,
  onSubmit,
  disabled,
}) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 h-fit">
      <div className="border-b border-slate-100 pb-3">
        <span
          className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
            activeTab === 'class' ? 'bg-orange-100 text-orange-700' : 'bg-indigo-100 text-indigo-700'
          }`}
        >
          {activeTab === 'class' ? 'ĐĂNG ẢNH LỚP' : 'ĐĂNG ẢNH BÉ'}
        </span>
        <h2 className="text-lg font-black text-slate-800 mt-1">
          {activeTab === 'class' ? 'Thêm khoảnh khắc lớp' : 'Thêm khoảnh khắc cho bé'}
        </h2>
      </div>

      <div
        className={`p-3.5 rounded-2xl text-xs flex items-start gap-2.5 ${
          activeTab === 'class'
            ? 'bg-orange-50 text-orange-800 border border-orange-100'
            : 'bg-indigo-50 text-indigo-800 border border-indigo-100'
        }`}
      >
        {activeTab === 'class' ? (
          <Users size={16} className="shrink-0 mt-0.5 text-orange-600" />
        ) : (
          <Sparkles size={16} className="shrink-0 mt-0.5 text-indigo-600" />
        )}
        <div>
          {activeTab === 'class' ? (
            <span>
              Khoảnh khắc này sẽ được lưu cho <b>{className}</b>. Toàn thể phụ huynh của lớp có thể xem chung.
            </span>
          ) : (
            <span>
              Khoảnh khắc này là <b>riêng tư</b>. Chỉ phụ huynh của học sinh được chọn mới có thể xem được trong mục &quot;Khoảnh khắc con mình&quot;.
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3.5">
        {activeTab === 'child' && (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Chọn học sinh <span className="text-rose-500">*</span>
            </label>
            <select
              className="w-full rounded-2xl border border-slate-200 p-3 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              value={selectedChildId}
              onChange={(e) => setSelectedChildId(e.target.value)}
            >
              <option value="">-- Chọn bé trong lớp ({children.length} học sinh) --</option>
              {children.map((c) => {
                const id = String(c.apiId || c.id)
                return (
                  <option key={id} value={id}>
                    {c.name} {c.dob ? `(${c.dob})` : ''}
                  </option>
                )
              })}
            </select>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Tiêu đề hoạt động <span className="text-rose-500">*</span>
          </label>
          <input
            className="w-full rounded-2xl border border-slate-200 p-3 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="VD: Giờ học tô màu, Thể dục sáng, Hoạt động góc..."
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Chuyên mục hoạt động
          </label>
          <select
            className="w-full rounded-2xl border border-slate-200 p-3 text-sm font-semibold outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Ghi chú / Lời dặn cô giáo
          </label>
          <textarea
            className="w-full min-h-20 rounded-2xl border border-slate-200 p-3 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nhập cảm nghĩ, nhận xét hoặc mô tả về hoạt động của các bé..."
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Ảnh / Video hoạt động <span className="text-rose-500">*</span>
          </label>

          {mediaPreview ? (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 h-44 mb-2 group">
              <img src={mediaPreview} alt="Preview" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={onClearMedia}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 cursor-pointer shadow-md"
                title="Xóa ảnh này"
              >
                <X size={14} />
              </button>
              <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/60 text-white text-[11px] font-bold">
                ✓ Đã tải lên
              </div>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl p-5 hover:bg-slate-50 cursor-pointer transition-colors text-center">
              {uploadingMedia ? (
                <div className="flex flex-col items-center py-2">
                  <Loader2 className="animate-spin text-orange-500 mb-2" size={24} />
                  <span className="text-xs font-bold text-slate-500">Đang tải file lên máy chủ...</span>
                </div>
              ) : (
                <>
                  <div className="p-3 rounded-full bg-orange-50 text-orange-500 mb-2">
                    <Upload size={20} />
                  </div>
                  <span className="text-xs font-bold text-slate-700">Nhấn để chọn ảnh hoặc video</span>
                  <span className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, MP4 lên tới 100MB</span>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) void onFileUpload(f)
                    }}
                  />
                </>
              )}
            </label>
          )}
        </div>

        <button
          disabled={disabled || submitting || uploadingMedia}
          onClick={() => void onSubmit()}
          className={`w-full flex items-center justify-center gap-2 rounded-2xl p-3.5 text-sm font-bold text-white shadow-md transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
            activeTab === 'class'
              ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20'
              : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
          }`}
        >
          {submitting ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              <span>Đang lưu...</span>
            </>
          ) : (
            <>
              <Plus size={16} />
              <span>
                {activeTab === 'class' ? 'Đăng khoảnh khắc lớp' : 'Lưu khoảnh khắc cho bé'}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
