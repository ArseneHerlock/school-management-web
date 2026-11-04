'use client';

import React from 'react';
import {
  Award,
  CheckCircle2,
  Flower2,
  Lock,
  Sparkles,
  Star,
  Trophy,
} from 'lucide-react';
import { activeFlowers, isLarge } from './types';

interface MonthlyHistoryListProps {
  monthlySummary: Array<{
    record: any;
    daily: any[];
    bonus: any[];
  }>;
  totalPeriods: number;
  isRecordDelivered: (record: any) => boolean;
}

export function MonthlyHistoryList({
  monthlySummary,
  totalPeriods,
  isRecordDelivered,
}: MonthlyHistoryListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-black tracking-[.16em] text-slate-400">
            NHẬT KÝ THEO THÁNG
          </p>
          <h3 className="mt-1 text-xl font-black text-slate-800">
            Các kỳ ghi nhận của bé
          </h3>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500">
          {totalPeriods} kỳ
        </span>
      </div>

      {monthlySummary.length ? (
        <div className="space-y-4">
          {monthlySummary.map(({ record, daily, bonus }) => (
            <article
              key={record.id}
              className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 text-amber-600">
                    <Star size={22} fill="currentColor" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-slate-800">
                        Tháng {record.month}/{record.year}
                      </h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isRecordDelivered(record)
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isRecordDelivered(record)
                          ? 'Đã bàn giao'
                          : 'Đang cập nhật'}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      {record.teacherComment
                        ? 'Đã có nhận xét giáo viên'
                        : 'Chưa có nhận xét giáo viên'}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700">
                    <Flower2 size={14} />
                    {daily.length}/4 hoa nhỏ
                  </span>
                  <span className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
                    <Award size={14} />
                    {bonus.length} hoa lớn
                  </span>
                </div>
              </div>
              <div
                style={{
                  gridTemplateColumns: 'minmax(0, .8fr) minmax(0, 1.2fr)',
                }}
                className="mt-5 grid min-w-0 gap-4 lg:grid-cols-2"
              >
                <div className="min-w-0 rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-black text-slate-500">
                    Nhận xét giáo viên
                  </p>
                  {isRecordDelivered(record) ? (
                    <>
                      <p
                        className="mt-2 break-words whitespace-pre-wrap text-sm leading-6 text-slate-700"
                        style={{ overflowWrap: 'anywhere' }}
                      >
                        {record.teacherComment ||
                          'Giáo viên chưa thêm nhận xét cho kỳ này.'}
                      </p>
                      {record.parentFeedback && (
                        <p className="mt-2 text-xs italic text-indigo-600">
                          Phụ huynh: {record.parentFeedback}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="mt-2 text-xs italic text-amber-700 flex items-center gap-1.5 py-1">
                      <Lock size={12} />
                      <span>Chưa bàn giao sổ. Đang chờ giáo viên phát sổ.</span>
                    </p>
                  )}
                </div>
                <div className="min-w-0 space-y-2">
                  {activeFlowers(record).length ? (
                    activeFlowers(record).map((flower: any) => (
                      <div
                        key={flower.id}
                        className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3"
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                            isLarge(flower)
                              ? 'bg-amber-100 text-amber-600'
                              : 'bg-rose-100 text-rose-600'
                          }`}
                        >
                          {isLarge(flower) ? (
                            <Trophy size={19} />
                          ) : (
                            <Flower2 size={19} fill="currentColor" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-bold text-slate-700">
                              {isLarge(flower)
                                ? 'Hoa lớn tự động'
                                : 'Hoa nhỏ thứ 6'}
                            </p>
                            <span className="text-xs text-slate-400">
                              {flower.flowerDate}
                            </span>
                          </div>
                          <p
                            className="mt-1 break-words whitespace-pre-wrap text-xs text-slate-500"
                            style={{ overflowWrap: 'anywhere' }}
                          >
                            {flower.reason ||
                              'Đạt tiêu chuẩn chuyên cần và nề nếp tốt.'}
                          </p>
                        </div>
                        <CheckCircle2
                          size={17}
                          className={
                            isLarge(flower)
                              ? 'shrink-0 text-amber-500'
                              : 'shrink-0 text-rose-400'
                          }
                        />
                      </div>
                    ))
                  ) : (
                    <p className="rounded-2xl border border-dashed border-slate-200 p-5 text-center text-sm text-slate-400">
                      Chưa có lần tặng hoa trong kỳ này.
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
            <Sparkles size={25} />
          </div>
          <h3 className="mt-4 font-black text-slate-700">
            Chưa có sổ theo dõi rèn luyện
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Giáo viên sẽ cập nhật và tổng hợp sổ theo dõi rèn luyện cho bé theo từng tháng.
          </p>
        </div>
      )}
    </div>
  );
}
