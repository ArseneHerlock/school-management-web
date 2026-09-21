'use client';
export default function StarRating({ value, onChange, readonly=false }:{ value:number; onChange?:(v:number)=>void; readonly?:boolean }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s=>(
        <button key={s} onClick={()=>!readonly&&onChange?.(s)} disabled={readonly}
          className={`text-lg transition-transform ${!readonly?'hover:scale-110 cursor-pointer':'cursor-default'} ${s<=value?'text-orange-400':'text-slate-200'}`}>★</button>
      ))}
    </div>
  );
}
