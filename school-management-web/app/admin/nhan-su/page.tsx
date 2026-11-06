"use client";

import { useEffect, useMemo, useState } from "react";
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
} from "./types";
import { StaffDetailModal, StaffCreateModal } from "./components/NhanSuModals";
import { NhanSuGrid } from "./components/NhanSuGrid";
import { NhanSuHeader } from "./components/NhanSuHeader";
import NhanSuStats from "./components/NhanSuStats";

export default function NhanSuPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [positionsList, setPositionsList] = useState<Position[]>([]);
  const [classesList, setClassesList] = useState<Cls[]>([]);
  const [assignmentsMap, setAssignmentsMap] = useState<
    Record<string, Assignment[]>
  >({});

  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [positionFilter, setPositionFilter] = useState<string>("ALL");
  const [classFilter, setClassFilter] = useState<string>("ALL");

  const [selectedStaffDetail, setSelectedStaffDetail] = useState<Staff | null>(
    null
  );
  const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);
  const [isDeletingLoading, setIsDeletingLoading] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>("");
  const [isCreatingStaff, setIsCreatingStaff] = useState<boolean>(false);

  const [staffFormData, setStaffFormData] = useState<any>(emptyStaffForm);
  const [assignmentFormData, setAssignmentFormData] = useState({
    classId: "",
    role: 1,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: "",
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);

  async function fetchStaffData(forceRefresh = false): Promise<void> {
    try {
      const [allStaff, allPositions, allClasses, allAssignments] =
        await Promise.all([
          getStaff({ forceRefresh }),
          getPositions(),
          getClasses(forceRefresh),
          getAssignments(),
        ]);

      const normalizedStaff: Staff[] = (
        Array.isArray(allStaff) ? allStaff : []
      ).map((item: any) => ({
        staffId: item.staffId || item.id,
        id: item.id || item.staffId,
        userId: item.userId || "",
        staffCode: item.staffCode || item.code || "",
        fullName: item.fullName || item.hoTen || "Không tên",
        email: item.email || "",
        phoneNumber: item.phoneNumber || item.soDienThoai || "",
        positionId: item.positionId || "",
        status: item.status ?? 1,
        address: item.address || "",
        dateOfBirth: item.dateOfBirth || "",
        gender: item.gender ?? 0,
        hireDate: item.hireDate || "",
        nationalId: item.nationalId || "",
        contractType: item.contractType ?? 1,
      }));

      setStaffList(normalizedStaff);
      setPositionsList(Array.isArray(allPositions) ? allPositions : []);
      setClassesList(Array.isArray(allClasses) ? (allClasses as Cls[]) : []);

      const assignMap: Record<string, Assignment[]> = {};
      (Array.isArray(allAssignments) ? allAssignments : []).forEach(
        (asgn: any) => {
          const sid = asgn.staffId;
          if (!assignMap[sid]) assignMap[sid] = [];
          assignMap[sid].push(asgn as Assignment);
        }
      );
      setAssignmentsMap(assignMap);
    } catch {
      // Giữ nguyên dữ liệu hiện tại khi có lỗi kết nối thay vì xóa trắng
    }
  }

  useEffect(() => {
    void fetchStaffData();
  }, []);

  const filteredStaffList = useMemo(() => {
    return staffList.filter((staffMember) => {
      const query = searchKeyword.toLowerCase().trim();
      const matchSearch =
        !query ||
        staffMember.fullName.toLowerCase().includes(query) ||
        staffMember.phoneNumber.includes(query) ||
        staffMember.email.toLowerCase().includes(query) ||
        (staffMember.staffCode &&
          staffMember.staffCode.toLowerCase().includes(query));

      const matchPosition =
        positionFilter === "ALL" || staffMember.positionId === positionFilter;

      const staffAssignments = assignmentsMap[staffMember.staffId] || [];
      const matchClass =
        classFilter === "ALL" ||
        staffAssignments.some((assignment) => assignment.classId === classFilter);

      return matchSearch && matchPosition && matchClass;
    });
  }, [staffList, searchKeyword, positionFilter, classFilter, assignmentsMap]);

  const totalPages = Math.ceil(filteredStaffList.length / pageSize) || 1;
  const paginatedStaff = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredStaffList.slice(startIndex, startIndex + pageSize);
  }, [filteredStaffList, currentPage, pageSize]);

  async function handleConfirmDeleteStaff(): Promise<void> {
    if (!staffToDelete) return;
    setIsDeletingLoading(true);
    const targetStaffId = staffToDelete.staffId;
    const targetFullName = staffToDelete.fullName;

    // Cập nhật Optimistic UI: Lập tức gỡ bỏ nhân sự đã xóa khỏi bảng hiển thị
    setStaffList((prev) =>
      prev.filter(
        (s) => s.staffId !== targetStaffId && (s as any).id !== targetStaffId
      )
    );

    try {
      await deleteStaff(targetStaffId);
      setNotificationMessage(`Đã xóa hồ sơ nhân sự "${targetFullName}".`);
      setStaffToDelete(null);
      await fetchStaffData(true);
    } catch (error) {
      await fetchStaffData(true);
      setNotificationMessage(
        error instanceof Error ? error.message : "Xóa nhân sự thất bại."
      );
    } finally {
      setIsDeletingLoading(false);
    }
  }

  async function handleCreateStaff(): Promise<void> {
    setIsCreatingStaff(true);
    try {
      const createdStaff = await createStaff({
        fullName: staffFormData.fullName,
        email: staffFormData.email,
        phoneNumber: staffFormData.phoneNumber,
        positionId: staffFormData.positionId,
        dateOfBirth: staffFormData.dateOfBirth,
        address: staffFormData.address,
        gender: Number(staffFormData.gender),
        hireDate: staffFormData.hireDate,
        code: staffFormData.staffCode,
      });

      if (staffFormData.createUserAccount && staffFormData.username) {
        await createUser({
          username: staffFormData.username,
          password: staffFormData.password,
          email: staffFormData.email,
          fullName: staffFormData.fullName,
          role: staffFormData.accountRole,
          staffId: (createdStaff as any).staffId || (createdStaff as any).id,
        });
      }

      setNotificationMessage("Tạo nhân sự mới thành công.");
      setIsCreateModalOpen(false);
      setStaffFormData(emptyStaffForm);
      await fetchStaffData(true);
    } catch (error) {
      setNotificationMessage(
        error instanceof Error ? error.message : "Tạo nhân sự thất bại"
      );
    } finally {
      setIsCreatingStaff(false);
    }
  }

  async function handleAddAssignment(): Promise<void> {
    if (!selectedStaffDetail || !assignmentFormData.classId) return;

    try {
      await createAssignment({
        staffId: selectedStaffDetail.staffId,
        classId: assignmentFormData.classId,
        role: Number(assignmentFormData.role),
        startDate: assignmentFormData.startDate,
        endDate: assignmentFormData.endDate || null,
      });

      setNotificationMessage("Đã phân công giáo viên vào lớp học.");
      setAssignmentFormData((prev) => ({ ...prev, classId: "" }));
      await fetchStaffData(true);

      const refreshedStaff = staffList.find(
        (item) => item.staffId === selectedStaffDetail.staffId
      );
      if (refreshedStaff) setSelectedStaffDetail(refreshedStaff);
    } catch (error) {
      setNotificationMessage(
        error instanceof Error ? error.message : "Phân công thất bại"
      );
    }
  }

  async function handleRemoveAssignment(assignmentId: string): Promise<void> {
    if (!confirm("Bạn có chắc chắn muốn xóa phân công này?")) return;

    try {
      await deleteAssignment(assignmentId);
      setNotificationMessage("Đã xóa phân công lớp.");
      await fetchStaffData(true);
    } catch (error) {
      setNotificationMessage(
        error instanceof Error ? error.message : "Không thể xóa phân công"
      );
    }
  }

  return (
    <section className="space-y-5">
      <NhanSuHeader
        onRefresh={() => void fetchStaffData(true)}
        onOpenCreate={() => {
          setStaffFormData(emptyStaffForm);
          setIsCreateModalOpen(true);
        }}
        notificationMessage={notificationMessage}
        onClearNotification={() => setNotificationMessage("")}
        searchKeyword={searchKeyword}
        onSearchChange={setSearchKeyword}
        positionFilter={positionFilter}
        onPositionFilterChange={setPositionFilter}
        classFilter={classFilter}
        onClassFilterChange={setClassFilter}
        positionsList={positionsList}
        classesList={classesList}
      />

      <NhanSuStats staffList={staffList} assignmentsMap={assignmentsMap} />

      <NhanSuGrid
        paginatedStaff={paginatedStaff}
        positions={positionsList}
        classes={classesList}
        assign={assignmentsMap}
        filteredCount={filteredStaffList.length}
        onSelect={(s) => setSelectedStaffDetail(s)}
        onRemove={(s) => setStaffToDelete(s)}
      />

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

      <StaffCreateModal
        show={isCreateModalOpen}
        form={staffFormData}
        setForm={setStaffFormData}
        positions={positionsList}
        busy={isCreatingStaff}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateStaff}
      />

      <ConfirmModal
        isOpen={Boolean(staffToDelete)}
        onClose={() => setStaffToDelete(null)}
        onConfirm={handleConfirmDeleteStaff}
        title="Xác nhận xóa nhân sự"
        message={`Bạn có chắc chắn muốn xóa hồ sơ nhân sự "${staffToDelete?.fullName}"?`}
        confirmText="Xóa nhân sự"
        cancelText="Hủy bỏ"
        variant="danger"
        loading={isDeletingLoading}
      />
    </section>
  );
}
