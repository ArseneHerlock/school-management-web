import { getUsers, getStaff, getParents } from "@/services";
import { UserAccount } from "./types";

export async function loadAllUserAccounts(): Promise<UserAccount[]> {
  let usersList: any[] = [];

  // Fetch users, staff, and parents in parallel for fast cold loads
  const [usersRes, staff, parents] = await Promise.all([
    getUsers().catch((err) => {
      console.warn("Could not fetch users list from auth service:", err);
      return [];
    }),
    getStaff().catch(() => []),
    getParents().catch(() => []),
  ]);

  const payload: any = usersRes;
  const items = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.items)
      ? payload.items
      : [];
  if (items.length > 0) {
    usersList = items;
  }

  const staffArr: any[] = Array.isArray(staff) ? (staff as any[]) : [];
  const parentArr: any[] = Array.isArray(parents) ? (parents as any[]) : [];

  const parentByAccountId = new Map<string, any>();
  const parentById = new Map<string, any>();
  parentArr.forEach((p) => {
    const accId = p.taiKhoanId || p.TaiKhoanId;
    if (accId) parentByAccountId.set(String(accId).toLowerCase(), p);
    if (p.id) parentById.set(String(p.id).toLowerCase(), p);
  });

  const staffByUserId = new Map<string, any>();
  staffArr.forEach((s) => {
    const uId = s.userId || s.UserId || s.staffId || s.StaffId;
    if (uId) staffByUserId.set(String(uId).toLowerCase(), s);
  });

  const mergedMap = new Map<string, UserAccount>();

  mergedMap.set("admin-001", {
    id: "admin-001",
    userName: "admin",
    displayName: "Quản trị viên Hệ thống",
    email: "admin@onekids.edu.vn",
    phone: "0901234567",
    status: "Active",
    mustChangePassword: false,
    roles: ["ADMIN"],
  });

  usersList.forEach((u) => {
    const userId = u.userId || u.id;
    if (!userId) return;
    const lowerId = String(userId).toLowerCase();
    const staffMatch = staffByUserId.get(lowerId);
    const parentMatch =
      parentByAccountId.get(lowerId) || parentById.get(lowerId);

    const displayName =
      staffMatch?.fullName ||
      parentMatch?.hoTen ||
      u.displayName ||
      u.userName ||
      "Người dùng";
    const phone =
      staffMatch?.phoneNumber || parentMatch?.soDienThoai || u.phone || "";
    const email = staffMatch?.email || parentMatch?.email || u.email || null;

    mergedMap.set(lowerId, {
      id: userId,
      userName: u.userName || phone || "user",
      rawUserName: u.userName,
      displayName,
      phone,
      email,
      status: u.status || "Active",
      mustChangePassword: Boolean(u.mustChangePassword),
      roles: Array.isArray(u.roles) && u.roles.length > 0 ? u.roles : ["USER"],
    });
  });

  staffArr.forEach((s) => {
    const staffId = s.staffId || s.StaffId || s.id;
    const uId = s.userId || s.UserId;
    const lookupKey = (uId || staffId || "").toLowerCase();
    if (!mergedMap.has(lookupKey)) {
      mergedMap.set(lookupKey, {
        id: uId || staffId,
        userName: s.staffCode || s.phoneNumber || `gv_${s.fullName}`,
        displayName: s.fullName,
        phone: s.phoneNumber || "",
        email: s.email || null,
        status: s.status === 1 || s.status === "Active" ? "Active" : "Inactive",
        mustChangePassword: false,
        roles: ["GIAO_VIEN"],
      });
    }
  });

  parentArr.forEach((p) => {
    const pId = p.id || p.Id;
    const accId = p.taiKhoanId || p.TaiKhoanId;
    const lookupKey = (accId || pId || "").toLowerCase();
    if (!mergedMap.has(lookupKey)) {
      mergedMap.set(lookupKey, {
        id: accId || pId,
        userName: p.soDienThoai || `ph_${p.hoTen}`,
        displayName: p.hoTen,
        phone: p.soDienThoai || "",
        email: p.email || null,
        status: "Active",
        mustChangePassword: false,
        roles: ["PHU_HUYNH"],
      });
    }
  });

  return Array.from(mergedMap.values()).sort((a, b) =>
    a.displayName.localeCompare(b.displayName, "vi")
  );
}
