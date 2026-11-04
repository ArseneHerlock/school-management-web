"use client";

import React, { useEffect, useMemo, useState } from "react";
import { getClasses } from "@/services/classes";
import { getEnrollments, deleteEnrollment } from "@/services/enrollment";
import { EnrollmentApp, EnrollmentClassOption } from "./types";
import { TuyenSinhHeader } from "./components/TuyenSinhHeader";
import { TuyenSinhStats } from "./components/TuyenSinhStats";
import { TuyenSinhTable } from "./components/TuyenSinhTable";
import { TuyenSinhModals } from "./components/TuyenSinhModals";

export default function TuyenSinhPage() {
  const [apps, setApps] = useState<EnrollmentApp[]>([]);
  const [classes, setClasses] = useState<EnrollmentClassOption[]>([]);
  const [, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modals state
  const [viewDetailApp, setViewDetailApp] = useState<EnrollmentApp | null>(null);
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
      setClasses(Array.isArray(clRes) ? (clRes as unknown as EnrollmentClassOption[]) : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

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
        `Đã duyệt nhập học cho bé ${approveApp.TenTre} và tạo hồ sơ vào CSDL.`
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
      <TuyenSinhHeader
        onRefresh={() => void loadData()}
        notice={notice}
        onClearNotice={() => setNotice("")}
      />

      <TuyenSinhStats apps={apps} />

      <TuyenSinhTable
        filteredApps={filtered}
        totalAppsCount={apps.length}
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        selectedIds={selectedIds}
        onToggleSelectAll={toggleSelectAll}
        onToggleSelectOne={toggleSelectOne}
        onViewDetail={(app) => setViewDetailApp(app)}
        onApprove={(app) => {
          setApproveApp(app);
          setSelectedClassId(classes[0]?.id || "");
        }}
        onDelete={(app) => setDeletingApp(app)}
        onBulkApproveOpen={() => setBulkApproveOpen(true)}
        onBulkReject={() => void handleBulkReject()}
        onBulkDeleteOpen={() => setBulkDeleteOpen(true)}
      />

      <TuyenSinhModals
        viewDetailApp={viewDetailApp}
        onCloseViewDetail={() => setViewDetailApp(null)}
        onTriggerApproveFromDetail={(target) => {
          setViewDetailApp(null);
          setApproveApp(target);
          setSelectedClassId(classes[0]?.id || "");
        }}
        approveApp={approveApp}
        onCloseApprove={() => setApproveApp(null)}
        onConfirmSingleApprove={() => void handleSingleApprove()}
        bulkApproveOpen={bulkApproveOpen}
        onCloseBulkApprove={() => setBulkApproveOpen(false)}
        onConfirmBulkApprove={() => void handleBulkApprove()}
        selectedClassId={selectedClassId}
        setSelectedClassId={setSelectedClassId}
        classes={classes}
        busy={busy}
        selectedCount={selectedIds.size}
        deletingApp={deletingApp}
        onCloseDeleteSingle={() => setDeletingApp(null)}
        onConfirmDeleteSingle={() => void handleSingleDelete()}
        bulkDeleteOpen={bulkDeleteOpen}
        onCloseBulkDelete={() => setBulkDeleteOpen(false)}
        onConfirmBulkDelete={() => void handleBulkDelete()}
        deletingLoading={deletingLoading}
      />
    </section>
  );
}
