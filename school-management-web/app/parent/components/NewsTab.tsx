'use client';

import React, { useState } from 'react';
import { NewsItem } from '../types';

interface NewsTabProps {
  newsList: NewsItem[];
}

export default function NewsTab({ newsList }: NewsTabProps) {
  const [expandedId, setExpandedId] = useState<number | null>(1); // first item expanded by default

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="space-y-4">
      <div className="card-frame p-5">
        <h2 className="text-lg font-extrabold text-slate-800">Tin Tức & Thông Báo Nhà Trường</h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Cập nhật kế hoạch học tập, sự kiện ngoại khóa và thực đơn tuần
        </p>
      </div>

      <div className="space-y-3">
        {newsList.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                item.isImportant
                  ? 'bg-white border-amber-300 shadow-xs'
                  : 'card-frame'
              }`}
            >
              <div
                onClick={() => toggleExpand(item.id)}
                className={`p-4 sm:p-5 flex items-start gap-4 cursor-pointer transition-colors ${
                  item.isImportant ? 'hover:bg-amber-50/30' : 'hover:bg-slate-50'
                }`}
              >
                <span className="text-3xl shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                      {item.category}
                    </span>
                    {item.badge && (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                        {item.badge}
                      </span>
                    )}
                    <span className="text-xs text-slate-400 ml-auto">{item.date}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-base">{item.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{item.summary}</p>
                </div>
                <span
                  className={`text-slate-400 transition-transform duration-200 text-sm ${
                    isExpanded ? 'rotate-180' : 'rotate-0'
                  }`}
                >
                  ▼
                </span>
              </div>

              {isExpanded && (
                <div className="px-5 pb-5 pt-2 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/60">
                  {item.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
