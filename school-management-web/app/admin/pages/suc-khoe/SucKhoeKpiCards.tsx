'use client'

import React from 'react'
import { Activity, AlertTriangle, CheckCircle2, HeartPulse, Ruler, Scale } from 'lucide-react'

interface SucKhoeKpiCardsProps {
  totalStudents: number
  measuredCount: number
  normalCount: number
  stuntedCount: number
  underweightCount: number
  overweightCount: number
}

export const SucKhoeKpiCards: React.FC<SucKhoeKpiCardsProps> = ({
  totalStudents,
  measuredCount,
  normalCount,
  stuntedCount,
  underweightCount,
  overweightCount,
}) => {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {/* Đã khám */}
      <div className="admin-card p-4 border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Activity size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đã đo sức khỏe</p>
            <p className="mt-1 text-2xl font-black text-slate-800">
              {measuredCount} <span className="text-xs font-bold text-slate-400">/ {totalStudents} bé</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bình thường theo chuẩn WHO */}
      <div className="admin-card p-4 border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/30">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Chuẩn WHO (Bình thường)</p>
            <p className="mt-1 text-2xl font-black text-emerald-900">{normalCount} bé</p>
          </div>
        </div>
      </div>

      {/* Thấp còi & Nhẹ cân */}
      <div className="admin-card p-4 border border-amber-100 bg-gradient-to-br from-white to-amber-50/30">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
            <Scale size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Thấp còi & Nhẹ cân</p>
            <p className="mt-1 text-2xl font-black text-amber-900">
              {stuntedCount + underweightCount} <span className="text-xs font-bold text-amber-600">(Thấp: {stuntedCount}, Nhẹ: {underweightCount})</span>
            </p>
          </div>
        </div>
      </div>

      {/* Thừa cân / Béo phì */}
      <div className="admin-card p-4 border border-rose-100 bg-gradient-to-br from-white to-rose-50/30">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl">
            <AlertTriangle size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-rose-700 uppercase tracking-wider">Thừa cân / Béo phì</p>
            <p className="mt-1 text-2xl font-black text-rose-900">{overweightCount} bé</p>
          </div>
        </div>
      </div>
    </div>
  )
}
