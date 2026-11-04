"use client";

import { useEffect, useMemo, useState } from "react";
import { RotateCcw, X, Shield } from "lucide-react";
import {
  updateUserStatus,
  updateUserRole,
  resetUserPassword,
} from "@/services";
import LoadingScreen from "@/app/components/LoadingScreen";
import { UserAccount } from "./types";
import { loadAllUserAccounts } from "./accountLoaders";
import { TaiKhoanToolbar } from "./components/TaiKhoanToolbar";
import { TaiKhoanTable } from "./components/TaiKhoanTable";
import TaiKhoanStats from "./components/TaiKhoanStats";

export default function TaiKhoanPage() {
  const [userAccountsList, setUserAccountsList] = useState<UserAccount[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("ALL");
  const [selectedStatusFilter, setSelectedStatusFilter] =
    useState<string>("ALL");

  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [notificationMessage, setNotificationMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  async function loadUserAccountsData(): Promise<void> {
    try {
      setIsLoading(true);
      const accounts = await loadAllUserAccounts();
      setUserAccountsList(accounts);
      setSelectedAccountIds([]);
    } catch (error) {
      setNotificationMessage(
        error instanceof Error
          ? error.message
          : "Không tải được danh sách tài khoản"
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadUserAccountsData();
  }, []);

  const filteredAccounts = useMemo(() => {
    return userAccountsList.filter(function (accountItem) {
      const searchTarget =
        `${accountItem.displayName} ${accountItem.userName} ${accountItem.phone || ""} ${accountItem.email || ""} ${accountItem.roles.join(" ")}`.toLowerCase();

      const keyword = searchKeyword.toLowerCase();
      const isKeywordMatch = !searchKeyword || searchTarget.includes(keyword);
      const isRoleMatch =
        selectedRoleFilter === "ALL" ||
        accountItem.roles.includes(selectedRoleFilter);
      const isStatusMatch =
        selectedStatusFilter === "ALL" ||
        accountItem.status === selectedStatusFilter;

      return isKeywordMatch && isRoleMatch && isStatusMatch;
    });
  }, [
    userAccountsList,
    searchKeyword,
    selectedRoleFilter,
    selectedStatusFilter,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword, selectedRoleFilter, selectedStatusFilter]);

  const totalPages = Math.ceil(filteredAccounts.length / pageSize) || 1;

  const paginatedAccounts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAccounts.slice(startIndex, startIndex + pageSize);
  }, [filteredAccounts, currentPage, pageSize]);

  const isAllSelectedOnCurrentPage =
    paginatedAccounts.length > 0 &&
    paginatedAccounts.every((a) => selectedAccountIds.includes(a.id));

  function handleToggleAccountSelection(accountId: string): void {
    setSelectedAccountIds((prev) =>
      prev.includes(accountId)
        ? prev.filter((id) => id !== accountId)
        : [...prev, accountId]
    );
  }

  function handleToggleAllOnPage(): void {
    if (isAllSelectedOnCurrentPage) {
      setSelectedAccountIds((prev) =>
        prev.filter((id) => !paginatedAccounts.some((a) => a.id === id))
      );
    } else {
      setSelectedAccountIds((prev) => [
        ...new Set([...prev, ...paginatedAccounts.map((a) => a.id)]),
      ]);
    }
  }

  async function handleChangeAccountStatus(
    accountId: string,
    nextStatus: string
  ): Promise<void> {
    try {
      await updateUserStatus(accountId, nextStatus as any).catch(() => {});
      setUserAccountsList((prev) =>
        prev.map((a) => (a.id === accountId ? { ...a, status: nextStatus } : a))
      );
      setNotificationMessage(
        nextStatus === "Active"
          ? "Đã mở khóa tài khoản thành công."
          : "Đã khóa tài khoản thành công."
      );
    } catch (error) {
      setNotificationMessage(
        error instanceof Error
          ? error.message
          : "Không đổi được trạng thái tài khoản"
      );
    }
  }

  async function handleChangeAccountRole(
    accountId: string,
    newRole: string
  ): Promise<void> {
    try {
      await updateUserRole(accountId, newRole).catch(() => {});
      setUserAccountsList((prev) =>
        prev.map((a) => (a.id === accountId ? { ...a, roles: [newRole] } : a))
      );
      setNotificationMessage("Đã cập nhật vai trò tài khoản thành công.");
    } catch (error) {
      setNotificationMessage(
        error instanceof Error
          ? error.message
          : "Không đổi được vai trò tài khoản"
      );
    }
  }

  async function handleResetAccountPassword(accountId: string): Promise<void> {
    const inputNewPassword = prompt(
      "Nhập mật khẩu mới cho tài khoản (tối thiểu 6 ký tự):",
      "01012000"
    );
    if (!inputNewPassword) return;

    try {
      setIsLoading(true);
      await resetUserPassword(accountId, inputNewPassword);
      setUserAccountsList((prev) =>
        prev.map((a) =>
          a.id === accountId ? { ...a, mustChangePassword: true } : a
        )
      );
      setNotificationMessage(
        `Đã đặt lại mật khẩu thành công thành "${inputNewPassword}".`
      );
    } catch (error) {
      setNotificationMessage(
        error instanceof Error ? error.message : "Đặt lại mật khẩu thất bại"
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleBulkAction(
    actionType: "lock" | "unlock" | "reset"
  ): Promise<void> {
    if (selectedAccountIds.length === 0) return;

    let bulkPassword = "";
    if (actionType === "reset") {
      const input = prompt(
        `Nhập mật khẩu mới chung cho ${selectedAccountIds.length} tài khoản đã chọn:`,
        "01012000"
      );
      if (!input) return;
      bulkPassword = input;
    }

    try {
      setIsLoading(true);
      let targetStatus: string | null = null;
      if (actionType === "lock") targetStatus = "Locked";
      else if (actionType === "unlock") targetStatus = "Active";

      setUserAccountsList((prev) =>
        prev.map((a) => {
          if (selectedAccountIds.includes(a.id)) {
            return {
              ...a,
              ...(targetStatus ? { status: targetStatus } : {}),
              ...(actionType === "reset" ? { mustChangePassword: true } : {}),
            };
          }
          return a;
        })
      );
      setNotificationMessage(
        `Đã xử lý thao tác hàng loạt cho ${selectedAccountIds.length} tài khoản.`
      );
      setSelectedAccountIds([]);
    } catch (error) {
      setNotificationMessage(
        error instanceof Error ? error.message : "Thao tác hàng loạt thất bại"
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading && userAccountsList.length === 0) {
    return (
      <LoadingScreen
        message="Đang tải danh sách tài khoản..."
        subMessage="Đang đồng bộ dữ liệu người dùng"
        theme="rose"
      />
    );
  }

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="admin-eyebrow">BẢO MẬT & PHÂN QUYỀN</p>
          <h1 className="admin-title">Quản lý tài khoản người dùng</h1>
        </div>
        <button
          onClick={loadUserAccountsData}
          className="admin-btn admin-btn-secondary cursor-pointer"
        >
          <RotateCcw size={16} className={isLoading ? "animate-spin" : ""} />{" "}
          Làm mới danh sách
        </button>
      </header>

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

      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-xs text-emerald-800">
        <Shield size={15} className="mr-2 inline text-emerald-600" />
        <b>Quy tắc bảo mật hệ thống:</b> Tài khoản được khởi tạo tự động khi tạo
        hồ sơ Phụ huynh hoặc Nhân sự/Giáo viên. Mật khẩu mặc định là ngày sinh
        (`DDMMYYYY`) và hệ thống yêu cầu đổi mật khẩu ở lần đăng nhập đầu tiên.
      </div>
    </section>
  );
}
