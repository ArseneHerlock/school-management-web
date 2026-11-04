'use client';

import React from 'react';
import { Loader2, RotateCcw, Share2 } from 'lucide-react';
import { GoodChildGrid } from './GoodChildGrid';
import { Child } from '../../data';
import { FridayAwardChild } from '@/services/awards';

interface MonthlyBookSectionProps {
  month: number;
  year: number;
  childrenList: Child[];
  rowFor: (id: string) => any;
  onOpenChildPage: (child: Child) => void;
  fridayAwardMap: Map<string, FridayAwardChild>;
  classDelivery: {
    isDelivered: boolean;
    deliveredCount: number;
    totalCount: number;
    childrenMap: Record<string, boolean>;
  };
  deliveringClass: boolean;
  onToggleDeliverAllClass: () => void;
}

export function MonthlyBookSection({
  month,
  year,
  childrenList,
  rowFor,
  onOpenChildPage,
  fridayAwardMap,
  classDelivery,
  deliveringClass,
  onToggleDeliverAllClass,
}: MonthlyBookSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900">
            Sổ Bé Ngoan Tháng {month}/{year}
          </h3>
          <p className="text-xs text-slate-500">
            Bé tích lũy đủ 4 hoa nhỏ của 4 tuần sẽ tự động nhận huy hiệu Ngôi Sao Bé Ngoan Tháng.
          </p>
        </div>

        <button
          type="button"
          disabled={deliveringClass}
          onClick={onToggleDeliverAllClass}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs disabled:opacity-50 ${
            classDelivery.isDelivered
              ? 'bg-rose-600 hover:bg-rose-700 text-white'
              : 'bg-slate-800 hover:bg-slate-900 text-white'
          }`}
        >
          {deliveringClass ? (
            <Loader2 size={14} className="animate-spin" />
          ) : classDelivery.isDelivered ? (
            <RotateCcw size={14} />
          ) : (
            <Share2 size={14} />
          )}
          <span>
            {classDelivery.isDelivered
              ? `Thu Hồi Sổ Cả Lớp (${classDelivery.deliveredCount}/${classDelivery.totalCount || childrenList.length})`
              : `Bàn Giao Sổ Cả Lớp Cho PH (${classDelivery.deliveredCount}/${classDelivery.totalCount || childrenList.length})`}
          </span>
        </button>
      </div>

      <GoodChildGrid
        childrenList={childrenList}
        rowFor={rowFor}
        onOpen={onOpenChildPage}
        fridayAwardMap={fridayAwardMap}
        isDelivered={(id) =>
          Boolean(classDelivery.childrenMap?.[id.toLowerCase()])
        }
        month={month}
        year={year}
      />
    </div>
  );
}
