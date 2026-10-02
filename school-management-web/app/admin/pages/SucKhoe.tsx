'use client'

import { useMemo, useState } from 'react'
import { Activity, Plus, Search, X } from 'lucide-react'
import { STUDENTS } from '../data'
import Modal from '../components/shared/Modal'

type HealthRecord = {
  id: string
  studentId: string
  date: string
  height: number
  weight: number
  note: string
}

type BmiReference = {
  ageLabel: string
  month: number
  minus3: number
  minus2: number
  plus1: number
  plus2: number
  plus3: number
}

// WHO 2007 BMI-for-age reference points used for the preschool/school-age demo data.
// The thresholds are age- and sex-specific; they are not adult BMI cut-offs.
const BMI_REFERENCE: Record<'Nam' | 'Nữ', BmiReference[]> = {
  Nam: [
    { ageLabel: '5 tuổi 1 tháng', month: 61, minus3: 12.1, minus2: 13.0, plus1: 16.7, plus2: 18.3, plus3: 20.4 },
    { ageLabel: '5 tuổi 3 tháng', month: 63, minus3: 12.1, minus2: 13.0, plus1: 16.7, plus2: 18.3, plus3: 20.4 },
    { ageLabel: '5 tuổi 6 tháng', month: 66, minus3: 12.2, minus2: 13.1, plus1: 16.7, plus2: 18.4, plus3: 20.4 },
    { ageLabel: '5 tuổi 10 tháng', month: 70, minus3: 12.1, minus2: 13.0, plus1: 16.7, plus2: 18.5, plus3: 20.6 },
    { ageLabel: '5 tuổi 11 tháng', month: 71, minus3: 12.1, minus2: 13.0, plus1: 16.7, plus2: 18.5, plus3: 20.6 },
    { ageLabel: '6 tuổi', month: 72, minus3: 12.1, minus2: 13.0, plus1: 16.8, plus2: 18.5, plus3: 20.7 },
    { ageLabel: '6 tuổi 9 tháng', month: 81, minus3: 12.2, minus2: 13.1, plus1: 17.0, plus2: 18.9, plus3: 21.3 },
  ],
  Nữ: [
    { ageLabel: '5 tuổi 1 tháng', month: 61, minus3: 11.8, minus2: 12.7, plus1: 16.9, plus2: 18.9, plus3: 21.3 },
    { ageLabel: '5 tuổi 3 tháng', month: 63, minus3: 11.8, minus2: 12.7, plus1: 16.9, plus2: 18.9, plus3: 21.5 },
    { ageLabel: '5 tuổi 7 tháng', month: 67, minus3: 11.7, minus2: 12.7, plus1: 16.9, plus2: 19.0, plus3: 21.7 },
    { ageLabel: '7 tuổi 5 tháng', month: 89, minus3: 11.8, minus2: 12.8, plus1: 17.5, plus2: 20.1, plus3: 23.9 },
  ],
}

const formatDate = (value: string) => new Intl.DateTimeFormat('vi-VN').format(new Date(`${value}T00:00:00`))
const bmi = (height: number, weight: number) => height > 0 ? weight / ((height / 100) ** 2) : 0

const ageInMonths = (dob: string, measurementDate: string) => {
  const birth = new Date(`${dob}T00:00:00`)
  const measured = new Date(`${measurementDate}T00:00:00`)
  let months = (measured.getFullYear() - birth.getFullYear()) * 12 + measured.getMonth() - birth.getMonth()
  if (measured.getDate() < birth.getDate()) months -= 1
  return Math.max(0, months)
}

const nearestReference = (gender: 'Nam' | 'Nữ', months: number) => {
  const table = BMI_REFERENCE[gender]
  return table.reduce((best, current) => Math.abs(current.month - months) < Math.abs(best.month - months) ? current : best, table[0])
}

const classifyBmi = (value: number, gender: 'Nam' | 'Nữ', months: number) => {
  const reference = nearestReference(gender, months)
  if (months < 60) return { label: value < reference.minus2 ? 'Gầy' : value >= reference.plus3 ? 'Béo phì' : value >= reference.plus2 ? 'Thừa cân' : 'Bình thường', tone: value < reference.minus2 || value >= reference.plus2 ? 'warning' : 'normal', reference }
  return { label: value < reference.minus3 ? 'Gầy nặng' : value < reference.minus2 ? 'Gầy' : value >= reference.plus2 ? 'Béo phì' : value >= reference.plus1 ? 'Thừa cân' : 'Bình thường', tone: value < reference.minus2 || value >= reference.plus1 ? 'warning' : 'normal', reference }
}

const INITIAL_RECORDS: HealthRecord[] = STUDENTS.map((student, index) => ({
  id: `SK-${String(index + 1).padStart(3, '0')}`,
  studentId: student.id,
  date: '2026-09-18',
  height: [96, 99, 101, 104, 107, 110, 112, 108, 102, 106, 98, 105][index] ?? 102,
  weight: [14.2, 15.1, 16.0, 17.2, 18.0, 19.1, 20.2, 18.5, 16.8, 17.7, 14.8, 18.2][index] ?? 16.5,
  note: '',
}))

export default function SucKhoe() {
  const [records, setRecords] = useState(INITIAL_RECORDS)
  const [block, setBlock] = useState('Tất cả')
  const [className, setClassName] = useState('Tất cả')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<HealthRecord | null>(null)
  const [creating, setCreating] = useState(false)
  const [notice, setNotice] = useState('')

  const blocks = useMemo(() => ['Tất cả', ...Array.from(new Set(STUDENTS.map(s => s.block)))], [])
  const classes = useMemo(() => ['Tất cả', ...Array.from(new Set(STUDENTS.filter(s => block === 'Tất cả' || s.block === block).map(s => s.className)))], [block])

  const rows = useMemo(() => records
    .map(record => ({ record, student: STUDENTS.find(s => s.id === record.studentId)! }))
    .filter(({ student }) => student && (block === 'Tất cả' || student.block === block) && (className === 'Tất cả' || student.className === className))
    .filter(({ student }) => `${student.name} ${student.id} ${student.className}`.toLowerCase().includes(search.toLowerCase())),
    [records, block, className, search])

  const allRows = useMemo(() => records.map(record => ({ record, student: STUDENTS.find(s => s.id === record.studentId)! })).filter(x => x.student), [records])
  const stats = useMemo(() => buildStats(allRows), [allRows])

  const saveRecord = (studentId: string, date: string, height: number, weight: number, note: string) => {
    if (!studentId || height <= 0 || weight <= 0) return
    const next: HealthRecord = { id: `SK-${Date.now()}`, studentId, date, height, weight, note: note.trim() }
    setRecords(current => [next, ...current.filter(r => r.studentId !== studentId)])
    setCreating(false)
    setSelected(null)
    setNotice('Đã cập nhật chiều cao, cân nặng, BMI và tình trạng dinh dưỡng.')
  }

  return <div className="space-y-5">
    <header className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[.16em] text-rose-500">Theo dõi tăng trưởng</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Sức khỏe</h1>
        <p className="mt-1 max-w-4xl text-sm text-slate-500">Ghi nhận chiều cao, cân nặng và BMI của từng trẻ. BMI được tính từ chiều cao và cân nặng; tình trạng dinh dưỡng được xác định theo tuổi và giới.</p>
      </div>
      <button onClick={() => setCreating(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-600"><Plus size={17}/>Ghi nhận lần đo</button>
    </header>

    {notice && <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{notice}<button onClick={() => setNotice('')}><X size={15}/></button></div>}

    <div className="grid gap-3 sm:grid-cols-4">
      <Kpi label="Toàn trường" value={allRows.length} sub="Trẻ có số đo mới nhất" />
      <Kpi label="Bình thường" value={stats.normal} sub="Tình trạng dinh dưỡng bình thường" />
      <Kpi label="Cần theo dõi" value={stats.warning} sub="Theo BMI theo tuổi và giới" />
      <Kpi label="Chưa có số đo" value={Math.max(0, STUDENTS.filter(s => s.status === 'Đang học').length - allRows.length)} sub="Trẻ đang học" />
    </div>

    <NutritionCharts allRows={allRows} />

    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="relative w-full max-w-md"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm tên trẻ, mã học sinh..." className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-500/10"/></div>
          <select value={block} onChange={e => { setBlock(e.target.value); setClassName('Tất cả') }} className="h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none"><option value="Tất cả">Tất cả khối</option>{blocks.filter(x => x !== 'Tất cả').map(x => <option key={x}>{x}</option>)}</select>
          <select value={className} onChange={e => setClassName(e.target.value)} className="h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none"><option value="Tất cả">Tất cả lớp</option>{classes.filter(x => x !== 'Tất cả').map(x => <option key={x}>{x}</option>)}</select>
        </div>
      </div>
      <div className="overflow-auto"><table className="w-full min-w-[1120px]"><thead className="bg-slate-50"><tr>{['Học sinh','Khối / Lớp','Ngày đo','Chiều cao','Cân nặng','BMI','Tình trạng dinh dưỡng','Thao tác'].map(h => <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-slate-100">{rows.map(({ record, student }) => { const result = classifyBmi(bmi(record.height, record.weight), student.gender, ageInMonths(student.dob, record.date)); return <tr key={record.id} className="hover:bg-slate-50">
          <td className="px-4 py-4"><p className="text-sm font-semibold text-slate-900">{student.name}</p><p className="text-[10px] text-slate-400">{student.id} · {student.gender}</p></td>
          <td className="px-4 py-4 text-xs text-slate-600">{student.block} · {student.className}</td>
          <td className="px-4 py-4 text-xs text-slate-600">{formatDate(record.date)}</td>
          <td className="px-4 py-4 text-sm font-semibold">{record.height} cm</td>
          <td className="px-4 py-4 text-sm font-semibold">{record.weight} kg</td>
          <td className="px-4 py-4"><span className="rounded-lg bg-slate-100 px-2.5 py-1 text-sm font-bold text-slate-800">{bmi(record.height, record.weight).toFixed(1)}</span></td>
          <td className="px-4 py-4"><StatusBadge label={result.label} tone={result.tone}/></td>
          <td className="px-4 py-4"><button onClick={() => setSelected(record)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50">Cập nhật</button></td>
        </tr>})}</tbody></table></div>
      {!rows.length && <div className="p-10 text-center text-sm text-slate-400">Không có trẻ phù hợp.</div>}
    </section>

    <Modal open={creating || !!selected} onClose={() => { setCreating(false); setSelected(null) }} title={creating ? 'Ghi nhận lần đo' : 'Cập nhật lần đo'} description="Nhập chiều cao và cân nặng; BMI và tình trạng dinh dưỡng được tính tự động.">
      <MeasurementForm initial={selected ? { studentId: selected.studentId, date: selected.date, height: selected.height, weight: selected.weight, note: selected.note } : undefined} students={STUDENTS} onSave={saveRecord} onClose={() => { setCreating(false); setSelected(null) }} />
    </Modal>
  </div>
}

function buildStats(rows: { record: HealthRecord; student: typeof STUDENTS[number] }[]) {
  const result = { normal: 0, low: 0, overweight: 0, obesity: 0, warning: 0 }
  rows.forEach(({ record, student }) => {
    const value = bmi(record.height, record.weight)
    const classification = classifyBmi(value, student.gender, ageInMonths(student.dob, record.date)).label
    if (classification === 'Béo phì') result.obesity += 1
    else if (classification === 'Thừa cân') result.overweight += 1
    else if (classification === 'Gầy' || classification === 'Gầy nặng') result.low += 1
    else result.normal += 1
  })
  result.warning = result.low + result.overweight + result.obesity
  return result
}

function NutritionCharts({ allRows }: { allRows: Array<{ record: HealthRecord; student: typeof STUDENTS[number] }> }) {
  const groups = ['Toàn trường', 'Khối Mầm', 'Khối Chồi', 'Khối Lá']
  const data = groups.map(label => {
    const scoped = label === 'Toàn trường' ? allRows : allRows.filter(x => x.student.block === label)
    const avg = (values: number[]) => values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0
    return {
      label,
      count: scoped.length,
      height: avg(scoped.map(x => x.record.height)),
      weight: avg(scoped.map(x => x.record.weight)),
      bmi: avg(scoped.map(x => bmi(x.record.height, x.record.weight))),
    }
  })

  return <section className="space-y-4">
    <div>
      <div className="flex items-center gap-2">
        <Activity size={18} className="text-rose-500" />
        <h2 className="text-base font-bold text-slate-900">Biểu đồ tăng trưởng</h2>
      </div>
      <p className="mt-1 text-xs text-slate-500">So sánh chiều cao, cân nặng và BMI trung bình của toàn trường và từng khối.</p>
    </div>

    <div className="grid gap-4 xl:grid-cols-3">
      <MetricChart title="Chiều cao trung bình" unit="cm" max={120} min={80} data={data.map(x => ({ label: x.label, count: x.count, value: x.height }))} />
      <MetricChart title="Cân nặng trung bình" unit="kg" max={25} min={10} data={data.map(x => ({ label: x.label, count: x.count, value: x.weight }))} />
      <MetricChart title="BMI trung bình" unit="BMI" max={20} min={10} data={data.map(x => ({ label: x.label, count: x.count, value: x.bmi }))} />
    </div>
  </section>
}

function MetricChart({ title, unit, max, min, data }: { title: string; unit: string; max: number; min: number; data: Array<{ label: string; count: number; value: number }> }) {
  const chartMin = min
  const chartMax = max
  const width = 560
  const left = 52
  const right = 18
  const top = 22
  const bottom = 62
  const plotWidth = width - left - right
  const plotHeight = 210
  const baseline = top + plotHeight
  const scaleY = (value: number) => baseline - ((Math.max(chartMin, Math.min(chartMax, value)) - chartMin) / (chartMax - chartMin)) * plotHeight
  const barWidth = 58
  const gap = (plotWidth - data.length * barWidth) / (data.length + 1)

  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        <p className="mt-1 text-[11px] text-slate-500">Đơn vị: {unit}</p>
      </div>
    </div>
    <div className="mt-4 overflow-hidden rounded-xl bg-slate-50 p-2">
      <svg viewBox={`0 0 ${width} ${top + plotHeight + bottom}`} className="h-auto w-full" role="img" aria-label={title}>
        {[chartMin, chartMin + (chartMax - chartMin) / 2, chartMax].map(tick => <g key={tick}>
          <line x1={left} x2={width - right} y1={scaleY(tick)} y2={scaleY(tick)} className="stroke-slate-200" />
          <text x={left - 8} y={scaleY(tick) + 4} textAnchor="end" className="fill-slate-400 text-[10px]">{Number.isInteger(tick) ? tick : tick.toFixed(1)}</text>
        </g>)}
        <line x1={left} x2={width - right} y1={baseline} y2={baseline} className="stroke-slate-300" />
        {data.map((item, index) => {
          const x = left + gap + index * (barWidth + gap)
          const y = scaleY(item.value)
          const height = Math.max(0, baseline - y)
          const short = item.label === 'Toàn trường' ? 'Toàn trường' : item.label.replace('Khối ', '')
          return <g key={item.label}>
            <rect x={x} y={y} width={barWidth} height={height} rx="8" className="fill-rose-400" />
            <text x={x + barWidth / 2} y={Math.max(15, y - 8)} textAnchor="middle" className="fill-slate-900 text-[11px] font-bold">{item.value.toFixed(1)}</text>
            <text x={x + barWidth / 2} y={baseline + 22} textAnchor="middle" className="fill-slate-700 text-[10px] font-semibold">{short}</text>
            <text x={x + barWidth / 2} y={baseline + 38} textAnchor="middle" className="fill-slate-400 text-[9px]">{item.count} trẻ</text>
          </g>
        })}
        <text x={left} y="12" className="fill-slate-400 text-[9px]">{unit}</text>
      </svg>
    </div>
  </div>
}

function StatusBadge({ label, tone }: { label: string; tone: 'normal' | 'warning' }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${tone === 'normal' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{label}</span>
}

function MeasurementForm({ initial, students, onSave, onClose }: { initial?: Omit<HealthRecord, 'id'>; students: typeof STUDENTS; onSave: (studentId: string, date: string, height: number, weight: number, note: string) => void; onClose: () => void }) {
  const [studentId, setStudentId] = useState(initial?.studentId ?? students[0]?.id ?? '')
  const [date, setDate] = useState(initial?.date ?? '2026-09-18')
  const [height, setHeight] = useState(String(initial?.height ?? ''))
  const [weight, setWeight] = useState(String(initial?.weight ?? ''))
  const [note, setNote] = useState(initial?.note ?? '')
  const currentBmi = bmi(Number(height), Number(weight))
  const student = students.find(s => s.id === studentId)
  const result = student && currentBmi > 0 ? classifyBmi(currentBmi, student.gender, ageInMonths(student.dob, date)) : null
  return <div className="space-y-4">
    <label className="block"><span className="mb-1.5 block text-xs font-semibold">Học sinh</span><select value={studentId} onChange={e => setStudentId(e.target.value)} disabled={!!initial} className="input">{students.filter(s => s.status === 'Đang học').map(s => <option key={s.id} value={s.id}>{s.name} · {s.className}</option>)}</select></label>
    <div className="grid gap-3 sm:grid-cols-2"><label className="block"><span className="mb-1.5 block text-xs font-semibold">Ngày đo</span><input type="date" value={date} onChange={e => setDate(e.target.value)} className="input"/></label><label className="block"><span className="mb-1.5 block text-xs font-semibold">Chiều cao (cm)</span><input type="number" min="1" step="0.1" value={height} onChange={e => setHeight(e.target.value)} className="input" placeholder="Ví dụ: 105"/></label></div>
    <div className="grid gap-3 sm:grid-cols-2"><label className="block"><span className="mb-1.5 block text-xs font-semibold">Cân nặng (kg)</span><input type="number" min="0.1" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} className="input" placeholder="Ví dụ: 17.5"/></label><div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-xs text-slate-400">BMI</p><p className="mt-1 text-xl font-bold text-slate-900">{currentBmi > 0 ? currentBmi.toFixed(1) : '—'}</p>{result && <div className="mt-2"><StatusBadge label={result.label} tone={result.tone}/><p className="mt-1 text-[10px] text-slate-400">Đánh giá theo tuổi và giới của trẻ</p></div>}</div></div>
    <label className="block"><span className="mb-1.5 block text-xs font-semibold">Ghi chú</span><textarea value={note} onChange={e => setNote(e.target.value)} rows={3} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-500/10" placeholder="Ghi nhận thực tế nếu cần."/></label>
    <div className="flex justify-end gap-2 pt-2"><button onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold">Hủy</button><button disabled={!studentId || Number(height) <= 0 || Number(weight) <= 0 || !date} onClick={() => onSave(studentId, date, Number(height), Number(weight), note)} className="rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">Lưu số đo</button></div>
  </div>
}

function Kpi({ label, value, sub }: { label: string; value: string | number; sub: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs text-slate-400">{label}</p><p className="mt-1 text-xl font-bold text-slate-900">{value}</p><p className="mt-1 text-[10px] text-slate-400">{sub}</p></div>
}
