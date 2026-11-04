"use client";

import React from "react";
import { AdmissionFormData, FormChangeHandler } from "./types";

interface ChildInfoSectionProps {
  form: AdmissionFormData;
  onChange: FormChangeHandler;
}

export default function ChildInfoSection({
  form,
  onChange,
}: ChildInfoSectionProps) {
  return (
    <div className="rounded-2xl bg-sky-50/60 p-4 sm:p-5 border border-sky-200 space-y-3">
      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 uppercase tracking-wide text-sky-900">
        4. Thông tin về Trẻ xin nhập học
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Xin Ban Giám Hiệu chấp thuận cho con chúng tôi là *
          </label>
          <input
            type="text"
            required
            name="tenTre"
            value={form.tenTre}
            onChange={onChange}
            placeholder="Họ và tên của bé..."
            className="w-full bg-white border border-sky-300 rounded-xl px-3 py-2 text-xs font-sans focus:ring-1 focus:ring-sky-500 outline-none font-bold text-slate-900"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Giới tính *
          </label>
          <select
            name="gioiTinh"
            value={form.gioiTinh}
            onChange={onChange}
            className="w-full bg-white border border-sky-300 rounded-xl px-3 py-2 text-xs font-sans focus:ring-1 focus:ring-sky-500 outline-none font-bold"
          >
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Ngày sinh của bé *
          </label>
          <input
            type="date"
            required
            name="ngaySinh"
            value={form.ngaySinh}
            onChange={onChange}
            className="w-full bg-white border border-sky-300 rounded-xl px-3 py-2 text-xs font-sans focus:ring-1 focus:ring-sky-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Dân tộc
          </label>
          <input
            type="text"
            name="danToc"
            value={form.danToc}
            onChange={onChange}
            placeholder="Kinh, Hoa..."
            className="w-full bg-white border border-sky-300 rounded-xl px-3 py-2 text-xs font-sans focus:ring-1 focus:ring-sky-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Khối mong muốn
          </label>
          <select
            name="khoiMongMuon"
            value={form.khoiMongMuon}
            onChange={onChange}
            className="w-full bg-white border border-sky-300 rounded-xl px-3 py-2 text-xs font-sans focus:ring-1 focus:ring-sky-500 outline-none"
          >
            <option value="Khối Nhà Trẻ">Khối Nhà Trẻ (18 - 24 tháng)</option>
            <option value="Khối Mầm">Khối Mầm (3 tuổi)</option>
            <option value="Khối Chồi">Khối Chồi (4 tuổi)</option>
            <option value="Khối Lá">Khối Lá (5 tuổi)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Cân nặng khi sinh
          </label>
          <input
            type="text"
            name="canNang"
            value={form.canNang}
            onChange={onChange}
            placeholder="VD: 3.2 kg"
            className="w-full bg-white border border-sky-300 rounded-xl px-3 py-2 text-xs font-sans outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Chiều cao khi sinh
          </label>
          <input
            type="text"
            name="chieuCao"
            value={form.chieuCao}
            onChange={onChange}
            placeholder="VD: 50 cm"
            className="w-full bg-white border border-sky-300 rounded-xl px-3 py-2 text-xs font-sans outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Con thứ mấy
          </label>
          <input
            type="text"
            name="conThuMay"
            value={form.conThuMay}
            onChange={onChange}
            placeholder="1"
            className="w-full bg-white border border-sky-300 rounded-xl px-3 py-2 text-xs font-sans outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Tổng số con
          </label>
          <input
            type="text"
            name="tongSoCon"
            value={form.tongSoCon}
            onChange={onChange}
            placeholder="2"
            className="w-full bg-white border border-sky-300 rounded-xl px-3 py-2 text-xs font-sans outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Tiền sử bệnh tật (nếu có dị ứng, bệnh mãn tính...)
        </label>
        <input
          type="text"
          name="tienSuBenh"
          value={form.tienSuBenh}
          onChange={onChange}
          placeholder="Ghi chú về sức khỏe của trẻ để nhà trường chăm sóc chu đáo..."
          className="w-full bg-white border border-sky-300 rounded-xl px-3 py-2 text-xs font-sans outline-none"
        />
      </div>
    </div>
  );
}
export { ChildInfoSection };
