import React from 'react';
import Avatar from '../../components/Avatar';
import { Child } from '../../data';
import { evaluateWhoMetrics } from './whoStandards';

interface TeacherHealthEntryTableProps {
  filteredChildren: Child[];
  weightVals: Record<number, string>;
  setWeightVals: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  heightVals: Record<number, string>;
  setHeightVals: React.Dispatch<React.SetStateAction<Record<number, string>>>;
}

export function TeacherHealthEntryTable({
  filteredChildren,
  weightVals,
  setWeightVals,
  heightVals,
  setHeightVals,
}: TeacherHealthEntryTableProps) {
  return (
    <div className="rounded-3xl border border-orange-100 bg-white overflow-hidden shadow-xs">
      <div className="overflow-x-auto w-full max-w-full">
        <table className="w-full min-w-[850px] text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-600 bg-orange-50/50">
              <th className="py-3.5 px-4 font-black">Học sinh</th>
              <th className="py-3.5 px-4 font-black">Giới tính & Tuổi</th>
              <th className="py-3.5 px-4 text-center font-black min-w-[130px]">
                Cân nặng (kg) <span className="text-rose-500">*</span>
              </th>
              <th className="py-3.5 px-4 text-center font-black min-w-[130px]">
                Chiều cao (cm) <span className="text-rose-500">*</span>
              </th>
              <th className="py-3.5 px-3 text-center font-black">
                Chiều cao / Tuổi
              </th>
              <th className="py-3.5 px-3 text-center font-black">
                Cân nặng / Tuổi
              </th>
              <th className="py-3.5 px-3 text-center font-black">
                Thể trạng
              </th>
              <th className="py-3.5 px-4 text-right font-black min-w-[160px]">
                Kết luận thể trạng
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredChildren.map((c) => {
              const w = parseFloat(weightVals[c.id] || '0');
              const h = parseFloat(heightVals[c.id] || '0');
              const hasValidData = w > 0 && h > 0;
              const gender = c.gender === 'F' ? 'Nữ' : 'Nam';
              const assessment = hasValidData
                ? evaluateWhoMetrics(w, h, c.dob, gender)
                : null;

              return (
                <tr key={c.id} className="hover:bg-orange-50/30 transition">
                  {/* Cột Học sinh */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar initials={c.avatar} id={c.id} size="sm" />
                      <div>
                        <p className="font-black text-slate-800">{c.name}</p>
                        <p className="text-[11px] text-slate-400 font-medium">({c.nickname})</p>
                      </div>
                    </div>
                  </td>

                  {/* Cột Giới tính & Ngày sinh */}
                  <td className="py-3 px-4 text-slate-500 font-medium">
                    <span
                      className={`font-bold ${
                        c.gender === 'F' ? 'text-rose-500' : 'text-blue-500'
                      }`}
                    >
                      {c.gender === 'F' ? '♀ Bé gái' : '♂ Bé trai'}
                    </span>
                    {c.dob && (
                      <div className="text-[10px] text-slate-400">
                        {c.dob} ({assessment?.ageMonths ?? '--'} tháng)
                      </div>
                    )}
                  </td>

                  {/* Cột Nhập Cân nặng */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <input
                        type="number"
                        step="0.1"
                        min="5"
                        max="80"
                        value={weightVals[c.id] || ''}
                        onChange={(e) =>
                          setWeightVals((prev) => ({
                            ...prev,
                            [c.id]: e.target.value,
                          }))
                        }
                        placeholder="vd: 16.5"
                        className="w-24 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-right font-bold text-slate-800 outline-none focus:border-orange-400 focus:bg-white transition"
                      />
                      <span className="text-[11px] font-bold text-slate-400">kg</span>
                    </div>
                  </td>

                  {/* Cột Nhập Chiều cao */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <input
                        type="number"
                        step="0.1"
                        min="50"
                        max="160"
                        value={heightVals[c.id] || ''}
                        onChange={(e) =>
                          setHeightVals((prev) => ({
                            ...prev,
                            [c.id]: e.target.value,
                          }))
                        }
                        placeholder="vd: 102.0"
                        className="w-24 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-right font-bold text-slate-800 outline-none focus:border-orange-400 focus:bg-white transition"
                      />
                      <span className="text-[11px] font-bold text-slate-400">cm</span>
                    </div>
                  </td>

                  {/* Cột Chiều cao / Tuổi */}
                  <td className="py-3 px-3 text-center">
                    {assessment ? (
                      <span className={`text-[11px] font-bold ${assessment.haz.textClass}`}>
                        {assessment.haz.code === 'BINH_THUONG' ? 'Đạt chuẩn' : assessment.haz.label}
                      </span>
                    ) : (
                      <span className="text-slate-300 italic">—</span>
                    )}
                  </td>

                  {/* Cột Cân nặng / Tuổi */}
                  <td className="py-3 px-3 text-center">
                    {assessment ? (
                      <span className={`text-[11px] font-bold ${assessment.waz.textClass}`}>
                        {assessment.waz.code === 'BINH_THUONG' ? 'Đạt chuẩn' : assessment.waz.label}
                      </span>
                    ) : (
                      <span className="text-slate-300 italic">—</span>
                    )}
                  </td>

                  {/* Cột Thể trạng Cân nặng / Chiều cao */}
                  <td className="py-3 px-3 text-center">
                    {assessment ? (
                      <span className={`text-[11px] font-bold ${assessment.whz.textClass}`}>
                        {assessment.whz.code === 'BINH_THUONG' ? 'Cân đối' : assessment.whz.label}
                      </span>
                    ) : (
                      <span className="text-slate-300 italic">—</span>
                    )}
                  </td>

                  {/* Cột Kết luận thể trạng */}
                  <td className="py-3 px-4 text-right">
                    {assessment ? (
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black border ${
                          assessment.canCanThiep
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        }`}
                      >
                        {assessment.trangThaiTongThe}
                      </span>
                    ) : (
                      <span className="text-slate-300 text-xs italic">Chờ nhập số đo</span>
                    )}
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
