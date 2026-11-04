"use client";

import { useEffect, useMemo, useState } from "react";
import { getStudents, createStudent, deleteStudent } from "@/services/students";
import { getClasses } from "@/services/classes";
import { Search, Plus, X } from "lucide-react";
import Pagination from "@/app/admin/components/shared/Pagination";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import {
  Student,
  Cls,
  StudentFormState,
  emptyStudentForm,
  studentFormSchema,
} from "./types";
import {
  StudentDetailModal,
  StudentCreateModal,
} from "./components/HocSinhModals";
import { HocSinhGrid } from "./components/HocSinhGrid";
import HocSinhStats from "./components/HocSinhStats";

export default function HocSinhPage() {
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [classesList, setClassesList] = useState<Cls[]>([]);

  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>("ALL");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("ALL");
  const [selectedGenderFilter, setSelectedGenderFilter] = useState<string>("ALL");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [selectedStudentDetail, setSelectedStudentDetail] =
    useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const [isDeletingLoading, setIsDeletingLoading] = useState<boolean>(false);
  const [isCreatingStudent, setIsCreatingStudent] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>("");

  const [createFormState, setCreateFormState] =
    useState<StudentFormState>(emptyStudentForm);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  async function fetchStudentsAndClasses(): Promise<void> {
    try {
      const [fetchedStudents, fetchedClasses] = await Promise.all([
        getStudents(),
        getClasses(),
      ]);
      setStudentsList(Array.isArray(fetchedStudents) ? fetchedStudents : []);
      setClassesList(Array.isArray(fetchedClasses) ? fetchedClasses : []);
    } catch (error) {
      setNotificationMessage(
        error instanceof Error ? error.message : "Không tải được danh sách học sinh"
      );
    }
  }

  useEffect(() => {
    fetchStudentsAndClasses();
  }, []);

  const filteredStudents = useMemo(() => {
    const normalizedKeyword = searchKeyword.trim().toLowerCase();

    return studentsList.filter((student) => {
      const searchContent =
        `${student.tenHocSinh} ${student.id} ${student.diaChi}`.toLowerCase();
      const isKeywordMatch = searchContent.includes(normalizedKeyword);
      const isClassMatch =
        selectedClassFilter === "ALL" ||
        String(student.lopId) === selectedClassFilter;
      const isStatusMatch =
        selectedStatusFilter === "ALL" ||
        student.trangThaiHoc === selectedStatusFilter;
      const isGenderMatch =
        selectedGenderFilter === "ALL" ||
        student.gioiTinh === selectedGenderFilter;

      return isKeywordMatch && isClassMatch && isStatusMatch && isGenderMatch;
    });
  }, [
    studentsList,
    searchKeyword,
    selectedClassFilter,
    selectedStatusFilter,
    selectedGenderFilter,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchKeyword,
    selectedClassFilter,
    selectedStatusFilter,
    selectedGenderFilter,
  ]);

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredStudents, currentPage]);

  function getStudentClassName(classId?: string | null): string {
    if (!classId) return "Chưa xếp lớp";
    const matchedClass = classesList.find(
      (c) => String(c.id) === String(classId)
    );
    return matchedClass?.tenLop || "Chưa xếp lớp";
  }

  async function handleCreateStudent(): Promise<void> {
    const validationResult = studentFormSchema.safeParse(createFormState);
    if (!validationResult.success) {
      setNotificationMessage(
        validationResult.error.issues[0]?.message ||
          "Thông tin học sinh không hợp lệ."
      );
      return;
    }

    try {
      setIsCreatingStudent(true);
      await createStudent(validationResult.data as StudentFormState);
      setNotificationMessage("Đã tạo hồ sơ học sinh thành công.");
      setCreateFormState(emptyStudentForm);
      setIsCreateModalOpen(false);
      await fetchStudentsAndClasses();
    } catch (error) {
      setNotificationMessage(
        error instanceof Error ? error.message : "Tạo hồ sơ học sinh thất bại"
      );
    } finally {
      setIsCreatingStudent(false);
    }
  }

  async function handleConfirmDeleteStudent(): Promise<void> {
    if (!studentToDelete) return;

    try {
      setIsDeletingLoading(true);
      await deleteStudent(studentToDelete.id);
      setNotificationMessage(
        `Đã xóa học sinh ${studentToDelete.tenHocSinh} thành công.`
      );
      setStudentToDelete(null);
      await fetchStudentsAndClasses();
    } catch (error) {
      setNotificationMessage(
        error instanceof Error ? error.message : "Xóa học sinh thất bại"
      );
    } finally {
      setIsDeletingLoading(false);
    }
  }

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="admin-eyebrow">HỒ SƠ TRẺ</p>
          <h1 className="admin-title">Quản lý học sinh</h1>
          <p className="admin-subtitle">
            Quản lý hồ sơ trẻ, lớp học và trạng thái học tập.
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="admin-btn admin-btn-primary"
        >
          <Plus size={17} /> Thêm học sinh
        </button>
      </header>

      {notificationMessage && (
        <div className="admin-alert flex items-center justify-between">
          <span>{notificationMessage}</span>
          <button onClick={() => setNotificationMessage("")}>
            <X size={16} />
          </button>
        </div>
      )}

      <HocSinhStats students={studentsList} />

      <div className="admin-card p-4">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="relative md:col-span-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              className="admin-input pl-10"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Tìm theo tên học sinh..."
            />
          </div>

          <select
            className="admin-input"
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
          >
            <option value="ALL">Tất cả lớp học</option>
            {classesList.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.tenLop}
              </option>
            ))}
          </select>

          <select
            className="admin-input"
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="Đang học">Đang học</option>
            <option value="Đã tốt nghiệp">Đã tốt nghiệp</option>
            <option value="Thôi học">Thôi học</option>
          </select>

          <select
            className="admin-input"
            value={selectedGenderFilter}
            onChange={(e) => setSelectedGenderFilter(e.target.value)}
          >
            <option value="ALL">Tất cả giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
        </div>
      </div>

      <HocSinhGrid
        paginated={paginatedStudents}
        filteredCount={filteredStudents.length}
        getClassName={getStudentClassName}
        onOpenDetail={(s) => setSelectedStudentDetail(s)}
        onRemove={(s) => setStudentToDelete(s)}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredStudents.length / itemsPerPage)}
        totalItems={filteredStudents.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />

      <StudentDetailModal
        detail={selectedStudentDetail}
        classNameText={getStudentClassName(selectedStudentDetail?.lopId)}
        onClose={() => setSelectedStudentDetail(null)}
      />

      <StudentCreateModal
        show={isCreateModalOpen}
        form={createFormState}
        setForm={setCreateFormState}
        classes={classesList}
        busy={isCreatingStudent}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateStudent}
      />

      <ConfirmModal
        isOpen={Boolean(studentToDelete)}
        onClose={() => setStudentToDelete(null)}
        onConfirm={handleConfirmDeleteStudent}
        title="Xác nhận xóa học sinh"
        message={`Bạn có chắc chắn muốn xóa hồ sơ học sinh ${studentToDelete?.tenHocSinh} không?`}
        confirmText="Xóa hồ sơ"
        cancelText="Hủy"
        variant="danger"
        loading={isDeletingLoading}
      />
    </section>
  );
}
