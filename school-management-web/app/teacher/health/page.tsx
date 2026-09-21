'use client';
import { useState, useMemo } from 'react';
import { CHILDREN, HEALTH_METRICS } from '../data/mockData';
import Avatar from '../components/Avatar';

type Mode='entry'|'fcm'|'view';
export default function HealthPage(){
  const [mode,setMode]=useState<Mode>('entry');
  const [selMetric,setSelMetric]=useState('weight');
  const [vals,setVals]=useState<Record<string,Record<number,string>>>({});
  const [saved,setSaved]=useState(false);
  const metric=HEALTH_METRICS.find(m=>m.id===selMetric)!;

  const fcm=useMemo(()=>{
    const wv=CHILDREN.map(c=>({child:c,w:parseFloat(vals.weight?.[c.id]||'0')||13+(c.id%5)}));
    const avg=wv.reduce((s,v)=>s+v.w,0)/wv.length;
    const std=Math.sqrt(wv.reduce((s,v)=>s+Math.pow(v.w-avg,2),0)/wv.length);
    return{ low:wv.filter(v=>v.w<avg-std*.5), normal:wv.filter(v=>v.w>=avg-std*.5&&v.w<=avg+std*.5), high:wv.filter(v=>v.w>avg+std*.5), avg:avg.toFixed(1), std:std.toFixed(1) };
  },[vals]);

  return(
    <div className="max-w-3xl mx-auto flex flex-col gap-4">
      <div className="flex gap-2">
        {([['entry','📝 Nhập liệu'],['fcm','📊 Phân nhóm FCM'],['view','📈 Theo dõi']] as [Mode,string][]).map(([k,l])=>(
          <button key={k} onClick={()=>setMode(k)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${mode===k?'bg-orange-400 text-white shadow-md':'bg-white border border-orange-200 text-orange-600 hover:bg-orange-50'}`}>{l}</button>
        ))}
      </div>

      {mode==='entry'&&(<>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex gap-2 text-sm text-orange-800"><span>💡</span><span>Nhập theo từng chỉ số cho cả lớp — nhanh hơn!</span></div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {HEALTH_METRICS.map(m=>(
            <button key={m.id} onClick={()=>setSelMetric(m.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all ${selMetric===m.id?'bg-orange-400 text-white':'bg-white border border-orange-200 text-orange-700 hover:bg-orange-50'}`}>
              {m.icon} {m.label}
            </button>
          ))}
        </div>
        <div className="bg-white border border-orange-100 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 bg-orange-50 border-b border-orange-100 flex items-center gap-2">
            <span className="text-xl">{metric.icon}</span>
            <span className="font-bold text-orange-800">{metric.label} ({metric.unit})</span>
          </div>
          <div className="divide-y divide-orange-50 max-h-96 overflow-y-auto">
            {CHILDREN.map(c=>(
              <div key={c.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50/50">
                <Avatar initials={c.avatar} id={c.id} size="sm"/>
                <span className="flex-1 text-sm font-semibold text-slate-700">{c.nickname}</span>
                <input type="number" value={vals[selMetric]?.[c.id]||''} onChange={e=>setVals(p=>({...p,[selMetric]:{...p[selMetric],[c.id]:e.target.value}}))}
                  placeholder={selMetric==='weight'?'13.5':selMetric==='height'?'95.0':'48.0'}
                  className="w-20 border border-orange-200 rounded-lg px-2.5 py-1.5 text-sm text-right no-spin font-mono focus:outline-none focus:border-orange-400"/>
                <span className="text-xs text-slate-400 w-6">{metric.unit}</span>
              </div>
            ))}
          </div>
        </div>
        {saved&&<div className="bg-green-50 border border-green-200 rounded-xl p-3 flex gap-2 slide-in text-sm text-green-700 font-semibold"><span>✅</span>Đã lưu chỉ số {metric.label}!</div>}
        <button onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),3000);}}
          className="w-full bg-orange-400 hover:bg-orange-500 text-white py-3.5 rounded-2xl font-bold transition-colors shadow-lg shadow-orange-200">
          💾 Lưu chỉ số {metric.label}
        </button>
      </>)}

      {mode==='fcm'&&(
        <div className="flex flex-col gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex gap-2 text-sm text-blue-800">
            <span>🧪</span><span>Phân nhóm FCM dựa trên cân nặng — Trung bình: <strong>{fcm.avg} kg</strong>, độ lệch: <strong>±{fcm.std} kg</strong></span>
          </div>
          {([['🔴 Nhóm thấp','red',fcm.low,'Tăng cường dinh dưỡng'],['🟢 Nhóm bình thường','green',fcm.normal,'Duy trì chế độ ăn cân đối'],['🔵 Nhóm cao','blue',fcm.high,'Tăng cường vận động']] as [string,string,typeof fcm.low,string][]).map(([label,c,group,advice])=>(
            <div key={label} className={`bg-${c}-50 border border-${c}-200 rounded-2xl p-4`}>
              <div className="flex items-center mb-1"><span className="font-bold text-slate-700">{label}</span><span className={`ml-auto px-2 py-0.5 bg-${c}-100 text-${c}-700 rounded-full text-xs font-bold`}>{group.length} bé</span></div>
              <p className="text-xs text-slate-500 mb-3 italic">💡 {advice}</p>
              <div className="flex flex-wrap gap-2">
                {group.map(({child,w})=>(
                  <div key={child.id} className="flex items-center gap-1.5 bg-white rounded-lg px-2 py-1 border border-slate-100">
                    <Avatar initials={child.avatar} id={child.id} size="xs"/>
                    <div><p className="text-xs font-semibold">{child.nickname}</p><p className="text-xs text-slate-400">{w.toFixed(1)} kg</p></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {mode==='view'&&(
        <div className="bg-white border border-orange-100 rounded-2xl overflow-hidden">
          <div className="grid bg-orange-50 px-3 py-2 text-xs font-bold text-slate-500 border-b border-orange-100" style={{gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr'}}>
            <span>Bé</span>{HEALTH_METRICS.map(m=><span key={m.id} className="text-center">{m.icon} {m.label}</span>)}
          </div>
          <div className="max-h-[450px] overflow-y-auto">
            {CHILDREN.map(c=>(
              <div key={c.id} className="grid px-3 py-2.5 border-b border-orange-50 last:border-0 items-center hover:bg-orange-50/30" style={{gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr'}}>
                <div className="flex items-center gap-1.5"><Avatar initials={c.avatar} id={c.id} size="xs"/><span className="text-xs font-semibold text-slate-700 truncate">{c.nickname}</span></div>
                {HEALTH_METRICS.map(m=>(
                  <span key={m.id} className="text-xs text-center text-slate-600 font-mono">
                    {vals[m.id]?.[c.id]||(m.id==='weight'?(13+(c.id%5)).toFixed(1):m.id==='height'?(90+(c.id%15)).toFixed(1):m.id==='head'?(47+(c.id%3)).toFixed(1):(52+(c.id%4)).toFixed(1))}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
