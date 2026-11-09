import { useState, useEffect, useMemo } from "react";
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
import { Parent, Child, Cls, Staff, Grade, emptyParentForm } from "./types";

export function usePhuHuynhPage() {
  const [parentsList, setParentsList] = useState<Parent[]>([]);
  const [childrenMap, setChildrenMap] = useState<Record<string, Child[]>>({});
  const [classesList, setClassesList] = useState<Cls[]>([]);
  const [gradesList, setGradesList] = useState<Grade[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);

  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [classFilter, setClassFilter] = useState<string>("ALL");
  const [gradeFilter, setGradeFilter] = useState<string>("ALL");
  const [accountFilter, setAccountFilter] = useState<string>("ALL");

  const [selectedParentDetail, setSelectedParentDetail] = useState<Parent | null>(null);
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
      const [allParents, allClasses, allGrades, allStaff, allLinks] = await Promise.all([
        getParents(),
        getClasses(),
        getGrades(),
        getStaff(),
        getStudentParentLinks(),
      ]);

      setParentsList((Array.isArray(allParents) ? allParents : []) as Parent[]);
      setClassesList(Array.isArray(allClasses) ? (allClasses as Cls[]) : []);
      setGradesList(Array.isArray(allGrades) ? (allGrades as Grade[]) : []);
      setStaffList(Array.isArray(allStaff) ? (allStaff as Staff[]) : []);

      const childMap: Record<string, Child[]> = {};
      (Array.isArray(allLinks) ? allLinks : []).forEach((link: any) => {
        const pId = String(link.parentId || link.ParentId || "");
        if (!pId) return;
        if (!childMap[pId]) childMap[pId] = [];

        const studentName =
          link.tenHocSinh ||
          link.TenHocSinh ||
          link.student?.hoTen ||
          link.student?.tenHocSinh ||
          link.studentName ||
          link.hoTen ||
          "Chưa cập nhật tên";

        const lopIdVal = link.lopId || link.LopId || link.student?.lopId || "";
        const matchedClass = (Array.isArray(allClasses) ? allClasses : []).find(
          (c: any) => String(c.id).toLowerCase() === String(lopIdVal).toLowerCase()
        );
        const className =
          link.tenLop ||
          link.TenLop ||
          link.student?.tenLop ||
          matchedClass?.tenLop ||
          "Chưa xếp lớp";

        childMap[pId].push({
          id: link.studentId || link.StudentId || link.id,
          studentId: link.studentId || link.StudentId || link.id,
          hoTen: studentName,
          tenHocSinh: studentName,
          lopId: lopIdVal,
          tenLop: className,
          relationship: link.relationship || link.quanHe || link.QuanHe || "Phụ huynh",
          quanHe: link.relationship || link.quanHe || link.QuanHe || "Phụ huynh",
          ngaySinh: link.ngaySinh || link.NgaySinh || link.student?.ngaySinh || "",
          gioiTinh: link.gioiTinh || link.GioiTinh || link.student?.gioiTinh || "",
          trangThaiHoc: link.trangThaiHoc || link.TrangThaiHoc || link.student?.trangThaiHoc || "DangHoc",
          laLienHeChinh: Boolean(link.laLienHeChinh ?? link.LaLienHeChinh),
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
    const q = searchKeyword.toLowerCase().trim();
    return parentsList.filter((p) => {
      const children = childrenMap[p.id] || [];
      const matchSearch =
        !q ||
        (p.hoTen && p.hoTen.toLowerCase().includes(q)) ||
        (p.soDienThoai && p.soDienThoai.includes(q)) ||
        (p.email && p.email.toLowerCase().includes(q)) ||
        (p.cccd && p.cccd.includes(q)) ||
        (p.soCccd && p.soCccd.includes(q)) ||
        children.some((c) => c.tenHocSinh && c.tenHocSinh.toLowerCase().includes(q));
      const matchClass = classFilter === "ALL" || children.some((c) => c.lopId === classFilter);
      const matchGrade = gradeFilter === "ALL" || children.some((c) => classGradeLookup[c.lopId || ""] === gradeFilter);
      const matchAccount =
        accountFilter === "ALL" ||
        (accountFilter === "LINKED" && Boolean(p.taiKhoanId || p.userId)) ||
        (accountFilter === "UNLINKED" && !p.taiKhoanId && !p.userId);

      return matchSearch && matchClass && matchGrade && matchAccount;
    });
  }, [parentsList, searchKeyword, classFilter, gradeFilter, accountFilter, childrenMap, classGradeLookup]);

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
      setNotificationMessage(error instanceof Error ? error.message : "Thao tác thất bại");
    } finally {
      setIsSubmittingForm(false);
    }
  }

  async function handleConfirmDeleteParent(): Promise<void> {
    if (!parentToDelete) return;
    const targetId = parentToDelete.id;
    const targetName = parentToDelete.hoTen;
    setParentsList((prev) => prev.filter((p) => p.id !== targetId));
    setIsDeletingLoading(true);
    try {
      await deleteParent(targetId);
      setNotificationMessage(`Đã xóa phụ huynh "${targetName}" thành công.`);
      setParentToDelete(null);
      await fetchParentsData();
    } catch (error) {
      await fetchParentsData();
      setNotificationMessage(error instanceof Error ? error.message : "Lỗi khi xóa phụ huynh");
    } finally {
      setIsDeletingLoading(false);
    }
  }

  return {
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
  };
}
