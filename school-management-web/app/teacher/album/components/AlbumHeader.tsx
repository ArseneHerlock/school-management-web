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
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-orange-100 bg-white p-5 sm:p-6 shadow-xs">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
          Album ảnh {classNameTitle ? `— ${classNameTitle}` : ''}
        </h1>
        <p className="mt-0.5 text-xs text-slate-500 font-medium">
          {totalPhotos} hình ảnh
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenPostModal}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-xs font-black text-white shadow-md shadow-orange-500/25 hover:from-orange-600 hover:to-amber-600 cursor-pointer transition transform hover:-translate-y-0.5"
        >
          <Camera size={16} />
          <span>Thêm hình ảnh hoạt động</span>
        </button>
      </div>
    </header>
  );
}
