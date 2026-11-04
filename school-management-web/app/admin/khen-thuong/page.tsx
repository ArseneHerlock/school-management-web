"use client";

import { useEffect, useState, useMemo } from "react";
import { SchoolAward, AwardStats } from "./types";
import { KhenThuongHeader } from "./components/KhenThuongHeader";
import { KhenThuongStats } from "./components/KhenThuongStats";
import { KhenThuongTable } from "./components/KhenThuongTable";
import { KhenThuongCertificateModal } from "./components/KhenThuongCertificateModal";

export default function AdminKhenThuongPage() {
  const [schoolYear, setSchoolYear] = useState("2026-2027");
  const [semester, setSemester] = useState(0); // 0 = Cả năm
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [awards, setAwards] = useState<SchoolAward[]>([]);
  const [stats, setStats] = useState<AwardStats>({});

  // Filter
  const [selectedClass, setSelectedClass] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal Preview & Print
  const [previewAward, setPreviewAward] = useState<SchoolAward | null>(null);
  const [batchPrintMode, setBatchPrintMode] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/year-end-awards?schoolYear=${schoolYear}&semester=${semester}`
      );
      if (!res.ok) throw new Error("Không thể tải danh sách khen thưởng.");
      const data = await res.json();
      setAwards(data.allAwards || []);
      setStats(data.stats || {});
    } catch (err: any) {
      setError(err.message || "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [schoolYear, semester]);

  // Unique classes for filter
  const classList = useMemo(() => {
    const set = new Set<string>();
    awards.forEach((a) => {
      if (a.TenLop) set.add(a.TenLop);
    });
    return Array.from(set).sort();
  }, [awards]);

  // Filtered awards
  const filteredAwards = useMemo(() => {
    return awards.filter((a) => {
      const matchClass = selectedClass === "ALL" || a.TenLop === selectedClass;
      const matchStatus = selectedStatus === "ALL" || a.Status === selectedStatus;
      const matchSearch =
        !searchQuery.trim() ||
        a.TenHocSinh?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.TenLop?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.AwardTitle?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchClass && matchStatus && matchSearch;
    });
  }, [awards, selectedClass, selectedStatus, searchQuery]);

  // Handle Approve All
  const handleApproveAll = async () => {
    if (
      !confirm(
        `Bạn có chắc chắn muốn phê duyệt khen thưởng và cấp mã Giấy Khen cho toàn bộ học sinh năm học ${schoolYear}?`
      )
    ) {
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccessMsg("");
    try {
      const res = await fetch("/api/year-end-awards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "APPROVE_ALL",
          schoolYear,
          semester,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Phê duyệt thất bại");

      setSuccessMsg(data.message || "Đã phê duyệt thành công!");
      await loadData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-16">
      <KhenThuongHeader
        schoolYear={schoolYear}
        setSchoolYear={setSchoolYear}
        semester={semester}
        setSemester={setSemester}
        loading={loading}
        onRefresh={() => void loadData()}
        error={error}
        successMsg={successMsg}
      />

      <KhenThuongStats stats={stats} />

      <KhenThuongTable
        awards={awards}
        filteredAwards={filteredAwards}
        classList={classList}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        submitting={submitting}
        onApproveAll={() => void handleApproveAll()}
        onBatchPrint={() => {
          setBatchPrintMode(true);
          setTimeout(() => window.print(), 300);
        }}
        onPreview={(award) => {
          setBatchPrintMode(false);
          setPreviewAward(award);
        }}
      />

      <KhenThuongCertificateModal
        previewAward={previewAward}
        onClose={() => setPreviewAward(null)}
        onPrint={handlePrint}
        batchPrintMode={batchPrintMode}
        filteredAwards={filteredAwards}
        schoolYear={schoolYear}
      />
    </div>
  );
}
