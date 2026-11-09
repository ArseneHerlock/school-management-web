"use client";

import { useEffect, useState, useMemo } from "react";
import {
  ChildFCM,
  ClassBreakdown,
  CLUSTER_CONFIG,
} from "./types";
import { FcmHeader } from "./components/FcmHeader";
import { FcmKpis } from "./components/FcmKpis";
import { FcmVisualCharts } from "./components/FcmVisualCharts";
import { FcmClassOversightTable } from "./components/FcmClassOversightTable";
import { FcmChildrenTable } from "./components/FcmChildrenTable";
import { FcmChildDetailModal } from "./components/FcmChildDetailModal";

export default function FCMOverviewPage() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [schoolStats, setSchoolStats] = useState<any[]>([]);
  const [classBreakdown, setClassBreakdown] = useState<ClassBreakdown[]>([]);
  const [trendStats, setTrendStats] = useState<any[]>([]);
  const [children, setChildren] = useState<ChildFCM[]>([]);

  // Filter states
  const [selectedClass, setSelectedClass] = useState("ALL");
  const [selectedCluster, setSelectedCluster] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChild, setSelectedChild] = useState<ChildFCM | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/fcm?month=${month}&year=${year}`);
      if (!res.ok) throw new Error("Không thể tải dữ liệu phân cụm FCM");
      const data = await res.json();
      setSchoolStats(data.schoolStats || []);
      setClassBreakdown(data.classBreakdown || []);
      setTrendStats(data.trendStats || []);
      setChildren(data.children || []);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [month, year]);

  const totalEvaluated = useMemo(() => {
    return schoolStats.reduce((sum, item) => sum + Number(item.Count || 0), 0);
  }, [schoolStats]);

  const clusterCounts = useMemo(() => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
    schoolStats.forEach((item) => {
      const cid = Number(item.ClusterId);
      if (counts[cid] !== undefined) counts[cid] = Number(item.Count || 0);
    });
    return counts;
  }, [schoolStats]);

  const improvedCount = useMemo(() => {
    const item = trendStats.find((t) => t.Trend === "IMPROVED");
    return item ? Number(item.Count || 0) : 0;
  }, [trendStats]);

  const pieData = useMemo(() => {
    return [
      {
        name: "Cụm 1 (Toàn diện - Vượt trội)",
        value: clusterCounts[1],
        color: CLUSTER_CONFIG[1].color,
      },
      {
        name: "Cụm 2 (Đạt chuẩn - Vững vàng)",
        value: clusterCounts[2],
        color: CLUSTER_CONFIG[2].color,
      },
      {
        name: "Cụm 3 (Không đồng đều / Lệch pha)",
        value: clusterCounts[3],
        color: CLUSTER_CONFIG[3].color,
      },
      {
        name: "Cụm 4 (Cần hỗ trợ can thiệp)",
        value: clusterCounts[4],
        color: CLUSTER_CONFIG[4].color,
      },
    ].filter((x) => x.value > 0);
  }, [clusterCounts]);

  const barChartData = useMemo(() => {
    return classBreakdown.map((c) => ({
      name: c.TenLop,
      "Cụm 1": c.Cluster1,
      "Cụm 2": c.Cluster2,
      "Cụm 3": c.Cluster3,
      "Cụm 4": c.Cluster4,
    }));
  }, [classBreakdown]);

  const filteredChildren = useMemo(() => {
    return children.filter((child) => {
      const matchClass =
        selectedClass === "ALL" || child.TenLop === selectedClass;
      const matchCluster =
        selectedCluster === "ALL" ||
        String(child.ClusterId) === selectedCluster;
      const matchSearch =
        !searchQuery.trim() ||
        child.TenHocSinh?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        child.TenLop?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchClass && matchCluster && matchSearch;
    });
  }, [children, selectedClass, selectedCluster, searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      <FcmHeader
        month={month}
        setMonth={setMonth}
        year={year}
        setYear={setYear}
        loading={loading}
        onRefresh={() => void loadData()}
        error={error}
      />

      <FcmKpis
        totalEvaluated={totalEvaluated}
        clusterCounts={clusterCounts}
        improvedCount={improvedCount}
      />

      <FcmVisualCharts
        pieData={pieData}
        barChartData={barChartData}
        clusterCounts={clusterCounts}
      />

      <FcmClassOversightTable classBreakdown={classBreakdown} />

      <FcmChildrenTable
        classBreakdown={classBreakdown}
        filteredChildren={filteredChildren}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        selectedCluster={selectedCluster}
        setSelectedCluster={setSelectedCluster}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectChild={(child) => setSelectedChild(child)}
      />

      <FcmChildDetailModal
        selectedChild={selectedChild}
        onClose={() => setSelectedChild(null)}
        month={month}
        year={year}
      />
    </div>
  );
}
