import { getStudents } from "@/services/students";
import { getClasses } from "@/services/classes";
import { getGrades } from "@/services/grades";
import { getAllHealthRecords } from "@/services/health";
import { Student, ClassRow, Grade, RecordRow } from "./types";

export interface LoadedHealthData {
  students: Student[];
  classes: ClassRow[];
  grades: Grade[];
  latestMap: Record<string, RecordRow | undefined>;
}

export async function fetchAllHealthData(): Promise<LoadedHealthData> {
  const [fetchedStudents, fetchedClasses, fetchedGrades, fetchedHealthRecords] =
    await Promise.all([
      getStudents(),
      getClasses(),
      getGrades(),
      getAllHealthRecords().catch(() => []),
    ]);

  const students = Array.isArray(fetchedStudents)
    ? (fetchedStudents as unknown as Student[])
    : [];
  const classes = Array.isArray(fetchedClasses)
    ? (fetchedClasses as unknown as ClassRow[])
    : [];
  const grades = Array.isArray(fetchedGrades)
    ? (fetchedGrades as unknown as Grade[])
    : [];

  const healthRecordsArray = Array.isArray(fetchedHealthRecords)
    ? fetchedHealthRecords
    : [];
  const latestMap: Record<string, RecordRow | undefined> = {};

  const sortedRecords = [...healthRecordsArray].sort((a: any, b: any) =>
    String(b.ngayDo || "").localeCompare(String(a.ngayDo || "")),
  );

  sortedRecords.forEach((recordItem: any) => {
    const studentId = String(recordItem.hocSinhId || recordItem.HocSinhId);
    if (!latestMap[studentId]) {
      latestMap[studentId] = {
        id: recordItem.id || recordItem.Id,
        hocSinhId: studentId,
        ngayDo: recordItem.ngayDo || recordItem.NgayDo,
        canNang: recordItem.canNang ?? recordItem.CanNang,
        chieuCao: recordItem.chieuCao ?? recordItem.ChieuCao,
        vongDau: recordItem.vongDau ?? recordItem.VongDau,
        vongNguc: recordItem.vongNguc ?? recordItem.VongNguc,
        ghiChu: recordItem.ghiChu ?? recordItem.GhiChu,
        haz: recordItem.haz,
        waz: recordItem.waz,
        whz: recordItem.whz,
        ketLuanHaz: recordItem.ketLuanHaz,
        ketLuanWaz: recordItem.ketLuanWaz,
        ketLuanWhz: recordItem.ketLuanWhz,
        ketLuanTongThe: recordItem.ketLuanTongThe,
        trangThaiTheTrang: recordItem.trangThaiTheTrang,
        canCanThiep: recordItem.canCanThiep,
      };
    }
  });

  return { students, classes, grades, latestMap };
}
