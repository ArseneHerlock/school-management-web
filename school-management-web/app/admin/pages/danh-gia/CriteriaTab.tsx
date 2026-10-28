'use client'

import React from 'react'
import { Plus, Edit2, Trash2, Check, Layers } from 'lucide-react'
import { DomainItem, CriterionItem } from '@/lib/development'

interface CriteriaTabProps {
  domains: DomainItem[]
  criteria: CriterionItem[]
  onOpenCreateDomain: () => void
  onOpenEditDomain: (d: DomainItem) => void
  onDeleteDomain: (d: DomainItem) => void
  onOpenCreateCriterion: () => void
  onOpenEditCriterion: (c: CriterionItem) => void
  onDeleteCriterion: (c: CriterionItem) => void
}

export default function CriteriaTab({
  domains,
  criteria,
  onOpenCreateDomain,
  onOpenEditDomain,
  onDeleteDomain,
  onOpenCreateCriterion,
  onOpenEditCriterion,
  onDeleteCriterion,
}: CriteriaTabProps) {
  return (
    <div className="space-y-8">
      {/* 1. Lĩnh vực phát triển */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-black text-slate-800">1. Lĩnh vực phát triển mầm non (Domains)</h3>
            <p className="text-xs text-slate-400">Thể chất, Nhận thức, Ngôn ngữ, Tình cảm - Xã hội, Thẩm mỹ...</p>
          </div>
          <button
            onClick={onOpenCreateDomain}
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
          >
            <Plus size={15} /> Thêm Lĩnh vực
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {domains.map((dom) => (
            <div key={dom.id} className="rounded-2xl border border-rose-100 bg-white p-4 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                    {dom.code}
                  </span>
                  <h4 className="mt-1 text-sm font-bold text-slate-800">{dom.name}</h4>
                  <p className="mt-1 text-xs text-slate-400 line-clamp-2">{dom.description || 'Không có mô tả'}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onOpenEditDomain(dom)}
                    className="p-1.5 text-slate-400 hover:text-slate-600"
                    title="Sửa"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => onDeleteDomain(dom)}
                    className="p-1.5 text-slate-400 hover:text-rose-600"
                    title="Xóa"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {domains.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-rose-200 bg-white p-8 text-center text-xs text-slate-400">
              Chưa có lĩnh vực phát triển nào
            </div>
          )}
        </div>
      </div>

      {/* 2. Tiêu chí phát triển */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-black text-slate-800">2. Ngân hàng Tiêu chí cụ thể (Criteria)</h3>
            <p className="text-xs text-slate-400">Các mục tiêu và chỉ số hành vi đánh giá trẻ</p>
          </div>
          <button
            onClick={onOpenCreateCriterion}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:from-rose-600 hover:to-rose-700 transition"
          >
            <Plus size={15} /> Thêm Tiêu chí
          </button>
        </div>

        <div className="rounded-3xl border border-rose-100 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-rose-100 bg-rose-50/30 text-slate-500 uppercase text-[10px] tracking-wider">
                  <th className="p-3.5">Mã</th>
                  <th className="p-3.5">Tên tiêu chí</th>
                  <th className="p-3.5">Lĩnh vực</th>
                  <th className="p-3.5">Mô tả chi tiết</th>
                  <th className="p-3.5 text-center">Trạng thái</th>
                  <th className="p-3.5 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50">
                {criteria.map((c) => {
                  const dom = domains.find((d) => d.id === c.developmentDomainId)
                  return (
                    <tr key={c.id} className="hover:bg-rose-50/20 transition">
                      <td className="p-3.5 font-bold text-rose-600">{c.code}</td>
                      <td className="p-3.5 font-semibold text-slate-800">{c.name}</td>
                      <td className="p-3.5 text-slate-500">
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                          {dom?.name || 'Chung'}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-500 max-w-sm truncate">{c.description || '-'}</td>
                      <td className="p-3.5 text-center">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          c.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {c.isActive ? 'Hoạt động' : 'Tạm dừng'}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onOpenEditCriterion(c)}
                            className="p-1.5 text-slate-400 hover:text-slate-600"
                            title="Sửa"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => onDeleteCriterion(c)}
                            className="p-1.5 text-slate-400 hover:text-rose-600"
                            title="Xóa"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {criteria.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      Chưa có tiêu chí nào trong ngân hàng
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
