"use client";

import React from "react";
import { AdmissionFormData, FormChangeHandler } from "./types";

interface HouseholdInfoSectionProps {
  form: AdmissionFormData;
  onChange: FormChangeHandler;
}

export default function HouseholdInfoSection({
  form,
  onChange,
}: HouseholdInfoSectionProps) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 sm:p-5 border border-slate-200 space-y-3">
      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 uppercase tracking-wide text-sky-800">
        3. Hộ khẩu & Nơi ở hiện tại
      </h3>
      <div>
        <label className="block text-xs font-bold text-slate-600 mb-1">
          Hộ khẩu thường trú
        </label>
        <input
          type="text"
          name="hoKhauThuongTru"
          value={form.hoKhauThuongTru}
          onChange={onChange}
          placeholder="Địa chỉ ghi trong sổ hộ khẩu..."
          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-sans focus:ring-1 focus:ring-sky-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-600 mb-1">
          Chỗ ở hiện nay *
        </label>
        <input
          type="text"
          required
          name="choOHienNay"
          value={form.choOHienNay}
          onChange={onChange}
          placeholder="Số nhà, tên đường, xã/thị trấn, huyện Hóc Môn..."
          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-sans focus:ring-1 focus:ring-sky-500 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">
            Tên chủ hộ
          </label>
          <input
            type="text"
            name="tenChuHo"
            value={form.tenChuHo}
            onChange={onChange}
            placeholder="Họ tên chủ hộ..."
            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-sans focus:ring-1 focus:ring-sky-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">
            Điện thoại liên lạc khi cần *
          </label>
          <input
            type="tel"
            required
            name="dienThoaiLienHe"
            value={form.dienThoaiLienHe}
            onChange={onChange}
            placeholder="Số điện thoại chính để trường liên hệ"
            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-sans focus:ring-1 focus:ring-sky-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
export { HouseholdInfoSection };
