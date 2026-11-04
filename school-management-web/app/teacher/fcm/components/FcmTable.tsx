import React from 'react';
import { ChevronRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { FCM_CLUSTERS } from '@/services/fcm';

interface FcmTableProps {
  month: number;
  year: number;
  totalChildren: number;
  childrenList: any[];
  onViewChildTimeline: (child: any) => void;
}

export function FcmTable({
  month,
  year,
  totalChildren,
  childrenList,
  onViewChildTimeline,
}: FcmTableProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-slate-800">
            Kết Quả Phân Cụm Học Sinh - Tháng {month}/{year}
          </h3>
          <p className="text-xs text-slate-500">
            Bấm vào tên bé để xem Dòng thời gian tiến bộ (Tháng trước ➔ Tháng này) và biểu đồ mạng nhện 5 miền.
          </p>
        </div>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          Sĩ số: {totalChildren} bé
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 border-b border-slate-100">
            <tr>
              <th className="py-3 px-4">Học sinh</th>
              <th className="py-3 px-4">Cụm hiện tại (FCM)</th>
              <th className="py-3 px-4">Độ thuộc mờ (Memberships)</th>
              <th className="py-3 px-4">Tiến trình so với tháng trước</th>
              <th className="py-3 px-4 text-right">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {childrenList.map((child: any) => {
              const clusterId = child.ClusterId;
              const meta = clusterId ? FCM_CLUSTERS[clusterId] : null;
              const mems = Array.isArray(child.Memberships) ? child.Memberships : [];

              const trend = child.Trend;
              const prevClusterId = child.PreviousClusterId;

              return (
                <tr key={child.ChildId} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 font-extrabold flex items-center justify-center text-xs">
                        {child.TenHocSinh ? child.TenHocSinh.slice(0, 2).toUpperCase() : 'HS'}
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-900 block">{child.TenHocSinh}</span>
                        <span className="text-[10px] text-slate-400">
                          {child.GioiTinh === 'Nữ' ? 'Nữ' : 'Nam'} · {child.NgaySinh ? String(child.NgaySinh).slice(0, 10) : ''}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    {meta ? (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${meta.badgeBg} ${meta.badgeText}`}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta.color }}></span>
                        {meta.name}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Chưa chạy phân cụm</span>
                    )}
                  </td>

                  <td className="py-3 px-4 font-mono text-[11px]">
                    {mems.length > 0 ? (
                      <div className="flex items-center gap-1">
                        <span title="Độ thuộc Cụm 1" className="text-purple-600 font-bold">{(mems[0] * 100).toFixed(0)}%</span> /
                        <span title="Độ thuộc Cụm 2" className="text-emerald-600 font-bold">{(mems[1] * 100).toFixed(0)}%</span> /
                        <span title="Độ thuộc Cụm 3" className="text-amber-600 font-bold">{(mems[2] * 100).toFixed(0)}%</span> /
                        <span title="Độ thuộc Cụm 4" className="text-rose-600 font-bold">{(mems[3] * 100).toFixed(0)}%</span>
                      </div>
                    ) : (
                      <span className="text-slate-400">--</span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    {prevClusterId ? (
                      <div className="flex items-center gap-1.5">
                        {trend === 'IMPROVED' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <TrendingUp size={13} /> Tiến bộ (Cụm {prevClusterId} ➔ Cụm {clusterId})
                          </span>
                        ) : trend === 'ATTENTION' ? (
                          <span className="inline-flex items-center gap-1 text-rose-700 font-extrabold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                            <TrendingDown size={13} /> Cần chú ý (Cụm {prevClusterId} ➔ Cụm {clusterId})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
                            <Minus size={13} /> Duy trì Cụm {clusterId}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[10px]">Tháng đầu tiên</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onViewChildTimeline(child)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition cursor-pointer"
                    >
                      <span>Xem tiến trình</span>
                      <ChevronRight size={13} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
