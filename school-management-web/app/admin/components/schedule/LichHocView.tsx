'use client'

import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { AlertTriangle, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Copy, Eye, Filter, MapPin, Plus, Save, Send, Settings2, Users, X } from 'lucide-react'
import Modal from '../shared/Modal'
import { CLASSES } from '../../data'

const DAYS = ['Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7']
const PERIODS = [
  { id:1, label:'07:30', end:'08:00' }, { id:2, label:'08:00', end:'08:45' }, { id:3, label:'08:45', end:'09:30' },
  { id:4, label:'09:30', end:'10:15' }, { id:5, label:'10:15', end:'11:00' }, { id:6, label:'11:00', end:'11:45' },
  { id:7, label:'13:30', end:'14:15' }, { id:8, label:'14:15', end:'15:00' }, { id:9, label:'15:00', end:'15:45' }, { id:10, label:'15:45', end:'16:30' },
]
const TYPES = ['Hoạt động học','Ăn','Ngủ','Ngoài trời','Vui chơi','Sinh hoạt','Sự kiện']
const COLORS: Record<string,string> = {
  'Hoạt động học':'border-blue-200 bg-blue-50 text-blue-700', 'Ăn':'border-amber-200 bg-amber-50 text-amber-700', 'Ngủ':'border-violet-200 bg-violet-50 text-violet-700',
  'Ngoài trời':'border-emerald-200 bg-emerald-50 text-emerald-700', 'Vui chơi':'border-pink-200 bg-pink-50 text-pink-700', 'Sinh hoạt':'border-slate-200 bg-slate-50 text-slate-700', 'Sự kiện':'border-rose-200 bg-rose-50 text-rose-700'
}
type Slot = { id:number; className:string; teacher:string; room:string; day:number; period:number; title:string; type:string; status:'Đã xuất bản'|'Nháp'|'Xung đột' }
const INITIAL: Slot[] = [
  {id:1,className:'Mầm 1',teacher:'Nguyễn Thị Lan',room:'Phòng 101',day:0,period:2,title:'Hoạt động nhận biết màu sắc',type:'Hoạt động học',status:'Đã xuất bản'},
  {id:2,className:'Mầm 1',teacher:'Nguyễn Thị Lan',room:'Sân A',day:0,period:4,title:'Vui chơi ngoài trời',type:'Ngoài trời',status:'Đã xuất bản'},
  {id:3,className:'Mầm 1',teacher:'Phạm Thị Thu',room:'Phòng ăn',day:0,period:6,title:'Bữa trưa',type:'Ăn',status:'Đã xuất bản'},
  {id:4,className:'Mầm 1',teacher:'Nguyễn Thị Lan',room:'Phòng 101',day:0,period:7,title:'Ngủ trưa',type:'Ngủ',status:'Đã xuất bản'},
  {id:5,className:'Mầm 1',teacher:'Nguyễn Thị Lan',room:'Phòng 101',day:1,period:2,title:'Phát triển ngôn ngữ',type:'Hoạt động học',status:'Đã xuất bản'},
  {id:6,className:'Mầm 1',teacher:'Nguyễn Thị Lan',room:'Sân A',day:2,period:4,title:'Vận động',type:'Ngoài trời',status:'Đã xuất bản'},
  {id:10,className:'Chồi 1',teacher:'Lê Thị Hoa',room:'Sân A',day:2,period:4,title:'Chơi vận động',type:'Ngoài trời',status:'Đã xuất bản'},
  {id:7,className:'Mầm 2',teacher:'Trần Ngọc Anh',room:'Phòng 102',day:0,period:2,title:'Khám phá thế giới',type:'Hoạt động học',status:'Đã xuất bản'},
  {id:8,className:'Chồi 1',teacher:'Lê Thị Hoa',room:'Phòng 201',day:1,period:3,title:'Làm quen chữ cái',type:'Hoạt động học',status:'Đã xuất bản'},
  {id:9,className:'Lá 1',teacher:'Hoàng Thị Linh',room:'Phòng 301',day:2,period:3,title:'Toán tư duy',type:'Hoạt động học',status:'Nháp'},
]

const blockOf=(className:string)=>CLASSES.find(c=>c.name===className)?.block || ''

export default function LichHoc(){
  const [slots,setSlots]=useState(INITIAL)
  const [selectedClass,setSelectedClass]=useState('Mầm 1')
  const [week,setWeek]=useState(38)
  const [view,setView]=useState<'week'|'day'>('week')
  const [selected,setSelected]=useState<Slot|null>(null)
  const [modal,setModal]=useState(false)
  const [notice,setNotice]=useState('')
  const [form,setForm]=useState({day:'0',period:'2',duration:'45',title:'',type:'Hoạt động học',teacher:'',room:''})

  const classInfo=CLASSES.find(c=>c.name===selectedClass)
  const visible=useMemo(()=>slots.filter(s=>s.className===selectedClass),[slots,selectedClass])
  const periodStart=(periodId:number)=>{const p=PERIODS.find(x=>x.id===periodId); if(!p) return 0; const [h,m]=p.label.split(':').map(Number); return h*60+m}
  const overlaps=(aStart:number,aDuration:number,bStart:number,bDuration:number)=>aStart < bStart+bDuration && bStart < aStart+aDuration
  const conflictsFor=(candidate:any, source=slots)=>source.filter(s=>s.id!==candidate.id&&s.day===candidate.day&&overlaps(periodStart(candidate.period),candidate.duration,periodStart(s.period),45)&&((candidate.teacher&&s.teacher&&candidate.teacher===s.teacher)||(candidate.room&&s.room&&candidate.room===s.room)||(candidate.className===s.className)))
  const allConflictPairs=useMemo(()=>{const pairs:{a:any;b:any;reason:string}[]=[];slots.forEach(a=>{conflictsFor(a).forEach(b=>{if(a.id>=b.id)return;const reasons:string[]=[];if(a.className===b.className)reasons.push('cùng lớp');if(a.teacher&&a.teacher===b.teacher)reasons.push('cùng giáo viên');if(a.room&&a.room===b.room)reasons.push('cùng phòng/khu vực');pairs.push({a,b,reason:reasons.join(' · ')})})});return pairs},[slots])
  const visibleConflicts=allConflictPairs.filter(x=>x.a.className===selectedClass||x.b.className===selectedClass)
  const conflicts=visibleConflicts.length
  const draftCount=slots.filter(s=>s.status==='Nháp' && s.className===selectedClass).length
  const filled=Math.round((visible.length/Math.max(1,PERIODS.length*DAYS.length))*100)
  const getConflicts=(day:number,period:number,duration:number,teacher:string,room:string)=>conflictsFor({id:-1,className:selectedClass,day,period,duration,teacher,room})
  const create=()=>{
    const day=Number(form.day), period=Number(form.period), duration=Number(form.duration), teacher=form.teacher||classInfo?.teacher||'', room=form.room||classInfo?.room||''
    if(!form.title.trim()) return setNotice('Cần nhập tên hoạt động.')
    const found=getConflicts(day,period,duration,teacher,room)
    if(found.length){setNotice(`Không thể lưu: ${found.map(x=>`${x.className} — ${x.title} (${DAYS[x.day]} ${PERIODS.find(p=>p.id===x.period)?.label})`).join('; ')}. Lịch bị trùng ${found.map(x=>{const r=[];if(x.className===selectedClass)r.push('lớp');if(x.teacher===teacher)r.push('giáo viên');if(x.room===room)r.push('phòng/khu vực');return r.join(', ')}).join(' và ')}.`);return}
    const next={id:Date.now(),className:selectedClass,teacher,room,day,period,title:form.title,type:form.type,status:'Nháp' as const}
    setSlots(p=>[...p,next]); setSelected(next); setModal(false); setNotice('Đã tạo lịch nháp. Hệ thống đã kiểm tra trùng lớp, giáo viên và phòng/khu vực.')
  }
  const publish=()=>{if(visibleConflicts.length){setNotice(`Chưa thể xuất bản: ${visibleConflicts.length} xung đột của ${selectedClass} cần được xử lý.`);return}setSlots(p=>p.map(s=>s.className===selectedClass?{...s,status:'Đã xuất bản' as const}:s));setNotice(`Đã xuất bản lịch tuần ${week} của ${selectedClass}.`)}
  const copyNextWeek=()=>setNotice(`Đã tạo bản nháp tuần ${week+1} từ lịch hiện tại của ${selectedClass}.`)
  const remove=()=>{if(!selected)return;setSlots(p=>p.filter(s=>s.id!==selected.id));setSelected(null);setNotice('Đã xóa hoạt động khỏi lịch.')}

  return <div className="space-y-5 p-6">
    <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div><p className="text-xs font-bold uppercase tracking-[.16em] text-rose-500">Điều phối vận hành</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Lịch học & hoạt động</h1><p className="mt-1 text-sm text-slate-500">Xếp lịch theo từng lớp nhưng luôn kiểm tra xung đột trên toàn trường: trùng lớp, trùng giáo viên hoặc trùng phòng/khu vực.</p></div>
      <div className="flex flex-wrap gap-2"><button onClick={copyNextWeek} className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Copy size={16}/> Sao chép tuần</button><button onClick={()=>{setForm({day:'0',period:'2',duration:'45',title:'',type:'Hoạt động học',teacher:classInfo?.teacher||'',room:classInfo?.room||''});setNotice('');setModal(true)}} className="inline-flex h-10 items-center gap-2 rounded-xl bg-rose-500 px-4 text-sm font-semibold text-white shadow-sm hover:bg-rose-600"><Plus size={16}/> Thêm hoạt động</button></div>
    </header>

    {notice && <div className="flex items-start justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"><span>{notice}</span><button onClick={()=>setNotice('')}><X size={15}/></button></div>}

    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Kpi label="Lớp đang quản lý" value={selectedClass} icon={Users}/><Kpi label="Hoạt động đã xếp" value={`${visible.length}/${DAYS.length*PERIODS.length}`} icon={CalendarDays}/><Kpi label="Lịch nháp" value={draftCount} icon={Save}/><Kpi label="Xung đột trong lớp" value={conflicts} icon={AlertTriangle} danger/>
    </div>

    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 xl:flex-row xl:items-center">
        <div className="flex items-center gap-2"><button onClick={()=>setWeek(w=>Math.max(1,w-1))} className="rounded-xl border border-slate-200 p-2 hover:bg-slate-50"><ChevronLeft size={16}/></button><div className="min-w-[125px] text-center"><p className="text-sm font-bold">Tuần {week}</p><p className="text-[11px] text-slate-400">18–23/09/2026</p></div><button onClick={()=>setWeek(w=>w+1)} className="rounded-xl border border-slate-200 p-2 hover:bg-slate-50"><ChevronRight size={16}/></button></div>
        <div className="h-7 w-px bg-slate-200 hidden xl:block"/>
        <div className="flex min-w-0 flex-1 items-center gap-2"><Filter size={15} className="text-slate-400"/><select value={selectedClass} onChange={e=>setSelectedClass(e.target.value)} className="h-10 min-w-[190px] rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-rose-300">{CLASSES.map(c=><option key={c.id}>{c.name}</option>)}</select><span className="hidden text-xs text-slate-400 md:inline">{blockOf(selectedClass)} · {classInfo?.teacher || 'Chưa phân công'}</span></div>
        <div className="flex rounded-xl bg-slate-100 p-1"><button onClick={()=>setView('week')} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${view==='week'?'bg-white shadow-sm text-slate-800':'text-slate-500'}`}>Tuần</button><button onClick={()=>setView('day')} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${view==='day'?'bg-white shadow-sm text-slate-800':'text-slate-500'}`}>Ngày</button></div>
      </div>
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-4 py-3"><div><p className="text-sm font-bold text-slate-800">{selectedClass}</p><p className="text-[11px] text-slate-400">{classInfo?.room} · {visible.filter(s=>s.status==='Đã xuất bản').length} hoạt động đã xuất bản</p></div><button onClick={publish} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"><Send size={14}/> Xuất bản lịch</button></div>
      <div className="overflow-x-auto"><div className="min-w-[980px]">
        <div className="grid grid-cols-[78px_repeat(6,1fr)] border-b border-slate-100"><div className="p-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Tiết</div>{DAYS.map((d,i)=><div key={d} className="border-l border-slate-100 p-3 text-center"><p className="text-xs font-bold text-slate-700">{view==='day' && i!==0?'':d}</p><p className="mt-0.5 text-[10px] text-slate-400">{18+i}/09</p></div>)}</div>
        <div className="grid grid-cols-[78px_repeat(6,1fr)]"> <div>{PERIODS.map(p=><div key={p.id} className="h-[78px] border-b border-slate-50 px-2 pt-3"><p className="text-[11px] font-bold text-slate-600">{p.label}</p><p className="text-[10px] text-slate-400">{p.end}</p></div>)}</div>{DAYS.map((_,day)=><div key={day} className="border-l border-slate-100">{PERIODS.map(p=>{const slot=visible.find(s=>s.day===day&&s.period===p.id);return <div key={p.id} className="h-[78px] border-b border-slate-50 p-1">{slot?<button onClick={()=>setSelected(slot)} className={`h-full w-full rounded-xl border p-2 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${COLORS[slot.type]}`}><div className="flex items-start justify-between gap-1"><span className="line-clamp-2 text-[11px] font-bold">{slot.title}</span>{slot.status==='Nháp'&&<span className="rounded bg-white/80 px-1 py-0.5 text-[8px] font-bold">NHÁP</span>}</div><p className="mt-1 truncate text-[9px] opacity-70">{slot.teacher}</p><p className="truncate text-[9px] opacity-60">{slot.room}</p></button>:<button onClick={()=>{setForm({day:String(day),period:String(p.id),duration:'45',title:'',type:'Hoạt động học',teacher:classInfo?.teacher||'',room:classInfo?.room||''});setModal(true)}} className="flex h-full w-full items-center justify-center rounded-xl border border-dashed border-transparent text-slate-200 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-400"><Plus size={14}/></button>}</div>})}</div>)}</div>
      </div></div>
    </section>

    <section className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div><h2 className="font-bold">Kiểm tra lịch của lớp</h2><p className="mt-1 text-xs text-slate-400">Kiểm tra chéo toàn trường để tránh một giáo viên hoặc một phòng/khu vực bị xếp hai hoạt động cùng lúc.</p></div><AlertTriangle size={18} className="text-slate-400"/></div><div className="mt-4 grid gap-3 sm:grid-cols-2"><Check label="Xung đột lịch" value={conflicts===0?'Không có':`${conflicts} xung đột`} ok={conflicts===0}/><Check label="Mức độ sử dụng lịch" value={`${filled}%`} ok={filled>40}/></div>{visibleConflicts.length>0&&<div className="mt-4 space-y-2">{visibleConflicts.map((x,i)=><div key={i} className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800"><b>{DAYS[x.a.day]} · {PERIODS.find(p=>p.id===x.a.period)?.label}</b> — {x.a.className} “{x.a.title}” ↔ {x.b.className} “{x.b.title}” · <b>{x.reason}</b></div>)}</div>}</div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><Eye size={17} className="text-slate-400"/><h2 className="font-bold">Quy trình sử dụng</h2></div><ol className="mt-3 space-y-2 text-xs text-slate-500"><li><b className="text-slate-700">01.</b> Chọn lớp cần xếp lịch.</li><li><b className="text-slate-700">02.</b> Thêm hoạt động vào từng ô thời gian.</li><li><b className="text-slate-700">03.</b> Hệ thống kiểm tra trùng lớp, giáo viên và phòng/khu vực trên toàn trường.</li><li><b className="text-slate-700">04.</b> Xử lý hết xung đột rồi mới xuất bản lịch.</li></ol></div>
    </section>

    <Modal open={modal} onClose={()=>setModal(false)} title="Thêm hoạt động vào lịch" description={`Lớp ${selectedClass} · tuần ${week}`} footer={<><button onClick={()=>setModal(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold">Hủy</button><button onClick={create} className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white"><Save size={15} className="mr-1 inline"/> Lưu nháp</button></>}>
      {getConflicts(Number(form.day),Number(form.period),Number(form.duration),form.teacher||classInfo?.teacher||'',form.room||classInfo?.room||'').length>0&&<div className="mb-3 space-y-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700"><b>Phát hiện xung đột:</b>{getConflicts(Number(form.day),Number(form.period),Number(form.duration),form.teacher||classInfo?.teacher||'',form.room||classInfo?.room||'').map(x=><div key={x.id}>• {x.className} — {x.title} · {x.className===selectedClass?'trùng lớp ':''}{x.teacher===(form.teacher||classInfo?.teacher||'')?'trùng giáo viên ':''}{x.room===(form.room||classInfo?.room||'')?'trùng phòng/khu vực':''}</div>)}<span className="block pt-1 font-semibold">Không thể lưu cho đến khi đổi thời gian, giáo viên hoặc phòng/khu vực.</span></div>}<div className="grid gap-3 sm:grid-cols-2"><Field label="Ngày"><select value={form.day} onChange={e=>setForm({...form,day:e.target.value})} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-500/10">{DAYS.map((d,i)=><option key={d} value={i}>{d}</option>)}</select></Field><Field label="Tiết"><select value={form.period} onChange={e=>setForm({...form,period:e.target.value})} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-500/10">{PERIODS.map(p=><option key={p.id} value={p.id}>{p.label} – {p.end}</option>)}</select></Field><Field label="Tên hoạt động" full><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-500/10" placeholder="Ví dụ: Làm quen với màu sắc"/></Field><Field label="Thời lượng"><select value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-500/10"><option value="45">45 phút</option><option value="60">60 phút</option><option value="90">90 phút</option></select></Field><Field label="Loại"><select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-500/10">{TYPES.map(t=><option key={t}>{t}</option>)}</select></Field><Field label="Giáo viên"><input value={form.teacher} onChange={e=>setForm({...form,teacher:e.target.value})} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-500/10"/></Field><Field label="Phòng / khu vực"><input value={form.room} onChange={e=>setForm({...form,room:e.target.value})} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-500/10"/></Field></div>
    </Modal>
    <Modal open={!!selected} onClose={()=>setSelected(null)} title={selected?.title||''} description="Thông tin và thao tác với hoạt động đã xếp.">{selected&&<div className="space-y-3"><div className="grid grid-cols-2 gap-3"><Info label="Lớp" value={selected.className}/><Info label="Thời gian" value={`${DAYS[selected.day]} · ${PERIODS.find(p=>p.id===selected.period)?.label}`}/><Info label="Giáo viên" value={selected.teacher}/><Info label="Phòng" value={selected.room}/></div><div className="flex justify-end gap-2 pt-2"><button onClick={remove} className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50">Xóa</button><button onClick={()=>{setSlots(p=>p.map(s=>s.id===selected.id?{...s,status:'Đã xuất bản' as const}:s));setSelected(null);setNotice('Đã xuất bản hoạt động.')}} className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white">Xuất bản hoạt động</button></div></div>}</Modal>
  </div>
}
function Kpi({label,value,icon:Icon,danger}:{label:string;value:string|number;icon:any;danger?:boolean}){return <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-400">{label}</span><Icon size={17} className={danger?'text-rose-500':'text-slate-400'}/></div><p className={`mt-2 text-xl font-bold ${danger?'text-rose-600':'text-slate-900'}`}>{value}</p></div>}
function Check({label,value,ok}:{label:string;value:string;ok:boolean}){return <div className="rounded-xl border border-slate-100 bg-slate-50 p-3"><p className="text-[11px] text-slate-400">{label}</p><p className={`mt-1 text-sm font-bold ${ok?'text-emerald-600':'text-rose-600'}`}>{ok?'✓ ':''}{value}</p></div>}
function Field({label,children,full}:{label:string;children:ReactNode;full?:boolean}){return <label className={full?'sm:col-span-2':''}><span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span>{children}</label>}
function Info({label,value}:{label:string;value:string}){return <div className="rounded-xl bg-slate-50 p-3"><p className="text-[11px] text-slate-400">{label}</p><p className="mt-1 text-sm font-semibold text-slate-800">{value}</p></div>}
