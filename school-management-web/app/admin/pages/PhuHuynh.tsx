"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  RefreshCw,
  UserRound,
  Users,
  Link2,
  X,
} from "lucide-react";
import { getParents, deleteParent, createParent, updateParent } from "@/services/parents";
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
} from "./phu-huynh/types";
import {
  PhuHuynhDetailModal,
  PhuHuynhFormModal,
} from "./phu-huynh/PhuHuynhModals";
import { PhuHuynhCardGrid } from "./phu-huynh/PhuHuynhCardGrid";

export default function PhuHuynh() {
  // Dữ liệu chính
  const [parentsList, setParentsList] = useState<Parent[]>([]);
  const [childrenMap, setChildrenMap] = useState<Record<string, Child[]>>({});
  const [classesList, setClassesList] = useState<Cls[]>([]);
  const [gradesList, setGradesList] = useState<Grade[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);

  // Bộ lọc và tìm kiếm
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [classFilter, setClassFilter] = useState<string>("ALL");
  const [gradeFilter, setGradeFilter] = useState<string>("ALL");
  const [accountFilter, setAccountFilter] = useState<string>("ALL");

  // Quản lý Modal và trạng thái
  const [selectedParentDetail, setSelectedParentDetail] = useState<Parent | null>(null);
  const [editingParent, setEditingParent] = useState<Parent | null>(null);
  const [parentToDelete, setParentToDelete] = useState<Parent | null>(null);
  const [isDeletingLoading, setIsDeletingLoading] = useState<boolean>(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>("");
  const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false);

  // Biểu mẫu phụ huynh
  const [parentFormData, setParentFormData] = useState<any>(emptyParentForm);

  // Phân trang
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  /**
   * Tải toàn bộ danh sách phụ huynh, lớp, giáo viên, khối và liên kết học sinh từ Backend
   */
  async function fetchParentsData(): Promise<void> {
    try {
      const [fetchedParents, fetchedClasses, fetchedStaff, fetchedGrades, fetchedLinks] =
        await Promise.all([
          getParents(),
          getClasses(),
          getStaff(),
          getGrades(),
          getStudentParentLinks(),
        ]);

      setParentsList(Array.isArray(fetchedParents) ? (fetchedParents as unknown as Parent[]) : []);
      setClassesList(Array.isArray(fetchedClasses) ? (fetchedClasses as unknown as Cls[]) : []);
      setStaffList(Array.isArray(fetchedStaff) ? (fetchedStaff as unknown as Staff[]) : []);
      setGradesList(Array.isArray(fetchedGrades) ? (fetchedGrades as unknown as Grade[]) : []);

      // Gom nhóm danh sách con theo ID phụ huynh
      const groupedChildren: Record<string, Child[]> = {};
      const linksArray = Array.isArray(fetchedLinks) ? fetchedLinks : [];

      linksArray.forEach(function (linkItem: any) {
        const parentIdKey = String(linkItem.parentId);
        if (!groupedChildren[parentIdKey]) {
          groupedChildren[parentIdKey] = [];
        }
        groupedChildren[parentIdKey].push({
          studentId: linkItem.studentId,
          tenHocSinh: linkItem.tenHocSinh || "Học sinh",
          ngaySinh: linkItem.ngaySinh || "",
          gioiTinh: linkItem.gioiTinh || "Nam",
          lopId: linkItem.lopId,
          trangThaiHoc: linkItem.trangThaiHoc || "Đang học",
          quanHe: linkItem.quanHe || "Phụ huynh",
          laLienHeChinh: Boolean(linkItem.laLienHeChinh),
        });
      });

      setChildrenMap(groupedChildren);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không tải được danh sách phụ huynh";
      setNotificationMessage(message);
    }
  }

  // Tự động tải dữ liệu ban đầu
  useEffect(() => {
    fetchParentsData();
  }, []);

  /**
   * Lọc danh sách phụ huynh theo từ khóa và các điều kiện lọc lớp, khối, tài khoản
   */
  const filteredParentsList = useMemo(() => {
    const keyword = searchKeyword.toLowerCase().trim();

    return parentsList.filter(function (parentItem) {
      const childrenOfParent = childrenMap[parentItem.id] || [];
      const searchContent = `${parentItem.hoTen} ${parentItem.soDienThoai} ${parentItem.email || ""} ${parentItem.cccd || ""}`.toLowerCase();
      const isKeywordMatch = searchContent.includes(keyword);

      const isClassMatch =
        classFilter === "ALL" ||
        childrenOfParent.some(function (childItem) {
          return String(childItem.lopId) === classFilter;
        });

      const isGradeMatch =
        gradeFilter === "ALL" ||
        childrenOfParent.some(function (childItem) {
          const matchedClass = classesList.find(function (classItem) {
            return String(classItem.id) === String(childItem.lopId);
          });
          return String(matchedClass?.khoiId) === gradeFilter;
        });

      let isAccountMatch = true;
      if (accountFilter === "LINKED") {
        isAccountMatch = Boolean(parentItem.taiKhoanId);
      } else if (accountFilter === "UNLINKED") {
        isAccountMatch = !parentItem.taiKhoanId;
      }

      return isKeywordMatch && isClassMatch && isGradeMatch && isAccountMatch;
    });
  }, [parentsList, searchKeyword, childrenMap, classesList, classFilter, gradeFilter, accountFilter]);

  // Đặt lại trang 1 mỗi khi thay đổi bộ lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword, classFilter, gradeFilter, accountFilter]);

  const totalPages = Math.ceil(filteredParentsList.length / pageSize) || 1;

  /**
   * Danh sách phụ huynh trang hiện tại
   */
  const paginatedParents = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredParentsList.slice(startIndex, startIndex + pageSize);
  }, [filteredParentsList, currentPage, pageSize]);

  /**
   * Lưu thông tin phụ huynh (Tạo mới hoặc Cập nhật)
   */
  async function handleSaveParent(): Promise<void> {
    try {
      setIsSubmittingForm(true);

      if (editingParent) {
        await updateParent(editingParent.id, {
          ...parentFormData,
          taiKhoanId: editingParent.taiKhoanId || null,
        });
        setNotificationMessage("Đã cập nhật hồ sơ phụ huynh thành công.");
      } else {
        // 1. Tạo hồ sơ phụ huynh trong ParentService
        const createdParent = await createParent(parentFormData);

        // 2. Tự động tạo tài khoản đăng nhập PHU_HUYNH trong AuthService
        const createdUser = await createUser({
          personId: createdParent.id,
          email: createdParent.email || null,
          dateOfBirth: createdParent.ngaySinh,
          role: "PHU_HUYNH",
        } as any);

        // 3. Liên kết ID tài khoản vào hồ sơ phụ huynh
        await updateParent(createdParent.id, {
          ...parentFormData,
          taiKhoanId: createdUser.userId,
        });

        setNotificationMessage(
          `Đã tạo phụ huynh và tài khoản "${createdUser.userName}". Mật khẩu ban đầu là ngày sinh.`
        );
      }

      setIsFormModalOpen(false);
      setEditingParent(null);
      setParentFormData(emptyParentForm);
      await fetchParentsData();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Lưu hồ sơ phụ huynh thất bại";
      setNotificationMessage(message);
    } finally {
      setIsSubmittingForm(false);
    }
  }

  /**
   * Xác nhận xóa phụ huynh khỏi hệ thống
   */
  async function handleConfirmDeleteParent(): Promise<void> {
    if (!parentToDelete) {
      return;
    }

    setIsDeletingLoading(true);
    try {
      await deleteParent(parentToDelete.id);
      setNotificationMessage(`Đã xóa phụ huynh "${parentToDelete.hoTen}" thành công.`);
      setParentToDelete(null);
      await fetchParentsData();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Lỗi khi xóa phụ huynh";
      setNotificationMessage(message);
    } finally {
      setIsDeletingLoading(false);
    }
  }

  return (
    <section className="space-y-5">
      {/* Tiêu đề trang */}
      <header className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="admin-eyebrow">GIA ĐÌNH & LIÊN KẾT</p>
          <h1 className="admin-title">Quản lý phụ huynh</h1>
          <p className="admin-subtitle">
            Hồ sơ đầy đủ, tài khoản, con đang học, lớp hiện tại và giáo viên phụ trách lớp.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchParentsData}
            className="admin-btn admin-btn-secondary"
          >
            <RefreshCw size={16} /> Làm mới
          </button>
          <button
            onClick={() => {
              setEditingParent(null);
              setParentFormData(emptyParentForm);
              setIsFormModalOpen(true);
            }}
            className="admin-btn admin-btn-primary"
          >
            <Plus size={17} /> Thêm phụ huynh
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
      <div className="grid gap-3 md:grid-cols-3">
        <div className="admin-card p-4">
          <div className="flex items-center gap-3">
            <div className="admin-icon">
              <Users size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-400">Tổng phụ huynh</p>
              <p className="mt-1 text-2xl font-black">{parentsList.length}</p>
            </div>
          </div>
        </div>

        <div className="admin-card p-4">
          <div className="flex items-center gap-3">
            <div className="admin-icon">
              <Link2 size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-400">Đã có tài khoản</p>
              <p className="mt-1 text-2xl font-black">
                {parentsList.filter((item) => item.taiKhoanId).length}
              </p>
            </div>
          </div>
        </div>

        <div className="admin-card p-4">
          <div className="flex items-center gap-3">
            <div className="admin-icon">
              <UserRound size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-400">Có con liên kết</p>
              <p className="mt-1 text-2xl font-black">
                {
                  parentsList.filter(function (item) {
                    return (childrenMap[item.id] || []).length > 0;
                  }).length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Thanh tìm kiếm và bộ lọc */}
      <div className="admin-card p-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_180px_180px]">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              className="admin-input pl-10"
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
              placeholder="Tìm phụ huynh, điện thoại, email, CCCD..."
            />
          </div>

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

          <select
            className="admin-input"
            value={gradeFilter}
            onChange={(event) => setGradeFilter(event.target.value)}
          >
            <option value="ALL">Tất cả khối</option>
            {gradesList.map(function (gradeItem) {
              return (
                <option key={gradeItem.id} value={gradeItem.id}>
                  {gradeItem.tenKhoi}
                </option>
              );
            })}
          </select>

          <select
            className="admin-input"
            value={accountFilter}
            onChange={(event) => setAccountFilter(event.target.value)}
          >
            <option value="ALL">Tất cả tài khoản</option>
            <option value="LINKED">Đã có tài khoản</option>
            <option value="UNLINKED">Chưa có tài khoản</option>
          </select>
        </div>
      </div>

      {/* Lưới thẻ phụ huynh */}
      <PhuHuynhCardGrid
        paginatedParents={paginatedParents}
        childrenMap={childrenMap}
        classes={classesList}
        staff={staffList}
        filteredCount={filteredParentsList.length}
        onSelect={(parentItem) => setSelectedParentDetail(parentItem)}
        onEdit={(parentItem) => {
          setEditingParent(parentItem);
          setParentFormData({
            ...emptyParentForm,
            ...parentItem,
            ngaySinh: String(parentItem.ngaySinh || "").slice(0, 10),
          });
          setIsFormModalOpen(true);
        }}
        onRemove={(parentItem) => setParentToDelete(parentItem)}
      />

      {/* Phân trang */}
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

      {/* Modal xem chi tiết phụ huynh */}
      <PhuHuynhDetailModal
        selected={selectedParentDetail}
        onClose={() => setSelectedParentDetail(null)}
        childrenMap={childrenMap}
        classes={classesList}
        staff={staffList}
      />

      {/* Modal biểu mẫu phụ huynh */}
      <PhuHuynhFormModal
        show={isFormModalOpen}
        edit={editingParent}
        form={parentFormData}
        setForm={setParentFormData}
        busy={isSubmittingForm}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveParent}
      />

      {/* Modal xác nhận xóa */}
      <ConfirmModal
        isOpen={Boolean(parentToDelete)}
        onClose={() => setParentToDelete(null)}
        onConfirm={handleConfirmDeleteParent}
        title="Xác nhận xóa phụ huynh"
        message={`Bạn có chắc chắn muốn xóa hồ sơ phụ huynh "${parentToDelete?.hoTen}"? Dữ liệu liên kết sẽ được xóa khỏi cơ sở dữ liệu.`}
        confirmText="Xóa phụ huynh"
        cancelText="Hủy bỏ"
        variant="danger"
        loading={isDeletingLoading}
      />
    </section>
  );
}
