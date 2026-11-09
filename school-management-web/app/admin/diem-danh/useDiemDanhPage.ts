import { useState, useEffect, useMemo } from "react";
import { getStudents } from "@/services/students";
import { getClasses } from "@/services/classes";
import { getGrades } from "@/services/grades";
import { getDailyAttendance, getStudentAttendanceHistory } from "@/services/attendance";
import {
  Student,
  ClassRow,
  Grade,
  AttendanceRecord,
  HistoryRecord,
  EnrichedStudent,
} from "./types";
import { calculatePercentage } from "./attendanceUtils";

export function useDiemDanhPage() {
  const currentDateString = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState<string>(currentDateString);
  const [selectedClassId, setSelectedClassId] = useState<string>("ALL");
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [classesList, setClassesList] = useState<ClassRow[]>([]);
  const [gradesList, setGradesList] = useState<Grade[]>([]);
  const [attendanceRecordsMap, setAttendanceRecordsMap] = useState<Record<string, AttendanceRecord>>({});
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedHistoryStudent, setSelectedHistoryStudent] = useState<Student | null>(null);
  const [studentHistoryLogs, setStudentHistoryLogs] = useState<HistoryRecord[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(false);

  async function loadAttendanceData(targetDate: string = selectedDate): Promise<void> {
    setIsLoading(true);
    try {
      const [studentsResult, classesResult, gradesResult, attendanceResult] =
        await Promise.allSettled([
          getStudents(),
          getClasses(),
          getGrades(),
          getDailyAttendance(targetDate),
        ]);

      setStudentsList(studentsResult.status === "fulfilled" && Array.isArray(studentsResult.value) ? (studentsResult.value as unknown as Student[]) : []);
      setClassesList(classesResult.status === "fulfilled" && Array.isArray(classesResult.value) ? (classesResult.value as unknown as ClassRow[]) : []);
      setGradesList(gradesResult.status === "fulfilled" && Array.isArray(gradesResult.value) ? (gradesResult.value as unknown as Grade[]) : []);

      const attendanceList = attendanceResult.status === "fulfilled" && Array.isArray(attendanceResult.value) ? attendanceResult.value : [];
      const mapped: Record<string, AttendanceRecord> = {};
      attendanceList.forEach((item: any) => {
        const studentId = item.hocSinhId || item.HocSinhId;
        if (studentId) {
          mapped[studentId] = {
            id: item.id || item.Id || studentId,
            coBanGhi: true,
            trangThai: item.trangThai || item.TrangThai || "Có mặt",
            gioDen: item.gioDen || item.GioDen || null,
            gioVe: item.gioVe || item.GioVe || null,
            ghiChu: item.ghiChu || item.GhiChu || null,
          };
        }
      });
      setAttendanceRecordsMap(mapped);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadAttendanceData(selectedDate);
  }, [selectedDate]);

  const mergedStudentsList: EnrichedStudent[] = useMemo(() => {
    return studentsList.map((studentItem) => {
      const matchedClass = classesList.find((c) => c.id === studentItem.lopId);
      const matchedGrade = gradesList.find((g) => g.id === matchedClass?.khoiId);
      const attendanceRecord = attendanceRecordsMap[studentItem.id] || {
        id: studentItem.id,
        coBanGhi: false,
        trangThai: "Chưa điểm danh",
      };

      return {
        ...studentItem,
        att: attendanceRecord,
        className: matchedClass?.tenLop || "Chưa xếp lớp",
        gradeName: matchedGrade?.tenKhoi || "Chưa rõ",
      };
    });
  }, [studentsList, attendanceRecordsMap, classesList, gradesList]);

  const classFilteredStudents = useMemo(() => {
    let resultList = mergedStudentsList;
    if (selectedClassId !== "ALL") {
      resultList = resultList.filter((s) => s.lopId === selectedClassId);
    }
    const keyword = searchKeyword.trim().toLowerCase();
    if (keyword.length > 0) {
      resultList = resultList.filter((s) => s.tenHocSinh.toLowerCase().includes(keyword));
    }
    return resultList;
  }, [mergedStudentsList, selectedClassId, searchKeyword]);

  const presentCount = useMemo(() => mergedStudentsList.filter((s) => s.att.coBanGhi && s.att.trangThai.toLowerCase().includes("có mặt")).length, [mergedStudentsList]);
  const lateCount = useMemo(() => mergedStudentsList.filter((s) => s.att.coBanGhi && s.att.trangThai.toLowerCase().includes("muộn")).length, [mergedStudentsList]);
  const absentCount = useMemo(() => mergedStudentsList.filter((s) => s.att.coBanGhi && (s.att.trangThai.toLowerCase().includes("vắng") || s.att.trangThai.toLowerCase().includes("nghỉ"))).length, [mergedStudentsList]);
  const unrecordedCount = useMemo(() => mergedStudentsList.filter((s) => !s.att.coBanGhi).length, [mergedStudentsList]);
  const schoolPercentage = useMemo(() => calculatePercentage(presentCount, studentsList.length), [presentCount, studentsList.length]);

  const attendanceByClass = useMemo(() => {
    return classesList.map((classItem) => {
      const inClass = mergedStudentsList.filter((s) => s.lopId === classItem.id);
      const present = inClass.filter((s) => s.att.coBanGhi && s.att.trangThai.toLowerCase().includes("có mặt")).length;
      const absent = inClass.filter((s) => s.att.coBanGhi && (s.att.trangThai.toLowerCase().includes("vắng") || s.att.trangThai.toLowerCase().includes("nghỉ"))).length;
      return { name: classItem.tenLop, present, absent };
    });
  }, [classesList, mergedStudentsList]);

  const attendanceByGrade = useMemo(() => {
    return gradesList.map((gradeItem) => {
      const classIds = classesList.filter((c) => c.khoiId === gradeItem.id).map((c) => c.id);
      const inGrade = mergedStudentsList.filter((s) => (s.lopId ? classIds.includes(s.lopId) : false));
      const present = inGrade.filter((s) => s.att.coBanGhi && s.att.trangThai.toLowerCase().includes("có mặt")).length;
      const absent = inGrade.filter((s) => s.att.coBanGhi && (s.att.trangThai.toLowerCase().includes("vắng") || s.att.trangThai.toLowerCase().includes("nghỉ"))).length;
      return { name: gradeItem.tenKhoi, present, absent };
    });
  }, [gradesList, classesList, mergedStudentsList]);

  async function handleOpenHistoryModal(student: Student): Promise<void> {
    setSelectedHistoryStudent(student);
    setIsHistoryLoading(true);
    try {
      const res = await getStudentAttendanceHistory(student.id);
      setStudentHistoryLogs(Array.isArray(res) ? (res as unknown as HistoryRecord[]) : []);
    } finally {
      setIsHistoryLoading(false);
    }
  }

  return {
    selectedDate,
    setSelectedDate,
    selectedClassId,
    setSelectedClassId,
    searchKeyword,
    setSearchKeyword,
    isLoading,
    loadAttendanceData,
    studentsList,
    classesList,
    classFilteredStudents,
    presentCount,
    lateCount,
    absentCount,
    unrecordedCount,
    schoolPercentage,
    attendanceByClass,
    attendanceByGrade,
    selectedHistoryStudent,
    setSelectedHistoryStudent,
    studentHistoryLogs,
    isHistoryLoading,
    handleOpenHistoryModal,
  };
}
