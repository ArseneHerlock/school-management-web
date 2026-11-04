"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCw, BarChart3, UserCheck } from "lucide-react";
import { getStudents } from "@/services/students";
import { getClasses } from "@/services/classes";
import { getGrades } from "@/services/grades";
import { getDailyAttendance, getStudentAttendanceHistory } from "@/services/attendance";
import TabsNav, { TabItem } from "@/app/components/ui/TabsNav";
import {
  Student,
  ClassRow,
  Grade,
  AttendanceRecord,
  HistoryRecord,
  AdminAttTab,
  EnrichedStudent,
} from "./types";
import { calculatePercentage } from "./attendanceUtils";
import DiemDanhDashboard from "./components/DiemDanhDashboard";
import DiemDanhMonitoring from "./components/DiemDanhMonitoring";
import DiemDanhHistoryModal from "./components/DiemDanhHistoryModal";

export default function DiemDanhPage() {
  const currentDateString = new Date().toISOString().split("T")[0];
  const [activeTab, setActiveTab] = useState<AdminAttTab>("dashboard");
  const [selectedDate, setSelectedDate] = useState<string>(currentDateString);
  const [selectedClassId, setSelectedClassId] = useState<string>("ALL");

  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [classesList, setClassesList] = useState<ClassRow[]>([]);
  const [gradesList, setGradesList] = useState<Grade[]>([]);
  const [attendanceRecordsMap, setAttendanceRecordsMap] = useState<
    Record<string, AttendanceRecord>
  >({});

  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [selectedHistoryStudent, setSelectedHistoryStudent] =
    useState<Student | null>(null);
  const [studentHistoryLogs, setStudentHistoryLogs] = useState<HistoryRecord[]>(
    []
  );
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(false);

  async function loadAttendanceData(
    targetDate: string = selectedDate
  ): Promise<void> {
    setIsLoading(true);
    try {
      const [studentsResult, classesResult, gradesResult, attendanceResult] =
        await Promise.allSettled([
          getStudents(),
          getClasses(),
          getGrades(),
          getDailyAttendance(targetDate),
        ]);

      setStudentsList(
        studentsResult.status === "fulfilled" && Array.isArray(studentsResult.value)
          ? (studentsResult.value as unknown as Student[])
          : []
      );
      setClassesList(
        classesResult.status === "fulfilled" && Array.isArray(classesResult.value)
          ? (classesResult.value as unknown as ClassRow[])
          : []
      );
      setGradesList(
        gradesResult.status === "fulfilled" && Array.isArray(gradesResult.value)
          ? (gradesResult.value as unknown as Grade[])
          : []
      );

      const attendanceList =
        attendanceResult.status === "fulfilled" &&
        Array.isArray(attendanceResult.value)
          ? attendanceResult.value
          : [];

      const mappedAttendance: Record<string, AttendanceRecord> = {};
      attendanceList.forEach(function (attendanceItem: any) {
        const studentId = attendanceItem.hocSinhId || attendanceItem.HocSinhId;
        if (studentId) {
          mappedAttendance[studentId] = {
            id: attendanceItem.id || attendanceItem.Id || studentId,
            coBanGhi: true,
            trangThai:
              attendanceItem.trangThai || attendanceItem.TrangThai || "Có mặt",
            gioDen: attendanceItem.gioDen || attendanceItem.GioDen || null,
            gioVe: attendanceItem.gioVe || attendanceItem.GioVe || null,
            ghiChu: attendanceItem.ghiChu || attendanceItem.GhiChu || null,
          };
        }
      });

      setAttendanceRecordsMap(mappedAttendance);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadAttendanceData(selectedDate);
  }, [selectedDate]);

  const mergedStudentsList: EnrichedStudent[] = useMemo(() => {
    return studentsList.map(function (studentItem) {
      const matchedClass = classesList.find((c) => c.id === studentItem.lopId);
      const matchedGrade = gradesList.find(
        (g) => g.id === matchedClass?.khoiId
      );
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
      resultList = resultList.filter((s) =>
        s.tenHocSinh.toLowerCase().includes(keyword)
      );
    }
    return resultList;
  }, [mergedStudentsList, selectedClassId, searchKeyword]);

  const presentCount = useMemo(
    () =>
      mergedStudentsList.filter(
        (s) => s.att.coBanGhi && s.att.trangThai.toLowerCase().includes("có mặt")
      ).length,
    [mergedStudentsList]
  );

  const lateCount = useMemo(
    () =>
      mergedStudentsList.filter(
        (s) => s.att.coBanGhi && s.att.trangThai.toLowerCase().includes("muộn")
      ).length,
    [mergedStudentsList]
  );

  const absentCount = useMemo(
    () =>
      mergedStudentsList.filter(
        (s) =>
          s.att.coBanGhi &&
          (s.att.trangThai.toLowerCase().includes("vắng") ||
            s.att.trangThai.toLowerCase().includes("nghỉ"))
      ).length,
    [mergedStudentsList]
  );

  const unrecordedCount = useMemo(
    () => mergedStudentsList.filter((s) => !s.att.coBanGhi).length,
    [mergedStudentsList]
  );

  const schoolPercentage = useMemo(
    () => calculatePercentage(presentCount, studentsList.length),
    [presentCount, studentsList.length]
  );

  const attendanceByClass = useMemo(() => {
    return classesList.map((classItem) => {
      const inClass = mergedStudentsList.filter((s) => s.lopId === classItem.id);
      const present = inClass.filter(
        (s) => s.att.coBanGhi && s.att.trangThai.toLowerCase().includes("có mặt")
      ).length;
      const absent = inClass.filter(
        (s) =>
          s.att.coBanGhi &&
          (s.att.trangThai.toLowerCase().includes("vắng") ||
            s.att.trangThai.toLowerCase().includes("nghỉ"))
      ).length;
      return { name: classItem.tenLop, present, absent };
    });
  }, [classesList, mergedStudentsList]);

  const attendanceByGrade = useMemo(() => {
    return gradesList.map((gradeItem) => {
      const classIds = classesList
        .filter((c) => c.khoiId === gradeItem.id)
        .map((c) => c.id);
      const inGrade = mergedStudentsList.filter((s) =>
        s.lopId ? classIds.includes(s.lopId) : false
      );
      const present = inGrade.filter(
        (s) => s.att.coBanGhi && s.att.trangThai.toLowerCase().includes("có mặt")
      ).length;
      const absent = inGrade.filter(
        (s) =>
          s.att.coBanGhi &&
          (s.att.trangThai.toLowerCase().includes("vắng") ||
            s.att.trangThai.toLowerCase().includes("nghỉ"))
      ).length;
      return { name: gradeItem.tenKhoi, present, absent };
    });
  }, [gradesList, classesList, mergedStudentsList]);

  async function handleOpenHistoryModal(student: Student): Promise<void> {
    setSelectedHistoryStudent(student);
    setIsHistoryLoading(true);
    try {
      const historyResult = await getStudentAttendanceHistory(student.id);
      setStudentHistoryLogs(
        Array.isArray(historyResult)
          ? (historyResult as unknown as HistoryRecord[])
          : []
      );
    } finally {
      setIsHistoryLoading(false);
    }
  }

  const tabs: TabItem<AdminAttTab>[] = [
    { id: "dashboard", label: "Tổng quan chuyên cần", icon: BarChart3 },
    {
      id: "monitoring",
      label: "Bảng giám sát trực tiếp",
      icon: UserCheck,
      badge: studentsList.length,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-bold text-rose-500 uppercase">
            Học vụ & Giám sát chuyên cần
          </span>
          <h1 className="text-2xl font-black text-slate-800">
            Giám sát Điểm danh Toàn trường
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Dành cho Ban Giám Hiệu theo dõi tỷ lệ chuyên cần và sĩ số các lớp.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-2xl border border-rose-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-rose-400"
          />
          <button
            onClick={() => loadAttendanceData(selectedDate)}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-rose-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-rose-50 transition"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />{" "}
            Cập nhật
          </button>
        </div>
      </div>

      <TabsNav tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "dashboard" ? (
        <DiemDanhDashboard
          presentCount={presentCount}
          lateCount={lateCount}
          absentCount={absentCount}
          unrecordedCount={unrecordedCount}
          totalStudents={studentsList.length}
          schoolPercent={schoolPercentage}
          byClass={attendanceByClass}
          byGrade={attendanceByGrade}
        />
      ) : (
        <DiemDanhMonitoring
          students={classFilteredStudents}
          classes={classesList}
          selectedClassId={selectedClassId}
          setSelectedClassId={setSelectedClassId}
          q={searchKeyword}
          setQ={setSearchKeyword}
          onViewHistory={handleOpenHistoryModal}
        />
      )}

      <DiemDanhHistoryModal
        student={selectedHistoryStudent}
        onClose={() => setSelectedHistoryStudent(null)}
        logs={studentHistoryLogs}
        loading={isHistoryLoading}
      />
    </div>
  );
}
