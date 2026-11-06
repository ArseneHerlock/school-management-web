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
  const [activeTab, setActiveTab] = useState<"CONDITIONS" | "MEDICATIONS">(
    "CONDITIONS"
  );
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
    } catch (err) {
      console.error("Error loading admin medical oversight data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  // Tổng hợp danh sách tất cả các lớp học từ API và dữ liệu thực tế
  const sortedClasses = useMemo(() => {
    const classMap = new Map<string, string>();

    // 1. Từ danh sách lớp học toàn trường
    classesList.forEach((c) => {
      if (c.tenLop) {
        classMap.set(c.tenLop.trim(), c.id);
      }
    });

    // 2. Bổ sung các lớp có trong hồ sơ bệnh nền & dặn thuốc (nếu có)
    conditions.forEach((c) => {
      if (c.TenLop && !classMap.has(c.TenLop.trim())) {
        classMap.set(c.TenLop.trim(), c.LopId || c.TenLop.trim());
      }
    });
    medications.forEach((m) => {
      if (m.TenLop && !classMap.has(m.TenLop.trim())) {
        classMap.set(m.TenLop.trim(), m.LopId || m.TenLop.trim());
      }
    });

    return Array.from(classMap.entries())
      .map(([tenLop, id]) => ({ id, tenLop }))
      .sort((a, b) => a.tenLop.localeCompare(b.tenLop, "vi"));
  }, [classesList, conditions, medications]);

  // Lọc danh sách bệnh lý theo LỚP và TỪ KHÓA TÌM KIẾM
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

      const matchesClass =
        classFilter === "ALL" ||
        c.LopId === classFilter ||
        (c.TenLop && c.TenLop.trim().toLowerCase() === classFilter.trim().toLowerCase());

      return matchesSearch && matchesClass;
    });
  }, [conditions, searchQuery, classFilter]);

  // Lọc danh sách uống thuốc theo LỚP và TỪ KHÓA TÌM KIẾM
  const filteredMedications = useMemo(() => {
    return medications.filter((m) => {
      const matchesSearch =
        !searchQuery.trim() ||
        (m.TenHocSinh &&
          m.TenHocSinh.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.TenThuoc &&
          m.TenThuoc.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.TenLop &&
          m.TenLop.toLowerCase().includes(searchQuery.toLowerCase()));

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

      {/* Thanh điều hướng Tab & Bộ lọc theo LỚP */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        {/* Chuyển đổi giữa 2 Tab */}
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
            <span>
              Sổ bộ bệnh nền & Dị ứng ({classFilter === "ALL" ? conditions.length : filteredConditions.length})
            </span>
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
            <span>
              Giám sát uống thuốc hôm nay ({classFilter === "ALL" ? medications.length : filteredMedications.length})
            </span>
          </button>
        </div>

        {/* BỘ LỌC THEO LỚP & TÌM KIẾM */}
        <div className="flex flex-wrap items-center gap-2">
          {/* LỌC THEO LỚP HỌC */}
          <div className="flex items-center gap-1.5">
            <School size={15} className="text-slate-400 shrink-0 hidden sm:inline" />
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2 text-xs font-bold text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none cursor-pointer shadow-2xs"
            >
              <option value="ALL">Tất cả lớp học ({sortedClasses.length} lớp)</option>
              {sortedClasses.map((c) => (
                <option key={c.id || c.tenLop} value={c.tenLop}>
                  {c.tenLop}
                </option>
              ))}
            </select>
          </div>

          {/* Ô TÌM KIẾM BÉ / LỚP / BỆNH */}
          <div className="relative w-full sm:w-60">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Tìm bé, lớp, bệnh lý..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-8.5 pr-3 py-2 text-xs font-semibold focus:border-rose-500 focus:bg-white focus:outline-none shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Banner thông báo khi đang lọc theo lớp */}
      {classFilter !== "ALL" && (
        <div className="flex items-center justify-between rounded-2xl bg-rose-50 border border-rose-200 px-4 py-2 text-xs text-rose-900 shadow-2xs">
          <span className="font-bold flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-rose-600 animate-pulse" />
            Đang hiển thị danh sách theo:{" "}
            <strong className="text-rose-950 font-black text-sm">{classFilter}</strong>{" "}
            ({activeTab === "CONDITIONS" ? filteredConditions.length : filteredMedications.length} hồ sơ)
          </span>
          <button
            type="button"
            onClick={() => setClassFilter("ALL")}
            className="text-xs font-bold text-rose-700 hover:text-rose-950 bg-white border border-rose-200 px-2.5 py-1 rounded-xl shadow-2xs hover:bg-rose-50 transition cursor-pointer flex items-center gap-1"
          >
            <X size={12} />
            Bỏ lọc lớp
          </button>
        </div>
      )}

      {/* Bảng dữ liệu tương ứng Tab đang chọn */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {activeTab === "CONDITIONS" ? (
          <ConditionsTable
            conditions={filteredConditions}
            hasFilter={classFilter !== "ALL" || Boolean(searchQuery.trim())}
            onResetFilter={() => {
              setClassFilter("ALL");
              setSearchQuery("");
            }}
          />
        ) : (
          <MedicationsTable
            medications={filteredMedications}
            hasFilter={classFilter !== "ALL" || Boolean(searchQuery.trim())}
            onResetFilter={() => {
              setClassFilter("ALL");
              setSearchQuery("");
            }}
          />
        )}
      </div>
    </div>
  );
}
