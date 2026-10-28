'use client'

import React from 'react'
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react'

interface AssessmentCriteriaListProps {
  domainBreakdown: any[]
  selectedDomainId: string
  setSelectedDomainId: (id: string) => void
}

export default function AssessmentCriteriaList({
  domainBreakdown,
  selectedDomainId,
  setSelectedDomainId,
}: AssessmentCriteriaListProps) {
  const displayedDomains = selectedDomainId === 'ALL'
    ? domainBreakdown
    : domainBreakdown.filter((d) => d.id === selectedDomainId)

  return (
    <div className="space-y-4">
      {/* Selector Lĩnh vực */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-white rounded-3xl border border-rose-100 shadow-xs">
        <button
          onClick={() => setSelectedDomainId('ALL')}
          className={`rounded-2xl px-3.5 py-1.5 text-xs font-bold transition ${
            selectedDomainId === 'ALL' ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-xs' : 'text-slate-600 hover:bg-rose-50'
          }`}
        >
          Tất cả lĩnh vực
        </button>
        {domainBreakdown.map((dom) => (
          <button
            key={dom.id}
            onClick={() => setSelectedDomainId(dom.id)}
            className={`rounded-2xl px-3.5 py-1.5 text-xs font-bold transition ${
              selectedDomainId === dom.id ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-xs' : 'text-slate-600 hover:bg-rose-50'
            }`}
          >
            {dom.name} ({dom.domainScore}%)
          </button>
        ))}
      </div>

      {/* Danh sách tiêu chí theo nhóm lĩnh vực */}
      <div className="space-y-4">
        {displayedDomains.map((dom) => (
          <div key={dom.id} className="rounded-3xl border border-rose-100 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-rose-50 pb-3">
              <div>
                <h4 className="text-sm font-black text-slate-800">{dom.name}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{dom.description || 'Chỉ số đánh giá sự phát triển'}</p>
              </div>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-black text-rose-600">
                {dom.domainScore}% Đạt chuẩn
              </span>
            </div>

            <div className="mt-3 divide-y divide-rose-50">
              {dom.criteriaDetails.map((item: any) => {
                const isAssessed = item.count > 0
                const isMastered = item.score >= 50
                return (
                  <div key={item.criterion.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs text-slate-800 truncate">{item.criterion.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{item.criterion.description || 'Tiêu chí chuẩn mầm non'}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {isAssessed ? (
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          isMastered ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {isMastered ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          {isMastered ? 'Đạt chuẩn' : 'Cần rèn luyện'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-500">
                          <HelpCircle size={12} /> Chưa quan sát
                        </span>
                      )}
                      <span className="text-xs font-black text-slate-700 w-12 text-right">
                        {item.score}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
