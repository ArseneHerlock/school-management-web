"use client";

import { useEffect, useMemo, useState } from "react";
import { getStudents, createStudent, deleteStudent } from "@/services/students";
import { getClasses } from "@/services/classes";
import { Search, Plus, Users, X, UserRound, Link2 } from "lucide-react";
import Pagination from "@/app/admin/components/shared/Pagination";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import {
  Student,
  Cls,
  StudentFormState,
  emptyStudentForm,
} from "./hoc-sinh/types";
import {
  StudentDetailModal,
  StudentCreateModal,
} from "./hoc-sinh/HocSinhModals";
import { HocSinhGrid } from "./hoc-sinh/HocSinhGrid";

export default function HocSinh() {
  // Danh sách học sinh và danh sách lớp học
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [classesList, setClassesList] = useState<Cls[]>([]);

  // Các trường tìm kiếm và lọc
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>("ALL");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("ALL");
  const [selectedGenderFilter, setSelectedGenderFilter] = useState<string>("ALL");

  // Quản lý trạng thái các Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // Trạng thái đang tải (Loading states)
  const [isDeletingLoading, setIsDeletingLoading] = useState<boolean>(false);
  const [isCreatingStudent, setIsCreatingStudent] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>("");

  // Dữ liệu biểu mẫu tạo học sinh mới
  const [createFormState, setCreateFormState] = useState<StudentFormState>(emptyStudentForm);

  // Phân trang
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  /**
   * Tải danh sách học sinh và danh sách lớp học từ Backend API
   */
  async function fetchStudentsAndClasses(): Promise<void> {
    try {
      const [fetchedStudents, fetchedClasses] = await Promise.all([
        getStudents(),
        getClasses(),
      ]);

      setStudentsList(Array.isArray(fetchedStudents) ? fetchedStudents : []);
      setClassesList(Array.isArray(fetchedClasses) ? fetchedClasses : []);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Không tải được danh sách học sinh";
      setNotificationMessage(errorMessage);
    }
  }

  // Tự động tải dữ liệu khi trang được mở lần đầu
  useEffect(() => {
    fetchStudentsAndClasses();
  }, []);

  /**
   * Lọc danh sách học sinh theo từ khóa và các điều kiện lọc
   */
  const filteredStudents = useMemo(() => {
    const normalizedKeyword = searchKeyword.trim().toLowerCase();

    return studentsList.filter((student) => {
      // Tìm kiếm theo tên học sinh, ID hoặc địa chỉ
      const searchContent = `${student.tenHocSinh} ${student.id} ${student.diaChi}`.toLowerCase();
      const isKeywordMatch = searchContent.includes(normalizedKeyword);

      // Bộ lọc lớp học
      const isClassMatch =
        selectedClassFilter === "ALL" || String(student.lopId) === selectedClassFilter;

      // Bộ lọc trạng thái học
      const isStatusMatch =
        selectedStatusFilter === "ALL" || student.trangThaiHoc === selectedStatusFilter;

      // Bộ lọc giới tính
      const isGenderMatch =
        selectedGenderFilter === "ALL" || student.gioiTinh === selectedGenderFilter;

      return isKeywordMatch && isClassMatch && isStatusMatch && isGenderMatch;
    });
  }, [studentsList, searchKeyword, selectedClassFilter, selectedStatusFilter, selectedGenderFilter]);

  // Đặt lại trang 1 mỗi khi thay đổi bộ lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword, selectedClassFilter, selectedStatusFilter, selectedGenderFilter]);

  /**
   * Danh sách học sinh của trang hiện tại
   */
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredStudents, currentPage]);

  /**
   * Lấy tên lớp học từ mã lớp
   */
  function getStudentClassName(classId?: string | null): string {
    if (!classId) {
      return "Chưa xếp lớp";
    }
    const matchedClass = classesList.find((classItem) => String(classItem.id) === String(classId));
    if (matchedClass) {
      return matchedClass.tenLop;
    }
    return "Chưa xếp lớp";
  }

  /**
   * Xử lý tạo mới hồ sơ học sinh
   */
  async function handleCreateStudent(): Promise<void> {
    if (!createFormState.tenHocSinh.trim() || !createFormState.ngaySinh) {
      setNotificationMessage("Vui lòng nhập họ tên và ngày sinh học sinh.");
      return;
    }

    try {
      setIsCreatingStudent(true);
      await createStudent(createFormState);
      setNotificationMessage("Đã tạo hồ sơ học sinh thành công.");
      setCreateFormState(emptyStudentForm);
      setIsCreateModalOpen(false);
      await fetchStudentsAndClasses();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Tạo hồ sơ học sinh thất bại";
      setNotificationMessage(errorMessage);
    } finally {
      setIsCreatingStudent(false);
    }
  }

  /**
   * Xử lý xác nhận xóa học sinh
   */
  async function handleConfirmDeleteStudent(): Promise<void> {
    if (!studentToDelete) {
      return;
    }

    try {
      setIsDeletingLoading(true);
      await deleteStudent(studentToDelete.id);
      setNotificationMessage(`Đã xóa học sinh ${studentToDelete.tenHocSinh} thành công.`);
      setStudentToDelete(null);
      await fetchStudentsAndClasses();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Xóa học sinh thất bại";
      setNotificationMessage(errorMessage);
    } finally {
      setIsDeletingLoading(false);
    }
  }

  return (
    <section className="space-y-5">
      {/* Tiêu đề trang */}
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

      {/* Thông báo kết quả thao tác */}
      {notificationMessage && (
        <div className="admin-alert flex items-center justify-between">
          <span>{notificationMessage}</span>
          <button onClick={() => setNotificationMessage("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Thẻ thống kê nhanh số lượng học sinh */}
      <div className="grid gap-3 md:grid-cols-3">
        <div className="admin-card p-5">
          <div className="flex items-center gap-3">
            <div className="admin-icon">
              <Users size={19} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">
                Tổng học sinh
              </p>
              <p className="text-2xl font-black text-slate-900">
                {studentsList.length}
              </p>
            </div>
          </div>
        </div>

        <div className="admin-card p-5">
          <div className="flex items-center gap-3">
            <div className="admin-icon">
              <Link2 size={19} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Đang học</p>
              <p className="text-2xl font-black text-slate-900">
                {studentsList.filter((item) => item.trangThaiHoc === "Đang học").length}
              </p>
            </div>
          </div>
        </div>

        <div className="admin-card p-5">
          <div className="flex items-center gap-3">
            <div className="admin-icon">
              <UserRound size={19} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Chưa xếp lớp</p>
              <p className="text-2xl font-black text-slate-900">
                {studentsList.filter((item) => !item.lopId).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Thanh công cụ tìm kiếm và lọc */}
      <div className="admin-card p-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_180px_160px]">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              className="admin-input pl-10"
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
              placeholder="Tìm học sinh, mã học sinh, địa chỉ..."
            />
          </div>

          <select
            className="admin-input"
            value={selectedClassFilter}
            onChange={(event) => setSelectedClassFilter(event.target.value)}
          >
            <option value="ALL">Tất cả lớp</option>
            {classesList.map((classItem) => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.tenLop}
              </option>
            ))}
          </select>

          <select
            className="admin-input"
            value={selectedStatusFilter}
            onChange={(event) => setSelectedStatusFilter(event.target.value)}
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option>Đang học</option>
            <option>Chờ nhập học</option>
            <option>Đã nghỉ</option>
          </select>

          <select
            className="admin-input"
            value={selectedGenderFilter}
            onChange={(event) => setSelectedGenderFilter(event.target.value)}
          >
            <option value="ALL">Tất cả giới tính</option>
            <option>Nam</option>
            <option>Nữ</option>
          </select>
        </div>
      </div>

      {/* Lưới danh sách học sinh */}
      <HocSinhGrid
        paginated={paginatedStudents}
        filteredCount={filteredStudents.length}
        getClassName={getStudentClassName}
        onOpenDetail={(student) => setSelectedStudentDetail(student)}
        onRemove={(student) => setStudentToDelete(student)}
      />

      {/* Phân trang */}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredStudents.length / itemsPerPage)}
        totalItems={filteredStudents.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />

      {/* Modal xem chi tiết học sinh */}
      <StudentDetailModal
        detail={selectedStudentDetail}
        classNameText={getStudentClassName(selectedStudentDetail?.lopId ?? undefined)}
        onClose={() => setSelectedStudentDetail(null)}
      />

      {/* Modal thêm mới học sinh */}
      <StudentCreateModal
        show={isCreateModalOpen}
        form={createFormState}
        setForm={setCreateFormState}
        classes={classesList}
        busy={isCreatingStudent}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateStudent}
      />

      {/* Modal xác nhận xóa học sinh */}
      <ConfirmModal
        isOpen={Boolean(studentToDelete)}
        onClose={() => setStudentToDelete(null)}
        onConfirm={handleConfirmDeleteStudent}
        title="Xác nhận xóa học sinh"
        message={`Bạn có chắc chắn muốn xóa học sinh "${studentToDelete?.tenHocSinh}"? Hồ sơ học sinh sẽ được xóa khỏi cơ sở dữ liệu.`}
        confirmText="Xóa học sinh"
        cancelText="Hủy bỏ"
        variant="danger"
        loading={isDeletingLoading}
      />
    </section>
  );
}
