"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpenCheck,
  Eye,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import {
  getAllLearningProducts,
  getStudents,
  createLearningProduct,
  deleteLearningProduct,
} from "@/services";

const list = (x: any) =>
  Array.isArray(x) ? x : Array.isArray(x?.items) ? x.items : [];

export default function LearningPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [show, setShow] = useState(false);
  const [draft, setDraft] = useState<any>({
    childId: "",
    title: "",
    description: "",
    mediaId: "",
    activityId: "",
  });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(true);

  const load = async () => {
    setBusy(true);
    try {
      const [p, s] = await Promise.all([
        getAllLearningProducts(100),
        getStudents(),
      ]);
      setRows(list(p));
      setStudents(list(s));
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Không tải được sản phẩm");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const name = (id: string) => {
    const s = students.find((x) => String(x.id || x.Id) === String(id));
    return s?.tenHocSinh || s?.TenHocSinh || id;
  };

  const filtered = useMemo(
    () =>
      rows.filter((x) =>
        `${x.title} ${x.description || ""} ${name(x.childId)}`
          .toLowerCase()
          .includes(q.toLowerCase()),
      ),
    [rows, students, q],
  );

  const save = async () => {
    try {
      await createLearningProduct({
        ...draft,
        activityId: draft.activityId || null,
      });
      setShow(false);
      setDraft({
        childId: "",
        title: "",
        description: "",
        mediaId: "",
        activityId: "",
      });
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Không thể tạo sản phẩm");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Xóa sản phẩm này?")) return;
    try {
      await deleteLearningProduct(id);
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Không thể xóa sản phẩm");
    }
  };

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="admin-eyebrow">LEARNING SERVICE</p>
          <h1 className="admin-title">Sản phẩm học tập</h1>
          <p className="admin-subtitle">
            Quản lý riêng sản phẩm học tập; theo dõi rèn luyện nằm trong phân hệ khen thưởng.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => void load()}
            className="admin-btn admin-btn-secondary"
          >
            <RefreshCw size={16} /> Làm mới
          </button>
          <button
            onClick={() => setShow(true)}
            className="admin-btn admin-btn-primary"
          >
            <Plus size={16} /> Sản phẩm mới
          </button>
        </div>
      </header>

      {msg && <div className="admin-alert">{msg}</div>}

      <div className="admin-card p-4">
        <div className="relative max-w-xl">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            className="admin-input pl-10"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm sản phẩm hoặc học sinh..."
          />
        </div>
      </div>

      <div className="admin-card overflow-hidden">
        {busy ? (
          <div className="p-10 text-center">Đang tải...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Học sinh</th>
                  <th>MediaId</th>
                  <th>Ngày tạo</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.map((x) => (
                  <tr key={x.id}>
                    <td>
                      <b>{x.title}</b>
                      <div className="text-xs text-slate-400">
                        {x.description || "Không có mô tả"}
                      </div>
                    </td>
                    <td>{name(x.childId)}</td>
                    <td className="text-xs text-slate-400">{x.mediaId}</td>
                    <td>
                      {x.createdAtUtc
                        ? new Date(x.createdAtUtc).toLocaleDateString("vi-VN")
                        : ""}
                    </td>
                    <td>
                      <button
                        className="icon-btn danger"
                        onClick={() => void remove(x.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-14 text-center text-slate-400"
                    >
                      <Eye className="mx-auto mb-2" />
                      Chưa có sản phẩm.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black">Tạo sản phẩm học tập</h2>
              <button
                onClick={() => setShow(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>
            <div className="grid gap-3">
              <select
                className="admin-input"
                value={draft.childId}
                onChange={(e) =>
                  setDraft({ ...draft, childId: e.target.value })
                }
              >
                <option value="">Chọn học sinh</option>
                {students.map((x) => (
                  <option key={x.id || x.Id} value={x.id || x.Id}>
                    {x.tenHocSinh || x.TenHocSinh}
                  </option>
                ))}
              </select>
              <input
                className="admin-input"
                placeholder="Tiêu đề"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
              <textarea
                className="min-h-20 rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                placeholder="Mô tả"
                value={draft.description}
                onChange={(e) =>
                  setDraft({ ...draft, description: e.target.value })
                }
              />
              <input
                className="admin-input"
                placeholder="MediaId"
                value={draft.mediaId}
                onChange={(e) =>
                  setDraft({ ...draft, mediaId: e.target.value })
                }
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setShow(false)}
                  className="admin-btn admin-btn-secondary"
                >
                  Hủy
                </button>
                <button
                  disabled={!draft.childId || !draft.title || !draft.mediaId}
                  onClick={() => void save()}
                  className="admin-btn admin-btn-primary disabled:opacity-50"
                >
                  Lưu sản phẩm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
