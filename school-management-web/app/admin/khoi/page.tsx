"use client";

import { useEffect, useState, useMemo } from "react";
import { Plus, RefreshCw, Search, X } from "lucide-react";
import {
  getGrades,
  createGrade,
  deleteGrade,
  updateGrade,
} from "@/services/grades";
import { Grade, GradeFormData } from "./types";
import GradeCardGrid from "./components/GradeCardGrid";
import GradeModal from "./components/GradeModal";

const initialFormData: GradeFormData = {
  maKhoi: "",
  tenKhoi: "",
  doTuoiBatDau: 3,
  doTuoiKetThuc: 4,
  moTa: "",
};

export default function KhoiPage() {
  const [gradesList, setGradesList] = useState<Grade[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [gradeFormData, setGradeFormData] =
    useState<GradeFormData>(initialFormData);

  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  async function fetchGradesData(): Promise<void> {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const rawData = await getGrades();
      setGradesList(
        Array.isArray(rawData) ? (rawData as unknown as Grade[]) : []
      );
    } catch (error) {
      const displayMessage =
        error instanceof Error ? error.message : "Không thể tải danh sách khối";
      setErrorMessage(displayMessage);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchGradesData();
  }, []);

  const filteredGrades = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (keyword.length === 0) return gradesList;

    return gradesList.filter(function (gradeItem) {
      const searchContent =
        `${gradeItem.maKhoi} ${gradeItem.tenKhoi} ${gradeItem.moTa || ""}`.toLowerCase();
      return searchContent.includes(keyword);
    });
  }, [gradesList, searchKeyword]);

  function handleOpenCreateModal(): void {
    setIsCreatingNew(true);
    const form = {
      maKhoi: "",
      tenKhoi: "",
      doTuoiBatDau: 3,
      doTuoiKetThuc: 6,
      moTa: "",
    };
    setEditingGrade({ id: "", ...form });
    setGradeFormData(form);
    setErrorMessage("");
  }

  function handleOpenEditModal(targetGrade: Grade): void {
    setIsCreatingNew(false);
    setEditingGrade(targetGrade);
    setGradeFormData({
      maKhoi: targetGrade.maKhoi || "",
      tenKhoi: targetGrade.tenKhoi || "",
      doTuoiBatDau: Number(targetGrade.doTuoiBatDau) || 0,
      doTuoiKetThuc: Number(targetGrade.doTuoiKetThuc) || 0,
      moTa: targetGrade.moTa || "",
    });
    setErrorMessage("");
  }

  async function handleSaveGrade(): Promise<void> {
    if (!gradeFormData.maKhoi.trim() && isCreatingNew) {
      setErrorMessage("Mã khối không được để trống.");
      return;
    }
    if (!gradeFormData.tenKhoi.trim()) {
      setErrorMessage("Tên khối không được để trống.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const gradePayload = {
        maKhoi: gradeFormData.maKhoi.trim(),
        tenKhoi: gradeFormData.tenKhoi.trim(),
        doTuoiBatDau: Number(gradeFormData.doTuoiBatDau) || 0,
        doTuoiKetThuc: Number(gradeFormData.doTuoiKetThuc) || 0,
        moTa: gradeFormData.moTa.trim() || undefined,
      };

      if (isCreatingNew) {
        await createGrade(gradePayload);
        setSuccessMessage("Đã tạo khối mới thành công.");
      } else if (editingGrade?.id) {
        await updateGrade(editingGrade.id, {
          tenKhoi: gradePayload.tenKhoi,
          doTuoiBatDau: gradePayload.doTuoiBatDau,
          doTuoiKetThuc: gradePayload.doTuoiKetThuc,
          moTa: gradePayload.moTa || null,
        });
        setSuccessMessage("Cập nhật thông tin khối thành công.");
      }

      setEditingGrade(null);
      await fetchGradesData();
    } catch (error) {
      const displayError =
        error instanceof Error ? error.message : "Lưu khối thất bại.";
      setErrorMessage(displayError);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteGrade(targetGrade: Grade): Promise<void> {
    const isConfirmed = confirm(
      `Xóa khối "${targetGrade.tenKhoi}" (${targetGrade.maKhoi})?`
    );
    if (!isConfirmed) return;

    // Cập nhật Optimistic UI: Lập tức gỡ khối khỏi danh sách
    setGradesList((prev) => prev.filter((g) => g.id !== targetGrade.id));

    try {
      await deleteGrade(targetGrade.id);
      setSuccessMessage(`Đã xóa khối "${targetGrade.tenKhoi}".`);
      await fetchGradesData();
    } catch (error) {
      await fetchGradesData();
      const displayError =
        error instanceof Error ? error.message : "Không thể xóa khối.";
      setErrorMessage(displayError);
    }
  }

  return (
    <section className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="admin-title">Quản lý khối học</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchGradesData}
            className="admin-btn admin-btn-secondary"
          >
            <RefreshCw size={16} /> Làm mới
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="admin-btn admin-btn-primary"
          >
            <Plus size={16} /> Thêm khối mới
          </button>
        </div>
      </header>

      {successMessage && (
        <div className="admin-alert">
          {successMessage}
          <button onClick={() => setSuccessMessage("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {errorMessage}
        </div>
      )}

      <div className="admin-card p-4">
        <div className="relative">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            className="admin-input pl-10"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Tìm theo mã khối, tên khối hoặc mô tả..."
          />
        </div>
      </div>

      <GradeCardGrid
        grades={filteredGrades}
        isLoading={isLoading}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteGrade}
      />

      <GradeModal
        editingGrade={editingGrade}
        isCreatingNew={isCreatingNew}
        formData={gradeFormData}
        setFormData={setGradeFormData}
        isSaving={isSaving}
        onSave={handleSaveGrade}
        onClose={() => setEditingGrade(null)}
      />
    </section>
  );
}
