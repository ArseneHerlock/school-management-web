import { EnrichedStudent, ClassRow, Grade, AttendanceRecord, Student } from "./types";

export function calculatePercentage(partValue: number, totalValue: number): number {
  if (!totalValue || totalValue === 0) {
    return 0;
  }
  return Math.round((partValue * 100) / totalValue);
}

export function computeClassStats(classes: ClassRow[], mergedStudents: EnrichedStudent[]) {
  return classes.map(function (classItem) {
    const studentsInClass = mergedStudents.filter(
      (student) => student.lopId === classItem.id
    );
    const totalCount = studentsInClass.length;
    const presentInClass = studentsInClass.filter(
      (s) => s.att?.trangThai === "Có mặt" || s.att?.trangThai === "Đi muộn"
    ).length;
    const rate = calculatePercentage(presentInClass, totalCount);

    return {
      tenLop: classItem.tenLop,
      siSo: totalCount,
      coMat: presentInClass,
      tiLe: rate,
    };
  });
}

export function computeGradeStats(
  grades: Grade[],
  classes: ClassRow[],
  mergedStudents: EnrichedStudent[]
) {
  return grades.map(function (gradeItem) {
    const classIdsInGrade = classes
      .filter((c) => c.khoiId === gradeItem.id)
      .map((c) => c.id);

    const studentsInGrade = mergedStudents.filter((student) =>
      student.lopId ? classIdsInGrade.includes(student.lopId) : false
    );
    const totalCount = studentsInGrade.length;
    const presentInGrade = studentsInGrade.filter(
      (s) => s.att?.trangThai === "Có mặt" || s.att?.trangThai === "Đi muộn"
    ).length;
    const rate = calculatePercentage(presentInGrade, totalCount);

    return {
      tenKhoi: gradeItem.tenKhoi,
      siSo: totalCount,
      coMat: presentInGrade,
      tiLe: rate,
    };
  });
}
