"use client";

import Pagination from "@/app/admin/components/shared/Pagination";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import { emptyStaffForm } from "./types";
import { StaffDetailModal, StaffCreateModal } from "./components/NhanSuModals";
import { NhanSuGrid } from "./components/NhanSuGrid";
import { NhanSuHeader } from "./components/NhanSuHeader";
import NhanSuStats from "./components/NhanSuStats";
import { useNhanSuPage } from "./useNhanSuPage";

export default function NhanSuPage() {
  const {
    staffList,
    positionsList,
    classesList,
    assignmentsMap,
    searchKeyword,
    setSearchKeyword,
    positionFilter,
    setPositionFilter,
    classFilter,
    setClassFilter,
    selectedStaffDetail,
    setSelectedStaffDetail,
    staffToDelete,
    setStaffToDelete,
    isDeletingLoading,
    isCreateModalOpen,
    setIsCreateModalOpen,
    notificationMessage,
    setNotificationMessage,
    isCreatingStaff,
    staffFormData,
    setStaffFormData,
    assignmentFormData,
    setAssignmentFormData,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    filteredStaffList,
    paginatedStaff,
    fetchStaffData,
    handleConfirmDeleteStaff,
    handleCreateStaff,
    handleAddAssignment,
    handleRemoveAssignment,
  } = useNhanSuPage();

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
