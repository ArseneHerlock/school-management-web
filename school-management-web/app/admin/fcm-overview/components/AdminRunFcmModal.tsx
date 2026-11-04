"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, Loader2, CheckCircle2, AlertCircle, Compass, Users } from "lucide-react";
import { runClassFCM } from "@/services/awards";
import { getGrades, getClasses, currentUser } from "@/services";

interface AdminRunFcmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultMonth: number;
  defaultYear: number;
}

export function AdminRunFcmModal({
  isOpen,
  onClose,
  onSuccess,
  defaultMonth,
  defaultYear,
}: AdminRunFcmModalProps) {
  const [scope, setScope] = useState<"ALL" | "GRADE" | "CLASS">("ALL");
  const [grades, setGrades] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedGradeId, setSelectedGradeId] = useState<string>("");
  const [selectedClassId, setSelectedClassId] = useState<string>("");

  const [month, setMonth] = useState<number>(defaultMonth);
  const [year, setYear] = useState<number>(defaultYear);
  const [intakeMode, setIntakeMode] = useState<"INTAKE_BASELINE" | "EXISTING_DATA">("INTAKE_BASELINE");

  const [running, setRunning] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setError("");
      setSuccessMsg("");
      Promise.all([
        getGrades().catch(() => []),
        getClasses().catch(() => []),
      ]).then(([gr, cl]) => {
        setGrades(Array.isArray(gr) ? gr : []);
        setClasses(Array.isArray(cl) ? cl : []);
        if (Array.isArray(gr) && gr.length > 0) setSelectedGradeId((gr[0] as any).id || (gr[0] as any).Id || "");
        if (Array.isArray(cl) && cl.length > 0) setSelectedClassId((cl[0] as any).id || (cl[0] as any).Id || "");
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleExecute = async () => {
    setRunning(true);
    setError("");
    setSuccessMsg("");

    try {
      const activeUser = currentUser();
      const adminUserId = (activeUser as any)?.id || (activeUser as any)?.userId || "";

      const payload: any = {
        scope,
        month,
        year,
        evaluatedBy: adminUserId,
      };

      if (scope === "GRADE") {
        payload.gradeId = selectedGradeId;
      } else if (scope === "CLASS") {
        payload.classId = selectedClassId;
      }

      const res = await runClassFCM(payload);
      setSuccessMsg(res.message || "Phân cụm học sinh thành công!");
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Lỗi khi chạy thuật toán phân cụm.");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-indigo-50/70 to-purple-50/70">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
              <Sparkles size={20} />
            </span>
            <div>
              <h2 className="text-base font-black text-slate-800">
                Chạy Phân Loại Trẻ Bằng Thuật Toán FCM
              </h2>
              <p className="text-xs text-slate-500">
                Nghiệp vụ Ban Giám Hiệu: Khảo sát & phân cụm đặc trưng đầu năm học để xếp lớp
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={running}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-white hover:text-slate-700 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs font-sans">
          {error && (
            <div className="flex items-center gap-2 rounded-2xl bg-rose-50 border border-rose-200 p-3 text-rose-700">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-emerald-700 font-bold">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Scope Selection */}
          <div className="space-y-2">
            <label className="font-extrabold text-slate-700 block">
              1. Chọn phạm vi thực hiện phân cụm:
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setScope("ALL")}
                className={`p-3 rounded-2xl border text-left transition flex flex-col gap-1 cursor-pointer ${
                  scope === "ALL"
                    ? "border-indigo-600 bg-indigo-50/60 text-indigo-900 shadow-2xs font-bold"
                    : "border-slate-200 hover:border-slate-300 text-slate-700"
                }`}
              >
                <span className="font-black text-xs">Toàn trường</span>
                <span className="text-[11px] text-slate-500">Tất cả trẻ đầu năm học</span>
              </button>

              <button
                type="button"
                onClick={() => setScope("GRADE")}
                className={`p-3 rounded-2xl border text-left transition flex flex-col gap-1 cursor-pointer ${
                  scope === "GRADE"
                    ? "border-indigo-600 bg-indigo-50/60 text-indigo-900 shadow-2xs font-bold"
                    : "border-slate-200 hover:border-slate-300 text-slate-700"
                }`}
              >
                <span className="font-black text-xs">Theo Khối</span>
                <span className="text-[11px] text-slate-500">Mầm, Chồi hoặc Lá</span>
              </button>

              <button
                type="button"
                onClick={() => setScope("CLASS")}
                className={`p-3 rounded-2xl border text-left transition flex flex-col gap-1 cursor-pointer ${
                  scope === "CLASS"
                    ? "border-indigo-600 bg-indigo-50/60 text-indigo-900 shadow-2xs font-bold"
                    : "border-slate-200 hover:border-slate-300 text-slate-700"
                }`}
              >
                <span className="font-black text-xs">Theo Lớp</span>
                <span className="text-[11px] text-slate-500">Từng lớp cụ thể</span>
              </button>
            </div>
          </div>

          {/* Conditional Dropdown for Grade or Class */}
          {scope === "GRADE" && (
            <div className="space-y-1.5 animate-in fade-in duration-150">
              <label className="font-bold text-slate-700">Chọn khối học:</label>
              <select
                value={selectedGradeId}
                onChange={(e) => setSelectedGradeId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-bold text-slate-800 outline-none focus:border-indigo-500"
              >
                {grades.map((g) => (
                  <option key={g.id || g.Id} value={g.id || g.Id}>
                    {g.tenKhoi || g.name || "Khối mầm non"}
                  </option>
                ))}
              </select>
            </div>
          )}

          {scope === "CLASS" && (
            <div className="space-y-1.5 animate-in fade-in duration-150">
              <label className="font-bold text-slate-700">Chọn lớp học:</label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-bold text-slate-800 outline-none focus:border-indigo-500"
              >
                {classes.map((c) => (
                  <option key={c.id || c.Id} value={c.id || c.Id}>
                    {c.tenLop || c.name || "Lớp học"}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Time Selector */}
          <div className="space-y-1.5">
            <label className="font-extrabold text-slate-700">
              2. Kỳ khảo sát / Đợt phân cụm:
            </label>
            <div className="flex items-center gap-2">
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2 font-bold text-slate-700 outline-none cursor-pointer bg-slate-50"
              >
                {[
                  { m: 9, label: "Tháng 9 (Đầu năm học mới)" },
                  { m: 10, label: "Tháng 10" },
                  { m: 11, label: "Tháng 11" },
                  { m: 12, label: "Tháng 12 (Sơ kết HK1)" },
                  { m: 1, label: "Tháng 1" },
                  { m: 2, label: "Tháng 2" },
                  { m: 3, label: "Tháng 3" },
                  { m: 4, label: "Tháng 4" },
                  { m: 5, label: "Tháng 5 (Tổng kết năm)" },
                ].map((item) => (
                  <option key={item.m} value={item.m}>
                    {item.label}
                  </option>
                ))}
              </select>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-28 rounded-xl border border-slate-200 px-3 py-2 font-bold text-slate-700 outline-none cursor-pointer bg-slate-50"
              >
                {[2025, 2026, 2027].map((y) => (
                  <option key={y} value={y}>
                    Năm {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Methodology Info Box */}
          <div className="rounded-2xl bg-indigo-50/70 border border-indigo-100 p-3.5 space-y-1.5 text-slate-600 leading-relaxed">
            <div className="flex items-center gap-1.5 font-black text-indigo-900 text-xs">
              <Compass size={14} className="text-indigo-600" />
              <span>Dữ liệu khảo sát đầu năm & Thuật toán FCM</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Thuật toán tự động đọc tập dữ liệu từ <strong>Phiếu khảo sát đặc điểm phát triển đầu vào (Intake Survey)</strong> khi trẻ nhập học. Admin chỉ cần bấm nút để hệ thống tự động gom nhóm, phục vụ phân lớp đầu năm:
            </p>
            <ul className="text-[11px] list-disc list-inside space-y-0.5 text-slate-700 font-medium pt-0.5">
              <li><strong className="text-purple-700">Cụm 1:</strong> Phát triển Vượt trội / Năng khiếu nổi bật.</li>
              <li><strong className="text-emerald-700">Cụm 2:</strong> Phát triển Đạt chuẩn / Khá, toàn diện.</li>
              <li><strong className="text-amber-700">Cụm 3:</strong> Đang phát triển / Cần rèn luyện thêm kỹ năng.</li>
              <li><strong className="text-rose-700">Cụm 4:</strong> Cần cô giáo và gia đình đặc biệt đồng hành hỗ trợ.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 px-6 py-4 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            disabled={running}
            className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/60 transition cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleExecute}
            disabled={running}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/30 transition cursor-pointer disabled:opacity-50"
          >
            {running ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
            <span>{running ? "Đang xử lý phân cụm..." : "Bắt đầu Phân loại Trẻ"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
