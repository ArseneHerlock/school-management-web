"use client";

import React from "react";
import {
  History,
  X,
  Trash2,
  Clock,
  Activity,
} from "lucide-react";
import { Student, RecordRow } from "../types";
import WhoGrowthChart from "@/app/components/WhoGrowthChart";

interface FormState {
  height: string;
  weight: string;
  note: string;
  checkupDate: string;
  quarterName: string;
}

interface SucKhoeDetailModalProps {
  selected: Student;
  className: string;
  history: RecordRow[];
  historyChart: Array<{
    date: string;
    height: number;
    weight: number;
    bmi: number;
  }>;
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  busy: boolean;
  onClose: () => void;
  onSave: () => void;
  onRemove: (id: string) => void;
}

export const SucKhoeDetailModal: React.FC<SucKhoeDetailModalProps> = ({
  selected,
  className,
  history,
  onClose,
  onRemove,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        onClick={(e) => e.stopPropagation()}
        className="admin-card max-h-[90vh] overflow-y-auto max-w-5xl w-full p-6 border-2 border-indigo-500 shadow-xl space-y-6 bg-white rounded-2xl"
      >
        {/* Header Modal */}
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <History className="text-indigo-600" size={24} />
              <h2 className="text-xl font-black text-slate-900">
                Chi tiết Thể trạng & Lịch sử Khám Sức Khỏe ( 0 - 5 Tuổi)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Học sinh: <b className="text-slate-800">{selected.tenHocSinh}</b>{" "}
              ({className}) · Giới tính:{" "}
              <b className="text-slate-700">{selected.gioiTinh}</b> · Ngày sinh:{" "}
              {String(selected.ngaySinh).slice(0, 10)}
            </p>
          </div>
          <button onClick={onClose} className="icon-btn">
            <X size={18} />
          </button>
        </div>

        {/* Biểu đồ Đường Cong Tăng Trưởng Xuyên Suốt Chuẩn WHO */}
        <div>
          <h3 className="text-sm font-black text-slate-800 mb-3 flex items-center gap-2">
            <Activity size={18} className="text-indigo-600" />
            Biểu đồ tăng trưởng xuyên suốt (HAZ, WAZ, WHZ) so với đường cong
            chuẩn WHO
          </h3>
          <WhoGrowthChart
            childId={selected.id}
            records={history as any}
            gender={selected.gioiTinh}
            dob={selected.ngaySinh}
            studentName={selected.tenHocSinh}
            height={320}
          />
        </div>

        {/* Bảng lịch sử */}
        <div className="border-t border-slate-100 pt-5">
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <Clock size={16} className="text-indigo-600" /> Bảng lịch sử các
              đợt đo
            </h3>
            <div className="overflow-x-auto max-h-[300px] border border-slate-200 rounded-2xl">
              <table className="admin-table">
                <thead className="sticky top-0 bg-slate-50 z-10">
                  <tr>
                    <th>Ngày đo</th>
                    <th>Chiều cao</th>
                    <th>Cân nặng</th>
                    <th>Chiều cao / Tuổi</th>
                    <th>Cân nặng / Tuổi</th>
                    <th>Thể trạng</th>
                    <th className="text-right">Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((x) => {
                    return (
                      <tr key={x.id}>
                        <td className="font-semibold">
                          {String(x.ngayDo).slice(0, 10)}
                        </td>
                        <td>
                          <b>{x.chieuCao ?? "—"}</b> cm
                        </td>
                        <td>
                          <b>{x.canNang ?? "—"}</b> kg
                        </td>
                        <td>
                          <span className="text-xs font-semibold text-slate-800">
                            {x.ketLuanHaz || (x.haz != null ? (x.haz < -2 ? "Thấp còi" : "Đạt chuẩn") : "—")}
                          </span>
                        </td>
                        <td>
                          <span className="text-xs font-semibold text-slate-800">
                            {x.ketLuanWaz || (x.waz != null ? (x.waz < -2 ? "Nhẹ cân" : "Đạt chuẩn") : "—")}
                          </span>
                        </td>
                        <td>
                          <span className="text-xs font-semibold text-slate-800">
                            {x.ketLuanWhz || (x.whz != null ? (x.whz < -2 ? "Gầy còm" : "Cân đối") : "—")}
                          </span>
                        </td>
                        <td className="text-right">
                          <button
                            onClick={() => onRemove(x.id)}
                            className="icon-btn danger"
                            title="Xóa đợt khám này"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {!history.length && (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-8 text-center text-slate-400"
                      >
                        Chưa có lịch sử đợt khám sức khỏe nào cho học sinh này.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SucKhoeDetailModal;
