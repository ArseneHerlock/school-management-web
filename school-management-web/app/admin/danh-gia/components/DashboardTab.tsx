"use client";

import React from "react";
import DanhGiaStats from "./DanhGiaStats";
import DanhGiaMatrix from "./DanhGiaMatrix";
import DanhGiaFilter from "./DanhGiaFilter";
import DanhGiaHistory from "./DanhGiaHistory";
import { DanhGiaStatsData, ClassChartItem, DomainChartItem, MatrixCell } from "../types";
import { ActivityItem, CriterionItem, AssessmentItem } from "@/services/development";

interface DashboardTabProps {
  stats: DanhGiaStatsData;
  classes: any[];
  classChartData: ClassChartItem[];
  domainChartData: DomainChartItem[];
  activities: ActivityItem[];
  criteria: CriterionItem[];
  students: any[];
  adminMatrixClassId: string;
  setAdminMatrixClassId: (id: string) => void;
  adminMatrixActivityId: string;
  setAdminMatrixActivityId: (id: string) => void;
  adminMatrixStudents: any[];
  adminActiveCriteria: CriterionItem[];
  adminMatrixData: Record<string, Record<string, MatrixCell>>;
  onOpenDetailModal: (cellInfo: any) => void;
  filterClass: string;
  setFilterClass: (val: string) => void;
  filterActivity: string;
  setFilterActivity: (val: string) => void;
  filterCriterion: string;
  setFilterCriterion: (val: string) => void;
  filterResult: "all" | "pass" | "fail";
  setFilterResult: (val: "all" | "pass" | "fail") => void;
  filterFromDate: string;
  setFilterFromDate: (val: string) => void;
  filterToDate: string;
  setFilterToDate: (val: string) => void;
  searchKeyword: string;
  setSearchKeyword: (val: string) => void;
  filteredAssessments: AssessmentItem[];
  paginatedAssessments: AssessmentItem[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  onDeleteAssessment: (a: AssessmentItem) => void;
}

export default function DashboardTab({
  stats,
  classes,
  classChartData,
  domainChartData,
  activities,
  criteria,
  students,
  adminMatrixClassId,
  setAdminMatrixClassId,
  adminMatrixActivityId,
  setAdminMatrixActivityId,
  adminMatrixStudents,
  adminActiveCriteria,
  adminMatrixData,
  onOpenDetailModal,
  filterClass,
  setFilterClass,
  filterActivity,
  setFilterActivity,
  filterCriterion,
  setFilterCriterion,
  filterResult,
  setFilterResult,
  filterFromDate,
  setFilterFromDate,
  filterToDate,
  setFilterToDate,
  searchKeyword,
  setSearchKeyword,
  filteredAssessments,
  paginatedAssessments,
  currentPage,
  setCurrentPage,
  onDeleteAssessment,
}: DashboardTabProps) {
  return (
    <div className="space-y-6">
      <DanhGiaStats
        stats={stats}
        classesCount={classes.length}
        classChartData={classChartData}
        domainChartData={domainChartData}
      />
      <DanhGiaFilter
        classes={classes}
        activities={activities}
        criteria={criteria}
        filterClass={filterClass}
        setFilterClass={setFilterClass}
        filterActivity={filterActivity}
        setFilterActivity={setFilterActivity}
        filterCriterion={filterCriterion}
        setFilterCriterion={setFilterCriterion}
        filterResult={filterResult}
        setFilterResult={setFilterResult}
        filterFromDate={filterFromDate}
        setFilterFromDate={setFilterFromDate}
        filterToDate={filterToDate}
        setFilterToDate={setFilterToDate}
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        filteredCount={filteredAssessments.length}
      />
      <DanhGiaHistory
        paginatedAssessments={paginatedAssessments}
        filteredAssessmentsCount={filteredAssessments.length}
        currentPage={currentPage}
        pageSize={10}
        onPageChange={setCurrentPage}
        getStudentName={(id) => students.find((s) => s.id === id)?.tenHocSinh || id}
        getClassName={(id) => classes.find((c) => c.id === id)?.tenLop || "-"}
        getCriterionName={(id) => criteria.find((c) => c.id === id)?.name || id}
        getCriterionCode={(id) => criteria.find((c) => c.id === id)?.code || ""}
        getActivityName={(id) => activities.find((a) => a.id === id)?.name || "Chung"}
        onDeleteClick={onDeleteAssessment}
      />
    </div>
  );
}
