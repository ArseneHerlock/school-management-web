import {
  RoomRatioTelemetry,
  ClassAttendanceStat,
  WeeklyAttendancePoint,
} from "./types";

export function aggregateAttendanceStats({
  activeStudents,
  classesList,
  attendanceList,
  leavesList,
}: {
  activeStudents: any[];
  classesList: any[];
  attendanceList: any[];
  leavesList: any[];
}) {
  const totalEnrolled = activeStudents.length;

  // Present count today
  const presentCount = attendanceList.filter((a: any) => {
    const st = String(a.trangThai || "").toLowerCase();
    return st.includes("có mặt") || st.includes("muộn") || st.includes("present");
  }).length;

  const absentWithNotice = leavesList.filter((l: any) => {
    const st = String(l.status || "").toLowerCase();
    return st === "1" || st === "approved" || st === "đã duyệt";
  }).length;

  const absentWithoutNotice = Math.max(
    0,
    totalEnrolled - presentCount - absentWithNotice
  );
  const attendanceRate =
    totalEnrolled > 0 ? Math.round((presentCount / totalEnrolled) * 100) : 0;

  // Room Ratios
  const roomRatios: RoomRatioTelemetry[] = classesList.map(
    (cls: any, idx: number) => {
      const classStudents = activeStudents.filter((s: any) => s.lopId === cls.id);
      const enrolled = classStudents.length;

      const classStudentIds = new Set(classStudents.map((s: any) => s.id));
      const present = attendanceList.filter((a: any) => {
        const isPresent =
          String(a.trangThai || "").toLowerCase().includes("có mặt") ||
          String(a.trangThai || "").toLowerCase().includes("muộn");
        return isPresent && classStudentIds.has(a.hocSinhId);
      }).length;

      const className = cls.tenLop || `Lớp ${idx + 1}`;
      const isNhaTre =
        className.toLowerCase().includes("nhà trẻ") ||
        className.toLowerCase().includes("trẻ");
      const isMam = className.toLowerCase().includes("mầm");
      const isChoi = className.toLowerCase().includes("chồi");
      const isLa = className.toLowerCase().includes("lá");

      const standardRatio = isNhaTre ? 5 : isMam ? 15 : isChoi ? 20 : isLa ? 25 : 20;
      const teachersOnDuty = 2;
      const actualRatio =
        teachersOnDuty > 0 ? Math.round(present / teachersOnDuty) : 0;
      const isSafe = actualRatio <= standardRatio;

      return {
        classId: cls.id,
        className,
        roomName: cls.phongHoc || `Phòng ${idx + 1}`,
        ageGroup: isNhaTre
          ? "12 - 36 tháng"
          : isMam
          ? "3 - 4 tuổi"
          : isChoi
          ? "4 - 5 tuổi"
          : "5 - 6 tuổi",
        enrolled,
        present,
        teachersOnDuty,
        ratioText: present > 0 ? `1 : ${actualRatio}` : "Chưa điểm danh",
        standardRatio,
        isSafe,
        statusLabel: isSafe ? "Đạt chuẩn an toàn" : "Gần ngưỡng định biên",
      };
    }
  );

  // Class Attendance
  const classAttendance: ClassAttendanceStat[] = classesList.map(
    (cls: any, idx: number) => {
      const classStudents = activeStudents.filter((s: any) => s.lopId === cls.id);
      const enrolled = classStudents.length;
      const classStudentIds = new Set(classStudents.map((s: any) => s.id));
      const present = attendanceList.filter((a: any) => {
        const isPresent =
          String(a.trangThai || "").toLowerCase().includes("có mặt") ||
          String(a.trangThai || "").toLowerCase().includes("muộn") ||
          String(a.trangThai || "").toLowerCase().includes("present");
        return isPresent && classStudentIds.has(a.hocSinhId);
      }).length;
      const absent = Math.max(0, enrolled - present);
      const rate = enrolled > 0 ? Math.round((present / enrolled) * 100) : 0;
      return {
        classId: cls.id,
        className: cls.tenLop || `Lớp ${idx + 1}`,
        gradeName: cls.tenKhoi || "",
        enrolled,
        present,
        absent,
        rate,
      };
    }
  );

  // Weekly Attendance
  const weeklyAttendance: WeeklyAttendancePoint[] = [];
  if (attendanceList.length > 0) {
    weeklyAttendance.push({
      day: "Hôm nay",
      rate: attendanceRate,
      presentCount,
      totalCount: totalEnrolled,
    });
  }

  return {
    totalEnrolled,
    presentCount,
    absentWithNotice,
    absentWithoutNotice,
    attendanceRate,
    roomRatios,
    classAttendance,
    weeklyAttendance,
  };
}
