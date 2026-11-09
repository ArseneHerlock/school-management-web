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
  Sparkles,
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
  const children = fridayData?.children || [];

  const handleSelectQualifiedOnly = () => {
    children.forEach((c) => {
      const shouldSelect = c.isQualified && !c.hasAwardedToday;
      const isSelected = selectedChildIds.has(c.childId);
      if (shouldSelect !== isSelected) {
        onToggleSelectChild(c.childId);
      }
    });
  };

  return (
    <div className="space-y-3 min-w-0 max-w-full">
      {/* 1. Header Banner gọn nhẹ chuẩn Mobile */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-3.5 sm:p-4 text-white shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-orange-100 mb-0.5">
              <Clock size={12} />
              <span>Tuần: T2 ({fridayData?.weekRange.monday || '--'}) đến T6 ({fridayData?.weekRange.friday || '--'})</span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white leading-tight">
              Xét duyệt & Phát phiếu Thứ 6
            </h2>
          </div>

          <button
            type="button"
            disabled={awarding || selectedChildIds.size === 0}
            onClick={onAwardFriday}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-orange-700 font-extrabold text-xs shadow hover:bg-amber-50 transition cursor-pointer disabled:opacity-40 shrink-0"
          >
            {awarding ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Flower2 size={14} />
            )}
            <span>Phát phiếu cho {selectedChildIds.size} bé đã chọn</span>
          </button>
        </div>

        {/* 3 thẻ chỉ số nhanh nhỏ gọn */}
        <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
          <div className="bg-white/15 backdrop-blur-xs rounded-xl p-2">
            <div className="text-[10px] text-orange-100 uppercase font-semibold">Đủ tiêu chuẩn</div>
            <div className="text-sm font-black text-white mt-0.5">
              {fridayData?.qualifiedCount || 0}/{fridayData?.totalCount || 0}
            </div>
          </div>
          <div className="bg-white/15 backdrop-blur-xs rounded-xl p-2">
            <div className="text-[10px] text-orange-100 uppercase font-semibold">Đã phát tuần này</div>
            <div className="text-sm font-black text-white mt-0.5">
              {fridayData?.awardedCount || 0} bé
            </div>
          </div>
          <div className="bg-white/15 backdrop-blur-xs rounded-xl p-2">
            <div className="text-[10px] text-orange-100 uppercase font-semibold">Sao tháng {month}</div>
            <div className="text-sm font-black text-amber-200 mt-0.5 flex items-center justify-center gap-1">
              <Star size={12} className="fill-amber-300 text-amber-300" />
              <span>{fridayData?.monthlyStarsCount || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Thanh thao tác nhanh & Bộ chọn */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
        <span className="text-slate-500 font-semibold text-[11px]">
          Đã chọn <strong className="text-slate-900">{selectedChildIds.size}</strong>/{children.length} học sinh
        </span>
        <div className="flex items-center gap-2 text-[11px] font-bold">
          <button
            type="button"
            onClick={handleSelectQualifiedOnly}
            className="text-orange-600 hover:text-orange-800 transition cursor-pointer"
          >
            Chọn bé đủ chuẩn
          </button>
          <span className="text-slate-300">•</span>
          <button
            type="button"
            onClick={() => onSelectAll(true)}
            className="text-slate-600 hover:text-slate-900 transition cursor-pointer"
          >
            Tất cả
          </button>
          <span className="text-slate-300">•</span>
          <button
            type="button"
            onClick={() => onSelectAll(false)}
            className="text-slate-400 hover:text-slate-600 transition cursor-pointer"
          >
            Bỏ chọn
          </button>
        </div>
      </div>

      {/* 3. Danh sách học sinh: Bố cục tinh gọn tối đa cho màn hình điện thoại */}
      <div className="space-y-1.5">
        {children.map((child) => {
          const isSelected = selectedChildIds.has(child.childId);

          return (
            <div
              key={child.childId}
              onClick={() => onToggleSelectChild(child.childId)}
              className={`p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                isSelected
                  ? 'border-orange-400 bg-orange-50/50 shadow-2xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              {/* Bên trái: Checkbox + Tên bé + Ngày học */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition ${
                    isSelected
                      ? 'border-orange-500 bg-orange-500 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && <Check size={12} strokeWidth={3} />}
                </div>

                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-black text-xs shrink-0">
                  {child.childName.slice(0, 2).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                    {child.childName}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                    <span>{child.presentDays}/5 buổi có mặt</span>
                    {child.unexcusedDays > 0 && (
                      <span className="text-rose-600 font-bold">
                        ({child.unexcusedDays} vắng không phép)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bên phải: 4 hoa tuần + Trạng thái nhận phiếu */}
              <div className="flex items-center gap-2 shrink-0">
                {/* 4 hoa tuần */}
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4].map((slot) => (
                    <span
                      key={slot}
                      className={`text-xs ${
                        slot <= child.monthFlowerCount ? 'opacity-100' : 'opacity-20 grayscale'
                      }`}
                      title={`Tuần ${slot}`}
                    >
                      🌸
                    </span>
                  ))}
                  {child.hasMonthlyStar && (
                    <Star size={11} className="fill-amber-400 text-amber-500 ml-0.5" />
                  )}
                </div>

                {/* Huy hiệu kết quả */}
                {child.hasAwardedToday ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-extrabold">
                    ✓ Đã phát
                  </span>
                ) : child.isQualified ? (
                  <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[9px] font-bold">
                    Đủ chuẩn
                  </span>
                ) : (
                  <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px] font-medium">
                    Chưa đủ
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
