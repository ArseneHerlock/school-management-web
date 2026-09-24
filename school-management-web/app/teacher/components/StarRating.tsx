'use client';
export default function StarRating({ value, onChange, readonly=false }:{ value:number; onChange?:(v:number)=>void; readonly?:boolean }) {
  return (
    <div className="flex gap-1 bg-orange-100/50 px-2.5 py-1 rounded-xl border border-orange-200">
      {[1,2,3,4,5].map(s=>(
        <button key={s} onClick={()=>!readonly&&onChange?.(s)} disabled={readonly}
          className={`text-xl transition-transform ${!readonly?'hover:scale-125 cursor-pointer':'cursor-default'} ${s<=value?'text-orange-500 drop-shadow-sm':'text-orange-200'}`}>
          ★
        </button>
      ))}
    </div>
  );
}
