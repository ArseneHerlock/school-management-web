"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ShieldAlert,
  Clock,
  RefreshCw,
  Printer,
  Info,
  Search,
} from "lucide-react";
import {
  MedicationItem,
  SpecialConditionItem,
  fetchMedications,
  fetchSpecialConditions,
} from "@/services/medications";
import MedicalKpiCards from "./components/MedicalKpiCards";
import ConditionsTable from "./components/ConditionsTable";
import MedicationsTable from "./components/MedicationsTable";

export default function YTeDacBietPage() {
  const [activeTab, setActiveTab] = useState<"CONDITIONS" | "MEDICATIONS">(
    "CONDITIONS"
  );
  const [conditions, setConditions] = useState<SpecialConditionItem[]>([]);
  const [medications, setMedications] = useState<MedicationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");

  const loadData = async () => {
    setLoading(true);
    try {
      const todayStr = new Date().toISOString().slice(0, 10);
      const [conds, meds] = await Promise.all([
        fetchSpecialConditions().catch(() => []),
        fetchMedications({ date: todayStr, allDates: false }).catch(() => []),
      ]);
      setConditions(conds);
      setMedications(meds);
    } catch (err) {
      console.error("Error loading admin medical oversight data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const filteredConditions = useMemo(() => {
    return conditions.filter((c) => {
      const matchesSearch =
        !searchQuery.trim() ||
        (c.TenHocSinh &&
          c.TenHocSinh.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.TenBenh &&
          c.TenBenh.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.TenLop &&
          c.TenLop.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = filterType === "ALL" || c.LoaiBenh === filterType;
      return matchesSearch && matchesType;
    });
  }, [conditions, searchQuery, filterType]);

  const filteredMedications = useMemo(() => {
    return medications.filter((m) => {
      return (
        !searchQuery.trim() ||
        (m.TenHocSinh &&
          m.TenHocSinh.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.TenThuoc &&
          m.TenThuoc.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.TenLop &&
          m.TenLop.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  }, [medications, searchQuery]);

  const totalConditions = conditions.length;
  const criticalCount = conditions.filter((c) => c.MucDoNguyHiem === 3).length;
  const allergyCount = conditions.filter((c) => c.LoaiBenh === "DI_UNG").length;
  const totalMedsToday = medications.length;
  const givenMedsToday = medications.filter(
    (m) => m.TrangThai === "DA_CHO_UONG"
  ).length;

  const handlePrintKitchenList = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-sans">
      <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-600">
            QUẢN TRỊ Y TẾ & TRƯỜNG HỢP ĐẶC BIỆT
          </span>
          <h1 className="text-2xl font-black text-slate-800">
            Giám Sát Y Tế, Bệnh Nền & Dặn Thuốc Toàn Trường
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Theo dõi danh mục trẻ có bệnh lý đặc biệt từ khâu tuyển sinh và giám sát tiến độ cho trẻ uống thuốc của giáo viên các lớp.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => void loadData()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>Làm mới</span>
          </button>

          <button
            onClick={handlePrintKitchenList}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 px-3.5 py-2 text-xs font-bold text-white transition shadow-sm cursor-pointer"
          >
            <Printer size={14} />
            <span>In danh sách Bếp ăn & Y tế</span>
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

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-slate-600">
        <Info size={16} className="text-slate-400 shrink-0 mt-0.5" />
        <div>
          <strong>Chế độ giám sát (Read-Only):</strong> Ban Giám Hiệu chỉ giám sát số liệu và xem phác đồ cấp cứu của học sinh toàn trường. Các tác vụ tạo đơn thuốc do Phụ huynh thực hiện, tác vụ cho uống do Giáo viên chủ nhiệm trực tiếp xác nhận.
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab("CONDITIONS")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "CONDITIONS"
                ? "bg-rose-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <ShieldAlert size={14} />
            <span>Sổ bộ bệnh nền & Dị ứng ({conditions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("MEDICATIONS")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "MEDICATIONS"
                ? "bg-slate-800 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Clock size={14} />
            <span>Giám sát uống thuốc hôm nay ({medications.length})</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeTab === "CONDITIONS" && (
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-1.5 text-xs font-semibold focus:border-rose-500 focus:bg-white focus:outline-none"
            >
              <option value="ALL">Tất cả nhóm bệnh</option>
              <option value="TIM_MACH">Tim mạch bẩm sinh</option>
              <option value="DI_UNG">Dị ứng thực phẩm</option>
              <option value="THAN_KINH_CO_GIAT">Thần kinh / Co giật</option>
              <option value="HEN_SUYEN">Hen suyễn</option>
              <option value="KHAC">Khác</option>
            </select>
          )}

          <div className="relative w-full sm:w-56">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Tìm bé, lớp, bệnh..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-8.5 pr-3 py-1.5 text-xs font-semibold focus:border-rose-500 focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {activeTab === "CONDITIONS" ? (
          <ConditionsTable conditions={filteredConditions} />
        ) : (
          <MedicationsTable medications={filteredMedications} />
        )}
      </div>
    </div>
  );
}
