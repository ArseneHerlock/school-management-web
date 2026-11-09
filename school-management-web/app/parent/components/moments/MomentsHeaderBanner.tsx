'use client';

import React from 'react';
import { Camera } from 'lucide-react';

interface MomentsHeaderBannerProps {
  childName?: string;
  classNameProp?: string;
}

export function MomentsHeaderBanner({
  childName,
  classNameProp,
}: MomentsHeaderBannerProps) {
  return (
    <div className="card-frame p-4 sm:p-5 flex items-center justify-between gap-3 bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 border-sky-100 rounded-2xl sm:rounded-3xl">
      <div>
        <h2 className="text-base sm:text-lg font-bold text-slate-800">
          Khoảnh khắc của bé {childName ? `— ${childName}` : ''}
        </h2>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sky-600 shadow-xs border border-sky-100 shrink-0">
        <Camera size={20} />
      </div>
    </div>
  );
}
