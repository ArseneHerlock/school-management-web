'use client';

import React from 'react';
import { Plus, ShieldCheck, Phone, CreditCard, CheckCircle2, Trash2 } from 'lucide-react';
import { AuthorizedPerson, getInitials } from '../types';

interface PickupRegisteredListProps {
  persons: AuthorizedPerson[];
  loading: boolean;
  onOpenModal: () => void;
  onDeletePerson: (id?: string) => void;
}

export function PickupRegisteredList({
  persons,
  loading,
  onOpenModal,
  onDeletePerson,
}: PickupRegisteredListProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            Hồ sơ người thân được phép đón bé
          </h2>
          <p className="text-xs text-slate-500">
            Bao gồm Bố, Mẹ theo hồ sơ nhập học và các người thân khác (Ông, Bà, Bác,...) được gia đình đăng ký thêm.
          </p>
        </div>
        <button
          onClick={onOpenModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 text-white text-sm font-bold shadow hover:bg-indigo-700 transition cursor-pointer"
        >
          <Plus size={16} /> Thêm người thân đón bé
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400">Đang tải danh sách người đón...</div>
      ) : persons.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <ShieldCheck size={48} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-600 font-semibold">Chưa có người đón nào được đăng ký.</p>
          <p className="text-slate-400 text-xs mt-1">
            Hãy đăng ký ngay Bố, Mẹ hoặc Ông Bà để giáo viên nhận diện chính xác khi tan trường.
          </p>
          <button
            onClick={onOpenModal}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow cursor-pointer"
          >
            <Plus size={14} /> Đăng ký người đón
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {persons.map((p, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                      p.IsOfficialParent
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                    }`}
                  >
                    {p.IsOfficialParent ? 'Phụ huynh chính thức' : 'Người thân ủy quyền'}
                  </span>

                  {p.IsDefault && (
                    <span className="bg-indigo-100 text-indigo-800 font-extrabold text-[10px] px-2.5 py-0.5 rounded-md">
                      Mặc định
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-800 font-black flex items-center justify-center text-base border-2 border-indigo-200 shadow-xs shrink-0">
                    {getInitials(p.FullName)}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                      {p.Relationship}
                    </span>
                    <h3 className="font-black text-slate-900 text-base leading-tight truncate">
                      {p.FullName}
                    </h3>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
                  {p.PhoneNumber && (
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-slate-400 shrink-0" />
                      <span>
                        SĐT: <strong className="text-slate-800 font-bold">{p.PhoneNumber}</strong>
                      </span>
                    </div>
                  )}
                  {p.IdCardNumber && (
                    <div className="flex items-center gap-2">
                      <CreditCard size={14} className="text-slate-400 shrink-0" />
                      <span>
                        CCCD: <strong className="text-slate-800 font-bold">{p.IdCardNumber}</strong>
                      </span>
                    </div>
                  )}
                  {p.Notes && (
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-600 text-[11px] leading-relaxed">
                      <strong>Ghi chú:</strong> {p.Notes}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 size={12} /> Hợp lệ đón bé
                </span>
                {!p.IsOfficialParent && p.Id && (
                  <button
                    onClick={() => onDeletePerson(p.Id)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                    title="Hủy ủy quyền người này"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
