"use client";

import SucKhoeHeader from "./components/SucKhoeHeader";
import SucKhoeKpiCards from "./components/SucKhoeKpiCards";
import SucKhoeCharts from "./components/SucKhoeCharts";
import SucKhoeTable from "./components/SucKhoeTable";
import SucKhoeDetailModal from "./components/SucKhoeDetailModal";
import { useSucKhoePage } from "./useSucKhoePage";

export default function SucKhoePage() {
  const {
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
  } = useSucKhoePage();

  return (
    <section className="space-y-5">
      <SucKhoeHeader
        isLoading={isLoading}
        onRefresh={loadHealthData}
        notificationMessage={notificationMessage}
        onClearNotification={() => setNotificationMessage("")}
        errorMessage={errorMessage}
      />

      <SucKhoeKpiCards
        totalStudents={studentsList.length}
        measuredCount={kpiCounts.totalMeasured}
        normalCount={kpiCounts.normalCount}
        underweightCount={kpiCounts.underweightCount}
        severelyUnderweightCount={kpiCounts.severelyUnderweightCount}
        stuntedCount={kpiCounts.stuntedCount}
        severelyStuntedCount={kpiCounts.severelyStuntedCount}
        wastedCount={kpiCounts.wastedCount}
        severelyWastedCount={kpiCounts.severelyWastedCount}
        overweightCount={kpiCounts.overweightCount}
        obeseCount={kpiCounts.obeseCount}
        selectedCategory={selectedCategoryFilter}
        onSelectCategory={setSelectedCategoryFilter}
      />

      <SucKhoeCharts
        schoolPie={schoolPieData}
        byGrade={healthByGradeData}
        byClass={healthByClassData}
        selectedCategory={selectedCategoryFilter}
        onSelectCategory={setSelectedCategoryFilter}
      />

      <SucKhoeTable
        filtered={filteredRows}
        paginated={paginatedRows}
        classes={classesList}
        availableQuarters={availableQuarters}
        q={searchKeyword}
        setQ={setSearchKeyword}
        quarterFilter={selectedQuarterFilter}
        setQuarterFilter={setSelectedQuarterFilter}
        classFilter={classFilter}
        setClassFilter={setClassFilter}
        categoryFilter={selectedCategoryFilter}
        setCategoryFilter={setSelectedCategoryFilter}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onOpen={(row) => handleOpenStudentDetail(row)}
      />

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
