"use client";

import { useEffect, useMemo, useState } from "react";
import { TabType } from "./types";
import {
  calculateDanhGiaStats,
  buildClassChartData,
  buildDomainChartData,
  filterAssessmentsList,
} from "./danhGiaStatsUtils";
import { useDanhGiaModals } from "./useDanhGiaModals";
import { useDanhGiaData } from "./useDanhGiaData";
import DanhGiaHeader from "./components/DanhGiaHeader";
import DashboardTab from "./components/DashboardTab";
import ActivitiesTabSection from "./components/ActivitiesTabSection";
import CriteriaTabSection from "./components/CriteriaTabSection";
import DanhGiaModalManager from "./components/DanhGiaModalManager";

export default function DanhGiaPage() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [notice, setNotice] = useState("");

  const {
    loading,
    activities,
    domains,
    criteria,
    assessments,
    students,
    classes,
    adminMatrixClassId,
    setAdminMatrixClassId,
    loadAllData,
  } = useDanhGiaData();

  const [filterClass, setFilterClass] = useState("");
  const [filterActivity, setFilterActivity] = useState("");
  const [filterCriterion, setFilterCriterion] = useState("");
  const [filterResult, setFilterResult] = useState<"all" | "pass" | "fail">("all");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [adminMatrixActivityId, setAdminMatrixActivityId] = useState("");
  const [adminMatrixData, setAdminMatrixData] = useState<
    Record<string, Record<string, any>>
  >({});

  const modalState = useDanhGiaModals();

  const adminMatrixStudents = useMemo(() => {
    const curClassId = adminMatrixClassId || classes[0]?.id;
    return curClassId ? students.filter((s) => s.lopId === curClassId) : [];
  }, [students, adminMatrixClassId, classes]);

  const adminActiveCriteria = useMemo(() => {
    if (adminMatrixActivityId) {
      const act = activities.find((a) => a.id === adminMatrixActivityId);
      if (act?.developmentCriteria?.length) {
        const ids = new Set(
          act.developmentCriteria.map((dc) => dc.developmentCriterionId),
        );
        const filtered = criteria.filter((c) => ids.has(c.id));
        return filtered.length > 0 ? filtered : criteria.slice(0, 8);
      }
    }
    return criteria.slice(0, 8);
  }, [criteria, activities, adminMatrixActivityId]);

  useEffect(() => {
    if (adminMatrixStudents.length === 0 || adminActiveCriteria.length === 0)
      return;
    const matrix: Record<string, Record<string, any>> = {};
    adminMatrixStudents.forEach((st) => {
      matrix[st.id] = {};
      adminActiveCriteria.forEach((cr) => {
        const found = assessments.find(
          (a) => a.childId === st.id && a.developmentCriterionId === cr.id,
        );
        matrix[st.id][cr.id] = found
          ? {
              result: found.result,
              existingId: found.id,
              comment: found.comment || "",
              evidence: found.evidence || "",
              isDirty: false,
            }
          : { result: null, isDirty: false };
      });
    });
    setAdminMatrixData(matrix);
  }, [adminMatrixClassId, adminMatrixStudents.length, adminActiveCriteria.length, assessments.length]);

  const stats = useMemo(
    () => calculateDanhGiaStats(students, assessments, criteria, activities, domains),
    [students, assessments, criteria, activities, domains],
  );

  const classChartData = useMemo(
    () => buildClassChartData(classes, students, assessments),
    [classes, students, assessments],
  );

  const domainChartData = useMemo(
    () => buildDomainChartData(domains, criteria, assessments),
    [domains, criteria, assessments],
  );

  const filteredAssessments = useMemo(
    () =>
      filterAssessmentsList(
        assessments,
        students,
        filterClass,
        filterActivity,
        filterCriterion,
        filterResult,
        searchKeyword,
      ),
    [assessments, filterClass, filterActivity, filterCriterion, filterResult, searchKeyword, students],
  );

  const paginatedAssessments = useMemo(() => {
    const start = (currentPage - 1) * 10;
    return filteredAssessments.slice(start, start + 10);
  }, [filteredAssessments, currentPage]);

  return (
    <div className="space-y-6">
      <DanhGiaHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        loading={loading}
        onRefresh={() => void loadAllData()}
        activitiesCount={activities.length}
        criteriaCount={criteria.length}
        notice={notice}
        onClearNotice={() => setNotice("")}
        onOpenCreateActivity={() => {
          modalState.setEditingActivity(null);
          modalState.setActivityForm({
            code: "",
            name: "",
            description: "",
            instructions: "",
            minAgeMonths: 36,
            maxAgeMonths: 72,
            isActive: true,
          });
          modalState.setActivityModalOpen(true);
        }}
      />

      {activeTab === "dashboard" && (
        <DashboardTab
          stats={stats}
          classes={classes}
          classChartData={classChartData}
          domainChartData={domainChartData}
          activities={activities}
          criteria={criteria}
          students={students}
          adminMatrixClassId={adminMatrixClassId}
          setAdminMatrixClassId={setAdminMatrixClassId}
          adminMatrixActivityId={adminMatrixActivityId}
          setAdminMatrixActivityId={setAdminMatrixActivityId}
          adminMatrixStudents={adminMatrixStudents}
          adminActiveCriteria={adminActiveCriteria}
          adminMatrixData={adminMatrixData}
          onOpenDetailModal={(c) =>
            modalState.setAdminMatrixDetailModal({ ...c, open: true })
          }
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
          filteredAssessments={filteredAssessments}
          paginatedAssessments={paginatedAssessments}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onDeleteAssessment={(a) =>
            modalState.setConfirmDelete({
              open: true,
              type: "assessment",
              id: a.id,
              title: "lượt đánh giá này",
            })
          }
        />
      )}

      {activeTab === "activities" && (
        <ActivitiesTabSection
          activities={activities}
          criteria={criteria}
          loadAllData={loadAllData}
          modalState={modalState}
        />
      )}

      {activeTab === "criteria" && (
        <CriteriaTabSection
          domains={domains}
          criteria={criteria}
          modalState={modalState}
        />
      )}

      <DanhGiaModalManager
        activityModalOpen={modalState.activityModalOpen}
        setActivityModalOpen={modalState.setActivityModalOpen}
        editingActivity={modalState.editingActivity}
        activityForm={modalState.activityForm}
        setActivityForm={modalState.setActivityForm}
        linkModalOpen={modalState.linkModalOpen}
        setLinkModalOpen={modalState.setLinkModalOpen}
        linkingActivity={modalState.linkingActivity}
        criteria={criteria}
        selectedCriterionIdToLink={modalState.selectedCriterionIdToLink}
        setSelectedCriterionIdToLink={modalState.setSelectedCriterionIdToLink}
        observationGuide={modalState.observationGuide}
        setObservationGuide={modalState.setObservationGuide}
        domainModalOpen={modalState.domainModalOpen}
        setDomainModalOpen={modalState.setDomainModalOpen}
        editingDomain={modalState.editingDomain}
        domainForm={modalState.domainForm}
        setDomainForm={modalState.setDomainForm}
        domains={domains}
        criterionModalOpen={modalState.criterionModalOpen}
        setCriterionModalOpen={modalState.setCriterionModalOpen}
        editingCriterion={modalState.editingCriterion}
        criterionForm={modalState.criterionForm}
        setCriterionForm={modalState.setCriterionForm}
        adminMatrixDetailModal={modalState.adminMatrixDetailModal}
        setAdminMatrixDetailModal={modalState.setAdminMatrixDetailModal}
        confirmDelete={modalState.confirmDelete}
        setConfirmDelete={modalState.setConfirmDelete}
        onRefresh={loadAllData}
      />
    </div>
  );
}
