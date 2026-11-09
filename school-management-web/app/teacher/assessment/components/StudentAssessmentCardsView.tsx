'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Info,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { CriterionItem } from '@/services/development';
import { parseCriterionHeader, getDomainStyle } from './matrix/matrixHelpers';
import { triggerHaptic } from '@/app/components/ui/haptic';

interface StudentAssessmentCardsViewProps {
  classStudents: any[];
  displayCriteria: CriterionItem[];
  matrix: Record<string, Record<string, any>>;
  onCellClick: (studentId: string, criterionId: string) => void;
  onMarkRowPass: (studentId: string) => void;
  onOpenCriterionGuide: (crit: CriterionItem) => void;
  onOpenCellDetail: (info: any) => void;
  childActivityRemarks: Record<string, any>;
  onChangeChildRemark: (studentId: string, val: string) => void;
  auditMode: boolean;
}

export function StudentAssessmentCardsView({
  classStudents,
  displayCriteria,
  matrix,
  onCellClick,
  onMarkRowPass,
  onOpenCriterionGuide,
  onOpenCellDetail,
  childActivityRemarks,
  onChangeChildRemark,
  auditMode,
}: StudentAssessmentCardsViewProps) {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const currentStudent = classStudents[selectedIdx] || classStudents[0];

  if (!currentStudent) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-xs text-slate-500">
        Không có học sinh nào trong lớp để đánh giá.
      </div>
    );
  }

  const studentRow = matrix[currentStudent.id] || {};
  const remarkVal = childActivityRemarks[currentStudent.id]?.comment ?? '';

  // Tính số lượng đạt của học sinh hiện tại
  let passCount = 0;
  let assessedCount = 0;
  displayCriteria.forEach((crit) => {
    const res = studentRow[crit.id]?.result;
    if (res !== null && res !== undefined) {
      assessedCount++;
      if (res === true) passCount++;
    }
  });

  const passPercent =
    displayCriteria.length > 0
      ? Math.round((passCount / displayCriteria.length) * 100)
      : 0;

  const handleNext = () => {
    triggerHaptic();
    if (selectedIdx < classStudents.length - 1) {
      setSelectedIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    triggerHaptic();
    if (selectedIdx > 0) {
      setSelectedIdx((prev) => prev - 1);
    }
  };

  return (
    <div className="space-y-3 min-w-0 max-w-full">
      {/* 1. Dải cuộn ngang chọn học sinh nhanh */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-2 shadow-2xs">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 px-1.5 pb-1.5">
          <span>Chọn trẻ ({selectedIdx + 1}/{classStudents.length}):</span>
          <span className="text-orange-600">{currentStudent.tenHocSinh}</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {classStudents.map((st, idx) => {
            const isCur = idx === selectedIdx;
            const row = matrix[st.id] || {};
            let stPass = 0;
            displayCriteria.forEach((cr) => {
              if (row[cr.id]?.result === true) stPass++;
            });

            return (
              <button
                key={st.id}
                type="button"
                onClick={() => {
                  triggerHaptic();
                  setSelectedIdx(idx);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  isCur
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs scale-102'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <span
                  className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                    isCur ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {st.tenHocSinh?.charAt(0) || 'B'}
                </span>
                <span>{st.tenHocSinh?.split(' ').slice(-2).join(' ') || st.tenHocSinh}</span>
                <span
                  className={`text-[10px] px-1 py-0.2 rounded-md font-mono ${
                    isCur ? 'bg-black/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {stPass}/{displayCriteria.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Thẻ hồ sơ và tiến độ của trẻ đang chọn */}
      <div className="bg-white rounded-2xl border border-orange-100 p-3.5 shadow-2xs">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-black text-slate-800">
              {currentStudent.tenHocSinh}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {currentStudent.gioiTinh} · Năm sinh: {currentStudent.ngaySinh?.slice(0, 4) || '2022'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              triggerHaptic();
              onMarkRowPass(currentStudent.id);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 text-[11px] font-bold transition cursor-pointer shrink-0 shadow-2xs active:scale-95"
            title="Đánh dấu tất cả chỉ số Đạt cho bé"
          >
            <CheckCheck size={13} className="text-orange-600" />
            <span>Đạt tất cả</span>
          </button>
        </div>

        {/* Thanh tiến độ đạt chuẩn */}
        <div className="mt-2.5 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-[11px] font-bold mb-1">
            <span className="text-slate-600">
              Đã đánh giá: <b className="text-slate-900">{assessedCount}/{displayCriteria.length}</b> tiêu chí
            </span>
            <span className="text-emerald-700">
              Đạt: <b>{passCount}</b> ({passPercent}%)
            </span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300"
              style={{ width: `${passPercent}%` }}
            />
          </div>
        </div>

        {/* Ô nhận xét riêng cho bé */}
        <div className="mt-2.5">
          <label className="flex items-center gap-1 text-[10px] font-extrabold text-amber-800 uppercase tracking-tight mb-1">
            <MessageSquare size={11} className="text-amber-600" />
            <span>Nhận xét buổi học của bé (Lưu vào Sổ Bé Ngoan):</span>
          </label>
          <textarea
            rows={2}
            value={remarkVal}
            onChange={(e) => onChangeChildRemark(currentStudent.id, e.target.value)}
            placeholder="Ghi nhận xét riêng (VD: Bé tích cực tham gia, nắm chắc bài học)..."
            className="w-full rounded-xl border border-amber-200 bg-amber-50/20 p-2 text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-amber-400 resize-none font-sans"
          />
        </div>
      </div>

      {/* 3. Danh sách các tiêu chí dạng thẻ cực kỳ dễ bấm */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1 text-xs font-bold text-slate-600">
          <span>Danh sách tiêu chí ({displayCriteria.length}):</span>
          <span className="text-[10px] text-slate-400 font-normal">Chạm trực tiếp để chấm</span>
        </div>

        {displayCriteria.map((crit, idx) => {
          const parsed = parseCriterionHeader(crit.name, crit.code);
          const domainStyle = getDomainStyle((crit as any).developmentDomainName || '', crit.code);
          const cell = studentRow[crit.id] || { result: null, isDirty: false };
          const isPass = cell.result === true;
          const isFail = cell.result === false;
          const isUnset = cell.result === null || cell.result === undefined;
          const hasNote = Boolean(cell.comment || cell.evidence);

          return (
            <div
              key={crit.id}
              className={`rounded-2xl border p-3 transition-all ${
                cell.isDirty
                  ? 'border-orange-300 bg-orange-50/30'
                  : 'border-slate-200 bg-white'
              }`}
            >
              {/* Tiêu đề & Lĩnh vực */}
              <div className="flex items-start justify-between gap-1.5 mb-1.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={`inline-block text-[9px] font-black px-1.5 py-0.5 rounded-md border uppercase tracking-wider ${domainStyle.pillClass}`}
                  >
                    {domainStyle.domainLabel}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-orange-600">
                    {parsed.targetCode}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {(auditMode || hasNote) && (
                    <button
                      type="button"
                      onClick={() =>
                        onOpenCellDetail({
                          studentId: currentStudent.id,
                          criterionId: crit.id,
                          studentName: currentStudent.tenHocSinh,
                          criterionName: crit.name,
                          comment: cell.comment || '',
                          evidence: cell.evidence || '',
                        })
                      }
                      className={`p-1 rounded-lg border text-[10px] transition cursor-pointer ${
                        hasNote
                          ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                          : 'border-slate-200 text-slate-400'
                      }`}
                      title="Ghi chú minh chứng"
                    >
                      <MessageSquare size={12} />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onOpenCriterionGuide(crit)}
                    className="p-1 rounded-lg text-slate-400 hover:text-orange-600 transition"
                    title="Xem hướng dẫn chi tiết"
                  >
                    <Info size={14} />
                  </button>
                </div>
              </div>

              {/* Tên tiêu chí */}
              <p className="text-xs font-semibold text-slate-800 leading-snug mb-2.5">
                {parsed.description}
              </p>

              {/* 3 Nút lựa chọn chuẩn cảm ứng (Segmented Control) */}
              <div className="grid grid-cols-3 gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200/80">
                {/* 1. Chưa đánh giá */}
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic();
                    if (!isUnset) onCellClick(currentStudent.id, crit.id);
                  }}
                  className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    isUnset
                      ? 'bg-white text-slate-700 shadow-2xs font-extrabold'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <HelpCircle size={13} />
                  <span>Chưa chấm</span>
                </button>

                {/* 2. Cần rèn luyện */}
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic();
                    if (!isFail) onCellClick(currentStudent.id, crit.id);
                  }}
                  className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    isFail
                      ? 'bg-rose-500 text-white shadow-xs font-extrabold'
                      : 'text-rose-600 hover:bg-rose-50/60'
                  }`}
                >
                  <XCircle size={13} />
                  <span>Cần rèn</span>
                </button>

                {/* 3. Đạt */}
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic();
                    if (!isPass) onCellClick(currentStudent.id, crit.id);
                  }}
                  className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    isPass
                      ? 'bg-emerald-600 text-white shadow-xs font-extrabold'
                      : 'text-emerald-700 hover:bg-emerald-50/60'
                  }`}
                >
                  <CheckCircle2 size={13} />
                  <span>Đạt chuẩn</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Thanh điều hướng chuyển trẻ trước/sau */}
      <div className="flex items-center justify-between gap-2 pt-2 pb-6">
        <button
          type="button"
          onClick={handlePrev}
          disabled={selectedIdx === 0}
          className={`flex-1 flex items-center justify-center gap-1 h-10 rounded-xl text-xs font-bold border transition ${
            selectedIdx === 0
              ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs'
          }`}
        >
          <ChevronLeft size={16} />
          <span>Bé trước</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={selectedIdx === classStudents.length - 1}
          className={`flex-1 flex items-center justify-center gap-1 h-10 rounded-xl text-xs font-bold border transition ${
            selectedIdx === classStudents.length - 1
              ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100 cursor-pointer shadow-2xs'
          }`}
        >
          <span>Bé tiếp theo</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
