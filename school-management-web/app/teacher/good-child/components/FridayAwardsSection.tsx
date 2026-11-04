'use client';

import React from 'react';
import {
  Clock,
  Loader2,
  Flower2,
  Check,
  CheckCircle2,
  AlertCircle,
  Star,
} from 'lucide-react';
import { FridayAwardsResponse } from '@/services/awards';

interface FridayAwardsSectionProps {
  fridayData: FridayAwardsResponse | null;
  selectedChildIds: Set<string>;
  awarding: boolean;
  month: number;
  onAwardFriday: () => void;
  onToggleSelectChild: (id: string) => void;
  onSelectAll: (select: boolean) => void;
}

export function FridayAwardsSection({
  fridayData,
  selectedChildIds,
  awarding,
  month,
  onAwardFriday,
  onToggleSelectChild,
  onSelectAll,
}: FridayAwardsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-100 mb-1">
            <Clock size={14} />
            <span>
              Tuần từ Thứ 2 ({fridayData?.weekRange.monday || '--'}) đến Thứ 6 ({fridayData?.weekRange.friday || '--'})
            </span>
          </div>
          <h2 className="text-xl font-black">
            Xét Duyệt & Phát Phiếu Chiều Thứ 6
          </h2>
          <p className="text-xs text-amber-100 mt-1 max-w-xl leading-relaxed">
            Hệ thống tự động kiểm tra nề nếp chuyên cần từ Sổ Điểm Danh trong tuần và các chỉ số nề nếp để đề xuất danh sách. Cô giáo có thể chọn hoặc bỏ chọn trước khi nhấn phát phiếu.
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-xl bg-white/20 px-3 py-1 font-bold text-white">
              📋 Đủ tiêu chuẩn tuần: {fridayData?.qualifiedCount || 0}/{fridayData?.totalCount || 0} bé
            </span>
            <span className="rounded-xl bg-white/20 px-3 py-1 font-bold text-white">
              ✓ Đã phát hôm nay: {fridayData?.awardedCount || 0} bé
            </span>
            <span className="rounded-xl bg-amber-300/30 text-amber-100 px-3 py-1 font-bold">
              ⭐ Đạt Ngôi sao tháng {month}: {fridayData?.monthlyStarsCount || 0} bé
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
          <button
            type="button"
            disabled={awarding || selectedChildIds.size === 0}
            onClick={onAwardFriday}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-orange-700 font-extrabold text-xs shadow-md hover:bg-amber-50 transition cursor-pointer disabled:opacity-50"
          >
            {awarding ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Flower2 size={16} />
            )}
            <span>Phát Phiếu Cho {selectedChildIds.size} Bé Đã Chọn</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs px-2">
        <span className="text-slate-500 font-semibold">
          Đã chọn <strong className="text-slate-900">{selectedChildIds.size}</strong> / {fridayData?.totalCount || 0} bé trong lớp
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSelectAll(true)}
            className="text-orange-600 font-bold hover:underline cursor-pointer"
          >
            Chọn tất cả
          </button>
          <span className="text-slate-300">|</span>
          <button
            type="button"
            onClick={() => onSelectAll(false)}
            className="text-slate-500 font-bold hover:underline cursor-pointer"
          >
            Bỏ chọn
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {fridayData?.children.map((child) => {
          const isSelected = selectedChildIds.has(child.childId);

          return (
            <div
              key={child.childId}
              onClick={() => onToggleSelectChild(child.childId)}
              className={`rounded-2xl border p-4 transition cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'border-amber-400 bg-amber-50/40 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-black text-xs">
                    {child.childName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      {child.childName}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {child.presentDays} ngày đi học ngoan ·{' '}
                      {child.unexcusedDays > 0
                        ? `${child.unexcusedDays} buổi vắng không phép`
                        : 'Không nghỉ tùy tiện'}
                    </p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-lg border flex items-center justify-center transition ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && <Check size={13} strokeWidth={3} />}
                </div>
              </div>

              <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-2.5 space-y-1.5">
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5">
                    <Flower2 size={13} className="text-pink-500 shrink-0" />
                    <span className="text-xs font-black text-slate-800">
                      {child.monthFlowerCount}/4 phiếu tháng {month}
                    </span>
                    {child.hasMonthlyStar && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-200 px-1.5 py-0.5 text-[9px] font-black text-amber-900">
                        <Star size={9} className="fill-amber-500 text-amber-500" /> Sao tháng
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4].map((slot) => (
                      <span
                        key={slot}
                        title={`Tuần ${slot}`}
                        className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] ${
                          slot <= child.monthFlowerCount
                            ? 'bg-pink-500 font-black text-white shadow-2xs'
                            : 'bg-slate-200 text-slate-400'
                        }`}
                      >
                        {slot <= child.monthFlowerCount ? '🌸' : ''}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>
                    Tổng tích lũy: <strong className="text-slate-700">{child.totalFlowerCount}</strong> phiếu
                  </span>
                  {child.monthFlowers && child.monthFlowers.length > 0 && (
                    <span className="text-slate-400">
                      Ngày nhận: {child.monthFlowers.map((f) => f.date.slice(5).replace('-', '/')).join(', ')}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span
                  className={`font-bold inline-flex items-center gap-1 ${
                    child.isQualified ? 'text-emerald-700' : 'text-rose-600'
                  }`}
                >
                  {child.isQualified ? (
                    <>
                      <CheckCircle2 size={13} /> Đủ điều kiện nhận phiếu
                    </>
                  ) : (
                    <>
                      <AlertCircle size={13} /> Cần rèn luyện thêm
                    </>
                  )}
                </span>

                {child.hasAwardedToday ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                    ✓ Đã phát hôm nay
                  </span>
                ) : (
                  <span className="text-slate-400 text-[10px]">Chờ phát</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
