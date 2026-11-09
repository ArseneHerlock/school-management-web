"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ShieldAlert,
  Clock,
  RefreshCw,
  Printer,
  Info,
  Search,
  School,
  X,
} from "lucide-react";
import {
  MedicationItem,
  SpecialConditionItem,
  fetchMedications,
  fetchSpecialConditions,
} from "@/services/medications";
import { getClasses, SchoolClass } from "@/services/classes";
import MedicalKpiCards from "./components/MedicalKpiCards";
import ConditionsTable from "./components/ConditionsTable";
import MedicationsTable from "./components/MedicationsTable";

export default function YTeDacBietPage() {
  const [activeTab, setActiveTab] = useState<"CONDITIONS" | "MEDICATIONS">("CONDITIONS");
  const [conditions, setConditions] = useState<SpecialConditionItem[]>([]);
  const [medications, setMedications] = useState<MedicationItem[]>([]);
  const [classesList, setClassesList] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState<string>("ALL");

  const loadData = async () => {
    setLoading(true);
    try {
      const todayStr = new Date().toISOString().slice(0, 10);
      const [conds, meds, classesData] = await Promise.all([
        fetchSpecialConditions().catch(() => []),
        fetchMedications({ date: todayStr, allDates: false }).catch(() => []),
        getClasses().catch(() => []),
      ]);
      setConditions(conds);
      setMedications(meds);
      setClassesList(Array.isArray(classesData) ? classesData : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const sortedClasses = useMemo(() => {
    const classMap = new Map<string, string>();
    classesList.forEach((c) => {
      if (c.tenLop) classMap.set(c.tenLop.trim(), c.id);
    });
    conditions.forEach((c) => {
      if (c.TenLop && !classMap.has(c.TenLop.trim())) classMap.set(c.TenLop.trim(), c.LopId || c.TenLop.trim());
    });
    medications.forEach((m) => {
      if (m.TenLop && !classMap.has(m.TenLop.trim())) classMap.set(m.TenLop.trim(), m.LopId || m.TenLop.trim());
    });
    return Array.from(classMap.entries())
      .map(([tenLop, id]) => ({ id, tenLop }))
      .sort((a, b) => a.tenLop.localeCompare(b.tenLop, "vi"));
  }, [classesList, conditions, medications]);

  const filteredConditions = useMemo(() => {
    return conditions.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (c.TenHocSinh && c.TenHocSinh.toLowerCase().includes(q)) ||
        (c.TenBenh && c.TenBenh.toLowerCase().includes(q)) ||
        (c.TenLop && c.TenLop.toLowerCase().includes(q));

      const matchesClass =
        classFilter === "ALL" ||
        c.LopId === classFilter ||
        (c.TenLop && c.TenLop.trim().toLowerCase() === classFilter.trim().toLowerCase());

      return matchesSearch && matchesClass;
    });
  }, [conditions, searchQuery, classFilter]);

  const filteredMedications = useMemo(() => {
    return medications.filter((m) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (m.TenHocSinh && m.TenHocSinh.toLowerCase().includes(q)) ||
        (m.TenThuoc && m.TenThuoc.toLowerCase().includes(q)) ||
        (m.TenLop && m.TenLop.toLowerCase().includes(q));

      const matchesClass =
        classFilter === "ALL" ||
        m.LopId === classFilter ||
        (m.TenLop && m.TenLop.trim().toLowerCase() === classFilter.trim().toLowerCase());

      return matchesSearch && matchesClass;
    });
  }, [medications, searchQuery, classFilter]);

  const totalConditions = conditions.length;
  const criticalCount = conditions.filter((c) => c.MucDoNguyHiem === 3).length;
  const allergyCount = conditions.filter((c) => c.LoaiBenh === "DI_UNG").length;
  const totalMedsToday = medications.length;
  const givenMedsToday = medications.filter((m) => m.TrangThai === "DA_CHO_UONG").length;

  return (
    <div className="space-y-6 font-sans">
      <header className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600">
            QUẢN TRỊ Y TẾ & TRƯỜNG HỢP ĐẶC BIỆT
          </span>
          <h1 className="text-2xl font-black text-slate-800">
            Giám Sát Y Tế, Bệnh Nền & Dặn Thuốc Toàn Trường
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Theo dõi danh mục trẻ có bệnh lý đặc biệt và giám sát tiến độ cho trẻ uống thuốc của giáo viên.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => void loadData()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 transition shadow-2xs cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>Làm mới</span>
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 px-3.5 py-2 text-xs font-bold text-white transition shadow-sm cursor-pointer"
          >
            <Printer size={14} />
            <span>In sổ theo dõi Y tế & Dị ứng</span>
          </button>
        </div>
      </header>

      <MedicalKpiCards
        totalConditions={totalConditions}
        criticalCount={criticalCount}
        allergyCount={allergyCount}
        givenMedsToday={givenMedsToday}
        totalMedsToday={totalMedsToday}
      />

      <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-slate-600">
        <Info size={16} className="text-emerald-500 shrink-0 mt-0.5" />
        <div>
          <strong>Chế độ giám sát (Read-Only):</strong> Ban Giám Hiệu giám sát số liệu và xem phác đồ cấp cứu của học sinh toàn trường.
        </div>
      </div>

      {/* Nav and filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-emerald-100 shadow-2xs">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab("CONDITIONS")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "CONDITIONS" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:bg-emerald-50"
            }`}
          >
            <ShieldAlert size={14} />
            <span>Sổ bộ bệnh nền & Dị ứng ({classFilter === "ALL" ? conditions.length : filteredConditions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("MEDICATIONS")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "MEDICATIONS" ? "bg-slate-800 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Clock size={14} />
            <span>Giám sát uống thuốc ({classFilter === "ALL" ? medications.length : filteredMedications.length})</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <School size={15} className="text-slate-400 shrink-0 hidden sm:inline" />
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="rounded-xl border border-emerald-200 bg-emerald-50/30 px-3.5 py-2 text-xs font-bold text-slate-800 focus:border-emerald-500 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Tất cả lớp học ({sortedClasses.length} lớp)</option>
              {sortedClasses.map((c) => (
                <option key={c.id || c.tenLop} value={c.tenLop}>{c.tenLop}</option>
              ))}
            </select>
          </div>

          <div className="relative w-full sm:w-60">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm bé, lớp, bệnh lý..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-emerald-200 bg-emerald-50/30 pl-8.5 pr-3 py-2 text-xs font-semibold focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {classFilter !== "ALL" && (
        <div className="flex items-center justify-between rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-2 text-xs text-emerald-900 shadow-2xs">
          <span className="font-bold flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
            Đang lọc: <strong>{classFilter}</strong> ({activeTab === "CONDITIONS" ? filteredConditions.length : filteredMedications.length} hồ sơ)
          </span>
          <button
            type="button"
            onClick={() => setClassFilter("ALL")}
            className="text-xs font-bold text-emerald-700 bg-white border border-emerald-200 px-2.5 py-1 rounded-xl cursor-pointer flex items-center gap-1"
          >
            <X size={12} /> Bỏ lọc
          </button>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-emerald-100 shadow-xs overflow-hidden">
        {activeTab === "CONDITIONS" ? (
          <ConditionsTable
            conditions={filteredConditions}
            hasFilter={classFilter !== "ALL" || Boolean(searchQuery.trim())}
            onResetFilter={() => { setClassFilter("ALL"); setSearchQuery(""); }}
          />
        ) : (
          <MedicationsTable
            medications={filteredMedications}
            hasFilter={classFilter !== "ALL" || Boolean(searchQuery.trim())}
            onResetFilter={() => { setClassFilter("ALL"); setSearchQuery(""); }}
          />
        )}
      </div>
    </div>
  );
}
