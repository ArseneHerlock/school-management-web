"use client";

import React from "react";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import { EnrollmentApp, EnrollmentClassOption } from "../types";
import { EnrollmentDetailModal } from "./EnrollmentDetailModal";

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
      <EnrollmentDetailModal
        viewDetailApp={viewDetailApp}
        onClose={onCloseViewDetail}
        onTriggerApprove={onTriggerApproveFromDetail}
      />

      {/* 2. Modal Chọn lớp & Duyệt nhập học đơn lẻ */}
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
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={onConfirmSingleApprove}
                className="admin-btn admin-btn-primary cursor-pointer disabled:opacity-50"
              >
                {busy ? "Đang xử lý..." : "Xác nhận duyệt nhập học"}
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
              Duyệt nhập học hàng loạt ({selectedCount} hồ sơ)
            </h3>
            <p className="text-xs text-slate-500">
              Chọn lớp tiếp nhận chung (nếu muốn xếp cùng lớp) hoặc để trống để
              giữ trạng thái chờ phân lớp:
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Lớp học tiếp nhận chung:
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="admin-input font-bold"
              >
                <option value="">-- Chưa xếp lớp (Phân bổ sau) --</option>
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
                onClick={onCloseBulkApprove}
                className="admin-btn admin-btn-secondary cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={onConfirmBulkApprove}
                className="admin-btn admin-btn-primary cursor-pointer disabled:opacity-50"
              >
                {busy ? "Đang xử lý..." : `Duyệt ${selectedCount} hồ sơ`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Modal Xác nhận xóa 1 hồ sơ */}
      <ConfirmModal
        isOpen={Boolean(deletingApp)}
        title="Xác nhận xóa hồ sơ tuyển sinh"
        message={`Bạn có chắc chắn muốn xóa hồ sơ tuyển sinh của trẻ "${deletingApp?.TenTre}"? Thao tác này không thể hoàn tác.`}
        confirmText="Xác nhận xóa"
        cancelText="Hủy bỏ"
        variant="danger"
        loading={deletingLoading}
        onConfirm={onConfirmDeleteSingle}
        onClose={onCloseDeleteSingle}
      />

      {/* 5. Modal Xác nhận xóa hàng loạt */}
      <ConfirmModal
        isOpen={bulkDeleteOpen}
        title="Xác nhận xóa hàng loạt hồ sơ tuyển sinh"
        message={`Bạn có chắc chắn muốn xóa vĩnh viễn ${selectedCount} hồ sơ tuyển sinh đã chọn? Thao tác này không thể hoàn tác.`}
        confirmText={`Xóa ${selectedCount} hồ sơ`}
        cancelText="Hủy bỏ"
        variant="danger"
        loading={deletingLoading}
        onConfirm={onConfirmBulkDelete}
        onClose={onCloseBulkDelete}
      />
    </>
  );
}
