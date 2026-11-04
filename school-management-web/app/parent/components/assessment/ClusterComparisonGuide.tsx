'use client';

import React from 'react';
import { CLUSTER_PROFILES } from './clusterProfiles';

interface ClusterComparisonGuideProps {
  currentClusterId?: number;
  isOpen: boolean;
}

export function ClusterComparisonGuide({
  currentClusterId,
  isOpen,
}: ClusterComparisonGuideProps) {
  if (!isOpen) return null;

  return (
    <div className="mt-6 border-t border-slate-200/80 pt-5 space-y-3">
      <h4 className="text-xs font-black uppercase tracking-wider text-slate-600">
        BẢNG TRA CỨU CHUẨN 4 CỤM PHÁT TRIỂN
      </h4>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((id) => {
          const c = CLUSTER_PROFILES[id];
          const isCurrent = id === currentClusterId;
          return (
            <div
              key={id}
              className={`rounded-2xl border p-4 text-xs transition ${
                isCurrent
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-white shadow-md'
                  : `${c.themeBorder} bg-white/70`
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-black text-slate-800">{c.title}</span>
                {isCurrent && (
                  <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[9px] font-black text-white">
                    Vị trí của bé
                  </span>
                )}
              </div>
              <span
                className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${c.themePillBg}`}
              >
                {c.levelBadge}
              </span>
              <p className="mt-2 text-slate-600 text-[11px] leading-relaxed">
                {c.pedagogicalSummary}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
