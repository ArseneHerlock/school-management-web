'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Compass,
  ChevronDown,
  ChevronUp,
  Calendar,
  BookOpen,
  Smile,
} from 'lucide-react';
import {
  FCMHistoryItem,
  CLUSTER_PROFILES,
} from './clusterProfiles';
import { ClusterDomainsRadar } from './ClusterDomainsRadar';
import { ClusterComparisonGuide } from './ClusterComparisonGuide';

export type { FCMHistoryItem };
export { CLUSTER_PROFILES };

interface ChildDevelopmentClusterHeroCardProps {
  childName?: string;
  fcmHistory: FCMHistoryItem[];
  latestFCM: FCMHistoryItem | null;
  loading?: boolean;
}

export default function ChildDevelopmentClusterHeroCard({
  childName = 'Bé',
  latestFCM,
}: ChildDevelopmentClusterHeroCardProps) {
  const [showClusterGuide, setShowClusterGuide] = useState(false);

  const currentClusterId = Number(latestFCM?.ClusterId || latestFCM?.clusterId || 0);
  const profile = CLUSTER_PROFILES[currentClusterId];

  const month = latestFCM?.Month || latestFCM?.month || new Date().getMonth() + 1;
  const year = latestFCM?.Year || latestFCM?.year || new Date().getFullYear();
  const trend = latestFCM?.Trend || latestFCM?.trend || 'MAINTAIN';
  const prevCluster = latestFCM?.PreviousClusterId ?? latestFCM?.previousClusterId;

  const rawRadar = latestFCM?.RadarScores || (latestFCM as any)?.radarScores || {};
  const getDomainScore = (vnKey: string, camelKey: string): number => {
    const val = rawRadar[vnKey] ?? rawRadar[camelKey];
    if (val !== undefined && val !== null) {
      const num = Number(val);
      return num > 1 ? Math.min(100, Math.round(num)) : Math.round(num * 100);
    }
    return 0;
  };

  const domainScores = [
    { domain: 'Thể chất', score: getDomainScore('Thể chất', 'theChat') },
    { domain: 'Nhận thức', score: getDomainScore('Nhận thức', 'nhanThuc') },
    { domain: 'Ngôn ngữ', score: getDomainScore('Ngôn ngữ', 'ngonNgu') },
    { domain: 'Tình cảm - Xã hội', score: getDomainScore('Tình cảm - Xã hội', 'tinhCamXaHoi') },
    { domain: 'Thẩm mĩ', score: getDomainScore('Thẩm mĩ', 'thamMy') },
  ];

  if (!profile || currentClusterId === 0) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 via-purple-50/30 to-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
              <Compass size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-wider uppercase text-indigo-700">
                  HỆ THỐNG PHÂN NHÓM PHÁT TRIỂN ĐA CHIỀU
                </span>
                <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-black text-indigo-800">
                  Đang ghi nhận
                </span>
              </div>
              <h2 className="mt-1 text-xl font-black text-slate-800 sm:text-2xl">
                Theo dõi phân nhóm phát triển của {childName}
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                Cô giáo chủ nhiệm đang tích cực quan sát và đánh giá 31 chỉ số phát triển của bé qua các hoạt động hàng ngày.
                Kết quả xếp vào 4 cụm phát triển chuẩn mực sẽ được cập nhật định kỳ mỗi tháng.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowClusterGuide(!showClusterGuide)}
            className="flex items-center gap-2 self-start md:self-auto rounded-2xl border border-indigo-200 bg-white px-4 py-2.5 text-xs font-black text-indigo-700 shadow-xs hover:bg-indigo-50 transition cursor-pointer"
          >
            <HelpCircle size={15} />
            <span>{showClusterGuide ? 'Đóng hướng dẫn' : 'Tìm hiểu 4 cụm phát triển'}</span>
            {showClusterGuide ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        <ClusterComparisonGuide
          currentClusterId={currentClusterId}
          isOpen={showClusterGuide}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border ${profile.themeBorder} bg-gradient-to-br ${profile.themeLightBg} p-6 shadow-md transition`}
    >
      {/* Top Banner Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200/60">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 rounded-full bg-slate-900/5 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-slate-700">
            <Calendar size={13} className="text-slate-500" />
            ĐỢT ĐÁNH GIÁ THÁNG {month}/{year}
          </span>
          <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase ${profile.themePillBg}`}>
            {profile.levelBadge}
          </span>
        </div>

        {/* Trend Indicator */}
        <div className="flex items-center gap-2">
          {trend === 'IMPROVED' && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 text-white px-3 py-1 text-xs font-black shadow-xs">
              <TrendingUp size={14} /> Có tiến bộ vượt bậc
            </span>
          )}
          {trend === 'MAINTAIN' && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 text-blue-800 px-3 py-1 text-xs font-bold">
              <CheckCircle2 size={13} /> Duy trì phong độ tốt
            </span>
          )}
          {trend === 'DECLINED' && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-800 px-3 py-1 text-xs font-bold">
              <AlertCircle size={13} /> Cần phối hợp lưu ý thêm
            </span>
          )}

          {prevCluster && prevCluster !== currentClusterId && (
            <span className="text-[11px] font-bold text-slate-500 bg-white/70 px-2.5 py-1 rounded-full border border-slate-200/60">
              (Tháng trước: Cụm {prevCluster})
            </span>
          )}
        </div>
      </div>

      {/* Main Hero Content */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Child Cluster Spotlight */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-start gap-4">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg"
              style={{ backgroundColor: profile.themeColor }}
            >
              {profile.icon}
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                PHÂN NHÓM PHÁT TRIỂN CỦA BÉ
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mt-0.5">
                {profile.title}
              </h2>
              <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
                {profile.subTitle}
              </p>
            </div>
          </div>

          {/* Pedagogical Description */}
          <div className="rounded-2xl bg-white/80 border border-slate-200/80 p-4 shadow-xs backdrop-blur-xs">
            <h4 className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5 mb-1.5">
              <Smile size={15} className="text-indigo-600" />
              Ý NGHĨA SƯ PHẠM VỚI BÉ {childName.toUpperCase()}
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {profile.pedagogicalSummary}
            </p>

            <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-2.5">
                <span className="font-black text-emerald-800 block text-[11px] mb-0.5">
                  🌟 Thế mạnh nổi bật:
                </span>
                <span className="text-emerald-950 font-medium">{profile.strengthsText}</span>
              </div>
              <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-2.5">
                <span className="font-black text-amber-800 block text-[11px] mb-0.5">
                  🎯 Điểm cần lưu ý thêm:
                </span>
                <span className="text-amber-950 font-medium">{profile.supportAreasText}</span>
              </div>
            </div>
          </div>

          {/* Companion Action Items For Parents */}
          <div className="rounded-2xl bg-white/80 border border-slate-200/80 p-4 shadow-xs backdrop-blur-xs space-y-2.5">
            <h4 className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
              <BookOpen size={15} className="text-rose-600" />
              HƯỚNG DẪN ĐỒNG HÀNH DÀNH CHO CHA MẸ TẠI NHÀ
            </h4>
            <ul className="space-y-2">
              {profile.homeCompanionTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white text-[10px] font-black mt-0.5"
                    style={{ backgroundColor: profile.themeColor }}
                  >
                    {idx + 1}
                  </span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Side: Radar Chart */}
        <ClusterDomainsRadar
          domainScores={domainScores}
          themeColor={profile.themeColor}
          showClusterGuide={showClusterGuide}
          onToggleGuide={() => setShowClusterGuide(!showClusterGuide)}
        />
      </div>

      {/* Accordion Comparison Table */}
      <ClusterComparisonGuide
        currentClusterId={currentClusterId}
        isOpen={showClusterGuide}
      />
    </div>
  );
}
