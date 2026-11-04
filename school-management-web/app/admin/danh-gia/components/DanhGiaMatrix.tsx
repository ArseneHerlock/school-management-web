"use client";

import React from "react";
import { Eye, CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { ActivityItem, CriterionItem } from "@/services/development";
import { MatrixCell } from "../types";
import ClassMatrixStatsPills from "./ClassMatrixStatsPills";
import MatrixTableRow from "./MatrixTableRow";

interface DanhGiaMatrixProps {
  classes: any[];
  activities: ActivityItem[];
  adminMatrixClassId: string;
  setAdminMatrixClassId: (val: string) => void;
  adminMatrixActivityId: string;
  setAdminMatrixActivityId: (val: string) => void;
  adminMatrixStudents: any[];
  adminActiveCriteria: CriterionItem[];
  adminMatrixData: Record<string, Record<string, MatrixCell>>;
  onOpenDetailModal: (cellInfo: {
    studentId: string;
    criterionId: string;
    studentName: string;
    criterionName: string;
    comment: string;
    evidence: string;
  }) => void;
}

export default function DanhGiaMatrix({
  classes,
  activities,
  adminMatrixClassId,
  setAdminMatrixClassId,
  adminMatrixActivityId,
  setAdminMatrixActivityId,
  adminMatrixStudents,
  adminActiveCriteria,
  adminMatrixData,
  onOpenDetailModal,
}: DanhGiaMatrixProps) {
  const currentClass = classes.find((c) => c.id === adminMatrixClassId);
  const totalInClass = adminMatrixStudents.length;
  let evaluatedStudentsCount = 0;
  let totalClassPass = 0;
  let totalClassFail = 0;

  adminMatrixStudents.forEach((st) => {
    const row = adminMatrixData[st.id] || {};
    let hasEval = false;
    Object.values(row).forEach((c) => {
      if (c.result !== null && c.result !== undefined) {
        hasEval = true;
        if (c.result) totalClassPass++;
        else totalClassFail++;
      }
    });
    if (hasEval) evaluatedStudentsCount++;
  });

  const classCompletionRate =
    totalInClass > 0
      ? Math.round((evaluatedStudentsCount / totalInClass) * 100)
      : 0;

  return (
    <div className="rounded-3xl border border-rose-100 bg-white p-5 shadow-xs space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between pb-4 border-b border-rose-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-slate-800">
              Tiến độ đánh giá chi tiết theo Lớp & Trẻ
            </h3>
            <span className="flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-bold text-sky-700 border border-sky-200">
              <Eye size={12} /> Dành cho BGH giám sát
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Quan sát kết quả đánh giá các chỉ số phát triển của từng trẻ do giáo viên thực hiện.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Lớp:</span>
            <select
              className="rounded-xl border border-rose-200/80 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-rose-400"
              value={adminMatrixClassId}
              onChange={(e) => setAdminMatrixClassId(e.target.value)}
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.tenLop}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Hoạt động:</span>
            <select
              className="rounded-xl border border-rose-200/80 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-rose-400"
              value={adminMatrixActivityId}
              onChange={(e) => setAdminMatrixActivityId(e.target.value)}
            >
              <option value="">Tất cả hoạt động</option>
              {activities.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <ClassMatrixStatsPills
        className={currentClass?.tenLop}
        totalInClass={totalInClass}
        evaluatedStudentsCount={evaluatedStudentsCount}
        classCompletionRate={classCompletionRate}
        totalClassPass={totalClassPass}
        totalClassFail={totalClassFail}
      />

      <div className="overflow-x-auto max-h-[500px]">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="sticky top-0 z-10 bg-rose-50/90 backdrop-blur-xs border-b border-rose-100 text-slate-700">
            <tr>
              <th className="p-3 min-w-[160px] font-bold text-slate-800">
                Học sinh
              </th>
              <th className="p-3 w-28 text-center font-bold text-slate-600">
                Đã đạt
              </th>
              {adminActiveCriteria.map((crit) => (
                <th
                  key={crit.id}
                  className="p-2.5 min-w-[120px] text-center font-bold text-slate-700"
                >
                  <div className="truncate max-w-[140px]" title={crit.name}>
                    {crit.name}
                  </div>
                </th>
              ))}
              <th className="p-3 min-w-[200px] font-bold text-slate-800">
                Ghi chú / Nhận xét của GV
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rose-50">
            {adminMatrixStudents.map((st) => (
              <MatrixTableRow
                key={st.id}
                student={st}
                activeCriteria={adminActiveCriteria}
                row={adminMatrixData[st.id] || {}}
                onOpenDetailModal={onOpenDetailModal}
              />
            ))}

            {adminMatrixStudents.length === 0 && (
              <tr>
                <td
                  colSpan={adminActiveCriteria.length + 3}
                  className="p-8 text-center text-slate-400"
                >
                  Không có học sinh nào trong lớp được chọn.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-rose-50">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 font-bold text-emerald-700">
            <CheckCircle2 size={14} /> Đạt tiêu chí
          </span>
          <span className="flex items-center gap-1 font-bold text-rose-700">
            <XCircle size={14} /> Cần rèn luyện thêm
          </span>
          <span className="flex items-center gap-1 text-slate-400 font-medium">
            <HelpCircle size={14} /> Chưa đánh giá
          </span>
        </div>
        <p className="text-[11px] text-slate-400 italic">
          Bấm vào biểu tượng bất kỳ để xem ghi chú và minh chứng chi tiết do giáo viên nhập.
        </p>
      </div>
    </div>
  );
}
