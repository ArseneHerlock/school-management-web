"use client";

import Pagination from "@/app/admin/components/shared/Pagination";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import { emptyParentForm } from "./types";
import {
  PhuHuynhDetailModal,
  PhuHuynhFormModal,
} from "./components/PhuHuynhModals";
import { PhuHuynhCardGrid } from "./components/PhuHuynhCardGrid";
import { PhuHuynhHeader } from "./components/PhuHuynhHeader";
import PhuHuynhStats from "./components/PhuHuynhStats";
import { usePhuHuynhPage } from "./usePhuHuynhPage";

export default function PhuHuynhPage() {
  const {
    parentsList,
    childrenMap,
    classesList,
    gradesList,
    staffList,
    searchKeyword,
    setSearchKeyword,
    classFilter,
    setClassFilter,
    gradeFilter,
    setGradeFilter,
    accountFilter,
    setAccountFilter,
    selectedParentDetail,
    setSelectedParentDetail,
    editingParent,
    setEditingParent,
    parentToDelete,
    setParentToDelete,
    isDeletingLoading,
    isFormModalOpen,
    setIsFormModalOpen,
    notificationMessage,
    setNotificationMessage,
    isSubmittingForm,
    parentFormData,
    setParentFormData,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    filteredParentsList,
    paginatedParents,
    fetchParentsData,
    handleSaveParent,
    handleConfirmDeleteParent,
  } = usePhuHuynhPage();

  return (
    <section className="space-y-5">
      <PhuHuynhHeader
        onRefresh={fetchParentsData}
        onOpenCreate={() => {
          setEditingParent(null);
          setParentFormData(emptyParentForm);
          setIsFormModalOpen(true);
        }}
        notificationMessage={notificationMessage}
        onClearNotification={() => setNotificationMessage("")}
        searchKeyword={searchKeyword}
        onSearchChange={setSearchKeyword}
        classFilter={classFilter}
        onClassFilterChange={setClassFilter}
        gradeFilter={gradeFilter}
        onGradeFilterChange={setGradeFilter}
        accountFilter={accountFilter}
        onAccountFilterChange={setAccountFilter}
        classesList={classesList}
        gradesList={gradesList}
      />

      <PhuHuynhStats parents={parentsList} childrenMap={childrenMap} />

      <PhuHuynhCardGrid
        paginatedParents={paginatedParents}
        childrenMap={childrenMap}
        classes={classesList}
        staff={staffList}
        filteredCount={filteredParentsList.length}
        onSelect={(p) => setSelectedParentDetail(p)}
        onEdit={(p) => {
          setEditingParent(p);
          setParentFormData({
            ...emptyParentForm,
            ...p,
            ngaySinh: String(p.ngaySinh || "").slice(0, 10),
          });
          setIsFormModalOpen(true);
        }}
        onRemove={(p) => setParentToDelete(p)}
      />

      <div className="admin-card overflow-hidden">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredParentsList.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      <PhuHuynhDetailModal
        selected={selectedParentDetail}
        onClose={() => setSelectedParentDetail(null)}
        childrenMap={childrenMap}
        classes={classesList}
        staff={staffList}
      />

      <PhuHuynhFormModal
        show={isFormModalOpen}
        edit={editingParent}
        form={parentFormData}
        setForm={setParentFormData}
        busy={isSubmittingForm}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveParent}
      />

      <ConfirmModal
        isOpen={Boolean(parentToDelete)}
        onClose={() => setParentToDelete(null)}
        onConfirm={handleConfirmDeleteParent}
        title="Xác nhận xóa phụ huynh"
        message={`Bạn có chắc chắn muốn xóa hồ sơ phụ huynh "${parentToDelete?.hoTen}"?`}
        confirmText="Xóa phụ huynh"
        cancelText="Hủy bỏ"
        variant="danger"
        loading={isDeletingLoading}
      />
    </section>
  );
}
