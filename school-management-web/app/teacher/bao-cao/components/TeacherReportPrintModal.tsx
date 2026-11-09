'use client';

import React from 'react';
import { X, Printer, Download } from 'lucide-react';
import { ClassReportItem } from '@/services/classReports';
import { TeacherReportMeta } from '../types';
import { generateReportPrintHtml, executePrintOrDownload } from '@/utils/pdfExportHelper';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  reportMeta: TeacherReportMeta;
  report: ClassReportItem;
  periodText: string;
}

export const TeacherReportPrintModal: React.FC<Props> = ({
  isOpen,
  onClose,
  reportMeta,
  report,
  periodText,
}) => {
  if (!isOpen) return null;

  const buildTableSection = () => {
    const type = report.reportType;

    if (type === 'GV_DIEM_DANH') {
      const rows = (report.attendanceDetails || []).map((d, i) => `
        <tr>
          <td class="text-center">${i + 1}</td>
          <td class="text-center font-mono">${d.childId}</td>
          <td><b>${d.childName}</b></td>
          <td class="text-center">${d.status}</td>
          <td class="text-center font-bold">${d.attendanceRate}%</td>
          <td>${d.notes || ''}</td>
        </tr>
      `).join('');
      return `
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 35px;">STT</th>
              <th style="width: 70px;">Mã số</th>
              <th>Họ và tên trẻ</th>
              <th style="width: 110px;">Trạng thái điểm danh</th>
              <th style="width: 100px;">Chuyên cần</th>
              <th>Ghi chú chuyên cần</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>`;
    }

    if (type === 'GV_SUC_KHOE') {
      const rows = (report.healthDetails || []).map((d, i) => `
        <tr>
          <td class="text-center">${i + 1}</td>
          <td><b>${d.childName}</b></td>
          <td>${d.symptoms || 'Bình thường'}</td>
          <td class="text-center font-semibold">${d.nutritionStatus}</td>
          <td>${d.notes || 'Thể lực tốt'}</td>
        </tr>
      `).join('');
      return `
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 35px;">STT</th>
              <th>Họ và tên trẻ</th>
              <th>Biểu hiện sức khỏe trong ngày</th>
              <th style="width: 130px;">Tình trạng theo dõi</th>
              <th>Lưu ý giáo viên / Y tế</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>`;
    }

    if (type === 'GV_CHIEU_CAO_CAN_NANG') {
      const rows = (report.healthDetails || []).map((d, i) => `
        <tr>
          <td class="text-center">${i + 1}</td>
          <td><b>${d.childName}</b></td>
          <td class="text-center font-bold">${d.heightCm} cm</td>
          <td class="text-center font-bold">${d.weightKg} kg</td>
          <td class="text-center font-semibold">${d.nutritionStatus}</td>
          <td>${d.notes || ''}</td>
        </tr>
      `).join('');
      return `
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 35px;">STT</th>
              <th>Họ và tên trẻ</th>
              <th style="width: 90px;">Chiều cao</th>
              <th style="width: 90px;">Cân nặng</th>
              <th style="width: 130px;">Đánh giá dinh dưỡng</th>
              <th>Biện pháp chăm sóc</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>`;
    }

    if (type === 'GV_DANH_GIA_PHAT_TRIEN') {
      const rows = (report.developmentDetails || []).map((d, i) => `
        <tr>
          <td class="text-center">${i + 1}</td>
          <td><b>${d.childName}</b></td>
          <td class="text-center">Đạt</td>
          <td class="text-center">Đạt</td>
          <td class="text-center">${d.language ? 'Đạt' : 'Cần rèn'}</td>
          <td class="text-center">Đạt</td>
          <td class="text-center">Đạt</td>
          <td class="text-center font-bold">${d.overallRating}</td>
          <td>${d.notes || ''}</td>
        </tr>
      `).join('');
      return `
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 35px;">STT</th>
              <th>Họ và tên trẻ</th>
              <th style="width: 60px;">Thể chất</th>
              <th style="width: 65px;">Nhận thức</th>
              <th style="width: 65px;">Ngôn ngữ</th>
              <th style="width: 65px;">TC-XH</th>
              <th style="width: 65px;">Thẩm mỹ</th>
              <th style="width: 75px;">Đánh giá</th>
              <th>Nhận xét & Hỗ trợ</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>`;
    }

    if (type === 'GV_HOAT_DONG_LOP') {
      const rows = (report.activityDetails || []).map((a, i) => `
        <tr>
          <td class="text-center">${i + 1}</td>
          <td><b>${a.title}</b></td>
          <td class="text-center font-semibold">${a.domain}</td>
          <td class="text-center">${a.date}</td>
          <td class="text-center">${a.participantCount} trẻ</td>
          <td class="text-center font-bold">${a.passRate}%</td>
        </tr>
      `).join('');
      return `
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 35px;">STT</th>
              <th>Tên hoạt động giáo dục</th>
              <th style="width: 100px;">Lĩnh vực GDMN</th>
              <th style="width: 90px;">Ngày tổ chức</th>
              <th style="width: 90px;">Số trẻ tham gia</th>
              <th style="width: 100px;">Đạt mục tiêu</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>`;
    }

    // GV_BAN_GIAO_TRE & GV_TINH_HINH_LOP
    const handoverRows = (report.handoverDetails || []).map((h, i) => `
      <tr>
        <td class="text-center">${i + 1}</td>
        <td><b>${h.childName}</b></td>
        <td class="text-center font-mono">${h.handoverTime}</td>
        <td>${h.receiverName}</td>
        <td class="text-center">${h.relationship}</td>
        <td>${h.healthNote}</td>
        <td class="text-center">Đã ký nhận</td>
      </tr>
    `).join('');
    return `
      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 35px;">STT</th>
            <th>Họ và tên trẻ</th>
            <th style="width: 75px;">Giờ đón</th>
            <th style="width: 100px;">Người đón</th>
            <th style="width: 90px;">Mối quan hệ</th>
            <th>Tình trạng khi bàn giao</th>
            <th style="width: 85px;">Ký nhận</th>
          </tr>
        </thead>
        <tbody>${handoverRows}</tbody>
      </table>`;
  };

  const getFullHtml = () => {
    const content = `
      <div style="margin-bottom: 12px; font-size: 11pt;">
        <div><b>Lớp:</b> ${report.className} (${report.gradeName}) - <b>Sĩ số:</b> ${report.metrics.totalStudents} trẻ</div>
        <div><b>Giáo viên phụ trách:</b> ${report.teacherName}</div>
        <div><b>Kỳ báo cáo:</b> ${periodText} • Chuyên cần đạt: <b>${report.metrics.attendanceRate}%</b></div>
      </div>
      ${buildTableSection()}
      <div style="margin-top: 15px; font-size: 11pt;">
        <div><b>Nhận xét của giáo viên:</b> ${report.teacherRemarks || 'Các cháu chăm ngoan, nề nếp tốt.'}</div>
        <div style="margin-top: 4px;"><b>Đề xuất với nhà trường:</b> ${report.recommendations || 'Không có.'}</div>
      </div>
    `;
    return generateReportPrintHtml(
      {
        reportTitle: reportMeta.title.toUpperCase(),
        subTitle: `${report.className} - Kỳ: ${periodText}`,
        periodText,
        reporterRole: 'GIÁO VIÊN PHỤ TRÁCH',
        reporterName: report.teacherName,
      },
      content,
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/80">
          <div>
            <h3 className="font-bold text-gray-900 text-base">{reportMeta.title}</h3>
            <p className="text-xs text-gray-500">Xem trước văn bản lớp ({report.className} - {report.metrics.totalStudents} trẻ)</p>
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
            onClick={() => executePrintOrDownload(getFullHtml(), 'download', `${reportMeta.id}_${report.className}.html`)}
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
