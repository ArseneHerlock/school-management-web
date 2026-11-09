"use client";

import React from "react";
import { EnrollmentApp } from "../types";

interface EnrollmentDetailModalProps {
  viewDetailApp: EnrollmentApp | null;
  onClose: () => void;
  onTriggerApprove: (app: EnrollmentApp) => void;
}

export function EnrollmentDetailModal({
  viewDetailApp,
  onClose,
  onTriggerApprove,
}: EnrollmentDetailModalProps) {
  if (!viewDetailApp) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/50 p-4 font-serif"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-2 text-xs border-b border-slate-200 pb-3">
          <div>
            <p className="font-bold">UBND HUYỆN HÓC MÔN</p>
            <p className="font-black underline">TRƯỜNG MẦM NON TUỔI THƠ</p>
          </div>
          <div className="text-right">
            <p className="font-bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
            <p className="italic">Độc lập – Tự do – Hạnh phúc</p>
          </div>
        </div>

        <div className="text-center py-2">
          <h3 className="text-xl font-black">ĐƠN XIN NHẬP HỌC</h3>
          <p className="text-xs italic text-slate-600 mt-1">
            Kính gửi: BAN GIÁM HIỆU TRƯỜNG MẦM NON TUỔI THƠ
          </p>
        </div>

        <div className="text-xs space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 font-sans">
          <p>
            <b>Tên cha:</b> {viewDetailApp.TenCha || "—"} · <b>Năm sinh:</b> {viewDetailApp.NamSinhCha || "—"} · <b>Trình độ:</b> {viewDetailApp.TrinhDoCha || "—"}
          </p>
          <p>
            <b>Nghề nghiệp:</b> {viewDetailApp.NgheNghiepCha || "—"} · <b>Nơi làm việc:</b> {viewDetailApp.NoiLamViecCha || "—"} · <b>Điện thoại:</b> {viewDetailApp.DienThoaiCha || "—"}
          </p>
          <div className="border-t border-slate-200 my-1" />
          <p>
            <b>Tên mẹ:</b> {viewDetailApp.TenMe || "—"} · <b>Năm sinh:</b> {viewDetailApp.NamSinhMe || "—"} · <b>Trình độ:</b> {viewDetailApp.TrinhDoMe || "—"}
          </p>
          <p>
            <b>Nghề nghiệp:</b> {viewDetailApp.NgheNghiepMe || "—"} · <b>Nơi làm việc:</b> {viewDetailApp.NoiLamViecMe || "—"} · <b>Điện thoại:</b> {viewDetailApp.DienThoaiMe || "—"}
          </p>
          <div className="border-t border-slate-200 my-1" />
          <p><b>Hộ khẩu thường trú:</b> {viewDetailApp.HoKhauThuongTru || "—"}</p>
          <p><b>Chỗ ở hiện nay:</b> {viewDetailApp.ChoOHienNay || "—"}</p>
          <p>
            <b>Tên chủ hộ:</b> {viewDetailApp.TenChuHo || "—"} · <b>Điện thoại liên lạc:</b> <b className="text-emerald-700">{viewDetailApp.DienThoaiLienHe || "—"}</b>
          </p>
          <div className="border-t border-slate-200 my-1" />
          <p>
            <b>Họ tên con:</b> <b className="text-sm text-slate-900">{viewDetailApp.TenTre}</b> ({viewDetailApp.GioiTinh})
          </p>
          <p>
            <b>Sinh ngày:</b> {viewDetailApp.NgaySinh || "—"} · <b>Dân tộc:</b> {viewDetailApp.DanToc || "Kinh"}
          </p>
          <p>
            <b>Cân nặng khi sinh:</b> {viewDetailApp.CanNang || "—"} · <b>Chiều cao khi sinh:</b> {viewDetailApp.ChieuCao || "—"}
          </p>
          <p><b>Tiền sử bệnh tật:</b> {viewDetailApp.TienSuBenh || "Không có"}</p>
          <p>
            <b>Con thứ mấy:</b> {viewDetailApp.ConThuMay || "1"} · <b>Tổng số con trong gia đình:</b> {viewDetailApp.TongSoCon || "1"}
          </p>
          <p>
            <b>Năm học đăng ký:</b> {viewDetailApp.NamHoc || "2026 - 2027"} · <b>Khối mong muốn:</b> {viewDetailApp.KhoiMongMuon || "—"}
          </p>

          {viewDetailApp.KhaoSatDauVao && (
            <div className="mt-3 pt-3 border-t border-slate-200">
              <p className="font-bold text-slate-800 mb-2">
                Khảo sát năng lực ban đầu từ phụ huynh (5 Lĩnh vực):
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                {(() => {
                  const ks =
                    typeof viewDetailApp.KhaoSatDauVao === "string"
                      ? JSON.parse(viewDetailApp.KhaoSatDauVao)
                      : viewDetailApp.KhaoSatDauVao;

                  const calcAvg = (prefix: string) => {
                    const vals = Object.entries(ks)
                      .filter(([k]) => k.toLowerCase().startsWith(prefix))
                      .map(([, v]) => Number(v));
                    if (!vals.length) return 85;
                    return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100);
                  };

                  return [
                    { label: "Thể chất", val: calcAvg("phys"), color: "text-blue-700 bg-blue-50 border-blue-200" },
                    { label: "Nhận thức", val: calcAvg("cog"), color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
                    { label: "Ngôn ngữ", val: calcAvg("lang"), color: "text-amber-800 bg-amber-50 border-amber-200" },
                    { label: "TC & Xã hội", val: calcAvg("soc"), color: "text-purple-700 bg-purple-50 border-purple-200" },
                    { label: "Thẩm mỹ", val: calcAvg("aes"), color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
                  ].map((item) => (
                    <div key={item.label} className={`p-2 rounded-xl border ${item.color}`}>
                      <p className="text-[10px] font-bold">{item.label}</p>
                      <p className="text-sm font-black mt-0.5">{item.val}%</p>
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 font-sans">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            Đóng
          </button>
          {viewDetailApp.TrangThai !== "DaNhapHoc" && (
            <button
              type="button"
              onClick={() => onTriggerApprove(viewDetailApp)}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md cursor-pointer"
            >
              Duyệt hồ sơ cho nhập học
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
