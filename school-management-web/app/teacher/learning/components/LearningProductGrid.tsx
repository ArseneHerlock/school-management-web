'use client'

import React from 'react'
import { BookOpenCheck, Loader2, Users, Sparkles, Calendar, Trash2 } from 'lucide-react'
import { getMediaUrl } from '@/lib/api'
import { Child } from '../../data'
import { cleanDescription, extractCategory } from './types'

interface LearningProductGridProps {
  activeTab: 'class' | 'child'
  className: string
  children: Child[]
  filterChildId: string
  setFilterChildId: (id: string) => void
  displayedMoments: any[]
  childMoments: any[]
  busy: boolean
  studentApiIdMap: Map<string, string>
  onDelete: (id: string) => Promise<void>
}

export const LearningProductGrid: React.FC<LearningProductGridProps> = ({
  activeTab,
  className,
  children,
  filterChildId,
  setFilterChildId,
  displayedMoments,
  childMoments,
  busy,
  studentApiIdMap,
  onDelete,
}) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-black text-slate-800">
            {activeTab === 'class'
              ? `Khoảnh khắc lớp ${className} (${displayedMoments.length})`
              : `Khoảnh khắc riêng các bé (${displayedMoments.length})`}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeTab === 'class'
              ? 'Các hình ảnh và video đang hiển thị cho toàn bộ phụ huynh của lớp xem'
              : 'Chỉ phụ huynh của từng bé tương ứng mới nhìn thấy sản phẩm của bé đó'}
          </p>
        </div>

        {activeTab === 'child' && children.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Lọc theo bé:</span>
            <select
              value={filterChildId}
              onChange={(e) => setFilterChildId(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold outline-none focus:border-indigo-500"
            >
              <option value="ALL">Tất cả các bé ({childMoments.length})</option>
              {children.map((c) => {
                const id = String(c.apiId || c.id)
                const count = childMoments.filter((x) => String(x.childId) === id).length
                return (
                  <option key={id} value={id}>
                    {c.name} ({count})
                  </option>
                )
              })}
            </select>
          </div>
        )}
      </div>

      {busy ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-orange-500" size={32} />
          <p className="mt-3 text-xs font-bold text-slate-400">Đang tải danh sách khoảnh khắc...</p>
        </div>
      ) : displayedMoments.length === 0 ? (
        <div className="py-20 text-center">
          <BookOpenCheck className="mx-auto mb-3 text-slate-300" size={44} />
          <p className="text-base font-bold text-slate-700">
            {activeTab === 'class'
              ? `Chưa có khoảnh khắc chung nào của ${className}`
              : 'Chưa có khoảnh khắc riêng nào của bé được đăng'}
          </p>
          <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
            Hãy sử dụng biểu mẫu bên trái để tải lên hình ảnh hoặc video hoạt động đầu tiên.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {displayedMoments.map((item: any) => {
            const rawMediaUrl = item.mediaId
              ? getMediaUrl(item.mediaId)
              : item.url
              ? getMediaUrl(item.url)
              : ''
            const mediaUrl = rawMediaUrl && !rawMediaUrl.includes('unsplash.com') ? rawMediaUrl : ''

            const rawDesc = String(item.description || '')
            const cleanDesc = cleanDescription(rawDesc)
            const itemCategory = extractCategory(rawDesc)
            const studentName = studentApiIdMap.get(String(item.childId))

            return (
              <div
                key={item.id}
                className="group rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden flex items-center justify-center">
                    {mediaUrl ? (
                      <img
                        src={mediaUrl}
                        alt={item.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center text-orange-400">
                        <Sparkles size={32} />
                      </div>
                    )}

                    <span
                      className={`absolute top-2.5 left-2.5 flex items-center gap-1 rounded-xl px-2.5 py-1 text-[10px] font-extrabold text-white backdrop-blur-md ${
                        activeTab === 'class' ? 'bg-orange-600/90' : 'bg-indigo-600/90'
                      }`}
                    >
                      {activeTab === 'class' ? <Users size={11} /> : <Sparkles size={11} />}
                      <span>{activeTab === 'class' ? className : studentName ? `Bé ${studentName}` : 'Của bé'}</span>
                    </span>

                    <span className="absolute top-2.5 right-2.5 rounded-xl bg-white/95 px-2 py-0.5 text-[10px] font-black text-slate-800 shadow-sm">
                      {itemCategory}
                    </span>
                  </div>

                  <div className="p-4 space-y-1.5">
                    <h3 className="font-black text-sm text-slate-800 line-clamp-1">{item.title}</h3>
                    {cleanDesc && <p className="text-xs text-slate-500 line-clamp-2">{cleanDesc}</p>}
                  </div>
                </div>

                <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {String(item.createdAtUtc || '').slice(0, 10) || new Date().toISOString().slice(0, 10)}
                  </span>

                  <button
                    type="button"
                    onClick={() => void onDelete(item.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition cursor-pointer"
                    title="Xóa khoảnh khắc này"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
