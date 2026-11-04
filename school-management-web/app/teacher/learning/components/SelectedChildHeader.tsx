'use client';

import React from 'react';
import { ArrowLeft, X, Plus } from 'lucide-react';
import { Child } from '../../data';
import Avatar from '../../components/Avatar';

interface SelectedChildHeaderProps {
  selectedChild: Child;
  classNameTitle: string;
  productCount: number;
  showAddForm: boolean;
  onToggleAddForm: () => void;
  onBack: () => void;
}

export function SelectedChildHeader({
  selectedChild,
  classNameTitle,
  productCount,
  showAddForm,
  onToggleAddForm,
  onBack,
}: SelectedChildHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-orange-100 bg-white p-6 shadow-xs">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100 transition cursor-pointer"
          title="Quay lại danh sách học sinh"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="relative">
          <Avatar initials={selectedChild.avatar} id={selectedChild.id} size="lg" />
          <span
            className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black text-white ${
              selectedChild.gender === 'F' ? 'bg-rose-400' : 'bg-blue-400'
            }`}
          >
            {selectedChild.gender === 'F' ? '♀' : '♂'}
          </span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200/60">
              Góc sản phẩm của bé
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              · Lớp {classNameTitle}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 mt-0.5">
            {selectedChild.name}
            {selectedChild.nickname && (
              <span className="text-orange-600 font-bold ml-2">
                ({selectedChild.nickname})
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            {selectedChild.dob ? `Sinh ngày: ${selectedChild.dob}` : 'Học sinh mầm non'} ·{' '}
            <strong className="text-orange-600">
              {productCount} sản phẩm sáng tạo
            </strong>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onToggleAddForm}
          className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-black transition-all cursor-pointer ${
            showAddForm
              ? 'bg-slate-800 text-white shadow-xs'
              : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm shadow-orange-500/30 hover:from-orange-600 hover:to-amber-600'
          }`}
        >
          {showAddForm ? <X size={16} /> : <Plus size={16} />}
          <span>{showAddForm ? 'Đóng biểu mẫu' : 'Đăng sản phẩm mới'}</span>
        </button>
      </div>
    </div>
  );
}
