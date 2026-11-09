"use client";

import { useEffect, useState, useMemo } from "react";
import { Flower2, RefreshCw, Calendar } from "lucide-react";
import { getGoodChildRecords, getStudents, getClasses } from "@/services";
import { GoodChildEnrichedRow, ClassChartItem, DistributionItem } from "./types";
import GoodChildStats from "./components/GoodChildStats";
import GoodChildCharts from "./components/GoodChildCharts";
import GoodChildTable from "./components/GoodChildTable";

const list = (x: any) =>
  Array.isArray(x) ? x : Array.isArray(x?.items) ? x.items : [];

export default function GoodChildPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedClass, setSelectedClass] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [busy, setBusy] = useState(true);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setBusy(true);
    setMsg("");
    try {
      const [r, s, c] = await Promise.all([
        getGoodChildRecords({ month, year, pageSize: 500 }),
        getStudents(),
        getClasses().catch(() => []),
      ]);
      setRows(list(r));
      setStudents(list(s));
      setClasses(list(c));
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Không tải được sổ bé ngoan");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    void load();
  }, [month, year]);

  const studentMap = useMemo(() => {
    const map = new Map<string, any>();
    students.forEach((s) => {
      const id = String(s.id || s.Id);
      map.set(id, s);
    });
    return map;
  }, [students]);

  const classMap = useMemo(() => {
    const map = new Map<string, string>();
    classes.forEach((c) => {
      const id = String(c.id || c.Id);
      map.set(id, c.tenLop || c.TenLop || id);
    });
    return map;
  }, [classes]);

  const enrichedRows = useMemo<GoodChildEnrichedRow[]>(() => {
    return rows.map((r) => {
      const s = studentMap.get(String(r.childId || r.ChildId));
      const className =
        s?.tenLop ||
        s?.TenLop ||
        classMap.get(String(s?.lopId || s?.LopId)) ||
        "Lớp chưa rõ";
      const studentName = s?.tenHocSinh || s?.TenHocSinh || "Học sinh";
      const dailyCount = Number(r.dailyFlowerCount || r.DailyFlowerCount || 0);
      const bonusCount = Number(r.bonusFlowerCount || r.BonusFlowerCount || 0);
      const hasComment = Boolean(
        r.teacherComment && String(r.teacherComment).trim().length > 0
      );
      const hasFeedback = Boolean(
        r.parentFeedback && String(r.parentFeedback).trim().length > 0
      );

      return {
        ...r,
        studentName,
        className,
        dailyCount,
        bonusCount,
        hasComment,
        hasFeedback,
      };
    });
  }, [rows, studentMap, classMap]);

  const totalRecords = enrichedRows.length;
  const totalDailyFlowers = enrichedRows.reduce((acc, r) => acc + r.dailyCount, 0);
  const totalBonusStars = enrichedRows.reduce((acc, r) => acc + r.bonusCount, 0);
  const fourFlowersCount = enrichedRows.filter((r) => r.dailyCount >= 4).length;
  const completionRate =
    totalRecords > 0 ? Math.round((fourFlowersCount / totalRecords) * 100) : 0;

  const classChartData = useMemo<ClassChartItem[]>(() => {
    const agg: Record<string, ClassChartItem> = {};
    enrichedRows.forEach((r) => {
      const c = r.className;
      if (!agg[c]) {
        agg[c] = { name: c, daily: 0, bonus: 0, count: 0 };
      }
      agg[c].daily += r.dailyCount;
      agg[c].bonus += r.bonusCount;
      agg[c].count += 1;
    });
    return Object.values(agg).sort((a, b) => b.daily - a.daily);
  }, [enrichedRows]);

  const distributionPieData = useMemo<DistributionItem[]>(() => {
    const dist = [0, 0, 0, 0, 0];
    enrichedRows.forEach((r) => {
      const idx = Math.min(4, Math.max(0, r.dailyCount));
      dist[idx]++;
    });
    return [
      { name: "0 hoa nhỏ", value: dist[0], color: "#94a3b8" },
      { name: "1 hoa nhỏ", value: dist[1], color: "#60a5fa" },
      { name: "2 hoa nhỏ", value: dist[2], color: "#818cf8" },
      { name: "3 hoa nhỏ", value: dist[3], color: "#fbbf24" },
      { name: "Đạt 4/4 hoa (Bé Ngoan Tháng)", value: dist[4], color: "#f43f5e" },
    ].filter((x) => x.value > 0);
  }, [enrichedRows]);

  const filteredRows = useMemo(() => {
    return enrichedRows.filter((r) => {
      const matchClass = selectedClass === "ALL" || r.className === selectedClass;
      const matchSearch =
        !searchQuery.trim() ||
        r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.className.toLowerCase().includes(searchQuery.toLowerCase());
      return matchClass && matchSearch;
    });
  }, [enrichedRows, selectedClass, searchQuery]);

  return (
    <section className="space-y-6 pb-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            Theo dõi bé ngoan
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
            <Calendar size={15} className="text-slate-400" />
            <span className="text-xs font-bold text-slate-600">Tháng:</span>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="bg-transparent text-xs font-black text-slate-800 outline-none"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  Tháng {m}
                </option>
              ))}
            </select>
            <span className="text-xs font-bold text-slate-400">/</span>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="bg-transparent text-xs font-black text-slate-800 outline-none"
            >
              {[2024, 2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => void load()}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            <RefreshCw size={14} className={busy ? "animate-spin text-emerald-500" : ""} />
            Làm mới
          </button>
        </div>
      </header>

      {msg && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-bold text-amber-800">
          {msg}
        </div>
      )}

      <GoodChildStats
        totalRecords={totalRecords}
        totalDailyFlowers={totalDailyFlowers}
        totalBonusStars={totalBonusStars}
        completionRate={completionRate}
        fourFlowersCount={fourFlowersCount}
      />

      <GoodChildCharts
        classChartData={classChartData}
        distributionPieData={distributionPieData}
      />

      <GoodChildTable
        filteredRows={filteredRows}
        classChartData={classChartData}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </section>
  );
}
