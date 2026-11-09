"use client";

import { useEffect, useMemo, useState } from "react";
import { getLeaves, reviewLeave } from "@/services";
import { Check, RefreshCw, X } from "lucide-react";
import Pagination from "@/app/admin/components/shared/Pagination";

export default function DonNghiPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const load = () => {
    setLoading(true);
    getLeaves({ status: "Pending" })
      .then((x) => setRows(Array.isArray(x) ? x : []))
      .catch((e) => setMsg(e instanceof Error ? e.message : "Không tải được"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const review = async (id: string, approve: boolean) => {
    try {
      await reviewLeave(id, {
        approve,
        note: approve ? "Đã duyệt" : "Từ chối theo quy định nhà trường",
      });
      load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Không thể duyệt đơn");
    }
  };

  const paginated = useMemo(
    () =>
      rows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [rows, currentPage],
  );

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Đơn xin nghỉ</h1>
        </div>
        <button
          onClick={load}
          className="rounded-xl border border-emerald-200 p-2 text-emerald-600 hover:bg-emerald-50 transition-colors"
        >
          <RefreshCw size={17} />
        </button>
      </div>

      {msg && (
        <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
          {msg}
        </div>
      )}

      <div className="card-frame overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-emerald-50 text-left text-xs text-emerald-700">
            <tr>
              <th className="p-3">Đối tượng</th>
              <th className="p-3">Từ</th>
              <th className="p-3">Đến</th>
              <th className="p-3">Lý do</th>
              <th className="p-3">Ghi chú</th>
              <th className="p-3 text-right">Xử lý</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  Đang tải...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  Không có đơn xin nghỉ nào đang chờ duyệt.
                </td>
              </tr>
            ) : (
              paginated.map((r) => (
                <tr key={r.id}>
                  <td className="p-3">
                    {r.subjectType === 0 ? "Học sinh" : "Giáo viên"}
                    <div className="text-[11px] text-slate-400">
                      {r.childId || r.requesterUserId}
                    </div>
                  </td>
                  <td className="p-3">{r.fromDate}</td>
                  <td className="p-3">{r.toDate}</td>
                  <td className="p-3 font-semibold">{r.reason}</td>
                  <td className="p-3 text-slate-500">{r.note || "—"}</td>
                  <td className="p-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => void review(r.id, true)}
                        className="rounded-lg bg-emerald-50 p-2 text-emerald-700 hover:bg-emerald-100 transition-colors"
                        title="Duyệt đơn"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => void review(r.id, false)}
                        className="rounded-lg bg-emerald-50 p-2 text-emerald-700 hover:bg-emerald-100 transition-colors"
                        title="Từ chối"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(rows.length / itemsPerPage)}
          totalItems={rows.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </section>
  );
}
