"use client";

import React from "react";
import { CheckCircle2, XCircle, HelpCircle, MessageSquare } from "lucide-react";
import { CriterionItem } from "@/services/development";
import { MatrixCell } from "../types";

interface MatrixTableRowProps {
  student: any;
  activeCriteria: CriterionItem[];
  row: Record<string, MatrixCell>;
  onOpenDetailModal: (cellInfo: {
    studentId: string;
    criterionId: string;
    studentName: string;
    criterionName: string;
    comment: string;
    evidence: string;
  }) => void;
}

export default function MatrixTableRow({
  student,
  activeCriteria,
  row,
  onOpenDetailModal,
}: MatrixTableRowProps) {
  let childPassCount = 0;
  let childTotalAssessed = 0;
  let sampleComment = "";

  activeCriteria.forEach((crit) => {
    const cell = row[crit.id];
    if (cell && cell.result !== null && cell.result !== undefined) {
      childTotalAssessed++;
      if (cell.result) childPassCount++;
      if (cell.comment && !sampleComment) sampleComment = cell.comment;
    }
  });

  return (
    <tr className="hover:bg-emerald-50/20 transition">
      <td className="p-3 font-bold text-slate-800 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-[11px]">
            {(student.tenHocSinh || "B").charAt(0)}
          </span>
          <span>{student.tenHocSinh}</span>
        </div>
      </td>

      <td className="p-2.5 text-center">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-md font-bold text-[11px] ${
            childTotalAssessed === 0
              ? "bg-slate-100 text-slate-400"
              : childPassCount === childTotalAssessed
              ? "bg-emerald-100 text-emerald-800"
              : "bg-amber-100 text-amber-800"
          }`}
        >
          {childTotalAssessed > 0
            ? `${childPassCount}/${childTotalAssessed} Đạt`
            : "Chưa đánh giá"}
        </span>
      </td>

      {activeCriteria.map((crit) => {
        const cell = row[crit.id] || { result: null };
        return (
          <td key={crit.id} className="p-2 text-center align-middle">
            <button
              type="button"
              onClick={() =>
                onOpenDetailModal({
                  studentId: student.id,
                  criterionId: crit.id,
                  studentName: student.tenHocSinh,
                  criterionName: crit.name,
                  comment: cell.comment || "",
                  evidence: cell.evidence || "",
                })
              }
              className={`inline-flex h-7 w-7 items-center justify-center rounded-lg transition cursor-pointer ${
                cell.result === true
                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                  : cell.result === false
                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                  : "bg-slate-100 text-slate-300 hover:bg-slate-200"
              }`}
              title={`Xem chi tiết tiêu chí: ${crit.name} (${
                cell.result === true
                  ? "Đạt"
                  : cell.result === false
                  ? "Cần rèn luyện"
                  : "Chưa đánh giá"
              })`}
            >
              {cell.result === true ? (
                <CheckCircle2 size={15} />
              ) : cell.result === false ? (
                <XCircle size={15} />
              ) : (
                <HelpCircle size={14} />
              )}
            </button>
          </td>
        );
      })}

      <td className="p-3 text-slate-600 italic text-[11px] max-w-[220px] truncate">
        {sampleComment ? (
          <span className="flex items-center gap-1">
            <MessageSquare size={12} className="text-amber-500 shrink-0" />
            <span className="truncate" title={sampleComment}>
              {sampleComment}
            </span>
          </span>
        ) : (
          <span className="text-slate-400 not-italic">--</span>
        )}
      </td>
    </tr>
  );
}
