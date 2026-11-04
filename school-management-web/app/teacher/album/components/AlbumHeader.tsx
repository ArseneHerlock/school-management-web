'use client';

import React from 'react';
import { Camera } from 'lucide-react';

interface AlbumHeaderProps {
  classNameTitle: string;
  totalPhotos: number;
  onOpenPostModal: () => void;
}

export function AlbumHeader({
  classNameTitle,
  totalPhotos,
  onOpenPostModal,
}: AlbumHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-orange-100 bg-white p-6 shadow-xs">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200/60">
            ALBUM & KHOẢNH KHẮC LỚP
          </span>
          <span className="text-xs text-slate-400 font-bold">
            · Lớp {classNameTitle}
          </span>
        </div>
        <h1 className="text-2xl font-black text-slate-800 mt-1">
          Khoảnh Khắc Sinh Hoạt & Học Tập
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Tổng cộng: <b>{totalPhotos}</b> khoảnh khắc trong hệ thống. Thầy/Cô và phụ huynh có thể lọc theo hoạt động, tháng và đối tượng.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenPostModal}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-xs font-black text-white shadow-md shadow-orange-500/25 hover:from-orange-600 hover:to-amber-600 cursor-pointer transition transform hover:-translate-y-0.5"
        >
          <Camera size={16} />
          <span>Đăng khoảnh khắc mới</span>
        </button>
      </div>
    </header>
  );
}
