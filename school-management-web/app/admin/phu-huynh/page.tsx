"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getParents,
  deleteParent,
  createParent,
  updateParent,
} from "@/services/parents";
import { getClasses } from "@/services/classes";
import { getStaff } from "@/services/staff";
import { getGrades } from "@/services/grades";
import { getStudentParentLinks } from "@/services/students";
import { createUser } from "@/services/auth";
import Pagination from "@/app/admin/components/shared/Pagination";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import {
  Parent,
  Child,
  Cls,
  Staff,
  Grade,
  emptyParentForm,
} from "./types";
import {
  PhuHuynhDetailModal,
  PhuHuynhFormModal,
} from "./components/PhuHuynhModals";
import { PhuHuynhCardGrid } from "./components/PhuHuynhCardGrid";
import { PhuHuynhHeader } from "./components/PhuHuynhHeader";
import PhuHuynhStats from "./components/PhuHuynhStats";

export default function PhuHuynhPage() {
  const [parentsList, setParentsList] = useState<Parent[]>([]);
  const [childrenMap, setChildrenMap] = useState<Record<string, Child[]>>({});
  const [classesList, setClassesList] = useState<Cls[]>([]);
  const [gradesList, setGradesList] = useState<Grade[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);

  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [classFilter, setClassFilter] = useState<string>("ALL");
  const [gradeFilter, setGradeFilter] = useState<string>("ALL");
  const [accountFilter, setAccountFilter] = useState<string>("ALL");

  const [selectedParentDetail, setSelectedParentDetail] =
    useState<Parent | null>(null);
  const [editingParent, setEditingParent] = useState<Parent | null>(null);
  const [parentToDelete, setParentToDelete] = useState<Parent | null>(null);
  const [isDeletingLoading, setIsDeletingLoading] = useState<boolean>(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>("");
  const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false);

  const [parentFormData, setParentFormData] = useState<any>(emptyParentForm);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  async function fetchParentsData(): Promise<void> {
    try {
      const [allParents, allClasses, allGrades, allStaff, allLinks] =
        await Promise.all([
          getParents(),
          getClasses(),
          getGrades(),
          getStaff(),
          getStudentParentLinks(),
        ]);

      const parents = (Array.isArray(allParents) ? allParents : []) as Parent[];
      setParentsList(parents);
      setClassesList(Array.isArray(allClasses) ? (allClasses as Cls[]) : []);
      setGradesList(Array.isArray(allGrades) ? (allGrades as Grade[]) : []);
      setStaffList(Array.isArray(allStaff) ? (allStaff as Staff[]) : []);

      const childMap: Record<string, Child[]> = {};
      (Array.isArray(allLinks) ? allLinks : []).forEach((link: any) => {
        const pId = String(link.parentId || "");
        if (!pId) return;
        if (!childMap[pId]) childMap[pId] = [];
        childMap[pId].push({
          id: link.studentId || link.id,
          studentId: link.studentId || link.id,
          hoTen:
            link.student?.hoTen ||
            link.studentName ||
            link.hoTen ||
            "Chưa cập nhật tên",
          tenHocSinh:
            link.student?.hoTen ||
            link.studentName ||
            link.hoTen ||
            "Chưa cập nhật tên",
          lopId: link.student?.lopId || link.lopId,
          tenLop: link.student?.tenLop || link.tenLop,
          relationship: link.relationship || link.quanHe || "Phụ huynh",
          quanHe: link.relationship || link.quanHe || "Phụ huynh",
          ngaySinh: link.student?.ngaySinh || "",
          gioiTinh: link.student?.gioiTinh || "",
          trangThaiHoc: link.student?.trangThaiHoc || "DangHoc",
          laLienHeChinh: Boolean(link.laLienHeChinh),
        });
      });
      setChildrenMap(childMap);
    } catch {
      setParentsList([]);
    }
  }

  useEffect(() => {
    void fetchParentsData();
  }, []);

  const classGradeLookup = useMemo(() => {
    const lookup: Record<string, string> = {};
    classesList.forEach((c) => {
      lookup[c.id] = c.khoiId || "";
    });
    return lookup;
  }, [classesList]);

  const filteredParentsList = useMemo(() => {
    return parentsList.filter((p) => {
      const q = searchKeyword.toLowerCase().trim();
      const matchSearch =
        !q ||
        (p.hoTen && p.hoTen.toLowerCase().includes(q)) ||
        (p.soDienThoai && p.soDienThoai.includes(q)) ||
        (p.email && p.email.toLowerCase().includes(q)) ||
        (p.cccd && p.cccd.includes(q)) ||
        (p.soCccd && p.soCccd.includes(q));

      const children = childrenMap[p.id] || [];
      const matchClass =
        classFilter === "ALL" ||
        children.some((c) => c.lopId === classFilter);

      const matchGrade =
        gradeFilter === "ALL" ||
        children.some((c) => classGradeLookup[c.lopId || ""] === gradeFilter);

      const matchAccount =
        accountFilter === "ALL" ||
        (accountFilter === "LINKED" && Boolean(p.taiKhoanId || p.userId)) ||
        (accountFilter === "UNLINKED" && !p.taiKhoanId && !p.userId);

      return matchSearch && matchClass && matchGrade && matchAccount;
    });
  }, [
    parentsList,
    searchKeyword,
    classFilter,
    gradeFilter,
    accountFilter,
    childrenMap,
    classGradeLookup,
  ]);

  const totalPages = Math.ceil(filteredParentsList.length / pageSize) || 1;
  const paginatedParents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredParentsList.slice(start, start + pageSize);
  }, [filteredParentsList, currentPage, pageSize]);

  async function handleSaveParent(): Promise<void> {
    setIsSubmittingForm(true);
    try {
      if (editingParent) {
        await updateParent(editingParent.id, parentFormData);
        setNotificationMessage("Cập nhật thông tin phụ huynh thành công.");
      } else {
        const createdParent = await createParent(parentFormData);
        if (parentFormData.createUserAccount && parentFormData.username) {
          await createUser({
            username: parentFormData.username,
            password: parentFormData.password,
            email: parentFormData.email,
            fullName: parentFormData.hoTen,
            role: "Parent",
            parentId: createdParent.id,
          });
        }
        setNotificationMessage("Thêm phụ huynh mới thành công.");
      }

      setIsFormModalOpen(false);
      setEditingParent(null);
      setParentFormData(emptyParentForm);
      await fetchParentsData();
    } catch (error) {
      setNotificationMessage(
        error instanceof Error ? error.message : "Thao tác thất bại"
      );
    } finally {
      setIsSubmittingForm(false);
    }
  }

  async function handleConfirmDeleteParent(): Promise<void> {
    if (!parentToDelete) return;

    setIsDeletingLoading(true);
    try {
      await deleteParent(parentToDelete.id);
      setNotificationMessage(
        `Đã xóa phụ huynh "${parentToDelete.hoTen}" thành công.`
      );
      setParentToDelete(null);
      await fetchParentsData();
    } catch (error) {
      setNotificationMessage(
        error instanceof Error ? error.message : "Lỗi khi xóa phụ huynh"
      );
    } finally {
      setIsDeletingLoading(false);
    }
  }

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
