"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { AdmissionFormData } from "./types";

interface AdmissionSuccessViewProps {
  form: AdmissionFormData;
  onReset: () => void;
}

export default function AdmissionSuccessView({
  form,
  onReset,
}: AdmissionSuccessViewProps) {
  const contactPhone =
    form.dienThoaiLienHe || form.dienThoaiMe || form.dienThoaiCha;

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 flex items-center justify-center font-sans">
      <div className="max-w-xl w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 size={36} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Nộp đơn xin nhập học thành công!
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed font-sans">
          Hồ sơ đăng ký của bé <b>{form.tenTre}</b> đã được gửi trực tiếp đến Ban
          Giám Hiệu Trường Mầm Non Bé Ngoan. Nhà trường sẽ liên hệ với quý phụ
          huynh qua số điện thoại <b>{contactPhone}</b> trong thời gian sớm nhất!
        </p>
        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center font-sans">
          <button
            onClick={onReset}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Nộp thêm đơn khác
          </button>
          <Link
            href="/"
            className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-xs font-bold text-white shadow-md transition cursor-pointer inline-flex items-center justify-center"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
export { AdmissionSuccessView };
