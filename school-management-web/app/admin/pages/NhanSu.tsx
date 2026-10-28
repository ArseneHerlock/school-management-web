"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  RefreshCw,
  Users,
  UserCheck,
  Briefcase,
  GraduationCap,
  X,
} from "lucide-react";
import {
  getStaff,
  deleteStaff,
  createStaff,
  getPositions,
  getAssignments,
  createAssignment,
  deleteAssignment,
} from "@/services/staff";
import { getClasses } from "@/services/classes";
import { createUser } from "@/services/auth";
import Pagination from "@/app/admin/components/shared/Pagination";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import {
  Staff,
  Position,
  Cls,
  Assignment,
  emptyStaffForm,
} from "./nhan-su/types";
import { StaffDetailModal, StaffCreateModal } from "./nhan-su/NhanSuModals";
import { NhanSuGrid } from "./nhan-su/NhanSuGrid";

export default function NhanSu() {
  // Danh sách dữ liệu chính
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [positionsList, setPositionsList] = useState<Position[]>([]);
  const [classesList, setClassesList] = useState<Cls[]>([]);
  const [assignmentsMap, setAssignmentsMap] = useState<Record<string, Assignment[]>>({});

  // Tìm kiếm và bộ lọc
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [positionFilter, setPositionFilter] = useState<string>("ALL");
  const [classFilter, setClassFilter] = useState<string>("ALL");

  // Quản lý Modal và trạng thái chọn
  const [selectedStaffDetail, setSelectedStaffDetail] = useState<Staff | null>(null);
  const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);
  const [isDeletingLoading, setIsDeletingLoading] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>("");
  const [isCreatingStaff, setIsCreatingStaff] = useState<boolean>(false);

  // Dữ liệu biểu mẫu
  const [staffFormData, setStaffFormData] = useState<any>(emptyStaffForm);
  const [assignmentFormData, setAssignmentFormData] = useState({
    classId: "",
    role: 1,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: "",
  });

  // Phân trang
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);

  /**
   * Tải toàn bộ danh sách nhân sự, chức vụ, lớp học và phân công từ Backend
   */
  async function fetchStaffData(): Promise<void> {
    try {
      const [fetchedStaff, fetchedPositions, fetchedClasses, fetchedAssignments] =
        await Promise.all([
          getStaff(),
          (getPositions() as unknown as Promise<Position[]>),
          getClasses(),
          (getAssignments() as unknown as Promise<Assignment[]>),
        ]);

      setStaffList(Array.isArray(fetchedStaff) ? (fetchedStaff as unknown as Staff[]) : []);
      setPositionsList(Array.isArray(fetchedPositions) ? fetchedPositions : []);
      setClassesList(Array.isArray(fetchedClasses) ? (fetchedClasses as unknown as Cls[]) : []);

      // Gom nhóm danh sách phân công theo ID nhân sự
      const groupedAssignments: Record<string, Assignment[]> = {};
      const assignmentsArray = Array.isArray(fetchedAssignments) ? fetchedAssignments : [];

      assignmentsArray.forEach(function (assignmentItem) {
        const staffKey = String(assignmentItem.staffId);
        if (!groupedAssignments[staffKey]) {
          groupedAssignments[staffKey] = [];
        }
        groupedAssignments[staffKey].push(assignmentItem);
      });

      setAssignmentsMap(groupedAssignments);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không tải được danh sách nhân sự";
      setNotificationMessage(message);
    }
  }

  // Tự động tải dữ liệu ban đầu
  useEffect(() => {
    fetchStaffData();
  }, []);

  /**
   * Lọc danh sách nhân sự theo từ khóa, vị trí và lớp học được phân công
   */
  const filteredStaffList = useMemo(() => {
    const keyword = searchKeyword.toLowerCase().trim();

    return staffList.filter(function (staffItem) {
      const searchContent = `${staffItem.fullName} ${staffItem.staffCode || ""} ${staffItem.phoneNumber} ${staffItem.email}`.toLowerCase();
      const isKeywordMatch = searchContent.includes(keyword);

      const isPositionMatch =
        positionFilter === "ALL" || String(staffItem.positionId) === positionFilter;

      const staffAssignments = assignmentsMap[staffItem.staffId] || [];
      const isClassMatch =
        classFilter === "ALL" ||
        staffAssignments.some(function (assignmentItem) {
          return String(assignmentItem.classId) === classFilter;
        });

      return isKeywordMatch && isPositionMatch && isClassMatch;
    });
  }, [staffList, searchKeyword, positionFilter, classFilter, assignmentsMap]);

  // Đặt lại trang 1 mỗi khi thay đổi bộ lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword, positionFilter, classFilter]);

  const totalPages = Math.ceil(filteredStaffList.length / pageSize) || 1;

  /**
   * Danh sách nhân sự cho trang hiện tại
   */
  const paginatedStaff = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredStaffList.slice(startIndex, startIndex + pageSize);
  }, [filteredStaffList, currentPage, pageSize]);

  /**
   * Thêm mới một nhân sự và tài khoản đăng nhập tương ứng
   */
  async function handleCreateStaff(): Promise<void> {
    try {
      setIsCreatingStaff(true);
      const generatedPersonId = crypto.randomUUID();
      const staffCode = staffFormData.staffCode?.trim() || "";

      // 1. Tạo tài khoản đăng nhập qua AuthService
      const createdUser = await createUser({
        personId: generatedPersonId,
        email: staffFormData.email || null,
        dateOfBirth: staffFormData.dateOfBirth,
        role: "GIAO_VIEN",
      });

      // 2. Tạo hồ sơ nhân sự trong StaffService
      await createStaff({
        ...staffFormData,
        staffCode: staffCode,
        userId: createdUser.userId,
      });

      setNotificationMessage(
        `Đã tạo nhân sự ${staffFormData.fullName} (Mã: ${staffCode}) và tài khoản ${createdUser.userName}.`
      );
      setIsCreateModalOpen(false);
      setStaffFormData(emptyStaffForm);
      await fetchStaffData();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Tạo nhân sự thất bại";
      setNotificationMessage(message);
    } finally {
      setIsCreatingStaff(false);
    }
  }

  /**
   * Xác nhận xóa nhân sự khỏi hệ thống
   */
  async function handleConfirmDeleteStaff(): Promise<void> {
    if (!staffToDelete) {
      return;
    }

    setIsDeletingLoading(true);
    try {
      await deleteStaff(staffToDelete.staffId);
      setNotificationMessage(`Đã xóa nhân sự ${staffToDelete.fullName} thành công.`);
      setStaffToDelete(null);
      await fetchStaffData();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể xóa nhân sự";
      setNotificationMessage(message);
    } finally {
      setIsDeletingLoading(false);
    }
  }

  /**
   * Thêm phân công lớp học cho giáo viên
   */
  async function handleAddAssignment(): Promise<void> {
    if (!selectedStaffDetail || !assignmentFormData.classId) {
      return;
    }

    try {
      await createAssignment({
        staffId: selectedStaffDetail.staffId,
        classId: assignmentFormData.classId,
        role: Number(assignmentFormData.role),
        startDate: assignmentFormData.startDate,
        endDate: assignmentFormData.endDate || null,
      });

      setNotificationMessage("Đã phân công giáo viên vào lớp học.");
      setAssignmentFormData(function (previousData) {
        return { ...previousData, classId: "" };
      });

      await fetchStaffData();

      // Cập nhật lại thông tin nhân sự đang mở modal
      const refreshedStaff = staffList.find(function (item) {
        return item.staffId === selectedStaffDetail.staffId;
      });
      if (refreshedStaff) {
        setSelectedStaffDetail(refreshedStaff);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Phân công thất bại";
      setNotificationMessage(message);
    }
  }

  /**
   * Xóa một lượt phân công lớp của giáo viên
   */
  async function handleRemoveAssignment(assignmentId: string): Promise<void> {
    const isConfirmed = confirm("Bạn có chắc chắn muốn xóa phân công này?");
    if (!isConfirmed) {
      return;
    }

    try {
      await deleteAssignment(assignmentId);
      setNotificationMessage("Đã xóa phân công lớp.");
      await fetchStaffData();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể xóa phân công";
      setNotificationMessage(message);
    }
  }

  // Thống kê nhanh
  const activeCount = staffList.filter(function (staffItem) {
    const statusText = String(staffItem.status).toLowerCase();
    return statusText.includes("active") || statusText === "1";
  }).length;

  const assignedCount = staffList.filter(function (staffItem) {
    return (assignmentsMap[staffItem.staffId] || []).length > 0;
  }).length;

  const totalAssignCount = Object.values(assignmentsMap).reduce(function (accumulator, list) {
    return accumulator + list.length;
  }, 0);

  return (
    <section className="space-y-5">
      {/* Tiêu đề trang */}
      <header className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="admin-eyebrow">NHÂN SỰ & TÀI KHOẢN</p>
          <h1 className="admin-title">Quản lý nhân sự</h1>
          <p className="admin-subtitle">
            Hồ sơ giáo viên/nhân sự, tài khoản đăng nhập và phân công lớp. Thêm nhân sự sẽ tự tạo tài khoản GIAO_VIEN.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchStaffData}
            className="admin-btn admin-btn-secondary"
          >
            <RefreshCw size={16} /> Làm mới
          </button>
          <button
            onClick={() => {
              setStaffFormData(emptyStaffForm);
              setIsCreateModalOpen(true);
            }}
            className="admin-btn admin-btn-primary"
          >
            <Plus size={17} /> Thêm nhân sự
          </button>
        </div>
      </header>

      {/* Thông báo kết quả thao tác */}
      {notificationMessage && (
        <div className="admin-alert">
          {notificationMessage}
          <button onClick={() => setNotificationMessage("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Các thẻ thống kê */}
      <div className="grid gap-3 md:grid-cols-4">
        <div className="admin-card p-4">
          <div className="flex items-center gap-3">
            <div className="admin-icon">
              <Users size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-400">Tổng nhân sự</p>
              <p className="mt-1 text-2xl font-black">{staffList.length}</p>
            </div>
          </div>
        </div>

        <div className="admin-card p-4">
          <div className="flex items-center gap-3">
            <div className="admin-icon">
              <UserCheck size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-400">Đang hoạt động</p>
              <p className="mt-1 text-2xl font-black">{activeCount}</p>
            </div>
          </div>
        </div>

        <div className="admin-card p-4">
          <div className="flex items-center gap-3">
            <div className="admin-icon">
              <GraduationCap size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-400">Có phân công</p>
              <p className="mt-1 text-2xl font-black">{assignedCount}</p>
            </div>
          </div>
        </div>

        <div className="admin-card p-4">
          <div className="flex items-center gap-3">
            <div className="admin-icon">
              <Briefcase size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-400">Tổng phân công</p>
              <p className="mt-1 text-2xl font-black">{totalAssignCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bộ lọc và thanh tìm kiếm */}
      <div className="admin-card p-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              className="admin-input pl-10"
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
              placeholder="Tìm tên, mã nhân sự, điện thoại, email..."
            />
          </div>

          <select
            className="admin-input"
            value={positionFilter}
            onChange={(event) => setPositionFilter(event.target.value)}
          >
            <option value="ALL">Tất cả vị trí</option>
            {positionsList.map(function (positionItem) {
              return (
                <option key={positionItem.positionId} value={positionItem.positionId}>
                  {positionItem.positionName}
                </option>
              );
            })}
          </select>

          <select
            className="admin-input"
            value={classFilter}
            onChange={(event) => setClassFilter(event.target.value)}
          >
            <option value="ALL">Tất cả lớp</option>
            {classesList.map(function (classItem) {
              return (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.tenLop}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Lưới danh sách nhân sự */}
      <NhanSuGrid
        paginatedStaff={paginatedStaff}
        positions={positionsList}
        classes={classesList}
        assign={assignmentsMap}
        filteredCount={filteredStaffList.length}
        onSelect={(staffItem) => setSelectedStaffDetail(staffItem)}
        onRemove={(staffItem) => setStaffToDelete(staffItem)}
      />

      {/* Phân trang */}
      <div className="admin-card overflow-hidden">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredStaffList.length}
          pageSize={pageSize}
          pageSizeOptions={[6, 12, 24, 48]}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {/* Modal chi tiết và phân công nhân sự */}
      <StaffDetailModal
        selected={selectedStaffDetail}
        onClose={() => setSelectedStaffDetail(null)}
        classes={classesList}
        assign={assignmentsMap}
        af={assignmentFormData}
        setAf={setAssignmentFormData}
        onAddAssignment={handleAddAssignment}
        onRemoveAssignment={handleRemoveAssignment}
      />

      {/* Modal tạo mới nhân sự */}
      <StaffCreateModal
        show={isCreateModalOpen}
        form={staffFormData}
        setForm={setStaffFormData}
        positions={positionsList}
        busy={isCreatingStaff}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateStaff}
      />

      {/* Modal xác nhận xóa nhân sự */}
      <ConfirmModal
        isOpen={Boolean(staffToDelete)}
        onClose={() => setStaffToDelete(null)}
        onConfirm={handleConfirmDeleteStaff}
        title="Xác nhận xóa nhân sự"
        message={`Bạn có chắc chắn muốn xóa hồ sơ nhân sự "${staffToDelete?.fullName}"? Dữ liệu nhân sự sẽ được xóa khỏi cơ sở dữ liệu.`}
        confirmText="Xóa nhân sự"
        cancelText="Hủy bỏ"
        variant="danger"
        loading={isDeletingLoading}
      />
    </section>
  );
}
