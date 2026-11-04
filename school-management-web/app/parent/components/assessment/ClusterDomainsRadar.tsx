'use client';

import React from 'react';
import { Activity, ShieldCheck } from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts';

interface DomainScore {
  domain: string;
  score: number;
}

interface ClusterDomainsRadarProps {
  domainScores: DomainScore[];
  themeColor: string;
  showClusterGuide: boolean;
  onToggleGuide: () => void;
}

export function ClusterDomainsRadar({
  domainScores,
  themeColor,
  showClusterGuide,
  onToggleGuide,
}: ClusterDomainsRadarProps) {
  return (
    <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div>
            <h4 className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
              <Activity size={15} className="text-rose-500" />
              ĐIỂM 5 LĨNH VỰC CỦA BÉ
            </h4>
            <p className="text-[11px] text-slate-400">Theo chuẩn phát triển mầm non</p>
          </div>
          <span className="text-xs font-bold text-slate-500">Mức 100%</span>
        </div>

        {/* Radar Chart */}
        <div className="h-52 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={domainScores}>
              <PolarGrid stroke="#f1f5f9" />
              <PolarAngleAxis
                dataKey="domain"
                tick={{ fontSize: 10, fill: '#475569', fontWeight: 700 }}
              />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9 }} angle={30} />
              <Radar
                name="Mức đạt"
                dataKey="score"
                stroke={themeColor}
                fill={themeColor}
                fillOpacity={0.35}
              />
              <Tooltip
                formatter={(value: any) => [`${value}%`, 'Mức đạt được']}
                contentStyle={{ borderRadius: '12px', fontSize: '11px' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Linear Domain Progress Bars */}
        <div className="mt-3 space-y-2 pt-2 border-t border-slate-100">
          {domainScores.map((d) => (
            <div key={d.domain} className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>{d.domain}</span>
                <span style={{ color: themeColor }}>{d.score}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${d.score}%`, backgroundColor: themeColor }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <ShieldCheck size={13} className="text-emerald-600" /> Dữ liệu đã được kiểm định
        </span>
        <button
          type="button"
          onClick={onToggleGuide}
          className="text-indigo-600 hover:text-indigo-800 font-bold underline cursor-pointer"
        >
          {showClusterGuide ? 'Ẩn so sánh 4 cụm' : 'Xem chuẩn 4 cụm'}
        </button>
      </div>
    </div>
  );
}
