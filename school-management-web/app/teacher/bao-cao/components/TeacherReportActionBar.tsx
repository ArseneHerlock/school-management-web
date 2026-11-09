'use client';

import React from 'react';
import { ArrowLeft, RefreshCw, Save, Send, Printer } from 'lucide-react';
import { getReportStatusBadge } from '../teacherReportService';

interface Props {
  title: string;
  cycle: string;
  periodText: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  isSaving: boolean;
  onBack: () => void;
  onAutoFill: () => void;
  onSaveDraft: () => void;
  onSubmitToAdmin: () => void;
  onPrint: () => void;
}

export const TeacherReportActionBar: React.FC<Props> = ({
  title,
  cycle,
  periodText,
  status,
  isSaving,
  onBack,
  onAutoFill,
  onSaveDraft,
  onSubmitToAdmin,
  onPrint,
}) => {
  const badge = getReportStatusBadge(status);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
      {/* Title & Back */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors flex items-center gap-1.5 text-sm font-semibold"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
          <span>Danh mục</span>
        </button>
        <div className="h-6 w-px bg-gray-200 hidden sm:block" />
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">{title}</h2>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${badge.color}`}>
              {badge.label}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Chu kỳ: {cycle} • Kỳ báo cáo: {periodText}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onAutoFill}
          disabled={isSaving}
          title="Tự động nạp số liệu mới nhất từ sổ điểm danh & sức khỏe"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5 text-gray-600" />
          <span>Lấy số liệu tự động</span>
        </button>

        <button
          onClick={onSaveDraft}
          disabled={isSaving}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-blue-200 bg-blue-50/70 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors shadow-sm"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Lưu nháp</span>
        </button>

        <button
          onClick={onSubmitToAdmin}
          disabled={isSaving}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Gửi Ban Giám Hiệu</span>
        </button>

        <button
          onClick={onPrint}
          title="In hoặc tải PDF"
          className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <Printer className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
