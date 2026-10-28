'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CalendarDays, Loader2, RefreshCw, X, CheckCircle2, Share2 } from 'lucide-react'
import { getGoodChildRecords } from '@/services/learning'
import { CHILDREN, loadLiveTeacherChildren, type Child } from '../data'
import { isGoodChildDelivered, setGoodChildDelivered } from '@/lib/activitySchedule'
import { GoodChildGrid } from './components/GoodChildGrid'

const list = (x: any) => (Array.isArray(x) ? x : Array.isArray(x?.items) ? x.items : [])

function GoodChildListContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialMonth = Number(searchParams.get('month')) || new Date().getMonth() + 1
  const initialYear = Number(searchParams.get('year')) || new Date().getFullYear()

  const [children, setChildren] = useState<Child[]>([])
  const [rows, setRows] = useState<any[]>([])
  const [month, setMonth] = useState(initialMonth)
  const [year, setYear] = useState(initialYear)
  const [busy, setBusy] = useState(true)
  const [successToast, setSuccessToast] = useState('')
  const [msg, setMsg] = useState('')
  const [deliveryKey, setDeliveryKey] = useState<number>(0)

  const handleDeliverAllClass = () => {
    children.forEach((child) => {
      const cId = child.apiId || String(child.id)
      setGoodChildDelivered(cId, month, year, true)
    })
    setDeliveryKey((k) => k + 1)
    setSuccessToast(`Đã bàn giao toàn bộ sổ bé ngoan tháng ${month}/${year} của lớp cho phụ huynh!`)
    setTimeout(() => setSuccessToast(''), 3500)
  }

  const load = async () => {
    setBusy(true)
    try {
      await loadLiveTeacherChildren()
      setChildren([...CHILDREN])
      const r = await getGoodChildRecords({
        month,
        year,
        pageSize: 100,
      })
      setRows(list(r))
    } catch (e: any) {
      setMsg(e instanceof Error ? e.message : 'Không tải được sổ bé ngoan')
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    void load()
  }, [month, year])

  const rowFor = (id: string) => rows.find((x) => String(x.childId) === String(id))

  const handleOpenChildPage = (child: Child) => {
    const cId = child.apiId || String(child.id)
    router.push(`/teacher/good-child/${encodeURIComponent(cId)}?month=${month}&year=${year}`)
  }

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3.5 text-xs font-bold text-white shadow-xl shadow-emerald-600/30 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 size={18} />
          <span>{successToast}</span>
        </div>
      )}

      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-[11px] font-black tracking-widest text-amber-600 uppercase bg-amber-100/80 px-2.5 py-0.5 rounded-full">
            ĐÁNH GIÁ ĐỊNH KỲ
          </span>
          <h1 className="mt-1 text-2xl font-black text-slate-800">Sổ Bé Ngoan</h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Chọn học sinh để chuyển sang trang viết nhận xét và tổng hợp đánh giá từ các hoạt động trong tháng.
          </p>
        </div>

        <button
          onClick={() => void load()}
          className="rounded-xl border border-amber-200 bg-white p-2.5 text-amber-600 hover:bg-amber-50 shadow-2xs transition cursor-pointer"
          title="Tải lại danh sách"
        >
          <RefreshCw size={17} />
        </button>
      </header>

      {msg && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-bold text-amber-800 flex items-center justify-between">
          <span>{msg}</span>
          <button onClick={() => setMsg('')} className="text-amber-600 hover:text-amber-900 cursor-pointer">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-100 bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <CalendarDays size={16} className="text-amber-500" />
            <span>Kỳ đánh giá:</span>
          </div>

          <select
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-amber-500 focus:bg-white"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Tháng {i + 1}
              </option>
            ))}
          </select>

          <input
            type="number"
            className="w-24 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-amber-500 focus:bg-white"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />
        </div>

        <button
          type="button"
          onClick={handleDeliverAllClass}
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-3.5 py-1.5 text-xs font-black text-white shadow-xs transition cursor-pointer"
        >
          <Share2 size={13} />
          <span>Giao toàn bộ sổ tháng {month} cho PH</span>
        </button>
      </div>

      {busy ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-amber-500" size={32} />
        </div>
      ) : (
        <GoodChildGrid
          key={deliveryKey}
          childrenList={children}
          rowFor={rowFor}
          onOpen={handleOpenChildPage}
          isDelivered={(id) => isGoodChildDelivered(id, month, year)}
        />
      )}
    </section>
  )
}

export default function GoodChild() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-amber-500" size={32} />
        </div>
      }
    >
      <GoodChildListContent />
    </Suspense>
  )
}
