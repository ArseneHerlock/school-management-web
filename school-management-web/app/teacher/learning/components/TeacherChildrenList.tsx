'use client';

import React from 'react';
import { Search, RefreshCw, Loader2, Sparkles } from 'lucide-react';
import { Child } from '../../data';
import Avatar from '../../components/Avatar';

interface TeacherChildrenListProps {
  classNameTitle: string;
  loading: boolean;
  onRefresh: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filteredChildren: Child[];
  totalChildrenCount: number;
  childProductCountMap: Map<string, number>;
  onSelectChild: (c: Child) => void;
}

export function TeacherChildrenList({
  classNameTitle,
  loading,
  onRefresh,
  searchQuery,
  onSearchChange,
  filteredChildren,
  totalChildrenCount,
  childProductCountMap,
  onSelectChild,
}: TeacherChildrenListProps) {
  return (
    <div className="space-y-6">
      {/* Header Trang */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-orange-100 bg-white p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200/60">
              GÓC SẢN PHẨM HỌC TẬP CỦA BÉ
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              · Lớp {classNameTitle}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 mt-1">
            Sản Phẩm & Sáng Tạo Của Từng Bé
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Chọn một học sinh trong danh sách lớp bên dưới để xem hoặc đăng hình ảnh, video sản phẩm của riêng bé đó.
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2 rounded-2xl border border-orange-200 bg-white px-4 py-2 text-xs font-black text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition shadow-2xs cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin text-orange-500' : ''} />
          <span>Đồng bộ danh sách</span>
        </button>
      </header>

      {/* Thanh tìm kiếm bé */}
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-orange-100 bg-white p-4 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm bé theo họ tên hoặc tên gọi ở nhà..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2 text-xs font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-orange-400 focus:bg-white transition"
          />
        </div>

        <div className="text-xs font-black text-slate-600">
          Sĩ số: <span className="text-orange-600">{totalChildrenCount} bé</span>
        </div>
      </div>

      {/* Lưới các Card học sinh */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 bg-white rounded-3xl border border-orange-100 shadow-sm">
          <Loader2 size={36} className="animate-spin text-orange-500 mb-3" />
          <p className="text-xs font-bold text-slate-600">Đang tải danh sách học sinh của lớp...</p>
        </div>
      ) : filteredChildren.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-14 text-center">
          <p className="text-xs font-bold text-slate-400">
            {searchQuery
              ? 'Không tìm thấy bé nào khớp với từ khóa tìm kiếm.'
              : 'Chưa có học sinh nào trong lớp được phân công.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredChildren.map((child) => {
            const targetApiId = String(child.apiId || child.id).toLowerCase();
            const productCount = childProductCountMap.get(targetApiId) || 0;

            return (
              <button
                key={child.id}
                onClick={() => onSelectChild(child)}
                className="group text-left rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-orange-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <Avatar initials={child.avatar} id={child.id} size="lg" />
                    <span
                      className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black text-white ${
                        child.gender === 'F' ? 'bg-rose-400' : 'bg-blue-400'
                      }`}
                    >
                      {child.gender === 'F' ? '♀' : '♂'}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-black text-base text-slate-800 group-hover:text-orange-600 transition truncate">
                      {child.name}
                    </h3>

                    {child.nickname && (
                      <p className="text-xs font-bold text-orange-600 mt-0.5">
                        Biệt danh: {child.nickname}
                      </p>
                    )}

                    <p className="text-[11px] text-slate-400 font-semibold mt-1">
                      {child.dob ? `Sinh ngày: ${child.dob}` : 'Học sinh mầm non'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black ${
                      productCount > 0
                        ? 'bg-orange-50 text-orange-700 border border-orange-200/60'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <Sparkles size={12} className={productCount > 0 ? 'text-orange-500' : ''} />
                    <span>{productCount} sản phẩm</span>
                  </span>

                  <span className="text-xs font-black text-orange-600 group-hover:underline">
                    Mở góc bé →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
