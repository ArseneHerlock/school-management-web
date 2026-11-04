import { useState, useEffect, useMemo, useCallback } from "react";
import {
  getStudents,
  getClasses,
  getStaff,
  getAllAttendances,
  getAllHealthRecords,
  getInvoices,
  getAllFees,
  getLeaves,
  getGrades,
  fetchMedications,
  fetchSpecialConditions,
} from "@/services";
import {
  ReportRawData,
  ReportFilterState,
  ReportCalculatedMetrics,
} from "./types";

const initialData: ReportRawData = {
  students: [],
  classes: [],
  grades: [],
  staff: [],
  attendance: [],
  health: [],
  invoices: [],
  fees: [],
  leaves: [],
  medications: [],
  specialConditions: [],
  mealDeductionData: { students: [], totalSchoolDeduction: 0, totalAbsentDays: 0 },
};

export function useReportData(selectedMonth: number, selectedYear: number) {
  const [data, setData] = useState<ReportRawData>(initialData);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [st, cl, gr, sf, at, hl, inv, fs, lv, md, sc, ml] = await Promise.all([
        getStudents().catch(() => []),
        getClasses().catch(() => []),
        getGrades().catch(() => []),
        getStaff().catch(() => []),
        getAllAttendances({ all: true }).catch(() => []),
        getAllHealthRecords().catch(() => []),
        getInvoices().catch(() => []),
        getAllFees().catch(() => []),
        getLeaves().catch(() => []),
        fetchMedications({ allDates: true }).catch(() => []),
        fetchSpecialConditions().catch(() => []),
        fetch(`/api/tuition/meal-deduction?month=${selectedMonth}&year=${selectedYear}`)
          .then((r) => (r.ok ? r.json() : { students: [], totalSchoolDeduction: 0, totalAbsentDays: 0 }))
          .catch(() => ({ students: [], totalSchoolDeduction: 0, totalAbsentDays: 0 })),
      ]);

      setData({
        students: Array.isArray(st) ? st : [],
        classes: Array.isArray(cl) ? cl : [],
        grades: Array.isArray(gr) ? gr : [],
        staff: Array.isArray(sf) ? sf : [],
        attendance: Array.isArray(at) ? at : [],
        health: Array.isArray(hl) ? hl : [],
        invoices: Array.isArray(inv) ? inv : [],
        fees: Array.isArray(fs) ? fs : [],
        leaves: Array.isArray(lv) ? lv : [],
        medications: Array.isArray(md) ? md : [],
        specialConditions: Array.isArray(sc) ? sc : [],
        mealDeductionData: {
          students: Array.isArray(ml?.students) ? ml.students : [],
          totalSchoolDeduction: Number(ml?.totalSchoolDeduction || 0),
          totalAbsentDays: Number(ml?.totalAbsentDays || 0),
        },
      });
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const monthsWithData = useMemo(() => {
    const set = new Set<number>();
    data.attendance.forEach((a) => {
      const d = new Date(a.ngay || a.date || a.createdAt);
      if (!isNaN(d.getTime()) && d.getFullYear() === selectedYear) set.add(d.getMonth() + 1);
    });
    data.health.forEach((h) => {
      if (h.thang && (!h.nam || Number(h.nam) === selectedYear)) {
        set.add(Number(h.thang));
        return;
      }
      const d = new Date(h.ngayDo || h.createdAt);
      if (!isNaN(d.getTime()) && d.getFullYear() === selectedYear) set.add(d.getMonth() + 1);
    });
    return set;
  }, [data.attendance, data.health, selectedYear]);

  return { data, loading, reloadData: loadData, monthsWithData };
}

export function calculateReportMetrics(
  data: ReportRawData,
  filters: ReportFilterState,
): { metrics: ReportCalculatedMetrics; filteredStudents: any[]; availableClasses: any[] } {
  const { scope, selectedGradeId, selectedClassId, selectedMonth, selectedYear, periodScope, searchKeyword } = filters;

  const availableClasses = data.classes.filter((c) => {
    if (scope === "school") return true;
    if (scope === "grade") return selectedGradeId === "all" || String(c.khoiId || c.gradeId) === String(selectedGradeId);
    if (scope === "class") {
      if (selectedClassId !== "all") return String(c.id) === String(selectedClassId);
      return selectedGradeId === "all" || String(c.khoiId || c.gradeId) === String(selectedGradeId);
    }
    return true;
  });

  const classIds = new Set(availableClasses.map((c) => String(c.id)));
  const filteredStudents = data.students.filter((st) => {
    const cId = String(st.lopId || st.classId || "");
    if (scope === "class" && selectedClassId !== "all") {
      if (cId !== String(selectedClassId)) return false;
    } else if ((scope === "grade" || scope === "class") && selectedGradeId !== "all") {
      if (!classIds.has(cId)) return false;
    }
    if (searchKeyword.trim()) {
      const kw = searchKeyword.toLowerCase().trim();
      const n = (st.hoTen || st.fullName || "").toLowerCase();
      const code = (st.maHocSinh || st.id || "").toLowerCase();
      if (!n.includes(kw) && !code.includes(kw)) return false;
    }
    return true;
  });

  const stIds = new Set(filteredStudents.map((s) => String(s.id)));
  const matchDate = (rawDate: any, m?: any, y?: any) => {
    if (periodScope === "cumulative") return true;
    if (m && Number(m) > 0) return Number(m) === selectedMonth && (!y || String(y).includes(String(selectedYear)));
    if (!rawDate) return false;
    const d = new Date(rawDate);
    return !isNaN(d.getTime()) && d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear;
  };

  const totalStudents = filteredStudents.length;
  const totalClasses = availableClasses.length;
  const maleCount = filteredStudents.filter((s) => s.gioiTinh === 1 || s.gioiTinh === "Nam" || s.gender === "Male").length;
  const femaleCount = totalStudents - maleCount;

  const relevantAttendance = data.attendance.filter((a) => (stIds.size === 0 || stIds.has(String(a.hocSinhId || a.childId))) && matchDate(a.ngay || a.date || a.createdAt));
  const totalAttendance = relevantAttendance.length;
  const presentCount = relevantAttendance.filter((a) => a.trangThai === 1 || a.status === "Present" || a.coMat === true).length;
  const relevantLeaves = data.leaves.filter((l) => (stIds.size === 0 || stIds.has(String(l.childId || l.hocSinhId))) && matchDate(l.tuNgay || l.fromDate || l.createdAt));
  const absentPermitted = relevantAttendance.filter((a) => a.trangThai === 2 || a.status === "Excused" || a.coPhep === true).length + relevantLeaves.length;
  const absentUnpermitted = Math.max(0, totalAttendance - presentCount - relevantAttendance.filter((a) => a.trangThai === 2).length);
  const attendanceRate = totalAttendance > 0 ? ((presentCount / totalAttendance) * 100).toFixed(1) : "0.0";

  const relevantHealth = data.health.filter((h) => (stIds.size === 0 || stIds.has(String(h.hocSinhId || h.studentId))) && matchDate(h.ngayDo || h.createdAt, h.thang, h.nam));
  const totalHealthRecords = relevantHealth.length;
  const normalHealth = relevantHealth.filter((h) => {
    const t = String(h.ketLuanTongThe || h.trangThaiTheTrang || h.danhGia || "").toLowerCase();
    return t.includes("binh_thuong") || t.includes("bình thường") || (!t && (h.chieuCao || h.canNang));
  }).length;
  const specialWatchList = relevantHealth.filter((h) => {
    const t = String(h.ketLuanTongThe || h.trangThaiTheTrang || h.danhGia || "").toLowerCase();
    return t.includes("suy dinh dưỡng") || t.includes("thap_coi") || t.includes("thừa cân") || t.includes("béo phì") || t.includes("cần theo dõi") || h.canCanThiep === true;
  });

  const relevantSpecialCond = data.specialConditions.filter((sc) => stIds.size === 0 || stIds.has(String(sc.HocSinhId || sc.hocSinhId)));
  const relevantMeds = data.medications.filter((m) => stIds.size === 0 || stIds.has(String(m.HocSinhId || m.hocSinhId)));

  const relevantMealStudents = data.mealDeductionData.students.filter((ms) => stIds.size === 0 || stIds.has(String(ms.studentId)));
  const totalMealDeduction = relevantMealStudents.reduce((sum, item) => sum + Number(item.deductionAmount || 0), 0);
  const totalMealAbsentDays = relevantMealStudents.reduce((sum, item) => sum + Number(item.absentDays || 0), 0);

  const pickupRecords = relevantAttendance.filter((a) => a.gioVe || a.nguoiDon);
  const latePickups = pickupRecords.filter((a) => a.gioVe && String(a.gioVe).slice(0, 5) > "17:00");

  let totalInvoiced = 0, totalCollected = 0, totalOutstanding = 0;
  const unpaidInvoices: any[] = [];
  data.invoices.forEach((inv) => {
    if (stIds.size > 0 && !stIds.has(String(inv.studentId || inv.hocSinhId))) return;
    const amount = Number(inv.totalAmount || inv.amount || 0);
    const paid = Number(inv.paidAmount || inv.daThu || (inv.status === "Paid" ? amount : 0));
    const debt = Number(inv.outstandingAmount || inv.conNo || Math.max(0, amount - paid));
    totalInvoiced += amount;
    totalCollected += paid;
    if (debt > 0 || inv.status === "Unpaid" || inv.status === "Pending" || inv.status === "Overdue") {
      totalOutstanding += debt > 0 ? debt : amount;
      unpaidInvoices.push(inv);
    }
  });

  const totalStaff = data.staff.length;
  const activeStaff = data.staff.filter((st) => st.trangThai === 1 || st.status === "Active" || st.isActive !== false).length;

  const classesBreakdown = availableClasses.map((cls) => {
    const stList = data.students.filter((s) => String(s.lopId || s.classId) === String(cls.id));
    const m = stList.filter((s) => s.gioiTinh === 1 || s.gioiTinh === "Nam" || s.gender === "Male").length;
    return {
      id: cls.id,
      name: cls.tenLop || cls.name || "Lớp học",
      gradeName: cls.tenKhoi || cls.gradeName || "Mầm non",
      studentCount: stList.length,
      maleCount: m,
      femaleCount: stList.length - m,
      teacherName: cls.tenGiaoVienChuNhiem || "Chưa phân công",
    };
  });

  const gradesBreakdown = data.grades.map((g) => {
    const gClasses = data.classes.filter((c) => String(c.khoiId || c.gradeId) === String(g.id));
    const gClassIds = new Set(gClasses.map((c) => String(c.id)));
    const gStudents = data.students.filter((s) => gClassIds.has(String(s.lopId || s.classId)));
    return { id: g.id, name: g.tenKhoi || g.name || "Khối", classesCount: gClasses.length, studentCount: gStudents.length };
  });

  let scopeLabel = "Toàn trường";
  if (scope === "grade") {
    const g = data.grades.find((x) => String(x.id) === String(selectedGradeId));
    scopeLabel = g ? `Khối ${g.tenKhoi || g.name}` : "Tất cả các khối";
  } else if (scope === "class") {
    const c = data.classes.find((x) => String(x.id) === String(selectedClassId));
    scopeLabel = c ? `Lớp ${c.tenLop || c.name}` : "Tất cả các lớp";
  }

  const metrics: ReportCalculatedMetrics = {
    scopeLabel,
    totalStudents,
    totalClasses,
    maleCount,
    femaleCount,
    totalAttendance,
    presentCount,
    absentPermitted,
    absentUnpermitted,
    attendanceRate,
    totalHealthRecords,
    normalHealth,
    specialWatchCount: specialWatchList.length,
    specialWatchList,
    relevantSpecialCond,
    relevantMeds,
    relevantMealStudents,
    totalMealDeduction,
    totalMealAbsentDays,
    pickupRecordsCount: pickupRecords.length,
    latePickupsCount: latePickups.length,
    latePickups,
    totalInvoiced,
    totalCollected,
    totalOutstanding,
    unpaidInvoices,
    totalStaff,
    activeStaff,
    classesBreakdown,
    gradesBreakdown,
  };

  return { metrics, filteredStudents, availableClasses };
}
