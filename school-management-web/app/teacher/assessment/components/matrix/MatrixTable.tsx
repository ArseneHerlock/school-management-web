'use client';

import React from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  CheckSquare,
  Square,
  MessageSquare,
  Info,
} from 'lucide-react';
import { CriterionItem } from '@/services/development';
import { parseCriterionHeader, getDomainStyle } from './matrixHelpers';

interface MatrixTableProps {
  classStudents: any[];
  displayCriteria: CriterionItem[];
  matrix: Record<string, Record<string, any>>;
  selectedStudentIds: Set<string>;
  auditMode: boolean;
  onToggleSelectAll: () => void;
  onToggleStudent: (id: string) => void;
  onCellClick: (studentId: string, criterionId: string) => void;
  onMarkRowPass: (studentId: string) => void;
  onMarkColPass: (criterionId: string) => void;
  onOpenCellDetail: (info: any) => void;
  childActivityRemarks: Record<string, any>;
  onChangeChildRemark: (studentId: string, val: string) => void;
  onOpenCriterionGuide: (crit: CriterionItem) => void;
}

export function MatrixTable({
  classStudents,
  displayCriteria,
  matrix,
  selectedStudentIds,
  auditMode,
  onToggleSelectAll,
  onToggleStudent,
  onCellClick,
  onMarkRowPass,
  onMarkColPass,
  onOpenCellDetail,
  childActivityRemarks,
  onChangeChildRemark,
  onOpenCriterionGuide,
}: MatrixTableProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="sticky left-0 z-20 bg-slate-50/95 backdrop-blur-xs p-3.5 w-10 text-center border-r border-slate-200">
                <button
                  type="button"
                  onClick={onToggleSelectAll}
                  className="text-slate-400 hover:text-slate-700 transition cursor-pointer"
                  title="Chọn tất cả trẻ"
                >
                  {selectedStudentIds.size === classStudents.length && classStudents.length > 0 ? (
                    <CheckSquare size={16} className="text-orange-500" />
                  ) : (
                    <Square size={16} />
                  )}
                </button>
              </th>

              <th className="sticky left-10 z-20 bg-slate-50/95 backdrop-blur-xs p-3.5 min-w-[180px] max-w-[220px] font-black text-slate-800 border-r border-slate-200">
                <span>Học sinh trong lớp</span>
                <span className="block text-[10px] text-slate-400 font-normal">
                  ({classStudents.length} học sinh)
                </span>
              </th>

              <th className="p-3.5 min-w-[200px] max-w-[240px] font-black text-slate-800 border-r border-slate-200 bg-amber-50/30">
                <div className="flex items-center gap-1.5 text-amber-900">
                  <MessageSquare size={13} className="text-amber-600 shrink-0" />
                  <span>Nhận xét buổi học của bé</span>
                </div>
                <span className="block text-[10px] text-amber-700/80 font-normal mt-0.5">
                  Đồng bộ sang Sổ Bé Ngoan tháng
                </span>
              </th>

              {displayCriteria.map((crit) => {
                const parsed = parseCriterionHeader(crit.name, crit.code);
                const domainStyle = getDomainStyle((crit as any).developmentDomainName || '', crit.code);

                return (
                  <th
                    key={crit.id}
                    className={`p-3 min-w-[150px] max-w-[190px] font-extrabold border-r border-slate-200 align-top transition-colors ${domainStyle.headerBg}`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span
                        className={`inline-block text-[9px] font-black px-1.5 py-0.5 rounded-md border uppercase tracking-wider ${domainStyle.pillClass}`}
                      >
                        {domainStyle.domainLabel}
                      </span>
                      <button
                        type="button"
                        onClick={() => onOpenCriterionGuide(crit)}
                        className="text-slate-400 hover:text-orange-600 transition p-0.5 cursor-pointer"
                        title="Xem hướng dẫn chi tiết chỉ số này"
                      >
                        <Info size={13} />
                      </button>
                    </div>

                    <p className="text-slate-900 leading-snug line-clamp-2" title={parsed.fullName}>
                      <strong className="text-orange-600 mr-1">{parsed.targetCode}</strong>
                      <span>{parsed.description}</span>
                    </p>

                    <div className="mt-2 pt-1.5 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-mono">{crit.code}</span>
                      <button
                        type="button"
                        onClick={() => onMarkColPass(crit.id)}
                        className="text-[10px] font-bold text-orange-600 hover:underline cursor-pointer"
                      >
                        Chấm Đạt cột
                      </button>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {classStudents.map((st) => {
              const isSelected = selectedStudentIds.has(st.id);
              const studentRow = matrix[st.id] || {};
              const remarkVal = childActivityRemarks[st.id]?.comment ?? '';

              return (
                <tr
                  key={st.id}
                  className={`transition-colors hover:bg-orange-50/30 ${
                    isSelected ? 'bg-white' : 'bg-slate-50/40 opacity-75'
                  }`}
                >
                  <td className="sticky left-0 z-10 bg-inherit p-3.5 text-center border-r border-slate-100">
                    <button
                      type="button"
                      onClick={() => onToggleStudent(st.id)}
                      className="text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      {isSelected ? (
                        <CheckSquare size={16} className="text-orange-500" />
                      ) : (
                        <Square size={16} />
                      )}
                    </button>
                  </td>

                  <td className="sticky left-10 z-10 bg-inherit p-3.5 border-r border-slate-100 font-bold text-slate-900">
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate">
                        <span className="block truncate">{st.tenHocSinh}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {st.gioiTinh} · {st.ngaySinh?.slice(0, 4) || '2022'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onMarkRowPass(st.id)}
                        className="text-[10px] font-bold text-orange-600 hover:underline shrink-0 cursor-pointer"
                        title="Đánh dấu tất cả chỉ số đạt cho bé này"
                      >
                        Đạt hết
                      </button>
                    </div>
                  </td>

                  <td className="p-2.5 border-r border-slate-100 bg-amber-50/20">
                    <textarea
                      rows={2}
                      value={remarkVal}
                      onChange={(e) => onChangeChildRemark(st.id, e.target.value)}
                      placeholder="Ghi nhận xét riêng của bé trong hoạt động này..."
                      className="w-full rounded-xl border border-amber-200/80 bg-white p-2 text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-amber-400 resize-none"
                    />
                  </td>

                  {displayCriteria.map((crit) => {
                    const cell = studentRow[crit.id] || { result: null, isDirty: false };
                    const isPass = cell.result === true;
                    const isFail = cell.result === false;
                    const hasNote = Boolean(cell.comment || cell.evidence);

                    return (
                      <td
                        key={crit.id}
                        className={`p-2 border-r border-slate-100 text-center align-middle transition-colors ${
                          cell.isDirty ? 'bg-orange-50/80' : ''
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onCellClick(st.id, crit.id)}
                            className={`flex items-center justify-center h-8 w-8 rounded-xl transition-all cursor-pointer ${
                              isPass
                                ? 'bg-emerald-500 text-white shadow-xs hover:bg-emerald-600 scale-105'
                                : isFail
                                ? 'bg-rose-500 text-white shadow-xs hover:bg-rose-600 scale-105'
                                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                            }`}
                            title={
                              isPass
                                ? 'Đạt (Nhấn để chuyển sang Cần rèn luyện)'
                                : isFail
                                ? 'Cần rèn luyện (Nhấn để hủy chọn)'
                                : 'Chưa đánh giá (Nhấn để chấm Đạt)'
                            }
                          >
                            {isPass ? (
                              <CheckCircle2 size={16} />
                            ) : isFail ? (
                              <XCircle size={16} />
                            ) : (
                              <HelpCircle size={14} />
                            )}
                          </button>

                          {(auditMode || hasNote) && (
                            <button
                              type="button"
                              onClick={() =>
                                onOpenCellDetail({
                                  studentId: st.id,
                                  criterionId: crit.id,
                                  studentName: st.tenHocSinh,
                                  criterionName: crit.name,
                                  comment: cell.comment || '',
                                  evidence: cell.evidence || '',
                                })
                              }
                              className={`p-1 rounded-lg border transition cursor-pointer ${
                                hasNote
                                  ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                                  : 'border-slate-200 text-slate-400 hover:text-slate-600'
                              }`}
                              title="Chi tiết minh chứng & nhận xét"
                            >
                              <MessageSquare size={12} />
                            </button>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
