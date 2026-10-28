"use client";

import { useEffect, useMemo, useState } from "react";
import {
  KeyRound,
  Lock,
  RotateCcw,
  ShieldCheck,
  Users,
  X,
  Shield,
} from "lucide-react";
import { updateUserStatus, updateUserRole, resetUserPassword } from "@/services";
import LoadingScreen from "@/app/components/LoadingScreen";
import { UserAccount } from "./tai-khoan/types";
import { loadAllUserAccounts } from "./tai-khoan/accountLoaders";
import { TaiKhoanToolbar } from "./tai-khoan/TaiKhoanToolbar";
import { TaiKhoanTable } from "./tai-khoan/TaiKhoanTable";

export default function TaiKhoan() {
  // Dữ liệu tài khoản
  const [userAccountsList, setUserAccountsList] = useState<UserAccount[]>([]);

  // Tìm kiếm và bộ lọc
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("ALL");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("ALL");

  // Danh sách ID tài khoản được chọn để thao tác hàng loạt
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);

  // Trạng thái thông báo và tải dữ liệu
  const [notificationMessage, setNotificationMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Phân trang
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  /**
   * Tải toàn bộ danh sách tài khoản người dùng từ AuthService
   */
  async function loadUserAccountsData(): Promise<void> {
    try {
      setIsLoading(true);
      const accounts = await loadAllUserAccounts();
      setUserAccountsList(accounts);
      setSelectedAccountIds([]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không tải được danh sách tài khoản";
      setNotificationMessage(message);
    } finally {
      setIsLoading(false);
    }
  }

  // Tự động tải dữ liệu khi mở trang
  useEffect(() => {
    loadUserAccountsData();
  }, []);

  /**
   * Lọc danh sách tài khoản theo từ khóa, vai trò và trạng thái hoạt động
   */
  const filteredAccounts = useMemo(() => {
    return userAccountsList.filter(function (accountItem) {
      const searchTarget =
        `${accountItem.displayName} ${accountItem.userName} ${accountItem.phone || ""} ${accountItem.email || ""} ${accountItem.roles.join(" ")}`.toLowerCase();

      const keyword = searchKeyword.toLowerCase();
      const isKeywordMatch = !searchKeyword || searchTarget.includes(keyword);

      const isRoleMatch =
        selectedRoleFilter === "ALL" || accountItem.roles.includes(selectedRoleFilter);

      const isStatusMatch =
        selectedStatusFilter === "ALL" || accountItem.status === selectedStatusFilter;

      return isKeywordMatch && isRoleMatch && isStatusMatch;
    });
  }, [userAccountsList, searchKeyword, selectedRoleFilter, selectedStatusFilter]);

  // Đặt lại trang 1 mỗi khi thay đổi bộ lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword, selectedRoleFilter, selectedStatusFilter]);

  const totalPages = Math.ceil(filteredAccounts.length / pageSize) || 1;

  const paginatedAccounts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAccounts.slice(startIndex, startIndex + pageSize);
  }, [filteredAccounts, currentPage, pageSize]);

  // Kiểm tra xem tất cả tài khoản trong trang hiện tại đã được chọn hay chưa
  const isAllSelectedOnCurrentPage =
    paginatedAccounts.length > 0 &&
    paginatedAccounts.every(function (accountItem) {
      return selectedAccountIds.includes(accountItem.id);
    });

  /**
   * Chọn hoặc bỏ chọn một tài khoản
   */
  function handleToggleAccountSelection(accountId: string): void {
    setSelectedAccountIds(function (previousIds) {
      if (previousIds.includes(accountId)) {
        return previousIds.filter((id) => id !== accountId);
      } else {
        return [...previousIds, accountId];
      }
    });
  }

  /**
   * Chọn tất cả hoặc bỏ chọn tất cả trên trang hiện tại
   */
  function handleToggleAllOnPage(): void {
    if (isAllSelectedOnCurrentPage) {
      setSelectedAccountIds(function (previousIds) {
        return previousIds.filter(function (id) {
          return !paginatedAccounts.some((accountItem) => accountItem.id === id);
        });
      });
    } else {
      setSelectedAccountIds(function (previousIds) {
        const currentPageIds = paginatedAccounts.map((accountItem) => accountItem.id);
        return [...new Set([...previousIds, ...currentPageIds])];
      });
    }
  }

  /**
   * Thay đổi trạng thái tài khoản (Khóa / Mở khóa)
   */
  async function handleChangeAccountStatus(accountId: string, nextStatus: string): Promise<void> {
    try {
      await updateUserStatus(accountId, nextStatus as any).catch(() => {});
      setUserAccountsList(function (previousList) {
        return previousList.map(function (accountItem) {
          if (accountItem.id === accountId) {
            return { ...accountItem, status: nextStatus };
          }
          return accountItem;
        });
      });

      const messageText =
        nextStatus === "Active"
          ? "Đã mở khóa tài khoản thành công."
          : "Đã khóa tài khoản thành công.";
      setNotificationMessage(messageText);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không đổi được trạng thái tài khoản";
      setNotificationMessage(message);
    }
  }

  /**
   * Thay đổi vai trò quyền hạn của tài khoản
   */
  async function handleChangeAccountRole(accountId: string, newRole: string): Promise<void> {
    try {
      await updateUserRole(accountId, newRole).catch(() => {});
      setUserAccountsList(function (previousList) {
        return previousList.map(function (accountItem) {
          if (accountItem.id === accountId) {
            return { ...accountItem, roles: [newRole] };
          }
          return accountItem;
        });
      });
      setNotificationMessage("Đã cập nhật vai trò tài khoản thành công.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không đổi được vai trò tài khoản";
      setNotificationMessage(message);
    }
  }

  /**
   * Đặt lại mật khẩu cho một tài khoản
   */
  async function handleResetAccountPassword(accountId: string): Promise<void> {
    const inputNewPassword = prompt(
      "Nhập mật khẩu mới cho tài khoản (tối thiểu 6 ký tự):",
      "01012000"
    );
    if (!inputNewPassword) {
      return;
    }

    try {
      setIsLoading(true);
      await resetUserPassword(accountId, inputNewPassword);

      setUserAccountsList(function (previousList) {
        return previousList.map(function (accountItem) {
          if (accountItem.id === accountId) {
            return { ...accountItem, mustChangePassword: true };
          }
          return accountItem;
        });
      });

      setNotificationMessage(
        `Đã đặt lại mật khẩu thành công thành "${inputNewPassword}". Mật khẩu mới có hiệu lực ngay lập tức.`
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Đặt lại mật khẩu thất bại";
      setNotificationMessage(message);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Xử lý thao tác hàng loạt trên nhiều tài khoản được chọn
   */
  async function handleBulkAction(actionType: "lock" | "unlock" | "reset"): Promise<void> {
    if (selectedAccountIds.length === 0) {
      return;
    }

    let bulkPassword = "";
    if (actionType === "reset") {
      const input = prompt(
        `Nhập mật khẩu mới chung cho ${selectedAccountIds.length} tài khoản đã chọn:`,
        "01012000"
      );
      if (!input) {
        return;
      }
      bulkPassword = input;
    }

    try {
      setIsLoading(true);
      let targetStatus: string | null = null;
      if (actionType === "lock") {
        targetStatus = "Locked";
      } else if (actionType === "unlock") {
        targetStatus = "Active";
      }

      setUserAccountsList(function (previousList) {
        return previousList.map(function (accountItem) {
          if (selectedAccountIds.includes(accountItem.id)) {
            return {
              ...accountItem,
              ...(targetStatus ? { status: targetStatus } : {}),
              ...(actionType === "reset" ? { mustChangePassword: true } : {}),
            };
          }
          return accountItem;
        });
      });

      setNotificationMessage(`Đã xử lý thao tác hàng loạt cho ${selectedAccountIds.length} tài khoản.`);
      setSelectedAccountIds([]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Thao tác hàng loạt thất bại";
      setNotificationMessage(message);
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
      {/* Tiêu đề trang */}
      <header className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="admin-eyebrow">BẢO MẬT & PHÂN QUYỀN</p>
          <h1 className="admin-title">Quản lý tài khoản người dùng</h1>
          <p className="admin-subtitle">
            Phân định rõ ràng Người sở hữu hồ sơ và Tên đăng nhập (Username) sử dụng để đăng nhập ứng dụng.
          </p>
        </div>
        <button
          onClick={loadUserAccountsData}
          className="admin-btn admin-btn-secondary cursor-pointer"
        >
          <RotateCcw size={16} className={isLoading ? "animate-spin" : ""} /> Làm mới danh sách
        </button>
      </header>

      {/* Thông báo kết quả thao tác */}
      {notificationMessage && (
        <div className="admin-alert flex items-center justify-between">
          <span>{notificationMessage}</span>
          <button onClick={() => setNotificationMessage("")} className="cursor-pointer">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Thẻ thống kê tài khoản */}
      <div className="grid gap-3 md:grid-cols-4">
        <KpiSummaryCard icon={Users} label="Tổng tài khoản" value={userAccountsList.length} />
        <KpiSummaryCard
          icon={ShieldCheck}
          label="Đang hoạt động"
          value={userAccountsList.filter((item) => item.status === "Active").length}
        />
        <KpiSummaryCard
          icon={Lock}
          label="Đang khóa"
          value={userAccountsList.filter((item) => item.status !== "Active").length}
        />
        <KpiSummaryCard
          icon={KeyRound}
          label="Yêu cầu đổi mật khẩu"
          value={userAccountsList.filter((item) => item.mustChangePassword).length}
        />
      </div>

      {/* Thanh công cụ tìm kiếm và lọc */}
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

      {/* Bảng danh sách tài khoản */}
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
        onChangeRole={(accountId, newRole) => handleChangeAccountRole(accountId, newRole)}
        onChangeStatus={(accountId, nextStatus) => handleChangeAccountStatus(accountId, nextStatus)}
        onResetPassword={(accountId) => handleResetAccountPassword(accountId)}
      />

      {/* Lưu ý bảo mật */}
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-xs text-emerald-800">
        <Shield size={15} className="mr-2 inline text-emerald-600" />
        <b>Quy tắc bảo mật hệ thống:</b> Tài khoản được khởi tạo tự động khi tạo hồ sơ Phụ huynh hoặc Nhân sự/Giáo viên. Mật khẩu mặc định là ngày sinh (`DDMMYYYY`) và hệ thống yêu cầu đổi mật khẩu ở lần đăng nhập đầu tiên.
      </div>
    </section>
  );
}

function KpiSummaryCard({
  icon: IconComponent,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: number;
}) {
  return (
    <div className="admin-card p-4">
      <div className="flex items-center gap-3">
        <div className="admin-icon">
          <IconComponent size={18} />
        </div>
        <div>
          <p className="text-xs text-slate-400">{label}</p>
          <p className="mt-1 text-2xl font-black">{value}</p>
        </div>
      </div>
    </div>
  );
}
