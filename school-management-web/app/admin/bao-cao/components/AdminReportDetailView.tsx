'use client';

import React from 'react';
import { ArrowLeft, Printer, ShieldAlert } from 'lucide-react';
import { AdminReportMeta, GradeClassSummaryRow, AdminReportStatMetrics } from '../types';

interface Props {
  reportMeta: AdminReportMeta;
  rows: GradeClassSummaryRow[];
  metrics: AdminReportStatMetrics;
  periodText: string;
  onBack: () => void;
  onPrint: () => void;
}

export const AdminReportDetailView: React.FC<Props> = ({
  reportMeta,
  rows,
  metrics,
  periodText,
  onBack,
  onPrint,
}) => {
  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Bar Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors flex items-center gap-1.5 text-sm font-semibold"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
            <span>Quay lại danh mục</span>
          </button>
          <div className="h-6 w-px bg-gray-200 hidden sm:block" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">{reportMeta.title}</h2>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${reportMeta.colorScheme.badge}`}>
                {reportMeta.cycle}
              </span>
            </div>
            <p className="text-xs text-gray-500">Kỳ báo cáo: {periodText}</p>
          </div>
        </div>

        <button
          onClick={onPrint}
          className="inline-flex items-center gap-2 px-3.5 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Printer className="w-4 h-4 text-gray-600" />
          <span>In / Xuất PDF</span>
        </button>
      </div>


      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 uppercase">Tổng số trẻ</div>
          <div className="text-2xl font-bold text-blue-700 mt-1">{metrics.totalSchoolStudents} <span className="text-sm font-normal text-gray-500">bé</span></div>
          <div className="text-xs text-gray-500 mt-1">{rows.length} lớp hiển thị</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 uppercase">Tỷ lệ chuyên cần</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{metrics.schoolAttendanceRate}%</div>
          <div className="text-xs text-emerald-600 mt-1">Đạt chuẩn chuyên cần cao</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 uppercase">Phát triển toàn diện</div>
          <div className="text-2xl font-bold text-indigo-700 mt-1">{metrics.holisticDevRate}%</div>
          <div className="text-xs text-gray-500 mt-1">Theo 5 lĩnh vực GDMN</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 uppercase">Dinh dưỡng đạt chuẩn</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{metrics.normalNutritionRate}%</div>
          <div className="text-xs text-gray-500 mt-1">Sức khỏe & thể lực tốt</div>
        </div>
      </div>

      {/* Detail Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-800 text-sm">Bảng số liệu phân bổ theo Khối & Lớp ({rows.length} lớp thực tế)</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs border-b border-gray-200">
              <tr>
                <th className="py-3 px-3 text-center w-12">STT</th>
                <th className="py-3 px-4">Khối / Lớp</th>
                <th className="py-3 px-4">Giáo viên phụ trách</th>
                <th className="py-3 px-3 text-center">Sĩ số</th>

                {/* 1. BGH_SI_SO */}
                {reportMeta.id === 'BGH_SI_SO' && (
                  <>
                    <th className="py-3 px-4 text-center text-emerald-700">Mới nhập học</th>
                    <th className="py-3 px-4 text-center">Chuyển trường</th>
                    <th className="py-3 px-4 text-center text-emerald-700">Nghỉ học</th>
                    <th className="py-3 px-4 text-center">Nam / Nữ</th>
                  </>
                )}

                {/* 2. BGH_CHUYEN_CAN */}
                {reportMeta.id === 'BGH_CHUYEN_CAN' && (
                  <>
                    <th className="py-3 px-4 text-center">Có mặt</th>
                    <th className="py-3 px-4 text-center">Nghỉ có phép</th>
                    <th className="py-3 px-4 text-center">Nghỉ không phép</th>
                    <th className="py-3 px-4 text-center font-bold text-emerald-700">Tỷ lệ chuyên cần</th>
                  </>
                )}

                {/* 3. BGH_PHAT_TRIEN */}
                {reportMeta.id === 'BGH_PHAT_TRIEN' && (
                  <>
                    <th className="py-3 px-3 text-center">Thể chất</th>
                    <th className="py-3 px-3 text-center">Nhận thức</th>
                    <th className="py-3 px-3 text-center">Ngôn ngữ</th>
                    <th className="py-3 px-3 text-center">TC-XH</th>
                    <th className="py-3 px-3 text-center">Thẩm mỹ</th>
                    <th className="py-3 px-4 text-center font-bold text-indigo-700">Đạt 5 lĩnh vực</th>
                  </>
                )}

                {/* 4. BGH_SUC_KHOE */}
                {reportMeta.id === 'BGH_SUC_KHOE' && (
                  <>
                    <th className="py-3 px-4 text-center text-emerald-700">Bình thường</th>
                    <th className="py-3 px-4 text-center text-amber-700">Suy dinh dưỡng</th>
                    <th className="py-3 px-4 text-center">Thấp còi</th>
                    <th className="py-3 px-4 text-center font-bold text-emerald-700">Tỷ lệ chuẩn</th>
                  </>
                )}

                {/* 5. BGH_KHEN_THUONG */}
                {reportMeta.id === 'BGH_KHEN_THUONG' && (
                  <>
                    <th className="py-3 px-4 text-center font-bold text-amber-700">Bé chăm ngoan tháng</th>
                    <th className="py-3 px-4 text-center">Chuyên cần xuất sắc</th>
                    <th className="py-3 px-4 text-center font-bold text-emerald-700">Tỷ lệ khen thưởng</th>
                  </>
                )}

                {/* 6. BGH_HOAT_DONG */}
                {reportMeta.id === 'BGH_HOAT_DONG' && (
                  <>
                    <th className="py-3 px-4">Chủ đề giáo dục</th>
                    <th className="py-3 px-4 text-center">Số hoạt động</th>
                    <th className="py-3 px-4 text-center">Ngoại khóa</th>
                    <th className="py-3 px-4 text-center font-bold text-emerald-700">Đạt mục tiêu</th>
                  </>
                )}

                {/* 7. BGH_AN_TOAN */}
                {reportMeta.id === 'BGH_AN_TOAN' && (
                  <>
                    <th className="py-3 px-4 text-center text-amber-700">Sốt / ốm tại lớp</th>
                    <th className="py-3 px-4 text-center">Sơ cứu trầy xước</th>
                    <th className="py-3 px-4">Tình trạng an toàn</th>
                  </>
                )}

                {/* 8. BGH_TONG_KET_NAM */}
                {reportMeta.id === 'BGH_TONG_KET_NAM' && (
                  <>
                    <th className="py-3 px-4 text-center font-bold text-emerald-700">Chuyên cần</th>
                    <th className="py-3 px-4 text-center font-bold text-indigo-700">Đạt phát triển</th>
                    <th className="py-3 px-4 text-center font-bold text-blue-700">Sức khỏe chuẩn</th>
                    <th className="py-3 px-4 text-center font-bold text-purple-700">Xếp loại sơ kết</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((r, i) => (
                <tr key={r.className} className="hover:bg-gray-50/80">
                  <td className="py-3 px-3 text-center text-xs text-gray-500">{i + 1}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-gray-900">{r.className}</span>
                    <span className="text-xs text-gray-500 block">{r.gradeName}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-700 font-medium">{r.teacherName}</td>
                  <td className="py-3 px-3 text-center font-bold text-gray-800">{r.totalStudents}</td>

                  {/* 1. BGH_SI_SO */}
                  {reportMeta.id === 'BGH_SI_SO' && (
                    <>
                      <td className="py-3 px-4 text-center font-bold text-emerald-700">+{r.newEnrolled}</td>
                      <td className="py-3 px-4 text-center text-gray-600">{r.transferred}</td>
                      <td className="py-3 px-4 text-center text-gray-500">{r.dropped}</td>
                      <td className="py-3 px-4 text-center text-xs font-semibold">{r.maleCount} Nam / {r.femaleCount} Nữ</td>
                    </>
                  )}

                  {/* 2. BGH_CHUYEN_CAN */}
                  {reportMeta.id === 'BGH_CHUYEN_CAN' && (
                    <>
                      <td className="py-3 px-4 text-center text-gray-800">{r.presentCount}</td>
                      <td className="py-3 px-4 text-center text-amber-700">{r.absentExcused}</td>
                      <td className="py-3 px-4 text-center text-gray-500">{r.absentUnexcused}</td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-700">{r.attendanceRate}%</td>
                    </>
                  )}

                  {/* 3. BGH_PHAT_TRIEN */}
                  {reportMeta.id === 'BGH_PHAT_TRIEN' && (
                    <>
                      <td className="py-3 px-3 text-center text-emerald-600 font-semibold">{r.passPhysical}</td>
                      <td className="py-3 px-3 text-center text-emerald-600 font-semibold">{r.passCognitive}</td>
                      <td className="py-3 px-3 text-center text-emerald-600 font-semibold">{r.passLanguage}</td>
                      <td className="py-3 px-3 text-center text-emerald-600 font-semibold">{r.passSocial}</td>
                      <td className="py-3 px-3 text-center text-emerald-600 font-semibold">{r.passAesthetic}</td>
                      <td className="py-3 px-4 text-center font-bold text-indigo-700">{r.passedDevRate}%</td>
                    </>
                  )}

                  {/* 4. BGH_SUC_KHOE */}
                  {reportMeta.id === 'BGH_SUC_KHOE' && (
                    <>
                      <td className="py-3 px-4 text-center text-emerald-700 font-bold">{r.normalNutritionCount}</td>
                      <td className="py-3 px-4 text-center text-amber-700">{r.malnutritionCount}</td>
                      <td className="py-3 px-4 text-center text-gray-500">{r.stuntedCount}</td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-700">{r.normalNutritionRate}%</td>
                    </>
                  )}

                  {/* 5. BGH_KHEN_THUONG */}
                  {reportMeta.id === 'BGH_KHEN_THUONG' && (
                    <>
                      <td className="py-3 px-4 text-center font-bold text-amber-700">{r.monthlyGoodChildCount}</td>
                      <td className="py-3 px-4 text-center text-emerald-700">{r.exemplaryCount}</td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-700">{r.awardRate}%</td>
                    </>
                  )}

                  {/* 6. BGH_HOAT_DONG */}
                  {reportMeta.id === 'BGH_HOAT_DONG' && (
                    <>
                      <td className="py-3 px-4 text-gray-800">{r.educationTheme}</td>
                      <td className="py-3 px-4 text-center font-bold text-blue-700">{r.activityCount}</td>
                      <td className="py-3 px-4 text-center text-gray-700">{r.outdoorActivityCount}</td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-700">{r.activityPassRate}%</td>
                    </>
                  )}

                  {/* 7. BGH_AN_TOAN */}
                  {reportMeta.id === 'BGH_AN_TOAN' && (
                    <>
                      <td className="py-3 px-4 text-center text-amber-700">{r.feverSickCount}</td>
                      <td className="py-3 px-4 text-center text-gray-700">{r.firstAidCount}</td>
                      <td className="py-3 px-4 text-xs text-gray-700">{r.safetyStatus}</td>
                    </>
                  )}

                  {/* 8. BGH_TONG_KET_NAM */}
                  {reportMeta.id === 'BGH_TONG_KET_NAM' && (
                    <>
                      <td className="py-3 px-4 text-center font-bold text-emerald-700">{r.attendanceRate}%</td>
                      <td className="py-3 px-4 text-center font-bold text-indigo-700">{r.passedDevRate}%</td>
                      <td className="py-3 px-4 text-center font-bold text-blue-700">{r.normalNutritionRate}%</td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-purple-100 text-purple-800">
                          {r.termRank}
                        </span>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
