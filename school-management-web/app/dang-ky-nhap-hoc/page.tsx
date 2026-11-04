"use client";

import React from "react";
import Link from "next/link";
import { Send, ArrowLeft, Loader2 } from "lucide-react";
import { useAdmissionForm } from "./components/useAdmissionForm";
import AdmissionSuccessView from "./components/AdmissionSuccessView";
import FatherInfoSection from "./components/FatherInfoSection";
import MotherInfoSection from "./components/MotherInfoSection";
import HouseholdInfoSection from "./components/HouseholdInfoSection";
import ChildInfoSection from "./components/ChildInfoSection";

export default function DangKyNhapHocPage() {
  const {
    form,
    submitting,
    submitted,
    errorMsg,
    handleChange,
    handleSubmit,
    resetForm,
  } = useAdmissionForm();

  if (submitted) {
    return <AdmissionSuccessView form={form} onReset={resetForm} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-300 shadow-2xl p-6 sm:p-10 font-sans">
        {/* Top Header matching Official Vietnamese Document format */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-200 text-center md:text-left">
          <div>
            <p className="font-bold text-xs uppercase tracking-wide text-slate-800">
              UBND HUYỆN HÓC MÔN
            </p>
            <p className="font-extrabold text-sm uppercase text-slate-900 underline decoration-slate-800 underline-offset-4">
              TRƯỜNG MN BÉ NGOAN
            </p>
          </div>

          <div className="text-center md:text-right">
            <p className="font-bold text-xs uppercase tracking-wide text-slate-800">
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
            </p>
            <p className="font-semibold text-xs text-slate-700 italic">
              Độc lập – Tự do – Hạnh phúc
            </p>
          </div>
        </div>

        {/* Title */}
        <div className="text-center py-6">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-wider">
            ĐƠN XIN NHẬP HỌC
          </h1>
          <p className="font-black text-sm text-slate-600 mt-1">*****</p>
          <p className="text-xs sm:text-sm font-bold text-slate-700 mt-2 italic">
            Kính gửi: BAN GIÁM HIỆU TRƯỜNG MẦM NON BÉ NGOAN
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold font-sans">
            {errorMsg}
          </div>
        )}

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 text-xs sm:text-sm text-slate-800"
        >
          {/* 1. Thông tin Cha */}
          <FatherInfoSection form={form} onChange={handleChange} />

          {/* 2. Thông tin Mẹ */}
          <MotherInfoSection form={form} onChange={handleChange} />

          {/* 3. Hộ khẩu & Nơi ở */}
          <HouseholdInfoSection form={form} onChange={handleChange} />

          {/* 4. Thông tin Trẻ */}
          <ChildInfoSection form={form} onChange={handleChange} />

          {/* Cam kết của phụ huynh */}
          <div className="pt-2 text-xs text-slate-700 space-y-2 italic">
            <p>
              Được học tại trường năm học <b>{form.namHoc}</b>. Chúng tôi xin chấp
              hành tốt các nội quy của nhà trường đề ra.
            </p>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
            <Link
              href="/"
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <ArrowLeft size={14} /> Quay lại trang chủ
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-black text-sm shadow-lg shadow-sky-600/30 hover:from-sky-700 hover:to-indigo-700 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Đang gửi đơn...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Gửi đơn xin nhập học cho Ban Giám Hiệu
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
