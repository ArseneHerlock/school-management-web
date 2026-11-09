'use client';

import React from 'react';
import Modal from '@/app/components/ui/Modal';
import { CheckCircle2, XCircle, HelpCircle, Save, Loader2, MessageSquare, Sparkles } from 'lucide-react';
import { ScheduleItem } from './types';

interface TeacherScheduleEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeEvent: ScheduleItem | null;
  childrenList: any[];
  evalMap: Record<string, any>;
  onCellClick: (childId: string, critId: string) => void;
  onCommentChange?: (childId: string, comment: string) => void;
  onSaveEvaluations: () => void;
  saving: boolean;
}

export default function TeacherScheduleEvaluationModal({
  isOpen,
  onClose,
  activeEvent,
  childrenList,
  evalMap,
  onCellClick,
  onCommentChange,
  onSaveEvaluations,
  saving,
}: TeacherScheduleEvaluationModalProps) {
  if (!activeEvent) return null;

  const criteria =
    activeEvent.criteria && activeEvent.criteria.length > 0
      ? activeEvent.criteria
      : [
          { id: 'crit_participate', name: 'Tham gia & Tương tác' },
          { id: 'crit_skill', name: 'Kỹ năng thực hiện' },
        ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Đánh giá hoạt động: ${activeEvent.title}`}
      subtitle={`Ngày ${activeEvent.date} (${activeEvent.startTime} - ${activeEvent.endTime}) • ${
        activeEvent.isSchoolWide ? 'Toàn trường' : activeEvent.className || 'Lớp phụ trách'
      }`}
      maxWidth="4xl"
    >
      <div className="space-y-4 font-sans">

        <div className="rounded-2xl border border-orange-100 bg-white overflow-hidden shadow-2xs">
          <div className="overflow-x-auto max-h-[460px]">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 z-10 bg-orange-50/90 backdrop-blur-xs border-b border-orange-200 text-slate-700 shadow-2xs">
                <tr>
                  <th className="p-3 font-black text-slate-800 w-44">Học sinh</th>
                  {criteria.map((c: any) => (
                    <th key={c.id} className="p-2.5 text-center font-black min-w-[120px] w-32">
                      <span className="line-clamp-2" title={c.name}>
                        {c.name}
                      </span>
                    </th>
                  ))}
                  <th className="p-3 font-black text-slate-800 min-w-[280px]">
                    <span className="flex items-center gap-1.5">
                      <MessageSquare size={13} className="text-orange-600" />
                      Nhận xét của cô về bé trong hoạt động
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {childrenList.map((ch) => {
                  const childId = String(ch.id || ch.apiId);
                  const currentComment = evalMap[childId]?.comment || '';

                  return (
                    <tr key={childId} className="hover:bg-orange-50/20 transition">
                      <td className="p-3 font-bold text-slate-800 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="h-6 w-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-black text-[11px]">
                            {(ch.name || ch.tenHocSinh || 'B').charAt(0)}
                          </span>
                          <span>{ch.name || ch.tenHocSinh || 'Học sinh'}</span>
                        </div>
                      </td>

                      {/* Criteria check buttons */}
                      {criteria.map((crit: any) => {
                        const res = evalMap[childId]?.[crit.id]?.result;
                        return (
                          <td key={crit.id} className="p-2 text-center align-middle">
                            <button
                              type="button"
                              onClick={() => onCellClick(childId, crit.id)}
                              className={`inline-flex h-8 w-8 items-center justify-center rounded-xl transition cursor-pointer ${
                                res === true
                                  ? 'bg-emerald-100 text-emerald-700 shadow-2xs ring-2 ring-emerald-300'
                                  : res === false
                                  ? 'bg-rose-100 text-rose-700 shadow-2xs ring-2 ring-rose-300'
                                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                              }`}
                              title={
                                res === true
                                  ? 'Đạt'
                                  : res === false
                                  ? 'Cần rèn luyện'
                                  : 'Chưa đánh giá (Click để chọn)'
                              }
                            >
                              {res === true ? (
                                <CheckCircle2 size={17} />
                              ) : res === false ? (
                                <XCircle size={17} />
                              ) : (
                                <HelpCircle size={15} />
                              )}
                            </button>
                          </td>
                        );
                      })}

                      {/* Comment Input */}
                      <td className="p-2.5 align-middle">
                        <input
                          type="text"
                          value={currentComment}
                          onChange={(e) => onCommentChange?.(childId, e.target.value)}
                          placeholder="Nhập nhận xét cụ thể cho bé trong hoạt động..."
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-orange-400 focus:outline-none"
                        />
                      </td>
                    </tr>
                  );
                })}

                {childrenList.length === 0 && (
                  <tr>
                    <td colSpan={criteria.length + 2} className="p-8 text-center text-slate-400">
                      Chưa có học sinh nào trong danh sách lớp
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chú giải trạng thái & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <CheckCircle2 size={16} /> Đạt tiêu chí
            </span>
            <span className="flex items-center gap-1.5 text-rose-700 font-bold">
              <XCircle size={16} /> Cần rèn luyện thêm
            </span>
            <span className="flex items-center gap-1.5 text-slate-400 font-semibold">
              <HelpCircle size={16} /> Chưa đánh giá
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={onSaveEvaluations}
              disabled={saving}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-xs font-black text-white shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              <span>Lưu đánh giá hoạt động</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
