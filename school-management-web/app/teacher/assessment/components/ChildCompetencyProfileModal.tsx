'use client';

import React, { useState } from 'react';
import Modal from '@/app/components/ui/Modal';
import {
  Activity,
  LayoutGrid,
  ShieldCheck,
} from 'lucide-react';
import { StudentCompetencyProfile } from '../assessmentBatchHelpers';
import { CompetencyDomainsTab } from './CompetencyDomainsTab';
import { CompetencyActivitiesTab } from './CompetencyActivitiesTab';

interface ChildCompetencyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: any | null;
  radarData: any[];
  competencyProfile?: StudentCompetencyProfile | null;
  onGoToMatrix?: () => void;
}

export function ChildCompetencyProfileModal({
  isOpen,
  onClose,
  student,
  radarData,
  competencyProfile,
  onGoToMatrix,
}: ChildCompetencyProfileModalProps) {
  const [profileTab, setProfileTab] = useState<'domains' | 'activities'>('domains');

  React.useEffect(() => {
    if (isOpen) {
      setProfileTab('domains');
    }
  }, [isOpen]);

  const displayRadarData =
    competencyProfile?.radarData && competencyProfile.radarData.length > 0
      ? competencyProfile.radarData
      : radarData.length > 0
      ? radarData
      : [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Hồ sơ năng lực: ${student?.tenHocSinh || ''}`}
      subtitle="Đánh giá đa chiều theo 5 lĩnh vực phát triển chuẩn Giáo dục Mầm non (Bộ GD&ĐT)"
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {competencyProfile && (
          <div className="rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50/40 via-orange-50/20 to-white p-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white font-black text-lg flex items-center justify-center shadow-xs">
                  {(competencyProfile.studentName || 'Bé').slice(-1)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-slate-800 text-sm sm:text-base">
                      {competencyProfile.studentName}
                    </h4>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${competencyProfile.overallTier.badgeBg} ${competencyProfile.overallTier.badgeText}`}
                    >
                      {competencyProfile.overallTier.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {competencyProfile.overallTier.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 bg-white px-3.5 py-2 rounded-xl border border-rose-100 shadow-xs">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">
                    Chỉ số đạt chuẩn
                  </span>
                  <span className="text-base font-black text-emerald-600">
                    {competencyProfile.overallScore}%
                  </span>
                </div>
                <div className="h-7 w-px bg-slate-100 mx-1" />
                <div className="text-left text-[11px] text-slate-500">
                  <div>
                    Đạt: <strong className="text-slate-800">{competencyProfile.totalPassedCriteria}</strong>/
                    {competencyProfile.totalAssessedCriteria} chỉ số
                  </div>
                  {competencyProfile.totalFailedCriteria > 0 && (
                    <div className="text-rose-500 font-semibold">
                      Cần rèn: {competencyProfile.totalFailedCriteria}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setProfileTab('domains')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                profileTab === 'domains'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Activity size={13} />
              <span>5 Lĩnh vực phát triển (Chuẩn GDMN)</span>
            </button>
            <button
              type="button"
              onClick={() => setProfileTab('activities')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                profileTab === 'activities'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <LayoutGrid size={13} />
              <span>Nhật ký Hoạt động ({competencyProfile?.activitiesParticipated.length || 0})</span>
            </button>
          </div>

          <span className="text-[11px] font-bold text-slate-400 hidden sm:inline-flex items-center gap-1">
            <ShieldCheck size={13} className="text-emerald-500" /> Chuẩn Bộ GD&ĐT
          </span>
        </div>

        {profileTab === 'domains' ? (
          <CompetencyDomainsTab
            competencyProfile={competencyProfile}
            displayRadarData={displayRadarData}
          />
        ) : (
          <CompetencyActivitiesTab competencyProfile={competencyProfile} />
        )}

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          {onGoToMatrix ? (
            <button
              type="button"
              onClick={onGoToMatrix}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition cursor-pointer"
            >
              <LayoutGrid size={13} />
              <span>Mở Ma trận để cập nhật đánh giá</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={onClose}
            className="rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2 text-xs font-bold text-slate-700 transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </Modal>
  );
}
