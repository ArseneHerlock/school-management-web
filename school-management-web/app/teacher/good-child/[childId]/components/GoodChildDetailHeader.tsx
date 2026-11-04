'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Users,
  CalendarDays,
  RefreshCw,
  Check,
  Share2,
  BookmarkCheck,
  Loader2,
  Flower2,
  Star,
} from 'lucide-react';
import { Child } from '../../../data';
import { FridayAwardChild } from '@/services/awards';

interface GoodChildDetailHeaderProps {
  month: number;
  setMonth: (m: number) => void;
  year: number;
  setYear: (y: number) => void;
  childrenList: Child[];
  targetChildApiId: string;
  currentChild: Child | null;
  childDisplayName: string;
  isDelivered: boolean;
  saving: boolean;
  loading: boolean;
  childAwardInfo: FridayAwardChild | null;
  onRefresh: () => void;
  onSelectChild: (nextId: string) => void;
  onToggleDeliver: () => void;
  onSaveComment: () => void;
}

export function GoodChildDetailHeader({
  month,
  setMonth,
  year,
  setYear,
  childrenList,
  targetChildApiId,
  currentChild,
  childDisplayName,
  isDelivered,
  saving,
  loading,
  childAwardInfo,
  onRefresh,
  onSelectChild,
  onToggleDeliver,
  onSaveComment,
}: GoodChildDetailHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-amber-200/80 bg-gradient-to-r from-amber-50/90 via-orange-50/60 to-white p-4 sm:p-6 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/teacher/good-child?month=${month}&year=${year}`}
          className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-white px-3.5 py-2 text-xs font-extrabold text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition shadow-2xs"
        >
          <ArrowLeft size={15} />
          <span>Quay lại danh sách Theo dõi rèn luyện</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          {childrenList.length > 1 && (
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5">
              <Users size={14} className="text-amber-600 shrink-0" />
              <select
                value={targetChildApiId}
                onChange={(e) => onSelectChild(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer"
              >
                {childrenList.map((c) => {
                  const cid = c.apiId || String(c.id);
                  return (
                    <option key={cid} value={cid}>
                      {c.name}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5">
            <CalendarDays size={14} className="text-amber-500 shrink-0" />
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Tháng {i + 1}
                </option>
              ))}
            </select>
            <span className="text-slate-300">/</span>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-16 bg-transparent text-xs font-bold text-slate-700 outline-none"
            />
          </div>

          <button
            type="button"
            onClick={onRefresh}
            className="rounded-xl border border-amber-200 bg-white p-2 text-amber-600 hover:bg-amber-50 transition cursor-pointer"
            title="Làm mới dữ liệu"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-3.5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-lg font-black text-white shadow-sm">
            {currentChild?.avatar || childDisplayName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="rounded-md bg-amber-100 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-amber-800">
                Sổ Bé Ngoan Tháng {month}/{year}
              </span>
              <span
                className={`rounded-md px-2.5 py-0.5 text-[11px] font-bold ${
                  isDelivered
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {isDelivered ? '✓ Đã bàn giao cho Phụ huynh' : 'Chưa bàn giao cho Phụ huynh'}
              </span>
            </div>
            <h1 className="mt-1 text-xl sm:text-2xl font-black text-slate-900">
              {childDisplayName}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Tổng hợp nhận xét từ các hoạt động giáo dục của bé trong tháng để ghi Sổ Bé Ngoan.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onToggleDeliver}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-extrabold transition cursor-pointer ${
              isDelivered
                ? 'border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                : 'border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            {isDelivered ? (
              <>
                <Check size={14} />
                <span>Đã giao Sổ cho PH (Nhấn để thu hồi)</span>
              </>
            ) : (
              <>
                <Share2 size={14} />
                <span>Bàn giao Sổ cho Phụ huynh</span>
              </>
            )}
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={onSaveComment}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-black text-white shadow-md shadow-amber-500/20 hover:bg-amber-600 disabled:opacity-50 transition cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <BookmarkCheck size={16} />
                <span>Lưu nhận xét Sổ Bé Ngoan</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-amber-200/60 flex flex-wrap items-center justify-between gap-3 bg-white/70 rounded-2xl p-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-100 text-pink-700 shadow-2xs">
            <Flower2 size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-slate-800">
                {childAwardInfo ? childAwardInfo.monthFlowerCount : 0}/4 Phiếu Bé Ngoan tháng {month}
              </span>
              {childAwardInfo?.hasMonthlyStar && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-black text-amber-900">
                  <Star size={11} className="fill-amber-500 text-amber-500" /> Ngôi Sao Bé Ngoan Tháng
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {childAwardInfo?.monthFlowers && childAwardInfo.monthFlowers.length > 0 ? (
                <>Đã nhận ngày: <strong className="text-slate-700">{childAwardInfo.monthFlowers.map((f) => f.date.slice(5).replace('-', '/')).join(', ')}</strong></>
              ) : (
                <>Chưa nhận phiếu nào trong tháng {month}</>
              )}
              {' · '}Tổng tích lũy: <strong className="text-slate-800">{childAwardInfo?.totalFlowerCount ?? 0} phiếu</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-amber-50/80 px-3 py-1.5 rounded-xl border border-amber-200/70">
          <span className="text-[11px] font-bold text-amber-800 mr-1">Tiến độ 4 tuần:</span>
          {[1, 2, 3, 4].map((slot) => {
            const earned = (childAwardInfo?.monthFlowerCount ?? 0) >= slot;
            return (
              <span
                key={slot}
                title={`Tuần ${slot}`}
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs transition ${
                  earned
                    ? 'bg-pink-500 text-white font-black shadow-xs'
                    : 'bg-slate-200/80 text-slate-400 font-bold'
                }`}
              >
                {earned ? '🌸' : slot}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
