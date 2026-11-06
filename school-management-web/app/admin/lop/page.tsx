"use client";

import { useState, useEffect } from "react";
import {
  getClassesPaged,
  createClass,
  updateClass,
  deleteClass,
  invalidateClassesCache,
} from "@/services/classes";
import { getGrades } from "@/services/grades";
import { getStaff } from "@/services/staff";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import { ClassItem, Grade, Staff } from "./types";
import { ClassFormModal, ClassStudentsModal } from "./components/LopModals";
import { LopCardGrid } from "./components/LopCardGrid";
import { LopHeader } from "./components/LopHeader";
import { classFormSchema, generateNextClassName } from "./validation";
import { useApiQuery } from "@/lib/hooks/useApiQuery";
import Pagination from "../components/shared/Pagination";

export default function LopPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>("ALL");

  const classesQuery = useApiQuery(
    ["classes", page, pageSize, debouncedSearch, selectedGradeFilter],
    () =>
      getClassesPaged({
        page,
        pageSize,
        search: debouncedSearch,
        khoiId: selectedGradeFilter,
      })
  );
  const gradesQuery = useApiQuery(["grades"], getGrades);
  const staffQuery = useApiQuery(["staff", "class-form"], getStaff, {
    enabled: false,
  });

  const classesList = (classesQuery.data?.items ?? []) as unknown as ClassItem[];
  const gradesList = (gradesQuery.data ?? []) as unknown as Grade[];
  const staffList = (staffQuery.data ?? []) as unknown as Staff[];
  const isLoading = classesQuery.isLoading || gradesQuery.isLoading;
  const [isSaving, setIsSaving] = useState<boolean>(false);

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

  const [viewStudentsClass, setViewStudentsClass] =
    useState<ClassItem | null>(null);
  const [classToDelete, setClassToDelete] = useState<ClassItem | null>(null);
  const [isDeletingLoading, setIsDeletingLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchKeyword.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchKeyword]);

  const loadClassesData = async () => {
    invalidateClassesCache();
    await Promise.all([classesQuery.refetch(), gradesQuery.refetch()]);
  };

  function findStaffById(id: string): Staff | undefined {
    return staffList.find((s) => s.staffId === id || s.id === id);
  }

  function findGradeById(id: string): Grade | undefined {
    return gradesList.find((g) => g.id === id);
  }

  function countStudentsInClass(classItem: ClassItem): number {
    return classItem.siSoThucTe ?? classItem.siSo ?? 0;
  }

  function handleOpenCreateModal() {
    setIsNewClass(true);
    const initialGradeId = gradesList[0]?.id || "";
    const autoClassName = generateNextClassName(initialGradeId, classesList, gradesList);

    setClassFormData({
      tenLop: autoClassName,
      siSo: 25,
      namHoc: "2026-2027",
      giaoVienChuNhiemId: "",
      giaoVienPhuId: "",
      khoiId: initialGradeId,
    });
    setErrorMessage("");
    void staffQuery.refetch();
    setEditingClass({} as ClassItem);
  }

  function handleGradeChangeAutoName(newGradeId: string) {
    if (isNewClass) {
      const generatedName = generateNextClassName(newGradeId, classesList, gradesList);
      setClassFormData((prev) => ({
        ...prev,
        khoiId: newGradeId,
        tenLop: generatedName,
      }));
    } else {
      setClassFormData((prev) => ({ ...prev, khoiId: newGradeId }));
    }
  }

  function handleOpenEditModal(cls: ClassItem) {
    setIsNewClass(false);
    setClassFormData({
      tenLop: cls.tenLop,
      siSo: cls.siSo,
      namHoc: cls.namHoc,
      giaoVienChuNhiemId: cls.giaoVienChuNhiemId || "",
      giaoVienPhuId: cls.giaoVienPhuId || "",
      khoiId: cls.khoiId || "",
    });
    setErrorMessage("");
    void staffQuery.refetch();
    setEditingClass(cls);
  }

  async function handleSaveClass() {
    setErrorMessage("");
    const validationResult = classFormSchema.safeParse(classFormData);
    if (!validationResult.success) {
      setErrorMessage(validationResult.error.issues[0]?.message || "Dữ liệu không hợp lệ");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        tenLop: classFormData.tenLop.trim(),
        siSo: Number(classFormData.siSo),
        namHoc: classFormData.namHoc.trim(),
        giaoVienChuNhiemId: classFormData.giaoVienChuNhiemId || "",
        giaoVienPhuId: classFormData.giaoVienPhuId || undefined,
        khoiId: classFormData.khoiId,
      };

      if (isNewClass) {
        await createClass(payload);
        setSuccessMessage(`Đã thêm mới lớp "${payload.tenLop}" thành công.`);
      } else if (editingClass?.id) {
        await updateClass(editingClass.id, payload);
        setSuccessMessage(`Đã cập nhật thông tin lớp "${payload.tenLop}".`);
      }

      setEditingClass(null);
      await loadClassesData();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Đã có lỗi xảy ra khi lưu thông tin lớp."
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleConfirmDeleteClass() {
    if (!classToDelete) return;
    setIsDeletingLoading(true);
    try {
      await deleteClass(classToDelete.id);
      setSuccessMessage(`Đã xóa lớp "${classToDelete.tenLop}" thành công.`);
      setClassToDelete(null);
      await loadClassesData();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Không thể xóa lớp học khỏi hệ thống."
      );
    } finally {
      setIsDeletingLoading(false);
    }
  }

  return (
    <section className="space-y-6 font-sans">
      <LopHeader
        isLoading={isLoading}
        onRefresh={loadClassesData}
        onOpenCreateModal={handleOpenCreateModal}
        searchKeyword={searchKeyword}
        onSearchChange={setSearchKeyword}
        selectedGradeFilter={selectedGradeFilter}
        onGradeFilterChange={(grade) => {
          setSelectedGradeFilter(grade);
          setPage(1);
        }}
        gradesList={gradesList}
        successMessage={successMessage}
        onClearSuccess={() => setSuccessMessage("")}
        errorMessage={errorMessage}
        onClearError={() => setErrorMessage("")}
      />

      <LopCardGrid
        loading={isLoading}
        filtered={classesList}
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

      <ClassStudentsModal
        viewStudentsClass={viewStudentsClass}
        currentClassStudents={[]}
        teacherName={
          findStaffById(viewStudentsClass?.giaoVienChuNhiemId || "")?.fullName ||
          "Chưa gán"
        }
        gradeName={
          findGradeById(viewStudentsClass?.khoiId || "")?.tenKhoi || "---"
        }
        onClose={() => setViewStudentsClass(null)}
      />

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
