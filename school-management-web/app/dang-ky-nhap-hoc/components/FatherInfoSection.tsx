"use client";

import React from "react";
import { AdmissionFormData, FormChangeHandler } from "./types";

interface FatherInfoSectionProps {
  form: AdmissionFormData;
  onChange: FormChangeHandler;
}

export default function FatherInfoSection({
  form,
  onChange,
}: FatherInfoSectionProps) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 sm:p-5 border border-slate-200 space-y-3">
      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 uppercase tracking-wide text-sky-800">
        1. Thông tin về Cha
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-600 mb-1">
            Tên cha
          </label>
          <input
            type="text"
            name="tenCha"
            value={form.tenCha}
            onChange={onChange}
            placeholder="Họ và tên cha..."
            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-sans focus:ring-1 focus:ring-sky-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">
            Năm sinh
          </label>
          <input
            type="text"
            name="namSinhCha"
            value={form.namSinhCha}
            onChange={onChange}
            placeholder="VD: 1988"
            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-sans focus:ring-1 focus:ring-sky-500 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">
            Trình độ học vấn
          </label>
          <input
            type="text"
            name="trinhDoCha"
            value={form.trinhDoCha}
            onChange={onChange}
            placeholder="12/12, Đại học..."
            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-sans focus:ring-1 focus:ring-sky-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">
            Nghề nghiệp
          </label>
          <input
            type="text"
            name="ngheNghiepCha"
            value={form.ngheNghiepCha}
            onChange={onChange}
            placeholder="Kỹ sư, Kinh doanh..."
            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-sans focus:ring-1 focus:ring-sky-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">
            Điện thoại
          </label>
          <input
            type="tel"
            name="dienThoaiCha"
            value={form.dienThoaiCha}
            onChange={onChange}
            placeholder="090..."
            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-sans focus:ring-1 focus:ring-sky-500 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-600 mb-1">
          Nơi làm việc
        </label>
        <input
          type="text"
          name="noiLamViecCha"
          value={form.noiLamViecCha}
          onChange={onChange}
          placeholder="Tên cơ quan, công ty..."
          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-sans focus:ring-1 focus:ring-sky-500 outline-none"
        />
      </div>
    </div>
  );
}
export { FatherInfoSection };
