'use client'
import { useMemo, useState } from 'react'
import { FileText, Plus, Search, XCircle } from 'lucide-react'
import { STUDENTS } from '../../data'
const APPLICATIONS = [
 {id:'TS-001',name:'Nguyễn Minh Anh',age:'5 tuổi',className:'Lá 1',source:'Giới thiệu',status:'Chờ duyệt',date:'18/09/2026'},
 {id:'TS-002',name:'Trần Gia Hân',age:'4 tuổi',className:'Chồi 2',source:'Website',status:'Đã tiếp nhận',date:'17/09/2026'},
 {id:'TS-003',name:'Lê Hoàng Nam',age:'3 tuổi',className:'Mầm 2',source:'Điện thoại',status:'Thiếu hồ sơ',date:'16/09/2026'},
 {id:'TS-004',name:'Phạm Khánh Linh',age:'5 tuổi',className:'Lá 2',source:'Giới thiệu',status:'Đã duyệt',date:'15/09/2026'},
]
export default function TuyenSinhView(){
 const [search,setSearch]=useState(''); const [status,setStatus]=useState('Tất cả'); const [notice,setNotice]=useState('')
 const rows=useMemo(()=>APPLICATIONS.filter(x=>(status==='Tất cả'||x.status===status)&&(!search||`${x.name} ${x.id} ${x.className}`.toLowerCase().includes(search.toLowerCase()))),[search,status])
 return <div className="space-y-6 p-6">
  <header><p className="text-xs font-bold uppercase tracking-[.16em] text-rose-500">Trường học</p><h1 className="mt-1 text-2xl font-bold">Tuyển sinh & Nhập học</h1><p className="mt-1 text-sm text-slate-500">Theo dõi hồ sơ đăng ký, tình trạng xét duyệt và chuyển trẻ vào lớp.</p></header>
  {notice&&<div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"><span>{notice}</span><button onClick={()=>setNotice('')}><XCircle size={16}/></button></div>}
  <div className="grid grid-cols-2 gap-3 xl:grid-cols-4"><Kpi label="Hồ sơ đang xử lý" value="8"/><Kpi label="Chờ duyệt" value="3"/><Kpi label="Thiếu hồ sơ" value="2"/><Kpi label="Đã nhập học" value={STUDENTS.length}/></div>
  <section className="rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row"><div className="relative max-w-sm flex-1"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Tìm mã hồ sơ, tên trẻ, lớp..." className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-rose-300"/></div><select value={status} onChange={e=>setStatus(e.target.value)} className="h-10 rounded-xl border border-slate-200 px-3 text-sm"><option>Tất cả</option><option>Chờ duyệt</option><option>Đã tiếp nhận</option><option>Thiếu hồ sơ</option><option>Đã duyệt</option></select><button onClick={()=>setNotice('Đã mở biểu mẫu tiếp nhận hồ sơ tuyển sinh mới.')} className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 py-2 text-xs font-semibold text-white"><Plus size={14}/> Tiếp nhận hồ sơ</button></div>
  <div className="max-h-[520px] overflow-auto"><table className="w-full text-left"><thead className="sticky top-0 bg-white"><tr className="border-b border-slate-100 text-[11px] text-slate-400"><th className="px-4 py-3">Hồ sơ</th><th>Trẻ</th><th>Đăng ký lớp</th><th>Nguồn</th><th>Trạng thái</th><th className="pr-4">Thao tác</th></tr></thead><tbody>{rows.map(r=><tr key={r.id} className="border-b border-slate-50 text-sm"><td className="px-4 py-3 font-semibold">{r.id}<p className="text-[10px] font-normal text-slate-400">{r.date}</p></td><td>{r.name}<p className="text-[10px] text-slate-400">{r.age}</p></td><td>{r.className}</td><td>{r.source}</td><td><span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold">{r.status}</span></td><td className="pr-4"><button onClick={()=>setNotice(`Đã mở hồ sơ ${r.id} để xử lý.`)} className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600"><FileText size={14}/> Xử lý</button></td></tr>)}</tbody></table></div></section>
 </div>
}
function Kpi({label,value}:{label:string;value:string|number}){return <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-2xl font-bold">{value}</p><p className="mt-1 text-xs text-slate-500">{label}</p></div>}
