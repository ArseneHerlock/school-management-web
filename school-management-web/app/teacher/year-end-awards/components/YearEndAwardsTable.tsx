import React, { useState } from 'react';
import {
  CalendarCheck,
  HeartPulse,
  Sparkles,
  Loader2,
  Award,
  Activity,
  CheckCircle2,
  AlertCircle,
  Eye,
  X,
  History,
} from 'lucide-react';
import { YearEndAwardItem } from '@/services/awards';
import { AVAILABLE_TITLES } from '../useYearEndAwards';

interface YearEndAwardsTableProps {
  loading: boolean;
  awards: YearEndAwardItem[];
  isApproved: boolean;
  onTitleChange: (childId: string, newTitle: string) => void;
  onNoteChange: (childId: string, note: string) => void;
}

export function YearEndAwardsTable({
  loading,
  awards,
  isApproved,
  onTitleChange,
  onNoteChange,
}: YearEndAwardsTableProps) {
  const [selectedChildForDetail, setSelectedChildForDetail] = useState<YearEndAwardItem | null>(null);

  return (
    <>
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden font-sans max-w-full">
        {loading ? (
          <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
            <Loader2 size={24} className="animate-spin text-orange-500" />
            <span className="text-xs">Đang tải và tổng hợp số liệu quá trình cả năm...</span>
          </div>
        ) : awards.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            Không có dữ liệu học sinh trong lớp.
          </div>
        ) : (
          <div className="overflow-x-auto w-full max-w-full">
            <table className="min-w-[760px] w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Học sinh</th>
                  <th className="py-3.5 px-4">1. Chuyên cần cả năm</th>
                  <th className="py-3.5 px-4">2. Sức khỏe theo Quý (WHO)</th>
                  <th className="py-3.5 px-4">3. Hoạt động cả năm</th>
                  <th className="py-3.5 px-4">Phân loại tiêu chuẩn</th>
                  <th className="py-3.5 px-4 min-w-[200px]">Danh hiệu chính thức</th>
                  <th className="py-3.5 px-4">Ghi chú</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {awards.map((item) => {
                  const hasAtt = item.attendanceRate !== null && item.attendanceRate !== undefined;
                  const normalQuarters = item.normalQuartersCount ?? (item.isHealthNormal ? 1 : 0);
                  const totalQuarters = item.totalQuartersCount ?? (item.quarterlyHealth?.length || 0);
                  const isHealthGood = normalQuarters >= 2 || item.isHealthNormal;
                  const hasAct = item.activityPassRate !== null && item.activityPassRate !== undefined;

                  return (
                    <tr key={item.childId} className="hover:bg-slate-50/70 transition">
                      {/* Cột 1: Thông tin bé */}
                      <td className="py-3.5 px-4">
                        <div className="font-black text-slate-900 text-sm">{item.childName}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span>{item.certificateCode ? `Mã GK: ${item.certificateCode}` : 'Chờ cấp mã GK'}</span>
                          {item.fcmClusterName && (
                            <span className="text-indigo-600 font-semibold">• Cụm {item.fcmClusterId}</span>
                          )}
                        </div>
                      </td>

                      {/* Tiêu chí 1: Chuyên cần cả năm */}
                      <td className="py-3.5 px-4">
                        {hasAtt ? (
                          <div>
                            <span
                              className={`inline-flex items-center gap-1 font-bold ${
                                Number(item.attendanceRate) >= 90
                                  ? 'text-emerald-700'
                                  : Number(item.attendanceRate) >= 80
                                  ? 'text-amber-700'
                                  : 'text-rose-700'
                              }`}
                            >
                              <CalendarCheck size={13} /> {item.attendanceRate}%
                            </span>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {item.presentDays}/{item.totalDays} ngày đến trường
                            </div>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Chưa có điểm danh</span>
                        )}
                      </td>

                      {/* Tiêu chí 2: Sức khỏe qua các Quý */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              isHealthGood
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : totalQuarters > 0
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                            }`}
                          >
                            <HeartPulse size={12} />
                            <span>
                              {totalQuarters > 0
                                ? `${normalQuarters}/${totalQuarters} quý chuẩn WHO`
                                : item.healthStatus}
                            </span>
                          </span>

                          {item.quarterlyHealth && item.quarterlyHealth.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setSelectedChildForDetail(item)}
                              className="text-[10px] text-blue-600 hover:text-blue-800 hover:underline font-semibold cursor-pointer inline-flex items-center gap-1"
                            >
                              <Eye size={10} /> Xem lịch sử 4 quý
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Tiêu chí 3: Hoạt động cả năm */}
                      <td className="py-3.5 px-4">
                        {hasAct ? (
                          <div>
                            <span
                              className={`inline-flex items-center gap-1 font-bold ${
                                Number(item.activityPassRate) >= 80
                                  ? 'text-purple-700'
                                  : Number(item.activityPassRate) >= 60
                                  ? 'text-blue-700'
                                  : 'text-slate-600'
                              }`}
                            >
                              <Sparkles size={13} /> {item.activityPassRate}% đạt
                            </span>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {item.passedAssessments}/{item.totalAssessments} lần đạt tiêu chí
                            </div>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Chưa có hoạt động</span>
                        )}
                      </td>

                      {/* Phân loại tiêu chuẩn dựa trên 3 tiêu chí */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 font-bold px-2 py-1 rounded-lg text-[11px]">
                          <Award size={12} className="text-orange-500" />
                          <span>{item.suggestedTitle}</span>
                        </div>
                        {!isApproved && item.awardTitle !== item.suggestedTitle && (
                          <button
                            type="button"
                            onClick={() => onTitleChange(item.childId, item.suggestedTitle)}
                            className="block text-[10px] text-indigo-600 hover:text-indigo-800 hover:underline font-semibold mt-0.5 cursor-pointer"
                          >
                            Áp dụng tiêu chuẩn
                          </button>
                        )}
                      </td>

                      {/* Danh hiệu chính thức */}
                      <td className="py-3.5 px-4">
                        <select
                          disabled={isApproved}
                          value={item.awardTitle || ''}
                          onChange={(e) => onTitleChange(item.childId, e.target.value)}
                          className={`w-full rounded-xl border px-3 py-1.5 text-xs font-black outline-none cursor-pointer transition ${
                            !item.awardTitle
                              ? 'border-amber-300 bg-amber-50/50 text-amber-900 focus:border-amber-500'
                              : 'border-slate-200 bg-white text-orange-950 focus:border-orange-500'
                          } disabled:bg-slate-50 disabled:cursor-not-allowed`}
                        >
                          <option value="">-- Chưa chọn danh hiệu --</option>
                          {AVAILABLE_TITLES.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                        {!item.awardTitle && (
                          <span className="block text-[10px] text-amber-600 font-bold mt-0.5">
                            Chưa chọn danh hiệu
                          </span>
                        )}
                      </td>

                      {/* Ghi chú */}
                      <td className="py-3.5 px-4">
                        <input
                          type="text"
                          disabled={isApproved}
                          value={item.teacherNote || ''}
                          onChange={(e) => onNoteChange(item.childId, e.target.value)}
                          placeholder="Nhận xét khen ngợi..."
                          className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 outline-none focus:border-orange-500 disabled:bg-slate-50"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Child Quarterly Health Timeline Modal */}
      {selectedChildForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden font-sans">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">
                  TIẾN TRÌNH SỨC KHỎE THEO CÁC QUÝ
                </span>
                <h3 className="text-sm font-black text-slate-800">
                  {selectedChildForDetail.childName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedChildForDetail(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Chi tiết các lần đo chiều cao, cân nặng và kết luận thể lực theo chuẩn WHO qua các đợt/quý trong năm học:
              </p>

              <div className="space-y-2.5">
                {selectedChildForDetail.quarterlyHealth?.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-extrabold text-slate-800 text-xs">{q.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Ngày đo: <strong>{new Date(q.date).toLocaleDateString('vi-VN')}</strong>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-black text-slate-800">
                        {q.weight} kg • {q.height} cm
                      </div>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mt-1 ${
                          q.isNormal
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {q.conclusion}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 px-6 py-3 bg-slate-50 text-right">
              <button
                onClick={() => setSelectedChildForDetail(null)}
                className="rounded-xl px-4 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
