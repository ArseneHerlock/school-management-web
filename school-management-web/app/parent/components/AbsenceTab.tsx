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
    <section className="space-y-6 lg:flex lg:gap-8 lg:space-y-0">
      {/* Form xin nghỉ */}
      <div className="lg:w-5/12 space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <CalendarOff size={24} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-800">Đơn xin nghỉ học</h2>
              <p className="text-sm font-medium text-slate-500 mt-1">
                Gửi đơn xin phép nghỉ học của bé {child.hoTen} tới giáo viên chủ nhiệm
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Từ ngày</label>
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:bg-white transition-all"
                  type="date"
                  value={form.fromDate}
                  onChange={e => setForm({ ...form, fromDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Đến ngày</label>
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:bg-white transition-all"
                  type="date"
                  value={form.toDate}
                  onChange={e => setForm({ ...form, toDate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Lý do nghỉ</label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:bg-white transition-all"
                value={form.reason}
                onChange={e => setForm({ ...form, reason: e.target.value })}
              >
                <option value="Nghỉ ốm">Nghỉ ốm / Khám bệnh</option>
                <option value="Việc gia đình">Việc riêng gia đình</option>
                <option value="Đi du lịch">Về quê / Đi du lịch</option>
                <option value="Lý do khác">Lý do sức khỏe khác</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Lời dặn thêm của phụ huynh (nếu có)</label>
              <textarea
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:bg-white transition-all resize-none"
                rows={3}
                value={form.note}
                onChange={e => setForm({ ...form, note: e.target.value })}
                placeholder="Ví dụ: Cháu bị sốt nhẹ, gia đình xin cho cháu nghỉ để tiện chăm sóc..."
              />
            </div>

            {msg && (
              <div className={`p-4 rounded-xl text-sm font-bold ${msg.includes("thành công") ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"}`}>
                {msg}
              </div>
            )}

            <button
              onClick={() => void submit()}
              disabled={submitting}
              className="w-full rounded-2xl bg-indigo-600 text-white py-4 font-bold shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-all disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> Gửi đơn tới giáo viên</>}
            </button>
          </div>
        </div>
      </div>

      {/* Danh sách đơn */}
      <div className="lg:w-7/12">
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-lg text-slate-800 flex items-center gap-2">
              <FileText size={20} className="text-slate-400" />
              <span>Danh sách đơn xin nghỉ đã gửi</span>
            </h3>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Trạng thái:</span>
              <select
                value={historyStatusFilter}
                onChange={(e) => setHistoryStatusFilter(e.target.value)}
                className="text-xs font-bold border border-slate-200 rounded-xl px-2.5 py-1.5 bg-slate-50 text-slate-700 outline-none"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="pending">Chờ cô tiếp nhận</option>
                <option value="approved">Cô đã duyệt</option>
                <option value="rejected">Không duyệt</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center"><Loader2 className="animate-spin text-indigo-500" /></div>
          ) : rows.length === 0 ? (
            <div className="py-12 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
              <CalendarOff size={40} className="mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-bold text-slate-600">Bé chưa có đơn xin nghỉ học nào</p>
            </div>
          ) : (
            <div className="space-y-4">
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
                  <div key={x.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                       <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-800 text-sm">{x.reason}</span>
                          <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${status.bg} ${status.color} ${status.border}`}>
                             {status.icon} {status.label}
                          </span>
                       </div>
                       <p className="text-xs text-slate-500 font-medium">
                         Từ <strong className="text-slate-700">{x.fromDate?.slice(0, 10)}</strong> đến <strong className="text-slate-700">{x.toDate?.slice(0, 10)}</strong>
                       </p>
                       {x.note && <p className="text-xs text-slate-400 mt-2 bg-white px-2 py-1.5 rounded-lg border border-slate-100 inline-block">{x.note}</p>}
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
