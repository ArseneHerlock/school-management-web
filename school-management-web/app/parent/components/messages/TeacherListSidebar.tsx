'use client'

import React from 'react'
import { UserRound, Search, Loader2, ChevronRight } from 'lucide-react'
import { Teacher, initials } from './types'

interface TeacherListSidebarProps {
  teachers: Teacher[]
  filtered: Teacher[]
  search: string
  setSearch: (s: string) => void
  loading: boolean
  selectedTeacher: Teacher | null
  totalChildren: number
  onSelectTeacher: (t: Teacher) => void
}

export const TeacherListSidebar: React.FC<TeacherListSidebarProps> = ({
  teachers,
  filtered,
  search,
  setSearch,
  loading,
  selectedTeacher,
  totalChildren,
  onSelectTeacher,
}) => {
  return (
    <aside className="flex min-h-0 min-w-0 flex-col border-b border-slate-100 bg-[#fbfcff] md:border-b-0 md:border-r">
      <div className="shrink-0 border-b border-slate-100 p-4">
        <div className="flex items-center gap-2">
          <UserRound size={18} className="text-indigo-500" />
          <div>
            <p className="text-sm font-extrabold text-slate-800">Giáo viên chủ nhiệm</p>
            <p className="mt-1 text-[11px] text-slate-400">
              {teachers.length} giáo viên của {totalChildren} con
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
          <Search size={16} className="text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm giáo viên, lớp, tên con..."
            className="min-w-0 flex-1 bg-transparent text-xs outline-none"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
        {loading ? (
          <div className="flex justify-center py-14">
            <Loader2 className="animate-spin text-indigo-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-xs leading-5 text-slate-400">
            Chưa tìm thấy giáo viên chủ nhiệm của các con.
          </div>
        ) : (
          filtered.map((t) => (
            <button
              key={t.accountId || t.name}
              onClick={() => onSelectTeacher(t)}
              className={`group flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition hover:border-indigo-300 hover:shadow-sm cursor-pointer ${
                selectedTeacher?.accountId === t.accountId && selectedTeacher?.name === t.name
                  ? 'border-indigo-400 bg-indigo-50'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-extrabold text-white">
                {initials(t.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-extrabold text-slate-800">{t.name}</p>
                <p className="mt-1 truncate text-[11px] font-bold text-indigo-600">
                  {t.classes.join(', ') || 'Chưa cập nhật lớp'}
                </p>
                <p className="mt-1 truncate text-[10px] text-slate-400">{t.children.join(', ')}</p>
              </div>
              <ChevronRight size={16} className="shrink-0 text-slate-300 group-hover:text-indigo-500" />
            </button>
          ))
        )}
      </div>
    </aside>
  )
}
