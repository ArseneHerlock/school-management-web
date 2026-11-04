"use client";

import React, { RefObject } from "react";
import { FileUp, Loader2, X } from "lucide-react";

interface PdfUploadFieldProps {
  pdfUrl: string;
  pdfFileName: string;
  pdfFileSize: string;
  uploadingPdf: boolean;
  isEditing: boolean;
  pdfInputRef: RefObject<HTMLInputElement | null>;
  onPdfChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearPdf: () => void;
}

export default function PdfUploadField({
  pdfUrl,
  pdfFileName,
  pdfFileSize,
  uploadingPdf,
  isEditing,
  pdfInputRef,
  onPdfChange,
  onClearPdf,
}: PdfUploadFieldProps) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
        1. Tệp tài liệu PDF bài viết / thông báo{" "}
        {isEditing ? "(Tùy chọn cập nhật)" : "*"}
      </label>
      <input
        type="file"
        ref={pdfInputRef}
        accept=".pdf,application/pdf"
        onChange={onPdfChange}
        className="hidden"
      />

      {!pdfUrl ? (
        <div
          onClick={() => pdfInputRef.current?.click()}
          className="border-2 border-dashed border-rose-300 hover:border-rose-500 bg-rose-50/40 hover:bg-rose-50/70 rounded-2xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 group"
        >
          <div className="h-11 w-11 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center group-hover:scale-105 transition">
            {uploadingPdf ? (
              <Loader2 size={22} className="animate-spin text-rose-600" />
            ) : (
              <FileUp size={22} />
            )}
          </div>
          <div className="text-xs">
            <p className="font-bold text-slate-800">
              {uploadingPdf
                ? "Đang tải file PDF lên..."
                : isEditing
                ? "Nhấn vào đây nếu muốn thay đổi / đính kèm file PDF mới"
                : "Nhấn vào đây để tải file PDF lên"}
            </p>
            <p className="text-slate-400 mt-0.5">
              Định dạng file .PDF (Hỗ trợ dung lượng đến 50MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3.5 bg-rose-50 border border-rose-200 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-rose-500 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
              PDF
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 truncate max-w-md">
                {pdfFileName || "Tài liệu PDF đã tải lên"}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                {pdfFileSize ? `${pdfFileSize} · ` : ""}Đã sẵn sàng hiển thị
                trong bài viết
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => pdfInputRef.current?.click()}
              className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Đổi file
            </button>
            <button
              type="button"
              onClick={onClearPdf}
              className="p-1 text-rose-600 hover:text-rose-800 cursor-pointer"
              title="Xóa file"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export { PdfUploadField };
