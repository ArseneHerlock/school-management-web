import type { ReactNode } from 'react'

interface StatCardProps { label:string; value:string|number; hint?:string; icon:ReactNode; tone?:'rose'|'amber'|'green'|'blue'|'violet' }
const tones={rose:'bg-rose-50 text-rose-600',amber:'bg-amber-50 text-amber-600',green:'bg-emerald-50 text-emerald-600',blue:'bg-sky-50 text-sky-600',violet:'bg-violet-50 text-violet-600'}
export default function StatCard({label,value,hint,icon,tone='rose'}:StatCardProps){return <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{value}</p>{hint&&<p className="mt-1 text-xs text-slate-400">{hint}</p>}</div><div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>{icon}</div></div></div>}
