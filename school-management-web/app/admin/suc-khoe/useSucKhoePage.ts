import { useState, useEffect, useMemo } from "react";
import { getHealthRecords, createHealthRecord, deleteHealthRecord } from "@/services/health";
import { Student, ClassRow, Grade, RecordRow, HealthCategoryFilter } from "./types";
import {
  buildHealthStudentRows,
  filterHealthStudentRows,
  aggregateSchoolPie,
  aggregateHealthByGrade,
  aggregateHealthByClass,
  calculateKpiCounts,
} from "./healthAggregations";
import { fetchAllHealthData } from "./healthLoader";

export function useSucKhoePage() {
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [classesList, setClassesList] = useState<ClassRow[]>([]);
  const [gradesList, setGradesList] = useState<Grade[]>([]);
  const [latestHealthRecordsMap, setLatestHealthRecordsMap] = useState<Record<string, RecordRow | undefined>>({});
  const [recordsByQuarterAndStudent, setRecordsByQuarterAndStudent] = useState<Record<string, Record<string, RecordRow | undefined>>>({});
  const [availableQuarters, setAvailableQuarters] = useState<string[]>([]);
  const [selectedQuarterFilter, setSelectedQuarterFilter] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<HealthCategoryFilter>("ALL");
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<Student | null>(null);
  const [studentHistoryLogs, setStudentHistoryLogs] = useState<RecordRow[]>([]);

  const currentYear = new Date().getFullYear();
  const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3);

  const [healthFormData, setHealthFormData] = useState({
    height: "",
    weight: "",
    note: "",
    checkupDate: new Date().toISOString().slice(0, 10),
    quarterName: `Đợt khám Quý ${currentQuarter}/${currentYear}`,
  });

  const [searchKeyword, setSearchKeyword] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [classFilter, setClassFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  async function loadHealthData(): Promise<void> {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const data = await fetchAllHealthData();
      setStudentsList(data.students);
      setClassesList(data.classes);
      setGradesList(data.grades);
      setLatestHealthRecordsMap(data.latestMap);
      setRecordsByQuarterAndStudent(data.recordsByQuarterAndStudent);
      setAvailableQuarters(data.availableQuarters);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Không tải được dữ liệu sức khỏe");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadHealthData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword, classFilter, selectedQuarterFilter, selectedCategoryFilter]);

  const activeRecordsMap = useMemo(() => {
    if (selectedQuarterFilter && recordsByQuarterAndStudent[selectedQuarterFilter]) {
      return recordsByQuarterAndStudent[selectedQuarterFilter];
    }
    return latestHealthRecordsMap;
  }, [selectedQuarterFilter, recordsByQuarterAndStudent, latestHealthRecordsMap]);

  const healthStudentRows = useMemo(() => {
    return buildHealthStudentRows(studentsList, activeRecordsMap, classesList, gradesList);
  }, [studentsList, activeRecordsMap, classesList, gradesList]);

  const filteredRows = useMemo(() => {
    return filterHealthStudentRows(healthStudentRows, classFilter, selectedQuarterFilter, searchKeyword, selectedCategoryFilter);
  }, [healthStudentRows, classFilter, selectedQuarterFilter, searchKeyword, selectedCategoryFilter]);

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRows.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRows, currentPage]);

  async function handleOpenStudentDetail(student: Student): Promise<void> {
    setSelectedStudentDetail(student);
    setErrorMessage("");
    try {
      const rawHistory = await getHealthRecords(student.id, { ngaySinh: student.ngaySinh, gioiTinh: student.gioiTinh });
      const historyList = Array.isArray(rawHistory) ? rawHistory : [];
      setStudentHistoryLogs(historyList as unknown as RecordRow[]);
      const latestHistoryItem = historyList[0];
      const now = new Date();
      const localToday = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
      setHealthFormData({
        height: String(latestHistoryItem?.chieuCao ?? ""),
        weight: String(latestHistoryItem?.canNang ?? ""),
        note: latestHistoryItem?.ghiChu || "",
        checkupDate: localToday,
        quarterName: `Đợt khám Quý ${currentQuarter}/${currentYear}`,
      });
    } catch (error) {
      setStudentHistoryLogs([]);
      setErrorMessage(error instanceof Error ? error.message : "Không tải được lịch sử sức khỏe");
    }
  }

  async function handleSaveHealthRecord(): Promise<void> {
    if (!selectedStudentDetail) return;
    try {
      setIsSubmitting(true);
      setErrorMessage("");
      let noteContent = `${healthFormData.quarterName} - Khám sức khỏe định kỳ (Chuẩn WHO)`;
      if (healthFormData.note && healthFormData.note.trim().length > 0) {
        noteContent = `[${healthFormData.quarterName}] ${healthFormData.note.trim()}`;
      }
      await createHealthRecord({
        hocSinhId: selectedStudentDetail.id,
        ngayDo: healthFormData.checkupDate || new Date().toISOString().slice(0, 10),
        chieuCao: Number(healthFormData.height) || null,
        canNang: Number(healthFormData.weight) || null,
        ngaySinh: selectedStudentDetail.ngaySinh,
        gioiTinh: selectedStudentDetail.gioiTinh,
        ghiChu: noteContent,
      } as any);
      setNotificationMessage(`Đã lưu và tính toán chỉ số WHO thành công cho bé ${selectedStudentDetail.tenHocSinh}.`);
      await handleOpenStudentDetail(selectedStudentDetail);
      await loadHealthData();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Không lưu được chỉ số sức khỏe");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteHealthRecord(recordId: string): Promise<void> {
    if (!confirm("Bạn có chắc chắn muốn xóa lượt khám sức khỏe này?")) return;
    try {
      await deleteHealthRecord(recordId);
      if (selectedStudentDetail) {
        await handleOpenStudentDetail(selectedStudentDetail);
        await loadHealthData();
      }
      setNotificationMessage("Đã xóa lượt khám sức khỏe.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Không thể xóa lượt khám");
    }
  }

  const schoolPieData = useMemo(() => aggregateSchoolPie(healthStudentRows), [healthStudentRows]);
  const healthByGradeData = useMemo(() => aggregateHealthByGrade(healthStudentRows), [healthStudentRows]);
  const healthByClassData = useMemo(() => aggregateHealthByClass(healthStudentRows), [healthStudentRows]);
  const kpiCounts = useMemo(() => calculateKpiCounts(healthStudentRows), [healthStudentRows]);

  const studentHistoryChartData = useMemo(
    () =>
      [...studentHistoryLogs].reverse().map((logItem) => ({
        date: String(logItem.ngayDo).slice(5, 10),
        height: logItem.chieuCao || 0,
        weight: logItem.canNang || 0,
        bmi: 0,
      })),
    [studentHistoryLogs]
  );

  function getStudentClassName(classId?: string): string {
    const matchedClass = classesList.find((c) => c.id === classId);
    return matchedClass ? matchedClass.tenLop : "Chưa xếp lớp";
  }

  return {
    studentsList,
    classesList,
    availableQuarters,
    selectedQuarterFilter,
    setSelectedQuarterFilter,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    selectedStudentDetail,
    setSelectedStudentDetail,
    studentHistoryLogs,
    healthFormData,
    setHealthFormData,
    searchKeyword,
    setSearchKeyword,
    notificationMessage,
    setNotificationMessage,
    errorMessage,
    isSubmitting,
    isLoading,
    classFilter,
    setClassFilter,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    filteredRows,
    paginatedRows,
    loadHealthData,
    handleOpenStudentDetail,
    handleSaveHealthRecord,
    handleDeleteHealthRecord,
    schoolPieData,
    healthByGradeData,
    healthByClassData,
    kpiCounts,
    studentHistoryChartData,
    getStudentClassName,
  };
}
