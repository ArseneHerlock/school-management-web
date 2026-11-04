import React from 'react';
import { History } from 'lucide-react';
import Avatar from '../../components/Avatar';
import { Child } from '../../data';
import { evaluateWhoMetrics } from './whoStandards';

interface TeacherHealthOverviewTableProps {
  childrenList: Child[];
  liveHealth: Record<string, any>;
  onOpenHistoryModal: (c: Child) => void;
}

export function TeacherHealthOverviewTable({
  childrenList,
  liveHealth,
  onOpenHistoryModal,
}: TeacherHealthOverviewTableProps) {
  return (
    <div className="rounded-3xl border border-orange-100 bg-white overflow-hidden shadow-xs space-y-4">
      <div className="p-5 bg-orange-50/60 border-b border-orange-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black uppercase text-slate-800 tracking-wide">
            Bảng tổng hợp chỉ số thể lực & Phân loại WHO lớp học
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Chỉ số BMI được tự động tính từ cân nặng và chiều cao mới nhất.
          </p>
        </div>
        <span className="text-xs text-orange-600 font-extrabold bg-orange-100 px-3 py-1 rounded-full">
          {childrenList.length} học sinh
        </span>
      </div>

      <div className="overflow-x-auto px-3 sm:px-5 pb-5 w-full max-w-full">
        <div className="sm:hidden text-[10px] text-orange-600 font-bold mb-2 text-right">
          Vuốt ngang để xem đầy đủ cột →
        </div>
        <table className="w-full min-w-[760px] text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-500 bg-slate-50/60">
              <th className="py-3 px-4 font-bold">Học sinh</th>
              <th className="py-3 px-4 font-bold">Giới tính & Tuổi</th>
              <th className="py-3 px-4 text-center font-bold">Chiều cao / Cân nặng</th>
              <th className="py-3 px-4 text-center font-bold">HAZ (Chiều cao/Tuổi)</th>
              <th className="py-3 px-4 text-center font-bold">WAZ (Cân nặng/Tuổi)</th>
              <th className="py-3 px-4 text-center font-bold">WHZ (Cân nặng/Chiều cao)</th>
              <th className="py-3 px-4 text-center font-bold">Đánh giá WHO</th>
              <th className="py-3 px-4 text-right font-bold">Lịch sử tiến trình</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {childrenList.map((c) => {
              const rec = liveHealth[c.id];
              const w = rec?.canNang != null ? Number(rec.canNang) : null;
              const h = rec?.chieuCao != null ? Number(rec.chieuCao) : null;
              const gender = c.gender === 'F' ? 'F' : 'M';
              const who = w && h && w > 0 && h > 0
                ? evaluateWhoMetrics(w, h, c.dob, gender, rec?.ngayDo)
                : null;

              return (
                <tr key={c.id} className="hover:bg-orange-50/30 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar initials={c.avatar} id={c.id} size="xs" />
                      <div>
                        <p className="font-black text-slate-800">{c.name}</p>
                        <p className="text-[11px] text-slate-400 font-medium">({c.nickname})</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-slate-500">
                    <span className={c.gender === 'F' ? 'text-rose-500 font-bold' : 'text-blue-500 font-bold'}>
                      {c.gender === 'F' ? '♀ Nữ' : '♂ Nam'}
                    </span>
                    {c.dob && <span className="ml-2 text-slate-400">· {c.dob}</span>}
                  </td>

                  <td className="py-3 px-4 text-center font-bold text-slate-700">
                    {h != null && w != null ? `${h} cm · ${w} kg` : (h ? `${h} cm` : (w ? `${w} kg` : '—'))}
                  </td>

                  {/* HAZ */}
                  <td className="py-3 px-4 text-center">
                    {who ? (
                      <div>
                        <span className={`font-mono font-black text-xs ${who.haz.isAlert ? 'text-blue-700' : 'text-slate-700'}`}>
                          {who.haz.zScore > 0 ? `+${who.haz.zScore}` : who.haz.zScore} SD
                        </span>
                        <div className="text-[10px] text-slate-500">
                          {who.haz.code === 'BINH_THUONG' ? 'Đạt chuẩn WHO' : who.haz.label}
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-300 italic">—</span>
                    )}
                  </td>

                  {/* WAZ */}
                  <td className="py-3 px-4 text-center">
                    {who ? (
                      <div>
                        <span className={`font-mono font-black text-xs ${who.waz.isAlert ? 'text-amber-700' : 'text-slate-700'}`}>
                          {who.waz.zScore > 0 ? `+${who.waz.zScore}` : who.waz.zScore} SD
                        </span>
                        <div className="text-[10px] text-slate-500">
                          {who.waz.code === 'BINH_THUONG' ? 'Đạt chuẩn WHO' : who.waz.label}
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-300 italic">—</span>
                    )}
                  </td>

                  {/* WHZ */}
                  <td className="py-3 px-4 text-center">
                    {who ? (
                      <div>
                        <span className={`font-mono font-black text-xs ${who.whz.isAlert ? 'text-rose-700' : 'text-slate-700'}`}>
                          {who.whz.zScore > 0 ? `+${who.whz.zScore}` : who.whz.zScore} SD
                        </span>
                        <div className="text-[10px] text-slate-500">
                          {who.whz.code === 'BINH_THUONG' ? 'Đạt chuẩn WHO' : who.whz.label}
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-300 italic">—</span>
                    )}
                  </td>

                  {/* Đánh giá tổng hợp */}
                  <td className="py-3 px-4 text-center">
                    {who ? (
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                          who.canCanThiep
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {who.trangThaiTongThe}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px] italic">Chưa đo</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onOpenHistoryModal(c)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-orange-200 bg-orange-50 text-xs font-black text-orange-600 hover:bg-orange-100 transition cursor-pointer"
                    >
                      <History size={13} />
                      <span>Xem tiến trình</span>
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
