const COLORS = ['#f97316','#ec4899','#3b82f6','#a855f7','#22c55e','#f59e0b','#06b6d4','#84cc16'];
export const avatarColor = (id: number) => COLORS[id % COLORS.length];

type Size = 'xs'|'sm'|'md'|'lg';
const SIZE: Record<Size,string> = { xs:'w-6 h-6 text-xs', sm:'w-8 h-8 text-xs', md:'w-10 h-10 text-sm', lg:'w-14 h-14 text-lg' };

export default function Avatar({ initials, id, size='md' }: { initials:string; id:number; size?:Size }) {
  return (
    <div className={`${SIZE[size]} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`}
         style={{ background: avatarColor(id) }}>
      {initials.slice(0,2)}
    </div>
  );
}
