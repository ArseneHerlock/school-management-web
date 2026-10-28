'use client'

import { useEffect, useState } from 'react'
import { Activity, HeartPulse, Scale, Ruler, Inbox, Loader2 } from 'lucide-react'
import { getHealthRecords } from '@/services/health'
import { ChildInfo } from '../types'

interface HealthRecord {
  id: string
  ngayKiemTra?: string
  chieuCao?: number
  canNang?: number
  bmi?: number
  ghiChu?: string
}

export default function ProgressTab({ child }: { child: ChildInfo }) {
  const [records, setRecords] = useState<HealthRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!child.id) {
      setLoading(false)
      return
    }
    setLoading(true)
    getHealthRecords(child.id)
      .then((data) => setRecords(Array.isArray(data) ? (data as unknown as HealthRecord[]) : []))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false))
  }, [child.id])

  const latest = records[0]

  return (
    <section className="space-y-5">
      <div className="card-frame p-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-800">Học Tập & Phát Triển Trẻ</h2>
          <p className="mt-1 text-xs text-slate-500">
            {child.hoTen ? `Theo dõi chỉ số tăng trưởng và sức khỏe của bé ${child.hoTen}` : 'Theo dõi chỉ số tăng trưởng của bé'}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <Activity size={20} />
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-sky-100 bg-sky-50/50 p-4">
          <div className="flex items-center gap-2 text-sky-600 text-xs font-bold uppercase tracking-wider">
            <Ruler size={16} />
            <span>Chiều cao</span>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-800">
            {latest?.chieuCao ? `${latest.chieuCao} cm` : 'Chưa có'}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">Cập nhật gần nhất</p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider">
            <Scale size={16} />
            <span>Cân nặng</span>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-800">
            {latest?.canNang ? `${latest.canNang} kg` : 'Chưa có'}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">Cập nhật gần nhất</p>
        </div>

        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4">
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
            <HeartPulse size={16} />
            <span>Chỉ số BMI</span>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-800">
            {latest?.bmi ? latest.bmi.toFixed(1) : 'Chưa có'}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">Chỉ số thể trạng</p>
        </div>
      </div>

      {/* Health History List */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 mb-4">Lịch sử khám & đo sức khỏe định kỳ</h3>

        {loading ? (
          <div className="py-10 text-center text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" size={18} />
            <span className="text-xs">Đang tải lịch sử sức khỏe...</span>
          </div>
        ) : records.length === 0 ? (
          <div className="rounded-xl bg-slate-50 p-8 text-center text-slate-400">
            <Inbox size={36} className="mx-auto mb-2 text-slate-300" />
            <p className="text-xs font-semibold text-slate-600">Chưa có bản ghi sức khỏe từ nhà trường</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Dữ liệu kiểm tra thể lực định kỳ của học sinh sẽ hiển thị ở đây.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {records.map((r, idx) => (
              <div key={r.id || idx} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-700">{r.ngayKiemTra ? new Date(r.ngayKiemTra).toLocaleDateString('vi-VN') : `Đợt kiểm tra ${idx + 1}`}</p>
                  <p className="text-slate-400 mt-0.5">{r.ghiChu || 'Kiểm tra sức khỏe thể lực'}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-800">{r.chieuCao ? `${r.chieuCao}cm` : '—'}</span> · <span className="font-bold text-slate-800">{r.canNang ? `${r.canNang}kg` : '—'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
