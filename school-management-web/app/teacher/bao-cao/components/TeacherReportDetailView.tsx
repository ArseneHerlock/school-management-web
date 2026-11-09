'use client';

import React from 'react';
import { ClassReportItem } from '@/services/classReports';

interface Props {
  report: ClassReportItem;
  onChangeRemarks: (val: string) => void;
  onChangeRecommendations: (val: string) => void;
}

export const TeacherReportDetailView: React.FC<Props> = ({
  report,
  onChangeRemarks,
  onChangeRecommendations,
}) => {
  const { metrics, reportType } = report;

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 uppercase">Sĩ số lớp</div>
          <div className="text-xl font-bold text-gray-900 mt-1">{metrics.totalStudents} trẻ</div>
          <div className="text-xs text-gray-500">{metrics.maleCount} Nam • {metrics.femaleCount} Nữ</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-sm">
          <div className="text-xs font-semibold text-emerald-700 uppercase">Tỷ lệ chuyên cần</div>
          <div className="text-xl font-bold text-emerald-700 mt-1">{metrics.attendanceRate}%</div>
          <div className="text-xs text-emerald-600">Đi học đều đặn</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-blue-100 shadow-sm">
          <div className="text-xs font-semibold text-blue-700 uppercase">Dinh dưỡng chuẩn</div>
          <div className="text-xl font-bold text-blue-700 mt-1">{metrics.normalNutritionCount} / {metrics.totalStudents}</div>
          <div className="text-xs text-gray-500">{metrics.malnutritionCount} trẻ cần theo dõi</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-indigo-100 shadow-sm">
          <div className="text-xs font-semibold text-indigo-700 uppercase">Đạt chuẩn phát triển</div>
          <div className="text-xl font-bold text-indigo-700 mt-1">{metrics.passedEvaluationCount} / {metrics.totalStudents}</div>
          <div className="text-xs text-gray-500">Đạt 5 lĩnh vực GDMN</div>
        </div>
      </div>

      {/* Main Table Based on Report Type */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <h3 className="font-bold text-gray-800 text-sm">
            Danh sách toàn bộ học sinh {report.className} ({metrics.totalStudents} trẻ từ CSDL)
          </h3>
          <span className="text-xs text-gray-500">Giáo viên: {report.teacherName}</span>
        </div>

        <div className="overflow-x-auto">
          {/* 1. ĐIỂM DANH */}
          {reportType === 'GV_DIEM_DANH' && (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs border-b border-gray-200">
                <tr>
                  <th className="py-3 px-3 text-center w-12">STT</th>
                  <th className="py-3 px-4">Mã số</th>
                  <th className="py-3 px-4">Họ và tên trẻ</th>
                  <th className="py-3 px-4 text-center">Trạng thái điểm danh</th>
                  <th className="py-3 px-4 text-center">Tỷ lệ chuyên cần</th>
                  <th className="py-3 px-4">Ghi chú chuyên cần</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {report.attendanceDetails?.map((item, idx) => (
                  <tr key={item.childId} className="hover:bg-gray-50/80">
                    <td className="py-3 px-3 text-center text-xs text-gray-500">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono text-xs text-gray-500">{item.childId}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">{item.childName}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        item.status === 'Có mặt' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-700">{item.attendanceRate}%</td>
                    <td className="py-3 px-4 text-xs text-gray-600">{item.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* 2. SỨC KHỎE */}
          {reportType === 'GV_SUC_KHOE' && (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs border-b border-gray-200">
                <tr>
                  <th className="py-3 px-3 text-center w-12">STT</th>
                  <th className="py-3 px-4">Họ và tên trẻ</th>
                  <th className="py-3 px-4">Biểu hiện trong ngày</th>
                  <th className="py-3 px-4 text-center">Tình trạng dinh dưỡng</th>
                  <th className="py-3 px-4">Lưu ý giáo viên / Y tế</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {report.healthDetails?.map((item, idx) => (
                  <tr key={item.childId} className="hover:bg-gray-50/80">
                    <td className="py-3 px-3 text-center text-xs text-gray-500">{idx + 1}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">{item.childName}</td>
                    <td className="py-3 px-4 text-gray-700">{item.symptoms}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        item.nutritionStatus === 'Bình thường' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {item.nutritionStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-600">{item.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* 3. CHIỀU CAO - CÂN NẶNG */}
          {reportType === 'GV_CHIEU_CAO_CAN_NANG' && (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs border-b border-gray-200">
                <tr>
                  <th className="py-3 px-3 text-center w-12">STT</th>
                  <th className="py-3 px-4">Họ và tên trẻ</th>
                  <th className="py-3 px-4 text-center">Chiều cao</th>
                  <th className="py-3 px-4 text-center">Cân nặng</th>
                  <th className="py-3 px-4 text-center">Đánh giá dinh dưỡng</th>
                  <th className="py-3 px-4">Biện pháp theo dõi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {report.healthDetails?.map((item, idx) => (
                  <tr key={item.childId} className="hover:bg-gray-50/80">
                    <td className="py-3 px-3 text-center text-xs text-gray-500">{idx + 1}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">{item.childName}</td>
                    <td className="py-3 px-4 text-center font-bold text-blue-700">{item.heightCm} cm</td>
                    <td className="py-3 px-4 text-center font-bold text-indigo-700">{item.weightKg} kg</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        item.nutritionStatus === 'Bình thường' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {item.nutritionStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-600">{item.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* 4. ĐÁNH GIÁ PHÁT TRIỂN 5 LĨNH VỰC */}
          {reportType === 'GV_DANH_GIA_PHAT_TRIEN' && (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs border-b border-gray-200">
                <tr>
                  <th className="py-3 px-3 text-center w-12">STT</th>
                  <th className="py-3 px-4">Họ và tên trẻ</th>
                  <th className="py-3 px-3 text-center">Thể chất</th>
                  <th className="py-3 px-3 text-center">Nhận thức</th>
                  <th className="py-3 px-3 text-center">Ngôn ngữ</th>
                  <th className="py-3 px-3 text-center">TC - Xã hội</th>
                  <th className="py-3 px-3 text-center">Thẩm mỹ</th>
                  <th className="py-3 px-4 text-center font-bold text-blue-700">Đánh giá chung</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {report.developmentDetails?.map((item, idx) => (
                  <tr key={item.childId} className="hover:bg-gray-50/80">
                    <td className="py-3 px-3 text-center text-xs text-gray-500">{idx + 1}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">{item.childName}</td>
                    <td className="py-3 px-3 text-center text-emerald-600">✓ Đạt</td>
                    <td className="py-3 px-3 text-center text-emerald-600">✓ Đạt</td>
                    <td className="py-3 px-3 text-center">{item.language ? <span className="text-emerald-600">✓ Đạt</span> : <span className="text-amber-600">Cần rèn</span>}</td>
                    <td className="py-3 px-3 text-center text-emerald-600">✓ Đạt</td>
                    <td className="py-3 px-3 text-center text-emerald-600">✓ Đạt</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                        item.overallRating === 'Đạt' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.overallRating}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* 5. HOẠT ĐỘNG LỚP */}
          {reportType === 'GV_HOAT_DONG_LOP' && (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs border-b border-gray-200">
                <tr>
                  <th className="py-3 px-3 text-center w-12">STT</th>
                  <th className="py-3 px-4">Tên hoạt động giáo dục</th>
                  <th className="py-3 px-4 text-center">Lĩnh vực</th>
                  <th className="py-3 px-4 text-center">Ngày thực hiện</th>
                  <th className="py-3 px-4 text-center">Trẻ tham gia</th>
                  <th className="py-3 px-4 text-center font-bold text-emerald-700">Tỷ lệ đạt mục tiêu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {report.activityDetails?.map((act, idx) => (
                  <tr key={act.activityId} className="hover:bg-gray-50/80">
                    <td className="py-3 px-3 text-center text-xs text-gray-500">{idx + 1}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">{act.title}</td>
                    <td className="py-3 px-4 text-center font-medium text-blue-700">{act.domain}</td>
                    <td className="py-3 px-4 text-center text-gray-600">{act.date}</td>
                    <td className="py-3 px-4 text-center font-bold text-gray-800">{act.participantCount} bé</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-700">{act.passRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* 6. BÀN GIAO TRẺ & TÌNH HÌNH LỚP */}
          {(reportType === 'GV_BAN_GIAO_TRE' || reportType === 'GV_TINH_HINH_LOP') && (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs border-b border-gray-200">
                <tr>
                  <th className="py-3 px-3 text-center w-12">STT</th>
                  <th className="py-3 px-4">Họ và tên trẻ</th>
                  <th className="py-3 px-4 text-center">Giờ đón</th>
                  <th className="py-3 px-4">Người đón</th>
                  <th className="py-3 px-4">Mối quan hệ</th>
                  <th className="py-3 px-4">Tình trạng khi đón</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {report.handoverDetails?.map((item, idx) => (
                  <tr key={item.childId} className="hover:bg-gray-50/80">
                    <td className="py-3 px-3 text-center text-xs text-gray-500">{idx + 1}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">{item.childName}</td>
                    <td className="py-3 px-4 text-center font-mono text-xs text-gray-600">{item.handoverTime}</td>
                    <td className="py-3 px-4 text-gray-800">{item.receiverName}</td>
                    <td className="py-3 px-4 text-xs text-gray-600">{item.relationship}</td>
                    <td className="py-3 px-4 text-xs text-gray-700">{item.healthNote}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Remarks & Feedback from Teacher */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-2">
          <label className="text-xs font-bold text-gray-700 uppercase">Nhận xét của giáo viên phụ trách</label>
          <textarea
            rows={3}
            value={report.teacherRemarks || ''}
            onChange={(e) => onChangeRemarks(e.target.value)}
            className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ghi nhận xét về nề nếp, tinh thần học tập..."
          />
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-2">
          <label className="text-xs font-bold text-gray-700 uppercase">Đề xuất / Kiến nghị lên Ban Giám Hiệu</label>
          <textarea
            rows={3}
            value={report.recommendations || ''}
            onChange={(e) => onChangeRecommendations(e.target.value)}
            className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Đề xuất về cơ sở vật chất, đồ dùng đồ chơi..."
          />
        </div>
      </div>
    </div>
  );
};
