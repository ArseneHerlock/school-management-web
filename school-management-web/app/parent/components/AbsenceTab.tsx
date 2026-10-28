"use client";

import { useEffect, useState } from "react";
import { CalendarOff, Send, Clock, CheckCircle2, XCircle, FileText, Loader2 } from "lucide-react";
import { getLeavesByChild, submitLeave } from "@/services/leave";
import { ChildInfo } from "../types";

export default function AbsenceTab({ child }: { child: ChildInfo }) {
  const [rows, setRows] = useState<any[]>([]);
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
    if (!form.reason.trim()) {
      setMsg("Vui lòng nhập lý do nghỉ.");
      return;
    }
    setSubmitting(true);
    setMsg("");
    try {
      await submitLeave({ subjectType: "Child", childId: child.id, ...form });
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
      return { icon: <Clock size={16} />, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", label: "Chờ duyệt" };
    }
    if (status === 1 || status === '1' || status === 'approved' || status === 'Approved') {
      return { icon: <CheckCircle2 size={16} />, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", label: "Đã duyệt" };
    }
    if (status === 2 || status === '2' || status === 'rejected' || status === 'Rejected') {
      return { icon: <XCircle size={16} />, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200", label: "Từ chối" };
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
              <h2 className="text-xl font-extrabold text-slate-800">Xin nghỉ học</h2>
              <p className="text-sm font-medium text-slate-500 mt-1">
                Tạo đơn xin nghỉ phép cho {child.hoTen}
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
                <option value="Việc gia đình">Việc gia đình</option>
                <option value="Đi du lịch">Đi du lịch</option>
                <option value="Lý do khác">Lý do khác</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Chi tiết (Không bắt buộc)</label>
              <textarea
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:bg-white transition-all resize-none"
                rows={3}
                value={form.note}
                onChange={e => setForm({ ...form, note: e.target.value })}
                placeholder="Ví dụ: Cháu bị sốt nhẹ cần đi khám..."
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
              className="w-full rounded-2xl bg-indigo-600 text-white py-4 font-bold shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> Gửi đơn xin nghỉ</>}
            </button>
          </div>
        </div>
      </div>

      {/* Danh sách đơn */}
      <div className="lg:w-7/12">
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <h3 className="font-extrabold text-lg text-slate-800 mb-6 flex items-center gap-2">
            <FileText size={20} className="text-slate-400" /> Lịch sử đơn từ
          </h3>

          {loading ? (
            <div className="py-12 flex justify-center"><Loader2 className="animate-spin text-indigo-500" /></div>
          ) : rows.length === 0 ? (
            <div className="py-12 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
              <CalendarOff size={40} className="mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-bold text-slate-600">Chưa có đơn xin nghỉ nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {rows.map((x) => {
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
