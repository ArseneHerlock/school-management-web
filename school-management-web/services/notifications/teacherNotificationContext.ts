import { api } from "../client";
import { getClasses } from "../classes";
import { getStaffByUserId } from "../staff";
import { getStudents } from "../students";

export interface TeacherNotificationContext {
  matchedClass: any;
  studentMap: Map<string, string>;
  parentNameByUserId: Map<string, string>;
}

let teacherContextCache: {
  userId: string;
  expiresAt: number;
  matchedClass: any;
  studentMap: Map<string, string>;
  parentNameByUserId: Map<string, string>;
} | null = null;

export async function getOrLoadTeacherContext(
  userId: string
): Promise<TeacherNotificationContext> {
  const nowMs = Date.now();
  if (
    teacherContextCache &&
    teacherContextCache.userId === userId &&
    teacherContextCache.expiresAt > nowMs
  ) {
    return {
      matchedClass: teacherContextCache.matchedClass,
      studentMap: teacherContextCache.studentMap,
      parentNameByUserId: teacherContextCache.parentNameByUserId,
    };
  }

  const [staffMember, allClasses, allParents] = await Promise.all([
    getStaffByUserId(userId).catch(() => null),
    getClasses().catch(() => []),
    api.get<any[]>("parents", "/api/parents").catch(() => []),
  ]);

  const matchedClass = allClasses.find(
    (c) => staffMember?.staffId && c.giaoVienChuNhiemId === staffMember.staffId
  );

  const studentMap = new Map<string, string>();
  const classStudents = matchedClass
    ? await getStudents({ lopId: matchedClass.id }).catch(() => [])
    : [];

  classStudents.forEach((s) => {
    studentMap.set(String(s.id), s.tenHocSinh);
  });

  const parentNameByUserId = new Map<string, string>();
  if (Array.isArray(allParents)) {
    allParents.forEach((p: any) => {
      const uid = String(p.taiKhoanId || p.TaiKhoanId || p.id || p.Id || "")
        .toLowerCase()
        .trim();
      const name = String(p.hoTen || p.HoTen || "");
      if (uid && name) parentNameByUserId.set(uid, name);
    });
  }

  teacherContextCache = {
    userId,
    expiresAt: nowMs + 5 * 60 * 1000,
    matchedClass,
    studentMap,
    parentNameByUserId,
  };

  return { matchedClass, studentMap, parentNameByUserId };
}
