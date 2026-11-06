"use client";

import React from "react";
import {
  ClassAttendanceStat,
  WhoNutritionSummary,
  DomainProgressStat,
  TuitionLedgerStats,
  AgeDistributionItem,
  WeeklyAttendancePoint,
} from "@/services/adminDashboardTypes";
import { ClassAttendanceChart } from "./ClassAttendanceChart";
import { WhoNutritionChart } from "./WhoNutritionChart";
import { TuitionAndDomainProgressCharts } from "./TuitionAndDomainProgressCharts";
import { AgeDistributionChart } from "./AgeDistributionChart";

interface PreschoolAnalyticsChartsProps {
  weeklyData?: WeeklyAttendancePoint[];
  ageData: AgeDistributionItem[];
  classAttendance?: ClassAttendanceStat[];
  whoNutrition?: WhoNutritionSummary;
  domainProgress?: DomainProgressStat[];
  tuitionLedger?: TuitionLedgerStats;
  onNavigate?: (tab: string) => void;
}

export const PreschoolAnalyticsCharts: React.FC<PreschoolAnalyticsChartsProps> = ({
  ageData = [],
  classAttendance = [],
  whoNutrition = {
    totalStudents: 0,
    measuredCount: 0,
    normalCount: 0,
    stuntedCount: 0,
    severelyStuntedCount: 0,
    underweightCount: 0,
    severelyUnderweightCount: 0,
    wastedCount: 0,
    severelyWastedCount: 0,
    overweightCount: 0,
    obeseCount: 0,
    underweightOrStuntedCount: 0,
    overweightOrObeseCount: 0,
    unmeasuredCount: 0,
    normalPercent: 0,
    underweightPercent: 0,
    overweightPercent: 0,
  },
  domainProgress = [],
  tuitionLedger = {
    totalExpected: 0,
    totalCollected: 0,
    totalOutstanding: 0,
    collectionRate: 0,
    periodLabel: "Tháng hiện tại",
  },
  onNavigate,
}) => {
  return (
    <div className="space-y-6">
      {/* KHỐI 1: CHUYÊN CẦN THEO LỚP & SỨC KHỎE DINH DƯỠNG WHO */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ClassAttendanceChart
          classAttendance={classAttendance}
          onNavigate={onNavigate}
        />
        <WhoNutritionChart
          whoNutrition={whoNutrition}
          onNavigate={onNavigate}
        />
      </div>

      {/* KHỐI 2: DÒNG TIỀN HỌC PHÍ & 5 LĨNH VỰC PHÁT TRIỂN MẦM NON */}
      <TuitionAndDomainProgressCharts
        tuitionLedger={tuitionLedger}
        domainProgress={domainProgress}
        onNavigate={onNavigate}
      />

      {/* KHỐI 3: CƠ CẤU LỨA TUỔI HỌC SINH MẦM NON */}
      <AgeDistributionChart ageData={ageData} />
    </div>
  );
};
