"use client";

import React from "react";
import { Newspaper, ArrowRight, ShieldCheck } from "lucide-react";

interface DashboardNewsPortalProps {
  latestNews: any[];
  onNavigate: (id: string) => void;
}

export function DashboardNewsPortal({
  latestNews,
  onNavigate,
}: DashboardNewsPortalProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <section className="admin-card p-5 lg:col-span-2">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Newspaper size={18} className="text-emerald-600" />
            <h2 className="font-black text-slate-800">
              Thông báo & Bản tin Nội bộ
            </h2>
          </div>
          <button
            onClick={() => onNavigate("tin-tuc")}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
          >
            Xem tất cả <ArrowRight size={13} className="inline" />
          </button>
        </div>

        {latestNews.length ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {latestNews.map((n: any, i: number) => (
              <div
                key={n.id || i}
                onClick={() => onNavigate("tin-tuc")}
                className="rounded-2xl border border-slate-200/80 p-3.5 hover:bg-emerald-50/40 hover:border-emerald-300 transition cursor-pointer"
              >
                <p className="text-xs font-black text-slate-800 line-clamp-2">
                  {n.tieuDe || n.title || "Thông báo từ Ban Giám Hiệu"}
                </p>
                <p className="mt-2 text-[11px] text-slate-400">
                  {n.ngayTao || n.ngayXuatBan || "Hôm nay"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-5 text-sm text-slate-400">Chưa có thông báo mới.</p>
        )}
      </section>

      {/* Cổng Phân quyền & Vận hành */}
      <section className="admin-card p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <ShieldCheck size={18} className="text-emerald-600" />
            <h2 className="font-bold text-slate-800">
              Cổng chức năng quản trị
            </h2>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <button
            onClick={() => onNavigate("hoc-sinh")}
            className="w-full flex items-center justify-between rounded-xl bg-slate-50 p-2.5 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition cursor-pointer"
          >
            <span>Hồ sơ & Phân lớp Học sinh</span>
            <ArrowRight size={13} />
          </button>
          <button
            onClick={() => onNavigate("phu-huynh")}
            className="w-full flex items-center justify-between rounded-xl bg-slate-50 p-2.5 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition cursor-pointer"
          >
            <span>Quản lý Tài khoản Phụ huynh</span>
            <ArrowRight size={13} />
          </button>
          <button
            onClick={() => onNavigate("nhan-su")}
            className="w-full flex items-center justify-between rounded-xl bg-slate-50 p-2.5 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition cursor-pointer"
          >
            <span>Hồ sơ Giáo viên & Nhân sự</span>
            <ArrowRight size={13} />
          </button>
          <button
            onClick={() => onNavigate("bao-cao")}
            className="w-full flex items-center justify-between rounded-xl bg-emerald-600 p-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition cursor-pointer"
          >
            <span>Trung tâm Báo cáo Tổng hợp</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </section>
    </div>
  );
}
