import { useState, useEffect, useMemo } from "react";
import { updateUserStatus, updateUserRole, resetUserPassword } from "@/services";
import { UserAccount } from "./types";
import { loadAllUserAccounts } from "./accountLoaders";

export function useTaiKhoanPage() {
  const [userAccountsList, setUserAccountsList] = useState<UserAccount[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("ALL");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("ALL");
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
      setNotificationMessage(error instanceof Error ? error.message : "Không tải được danh sách tài khoản");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadUserAccountsData();
  }, []);

  const filteredAccounts = useMemo(() => {
    return userAccountsList.filter((accountItem) => {
      const searchTarget = `${accountItem.displayName} ${accountItem.userName} ${accountItem.phone || ""} ${accountItem.email || ""} ${accountItem.roles.join(" ")}`.toLowerCase();
      const keyword = searchKeyword.toLowerCase();
      const isKeywordMatch = !searchKeyword || searchTarget.includes(keyword);
      const isRoleMatch = selectedRoleFilter === "ALL" || accountItem.roles.includes(selectedRoleFilter);
      const isStatusMatch = selectedStatusFilter === "ALL" || accountItem.status === selectedStatusFilter;
      return isKeywordMatch && isRoleMatch && isStatusMatch;
    });
  }, [userAccountsList, searchKeyword, selectedRoleFilter, selectedStatusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword, selectedRoleFilter, selectedStatusFilter]);

  const totalPages = Math.ceil(filteredAccounts.length / pageSize) || 1;
  const paginatedAccounts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAccounts.slice(startIndex, startIndex + pageSize);
  }, [filteredAccounts, currentPage, pageSize]);

  const isAllSelectedOnCurrentPage =
    paginatedAccounts.length > 0 && paginatedAccounts.every((a) => selectedAccountIds.includes(a.id));

  function handleToggleAccountSelection(accountId: string): void {
    setSelectedAccountIds((prev) =>
      prev.includes(accountId) ? prev.filter((id) => id !== accountId) : [...prev, accountId]
    );
  }

  function handleToggleAllOnPage(): void {
    if (isAllSelectedOnCurrentPage) {
      setSelectedAccountIds((prev) => prev.filter((id) => !paginatedAccounts.some((a) => a.id === id)));
    } else {
      setSelectedAccountIds((prev) => [...new Set([...prev, ...paginatedAccounts.map((a) => a.id)])]);
    }
  }

  async function handleChangeAccountStatus(accountId: string, nextStatus: string): Promise<void> {
    try {
      await updateUserStatus(accountId, nextStatus as any).catch(() => {});
      setUserAccountsList((prev) => prev.map((a) => (a.id === accountId ? { ...a, status: nextStatus } : a)));
      setNotificationMessage(nextStatus === "Active" ? "Đã mở khóa tài khoản thành công." : "Đã khóa tài khoản thành công.");
    } catch (error) {
      setNotificationMessage(error instanceof Error ? error.message : "Không đổi được trạng thái tài khoản");
    }
  }

  async function handleChangeAccountRole(accountId: string, newRole: string): Promise<void> {
    try {
      await updateUserRole(accountId, newRole).catch(() => {});
      setUserAccountsList((prev) => prev.map((a) => (a.id === accountId ? { ...a, roles: [newRole] } : a)));
      setNotificationMessage("Đã cập nhật vai trò tài khoản thành công.");
    } catch (error) {
      setNotificationMessage(error instanceof Error ? error.message : "Không đổi được vai trò tài khoản");
    }
  }

  async function handleResetAccountPassword(accountId: string): Promise<void> {
    const inputNewPassword = prompt("Nhập mật khẩu mới cho tài khoản (tối thiểu 6 ký tự):", "01012000");
    if (!inputNewPassword) return;

    try {
      setIsLoading(true);
      await resetUserPassword(accountId, inputNewPassword);
      setUserAccountsList((prev) => prev.map((a) => (a.id === accountId ? { ...a, mustChangePassword: true } : a)));
      setNotificationMessage(`Đã đặt lại mật khẩu thành công thành "${inputNewPassword}".`);
    } catch (error) {
      setNotificationMessage(error instanceof Error ? error.message : "Đặt lại mật khẩu thất bại");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleBulkAction(actionType: "lock" | "unlock" | "reset"): Promise<void> {
    if (selectedAccountIds.length === 0) return;
    if (actionType === "reset") {
      const input = prompt(`Nhập mật khẩu mới chung cho ${selectedAccountIds.length} tài khoản đã chọn:`, "01012000");
      if (!input) return;
    }

    try {
      setIsLoading(true);
      const targetStatus = actionType === "lock" ? "Locked" : actionType === "unlock" ? "Active" : null;
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
      setNotificationMessage(`Đã xử lý thao tác hàng loạt cho ${selectedAccountIds.length} tài khoản.`);
      setSelectedAccountIds([]);
    } catch (error) {
      setNotificationMessage(error instanceof Error ? error.message : "Thao tác hàng loạt thất bại");
    } finally {
      setIsLoading(false);
    }
  }

  return {
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
  };
}
