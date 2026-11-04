import React from 'react';
import { Award, Compass, HeartPulse, Sparkles, CheckCircle2 } from 'lucide-react';

export function YearEndAwardsCriteriaTable() {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 text-xs font-black text-slate-800">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-100 text-orange-700">
            <Award size={14} />
          </span>
          <span>BẢNG TIÊU CHÍ BÌNH XÉT DANH HIỆU TỔNG KẾT CUỐI NĂM HỌC</span>
        </div>
        <div className="text-[11px] text-slate-500 font-medium">
          Dựa trên cả quá trình tích lũy: <strong className="text-slate-700">Chuyên cần (%)</strong> • <strong className="text-slate-700">Sức khỏe 4 Quý (WHO)</strong> • <strong className="text-slate-700">Hoạt động cả năm (%)</strong>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left text-xs text-slate-700 border-collapse">
          <thead className="bg-slate-50 text-[11px] font-extrabold text-slate-800 border-b border-slate-200 uppercase tracking-wider">
            <tr>
              <th className="py-2.5 px-3 border-r border-slate-200 w-12 text-center">STT</th>
              <th className="py-2.5 px-3 border-r border-slate-200">Tên danh hiệu</th>
              <th className="py-2.5 px-3 border-r border-slate-200">1. Chuyên cần (%/Tổng ngày)</th>
              <th className="py-2.5 px-3 border-r border-slate-200">2. Sức khỏe theo Quý (WHO)</th>
              <th className="py-2.5 px-3">3. Hoạt động cả năm (Tiêu chí đạt)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-[11px]">
            <tr className="hover:bg-amber-50/40">
              <td className="py-2.5 px-3 border-r border-slate-200 text-center font-bold">1</td>
              <td className="py-2.5 px-3 border-r border-slate-200 font-black text-amber-900 text-xs">
                Bé Vững Vàng Toàn Diện
              </td>
              <td className="py-2.5 px-3 border-r border-slate-200 font-bold text-emerald-700">≥ 90%</td>
              <td className="py-2.5 px-3 border-r border-slate-200">
                <span className="font-bold text-emerald-800">≥ 3 quý đạt chuẩn WHO</span> (Duy trì kênh A toàn diện)
              </td>
              <td className="py-2.5 px-3 font-bold text-purple-700">
                ≥ 90% số lần đạt các tiêu chí hoạt động
              </td>
            </tr>

            <tr className="hover:bg-rose-50/40">
              <td className="py-2.5 px-3 border-r border-slate-200 text-center font-bold">2</td>
              <td className="py-2.5 px-3 border-r border-slate-200 font-black text-rose-900 text-xs">
                Bé Khỏe - Bé Ngoan
              </td>
              <td className="py-2.5 px-3 border-r border-slate-200 font-bold text-emerald-700">≥ 90%</td>
              <td className="py-2.5 px-3 border-r border-slate-200">
                <span className="font-bold text-emerald-800">≥ 2 quý đạt chuẩn WHO</span> (Thể lực phát triển tốt)
              </td>
              <td className="py-2.5 px-3 font-bold text-purple-700">
                ≥ 80% số lần đạt các tiêu chí hoạt động
              </td>
            </tr>

            <tr className="hover:bg-emerald-50/40">
              <td className="py-2.5 px-3 border-r border-slate-200 text-center font-bold">3</td>
              <td className="py-2.5 px-3 border-r border-slate-200 font-black text-emerald-900 text-xs">
                Bé Chuyên Cần
              </td>
              <td className="py-2.5 px-3 border-r border-slate-200 font-bold text-emerald-700">≥ 90%</td>
              <td className="py-2.5 px-3 border-r border-slate-200">
                Được theo dõi y tế đầy đủ qua các quý
              </td>
              <td className="py-2.5 px-3 font-bold text-purple-700">
                ≥ 70% số lần đạt các tiêu chí hoạt động
              </td>
            </tr>

            <tr className="hover:bg-blue-50/40">
              <td className="py-2.5 px-3 border-r border-slate-200 text-center font-bold">4</td>
              <td className="py-2.5 px-3 border-r border-slate-200 font-black text-blue-900 text-xs">
                Bé Chăm Ngoan
              </td>
              <td className="py-2.5 px-3 border-r border-slate-200 font-bold text-slate-700">≥ 80% và &lt; 90%</td>
              <td className="py-2.5 px-3 border-r border-slate-200">
                Thể trạng ổn định hoặc có cải thiện
              </td>
              <td className="py-2.5 px-3 font-bold text-purple-700">
                ≥ 75% số lần đạt các tiêu chí hoạt động
              </td>
            </tr>

            <tr className="hover:bg-purple-50/40">
              <td className="py-2.5 px-3 border-r border-slate-200 text-center font-bold">5</td>
              <td className="py-2.5 px-3 border-r border-slate-200 font-black text-purple-900 text-xs">
                Bé Có Nhiều Tiến Bộ
              </td>
              <td className="py-2.5 px-3 border-r border-slate-200">Không ràng buộc</td>
              <td className="py-2.5 px-3 border-r border-slate-200 text-slate-600">
                Phục hồi dinh dưỡng tốt qua các quý
              </td>
              <td className="py-2.5 px-3 text-purple-800 font-semibold">
                Có sự nỗ lực và tiến bộ vượt bậc so với đầu năm
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
