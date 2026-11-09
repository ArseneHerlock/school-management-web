"use client";

import { useState } from "react";
import { RefreshCw, BarChart3, UserCheck } from "lucide-react";
import TabsNav, { TabItem } from "@/app/components/ui/TabsNav";
import { AdminAttTab } from "./types";
import { useDiemDanhPage } from "./useDiemDanhPage";
import DiemDanhDashboard from "./components/DiemDanhDashboard";
import DiemDanhMonitoring from "./components/DiemDanhMonitoring";
import DiemDanhHistoryModal from "./components/DiemDanhHistoryModal";

export default function DiemDanhPage() {
  const [activeTab, setActiveTab] = useState<AdminAttTab>("dashboard");
  const {
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
  } = useDiemDanhPage();

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
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            Giám sát chuyên cần
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-2xl border border-emerald-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-emerald-500"
          />
          <button
            onClick={() => loadAttendanceData(selectedDate)}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-emerald-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 transition cursor-pointer"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin text-emerald-600" : ""} />{" "}
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
