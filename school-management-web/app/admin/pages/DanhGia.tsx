"use client";

import { useEffect, useMemo, useState } from "react";
import { Sparkles, RefreshCw, Plus, Layers, LayoutGrid } from "lucide-react";
import { currentUser, getStudents, getClasses } from "@/services";
import {
  getActivities,
  setActivityActive,
  unlinkActivityCriterion,
  getDomains,
  getCriteria,
  getAssessments,
  deleteAssessment,
  createAssessment,
  updateAssessment,
  ActivityItem,
  DomainItem,
  CriterionItem,
  AssessmentItem,
} from "@/lib/development";
import TabsNav, { TabItem } from "@/app/components/ui/TabsNav";
import { TabType, AdminMatrixDetail } from "./danh-gia/types";
import DanhGiaStats from "./danh-gia/DanhGiaStats";
import DanhGiaFilter from "./danh-gia/DanhGiaFilter";
import DanhGiaMatrix from "./danh-gia/DanhGiaMatrix";
import DanhGiaHistory from "./danh-gia/DanhGiaHistory";
import ActivitiesTab from "./danh-gia/ActivitiesTab";
import CriteriaTab from "./danh-gia/CriteriaTab";
import DanhGiaModalManager from "./danh-gia/DanhGiaModalManager";

export default function DanhGia() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [domains, setDomains] = useState<DomainItem[]>([]);
  const [criteria, setCriteria] = useState<CriterionItem[]>([]);
  const [assessments, setAssessments] = useState<AssessmentItem[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);

  const [filterClass, setFilterClass] = useState("");
  const [filterActivity, setFilterActivity] = useState("");
  const [filterCriterion, setFilterCriterion] = useState("");
  const [filterResult, setFilterResult] = useState<"all" | "pass" | "fail">(
    "all",
  );
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modals state
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ActivityItem | null>(
    null,
  );
  const [activityForm, setActivityForm] = useState({
    code: "",
    name: "",
    description: "",
    instructions: "",
    minAgeMonths: 36,
    maxAgeMonths: 72,
    isActive: true,
  });

  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkingActivity, setLinkingActivity] = useState<ActivityItem | null>(
    null,
  );
  const [selectedCriterionIdToLink, setSelectedCriterionIdToLink] =
    useState("");
  const [observationGuide, setObservationGuide] = useState("");

  const [domainModalOpen, setDomainModalOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState<DomainItem | null>(null);
  const [domainForm, setDomainForm] = useState({
    code: "",
    name: "",
    description: "",
    isActive: true,
  });

  const [criterionModalOpen, setCriterionModalOpen] = useState(false);
  const [editingCriterion, setEditingCriterion] =
    useState<CriterionItem | null>(null);
  const [criterionForm, setCriterionForm] = useState({
    developmentDomainId: "",
    code: "",
    name: "",
    description: "",
    isActive: true,
  });

  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    type: string;
    id: string;
    title: string;
  }>({ open: false, type: "activity", id: "", title: "" });

  // Matrix state
  const [adminMatrixClassId, setAdminMatrixClassId] = useState("");
  const [adminMatrixActivityId, setAdminMatrixActivityId] = useState("");
  const [adminMatrixData, setAdminMatrixData] = useState<
    Record<string, Record<string, any>>
  >({});
  const [adminMatrixDetailModal, setAdminMatrixDetailModal] =
    useState<AdminMatrixDetail>({
      open: false,
      studentId: "",
      criterionId: "",
      studentName: "",
      criterionName: "",
      comment: "",
      evidence: "",
    });

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [actRes, domRes, criRes, assRes, stuRes, clsRes] =
        await Promise.all([
          getActivities({ page: 1, pageSize: 100 }),
          getDomains(),
          getCriteria({ page: 1, pageSize: 100 }),
          getAssessments({ page: 1, pageSize: 500 }),
          getStudents().catch(() => []),
          getClasses().catch(() => []),
        ]);
      setActivities(actRes?.items || []);
      setDomains(domRes?.items || []);
      setCriteria(criRes?.items || []);
      setAssessments(assRes?.items || []);
      setStudents(Array.isArray(stuRes) ? stuRes : []);
      const clsList = Array.isArray(clsRes) ? clsRes : [];
      setClasses(clsList);
      if (clsList.length > 0 && !adminMatrixClassId)
        setAdminMatrixClassId(clsList[0].id);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAllData();
  }, []);

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
  }, [
    adminMatrixClassId,
    adminMatrixStudents.length,
    adminActiveCriteria.length,
    assessments.length,
  ]);

  const stats = useMemo(() => {
    const assessedStudentIds = new Set(assessments.map((a) => a.childId));
    const assessedCount = students.filter((s) =>
      assessedStudentIds.has(s.id),
    ).length;
    const passCount = assessments.filter((a) => a.result === true).length;
    const failCount = assessments.filter((a) => a.result === false).length;
    const totalStudents = students.length;
    return {
      totalStudents,
      completionRate:
        totalStudents > 0
          ? Math.round((assessedCount / totalStudents) * 100)
          : 0,
      assessedCount,
      unassessedCount: Math.max(0, totalStudents - assessedCount),
      totalAssessments: assessments.length,
      passCount,
      failCount,
      totalCriteria: criteria.length,
      totalActivities: activities.length,
      totalDomains: domains.length,
    };
  }, [students, assessments, criteria, activities, domains]);

  const classChartData = useMemo(
    () =>
      classes.map((c) => {
        const clsStu = students
          .filter((s) => s.lopId === c.id)
          .map((s) => s.id);
        const clsAss = assessments.filter((a) => clsStu.includes(a.childId));
        return {
          name: c.tenLop,
          pass: clsAss.filter((a) => a.result).length,
          fail: clsAss.filter((a) => !a.result).length,
        };
      }),
    [classes, students, assessments],
  );

  const domainChartData = useMemo(
    () =>
      domains.map((d) => {
        const dCritIds = criteria
          .filter((c) => c.developmentDomainId === d.id)
          .map((c) => c.id);
        const dAss = assessments.filter((a) =>
          dCritIds.includes(a.developmentCriterionId),
        );
        return {
          name: d.name,
          pass: dAss.filter((a) => a.result).length,
          fail: dAss.filter((a) => !a.result).length,
        };
      }),
    [domains, criteria, assessments],
  );

  const filteredAssessments = useMemo(
    () =>
      assessments.filter((a) => {
        if (filterClass) {
          const st = students.find((s) => s.id === a.childId);
          if (st?.lopId !== filterClass) return false;
        }
        if (filterActivity && a.activityId !== filterActivity) return false;
        if (filterCriterion && a.developmentCriterionId !== filterCriterion)
          return false;
        if (filterResult === "pass" && !a.result) return false;
        if (filterResult === "fail" && a.result) return false;
        if (searchKeyword) {
          const q = searchKeyword.toLowerCase();
          const stName =
            students.find((s) => s.id === a.childId)?.tenHocSinh || "";
          if (
            !stName.toLowerCase().includes(q) &&
            !(a.comment || "").toLowerCase().includes(q)
          )
            return false;
        }
        return true;
      }),
    [
      assessments,
      filterClass,
      filterActivity,
      filterCriterion,
      filterResult,
      searchKeyword,
      students,
    ],
  );

  const paginatedAssessments = useMemo(() => {
    const start = (currentPage - 1) * 10;
    return filteredAssessments.slice(start, start + 10);
  }, [filteredAssessments, currentPage]);

  const tabs: TabItem<TabType>[] = [
    { id: "dashboard", label: "Tổng quan trường & Lớp", icon: LayoutGrid },
    {
      id: "activities",
      label: "Hoạt động phát triển",
      icon: Sparkles,
      badge: activities.length,
    },
    {
      id: "criteria",
      label: "Tiêu chí & Lĩnh vực",
      icon: Layers,
      badge: criteria.length,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
            Phân hệ Quản trị / Giám sát đánh giá trẻ
          </span>
          <h1 className="text-2xl font-black text-slate-800">
            Báo cáo & Theo dõi sự phát triển của trẻ
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => void loadAllData()}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-rose-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-rose-50 transition"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />{" "}
            Làm mới
          </button>
          {activeTab === "activities" && (
            <button
              onClick={() => {
                setEditingActivity(null);
                setActivityForm({
                  code: "",
                  name: "",
                  description: "",
                  instructions: "",
                  minAgeMonths: 36,
                  maxAgeMonths: 72,
                  isActive: true,
                });
                setActivityModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-rose-500/20 hover:from-rose-600 hover:to-rose-700 transition"
            >
              <Plus size={15} /> Thêm Hoạt động
            </button>
          )}
        </div>
      </div>

      <TabsNav tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      {notice && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-bold text-emerald-800 flex justify-between">
          {notice} <button onClick={() => setNotice("")}>×</button>
        </div>
      )}

      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <DanhGiaStats
            stats={stats}
            classesCount={classes.length}
            classChartData={classChartData}
            domainChartData={domainChartData}
          />
          <DanhGiaMatrix
            classes={classes}
            activities={activities}
            adminMatrixClassId={adminMatrixClassId}
            setAdminMatrixClassId={setAdminMatrixClassId}
            adminMatrixActivityId={adminMatrixActivityId}
            setAdminMatrixActivityId={setAdminMatrixActivityId}
            adminMatrixStudents={adminMatrixStudents}
            adminActiveCriteria={adminActiveCriteria}
            adminMatrixData={adminMatrixData}
            onOpenDetailModal={(c) =>
              setAdminMatrixDetailModal({ ...c, open: true })
            }
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
            getStudentName={(id) =>
              students.find((s) => s.id === id)?.tenHocSinh || id
            }
            getClassName={(id) =>
              classes.find((c) => c.id === id)?.tenLop || "-"
            }
            getCriterionName={(id) =>
              criteria.find((c) => c.id === id)?.name || id
            }
            getCriterionCode={(id) =>
              criteria.find((c) => c.id === id)?.code || ""
            }
            getActivityName={(id) =>
              activities.find((a) => a.id === id)?.name || "Chung"
            }
            onDeleteClick={(a) =>
              setConfirmDelete({
                open: true,
                type: "assessment",
                id: a.id,
                title: "lượt đánh giá này",
              })
            }
          />
        </div>
      )}

      {activeTab === "activities" && (
        <ActivitiesTab
          activities={activities}
          getCriterionName={(id) =>
            criteria.find((c) => c.id === id)?.name || id
          }
          onToggleStatus={async (act) => {
            await setActivityActive(act.id, !act.isActive);
            await loadAllData();
          }}
          onOpenEdit={(act) => {
            setEditingActivity(act);
            setActivityForm({
              code: act.code,
              name: act.name,
              description: act.description || "",
              instructions: act.instructions || "",
              minAgeMonths: act.minAgeMonths ?? 36,
              maxAgeMonths: act.maxAgeMonths ?? 72,
              isActive: act.isActive,
            });
            setActivityModalOpen(true);
          }}
          onOpenLinkModal={(act) => {
            setLinkingActivity(act);
            setSelectedCriterionIdToLink("");
            setObservationGuide("");
            setLinkModalOpen(true);
          }}
          onUnlinkCriterion={async (aId, cId) => {
            await unlinkActivityCriterion(aId, cId);
            await loadAllData();
          }}
          onDeleteClick={(act) =>
            setConfirmDelete({
              open: true,
              type: "activity",
              id: act.id,
              title: `hoạt động "${act.name}"`,
            })
          }
        />
      )}

      {activeTab === "criteria" && (
        <CriteriaTab
          domains={domains}
          criteria={criteria}
          onOpenCreateDomain={() => {
            setEditingDomain(null);
            setDomainForm({
              code: "",
              name: "",
              description: "",
              isActive: true,
            });
            setDomainModalOpen(true);
          }}
          onOpenEditDomain={(d) => {
            setEditingDomain(d);
            setDomainForm({
              code: d.code,
              name: d.name,
              description: d.description || "",
              isActive: d.isActive,
            });
            setDomainModalOpen(true);
          }}
          onDeleteDomain={(d) =>
            setConfirmDelete({
              open: true,
              type: "domain",
              id: d.id,
              title: `lĩnh vực "${d.name}"`,
            })
          }
          onOpenCreateCriterion={() => {
            setEditingCriterion(null);
            setCriterionForm({
              developmentDomainId: domains[0]?.id || "",
              code: "",
              name: "",
              description: "",
              isActive: true,
            });
            setCriterionModalOpen(true);
          }}
          onOpenEditCriterion={(c) => {
            setEditingCriterion(c);
            setCriterionForm({
              developmentDomainId: c.developmentDomainId,
              code: c.code,
              name: c.name,
              description: c.description || "",
              isActive: c.isActive,
            });
            setCriterionModalOpen(true);
          }}
          onDeleteCriterion={(c) =>
            setConfirmDelete({
              open: true,
              type: "criterion",
              id: c.id,
              title: `tiêu chí "${c.name}"`,
            })
          }
        />
      )}

      <DanhGiaModalManager
        activityModalOpen={activityModalOpen}
        setActivityModalOpen={setActivityModalOpen}
        editingActivity={editingActivity}
        activityForm={activityForm}
        setActivityForm={setActivityForm}
        linkModalOpen={linkModalOpen}
        setLinkModalOpen={setLinkModalOpen}
        linkingActivity={linkingActivity}
        criteria={criteria}
        selectedCriterionIdToLink={selectedCriterionIdToLink}
        setSelectedCriterionIdToLink={setSelectedCriterionIdToLink}
        observationGuide={observationGuide}
        setObservationGuide={setObservationGuide}
        domainModalOpen={domainModalOpen}
        setDomainModalOpen={setDomainModalOpen}
        editingDomain={editingDomain}
        domainForm={domainForm}
        setDomainForm={setDomainForm}
        domains={domains}
        criterionModalOpen={criterionModalOpen}
        setCriterionModalOpen={setCriterionModalOpen}
        editingCriterion={editingCriterion}
        criterionForm={criterionForm}
        setCriterionForm={setCriterionForm}
        adminMatrixDetailModal={adminMatrixDetailModal}
        setAdminMatrixDetailModal={setAdminMatrixDetailModal}
        confirmDelete={confirmDelete}
        setConfirmDelete={setConfirmDelete}
        onRefresh={loadAllData}
      />
    </div>
  );
}
