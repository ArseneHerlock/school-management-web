import { getStudents } from "@/services/students";
import { getClasses } from "@/services/classes";
import { getGrades } from "@/services/grades";
import { getAllHealthRecords } from "@/services/health";
import { Student, ClassRow, Grade, RecordRow, getQuarterFromDate } from "./types";

export interface LoadedHealthData {
  students: Student[];
  classes: ClassRow[];
  grades: Grade[];
  latestMap: Record<string, RecordRow | undefined>;
  recordsByQuarterAndStudent: Record<string, Record<string, RecordRow | undefined>>;
  availableQuarters: string[];
  allRecords: RecordRow[];
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

  const sortedRecords = [...healthRecordsArray].sort((a: any, b: any) =>
    String(b.ngayDo || "").localeCompare(String(a.ngayDo || "")),
  );

  const latestMap: Record<string, RecordRow | undefined> = {};
  const recordsByQuarterAndStudent: Record<string, Record<string, RecordRow | undefined>> = {};
  const quarterSet = new Set<string>();

  const allRecords: RecordRow[] = sortedRecords.map((recordItem: any) => {
    const studentId = String(recordItem.hocSinhId || recordItem.HocSinhId);
    const row: RecordRow = {
      id: recordItem.id || recordItem.Id,
      hocSinhId: studentId,
      ngayDo: recordItem.ngayDo || recordItem.NgayDo,
      canNang: recordItem.canNang ?? recordItem.CanNang,
      chieuCao: recordItem.chieuCao ?? recordItem.ChieuCao,
      vongDau: recordItem.vongDau ?? recordItem.VongDau,
      vongNguc: recordItem.vongNguc ?? recordItem.VongNguc,
      ghiChu: recordItem.ghiChu ?? recordItem.GhiChu,
      haz: recordItem.haz != null ? Number(recordItem.haz) : undefined,
      waz: recordItem.waz != null ? Number(recordItem.waz) : undefined,
      whz: recordItem.whz != null ? Number(recordItem.whz) : undefined,
      ketLuanHaz: recordItem.ketLuanHaz,
      ketLuanWaz: recordItem.ketLuanWaz,
      ketLuanWhz: recordItem.ketLuanWhz,
      ketLuanTongThe: recordItem.ketLuanTongThe,
      trangThaiTheTrang: recordItem.trangThaiTheTrang,
      canCanThiep: recordItem.canCanThiep,
      loiKhuyen: recordItem.loiKhuyen,
    };

    if (!latestMap[studentId]) {
      latestMap[studentId] = row;
    }

    const quarter = getQuarterFromDate(row.ngayDo);
    if (quarter && quarter !== "Đợt khám định kỳ") {
      quarterSet.add(quarter);
      if (!recordsByQuarterAndStudent[quarter]) {
        recordsByQuarterAndStudent[quarter] = {};
      }
      if (!recordsByQuarterAndStudent[quarter][studentId]) {
        recordsByQuarterAndStudent[quarter][studentId] = row;
      }
    }

    return row;
  });

  // Sắp xếp các quý theo thứ tự giảm dần thời gian
  const availableQuarters = Array.from(quarterSet).sort((a, b) => {
    // Định dạng: "Quý X/YYYY"
    const matchA = a.match(/Quý\s*(\d)\/(\d{4})/);
    const matchB = b.match(/Quý\s*(\d)\/(\d{4})/);
    if (matchA && matchB) {
      const yearA = parseInt(matchA[2], 10);
      const yearB = parseInt(matchB[2], 10);
      if (yearA !== yearB) return yearB - yearA;
      const qA = parseInt(matchA[1], 10);
      const qB = parseInt(matchB[1], 10);
      return qB - qA;
    }
    return b.localeCompare(a);
  });

  return {
    students,
    classes,
    grades,
    latestMap,
    recordsByQuarterAndStudent,
    availableQuarters,
    allRecords,
  };
}
