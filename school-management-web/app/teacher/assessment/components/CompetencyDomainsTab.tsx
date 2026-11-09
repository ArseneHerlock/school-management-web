'use client';

import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Activity,
  Brain,
  MessageSquare,
  Heart,
  Palette,
} from 'lucide-react';
import { StudentCompetencyProfile } from '../assessmentBatchHelpers';

interface CompetencyDomainsTabProps {
  competencyProfile?: StudentCompetencyProfile | null;
  displayRadarData: any[];
}

export function CompetencyDomainsTab({
  competencyProfile,
  displayRadarData,
}: CompetencyDomainsTabProps) {
  const domainIconMap: Record<string, React.ReactNode> = {
    'Thể chất': <Activity size={14} className="text-emerald-600" />,
    'Nhận thức': <Brain size={14} className="text-sky-600" />,
    'Ngôn ngữ': <MessageSquare size={14} className="text-purple-600" />,
    'Tình cảm - Xã hội': <Heart size={14} className="text-amber-600" />,
    'Thẩm mỹ': <Palette size={14} className="text-rose-600" />,
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Biểu đồ Radar 5 đỉnh chuẩn GDMN */}
        <div className="md:col-span-6 bg-slate-50/60 rounded-2xl border border-slate-100 p-3 sm:p-4 flex flex-col items-center justify-center">
          <div className="w-full flex items-center justify-between pb-1 border-b border-slate-200/60">
            <span className="text-[11px] font-extrabold uppercase text-slate-700 tracking-wider">
              Biểu đồ Đa giác 5 Miền
            </span>
            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
              Thang chuẩn 100%
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full mt-1">
            {displayRadarData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={displayRadarData} outerRadius="72%">
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis
                    dataKey="domain"
                    tick={{
                      fill: '#334155',
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fontSize: 9, fill: '#94a3b8' }}
                    stroke="#cbd5e1"
                  />
                  <Radar
                    name="Mức độ đạt"
                    dataKey="score"
                    stroke="#f43f5e"
                    fill="#f43f5e"
                    fillOpacity={0.35}
                  />
                  <Tooltip
                    formatter={(val: any) => [`${val}% Đạt chuẩn`, 'Mức độ phát triển']}
                    contentStyle={{
                      borderRadius: '0.75rem',
                      borderColor: '#e2e8f0',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                      fontSize: '11px',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Chưa có dữ liệu đánh giá để vẽ biểu đồ
              </div>
            )}
          </div>
          <p className="text-[10px] text-slate-400 text-center italic mt-1">
            Biểu đồ phản ánh sự phát triển đồng đều của bé qua 5 lĩnh vực mầm non cốt lõi.
          </p>
        </div>

        {/* 5 Thanh tiến trình Lĩnh vực phát triển */}
        <div className="md:col-span-6 space-y-2.5">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <span className="text-[11px] font-extrabold uppercase text-slate-700">
              Chi tiết 5 Lĩnh vực
            </span>
            <span className="text-[10px] text-slate-400">Tỷ lệ đạt chỉ số</span>
          </div>

          {competencyProfile?.domainProgress.map((dom) => (
            <div
              key={dom.domainCode}
              className="p-2.5 rounded-xl border border-slate-100 bg-white hover:bg-slate-50/70 transition shadow-2xs"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 min-w-0">
                  {domainIconMap[dom.domainShortName] || <Sparkles size={14} />}
                  <span className="font-bold text-slate-800 truncate">
                    {dom.domainName}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-slate-400">
                    {dom.passCount}/{dom.passCount + dom.failCount} đạt
                  </span>
                  <span
                    className="text-xs font-black px-1.5 py-0.5 rounded-md"
                    style={{
                      color: dom.color,
                      backgroundColor: `${dom.color}15`,
                    }}
                  >
                    {dom.score}%
                  </span>
                </div>
              </div>

              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden mt-1.5">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${dom.score}%`,
                    backgroundColor: dom.color,
                  }}
                />
              </div>

              <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                <span className="truncate max-w-[220px]">{dom.description}</span>
                <span className={`px-1.5 py-0.2 rounded font-semibold text-[9px] border ${dom.statusBadge}`}>
                  {dom.statusText}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {competencyProfile && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800 uppercase">
              <CheckCircle2 size={15} className="text-emerald-600" />
              <span>🌟 Điểm sáng nổi bật của bé</span>
            </div>
            {competencyProfile.strengths.length > 0 ? (
              <ul className="space-y-1 text-xs text-slate-700">
                {competencyProfile.strengths.slice(0, 4).map((s, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span className="leading-snug">
                      <strong>[{s.domainShortName}]</strong> {s.name}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400 italic">
                Bé đang trong quá trình tích cực hoàn thiện các kỹ năng.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-rose-100 bg-rose-50/30 p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-black text-rose-800 uppercase">
              <AlertCircle size={15} className="text-rose-600" />
              <span>💡 Cần cô & gia đình đồng hành rèn luyện</span>
            </div>
            {competencyProfile.focusAreas.length > 0 ? (
              <ul className="space-y-1 text-xs text-slate-700">
                {competencyProfile.focusAreas.slice(0, 4).map((f, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span className="leading-snug">
                      <strong>[{f.domainShortName}]</strong> {f.name}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400 italic">
                Tuyệt vời! Bé chưa có chỉ số nào cần can thiệp đặc biệt.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
