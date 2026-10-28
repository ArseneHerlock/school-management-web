'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  Award,
  CalendarDays,
  CheckCircle2,
  Circle,
  Flower2,
  Loader2,
  MessageCircle,
  RefreshCw,
  Send,
  Sparkles,
  Star,
  Trophy,
  Lock,
  Clock,
} from 'lucide-react'
import { getGoodChildRecords, updateParentFeedback } from '@/services/learning'
import { ChildInfo } from '../types'
import { isGoodChildDelivered } from '@/services/schedule'

const list = (value: any) => Array.isArray(value) ? value : Array.isArray(value?.items) ? value.items : []
const flowers = (record: any) => Array.isArray(record?.flowers) ? record.flowers : []
const activeFlowers = (record: any) => flowers(record).filter((flower: any) => !flower.isRevoked)
const isLarge = (flower: any) => Number(flower.flowerType) === 2

export default function GoodChildTab({ child }: { child: ChildInfo }) {
  const [rows, setRows] = useState<any[]>([])
  const [feedback, setFeedback] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState('')

  const load = async () => {
    if (!child.id) { setLoading(false); return }
    setLoading(true)
    setError('')
    try {
      const result = await getGoodChildRecords({ childId: child.id, pageSize: 100 })
      const records = list(result).sort((a: any, b: any) => `${b.year}-${String(b.month).padStart(2, '0')}`.localeCompare(`${a.year}-${String(a.month).padStart(2, '0')}`))
      setRows(records)
      setFeedback(Object.fromEntries(records.map((record: any) => [record.id, record.parentFeedback || ''])))
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Không tải được sổ bé ngoan') }
    finally { setLoading(false) }
  }

  useEffect(() => { void load() }, [child.id])

  const latest = rows[0]
  const isRecordDelivered = (record: any) => {
    if (!record) return false
    if (record.teacherComment && String(record.teacherComment).trim().length > 0) {
      return true
    }
    return isGoodChildDelivered(child.id, record.month, record.year, child.lop)
  }
  const isLatestDelivered = latest ? isRecordDelivered(latest) : false

  const latestDaily = latest ? activeFlowers(latest).filter((flower: any) => !isLarge(flower)) : []
  const latestBonus = latest ? activeFlowers(latest).filter(isLarge) : []
  const totalDaily = rows.reduce((sum, record) => sum + Number(record.dailyFlowerCount || activeFlowers(record).filter((f: any) => !isLarge(f)).length || 0), 0)
  const totalBonus = rows.reduce((sum, record) => sum + Number(record.bonusFlowerCount || activeFlowers(record).filter(isLarge).length || 0), 0)
  const monthProgress = Math.min(4, latest?.dailyFlowerCount || latestDaily.length || 0)
  const monthLabel = latest ? `Tháng ${latest.month}/${latest.year}` : 'Chưa có kỳ ghi nhận'

  const save = async (id: string) => {
    const text = feedback[id]?.trim() || ''
    if (!text) return
    try {
      setSaving(id)
      await updateParentFeedback(id, text)
      await load()
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Không thể gửi phản hồi') }
    finally { setSaving('') }
  }

  const monthlySummary = useMemo(() => rows.map(record => {
    const currentFlowers = activeFlowers(record)
    return { record, daily: currentFlowers.filter((flower: any) => !isLarge(flower)), bonus: currentFlowers.filter(isLarge) }
  }), [rows])

  return <section className="min-w-0 max-w-full space-y-6 overflow-x-hidden pb-8">
    <div className="relative overflow-hidden rounded-[30px] bg-slate-950 p-6 text-white shadow-xl sm:p-8">
      <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-amber-400/20 blur-2xl" />
      <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-rose-500/20 blur-3xl" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-300 to-orange-500 text-3xl shadow-lg shadow-orange-900/40">🌟</div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-black tracking-[.2em] text-amber-300">HÀNH TRÌNH KHEN THƯỞNG</p>
              <button onClick={() => void load()} title="Tải lại từ CSDL" className="rounded-full bg-white/10 p-1 text-slate-300 hover:text-white transition">
                <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">Sổ bé ngoan của {child.hoTen || 'Bé'}</h2>
            <p className="mt-2 text-sm text-slate-300">Theo dõi lời nhận xét, từng bông hoa và khoảnh khắc đáng nhớ của bé.</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
              <span className="rounded-full bg-white/10 px-3 py-1.5">{child.lop || 'Lớp chưa cập nhật'}</span>
              <span className="rounded-full bg-white/10 px-3 py-1.5">{monthLabel}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:w-80">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
            <p className="text-xs text-slate-300">Hoa nhỏ tích lũy</p>
            <p className="mt-1 text-3xl font-black text-rose-300">{totalDaily}</p>
            <p className="mt-1 text-[11px] text-slate-400">Trong các tháng</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
            <p className="text-xs text-slate-300">Hoa lớn</p>
            <p className="mt-1 text-3xl font-black text-amber-300">{totalBonus}</p>
            <p className="mt-1 text-[11px] text-slate-400">Mốc 4/4 hoa nhỏ</p>
          </div>
        </div>
      </div>
    </div>

    {loading ? <div className="flex min-h-64 items-center justify-center rounded-3xl border border-slate-100 bg-white"><Loader2 className="animate-spin text-amber-500" /></div> : error ? <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"><AlertCircle size={19} />{error}</div> : <>
      {latest && (
        !isLatestDelivered ? (
          <div className="rounded-3xl border border-dashed border-amber-300 bg-amber-50/70 p-7 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
              <Lock size={26} />
            </div>
            <h3 className="text-base font-black text-slate-800">
              Sổ bé ngoan Tháng {latest.month}/{latest.year} đang được tổng hợp
            </h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Cô giáo chủ nhiệm đang hoàn thiện các đánh giá hoạt động và nhận xét cho bé trong tháng này.
              Sổ sẽ tự động mở ra ngay khi cô giáo hoàn tất và nhấn nút <strong>&quot;Giao sổ cho phụ huynh xem&quot;</strong>.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-amber-800 font-bold bg-amber-100/80 px-3 py-1 rounded-full">
              <Clock size={13} />
              <span>Trạng thái: Đang chờ giáo viên bàn giao sổ</span>
            </div>
          </div>
        ) : (
          <div style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)' }} className="grid min-w-0 gap-4 lg:grid-cols-2">
            <article className="min-w-0 rounded-3xl border border-amber-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs font-black tracking-[.16em] text-amber-600">
                    <CalendarDays size={15} /> KỲ GHI NHẬN MỚI NHẤT
                  </div>
                  <h3 className="mt-2 text-2xl font-black text-slate-800">Tháng {latest.month}/{latest.year}</h3>
                  <p className="mt-2 break-words whitespace-pre-wrap text-sm leading-6 text-slate-700" style={{ overflowWrap: 'anywhere' }}>
                    {latest.teacherComment || 'Giáo viên chưa thêm nhận xét cho tháng này.'}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${latest.teacherComment ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {latest.teacherComment ? 'Đã nhận xét' : 'Đang cập nhật'}
                </span>
              </div>
              <div className="mt-6 rounded-2xl bg-gradient-to-r from-rose-50 to-amber-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black text-slate-700">Tiến trình hoa tháng này</p>
                    <p className="mt-1 text-xs text-slate-500">Đủ 4 hoa nhỏ sẽ nhận một hoa lớn.</p>
                  </div>
                  <span className="text-xl font-black text-rose-600">{monthProgress}/4</span>
                </div>
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {[0, 1, 2, 3].map(index => <div key={index} className={`flex h-12 items-center justify-center rounded-2xl border ${index < monthProgress ? 'border-rose-200 bg-rose-100 text-rose-600' : 'border-slate-200 bg-white text-slate-300'}`}>{index < monthProgress ? <Flower2 size={22} fill="currentColor" /> : <Circle size={18} />}</div>)}
                </div>
                {latestBonus.length > 0 && <div className="mt-4 flex items-center gap-2 rounded-xl bg-amber-100 px-3 py-2 text-xs font-bold text-amber-800"><Trophy size={16} /> Bé đã đạt {latestBonus.length} hoa lớn trong tháng này.</div>}
              </div>
            </article>

            <article className="min-w-0 rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-2 text-indigo-600">
                <Sparkles size={18} />
                <h3 className="font-black">Lời nhắn dành cho giáo viên</h3>
              </div>
              <p className="mt-3 break-words whitespace-pre-wrap text-sm leading-6 text-slate-500" style={{ overflowWrap: 'anywhere' }}>
                Phụ huynh có thể gửi phản hồi sau khi đọc nhận xét và các lần ghi nhận của giáo viên.
              </p>
              <textarea
                value={feedback[latest.id] || ''}
                onChange={event => setFeedback({ ...feedback, [latest.id]: event.target.value })}
                className="mt-5 min-h-28 min-w-0 max-w-full w-full resize-none rounded-2xl border border-indigo-100 bg-white p-3 text-sm outline-none focus:border-indigo-400"
                placeholder="Viết lời phản hồi cho giáo viên..."
              />
              <button
                disabled={saving === latest.id || !feedback[latest.id]?.trim()}
                onClick={() => void save(latest.id)}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 disabled:opacity-50"
              >
                {saving === latest.id ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} Gửi phản hồi
              </button>
              {latest.parentFeedback && <div className="mt-4 min-w-0 rounded-2xl bg-white p-3 text-xs text-indigo-700">
                <MessageCircle size={14} className="mr-1 inline" /><span>Phản hồi đã gửi:</span>
                <p className="mt-1 break-words whitespace-pre-wrap" style={{ overflowWrap: 'anywhere' }}>{latest.parentFeedback}</p>
              </div>}
            </article>
          </div>
        )
      )}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-black tracking-[.16em] text-slate-400">NHẬT KÝ THEO THÁNG</p>
          <h3 className="mt-1 text-xl font-black text-slate-800">Các kỳ ghi nhận của bé</h3>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500">{rows.length} kỳ</span>
      </div>

      {monthlySummary.length ? <div className="space-y-4">
        {monthlySummary.map(({ record, daily, bonus }) => <article key={record.id} className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 text-amber-600"><Star size={22} fill="currentColor" /></div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-slate-800">Tháng {record.month}/{record.year}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isRecordDelivered(record) ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {isRecordDelivered(record) ? 'Đã bàn giao' : 'Đang cập nhật'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400">{record.teacherComment ? 'Đã có nhận xét giáo viên' : 'Chưa có nhận xét giáo viên'}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700"><Flower2 size={14} />{daily.length}/4 hoa nhỏ</span>
              <span className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700"><Award size={14} />{bonus.length} hoa lớn</span>
            </div>
          </div>
          <div style={{ gridTemplateColumns: 'minmax(0, .8fr) minmax(0, 1.2fr)' }} className="mt-5 grid min-w-0 gap-4 lg:grid-cols-2">
            <div className="min-w-0 rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-black text-slate-500">Nhận xét giáo viên</p>
              <p className="mt-2 break-words whitespace-pre-wrap text-sm leading-6 text-slate-700" style={{ overflowWrap: 'anywhere' }}>{record.teacherComment || 'Giáo viên chưa thêm nhận xét cho kỳ này.'}</p>
              {record.parentFeedback && <p className="mt-2 text-xs italic text-indigo-600">Phụ huynh: {record.parentFeedback}</p>}
            </div>
            <div className="min-w-0 space-y-2">
              {activeFlowers(record).length ? activeFlowers(record).map((flower: any) => <div key={flower.id} className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${isLarge(flower) ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'}`}>{isLarge(flower) ? <Trophy size={19} /> : <Flower2 size={19} fill="currentColor" />}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-slate-700">{isLarge(flower) ? 'Hoa lớn tự động' : 'Hoa nhỏ ghi nhận'}</p>
                    <span className="text-xs text-slate-400">{flower.flowerDate}</span>
                  </div>
                  <p className="mt-1 break-words whitespace-pre-wrap text-xs text-slate-500" style={{ overflowWrap: 'anywhere' }}>{flower.reason || 'Giáo viên chưa ghi lời khen cụ thể.'}</p>
                </div>
                <CheckCircle2 size={17} className={isLarge(flower) ? 'shrink-0 text-amber-500' : 'shrink-0 text-rose-400'} />
              </div>) : <p className="rounded-2xl border border-dashed border-slate-200 p-5 text-center text-sm text-slate-400">Chưa có lần tặng hoa trong kỳ này.</p>}
            </div>
          </div>
        </article>)}
      </div> : <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-14 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500"><Sparkles size={25} /></div>
        <h3 className="mt-4 font-black text-slate-700">Chưa có sổ bé ngoan</h3>
        <p className="mt-1 text-sm text-slate-400">Giáo viên sẽ tạo sổ và ghi nhận cho bé theo từng tháng.</p>
      </div>}
    </>}
  </section>
}
