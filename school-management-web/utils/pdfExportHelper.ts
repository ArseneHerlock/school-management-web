/**
 * Tiện ích in ấn và xuất báo cáo chuẩn văn bản hành chính sư phạm mầm non
 * File size: < 200 dòng (Tuân thủ nghiêm ngặt quy tắc kiến trúc dự án)
 */

export interface PdfExportMetadata {
  schoolName?: string;
  departmentName?: string;
  reportTitle: string;
  subTitle?: string;
  periodText: string;
  reporterName?: string;
  reporterRole?: string;
  dateText?: string;
}

export function generateReportPrintHtml(
  meta: PdfExportMetadata,
  contentHtml: string,
): string {
  const school = meta.schoolName || 'TRƯỜNG MẦM NON HOA HƯỚNG DƯƠNG';
  const dept = meta.departmentName || 'PHÒNG GIÁO DỤC VÀ ĐÀO TẠO QUẬN BÌNH THẠNH';
  const today = meta.dateText || new Date().toLocaleDateString('vi-VN');

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <title>${meta.reportTitle}</title>
  <style>
    @page { size: A4; margin: 15mm 15mm 20mm 15mm; }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 13pt;
      line-height: 1.4;
      color: #111;
      margin: 0;
      padding: 0;
      background: #fff;
    }
    .header-table { width: 100%; margin-bottom: 20px; border-collapse: collapse; }
    .header-table td { vertical-align: top; text-align: center; font-size: 11pt; padding: 0; }
    .header-left { width: 45%; }
    .header-right { width: 55%; font-weight: bold; }
    .report-title {
      text-align: center;
      margin: 20px 0 6px 0;
      font-size: 16pt;
      font-weight: bold;
      text-transform: uppercase;
      color: #1e3a8a;
    }
    .report-subtitle { text-align: center; font-size: 12pt; font-style: italic; margin-bottom: 15px; }
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
      font-size: 11pt;
    }
    table.data-table th, table.data-table td {
      border: 1px solid #333;
      padding: 6px 8px;
      text-align: left;
    }
    table.data-table th {
      background-color: #f1f5f9;
      font-weight: bold;
      text-align: center;
    }
    .text-center { text-align: center !important; }
    .text-right { text-align: right !important; }
    .font-bold { font-weight: bold; }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin: 15px 0;
    }
    .summary-card {
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      padding: 8px;
      text-align: center;
      background: #f8fafc;
    }
    .summary-num { font-size: 14pt; font-weight: bold; color: #1e40af; }
    .summary-label { font-size: 9pt; color: #475569; text-transform: uppercase; }
    .footer-table { width: 100%; margin-top: 30px; border-collapse: collapse; }
    .footer-table td { width: 50%; text-align: center; vertical-align: top; font-size: 11pt; }
    .sign-title { font-weight: bold; text-transform: uppercase; margin-bottom: 50px; }
  </style>
</head>
<body>
  <table class="header-table">
    <tr>
      <td class="header-left">
        <div>${dept}</div>
        <div style="font-weight: bold;">${school}</div>
        <div style="font-size: 10pt; margin-top: 4px;">Số: ....../BC-MN</div>
      </td>
      <td class="header-right">
        <div>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
        <div style="font-weight: normal; font-style: italic; font-size: 10pt;">Độc lập - Tự do - Hạnh phúc</div>
        <div style="font-weight: normal; font-style: italic; margin-top: 6px;">Ngày ${today}</div>
      </td>
    </tr>
  </table>

  <div class="report-title">${meta.reportTitle}</div>
  <div class="report-subtitle">${meta.subTitle || meta.periodText}</div>

  ${contentHtml}

  <table class="footer-table">
    <tr>
      <td>
        <div style="font-style: italic;">Nơi nhận:</div>
        <div style="font-size: 10pt;">- Ban Giám Hiệu;</div>
        <div style="font-size: 10pt;">- Lưu văn thư.</div>
      </td>
      <td>
        <div class="sign-title">${meta.reporterRole || 'NGƯỜI LẬP BÁO CÁO'}</div>
        <div style="font-weight: bold; margin-top: 60px;">${meta.reporterName || 'Nguyễn Thị Mai'}</div>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function executePrintOrDownload(
  htmlContent: string,
  mode: 'print' | 'download',
  filename = 'Bao_Cao.html',
): void {
  if (typeof window === 'undefined') return;

  if (mode === 'print') {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Vui lòng cho phép mở cửa sổ popup để in báo cáo.');
      return;
    }
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  } else {
    // Tải về dạng file HTML hoàn chỉnh có thể mở offline hoặc in sang PDF
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.html') ? filename : `${filename}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
