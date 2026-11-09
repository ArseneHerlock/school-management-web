"use client";

import React from "react";
import { SCHEDULE_TYPES } from "../types";

interface LichHocDetailFieldsProps {
  form: {
    type: number;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    classId: string;
    isSchoolWide: boolean;
    teacherName: string;
    description: string;
  };
  setForm: React.Dispatch<React.SetStateAction<any>>;
  classes: any[];
}

export default function LichHocDetailFields({
  form,
  setForm,
  classes,
}: LichHocDetailFieldsProps) {
  return (
    <>
      <div>
        <label className="text-xs font-bold text-slate-700">
          Áp dụng cho đối tượng *
        </label>
        <div className="mt-1.5 flex items-center gap-4">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="radio"
              checked={form.isSchoolWide}
              onChange={() =>
                setForm((p: any) => ({ ...p, isSchoolWide: true, classId: "" }))
              }
              className="text-emerald-600 focus:ring-emerald-500"
            />
            <span>Toàn trường</span>
          </label>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="radio"
              checked={!form.isSchoolWide}
              onChange={() =>
                setForm((p: any) => ({
                  ...p,
                  isSchoolWide: false,
                  classId: classes[0]?.id || "",
                }))
              }
              className="text-emerald-600 focus:ring-emerald-500"
            />
            <span>Theo từng lớp</span>
          </label>
        </div>
        {!form.isSchoolWide && (
          <select
            value={form.classId}
            onChange={(e) =>
              setForm((p: any) => ({ ...p, classId: e.target.value }))
            }
            className="mt-2 w-full rounded-xl border border-emerald-200 p-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-emerald-400"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.tenLop} {c.phongHoc ? `(${c.phongHoc})` : ""}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-bold text-slate-700">Ngày diễn ra *</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) =>
              setForm((p: any) => ({ ...p, date: e.target.value }))
            }
            className="mt-1 w-full rounded-xl border border-emerald-200 p-2 text-xs font-bold text-slate-800 outline-none focus:border-emerald-400"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-700">Giờ bắt đầu *</label>
          <input
            type="time"
            value={form.startTime}
            onChange={(e) =>
              setForm((p: any) => ({ ...p, startTime: e.target.value }))
            }
            className="mt-1 w-full rounded-xl border border-emerald-200 p-2 text-xs font-bold text-slate-800 outline-none focus:border-emerald-400"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-700">Giờ kết thúc *</label>
          <input
            type="time"
            value={form.endTime}
            onChange={(e) =>
              setForm((p: any) => ({ ...p, endTime: e.target.value }))
            }
            className="mt-1 w-full rounded-xl border border-emerald-200 p-2 text-xs font-bold text-slate-800 outline-none focus:border-emerald-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-slate-700">
            Phân loại hoạt động
          </label>
          <select
            value={form.type}
            onChange={(e) =>
              setForm((p: any) => ({ ...p, type: Number(e.target.value) }))
            }
            className="mt-1 w-full rounded-xl border border-emerald-200 p-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-emerald-400"
          >
            {SCHEDULE_TYPES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-700">
            Địa điểm tổ chức
          </label>
          <input
            type="text"
            value={form.location}
            onChange={(e) =>
              setForm((p: any) => ({ ...p, location: e.target.value }))
            }
            placeholder="VD: Phòng Nghệ thuật A201, Sân cỏ..."
            className="mt-1 w-full rounded-xl border border-emerald-200 p-2.5 text-xs outline-none focus:border-emerald-400"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-slate-700">
          Giáo viên phụ trách
        </label>
        <input
          type="text"
          value={form.teacherName}
          onChange={(e) =>
            setForm((p: any) => ({ ...p, teacherName: e.target.value }))
          }
          placeholder="VD: Cô Nguyễn Thị Hoa..."
          className="mt-1 w-full rounded-xl border border-emerald-200 p-2.5 text-xs outline-none focus:border-emerald-400"
        />
      </div>

      <div>
        <label className="text-xs font-bold text-slate-700">Mô tả nội dung</label>
        <textarea
          rows={2}
          value={form.description}
          onChange={(e) =>
            setForm((p: any) => ({ ...p, description: e.target.value }))
          }
          placeholder="Ghi chú chi tiết về bài học, mục tiêu hoặc chuẩn bị đạo cụ..."
          className="mt-1 w-full rounded-xl border border-emerald-200 p-2.5 text-xs outline-none focus:border-emerald-400"
        />
      </div>
    </>
  );
}
