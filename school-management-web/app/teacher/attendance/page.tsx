'use client';
import { useState } from 'react';
import { CHILDREN } from '../data/mockData';
import Avatar from '../components/Avatar';

export default function AttendancePage() {
  const [absentIds, setAbsentIds] = useState<Set<number>>(new Set([4,11]));
  const [lateIds,   setLateIds]   = useState<Set<number>>(new Set([7]));
  const [noteMap,   setNoteMap]   = useState<Record<number,string>>({4:'Bé ốm sốt',11:'Gia đình có việc'});
  const [submitted, setSubmitted] = useState(false);
  const [search,    setSearch]    = useState('');
  const [openNote,  setOpenNote]  = useState<number|null>(null);
  const [tempNote,  setTempNote]  = useState('');

  const filtered = CHILDREN.filter(c=>
    c.nickname.toLowerCase().includes(search.toLowerCase()) ||
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id:number, type:'absent'|'late') => {
    setSubmitted(false);
    if(type==='absent'){
      setAbsentIds(prev=>{ const n=new Set(prev); n.has(id)?n.delete(id):(n.add(id),setLateIds(p=>{ const l=new Set(p);l.delete(id);return l;})); return n; });
    } else {
      setLateIds(prev=>{ const n=new Set(prev); n.has(id)?n.delete(id):(n.add(id),setAbsentIds(p=>{ const a=new Set(p);a.delete(id);return a;})); return n; });
    }
  };

  const presentCount = CHILDREN.length - absentIds.size;
  const today = new Date().toLocaleDateString('vi-VN',{weekday:'long',day:'2-digit',month:'2-digit',year:'numeric'});

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-4">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-5 text-white shadow-lg shadow-orange-200">
        <h2 className="font-bold text-xl mb-1">📋 Điểm danh hôm nay</h2>
        <p className="text-orange-100 text-sm" suppressHydrationWarning>{today}</p>
        <div className="flex gap-3 mt-4">
          {[['Có mặt',presentCount,'bg-green-400'],['Vắng',absentIds.size,'bg-red-400'],['Trễ',lateIds.size,'bg-yellow-400'],['Tổng',CHILDREN.length,'bg-white/20']].map(([l,v,b])=>(
            <div key={String(l)} className={`${b} rounded-xl px-4 py-2 text-center flex-1`}>
              <div className="text-2xl font-black">{String(v)}</div>
              <div className="text-xs text-white/90">{String(l)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tip */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2 text-sm text-amber-800">
        <span>💡</span><span><strong>Mặc định tất cả bé có mặt.</strong> Chỉ đánh dấu bé vắng hoặc trễ!</span>
      </div>

      {/* Search */}
      <input value={search} onChange={e=>setSearch(e.target.value)}
        placeholder="🔍 Tìm tên bé..."
        className="w-full px-4 py-2.5 bg-white border border-orange-200 rounded-xl text-sm focus:outline-none focus:border-orange-400" />

      {submitted&&(
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2 slide-in">
          <span>✅</span><span className="text-green-700 font-semibold text-sm">Đã lưu điểm danh! ({presentCount}/{CHILDREN.length} có mặt)</span>
        </div>
      )}

      {/* List */}
      <div className="flex flex-col gap-2">
        {filtered.map(child=>{
          const isAbsent=absentIds.has(child.id), isLate=lateIds.has(child.id);
          return (
            <div key={child.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${isAbsent?'bg-red-50 border-red-200':isLate?'bg-yellow-50 border-yellow-300':'bg-white border-slate-100'}`}>
              <Avatar initials={child.avatar} id={child.id} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-slate-800">{child.nickname}</p>
                {child.notes&&<p className="text-xs text-amber-600 truncate">⚠️ {child.notes}</p>}
                {noteMap[child.id]&&<p className="text-xs text-slate-500 truncate italic">{noteMap[child.id]}</p>}
              </div>
              <div className="flex items-center gap-1.5">
                {!isAbsent&&!isLate&&<span className="text-xs text-green-600 font-semibold px-2 py-0.5 bg-green-100 rounded-full">Có mặt</span>}
                <button onClick={()=>toggle(child.id,'late')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${isLate?'bg-yellow-400 text-white':'bg-white border border-yellow-300 text-yellow-600 hover:bg-yellow-50'}`}>Trễ</button>
                <button onClick={()=>toggle(child.id,'absent')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${isAbsent?'bg-red-400 text-white':'bg-white border border-red-200 text-red-500 hover:bg-red-50'}`}>Vắng</button>
                {(isAbsent||isLate)&&(
                  <button onClick={()=>{setTempNote(noteMap[child.id]||'');setOpenNote(child.id);}}
                    className="w-7 h-7 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 text-sm">📝</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={()=>setSubmitted(true)}
        className="w-full bg-orange-400 hover:bg-orange-500 text-white py-3.5 rounded-2xl font-bold transition-colors shadow-lg shadow-orange-200">
        ✅ Xác nhận điểm danh ({presentCount}/{CHILDREN.length} có mặt)
      </button>

      {/* Note modal */}
      {openNote!==null&&(
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end" onClick={()=>setOpenNote(null)}>
          <div className="bg-white w-full max-w-lg mx-auto rounded-t-3xl p-5 slide-in" onClick={e=>e.stopPropagation()}>
            <h3 className="font-bold text-slate-800 mb-3">📝 Ghi chú — {CHILDREN.find(c=>c.id===openNote)?.name}</h3>
            <textarea value={tempNote} onChange={e=>setTempNote(e.target.value)}
              className="w-full border border-orange-200 rounded-xl p-3 text-sm focus:outline-none focus:border-orange-400 resize-none" rows={3}
              placeholder="Lý do vắng mặt / đi trễ..." autoFocus />
            <div className="flex gap-2 mt-3">
              <button onClick={()=>setOpenNote(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-500">Huỷ</button>
              <button onClick={()=>{if(openNote!==null)setNoteMap(p=>({...p,[openNote]:tempNote}));setOpenNote(null);}}
                className="flex-1 bg-orange-400 text-white py-2.5 rounded-xl font-bold text-sm">Lưu ghi chú</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
