"use client";

import { useState, useEffect } from "react";
import { Plus, RefreshCw, Search, X } from "lucide-react";
import { getClassesPaged, createClass, updateClass, deleteClass } from "@/services/classes";
import { getGrades } from "@/services/grades";
import { getStaff } from "@/services/staff";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import { ClassItem, Grade, Staff } from "./lop/types";
import { ClassFormModal, ClassStudentsModal } from "./lop/LopModals";
import { LopCardGrid } from "./lop/LopCardGrid";
import { useApiQuery } from "@/lib/hooks/useApiQuery";
import Pagination from "../components/shared/Pagination";
import { z } from "zod";

const classFormSchema = z.object({
  tenLop: z.string().trim().min(1, "Tên lớp không được để trống.").max(100),
  siSo: z.coerce.number().int().min(1, "Sĩ số phải lớn hơn 0.").max(100),
  namHoc: z.string().trim().regex(/^\d{4}-\d{4}$/, "Năm học phải theo dạng YYYY-YYYY."),
  giaoVienChuNhiemId: z.string().uuid("Vui lòng chọn giáo viên chủ nhiệm."),
  khoiId: z.string().uuid("Vui lòng chọn khối học."),
});

export default function Lop() {
  // Danh sách dữ liệu chính
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>("ALL");
  const classesQuery = useApiQuery(
    ["classes", page, pageSize, debouncedSearch, selectedGradeFilter],
    () => getClassesPaged({ page, pageSize, search: debouncedSearch, khoiId: selectedGradeFilter })
  );
  const gradesQuery = useApiQuery(["grades"], getGrades);
  const staffQuery = useApiQuery(["staff", "class-form"], getStaff, { enabled: false });
  const classesList = (classesQuery.data?.items ?? []) as unknown as ClassItem[];
  const gradesList = (gradesQuery.data ?? []) as unknown as Grade[];
  const staffList = (staffQuery.data ?? []) as unknown as Staff[];
  const isLoading = classesQuery.isLoading || gradesQuery.isLoading;
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Trạng thái chỉnh sửa / thêm mới
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [isNewClass, setIsNewClass] = useState<boolean>(false);
  const [classFormData, setClassFormData] = useState({
    tenLop: "",
    siSo: 25,
    namHoc: "2026-2027",
    giaoVienChuNhiemId: "",
    giaoVienPhuId: "",
    khoiId: "",
  });

  // Quản lý Modal
  const [viewStudentsClass, setViewStudentsClass] = useState<ClassItem | null>(null);
  const [classToDelete, setClassToDelete] = useState<ClassItem | null>(null);
  const [isDeletingLoading, setIsDeletingLoading] = useState<boolean>(false);

  // Thông báo người dùng
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchKeyword.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchKeyword]);

  /** Tải lại đúng trang hiện tại từ Backend. */
  async function loadClassesData(): Promise<void> {
    setErrorMessage("");
    await Promise.all([classesQuery.refetch(), gradesQuery.refetch()]);
  }

  /**
   * Tìm kiếm nhân sự giáo viên theo mã ID
   */
  function findStaffById(staffId: string): Staff | undefined {
    return staffList.find(function (staffItem) {
      const matchStaffId = staffItem.staffId && staffItem.staffId === staffId;
      const matchGeneralId = (staffItem as any).id && (staffItem as any).id === staffId;
      return matchStaffId || matchGeneralId;
    });
  }

  /**
   * Tìm kiếm thông tin khối học theo ID
   */
  function findGradeById(gradeId: string): Grade | undefined {
    return gradesList.find(function (gradeItem) {
      return gradeItem.id === gradeId;
    });
  }

  /**
   * Đếm số lượng học sinh thực tế trong một lớp
   */
  function countStudentsInClass(classItem: ClassItem): number {
    return classItem.siSoThucTe ?? classItem.siSo;
  }

  const filteredClasses = classesList;

  /**
   * Tự động sinh tên lớp học tiếp theo theo khối (ví dụ: Lớp Mầm 5 nếu đã có Mầm 4)
   */
  function generateNextClassName(gradeId: string, currentClasses: ClassItem[]): string {
    const selectedGrade = gradesList.find((gradeItem) => gradeItem.id === gradeId);
    if (!selectedGrade) {
      return "Lớp Mới 1";
    }

    const rawGradeName = selectedGrade.tenKhoi.replace(/^(Khối\s+)/i, "").trim();
    const classesInSameGrade = currentClasses.filter((classItem) => classItem.khoiId === gradeId);

    let maxNumber = 0;
    classesInSameGrade.forEach(function (classItem) {
      const matchResult = classItem.tenLop.match(/(\d+)$/);
      if (matchResult) {
        const extractedNumber = parseInt(matchResult[1], 10);
        if (extractedNumber > maxNumber) {
          maxNumber = extractedNumber;
        }
      }
    });

    return `Lớp ${rawGradeName} ${maxNumber + 1}`;
  }

  /**
   * Mở modal thêm mới lớp học
   */
  function handleOpenCreateModal(): void {
    void staffQuery.refetch();
    setIsNewClass(true);
    const defaultGradeId = gradesList[0]?.id || "";
    const autoGeneratedName = generateNextClassName(defaultGradeId, classesList);

    // Tìm giáo viên chưa bị gán lớp
    const assignedTeacherIds = new Set<string>();
    classesList.forEach(function (classItem) {
      if (classItem.giaoVienChuNhiemId) {
        assignedTeacherIds.add(classItem.giaoVienChuNhiemId);
      }
      if (classItem.giaoVienPhuId) {
        assignedTeacherIds.add(classItem.giaoVienPhuId);
      }
    });

    const availableTeachers = staffList.filter(function (staffItem) {
      const currentStaffId = staffItem.staffId || (staffItem as any).id || "";
      return !assignedTeacherIds.has(currentStaffId);
    });

    const defaultTeacher1Id = availableTeachers[0]?.staffId || (availableTeachers[0] as any)?.id || "";
    const defaultTeacher2Id = availableTeachers[1]?.staffId || (availableTeachers[1] as any)?.id || "";

    const initialFormData = {
      tenLop: autoGeneratedName,
      siSo: 25,
      namHoc: "2026-2027",
      giaoVienChuNhiemId: defaultTeacher1Id,
      giaoVienPhuId: defaultTeacher2Id,
      khoiId: defaultGradeId,
    };

    setEditingClass({
      id: "",
      ...initialFormData,
    });
    setClassFormData(initialFormData);
    setErrorMessage("");
  }

  /**
   * Tự động cập nhật tên lớp khi thay đổi khối trong biểu mẫu
   */
  function handleGradeChangeAutoName(newGradeId: string): void {
    const nextAutoName = generateNextClassName(newGradeId, classesList);
    setClassFormData(function (previousFormData) {
      return {
        ...previousFormData,
        tenLop: nextAutoName,
      };
    });
  }

  /**
   * Mở modal chỉnh sửa lớp học hiện có
   */
  function handleOpenEditModal(targetClass: ClassItem): void {
    void staffQuery.refetch();
    setIsNewClass(false);
    setEditingClass(targetClass);
    setClassFormData({
      tenLop: targetClass.tenLop || "",
      siSo: targetClass.siSo || 25,
      namHoc: targetClass.namHoc || "2026-2027",
      giaoVienChuNhiemId: targetClass.giaoVienChuNhiemId || "",
      giaoVienPhuId: targetClass.giaoVienPhuId || "",
      khoiId: targetClass.khoiId || "",
    });
    setErrorMessage("");
  }

  /**
   * Lưu thông tin lớp học (Tạo mới hoặc Cập nhật)
   */
  async function handleSaveClass(): Promise<void> {
    const parsed = classFormSchema.safeParse(classFormData);
    if (!parsed.success) {
      setErrorMessage(parsed.error.issues[0]?.message || "Dữ liệu lớp học không hợp lệ.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const classPayload = {
        ...parsed.data,
      };

      if (isNewClass) {
        await createClass(classPayload);
        setSuccessMessage("Đã tạo lớp mới thành công.");
      } else if (editingClass) {
        await updateClass(editingClass.id, classPayload);
        setSuccessMessage("Đã cập nhật thông tin lớp học thành công.");
      }

      setEditingClass(null);
      await loadClassesData();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Lỗi khi lưu lớp học";
      setErrorMessage(message);
    } finally {
      setIsSaving(false);
    }
  }

  /**
   * Xác nhận xóa lớp học khỏi hệ thống
   */
  async function handleConfirmDeleteClass(): Promise<void> {
    if (!classToDelete) {
      return;
    }

    setIsDeletingLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await deleteClass(classToDelete.id);
      setSuccessMessage(`Đã xóa lớp "${classToDelete.tenLop}" thành công.`);
      setClassToDelete(null);
      await loadClassesData();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không thể xóa lớp học khỏi hệ thống.";
      setErrorMessage(message);
    } finally {
      setIsDeletingLoading(false);
    }
  }

  return (
    <section className="space-y-6 font-sans">
      {/* Tiêu đề trang */}
      <header className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="admin-eyebrow">TỔ CHỨC GIÁO DỤC</p>
          <h1 className="admin-title">Quản lý Lớp học & Khối lớp</h1>
          <p className="admin-subtitle">
            Phân bổ khối mầm non, quản lý sĩ số trẻ và theo dõi phân công giáo viên phụ trách.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={loadClassesData}
            disabled={isLoading}
            className="admin-btn admin-btn-secondary cursor-pointer"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            <span>{isLoading ? "Đang tải..." : "Làm mới"}</span>
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="admin-btn admin-btn-primary cursor-pointer"
          >
            <Plus size={16} />
            <span>Thêm lớp mới</span>
          </button>
        </div>
      </header>

      {/* Thông báo kết quả thao tác */}
      {successMessage && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-emerald-800 flex justify-between items-center">
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage("")}>
            <X size={14} />
          </button>
        </div>
      )}
      {errorMessage && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-bold text-rose-800 flex justify-between items-center">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage("")}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Thanh tìm kiếm và bộ lọc khối */}
      <div className="admin-card p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              className="admin-input pl-9 text-xs"
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
              placeholder="Tìm theo tên lớp, năm học, tên giáo viên..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Khối:</span>
            <select
              value={selectedGradeFilter}
              onChange={(event) => setSelectedGradeFilter(event.target.value)}
              className="admin-input py-1.5 text-xs font-semibold w-auto bg-white"
            >
              <option value="ALL">Tất cả các khối</option>
              {gradesList.map((gradeItem) => (
                <option key={gradeItem.id} value={gradeItem.id}>
                  {gradeItem.tenKhoi}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lưới thẻ các khối và lớp học */}
      <LopCardGrid
        loading={isLoading}
        filtered={filteredClasses}
        findStaff={findStaffById}
        findGrade={findGradeById}
        countStudentsInClass={countStudentsInClass}
        onEdit={handleOpenEditModal}
        onRemove={(targetClass) => setClassToDelete(targetClass)}
        onViewStudents={(targetClass) => setViewStudentsClass(targetClass)}
      />

      <Pagination
        currentPage={classesQuery.data?.page ?? page}
        totalPages={classesQuery.data?.totalPages ?? 0}
        totalItems={classesQuery.data?.totalCount ?? 0}
        pageSize={classesQuery.data?.pageSize ?? pageSize}
        onPageChange={setPage}
        onPageSizeChange={(nextSize) => {
          setPageSize(nextSize);
          setPage(1);
        }}
      />

      {/* Modal biểu mẫu tạo mới / cập nhật lớp học */}
      <ClassFormModal
        editing={editingClass}
        isNew={isNewClass}
        form={classFormData}
        setForm={setClassFormData}
        staffList={staffList}
        grades={gradesList}
        classes={classesList}
        saving={isSaving}
        error={errorMessage}
        onClose={() => setEditingClass(null)}
        onSave={handleSaveClass}
        onGradeChangeAutoName={handleGradeChangeAutoName}
      />

      {/* Modal danh sách học sinh thuộc lớp */}
      <ClassStudentsModal
        viewStudentsClass={viewStudentsClass}
        currentClassStudents={[]}
        teacherName={
          findStaffById(viewStudentsClass?.giaoVienChuNhiemId || "")?.fullName || "Chưa gán"
        }
        gradeName={findGradeById(viewStudentsClass?.khoiId || "")?.tenKhoi || "---"}
        onClose={() => setViewStudentsClass(null)}
      />

      {/* Modal xác nhận xóa lớp học */}
      <ConfirmModal
        isOpen={Boolean(classToDelete)}
        onClose={() => setClassToDelete(null)}
        onConfirm={handleConfirmDeleteClass}
        title="Xác nhận xóa lớp học"
        message={`Bạn có chắc chắn muốn xóa "${classToDelete?.tenLop}" không? Toàn bộ dữ liệu lớp sẽ được xóa khỏi hệ thống.`}
        confirmText="Xóa lớp học"
        cancelText="Hủy bỏ"
        variant="danger"
        loading={isDeletingLoading}
      />
    </section>
  );
}
