"use client";

import React from "react";
import { Printer, X } from "lucide-react";
import { SchoolAward } from "../types";

interface KhenThuongCertificateModalProps {
  previewAward: SchoolAward | null;
  onClose: () => void;
  onPrint: () => void;
  batchPrintMode: boolean;
  filteredAwards: SchoolAward[];
  schoolYear: string;
}

export function KhenThuongCertificateModal({
  previewAward,
  onClose,
  onPrint,
  batchPrintMode,
  filteredAwards,
  schoolYear,
}: KhenThuongCertificateModalProps) {
  return (
    <>
      {/* Global Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-certificate-area,
          #printable-certificate-area * {
            visibility: visible;
          }
          #printable-certificate-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Single Certificate Preview & Print Modal */}
      {previewAward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="no-print flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-500">
                XEM TRƯỚC GIẤY KHEN ĐIỆN TỬ
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={onPrint}
                  className="flex items-center gap-1 rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-amber-700 transition"
                >
                  <Printer size={13} /> In giấy khen này
                </button>
                <button
                  onClick={onClose}
                  className="rounded-full bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200 transition"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Certificate Template */}
            <div id="printable-certificate-area" className="mt-4">
              <div className="relative mx-auto rounded-2xl border-8 border-double border-amber-600 bg-[#fffdfa] p-8 text-center shadow-lg">
                <div className="absolute top-2 left-2 text-amber-500 text-lg">✻</div>
                <div className="absolute top-2 right-2 text-amber-500 text-lg">✻</div>
                <div className="absolute bottom-2 left-2 text-amber-500 text-lg">✻</div>
                <div className="absolute bottom-2 right-2 text-amber-500 text-lg">✻</div>

                <p className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                  CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                </p>
                <p className="text-[10px] font-bold text-slate-600 underline underline-offset-4">
                  Độc lập - Tự do - Hạnh phúc
                </p>

                <p className="mt-4 text-xs font-bold uppercase tracking-wide text-amber-800">
                  TRƯỜNG MẦM NON HOA HƯỚNG DƯƠNG - BAN GIÁM HIỆU
                </p>

                <h2 className="mt-5 text-3xl font-black uppercase tracking-widest text-red-600 drop-shadow-sm font-serif">
                  GIẤY KHEN
                </h2>

                <p className="mt-3 text-xs font-medium text-slate-600">
                  HIỆU TRƯỞNG TRƯỜNG MẦM NON HOA HƯỚNG DƯƠNG KHEN TẶNG
                </p>

                <p className="mt-3 text-2xl font-black text-slate-800 underline decoration-amber-500 decoration-wavy">
                  Bé: {previewAward.TenHocSinh}
                </p>

                <p className="mt-1 text-xs font-bold text-slate-600">
                  Học sinh lớp: {previewAward.TenLop}
                </p>

                <p className="mt-4 text-xs font-medium text-slate-600">
                  ĐÃ ĐẠT DANH HIỆU THI ĐUA:
                </p>

                <div className="my-2 inline-block rounded-xl border border-amber-300 bg-amber-50/70 px-6 py-2">
                  <p className="text-xl font-black uppercase text-amber-900 tracking-wider">
                    {previewAward.AwardTitle}
                  </p>
                </div>

                <p className="text-xs font-bold text-slate-600">
                  Năm học: {previewAward.SchoolYear || schoolYear}
                </p>

                <div className="mt-8 flex items-end justify-between px-6 text-left">
                  <div className="text-[11px] text-slate-500">
                    <p className="font-bold text-slate-700">Mã vào sổ khen thưởng:</p>
                    <p className="font-mono font-bold text-amber-800">
                      {previewAward.CertificateCode || "GK-2026-CHỜ-CẤP"}
                    </p>
                  </div>

                  <div className="text-center text-xs">
                    <p className="italic text-slate-500">
                      Hà Nội, ngày 28 tháng 05 năm 2027
                    </p>
                    <p className="mt-1 font-black uppercase text-slate-800">
                      HIỆU TRƯỞNG
                    </p>
                    <div className="relative mx-auto my-1 flex h-16 w-32 items-center justify-center">
                      <div className="rounded-full border-2 border-red-500 px-3 py-2 text-[9px] font-black uppercase text-red-600 rotate-[-8deg] opacity-85">
                        UBND QUẬN
                        <br />
                        MN HOA HƯỚNG DƯƠNG
                        <br />
                        ĐÃ KÝ DUYỆT
                      </div>
                    </div>
                    <p className="font-bold text-slate-700">NGUYỄN THỊ THU HÀ</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="no-print mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="rounded-xl bg-slate-800 px-5 py-2 text-xs font-bold text-white hover:bg-slate-700 transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Batch Print Hidden Container */}
      {batchPrintMode && (
        <div id="printable-certificate-area" className="hidden print:block">
          {filteredAwards
            .filter((a) => a.Status === "APPROVED")
            .map((item) => (
              <div
                key={item.Id}
                className="relative mx-auto rounded-2xl border-8 border-double border-amber-600 bg-white p-8 text-center mb-8 page-break-after"
                style={{ pageBreakAfter: "always" }}
              >
                <p className="text-[11px] font-black uppercase text-slate-700">
                  CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                </p>
                <p className="text-[10px] font-bold text-slate-600 underline">
                  Độc lập - Tự do - Hạnh phúc
                </p>
                <p className="mt-3 text-xs font-bold uppercase text-amber-800">
                  TRƯỜNG MẦM NON HOA HƯỚNG DƯƠNG - BAN GIÁM HIỆU
                </p>
                <h2 className="mt-4 text-3xl font-black uppercase text-red-600 font-serif">
                  GIẤY KHEN
                </h2>
                <p className="mt-3 text-2xl font-black text-slate-800">
                  Bé: {item.TenHocSinh}
                </p>
                <p className="mt-1 text-xs font-bold text-slate-600">
                  Lớp: {item.TenLop}
                </p>
                <div className="my-3 inline-block rounded-xl border border-amber-300 bg-amber-50 px-6 py-2">
                  <p className="text-xl font-black uppercase text-amber-900">
                    {item.AwardTitle}
                  </p>
                </div>
                <p className="text-xs font-bold text-slate-600">
                  Năm học: {item.SchoolYear}
                </p>
                <div className="mt-8 flex items-end justify-between px-6">
                  <div className="text-[11px] text-left">
                    <p className="font-bold">Mã số:</p>
                    <p className="font-mono font-bold text-amber-800">
                      {item.CertificateCode}
                    </p>
                  </div>
                  <div className="text-center text-xs">
                    <p className="italic">Hà Nội, ngày 28 tháng 05 năm 2027</p>
                    <p className="mt-1 font-black uppercase">HIỆU TRƯỞNG</p>
                    <p className="mt-12 font-bold">NGUYỄN THỊ THU HÀ</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </>
  );
}
