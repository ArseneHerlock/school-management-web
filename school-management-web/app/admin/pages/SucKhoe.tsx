"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCw, X, ShieldAlert } from "lucide-react";
import { getStudents } from "@/services/students";
import { getClasses } from "@/services/classes";
import { getGrades } from "@/services/grades";
import {
  getAllHealthRecords,
  getHealthRecords,
  createHealthRecord,
  deleteHealthRecord,
} from "@/services/health";
import {
  Student,
  ClassRow,
  Grade,
  RecordRow,
  getQuarterFromDate,
} from "./suc-khoe/types";
import { SucKhoeKpiCards } from "./suc-khoe/SucKhoeKpiCards";
import { SucKhoeCharts } from "./suc-khoe/SucKhoeCharts";
import { SucKhoeTable } from "./suc-khoe/SucKhoeTable";
import { SucKhoeDetailModal } from "./suc-khoe/SucKhoeDetailModal";
import { evaluateWhoMetrics } from "@/app/teacher/health/components/whoStandards";

export default function SucKhoe() {
  // Dữ liệu chính
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [classesList, setClassesList] = useState<ClassRow[]>([]);
  const [gradesList, setGradesList] = useState<Grade[]>([]);
  const [latestHealthRecordsMap, setLatestHealthRecordsMap] = useState<Record<string, RecordRow | undefined>>({});

  // Lọc và chọn
  const [selectedQuarterFilter, setSelectedQuarterFilter] = useState<string>("Quý 4/2026");
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<Student | null>(null);
  const [studentHistoryLogs, setStudentHistoryLogs] = useState<RecordRow[]>([]);

  // Biểu mẫu khám sức khỏe
  const [healthFormData, setHealthFormData] = useState({
    height: "",
    weight: "",
    note: "",
    checkupDate: new Date().toISOString().slice(0, 10),
    quarterName: "Đợt khám Quý 4/2026",
  });

  // Tìm kiếm, thông báo và trạng thái
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [notificationMessage, setNotificationMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [classFilter, setClassFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  /**
   * Tải danh sách học sinh, lớp, khối và tất cả bản ghi sức khỏe
   */
  async function loadHealthData(): Promise<void> {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const [fetchedStudents, fetchedClasses, fetchedGrades, fetchedHealthRecords] =
        await Promise.all([
          getStudents(),
          getClasses(),
          getGrades(),
          getAllHealthRecords().catch(() => []),
        ]);

      setStudentsList(Array.isArray(fetchedStudents) ? (fetchedStudents as unknown as Student[]) : []);
      setClassesList(Array.isArray(fetchedClasses) ? (fetchedClasses as unknown as ClassRow[]) : []);
      setGradesList(Array.isArray(fetchedGrades) ? (fetchedGrades as unknown as Grade[]) : []);

      const healthRecordsArray = Array.isArray(fetchedHealthRecords) ? fetchedHealthRecords : [];
      const latestMap: Record<string, RecordRow | undefined> = {};

      const sortedRecords = [...healthRecordsArray].sort(function (recordA: any, recordB: any) {
        return String(recordB.ngayDo || "").localeCompare(String(recordA.ngayDo || ""));
      });

      sortedRecords.forEach(function (recordItem: any) {
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

      setLatestHealthRecordsMap(latestMap);
    } catch (error) {
      const displayMessage =
        error instanceof Error ? error.message : "Không tải được dữ liệu sức khỏe";
      setErrorMessage(displayMessage);
    } finally {
      setIsLoading(false);
    }
  }

  // Tải dữ liệu ban đầu
  useEffect(() => {
    loadHealthData();
  }, []);

  // Đặt lại trang 1 khi thay đổi bộ lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword, classFilter, selectedQuarterFilter]);

  function getStudentClassName(classId?: string): string {
    const matchedClass = classesList.find((classItem) => classItem.id === classId);
    return matchedClass ? matchedClass.tenLop : "Chưa xếp lớp";
  }

  function getStudentGradeName(classId?: string): string {
    const matchedClass = classesList.find((classItem) => classItem.id === classId);
    const matchedGrade = gradesList.find((gradeItem) => gradeItem.id === matchedClass?.khoiId);
    return matchedGrade ? matchedGrade.tenKhoi : "Chưa rõ khối";
  }

  // Danh sách dòng dữ liệu kết hợp chuẩn WHO (HAZ, WAZ, WHZ)
  const healthStudentRows = useMemo(() => {
    return studentsList.map(function (studentItem) {
      const latestRecord = latestHealthRecordsMap[studentItem.id];
      const hasMetrics = latestRecord?.canNang && latestRecord?.chieuCao && latestRecord.canNang > 0 && latestRecord.chieuCao > 0;
      
      const who = hasMetrics
        ? evaluateWhoMetrics(latestRecord.canNang, latestRecord.chieuCao, studentItem.ngaySinh, studentItem.gioiTinh)
        : null;

      return {
        ...studentItem,
        health: latestRecord,
        haz: latestRecord?.haz ?? who?.haz.zScore,
        waz: latestRecord?.waz ?? who?.waz.zScore,
        whz: latestRecord?.whz ?? who?.whz.zScore,
        hazLabel: latestRecord?.ketLuanHaz ?? who?.haz.label ?? "Chưa đo",
        wazLabel: latestRecord?.ketLuanWaz ?? who?.waz.label ?? "Chưa đo",
        whzLabel: latestRecord?.ketLuanWhz ?? who?.whz.label ?? "Chưa đo",
        trangThaiTheTrang: latestRecord?.trangThaiTheTrang ?? who?.trangThaiTongThe ?? (hasMetrics ? "Bình thường" : "Chưa có số đo"),
        canCanThiep: latestRecord?.canCanThiep ?? who?.canCanThiep ?? false,
        quarterLabel: getQuarterFromDate(latestRecord?.ngayDo),
        className: getStudentClassName(studentItem.lopId),
        gradeName: getStudentGradeName(studentItem.lopId),
      };
    });
  }, [studentsList, latestHealthRecordsMap, classesList, gradesList]);

  // Lọc dữ liệu theo từ khóa và lớp
  const filteredRows = healthStudentRows.filter(function (rowItem) {
    const isClassMatch = !classFilter || rowItem.lopId === classFilter;
    const isQuarterMatch =
      !selectedQuarterFilter || rowItem.quarterLabel.includes(selectedQuarterFilter);

    const keyword = searchKeyword.toLowerCase();
    const isKeywordMatch = `${rowItem.tenHocSinh} ${rowItem.className} ${rowItem.gradeName}`
      .toLowerCase()
      .includes(keyword);

    return isClassMatch && isQuarterMatch && isKeywordMatch;
  });

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRows.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRows, currentPage]);

  /**
   * Mở chi tiết sức khỏe của học sinh
   */
  async function handleOpenStudentDetail(student: Student): Promise<void> {
    setSelectedStudentDetail(student);
    setErrorMessage("");

    try {
      const rawHistory = await getHealthRecords(student.id);
      const historyList = Array.isArray(rawHistory) ? rawHistory : [];
      setStudentHistoryLogs(historyList as unknown as RecordRow[]);

      const latestHistoryItem = historyList[0];
      const currentYear = new Date().getFullYear();
      const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3);

      const now = new Date();
      const localToday = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 10);

      setHealthFormData({
        height: String(latestHistoryItem?.chieuCao ?? ""),
        weight: String(latestHistoryItem?.canNang ?? ""),
        note: latestHistoryItem?.ghiChu || "",
        checkupDate: localToday,
        quarterName: `Đợt khám Quý ${currentQuarter}/${currentYear}`,
      });
    } catch (error) {
      setStudentHistoryLogs([]);
      setErrorMessage(
        error instanceof Error ? error.message : "Không tải được lịch sử sức khỏe"
      );
    }
  }

  /**
   * Lưu chỉ số khám sức khỏe mới
   */
  async function handleSaveHealthRecord(): Promise<void> {
    if (!selectedStudentDetail) {
      return;
    }

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

      setNotificationMessage(
        `Đã lưu và tính toán chỉ số WHO thành công cho bé ${selectedStudentDetail.tenHocSinh}.`
      );

      await handleOpenStudentDetail(selectedStudentDetail);
      await loadHealthData();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không lưu được chỉ số sức khỏe";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  /**
   * Xóa một lượt khám sức khỏe
   */
  async function handleDeleteHealthRecord(recordId: string): Promise<void> {
    const isConfirmed = confirm("Bạn có chắc chắn muốn xóa lượt khám sức khỏe này?");
    if (!isConfirmed) {
      return;
    }

    try {
      await deleteHealthRecord(recordId);
      if (selectedStudentDetail) {
        await handleOpenStudentDetail(selectedStudentDetail);
        await loadHealthData();
      }
      setNotificationMessage("Đã xóa lượt khám sức khỏe.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể xóa lượt khám";
      setErrorMessage(message);
    }
  }

  // Thống kê phân bố thể trạng toàn trường theo chuẩn WHO
  const schoolPieData = Object.values(
    healthStudentRows.reduce(function (accumulator: any, rowItem) {
      const label = rowItem.trangThaiTheTrang || "Chưa đo";
      if (!accumulator[label]) {
        accumulator[label] = { name: label, value: 0 };
      }
      accumulator[label].value++;
      return accumulator;
    }, {})
  );

  // Thống kê theo khối
  const healthByGradeData = Object.values(
    healthStudentRows.reduce(function (accumulator: any, rowItem) {
      if (!accumulator[rowItem.gradeName]) {
        accumulator[rowItem.gradeName] = {
          name: rowItem.gradeName,
          total: 0,
          measured: 0,
          normal: 0,
        };
      }
      accumulator[rowItem.gradeName].total++;
      if (rowItem.health) {
        accumulator[rowItem.gradeName].measured++;
      }
      if (!rowItem.canCanThiep && rowItem.health?.canNang) {
        accumulator[rowItem.gradeName].normal++;
      }
      return accumulator;
    }, {})
  );

  // Thống kê theo lớp
  const healthByClassData = Object.values(
    healthStudentRows.reduce(function (accumulator: any, rowItem) {
      if (!accumulator[rowItem.className]) {
        accumulator[rowItem.className] = {
          name: rowItem.className,
          total: 0,
          measured: 0,
          normal: 0,
        };
      }
      accumulator[rowItem.className].total++;
      if (rowItem.health) {
        accumulator[rowItem.className].measured++;
      }
      if (!rowItem.canCanThiep && rowItem.health?.canNang) {
        accumulator[rowItem.className].normal++;
      }
      return accumulator;
    }, {})
  );

  const studentHistoryChartData = [...studentHistoryLogs].reverse().map(function (logItem) {
    return {
      date: String(logItem.ngayDo).slice(5, 10),
      height: logItem.chieuCao || 0,
      weight: logItem.canNang || 0,
      bmi: 0,
    };
  });

  const measuredCount = healthStudentRows.filter((item) => item.health?.canNang).length;
  const normalCount = healthStudentRows.filter((item) => !item.canCanThiep && item.health?.canNang).length;
  const stuntedCount = healthStudentRows.filter((item) => item.haz != null && item.haz < -2).length;
  const underweightCount = healthStudentRows.filter((item) => item.waz != null && item.waz < -2).length;
  const overweightCount = healthStudentRows.filter((item) => item.whz != null && item.whz > 2).length;

  return (
    <section className="space-y-5">
      {/* Tiêu đề trang */}
      <header className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="admin-eyebrow">QUẢN TRỊ Y TẾ & THỂ TRẠNG HỌC SINH (CHUẨN WHO 0 - 5 TUỔI)</p>
          <h1 className="admin-title">
            Giám Sát Thể Trạng & Khám Sức Khỏe Toàn Trường
          </h1>
          <p className="admin-subtitle">
            Đánh giá toàn diện theo 3 chỉ số WHO: HAZ (Thấp còi), WAZ (Nhẹ cân), WHZ (Thể trạng). Xem báo cáo tổng quan toàn trường và chi tiết biểu đồ đường cong tăng trưởng từng học sinh.
          </p>
        </div>
        <button
          onClick={loadHealthData}
          className="admin-btn admin-btn-secondary"
        >
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          {isLoading ? "Đang tải" : "Làm mới"}
        </button>
      </header>

      {/* Thông báo kết quả thao tác */}
      {notificationMessage && (
        <div className="admin-alert">
          {notificationMessage}
          <button onClick={() => setNotificationMessage("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Thông báo lỗi nếu có */}
      {errorMessage && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {errorMessage}
        </div>
      )}

      {/* Thẻ chỉ số KPI dành cho Admin */}
      <SucKhoeKpiCards
        totalStudents={studentsList.length}
        measuredCount={measuredCount}
        normalCount={normalCount}
        stuntedCount={stuntedCount}
        underweightCount={underweightCount}
        overweightCount={overweightCount}
      />

      {/* Biểu đồ phân tích thể trạng */}
      <SucKhoeCharts
        schoolPie={schoolPieData}
        byGrade={healthByGradeData}
        byClass={healthByClassData}
      />

      {/* Bảng dữ liệu học sinh */}
      <SucKhoeTable
        filtered={filteredRows}
        paginated={paginatedRows}
        classes={classesList}
        q={searchKeyword}
        setQ={setSearchKeyword}
        quarterFilter={selectedQuarterFilter}
        setQuarterFilter={setSelectedQuarterFilter}
        classFilter={classFilter}
        setClassFilter={setClassFilter}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onOpen={(row) => handleOpenStudentDetail(row)}
      />

      {/* Modal chi tiết sức khỏe học sinh kèm biểu đồ tăng trưởng WHO */}
      {selectedStudentDetail && (
        <SucKhoeDetailModal
          selected={selectedStudentDetail}
          className={getStudentClassName(selectedStudentDetail.lopId)}
          history={studentHistoryLogs}
          historyChart={studentHistoryChartData}
          form={healthFormData}
          setForm={setHealthFormData}
          busy={isSubmitting}
          onClose={() => setSelectedStudentDetail(null)}
          onSave={handleSaveHealthRecord}
          onRemove={(recordId) => handleDeleteHealthRecord(recordId)}
        />
      )}
    </section>
  );
}
