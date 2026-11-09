"use client";

import { RotateCcw, X, Shield } from "lucide-react";
import { TaiKhoanToolbar } from "./components/TaiKhoanToolbar";
import { TaiKhoanTable } from "./components/TaiKhoanTable";
import TaiKhoanStats from "./components/TaiKhoanStats";
import TaiKhoanSkeleton from "./components/TaiKhoanSkeleton";
import { useTaiKhoanPage } from "./useTaiKhoanPage";

export default function TaiKhoanPage() {
  const {
    userAccountsList,
    searchKeyword,
    setSearchKeyword,
    selectedRoleFilter,
    setSelectedRoleFilter,
    selectedStatusFilter,
    setSelectedStatusFilter,
    selectedAccountIds,
    notificationMessage,
    setNotificationMessage,
    isLoading,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    filteredAccounts,
    paginatedAccounts,
    isAllSelectedOnCurrentPage,
    loadUserAccountsData,
    handleToggleAccountSelection,
    handleToggleAllOnPage,
    handleChangeAccountStatus,
    handleChangeAccountRole,
    handleResetAccountPassword,
    handleBulkAction,
  } = useTaiKhoanPage();

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="admin-eyebrow">BẢO MẬT & PHÂN QUYỀN</p>
          <h1 className="admin-title">Quản lý tài khoản người dùng</h1>
        </div>
        <button
          onClick={loadUserAccountsData}
          disabled={isLoading}
          className="admin-btn admin-btn-secondary cursor-pointer disabled:opacity-70"
        >
          <RotateCcw size={16} className={isLoading ? "animate-spin" : ""} />{" "}
          Làm mới danh sách
        </button>
      </header>

      {isLoading && userAccountsList.length > 0 && (
        <div className="h-0.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 animate-pulse rounded-full" />
      )}

      {notificationMessage && (
        <div className="admin-alert flex items-center justify-between">
          <span>{notificationMessage}</span>
          <button
            onClick={() => setNotificationMessage("")}
            className="cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {isLoading && userAccountsList.length === 0 ? (
        <TaiKhoanSkeleton />
      ) : (
        <>
          <TaiKhoanStats accounts={userAccountsList} />

          <TaiKhoanToolbar
            q={searchKeyword}
            setQ={setSearchKeyword}
            role={selectedRoleFilter}
            setRole={setSelectedRoleFilter}
            status={selectedStatusFilter}
            setStatus={setSelectedStatusFilter}
            filteredCount={filteredAccounts.length}
            selectedCount={selectedAccountIds.length}
            onBulkUnlock={() => handleBulkAction("unlock")}
            onBulkLock={() => handleBulkAction("lock")}
            onBulkReset={() => handleBulkAction("reset")}
          />

          <TaiKhoanTable
            rows={paginatedAccounts}
            totalItems={filteredAccounts.length}
            selected={selectedAccountIds}
            allOnPage={isAllSelectedOnCurrentPage}
            page={currentPage}
            pageSize={pageSize}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            onToggle={handleToggleAccountSelection}
            onToggleAll={handleToggleAllOnPage}
            onChangeRole={handleChangeAccountRole}
            onChangeStatus={handleChangeAccountStatus}
            onResetPassword={handleResetAccountPassword}
          />
        </>
      )}

      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-xs text-emerald-800">
        <Shield size={15} className="mr-2 inline text-emerald-600" />
        <b>Quy tắc bảo mật hệ thống:</b> Tài khoản được khởi tạo tự động khi tạo
        hồ sơ Phụ huynh hoặc Nhân sự/Giáo viên. Mật khẩu mặc định là ngày sinh
        (`DDMMYYYY`) và hệ thống yêu cầu đổi mật khẩu ở lần đăng nhập đầu tiên.
      </div>
    </section>
  );
}
