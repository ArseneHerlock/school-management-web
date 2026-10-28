"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Link as LinkIcon,
  Copy,
  Check,
  Search,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  Users,
  CheckSquare,
  Square,
  UserCheck,
  Filter,
} from "lucide-react";
import { getClasses } from "@/services/classes";
import { getEnrollments, deleteEnrollment } from "@/services/enrollment";
import ConfirmModal from "@/app/components/ui/ConfirmModal";

interface EnrollmentApp {
  Id: string;
  TenTre: string;
  GioiTinh: string;
  NgaySinh: string;
  DanToc: string;
  CanNang: string;
  ChieuCao: string;
  TienSuBenh: string;
  ConThuMay: string;
  TongSoCon: string;
  NamHoc: string;
  TenCha: string;
  NamSinhCha: string;
  TrinhDoCha: string;
  NgheNghiepCha: string;
  NoiLamViecCha: string;
  DienThoaiCha: string;
  TenMe: string;
  NamSinhMe: string;
  TrinhDoMe: string;
  NgheNghiepMe: string;
  NoiLamViecMe: string;
  DienThoaiMe: string;
  HoKhauThuongTru: string;
  ChoOHienNay: string;
  TenChuHo: string;
  DienThoaiLienHe: string;
  TrangThai: "ChoDuyet" | "DaNhapHoc" | "TuChoi" | string;
  KhoiMongMuon: string;
  GhiChu: string;
  CreatedAt: string;
}

export default function TuyenSinh() {
  const [apps, setApps] = useState<EnrollmentApp[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Link copy
  const [copiedLink, setCopiedLink] = useState(false);

  // Modals
  const [viewDetailApp, setViewDetailApp] = useState<EnrollmentApp | null>(
    null,
  );
  const [approveApp, setApproveApp] = useState<EnrollmentApp | null>(null);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [bulkApproveOpen, setBulkApproveOpen] = useState(false);

  const [deletingApp, setDeletingApp] = useState<EnrollmentApp | null>(null);
  const [deletingLoading, setDeletingLoading] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const [notice, setNotice] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [appRes, clRes] = await Promise.all([
        getEnrollments(),
        getClasses().catch(() => []),
      ]);
      setApps(Array.isArray(appRes) ? (appRes as unknown as EnrollmentApp[]) : []);
      setClasses(Array.isArray(clRes) ? clRes : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const publicLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/dang-ky-nhap-hoc`
      : "/dang-ky-nhap-hoc";

  const copyPublicLink = () => {
    navigator.clipboard.writeText(publicLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Filtered applications
  const filtered = useMemo(() => {
    return apps.filter((appItem) => {
      if (statusFilter !== "ALL" && appItem.TrangThai !== statusFilter) return false;
      if (searchKeyword.trim()) {
        const query = searchKeyword.trim().toLowerCase();
        const searchStr =
          `${appItem.TenTre} ${appItem.TenCha} ${appItem.TenMe} ${appItem.DienThoaiLienHe} ${appItem.NamHoc} ${appItem.KhoiMongMuon}`.toLowerCase();
        if (!searchStr.includes(query)) return false;
      }
      return true;
    });
  }, [apps, statusFilter, searchKeyword]);

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((a) => a.Id)));
    }
  };

  const toggleSelectOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  // Actions
  const handleSingleApprove = async () => {
    if (!approveApp) return;
    setBusy(true);
    try {
      const res = await fetch("/api/enrollment", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "approve",
          id: approveApp.Id,
          lopId: selectedClassId || undefined,
        }),
      });

      if (!res.ok) throw new Error("Không thể duyệt nhập học.");
      setNotice(
        `Đã duyệt nhập học cho bé ${approveApp.TenTre} và tạo hồ sơ vào CSDL.`,
      );
      setApproveApp(null);
      setSelectedClassId("");
      await loadData();
    } catch (e: any) {
      setNotice(e.message || "Lỗi khi duyệt");
    } finally {
      setBusy(false);
    }
  };

  const handleBulkApprove = async () => {
    if (selectedIds.size === 0) return;
    setBusy(true);
    try {
      const res = await fetch("/api/enrollment", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "bulk_update",
          ids: Array.from(selectedIds),
          trangThai: "DaNhapHoc",
          lopId: selectedClassId || undefined,
        }),
      });
      if (!res.ok) throw new Error("Không thể duyệt hàng loạt.");
      setNotice(`Đã duyệt nhập học thành công cho ${selectedIds.size} trẻ.`);
      setBulkApproveOpen(false);
      setSelectedIds(new Set());
      await loadData();
    } catch (e: any) {
      setNotice(e.message || "Lỗi khi duyệt hàng loạt");
    } finally {
      setBusy(false);
    }
  };

  const handleBulkReject = async () => {
    if (selectedIds.size === 0) return;
    setBusy(true);
    try {
      await fetch("/api/enrollment", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "bulk_update",
          ids: Array.from(selectedIds),
          trangThai: "TuChoi",
        }),
      });
      setNotice(`Đã chuyển trạng thái từ chối cho ${selectedIds.size} hồ sơ.`);
      setSelectedIds(new Set());
      await loadData();
    } finally {
      setBusy(false);
    }
  };

  const handleSingleDelete = async () => {
    if (!deletingApp) return;
    setDeletingLoading(true);
    try {
      await deleteEnrollment(deletingApp.Id);
      setNotice(`Đã xóa đơn của bé ${deletingApp.TenTre}.`);
      setDeletingApp(null);
      await loadData();
    } finally {
      setDeletingLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    setDeletingLoading(true);
    try {
      for (const id of selectedIds) {
        await deleteEnrollment(id);
      }
      setNotice(`Đã xóa ${selectedIds.size} đơn xin nhập học.`);
      setSelectedIds(new Set());
      setBulkDeleteOpen(false);
      await loadData();
    } finally {
      setDeletingLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      {/* Top Header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="admin-eyebrow">TUYỂN SINH MẦM NON</p>
          <h1 className="admin-title">Tuyển sinh</h1>
          <p className="admin-subtitle">
            Tiếp nhận hồ sơ xin nhập học trực tuyến từ phụ huynh và xét tuyển
            vào các lớp
          </p>
        </div>
        <button
          onClick={() => void loadData()}
          className="admin-btn admin-btn-secondary cursor-pointer"
        >
          <RefreshCw size={16} /> Làm mới danh sách
        </button>
      </header>

      {/* Shareable Online Registration Link Banner */}
      <div className="rounded-2xl border-2 border-dashed border-sky-300 bg-sky-50/60 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-md shadow-sky-600/20">
            <LinkIcon size={20} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm">
              Link gửi cho Phụ huynh điền phiếu Đơn xin nhập học:
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-sans">
              Phụ huynh điền link này sẽ tự động cập nhật đầy đủ thông tin trẻ
              và bố mẹ vào danh sách bên dưới
            </p>
            <div className="mt-1.5 font-mono text-xs font-bold text-sky-800 bg-white px-3 py-1.5 rounded-xl border border-sky-200 inline-block">
              {publicLink}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={copyPublicLink}
          className="shrink-0 flex items-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 text-xs font-bold shadow-md shadow-sky-600/20 transition cursor-pointer"
        >
          {copiedLink ? <Check size={16} /> : <Copy size={16} />}
          {copiedLink ? "Đã sao chép link!" : "Sao chép link gửi PH"}
        </button>
      </div>

      {notice && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-800 flex justify-between items-center shadow-xs">
          <span>{notice}</span>
          <button onClick={() => setNotice("")} className="cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="admin-card p-4">
          <p className="text-xs font-medium text-slate-400">Tổng số hồ sơ</p>
          <p className="mt-1 text-2xl font-black text-slate-800">
            {apps.length}
          </p>
        </div>
        <div className="admin-card p-4">
          <p className="text-xs font-medium text-amber-500 font-bold">
            Chờ xét duyệt
          </p>
          <p className="mt-1 text-2xl font-black text-amber-600">
            {
              apps.filter((a) => a.TrangThai === "ChoDuyet" || !a.TrangThai)
                .length
            }
          </p>
        </div>
        <div className="admin-card p-4">
          <p className="text-xs font-medium text-emerald-500 font-bold">
            Đã trúng tuyển / Nhập học
          </p>
          <p className="mt-1 text-2xl font-black text-emerald-600">
            {apps.filter((a) => a.TrangThai === "DaNhapHoc").length}
          </p>
        </div>
        <div className="admin-card p-4">
          <p className="text-xs font-medium text-rose-500 font-bold">Từ chối</p>
          <p className="mt-1 text-2xl font-black text-rose-600">
            {apps.filter((a) => a.TrangThai === "TuChoi").length}
          </p>
        </div>
      </div>

      {/* Filter and Multi-select Actions Bar */}
      <div className="admin-card p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative max-w-md flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              className="admin-input pl-9 text-xs"
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
              placeholder="Tìm theo tên trẻ, tên cha mẹ, số điện thoại..."
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
              Trạng thái:
            </span>
            <select
              className="admin-input py-2 text-xs font-semibold"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">
                -- Tất cả trạng thái ({apps.length}) --
              </option>
              <option value="ChoDuyet">Chờ xét duyệt</option>
              <option value="DaNhapHoc">Đã nhập học</option>
              <option value="TuChoi">Từ chối</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Toolbar when 1+ selected */}
        {selectedIds.size > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs">
            <span className="font-bold text-indigo-900">
              Đã chọn <b>{selectedIds.size}</b> hồ sơ:
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setBulkApproveOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <UserCheck size={14} /> Duyệt nhập học hàng loạt
              </button>
              <button
                type="button"
                onClick={handleBulkReject}
                className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold transition cursor-pointer"
              >
                Từ chối hàng loạt
              </button>
              <button
                type="button"
                onClick={() => setBulkDeleteOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold transition cursor-pointer flex items-center gap-1"
              >
                <Trash2 size={13} /> Xóa đã chọn
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Applications Table View matching compact styling */}
      <div className="admin-card overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#2d3748] text-white font-serif uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-3 border-r border-slate-600 w-10 text-center">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="p-1 rounded text-white hover:text-sky-300 transition"
                  >
                    {selectedIds.size > 0 &&
                    selectedIds.size === filtered.length ? (
                      <CheckSquare size={16} />
                    ) : (
                      <Square size={16} />
                    )}
                  </button>
                </th>
                <th className="py-3.5 px-4 font-bold border-r border-slate-600">
                  Tên Trẻ
                </th>
                <th className="py-3.5 px-4 font-bold border-r border-slate-600 text-center">
                  Ngày Sinh / GT
                </th>
                <th className="py-3.5 px-4 font-bold border-r border-slate-600">
                  Khối Đăng Ký
                </th>
                <th className="py-3.5 px-4 font-bold border-r border-slate-600">
                  Phụ Huynh
                </th>
                <th className="py-3.5 px-4 font-bold border-r border-slate-600">
                  Điện Thoại
                </th>
                <th className="py-3.5 px-4 font-bold border-r border-slate-600 text-center">
                  Năm Học
                </th>
                <th className="py-3.5 px-4 font-bold border-r border-slate-600 text-center">
                  Trạng Thái
                </th>
                <th className="py-3.5 px-4 font-bold text-center w-36">
                  Tùy Chọn
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-serif">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Filter className="mx-auto mb-2 text-slate-300" />
                    Chưa có hồ sơ đăng ký nào phù hợp. Hãy gửi link cho phụ
                    huynh điền đơn!
                  </td>
                </tr>
              ) : (
                filtered.map((a, idx) => {
                  const isChecked = selectedIds.has(a.Id);
                  const parentName = a.TenMe
                    ? `Mẹ: ${a.TenMe}`
                    : a.TenCha
                      ? `Cha: ${a.TenCha}`
                      : "—";
                  const phone =
                    a.DienThoaiLienHe || a.DienThoaiMe || a.DienThoaiCha || "—";

                  return (
                    <tr
                      key={a.Id}
                      className={`hover:bg-sky-50/60 transition-colors ${
                        isChecked
                          ? "bg-sky-50/80"
                          : idx % 2 === 0
                            ? "bg-white"
                            : "bg-slate-50/50"
                      }`}
                    >
                      <td className="py-3 px-3 text-center border-r border-slate-100">
                        <button
                          type="button"
                          onClick={() => toggleSelectOne(a.Id)}
                          className="p-1 rounded text-slate-500 hover:text-sky-600 transition"
                        >
                          {isChecked ? (
                            <CheckSquare size={16} className="text-sky-600" />
                          ) : (
                            <Square size={16} />
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 border-r border-slate-100 whitespace-nowrap">
                        {a.TenTre}
                      </td>
                      <td className="py-3 px-4 text-slate-700 border-r border-slate-100 text-center whitespace-nowrap font-sans">
                        {a.NgaySinh || "—"} ·{" "}
                        <span className="font-bold">{a.GioiTinh || "Nam"}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 border-r border-slate-100 whitespace-nowrap">
                        <span className="font-bold text-sky-800">
                          {a.KhoiMongMuon || "Khối Mầm"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 border-r border-slate-100 whitespace-nowrap">
                        {parentName}
                      </td>
                      <td className="py-3 px-4 text-slate-700 border-r border-slate-100 whitespace-nowrap font-sans">
                        {phone}
                      </td>
                      <td className="py-3 px-4 text-slate-700 border-r border-slate-100 text-center whitespace-nowrap font-sans">
                        {a.NamHoc || "2026 - 2027"}
                      </td>
                      <td className="py-3 px-4 text-center border-r border-slate-100 whitespace-nowrap">
                        {a.TrangThai === "DaNhapHoc" ? (
                          <span className="status-pill status-ok text-[10px]">
                            Đã nhập học
                          </span>
                        ) : a.TrangThai === "TuChoi" ? (
                          <span className="status-pill status-error text-[10px]">
                            Từ chối
                          </span>
                        ) : (
                          <span className="status-pill status-warn text-[10px]">
                            Chờ duyệt
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* View official application modal */}
                          <button
                            type="button"
                            onClick={() => setViewDetailApp(a)}
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                            title="Xem đơn xin nhập học chi tiết"
                          >
                            <Eye size={13} />
                          </button>

                          {/* Approve / Enroll */}
                          {a.TrangThai !== "DaNhapHoc" && (
                            <button
                              type="button"
                              onClick={() => {
                                setApproveApp(a);
                                setSelectedClassId(classes[0]?.id || "");
                              }}
                              className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition shadow-xs cursor-pointer"
                              title="Duyệt cho bé nhập học"
                            >
                              Duyệt
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => setDeletingApp(a)}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                            title="Xóa hồ sơ"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 1. Modal Xem Đơn Chi Tiết (Formatting matches Image 1) */}
      {viewDetailApp && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/50 p-4 font-serif"
          onClick={() => setViewDetailApp(null)}
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
                onClick={() => setViewDetailApp(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Đóng
              </button>
              {viewDetailApp.TrangThai !== "DaNhapHoc" && (
                <button
                  type="button"
                  onClick={() => {
                    const target = viewDetailApp;
                    setViewDetailApp(null);
                    setApproveApp(target);
                    setSelectedClassId(classes[0]?.id || "");
                  }}
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
          onClick={() => setApproveApp(null)}
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
                    {c.tenLop} ({c.namHoc})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 text-xs">
              <button
                type="button"
                onClick={() => setApproveApp(null)}
                className="admin-btn admin-btn-secondary cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={handleSingleApprove}
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
          onClick={() => setBulkApproveOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-black text-slate-800">
              Duyệt nhập học cho {selectedIds.size} trẻ
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
                onClick={() => setBulkApproveOpen(false)}
                className="admin-btn admin-btn-secondary cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={handleBulkApprove}
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
        onClose={() => setDeletingApp(null)}
        onConfirm={handleSingleDelete}
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
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDelete}
        title="Xóa nhiều đơn xin nhập học"
        message={`Bạn có chắc chắn muốn xóa ${selectedIds.size} đơn xin nhập học đã chọn? Thao tác này không thể hoàn tác.`}
        confirmText={`Xóa ${selectedIds.size} đơn`}
        cancelText="Hủy bỏ"
        variant="danger"
        loading={deletingLoading}
      />
    </section>
  );
}
