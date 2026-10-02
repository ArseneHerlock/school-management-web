'use client'

import { useMemo, useState } from 'react'
import { KeyRound, Lock, Plus, Search, ShieldCheck, UserCog, UserRound, Unlock, X } from 'lucide-react'
import { PARENTS, TEACHERS } from '../data'
import Modal from '../components/shared/Modal'

type Account = {
  id: string
  name: string
  role: 'Admin' | 'Giáo viên' | 'Nhân viên' | 'Phụ huynh'
  username: string
  phone: string
  status: 'Hoạt động' | 'Bị khóa' | 'Chưa kích hoạt'
  lastLogin: string
}

const INITIAL_ACCOUNTS: Account[] = [
  { id: 'TK001', name: 'Nguyễn Phương', role: 'Admin', username: 'nguyenphuong', phone: '0979 000 111', status: 'Hoạt động', lastLogin: 'Hôm nay 14:32' },
  ...TEACHERS.map((t, i): Account => ({
    id: `TK-GV-${String(i + 1).padStart(3, '0')}`,
    name: t.name,
    role: t.role === 'Ban giám hiệu' ? 'Admin' : t.role === 'Nhân viên' ? 'Nhân viên' : 'Giáo viên',
    username: t.email.split('@')[0],
    phone: t.phone,
    status: i === 5 ? 'Bị khóa' : 'Hoạt động',
    lastLogin: i % 2 ? 'Hôm qua 16:48' : 'Hôm nay 08:12',
  })),
  ...PARENTS.map((p, i): Account => ({
    id: `TK-PH-${String(i + 1).padStart(3, '0')}`,
    name: p.name,
    role: 'Phụ huynh',
    username: p.email.split('@')[0],
    phone: p.phone,
    status: i === 4 ? 'Chưa kích hoạt' : 'Hoạt động',
    lastLogin: i % 3 === 0 ? 'Hôm nay 07:41' : '17/09/2026 20:15',
  })),
]

export default function TaiKhoan() {
  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS)
  const [role, setRole] = useState('Tất cả')
  const [status, setStatus] = useState('Tất cả')
  const [search, setSearch] = useState('')
  const [notice, setNotice] = useState('')
  const [selected, setSelected] = useState<Account | null>(null)
  const [creating, setCreating] = useState(false)

  const filtered = useMemo(() => accounts.filter(a =>
    (role === 'Tất cả' || a.role === role) &&
    (status === 'Tất cả' || a.status === status) &&
    `${a.name} ${a.username} ${a.phone} ${a.id}`.toLowerCase().includes(search.toLowerCase())
  ), [accounts, role, status, search])

  const changeStatus = (id: string, next: Account['status']) => {
    setAccounts(xs => xs.map(a => a.id === id ? { ...a, status: next } : a))
    setSelected(null)
    setNotice(next === 'Bị khóa' ? 'Đã khóa tài khoản.' : next === 'Hoạt động' ? 'Đã mở khóa tài khoản.' : 'Đã chuyển tài khoản sang trạng thái chưa kích hoạt.')
  }

  return <div className="space-y-5 p-6">
    <header>
      <p className="text-xs font-bold uppercase tracking-[.16em] text-rose-500">Tài khoản người dùng</p>
      <div className="mt-1 flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="flex-1"><h1 className="text-2xl font-bold text-slate-900">Quản lý tài khoản</h1><p className="mt-1 max-w-3xl text-sm text-slate-500">Quản lý tài khoản đăng nhập của Admin, giáo viên, nhân viên và phụ huynh: tạo tài khoản, kích hoạt, khóa/mở khóa và đặt lại mật khẩu.</p></div>
        <button onClick={() => setCreating(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white"><Plus size={16}/>Tạo tài khoản</button>
      </div>
    </header>

    {notice && <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{notice}<button onClick={() => setNotice('')}><X size={15}/></button></div>}

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Kpi label="Tổng tài khoản" value={accounts.length} sub="Tất cả vai trò" />
      <Kpi label="Đang hoạt động" value={accounts.filter(a => a.status === 'Hoạt động').length} sub="Có thể đăng nhập" />
      <Kpi label="Bị khóa" value={accounts.filter(a => a.status === 'Bị khóa').length} sub="Cần xử lý nếu cần" tone="rose" />
      <Kpi label="Chưa kích hoạt" value={accounts.filter(a => a.status === 'Chưa kích hoạt').length} sub="Chưa thể đăng nhập" tone="amber" />
    </div>

    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 xl:flex-row xl:items-center">
        <div className="relative w-full max-w-md"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm tên, tên đăng nhập, SĐT, mã tài khoản..." className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-rose-300"/></div>
        <select value={role} onChange={e => setRole(e.target.value)} className="h-10 rounded-xl border border-slate-200 px-3 text-sm"><option>Tất cả</option><option>Admin</option><option>Giáo viên</option><option>Nhân viên</option><option>Phụ huynh</option></select>
        <select value={status} onChange={e => setStatus(e.target.value)} className="h-10 rounded-xl border border-slate-200 px-3 text-sm"><option>Tất cả</option><option>Hoạt động</option><option>Bị khóa</option><option>Chưa kích hoạt</option></select>
      </div>
      <div className="overflow-auto"><table className="w-full min-w-[1000px]"><thead className="bg-slate-50"><tr>{['Tài khoản','Vai trò','Tên đăng nhập','Liên hệ','Trạng thái','Đăng nhập gần nhất','Thao tác'].map(h => <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-slate-100">{filtered.map(a => <tr key={a.id} className="hover:bg-slate-50">
          <td className="px-4 py-4"><p className="text-sm font-semibold">{a.name}</p><p className="text-[10px] text-slate-400">{a.id}</p></td>
          <td className="px-4 py-4"><span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold">{a.role}</span></td>
          <td className="px-4 py-4 text-xs font-medium">{a.username}</td><td className="px-4 py-4 text-xs text-slate-600">{a.phone}</td>
          <td className="px-4 py-4"><Status status={a.status}/></td><td className="px-4 py-4 text-xs text-slate-500">{a.lastLogin}</td>
          <td className="px-4 py-4"><button onClick={() => setSelected(a)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50">Quản lý</button></td>
        </tr>)}</tbody>
      </table></div>
      {!filtered.length && <div className="p-10 text-center text-sm text-slate-400">Không tìm thấy tài khoản phù hợp.</div>}
    </section>

    <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name || ''} description="Quản lý trạng thái và quyền đăng nhập của tài khoản.">
      {selected && <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2"><Info label="Vai trò" value={selected.role}/><Info label="Tên đăng nhập" value={selected.username}/><Info label="Số điện thoại" value={selected.phone}/><Info label="Trạng thái" value={selected.status}/></div>
        <div className="grid gap-2 sm:grid-cols-2">
          {selected.status === 'Bị khóa' ? <button onClick={() => changeStatus(selected.id, 'Hoạt động')} className="rounded-xl bg-emerald-600 px-3 py-2.5 text-xs font-semibold text-white"><Unlock size={14} className="mr-1 inline"/>Mở khóa tài khoản</button> : <button onClick={() => changeStatus(selected.id, 'Bị khóa')} className="rounded-xl bg-rose-600 px-3 py-2.5 text-xs font-semibold text-white"><Lock size={14} className="mr-1 inline"/>Khóa tài khoản</button>}
          <button onClick={() => setNotice(`Đã gửi yêu cầu đặt lại mật khẩu cho ${selected.name}.`)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold"><KeyRound size={14} className="mr-1 inline"/>Đặt lại mật khẩu</button>
          {selected.status === 'Chưa kích hoạt' && <button onClick={() => changeStatus(selected.id, 'Hoạt động')} className="rounded-xl bg-slate-900 px-3 py-2.5 text-xs font-semibold text-white">Kích hoạt tài khoản</button>}
        </div>
      </div>}
    </Modal>

    <Modal open={creating} onClose={() => setCreating(false)} title="Tạo tài khoản" description="Tạo tài khoản đăng nhập cho một người dùng trong trường.">
      <CreateAccount onSave={(name, r, username) => { setAccounts(xs => [{ id: `TK-${String(xs.length + 1).padStart(3, '0')}`, name, role: r, username, phone: 'Chưa cập nhật', status: 'Chưa kích hoạt', lastLogin: 'Chưa đăng nhập' }, ...xs]); setCreating(false); setNotice(`Đã tạo tài khoản ${username} ở trạng thái chưa kích hoạt.`) }}/>
    </Modal>
  </div>
}

function CreateAccount({onSave}:{onSave:(name:string,role:Account['role'],username:string)=>void}) {
 const [name,setName]=useState(''); const [role,setRole]=useState<Account['role']>('Giáo viên'); const [username,setUsername]=useState('')
 return <div className="space-y-3"><label className="block"><span className="mb-1.5 block text-xs font-semibold">Họ và tên</span><input value={name} onChange={e=>setName(e.target.value)} className="input" placeholder="Nhập họ tên"/></label><label className="block"><span className="mb-1.5 block text-xs font-semibold">Vai trò</span><select value={role} onChange={e=>setRole(e.target.value as Account['role'])} className="input"><option>Admin</option><option>Giáo viên</option><option>Nhân viên</option><option>Phụ huynh</option></select></label><label className="block"><span className="mb-1.5 block text-xs font-semibold">Tên đăng nhập</span><input value={username} onChange={e=>setUsername(e.target.value)} className="input" placeholder="vd: nguyenan"/></label><button disabled={!name.trim()||!username.trim()} onClick={()=>onSave(name.trim(),role,username.trim())} className="mt-2 w-full rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40">Tạo tài khoản</button></div>
}
function Kpi({label,value,sub,tone='default'}:{label:string;value:string|number;sub:string;tone?:string}){return <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs text-slate-400">{label}</p><p className={`mt-1 text-xl font-bold ${tone==='rose'?'text-rose-600':tone==='amber'?'text-amber-600':'text-slate-900'}`}>{value}</p><p className="mt-1 text-[10px] text-slate-400">{sub}</p></div>}
function Status({status}:{status:Account['status']}){const ok=status==='Hoạt động';return <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${ok?'bg-emerald-50 text-emerald-700':status==='Bị khóa'?'bg-rose-50 text-rose-700':'bg-amber-50 text-amber-700'}`}>{status}</span>}
function Info({label,value}:{label:string;value:string}){return <div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] text-slate-400">{label}</p><p className="mt-1 text-sm font-semibold">{value}</p></div>}
