import React from 'react';
import { FCM_CLUSTERS } from '@/services/fcm';

interface FcmClusterStatsProps {
  stats?: {
    cluster1Count: number;
    cluster2Count: number;
    cluster3Count: number;
    cluster4Count: number;
  };
}

export function FcmClusterStats({ stats }: FcmClusterStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {[1, 2, 3, 4].map((cId) => {
        const meta = FCM_CLUSTERS[cId];
        const count =
          cId === 1
            ? stats?.cluster1Count || 0
            : cId === 2
            ? stats?.cluster2Count || 0
            : cId === 3
            ? stats?.cluster3Count || 0
            : stats?.cluster4Count || 0;

        return (
          <div
            key={cId}
            className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${meta.badgeBg} ${meta.badgeText}`}>
                {meta.tag}
              </span>
              <span className="text-xs font-bold text-slate-400">Cụm {cId}</span>
            </div>
            <div className="text-2xl font-black text-slate-800">
              {count} <span className="text-xs text-slate-400 font-normal">bé</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
              {meta.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
