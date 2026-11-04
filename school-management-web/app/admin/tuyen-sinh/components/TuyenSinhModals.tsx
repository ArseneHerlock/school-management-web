"use client";

import React from "react";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import { EnrollmentApp, EnrollmentClassOption } from "../types";

interface TuyenSinhModalsProps {
  viewDetailApp: EnrollmentApp | null;
  onCloseViewDetail: () => void;
  onTriggerApproveFromDetail: (app: EnrollmentApp) => void;
  approveApp: EnrollmentApp | null;
  onCloseApprove: () => void;
  onConfirmSingleApprove: () => void;
  bulkApproveOpen: boolean;
  onCloseBulkApprove: () => void;
  onConfirmBulkApprove: () => void;
  selectedClassId: string;
  setSelectedClassId: (val: string) => void;
  classes: EnrollmentClassOption[];
  busy: boolean;
  selectedCount: number;
  deletingApp: EnrollmentApp | null;
  onCloseDeleteSingle: () => void;
  onConfirmDeleteSingle: () => void;
  bulkDeleteOpen: boolean;
  onCloseBulkDelete: () => void;
  onConfirmBulkDelete: () => void;
  deletingLoading: boolean;
}

export function TuyenSinhModals({
  viewDetailApp,
  onCloseViewDetail,
  onTriggerApproveFromDetail,
  approveApp,
  onCloseApprove,
  onConfirmSingleApprove,
  bulkApproveOpen,
  onCloseBulkApprove,
  onConfirmBulkApprove,
  selectedClassId,
  setSelectedClassId,
  classes,
  busy,
  selectedCount,
  deletingApp,
  onCloseDeleteSingle,
  onConfirmDeleteSingle,
  bulkDeleteOpen,
  onCloseBulkDelete,
  onConfirmBulkDelete,
  deletingLoading,
}: TuyenSinhModalsProps) {
  return (
    <>
      {/* 1. Modal Xem Đơn Chi Tiết */}
      {viewDetailApp && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/50 p-4 font-serif"
          onClick={onCloseViewDetail}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-2 text-xs border-b border-slate-200 pb-3">
              <div>
                <p className="font-bold">UBND HUYỆN HÓC MÔN</p>
                <p className="font-black underline">TRƯỜNG MN BÉ NGOAN</p>
              </div>
              <div className="text-right">
                <p className="font-bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                <p className="italic">Độc lập – Tự do – Hạnh phúc</p>
              </div>
            </div>

            <div className="text-center py-2">
              <h3 className="text-xl font-black">ĐƠN XIN NHẬP HỌC</h3>
              <p className="text-xs italic text-slate-600 mt-1">
                Kính gửi: BAN GIÁM HIỆU TRƯỜNG MẦM NON BÉ NGOAN
              </p>
            </div>

            <div className="text-xs space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 font-sans">
              <p>
                <b>Tên cha:</b> {viewDetailApp.TenCha || "—"} · <b>Năm sinh:</b>{" "}
                {viewDetailApp.NamSinhCha || "—"} · <b>Trình độ:</b>{" "}
                {viewDetailApp.TrinhDoCha || "—"}
              </p>
              <p>
                <b>Nghề nghiệp:</b> {viewDetailApp.NgheNghiepCha || "—"} ·{" "}
                <b>Nơi làm việc:</b> {viewDetailApp.NoiLamViecCha || "—"} ·{" "}
                <b>Điện thoại:</b> {viewDetailApp.DienThoaiCha || "—"}
              </p>
              <div className="border-t border-slate-200 my-1" />
              <p>
                <b>Tên mẹ:</b> {viewDetailApp.TenMe || "—"} · <b>Năm sinh:</b>{" "}
                {viewDetailApp.NamSinhMe || "—"} · <b>Trình độ:</b>{" "}
                {viewDetailApp.TrinhDoMe || "—"}
              </p>
              <p>
                <b>Nghề nghiệp:</b> {viewDetailApp.NgheNghiepMe || "—"} ·{" "}
                <b>Nơi làm việc:</b> {viewDetailApp.NoiLamViecMe || "—"} ·{" "}
                <b>Điện thoại:</b> {viewDetailApp.DienThoaiMe || "—"}
              </p>
              <div className="border-t border-slate-200 my-1" />
              <p>
                <b>Hộ khẩu thường trú:</b>{" "}
                {viewDetailApp.HoKhauThuongTru || "—"}
              </p>
              <p>
                <b>Chỗ ở hiện nay:</b> {viewDetailApp.ChoOHienNay || "—"}
              </p>
              <p>
                <b>Tên chủ hộ:</b> {viewDetailApp.TenChuHo || "—"} ·{" "}
                <b>Điện thoại liên lạc:</b>{" "}
                <b className="text-sky-700">
                  {viewDetailApp.DienThoaiLienHe || "—"}
                </b>
              </p>
              <div className="border-t border-slate-200 my-1" />
              <p>
                <b>Họ tên con:</b>{" "}
                <b className="text-sm text-slate-900">{viewDetailApp.TenTre}</b>{" "}
                ({viewDetailApp.GioiTinh})
              </p>
              <p>
                <b>Sinh ngày:</b> {viewDetailApp.NgaySinh || "—"} ·{" "}
                <b>Dân tộc:</b> {viewDetailApp.DanToc || "Kinh"}
              </p>
              <p>
                <b>Cân nặng khi sinh:</b> {viewDetailApp.CanNang || "—"} ·{" "}
                <b>Chiều cao khi sinh:</b> {viewDetailApp.ChieuCao || "—"}
              </p>
              <p>
                <b>Tiền sử bệnh tật:</b>{" "}
                {viewDetailApp.TienSuBenh || "Không có"}
              </p>
              <p>
                <b>Con thứ mấy:</b> {viewDetailApp.ConThuMay || "1"} ·{" "}
                <b>Tổng số con trong gia đình:</b>{" "}
                {viewDetailApp.TongSoCon || "1"}
              </p>
              <p>
                <b>Năm học đăng ký:</b> {viewDetailApp.NamHoc || "2026 - 2027"}{" "}
                · <b>Khối mong muốn:</b> {viewDetailApp.KhoiMongMuon || "—"}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 font-sans">
              <button
                type="button"
                onClick={onCloseViewDetail}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Đóng
              </button>
              {viewDetailApp.TrangThai !== "DaNhapHoc" && (
                <button
                  type="button"
                  onClick={() => onTriggerApproveFromDetail(viewDetailApp)}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Duyệt hồ sơ cho nhập học
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal Chọn lớp & Duyệt nhập học */}
      {approveApp && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/50 p-4"
          onClick={onCloseApprove}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-black text-slate-800">
              Duyệt nhập học: {approveApp.TenTre}
            </h3>
            <p className="text-xs text-slate-500">
              Chọn lớp học để xếp cho bé. Hệ thống sẽ tự động tạo hồ sơ học sinh
              và liên kết phụ huynh vào CSDL:
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Lớp học tiếp nhận:
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="admin-input font-bold"
              >
                <option value="">-- Chưa xếp lớp (Để sau) --</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.tenLop} {c.namHoc ? `(${c.namHoc})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 text-xs">
              <button
                type="button"
                onClick={onCloseApprove}
                className="admin-btn admin-btn-secondary cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={onConfirmSingleApprove}
                className="admin-btn admin-btn-primary cursor-pointer"
              >
                {busy ? "Đang duyệt..." : "Xác nhận Nhập học"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal Duyệt Hàng Loạt */}
      {bulkApproveOpen && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/50 p-4"
          onClick={onCloseBulkApprove}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-black text-slate-800">
              Duyệt nhập học cho {selectedCount} trẻ
            </h3>
            <p className="text-xs text-slate-500">
              Bạn có thể chỉ định lớp học chung hoặc để trống để giáo viên xếp
              lớp sau:
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Lớp học tiếp nhận:
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="admin-input font-bold"
              >
                <option value="">-- Để trống (Chưa xếp lớp) --</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.tenLop}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 text-xs">
              <button
                type="button"
                onClick={onCloseBulkApprove}
                className="admin-btn admin-btn-secondary cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={onConfirmBulkApprove}
                className="admin-btn admin-btn-primary cursor-pointer"
              >
                {busy ? "Đang duyệt..." : "Xác nhận duyệt tất cả"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Single Delete Confirm */}
      <ConfirmModal
        isOpen={!!deletingApp}
        onClose={onCloseDeleteSingle}
        onConfirm={onConfirmDeleteSingle}
        title="Xóa đơn xin nhập học"
        message={`Bạn có chắc chắn muốn xóa đơn xin nhập học của bé "${deletingApp?.TenTre}"?`}
        confirmText="Xóa hồ sơ"
        cancelText="Hủy bỏ"
        variant="danger"
        loading={deletingLoading}
      />

      {/* Bulk Delete Confirm */}
      <ConfirmModal
        isOpen={bulkDeleteOpen}
        onClose={onCloseBulkDelete}
        onConfirm={onConfirmBulkDelete}
        title="Xóa nhiều đơn xin nhập học"
        message={`Bạn có chắc chắn muốn xóa ${selectedCount} đơn xin nhập học đã chọn? Thao tác này không thể hoàn tác.`}
        confirmText={`Xóa ${selectedCount} đơn`}
        cancelText="Hủy bỏ"
        variant="danger"
        loading={deletingLoading}
      />
    </>
  );
}
