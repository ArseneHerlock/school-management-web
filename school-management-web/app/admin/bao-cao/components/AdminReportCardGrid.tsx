'use client';

import React from 'react';
import {
  Users,
  CalendarCheck,
  TrendingUp,
  HeartPulse,
  Award,
  BookOpen,
  ShieldAlert,
  Trophy,
  ArrowRight,
  Printer,
} from 'lucide-react';
import { AdminReportMeta, AdminReportId } from '../types';

interface Props {
  reports: AdminReportMeta[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenReport: (id: AdminReportId) => void;
  onQuickPrint: (id: AdminReportId) => void;
}

export const AdminReportCardGrid: React.FC<Props> = ({
  reports,
  selectedCategory,
  onSelectCategory,
  onOpenReport,
  onQuickPrint,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Users': return <Users className="w-6 h-6" />;
      case 'CalendarCheck': return <CalendarCheck className="w-6 h-6" />;
      case 'TrendingUp': return <TrendingUp className="w-6 h-6" />;
      case 'HeartPulse': return <HeartPulse className="w-6 h-6" />;
      case 'Award': return <Award className="w-6 h-6" />;
      case 'BookOpen': return <BookOpen className="w-6 h-6" />;
      case 'ShieldAlert': return <ShieldAlert className="w-6 h-6" />;
      case 'Trophy': return <Trophy className="w-6 h-6" />;
      default: return <Users className="w-6 h-6" />;
    }
  };

  const filteredReports = reports.filter((r) => {
    if (selectedCategory === 'ALL') return true;
    return r.category === selectedCategory;
  });

  return (
    <div className="space-y-5">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
        {[
          { id: 'ALL', label: 'Tất cả báo cáo (8)' },
          { id: 'DAILY_MONTH', label: 'Hằng ngày & Tháng (3)' },
          { id: 'PERIODIC', label: 'Tháng, Quý & Học kỳ (4)' },
          { id: 'YEAR_END', label: 'Tổng kết cuối năm (1)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => onSelectCategory(tab.id)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              selectedCategory === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className={`rounded-xl border ${report.colorScheme.border} ${report.colorScheme.bg} p-5 flex flex-col justify-between hover:shadow-md transition-all duration-200 group bg-white`}
          >
            <div>
              {/* Header card */}
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-lg bg-white shadow-sm ${report.colorScheme.text}`}>
                  {getIcon(report.iconName)}
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${report.colorScheme.badge}`}>
                  {report.cycle}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="font-bold text-gray-900 text-base mb-1.5 group-hover:text-blue-600 transition-colors">
                {report.title}
              </h3>
              <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-4">
                {report.summary}
              </p>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-gray-100/80 flex items-center gap-2">
              <button
                onClick={() => onOpenReport(report.id)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-sm"
              >
                <span>Xem chi tiết</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onQuickPrint(report.id)}
                title="In / Tải PDF"
                className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
