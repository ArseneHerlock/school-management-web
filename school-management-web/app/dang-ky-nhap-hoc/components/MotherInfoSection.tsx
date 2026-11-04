"use client";

import React from "react";
import { AdmissionFormData, FormChangeHandler } from "./types";

interface MotherInfoSectionProps {
  form: AdmissionFormData;
  onChange: FormChangeHandler;
}

export default function MotherInfoSection({
  form,
  onChange,
}: MotherInfoSectionProps) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 sm:p-5 border border-slate-200 space-y-3">
      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 uppercase tracking-wide text-sky-800">
        2. Thông tin về Mẹ
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-600 mb-1">
            Tên mẹ
          </label>
          <input
            type="text"
            name="tenMe"
            value={form.tenMe}
            onChange={onChange}
            placeholder="Họ và tên mẹ..."
            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-sans focus:ring-1 focus:ring-sky-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">
            Năm sinh
          </label>
          <input
            type="text"
            name="namSinhMe"
            value={form.namSinhMe}
            onChange={onChange}
            placeholder="VD: 1992"
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
            name="trinhDoMe"
            value={form.trinhDoMe}
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
            name="ngheNghiepMe"
            value={form.ngheNghiepMe}
            onChange={onChange}
            placeholder="Giáo viên, Kế toán..."
            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-sans focus:ring-1 focus:ring-sky-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">
            Điện thoại
          </label>
          <input
            type="tel"
            name="dienThoaiMe"
            value={form.dienThoaiMe}
            onChange={onChange}
            placeholder="091..."
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
          name="noiLamViecMe"
          value={form.noiLamViecMe}
          onChange={onChange}
          placeholder="Tên cơ quan, công ty..."
          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-sans focus:ring-1 focus:ring-sky-500 outline-none"
        />
      </div>
    </div>
  );
}
export { MotherInfoSection };
