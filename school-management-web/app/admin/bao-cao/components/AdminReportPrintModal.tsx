'use client';

import React from 'react';
import { X, Printer, Download } from 'lucide-react';
import { AdminReportMeta, GradeClassSummaryRow, AdminReportStatMetrics } from '../types';
import { generateReportPrintHtml, executePrintOrDownload } from '@/utils/pdfExportHelper';
import { buildAdminPrintTableHtml } from './AdminReportPrintTables';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  reportMeta: AdminReportMeta;
  rows: GradeClassSummaryRow[];
  metrics: AdminReportStatMetrics;
  periodText: string;
}

export const AdminReportPrintModal: React.FC<Props> = ({
  isOpen,
  onClose,
  reportMeta,
  rows,
  metrics,
  periodText,
}) => {
  if (!isOpen) return null;

  const getFullHtml = () => {
    const summary = `
      <div class="summary-grid">
        <div class="summary-card"><div class="summary-num">${metrics.totalSchoolStudents}</div><div class="summary-label">Tổng số trẻ (${rows.length} lớp)</div></div>
        <div class="summary-card"><div class="summary-num">${metrics.schoolAttendanceRate}%</div><div class="summary-label">Chuyên cần</div></div>
        <div class="summary-card"><div class="summary-num">${metrics.normalNutritionRate}%</div><div class="summary-label">Dinh dưỡng chuẩn</div></div>
        <div class="summary-card"><div class="summary-num">${metrics.holisticDevRate}%</div><div class="summary-label">Phát triển toàn diện</div></div>
      </div>
      ${buildAdminPrintTableHtml(reportMeta.id, rows)}
    `;
    return generateReportPrintHtml(
      {
        reportTitle: reportMeta.title.toUpperCase(),
        subTitle: `Kỳ báo cáo: ${periodText} - Toàn trường (${rows.length} lớp thực tế)`,
        periodText,
        reporterRole: 'HIỆU TRƯỞNG',
        reporterName: 'Ban Giám Hiệu Nhà Trường',
      },
      summary,
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/80">
          <div>
            <h3 className="font-bold text-gray-900 text-base">{reportMeta.title}</h3>
            <p className="text-xs text-gray-500">Xem trước văn bản in chuẩn A4 ({rows.length} lớp học)</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 bg-gray-100 flex justify-center">
          <div className="bg-white p-8 w-full max-w-3xl shadow-sm border border-gray-200 rounded-lg min-h-[500px]">
            <iframe srcDoc={getFullHtml()} title="Report Preview" className="w-full h-[520px] border-none" />
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex items-center justify-end gap-3 bg-white">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            Đóng
          </button>
          <button
            onClick={() => executePrintOrDownload(getFullHtml(), 'download', `${reportMeta.id}_${periodText.replace(/[^a-zA-Z0-9]/g, '_')}.html`)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Tải về máy</span>
          </button>
          <button
            onClick={() => executePrintOrDownload(getFullHtml(), 'print')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>In văn bản</span>
          </button>
        </div>
      </div>
    </div>
  );
};
