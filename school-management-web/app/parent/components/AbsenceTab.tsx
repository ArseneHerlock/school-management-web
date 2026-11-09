"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { CalendarOff, Send, Clock, CheckCircle2, XCircle, FileText, Loader2 } from "lucide-react";
import { getLeavesByChild, submitLeave } from "@/services/leave";
import { ChildInfo } from "../types";

const parentLeaveSchema = z
  .object({
    fromDate: z.string().min(1, "Vui lòng chọn ngày bắt đầu nghỉ."),
    toDate: z.string().min(1, "Vui lòng chọn ngày kết thúc nghỉ."),
    reason: z.string().trim().min(3, "Lý do xin nghỉ tối thiểu 3 ký tự.").max(200, "Lý do tối đa 200 ký tự."),
    note: z.string().max(500, "Ghi chú tối đa 500 ký tự.").optional(),
  })
  .refine((data) => new Date(data.fromDate) <= new Date(data.toDate), {
    message: "Ngày kết thúc nghỉ không được trước ngày bắt đầu nghỉ.",
    path: ["toDate"],
  });

export default function AbsenceTab({ child }: { child: ChildInfo }) {
  const [rows, setRows] = useState<any[]>([]);
  const [historyStatusFilter, setHistoryStatusFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fromDate: new Date().toISOString().slice(0, 10),
    toDate: new Date().toISOString().slice(0, 10),
    reason: "Nghỉ ốm",
    note: "",
  });
  const [msg, setMsg] = useState("");

  const load = () => {
    setLoading(true);
    getLeavesByChild(child.id)
      .then(x => setRows(Array.isArray(x) ? x : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (child.id) load();
  }, [child.id]);

  const submit = async () => {
    const val = parentLeaveSchema.safeParse(form);
    if (!val.success) {
      setMsg(val.error.issues[0]?.message || "Thông tin đơn nghỉ không hợp lệ.");
      return;
    }

    setSubmitting(true);
    setMsg("");
    try {
      await submitLeave({ subjectType: "Child", childId: child.id, ...val.data });
      setMsg("Đã gửi đơn xin nghỉ thành công!");
      setForm({ ...form, note: "" });
      load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Không thể gửi đơn");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusDisplay = (status: number | string) => {
    if (status === 0 || status === '0' || status === 'pending' || status === 'Pending') {
      return { icon: <Clock size={16} />, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", label: "Chờ cô tiếp nhận" };
    }
    if (status === 1 || status === '1' || status === 'approved' || status === 'Approved') {
      return { icon: <CheckCircle2 size={16} />, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", label: "Cô đã duyệt" };
    }
    if (status === 2 || status === '2' || status === 'rejected' || status === 'Rejected') {
      return { icon: <XCircle size={16} />, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200", label: "Không duyệt" };
    }
    return { icon: <Clock size={16} />, color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200", label: "Không rõ" };
  };

  return (
    <section className="space-y-4 lg:flex lg:gap-6 lg:space-y-0">
      {/* Form xin nghỉ */}
      <div className="lg:w-5/12 space-y-4">
        <div className="rounded-2xl sm:rounded-3xl bg-white p-3.5 sm:p-5 shadow-xs border border-slate-200">
          <div className="flex items-center gap-2.5 mb-3.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <CalendarOff size={18} />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-800">Đơn xin nghỉ học</h2>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Từ ngày</label>
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-700 outline-none focus:border-indigo-400 focus:bg-white transition-all"
                  type="date"
                  value={form.fromDate}
                  onChange={e => setForm({ ...form, fromDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Đến ngày</label>
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-700 outline-none focus:border-indigo-400 focus:bg-white transition-all"
                  type="date"
                  value={form.toDate}
                  onChange={e => setForm({ ...form, toDate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Lý do nghỉ</label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-700 outline-none focus:border-indigo-400 focus:bg-white transition-all"
                value={form.reason}
                onChange={e => setForm({ ...form, reason: e.target.value })}
              >
                <option value="Nghỉ ốm">Nghỉ ốm / Khám bệnh</option>
                <option value="Việc gia đình">Việc gia đình</option>
                <option value="Đi du lịch">Đi du lịch / Về quê</option>
                <option value="Lý do khác">Lý do khác</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Ghi chú</label>
              <textarea
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-700 outline-none focus:border-indigo-400 focus:bg-white transition-all resize-none"
                rows={2}
                value={form.note}
                onChange={e => setForm({ ...form, note: e.target.value })}
                placeholder="Nhập ghi chú thêm..."
              />
            </div>

            {msg && (
              <div className={`p-2.5 rounded-xl text-xs font-bold ${msg.includes("thành công") ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"}`}>
                {msg}
              </div>
            )}

            <button
              onClick={() => void submit()}
              disabled={submitting}
              className="w-full rounded-xl bg-indigo-600 text-white py-2.5 font-bold shadow-sm shadow-indigo-600/20 hover:bg-indigo-700 transition-all disabled:opacity-70 flex items-center justify-center gap-1.5 cursor-pointer text-xs"
            >
              {submitting ? <Loader2 className="animate-spin" size={15} /> : <><Send size={14} /> Gửi đơn tới giáo viên</>}
            </button>
          </div>
        </div>
      </div>

      {/* Danh sách đơn */}
      <div className="lg:w-7/12">
        <div className="rounded-2xl sm:rounded-3xl bg-white p-3.5 sm:p-5 shadow-xs border border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-100">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-800 flex items-center gap-1.5">
              <FileText size={16} className="text-slate-400" />
              <span>Đơn đã gửi</span>
            </h3>

            <div className="flex items-center gap-1.5">
              <select
                value={historyStatusFilter}
                onChange={(e) => setHistoryStatusFilter(e.target.value)}
                className="text-[11px] font-bold border border-slate-200 rounded-lg px-2 py-1 bg-slate-50 text-slate-700 outline-none"
              >
                <option value="ALL">Tất cả</option>
                <option value="pending">Chờ tiếp nhận</option>
                <option value="approved">Đã duyệt</option>
                <option value="rejected">Không duyệt</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="py-8 flex justify-center"><Loader2 className="animate-spin text-indigo-500" /></div>
          ) : rows.length === 0 ? (
            <div className="py-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50">
              <CalendarOff size={32} className="mx-auto mb-2 text-slate-300" />
              <p className="text-xs font-bold text-slate-600">Bé chưa có đơn xin nghỉ học nào</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {rows
                .filter((r) => {
                  if (historyStatusFilter === "ALL") return true;
                  const st = String(r.status ?? "").toLowerCase();
                  if (historyStatusFilter === "pending") return st === "0" || st === "pending";
                  if (historyStatusFilter === "approved") return st === "1" || st === "approved";
                  if (historyStatusFilter === "rejected") return st === "2" || st === "rejected";
                  return true;
                })
                .map((x) => {
                const status = getStatusDisplay(x.status);
                return (
                  <div key={x.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                       <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-slate-800 text-xs sm:text-sm">{x.reason}</span>
                          <span className={`flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border ${status.bg} ${status.color} ${status.border}`}>
                             {status.icon} {status.label}
                          </span>
                       </div>
                       <p className="text-[11px] text-slate-500 font-medium">
                         Từ <strong className="text-slate-700">{x.fromDate?.slice(0, 10)}</strong> đến <strong className="text-slate-700">{x.toDate?.slice(0, 10)}</strong>
                       </p>
                       {x.note && <p className="text-[10px] text-slate-400 mt-1 bg-white px-2 py-1 rounded-md border border-slate-100 inline-block">{x.note}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
