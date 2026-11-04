import {
  ContactPerson,
  RawRecord,
  extractArrayData,
} from "./types";

export function transformContactsDirectory(
  parentsData: RawRecord[],
  staffData: RawRecord[],
  classesData: RawRecord[],
  conversationsData: RawRecord[],
  linksData: RawRecord[],
  currentUserId: string
): ContactPerson[] {
  const parentChildrenMap: Record<string, any[]> = {};
  linksData.forEach((linkItem) => {
    const parentId = String(linkItem.parentId);
    if (!parentChildrenMap[parentId]) {
      parentChildrenMap[parentId] = [];
    }
    parentChildrenMap[parentId].push(linkItem);
  });

  const parentContacts = parentsData.map((parentItem) => {
    const accountId = String(parentItem.taiKhoanId || parentItem.TaiKhoanId || "");
    const parentId = String(parentItem.id || parentItem.Id || "");
    const children = parentChildrenMap[parentId] || [];
    const linkedClassIds = children
      .map((child) => String(child.lopId || child.LopId || ""))
      .filter(Boolean);

    const ownClasses = classesData.filter((classItem) =>
      linkedClassIds.includes(String(classItem.id || classItem.Id))
    );

    const matchedConversation = conversationsData.find((conv) => {
      const userA = String(conv.userAId || conv.UserAId);
      const userB = String(conv.userBId || conv.UserBId);
      return userA === accountId || userB === accountId;
    });

    return {
      accountId,
      name: String(parentItem.hoTen || parentItem.HoTen || "Phụ huynh"),
      role: "PHU_HUYNH" as const,
      classIds: linkedClassIds,
      gradeIds: ownClasses.map((item) => String(item.khoiId || item.KhoiId || "")),
      classNames: ownClasses.map((item) => String(item.tenLop || item.TenLop || "")),
      conversation: matchedConversation,
    };
  });

  const teacherContacts = staffData.map((staffItem) => {
    const staffId = String(staffItem.staffId || staffItem.StaffId || "");
    const accountId = String(staffItem.userId || staffItem.UserId || "");

    const assignedClasses = classesData.filter(
      (classItem) =>
        String(classItem.giaoVienChuNhiemId || classItem.GiaoVienChuNhiemId) === staffId
    );

    const matchedConversation = conversationsData.find((conv) => {
      const userA = String(conv.userAId || conv.UserAId);
      const userB = String(conv.userBId || conv.UserBId);
      return userA === accountId || userB === accountId;
    });

    return {
      accountId,
      name: String(staffItem.fullName || staffItem.FullName || "Giáo viên"),
      role: "GIAO_VIEN" as const,
      classIds: assignedClasses.map((item) => String(item.id || item.Id)),
      gradeIds: assignedClasses.map((item) => String(item.khoiId || item.KhoiId || "")),
      classNames: assignedClasses.map((item) => String(item.tenLop || item.TenLop || "")),
      conversation: matchedConversation,
    };
  });

  return [...parentContacts, ...teacherContacts].filter(
    (contact) => contact.accountId && contact.accountId !== currentUserId
  );
}
