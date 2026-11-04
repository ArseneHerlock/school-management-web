'use client';

import React from 'react';
import { HeartHandshake, ShieldCheck, Clock, AlertCircle } from 'lucide-react';
import { DailyAuth } from '../types';

interface DailyAuthFormProps {
  dailyForm: {
    pickupPersonName: string;
    relationship: string;
    phoneNumber: string;
    idCardNumber: string;
    expectedTime: string;
    parentNote: string;
  };
  setDailyForm: React.Dispatch<
    React.SetStateAction<{
      pickupPersonName: string;
      relationship: string;
      phoneNumber: string;
      idCardNumber: string;
      expectedTime: string;
      parentNote: string;
    }>
  >;
  onSubmit: (e: React.FormEvent) => void;
  todayAuth: DailyAuth | null;
}

export function DailyAuthForm({
  dailyForm,
  setDailyForm,
  onSubmit,
  todayAuth,
}: DailyAuthFormProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <h2 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
            <HeartHandshake className="text-teal-600" /> Tạo giấy ủy quyền đón hộ hôm nay
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Áp dụng khi Bố Mẹ bận việc đột xuất và nhờ người thân khác (ông bà, cô chú, bác ruột...) đến trường đón hộ hôm nay.
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Họ và tên người đón hôm nay *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Bác Nguyễn Văn Thành"
                  value={dailyForm.pickupPersonName}
                  onChange={(e) =>
                    setDailyForm({ ...dailyForm, pickupPersonName: e.target.value })
                  }
                  className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mối quan hệ với bé *
                </label>
                <select
                  value={dailyForm.relationship}
                  onChange={(e) => setDailyForm({ ...dailyForm, relationship: e.target.value })}
                  className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-teal-600 cursor-pointer"
                >
                  <option value="Bố">Bố</option>
                  <option value="Mẹ">Mẹ</option>
                  <option value="Ông nội">Ông nội</option>
                  <option value="Bà nội">Bà nội</option>
                  <option value="Ông ngoại">Ông ngoại</option>
                  <option value="Bà ngoại">Bà ngoại</option>
                  <option value="Bác ruột">Bác ruột</option>
                  <option value="Cô / Chú / Dì">Cô / Chú / Dì</option>
                  <option value="Người giúp việc">Người giúp việc</option>
                  <option value="Tài xế quen">Tài xế quen</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Số điện thoại người đón *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: 0912 345 678"
                  value={dailyForm.phoneNumber}
                  onChange={(e) => setDailyForm({ ...dailyForm, phoneNumber: e.target.value })}
                  className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Giờ đón dự kiến
                </label>
                <input
                  type="time"
                  value={dailyForm.expectedTime}
                  onChange={(e) => setDailyForm({ ...dailyForm, expectedTime: e.target.value })}
                  className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-teal-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ghi chú dặn dò giáo viên (Đặc điểm nhận diện)
              </label>
              <textarea
                rows={3}
                placeholder="Ví dụ: Bác đi xe Wave đỏ biển số 29X... đón lúc 16h45 do bố mẹ bận đi công tác."
                value={dailyForm.parentNote}
                onChange={(e) => setDailyForm({ ...dailyForm, parentNote: e.target.value })}
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 p-3 focus:outline-teal-600"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-teal-600 text-white text-xs sm:text-sm font-bold shadow hover:bg-teal-700 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck size={16} /> Gửi giấy ủy quyền đón hôm nay
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Cột hiển thị trạng thái hôm nay */}
      <div>
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs sticky top-6">
          <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Clock className="text-teal-600" size={18} /> Trạng thái đón hôm nay
          </h3>

          {todayAuth ? (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-2xl border ${
                  todayAuth.Status === 'DA_DON'
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-purple-50 border-purple-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                    {todayAuth.Relationship}
                  </span>
                  <span
                    className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                      todayAuth.Status === 'DA_DON'
                        ? 'bg-emerald-200 text-emerald-800'
                        : 'bg-purple-200 text-purple-900 animate-pulse'
                    }`}
                  >
                    {todayAuth.Status === 'DA_DON' ? 'Đã giao bé an toàn' : 'Đang chờ đón'}
                  </span>
                </div>

                <h4 className="text-base font-black text-slate-900">
                  {todayAuth.PickupPersonName}
                </h4>
                {todayAuth.PhoneNumber && (
                  <p className="text-xs text-slate-600 mt-1">
                    SĐT: <strong>{todayAuth.PhoneNumber}</strong>
                  </p>
                )}
                {todayAuth.ExpectedTime && (
                  <p className="text-xs text-slate-600 mt-0.5">
                    Giờ đón dự kiến: <strong>{todayAuth.ExpectedTime}</strong>
                  </p>
                )}
                {todayAuth.ParentNote && (
                  <p className="text-xs text-slate-500 italic mt-2 bg-white/80 p-2.5 rounded-xl border border-purple-100">
                    "{todayAuth.ParentNote}"
                  </p>
                )}

                {todayAuth.Status === 'DA_DON' && (
                  <div className="mt-3 pt-3 border-t border-emerald-200 text-xs text-emerald-800 font-semibold space-y-1">
                    <div>
                      ✓ Giáo viên xác nhận:{' '}
                      <strong>{todayAuth.TeacherConfirmedBy || 'Giáo viên chủ nhiệm'}</strong>
                    </div>
                    <div>
                      ✓ Lúc:{' '}
                      {new Date(
                        todayAuth.ActualPickupTime || Date.now()
                      ).toLocaleTimeString('vi-VN')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <AlertCircle size={32} className="mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-semibold text-slate-500">
                Chưa có ủy quyền đột xuất cho ngày hôm nay.
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Bé sẽ được đón bởi Bố Mẹ hoặc người đón chính đã đăng ký.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
