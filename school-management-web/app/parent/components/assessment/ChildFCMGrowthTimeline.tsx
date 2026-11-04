'use client';

import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  Calendar,
  Compass,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { FCMHistoryItem, CLUSTER_CONFIG } from './fcmTimelineConfig';
import { GrowthLineAndRadarCharts } from './GrowthLineAndRadarCharts';

export default function ChildFCMGrowthTimeline({ childId }: { childId: string }) {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<FCMHistoryItem[]>([]);
  const [latest, setLatest] = useState<FCMHistoryItem | null>(null);

  useEffect(() => {
    if (!childId) return;
    setLoading(true);
    fetch(`/api/fcm?childId=${childId}`)
      .then((r) => (r.ok ? r.json() : { history: [], latest: null }))
      .then((data) => {
        setHistory(data.history || []);
        setLatest(
          data.latest || (data.history?.length ? data.history[data.history.length - 1] : null)
        );
      })
      .catch(() => {
        setHistory([]);
      })
      .finally(() => setLoading(false));
  }, [childId]);

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-3xl border border-slate-100 bg-white">
        <Loader2 className="animate-spin text-rose-500" />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center space-y-3">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
          <Compass size={28} />
        </div>
        <h3 className="text-base font-black text-slate-800">
          Chưa có dữ liệu phân cụm phát triển
        </h3>
        <p className="mx-auto max-w-md text-xs text-slate-500">
          Giáo viên chủ nhiệm sẽ đánh giá các chỉ số định kỳ và phân tích sự tiến bộ của bé qua từng tháng.
        </p>
      </div>
    );
  }

  // Reverse cluster score for charting: Cluster 1 = 4 pts, Cluster 2 = 3 pts, Cluster 3 = 2 pts, Cluster 4 = 1 pt
  const chartData = history.map((item) => ({
    label: `Tháng ${item.Month}`,
    score: 5 - item.ClusterId,
    clusterName: CLUSTER_CONFIG[item.ClusterId]?.shortName || item.ClusterName,
    rawCluster: item.ClusterId,
  }));

  const latestCfg = latest
    ? CLUSTER_CONFIG[latest.ClusterId] || CLUSTER_CONFIG[2]
    : CLUSTER_CONFIG[2];

  return (
    <div className="space-y-6">
      {/* 1. Latest Month Development Status Banner */}
      {latest && (
        <div
          className={`relative overflow-hidden rounded-3xl border ${latestCfg.border} ${latestCfg.bg} p-6 shadow-sm`}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-md"
                style={{ backgroundColor: latestCfg.color }}
              >
                <Sparkles size={26} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                    KỲ ĐÁNH GIÁ MỚI NHẤT • THÁNG {latest.Month}/{latest.Year}
                  </span>
                  {latest.Trend === 'IMPROVED' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      <TrendingUp size={11} /> Có tiến bộ
                    </span>
                  )}
                </div>
                <h3
                  className="mt-1 text-2xl font-black text-slate-800"
                  style={{ color: latestCfg.color }}
                >
                  {latestCfg.name}
                </h3>
                <p className="mt-1 text-xs text-slate-600 max-w-xl">
                  {latestCfg.encouragement}
                </p>
              </div>
            </div>

            {/* Previous vs Current comparison */}
            {latest.PreviousClusterId && (
              <div className="rounded-2xl border border-white/60 bg-white/70 p-3.5 backdrop-blur text-xs">
                <p className="text-[10px] font-bold uppercase text-slate-400">Tiến trình chuyển cụm</p>
                <div className="mt-1 flex items-center gap-2 font-bold text-slate-700">
                  <span>Cụm {latest.PreviousClusterId}</span>
                  <ArrowRight size={13} className="text-slate-400" />
                  <span style={{ color: latestCfg.color }}>Cụm {latest.ClusterId}</span>
                </div>
                {latest.Trend === 'IMPROVED' && (
                  <p className="mt-1 text-[11px] font-bold text-emerald-600">
                    🌟 Bé đã tiến bộ hơn so với tháng trước!
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Longitudinal Growth Chart + Radar Chart */}
      <GrowthLineAndRadarCharts
        chartData={chartData}
        radarScores={latest?.RadarScores}
      />

      {/* 3. Monthly Developmental Milestone Cards */}
      <div className="space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
          CÁC CỘT MỐC PHÁT TRIỂN CỦA CON
        </h4>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {history.map((item) => {
            const cfg = CLUSTER_CONFIG[item.ClusterId] || CLUSTER_CONFIG[2];
            return (
              <div
                key={item.Id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs hover:border-slate-300 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400" />
                    <span className="font-bold text-slate-800 text-xs">
                      Tháng {item.Month}/{item.Year}
                    </span>
                  </div>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                    style={{ backgroundColor: cfg.bg, color: cfg.color }}
                  >
                    {cfg.shortName}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  {cfg.desc}
                </p>
                {item.Trend === 'IMPROVED' && (
                  <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                    <TrendingUp size={12} /> Có bước tiến bộ vượt bậc
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
