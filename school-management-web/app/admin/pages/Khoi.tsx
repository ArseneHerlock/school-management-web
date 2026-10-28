"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Plus,
  RefreshCw,
  Search,
  Edit3,
  Trash2,
  Save,
  X,
  Layers,
  Loader2,
} from "lucide-react";
import { getGrades, createGrade, deleteGrade, updateGrade } from "@/services/grades";

type Grade = {
  id: string;
  maKhoi: string;
  tenKhoi: string;
  doTuoiBatDau: number;
  doTuoiKetThuc: number;
  moTa?: string;
};

export default function Khoi() {
  // Danh sách các khối học
  const [gradesList, setGradesList] = useState<Grade[]>([]);

  // Trạng thái tải dữ liệu
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Từ khóa tìm kiếm
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  // Trạng thái modal và dữ liệu biểu mẫu
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [gradeFormData, setGradeFormData] = useState({
    maKhoi: "",
    tenKhoi: "",
    doTuoiBatDau: 3,
    doTuoiKetThuc: 4,
    moTa: "",
  });

  // Thông báo phản hồi
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  /**
   * Tải danh sách khối học từ Backend
   */
  async function fetchGradesData(): Promise<void> {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const rawData = await getGrades();
      setGradesList(Array.isArray(rawData) ? (rawData as unknown as Grade[]) : []);
    } catch (error) {
      const displayMessage =
        error instanceof Error ? error.message : "Không thể tải danh sách khối";
      setErrorMessage(displayMessage);
    } finally {
      setIsLoading(false);
    }
  }

  // Tải dữ liệu ban đầu
  useEffect(() => {
    fetchGradesData();
  }, []);

  /**
   * Lọc danh sách khối học theo từ khóa tìm kiếm
   */
  const filteredGrades = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (keyword.length === 0) {
      return gradesList;
    }

    return gradesList.filter(function (gradeItem) {
      const searchContent = `${gradeItem.maKhoi} ${gradeItem.tenKhoi} ${gradeItem.moTa || ""}`.toLowerCase();
      return searchContent.includes(keyword);
    });
  }, [gradesList, searchKeyword]);

  /**
   * Mở modal thêm mới khối học
   */
  function handleOpenCreateModal(): void {
    setIsCreatingNew(true);
    const initialForm = {
      maKhoi: "",
      tenKhoi: "",
      doTuoiBatDau: 3,
      doTuoiKetThuc: 6,
      moTa: "",
    };

    setEditingGrade({
      id: "",
      ...initialForm,
    });
    setGradeFormData(initialForm);
    setErrorMessage("");
  }

  /**
   * Mở modal chỉnh sửa khối học
   */
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

  /**
   * Lưu khối học (Tạo mới hoặc Cập nhật)
   */
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
      const displayError = error instanceof Error ? error.message : "Lưu khối thất bại.";
      setErrorMessage(displayError);
    } finally {
      setIsSaving(false);
    }
  }

  /**
   * Xóa khối học khỏi hệ thống
   */
  async function handleDeleteGrade(targetGrade: Grade): Promise<void> {
    const isConfirmed = confirm(`Xóa khối "${targetGrade.tenKhoi}" (${targetGrade.maKhoi})?`);
    if (!isConfirmed) {
      return;
    }

    try {
      await deleteGrade(targetGrade.id);
      setSuccessMessage(`Đã xóa khối "${targetGrade.tenKhoi}".`);
      await fetchGradesData();
    } catch (error) {
      const displayError = error instanceof Error ? error.message : "Không thể xóa khối.";
      setErrorMessage(displayError);
    }
  }

  return (
    <section className="space-y-5">
      {/* Tiêu đề trang */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="admin-eyebrow">QUẢN TRỊ TRƯỜNG HỌC</p>
          <h1 className="admin-title">Quản lý Khối học</h1>
          <p className="admin-subtitle">
            Cấu hình độ tuổi, chương trình học và định danh các khối lớp trong trường.
          </p>
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

      {/* Thông báo thành công */}
      {successMessage && (
        <div className="admin-alert">
          {successMessage}
          <button onClick={() => setSuccessMessage("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Thông báo lỗi */}
      {errorMessage && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {errorMessage}
        </div>
      )}

      {/* Thanh tìm kiếm */}
      <div className="admin-card p-4">
        <div className="relative">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            className="admin-input pl-10"
            value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.target.value)}
            placeholder="Tìm theo mã khối, tên khối hoặc mô tả..."
          />
        </div>
      </div>

      {/* Danh sách thẻ các khối học */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="admin-card col-span-full flex justify-center py-16">
            <Loader2 className="animate-spin text-emerald-500" />
          </div>
        ) : filteredGrades.length === 0 ? (
          <div className="admin-card col-span-full py-16 text-center text-slate-400">
            Không tìm thấy khối học nào.
          </div>
        ) : (
          filteredGrades.map(function (gradeItem) {
            return (
              <div
                key={gradeItem.id}
                className="admin-card p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                      <Layers size={20} />
                    </div>
                    <div>
                      <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                        {gradeItem.maKhoi}
                      </span>
                      <h2 className="mt-1 text-lg font-black text-slate-900">
                        {gradeItem.tenKhoi}
                      </h2>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleOpenEditModal(gradeItem)}
                      className="icon-btn"
                      title="Chỉnh sửa"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteGrade(gradeItem)}
                      className="icon-btn danger"
                      title="Xóa"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl bg-slate-50 p-2.5">
                    <p className="text-slate-400">Độ tuổi</p>
                    <p className="mt-0.5 font-bold text-slate-700">
                      {gradeItem.doTuoiBatDau} - {gradeItem.doTuoiKetThuc} tuổi
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-2.5">
                    <p className="text-slate-400">Trạng thái</p>
                    <p className="mt-0.5 font-bold text-emerald-600">
                      Đang hoạt động
                    </p>
                  </div>
                </div>

                {gradeItem.moTa && (
                  <p className="mt-3 line-clamp-2 text-xs text-slate-500">
                    {gradeItem.moTa}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal biểu mẫu chỉnh sửa / thêm mới khối */}
      {editingGrade && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/45 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black">
                {isCreatingNew ? "Thêm khối học mới" : "Chỉnh sửa khối học"}
              </h2>
              <button onClick={() => setEditingGrade(null)}>
                <X />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-600">
                  Mã khối
                </label>
                <input
                  className="admin-input disabled:bg-slate-100"
                  disabled={!isCreatingNew}
                  value={gradeFormData.maKhoi}
                  onChange={(event) =>
                    setGradeFormData({ ...gradeFormData, maKhoi: event.target.value })
                  }
                  placeholder="Ví dụ: K1, K2, K3..."
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-600">
                  Tên khối
                </label>
                <input
                  className="admin-input"
                  value={gradeFormData.tenKhoi}
                  onChange={(event) =>
                    setGradeFormData({ ...gradeFormData, tenKhoi: event.target.value })
                  }
                  placeholder="Ví dụ: Khối Mầm, Khối Chồi..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-600">
                    Độ tuổi bắt đầu (tuổi)
                  </label>
                  <input
                    className="admin-input"
                    type="number"
                    min="0"
                    max="18"
                    value={gradeFormData.doTuoiBatDau}
                    onChange={(event) =>
                      setGradeFormData({
                        ...gradeFormData,
                        doTuoiBatDau: Number(event.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-600">
                    Độ tuổi kết thúc (tuổi)
                  </label>
                  <input
                    className="admin-input"
                    type="number"
                    min="0"
                    max="18"
                    value={gradeFormData.doTuoiKetThuc}
                    onChange={(event) =>
                      setGradeFormData({
                        ...gradeFormData,
                        doTuoiKetThuc: Number(event.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-600">
                  Mô tả chương trình học
                </label>
                <textarea
                  className="admin-input min-h-[90px]"
                  value={gradeFormData.moTa}
                  onChange={(event) =>
                    setGradeFormData({ ...gradeFormData, moTa: event.target.value })
                  }
                  placeholder="Mô tả mục tiêu đào tạo, đặc điểm khối..."
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setEditingGrade(null)}
                className="admin-btn admin-btn-secondary"
              >
                Hủy
              </button>
              <button
                disabled={isSaving}
                onClick={handleSaveGrade}
                className="admin-btn admin-btn-primary"
              >
                {isSaving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}{" "}
                Lưu khối
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
