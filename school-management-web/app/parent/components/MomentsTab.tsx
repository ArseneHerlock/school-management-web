'use client'

import { useState, useEffect, useMemo } from 'react'
import { Camera, Inbox, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { getMediaUrl } from '@/lib/api'
import { getAllLearningProducts } from '@/services/learning'
import { MomentItem, ChildInfo } from '../types'
import { MediaItem, CATEGORIES, cleanDescription, extractCategory } from './moments/types'
import { MomentsScopeSelector } from './moments/MomentsScopeSelector'
import { MomentCard } from './moments/MomentCard'
import { MomentLightbox } from './moments/MomentLightbox'

interface MomentsTabProps {
  child?: ChildInfo | any
  moments?: any[]
  onSelectMoment?: (m: MomentItem | any) => void
  onToggleLike?: (id: string) => void
}

export default function MomentsTab({ child }: MomentsTabProps = {}) {
  const [activeScope, setActiveScope] = useState<'class' | 'child'>('class')
  const [classMoments, setClassMoments] = useState<MediaItem[]>([])
  const [childMoments, setChildMoments] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('Tất cả')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  useEffect(() => {
    let isMounted = true
    const loadMoments = async () => {
      setLoading(true)
      const childId = child?.id || child?.childId || child?.hocSinhId || ''
      const classId = child?.classId || child?.lopId || ''
      const className = (child?.lop || child?.className || child?.tenLop || '').trim().toLowerCase()

      try {
        const res = await getAllLearningProducts(100).catch(() => null)
        const fetchedItems = Array.isArray(res) ? res : []

        const mapped: MediaItem[] = fetchedItems.map((item: any) => {
          const rawDesc = String(item.description || '')
          const mediaId = item.mediaId || item.MediaId || ''
          const rawUrl = mediaId
            ? getMediaUrl(mediaId)
            : item.url
            ? getMediaUrl(item.url)
            : ''
          const mediaUrl = rawUrl && !rawUrl.includes('unsplash.com') ? rawUrl : ''

          const isClassTag = rawDesc.includes('[CLASS:')
          const itemClassMatch = rawDesc.match(/\[CLASS:([^\]]+)\]/i)
          const itemClassData = itemClassMatch ? itemClassMatch[1].split(':') : []
          const itemClassId = itemClassData[0] || (classId && item.childId === classId ? classId : '')
          const itemClassName = (itemClassData[1] || '').trim().toLowerCase()
          const scope: 'class' | 'child' = isClassTag || (classId && item.childId === classId) ? 'class' : 'child'

          const category = extractCategory(rawDesc);
          let rawTitle = String(item.title || item.tieuDe || '').trim();
          if (!rawTitle || /^\d{6,}$/.test(rawTitle) || /^(IMG|VID|image|photo|upload)[_\d-]+$/i.test(rawTitle)) {
            const dateStr = String(item.createdAtUtc || item.date || '').slice(0, 10);
            rawTitle = `${category !== 'Tất cả' ? category : 'Khoảnh khắc lớp'}${dateStr ? ` (${dateStr})` : ''}`;
          }

          return {
            id: String(item.id || ''),
            url: mediaUrl,
            title: rawTitle,
            description: cleanDescription(rawDesc),
            date: String(item.createdAtUtc || item.date || '').slice(0, 10),
            type: rawDesc.toLowerCase().includes('video') ? 'video' : 'image',
            category,
            scope,
            childId: String(item.childId || ''),
            classId: itemClassId,
            likes: Number(item.likes || 0),
            isLiked: false,
            _rawDesc: rawDesc,
            _itemClassName: itemClassName,
          } as any
        })

        if (!isMounted) return

        const filteredClass = mapped.filter((m: any) => {
          if (m.scope !== 'class') return false
          if (classId && m.classId && m.classId === classId) return true
          if (classId && m.childId === classId) return true
          if (className && m._itemClassName && m._itemClassName.includes(className)) return true
          if (className && m._rawDesc && m._rawDesc.toLowerCase().includes(className)) return true
          return false
        })

        const filteredChild = mapped.filter((m: any) => {
          if (m.scope === 'class') return false
          if (childId && m.childId === childId) return true
          if (childId && m._rawDesc && m._rawDesc.includes(`[CHILD:${childId}]`)) return true
          return false
        })

        setClassMoments(filteredClass)
        setChildMoments(filteredChild)
      } catch {
        if (isMounted) {
          setClassMoments([])
          setChildMoments([])
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    void loadMoments()
    return () => {
      isMounted = false
    }
  }, [child])

  const currentMoments = activeScope === 'class' ? classMoments : childMoments

  const filtered = useMemo(() => {
    return currentMoments.filter(
      (m) => selectedCategory === 'Tất cả' || m.category === selectedCategory
    )
  }, [currentMoments, selectedCategory])

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated = useMemo(() => {
    return filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  }, [filtered, currentPage, itemsPerPage])

  const toggleLike = (id: string) => {
    const updater = (prev: MediaItem[]) =>
      prev.map((m) => {
        if (m.id === id) {
          const isLiked = !m.isLiked
          const likes = m.likes + (isLiked ? 1 : -1)
          return { ...m, isLiked, likes }
        }
        return m
      })

    if (activeScope === 'class') {
      setClassMoments(updater)
    } else {
      setChildMoments(updater)
    }
  }

  const currentItem = paginated[lightboxIndex] || null

  return (
    <section className="space-y-4 sm:space-y-6">
      <div className="card-frame p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 border-sky-100 rounded-2xl sm:rounded-3xl">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-600 bg-sky-100/80 px-2 py-0.5 rounded-full">
            KHOẢNH KHẮC TRẺ TẠI TRƯỜNG
          </span>
          <h2 className="text-base sm:text-xl font-black text-slate-800 mt-1">
            Nhật Ký Hoạt Động & Album Ảnh
          </h2>
          <p className="mt-0.5 text-[11px] sm:text-xs text-slate-500">
            Xem lại hình ảnh, video vui chơi và sản phẩm học tập của bé {child?.hoTen ? `(${child.hoTen})` : ''} - {child?.lop || 'Lớp của bé'}
          </p>
        </div>
        <div className="hidden sm:flex h-11 w-11 items-center justify-center rounded-xl bg-white text-sky-600 shadow-xs border border-sky-100 shrink-0">
          <Camera size={22} />
        </div>
      </div>

      <MomentsScopeSelector
        activeScope={activeScope}
        onSelectScope={(scope) => {
          setActiveScope(scope)
          setCurrentPage(1)
          setSelectedCategory('Tất cả')
        }}
        classMomentsCount={classMoments.length}
        childMomentsCount={childMoments.length}
        className={child?.lop}
        childName={child?.hoTen}
      />

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const count = cat === 'Tất cả' ? currentMoments.length : currentMoments.filter((m) => m.category === cat).length
          const isSelected = selectedCategory === cat
          return (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat)
                setCurrentPage(1)
              }}
              className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? activeScope === 'class'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat} ({count})
            </button>
          )
        })}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-3xl bg-white py-16 border border-slate-100">
          <Loader2 className="animate-spin text-indigo-500" size={32} />
          <p className="mt-3 text-xs font-bold text-slate-400">Đang đồng bộ album hoạt động...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
          <Inbox size={44} className="mx-auto text-slate-300 mb-3" />
          <p className="text-base font-bold text-slate-700">
            {activeScope === 'class'
              ? `Chưa có khoảnh khắc nào của ${child?.lop || 'lớp'}`
              : `Chưa có khoảnh khắc riêng nào của bé ${child?.hoTen || ''}`}
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            {activeScope === 'class'
              ? 'Hình ảnh và hoạt động tập thể do giáo viên phụ trách lớp tải lên sẽ tự động hiển thị tại đây.'
              : 'Các sản phẩm và hình ảnh học tập riêng của bé do cô giáo gửi riêng cho bạn sẽ hiển thị tại đây.'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginated.map((item, idx) => (
              <MomentCard
                key={item.id}
                item={item}
                onOpenLightbox={() => {
                  setLightboxIndex(idx)
                  setLightboxOpen(true)
                }}
                onToggleLike={toggleLike}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs font-bold text-slate-500 px-3">
                Trang {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}

      <MomentLightbox
        item={currentItem}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </section>
  )
}
