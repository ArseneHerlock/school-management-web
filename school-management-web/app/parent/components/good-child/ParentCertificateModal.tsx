'use client';

import React from 'react';
import { Printer, X } from 'lucide-react';
import { ChildInfo } from '../../types';

interface ParentCertificateModalProps {
  show: boolean;
  onClose: () => void;
  yearEndAward: any;
  child: ChildInfo;
}

export function ParentCertificateModal({
  show,
  onClose,
  yearEndAward,
  child,
}: ParentCertificateModalProps) {
  if (!show || !yearEndAward) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs font-bold text-slate-500">
            GIẤY KHEN ĐIỆN TỬ CHÍNH THỨC
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1 rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-amber-700 transition cursor-pointer"
            >
              <Printer size={13} /> In giấy khen
            </button>
            <button
              onClick={onClose}
              className="rounded-full bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200 transition cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Certificate Template */}
        <div className="mt-4">
          <div className="relative mx-auto rounded-2xl border-8 border-double border-amber-600 bg-[#fffdfa] p-8 text-center shadow-lg">
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-700">
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
            </p>
            <p className="text-[10px] font-bold text-slate-600 underline underline-offset-4">
              Độc lập - Tự do - Hạnh phúc
            </p>

            <p className="mt-4 text-xs font-bold uppercase tracking-wide text-amber-800">
              TRƯỜNG MẦM NON HOA HƯỚNG DƯƠNG - BAN GIÁM HIỆU
            </p>

            <h2 className="mt-5 text-3xl font-black uppercase tracking-widest text-red-600 drop-shadow-sm font-serif">
              GIẤY KHEN
            </h2>

            <p className="mt-3 text-xs font-medium text-slate-600">
              HIỆU TRƯỞNG TRƯỜNG MẦM NON HOA HƯỚNG DƯƠNG KHEN TẶNG
            </p>

            <p className="mt-3 text-2xl font-black text-slate-800 underline decoration-amber-500 decoration-wavy">
              Bé: {child.hoTen}
            </p>

            <p className="mt-1 text-xs font-bold text-slate-600">
              Học sinh lớp: {child.lop}
            </p>

            <p className="mt-4 text-xs font-medium text-slate-600">
              ĐÃ ĐẠT DANH HIỆU THI ĐUA:
            </p>

            <div className="my-2 inline-block rounded-xl border border-amber-300 bg-amber-50/70 px-6 py-2">
              <p className="text-xl font-black uppercase text-amber-900 tracking-wider">
                {yearEndAward.AwardTitle || yearEndAward.awardTitle}
              </p>
            </div>

            <p className="text-xs font-bold text-slate-600">
              Năm học: {yearEndAward.SchoolYear || yearEndAward.schoolYear}
            </p>

            <div className="mt-8 flex items-end justify-between px-6 text-left">
              <div className="text-[11px] text-slate-500">
                <p className="font-bold text-slate-700">Mã vào sổ khen thưởng:</p>
                <p className="font-mono font-bold text-amber-800">
                  {yearEndAward.CertificateCode ||
                    yearEndAward.certificateCode ||
                    'GK-CHÍNH-THỨC'}
                </p>
              </div>

              <div className="text-center text-xs">
                <p className="italic text-slate-500">
                  Hà Nội, ngày 28 tháng 05 năm 2027
                </p>
                <p className="mt-1 font-black uppercase text-slate-800">
                  HIỆU TRƯỞNG
                </p>
                <div className="relative mx-auto my-1 flex h-16 w-32 items-center justify-center">
                  <div className="rounded-full border-2 border-red-500 px-3 py-2 text-[9px] font-black uppercase text-red-600 rotate-[-8deg] opacity-85">
                    UBND QUẬN
                    <br />
                    MN HOA HƯỚNG DƯƠNG
                    <br />
                    ĐÃ KÝ DUYỆT
                  </div>
                </div>
                <p className="font-bold text-slate-700">NGUYỄN THỊ THU HÀ</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-5 py-2 text-xs font-bold text-white hover:bg-slate-700 transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
