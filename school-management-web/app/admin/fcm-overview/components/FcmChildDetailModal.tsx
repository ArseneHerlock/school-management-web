"use client";

import React from "react";
import { X } from "lucide-react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { ChildFCM, CLUSTER_CONFIG } from "../types";

interface FcmChildDetailModalProps {
  selectedChild: ChildFCM | null;
  onClose: () => void;
  month: number;
  year: number;
}

export function FcmChildDetailModal({
  selectedChild,
  onClose,
  month,
  year,
}: FcmChildDetailModalProps) {
  if (!selectedChild) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
              HỒ SƠ PHÁT TRIỂN FCM
            </span>
            <h3 className="text-lg font-black text-slate-800">
              {selectedChild.TenHocSinh}
            </h3>
            <p className="text-xs text-slate-500">
              Lớp: {selectedChild.TenLop} | Tháng {month}/{year}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Cluster Status */}
        <div className="mt-5 rounded-2xl border p-4 bg-slate-50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">
              Cụm phát triển hiện tại:
            </span>
            <span
              className="rounded-full px-3 py-1 text-xs font-black"
              style={{
                backgroundColor: CLUSTER_CONFIG[selectedChild.ClusterId]?.bg,
                color: CLUSTER_CONFIG[selectedChild.ClusterId]?.color,
              }}
            >
              {CLUSTER_CONFIG[selectedChild.ClusterId]?.name ||
                selectedChild.ClusterName}
            </span>
          </div>
          <p className="text-xs text-slate-600">
            {CLUSTER_CONFIG[selectedChild.ClusterId]?.desc}
          </p>

          {selectedChild.PreviousClusterId && (
            <div className="flex items-center gap-2 border-t border-slate-200 pt-3 text-xs text-slate-600">
              <span className="font-bold">Tháng trước:</span>
              <span>Cụm {selectedChild.PreviousClusterId}</span>
              <span className="text-slate-400">➔</span>
              <span className="font-bold">Tháng này:</span>
              <span>Cụm {selectedChild.ClusterId}</span>
              {selectedChild.Trend === "IMPROVED" && (
                <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  Tiến bộ tích cực
                </span>
              )}
            </div>
          )}
        </div>

        {/* Radar Scores (5 Domains) */}
        {selectedChild.RadarScores && (
          <div className="mt-5 space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-700">
              Đánh giá 5 lĩnh vực phát triển
            </h4>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="75%"
                  data={[
                    {
                      domain: "Thể chất",
                      score: selectedChild.RadarScores.theChat || 0.7,
                      fullMark: 1,
                    },
                    {
                      domain: "Nhận thức",
                      score: selectedChild.RadarScores.nhanThuc || 0.7,
                      fullMark: 1,
                    },
                    {
                      domain: "Ngôn ngữ",
                      score: selectedChild.RadarScores.ngonNgu || 0.7,
                      fullMark: 1,
                    },
                    {
                      domain: "TC & Xã hội",
                      score: selectedChild.RadarScores.tinhCamXaHoi || 0.7,
                      fullMark: 1,
                    },
                    {
                      domain: "Thẩm mỹ",
                      score: selectedChild.RadarScores.thamMy || 0.7,
                      fullMark: 1,
                    },
                  ]}
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="domain" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis domain={[0, 1]} tick={{ fontSize: 10 }} />
                  <Radar
                    name="Điểm số"
                    dataKey="score"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Fuzzy Memberships */}
        {selectedChild.Memberships && (
          <div className="mt-5 space-y-2">
            <h4 className="text-xs font-black uppercase text-slate-700">
              Độ thuộc các cụm (Fuzzy Memberships)
            </h4>
            <div className="space-y-1.5 text-xs">
              {([1, 2, 3, 4] as const).map((cId) => {
                const prob = Number(selectedChild.Memberships?.[cId] || 0);
                return (
                  <div key={cId} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-600">
                        {CLUSTER_CONFIG[cId].shortName}
                      </span>
                      <span className="font-bold text-slate-800">
                        {Math.round(prob * 100)}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100">
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          width: `${prob * 100}%`,
                          backgroundColor: CLUSTER_CONFIG[cId].color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-white hover:bg-slate-700 transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
