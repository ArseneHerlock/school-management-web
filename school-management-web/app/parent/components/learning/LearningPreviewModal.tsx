'use client';

import React from 'react';

interface LearningPreviewModalProps {
  activePreview: { url: string; title: string; desc?: string } | null;
  onClose: () => void;
}

export function LearningPreviewModal({
  activePreview,
  onClose,
}: LearningPreviewModalProps) {
  if (!activePreview) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative max-w-lg w-full bg-white rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative max-h-[70vh] bg-slate-900 flex items-center justify-center overflow-hidden">
          <img
            src={activePreview.url}
            alt={activePreview.title}
            className="max-h-[70vh] w-auto max-w-full object-contain"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div className="p-5">
          <h3 className="text-base font-black text-slate-800">
            {activePreview.title}
          </h3>
          {activePreview.desc && (
            <p className="mt-2 text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
              {activePreview.desc}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
