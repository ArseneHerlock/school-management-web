'use client';

import React, { useState } from 'react';
import { CheckCircle2, Send, School, ArrowLeft, Loader2, Sparkles, FileText } from 'lucide-react';
import Link from 'next/link';
import { getFullApiUrl } from '@/lib/api';

export default function DangKyNhapHocPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    // Child info
    tenTre: '',
    gioiTinh: 'Nam',
    ngaySinh: '',
    danToc: 'Kinh',
    canNang: '',
    chieuCao: '',
    tienSuBenh: '',
    conThuMay: '1',
    tongSoCon: '1',
    namHoc: '2026 - 2027',
    khoiMongMuon: 'Khối Mầm',

    // Father info
    tenCha: '',
    namSinhCha: '',
    trinhDoCha: '',
    ngheNghiepCha: '',
    noiLamViecCha: '',
    dienThoaiCha: '',

    // Mother info
    tenMe: '',
    namSinhMe: '',
    trinhDoMe: '',
    ngheNghiepMe: '',
    noiLamViecMe: '',
    dienThoaiMe: '',

    // Household & Address
    hoKhauThuongTru: '',
    choOHienNay: '',
    tenChuHo: '',
    dienThoaiLienHe: '',
    ghiChu: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!form.tenTre.trim()) {
      setErrorMsg('Vui lòng nhập họ và tên của trẻ.');
      return;
    }
    if (!form.dienThoaiLienHe && !form.dienThoaiMe && !form.dienThoaiCha) {
      setErrorMsg('Vui lòng nhập ít nhất một số điện thoại liên lạc.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(getFullApiUrl('/api/enrollment'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || 'Gửi đơn đăng ký thất bại.');
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi gửi đơn đăng ký.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
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
            Hồ sơ đăng ký của bé <b>{form.tenTre}</b> đã được gửi trực tiếp đến Ban Giám Hiệu Trường Mầm Non Bé Ngoan. Nhà trường sẽ liên hệ với quý phụ huynh qua số điện thoại <b>{form.dienThoaiLienHe || form.dienThoaiMe || form.dienThoaiCha}</b> trong thời gian sớm nhất!
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center font-sans">
            <button
              onClick={() => {
                setSubmitted(false);
                setForm({
                  tenTre: '',
                  gioiTinh: 'Nam',
                  ngaySinh: '',
                  danToc: 'Kinh',
                  canNang: '',
                  chieuCao: '',
                  tienSuBenh: '',
                  conThuMay: '1',
                  tongSoCon: '1',
                  namHoc: '2026 - 2027',
                  khoiMongMuon: 'Khối Mầm',
                  tenCha: '',
                  namSinhCha: '',
                  trinhDoCha: '',
                  ngheNghiepCha: '',
                  noiLamViecCha: '',
                  dienThoaiCha: '',
                  tenMe: '',
                  namSinhMe: '',
                  trinhDoMe: '',
                  ngheNghiepMe: '',
                  noiLamViecMe: '',
                  dienThoaiMe: '',
                  hoKhauThuongTru: '',
                  choOHienNay: '',
                  tenChuHo: '',
                  dienThoaiLienHe: '',
                  ghiChu: '',
                });
              }}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Nộp thêm đơn khác
            </button>
            <Link
              href="/"
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-xs font-bold text-white shadow-md transition cursor-pointer"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-300 shadow-2xl p-6 sm:p-10 font-sans">
        {/* Top Header matching Official Vietnamese Document format in Image 1 */}
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

        {/* Form Body matching Image 1 */}
        <form onSubmit={handleSubmit} className="space-y-6 text-xs sm:text-sm text-slate-800">
          {/* 1. Thông tin Cha */}
          <div className="rounded-2xl bg-slate-50 p-4 sm:p-5 border border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 uppercase tracking-wide text-sky-800">
              1. Thông tin về Cha
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-1">Tên cha</label>
                <input
                  type="text"
                  name="tenCha"
                  value={form.tenCha}
                  onChange={handleChange}
                  placeholder="Họ và tên cha..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-sans focus:ring-1 focus:ring-sky-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Năm sinh</label>
                <input
                  type="text"
                  name="namSinhCha"
                  value={form.namSinhCha}
                  onChange={handleChange}
                  placeholder="VD: 1988"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-sans focus:ring-1 focus:ring-sky-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Trình độ học vấn</label>
                <input
                  type="text"
                  name="trinhDoCha"
                  value={form.trinhDoCha}
                  onChange={handleChange}
                  placeholder="12/12, Đại học..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-sans focus:ring-1 focus:ring-sky-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Nghề nghiệp</label>
                <input
                  type="text"
                  name="ngheNghiepCha"
                  value={form.ngheNghiepCha}
                  onChange={handleChange}
                  placeholder="Kỹ sư, Kinh doanh..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-sans focus:ring-1 focus:ring-sky-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Điện thoại</label>
                <input
                  type="tel"
                  name="dienThoaiCha"
                  value={form.dienThoaiCha}
                  onChange={handleChange}
                  placeholder="090..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-sans focus:ring-1 focus:ring-sky-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Nơi làm việc</label>
              <input
                type="text"
                name="noiLamViecCha"
                value={form.noiLamViecCha}
                onChange={handleChange}
                placeholder="Tên cơ quan, công ty..."
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-sans focus:ring-1 focus:ring-sky-500 outline-none"
              />
            </div>
          </div>

          {/* 2. Thông tin Mẹ */}
          <div className="rounded-2xl bg-slate-50 p-4 sm:p-5 border border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 uppercase tracking-wide text-sky-800">
              2. Thông tin về Mẹ
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-1">Tên mẹ</label>
                <input
                  type="text"
                  name="tenMe"
                  value={form.tenMe}
                  onChange={handleChange}
                  placeholder="Họ và tên mẹ..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-sans focus:ring-1 focus:ring-sky-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Năm sinh</label>
                <input
                  type="text"
                  name="namSinhMe"
                  value={form.namSinhMe}
                  onChange={handleChange}
                  placeholder="VD: 1992"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-sans focus:ring-1 focus:ring-sky-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Trình độ học vấn</label>
                <input
                  type="text"
                  name="trinhDoMe"
                  value={form.trinhDoMe}
                  onChange={handleChange}
                  placeholder="12/12, Đại học..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-sans focus:ring-1 focus:ring-sky-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Nghề nghiệp</label>
                <input
                  type="text"
                  name="ngheNghiepMe"
                  value={form.ngheNghiepMe}
                  onChange={handleChange}
                  placeholder="Giáo viên, Kế toán..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-sans focus:ring-1 focus:ring-sky-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Điện thoại</label>
                <input
                  type="tel"
                  name="dienThoaiMe"
                  value={form.dienThoaiMe}
                  onChange={handleChange}
                  placeholder="091..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-sans focus:ring-1 focus:ring-sky-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Nơi làm việc</label>
              <input
                type="text"
                name="noiLamViecMe"
                value={form.noiLamViecMe}
                onChange={handleChange}
                placeholder="Tên cơ quan, công ty..."
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-sans focus:ring-1 focus:ring-sky-500 outline-none"
              />
            </div>
          </div>

          {/* 3. Hộ khẩu & Chỗ ở */}
          <div className="rounded-2xl bg-slate-50 p-4 sm:p-5 border border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 uppercase tracking-wide text-sky-800">
              3. Hộ khẩu & Nơi ở hiện tại
            </h3>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Hộ khẩu thường trú</label>
              <input
                type="text"
                name="hoKhauThuongTru"
                value={form.hoKhauThuongTru}
                onChange={handleChange}
                placeholder="Địa chỉ ghi trong sổ hộ khẩu..."
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-sans focus:ring-1 focus:ring-sky-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Chỗ ở hiện nay *</label>
              <input
                type="text"
                required
                name="choOHienNay"
                value={form.choOHienNay}
                onChange={handleChange}
                placeholder="Số nhà, tên đường, xã/thị trấn, huyện Hóc Môn..."
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-sans focus:ring-1 focus:ring-sky-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Tên chủ hộ</label>
                <input
                  type="text"
                  name="tenChuHo"
                  value={form.tenChuHo}
                  onChange={handleChange}
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
                  onChange={handleChange}
                  placeholder="Số điện thoại chính để trường liên hệ"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-sans focus:ring-1 focus:ring-sky-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* 4. Thông tin trẻ */}
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
                  onChange={handleChange}
                  placeholder="Họ và tên của bé..."
                  className="w-full bg-white border border-sky-300 rounded-xl px-3 py-2 text-xs font-sans focus:ring-1 focus:ring-sky-500 outline-none font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Giới tính *</label>
                <select
                  name="gioiTinh"
                  value={form.gioiTinh}
                  onChange={handleChange}
                  className="w-full bg-white border border-sky-300 rounded-xl px-3 py-2 text-xs font-sans focus:ring-1 focus:ring-sky-500 outline-none font-bold"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ngày sinh của bé *</label>
                <input
                  type="date"
                  required
                  name="ngaySinh"
                  value={form.ngaySinh}
                  onChange={handleChange}
                  className="w-full bg-white border border-sky-300 rounded-xl px-3 py-2 text-xs font-sans focus:ring-1 focus:ring-sky-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dân tộc</label>
                <input
                  type="text"
                  name="danToc"
                  value={form.danToc}
                  onChange={handleChange}
                  placeholder="Kinh, Hoa..."
                  className="w-full bg-white border border-sky-300 rounded-xl px-3 py-2 text-xs font-sans focus:ring-1 focus:ring-sky-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Khối mong muốn</label>
                <select
                  name="khoiMongMuon"
                  value={form.khoiMongMuon}
                  onChange={handleChange}
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Cân nặng khi sinh</label>
                <input
                  type="text"
                  name="canNang"
                  value={form.canNang}
                  onChange={handleChange}
                  placeholder="VD: 3.2 kg"
                  className="w-full bg-white border border-sky-300 rounded-xl px-3 py-2 text-xs font-sans outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chiều cao khi sinh</label>
                <input
                  type="text"
                  name="chieuCao"
                  value={form.chieuCao}
                  onChange={handleChange}
                  placeholder="VD: 50 cm"
                  className="w-full bg-white border border-sky-300 rounded-xl px-3 py-2 text-xs font-sans outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Con thứ mấy</label>
                <input
                  type="text"
                  name="conThuMay"
                  value={form.conThuMay}
                  onChange={handleChange}
                  placeholder="1"
                  className="w-full bg-white border border-sky-300 rounded-xl px-3 py-2 text-xs font-sans outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tổng số con</label>
                <input
                  type="text"
                  name="tongSoCon"
                  value={form.tongSoCon}
                  onChange={handleChange}
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
                onChange={handleChange}
                placeholder="Ghi chú về sức khỏe của trẻ để nhà trường chăm sóc chu đáo..."
                className="w-full bg-white border border-sky-300 rounded-xl px-3 py-2 text-xs font-sans outline-none"
              />
            </div>
          </div>

          {/* Cam kết của phụ huynh */}
          <div className="pt-2 text-xs text-slate-700 space-y-2 italic">
            <p>
              Được học tại trường năm học <b>{form.namHoc}</b>. Chúng tôi xin chấp hành tốt các nội quy của nhà trường đề ra.
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
