"use client";
import { useEffect, useState } from "react";
import { Award, Flower2, Loader2, Plus, RefreshCw } from "lucide-react";
import {
  getGoodChildRecords,
  getStudents,
  createGoodChildRecord,
  updateGoodChildTeacherComment,
  awardFlower,
} from "@/services";
const list = (x: any) =>
  Array.isArray(x) ? x : Array.isArray(x?.items) ? x.items : [];
export default function GoodChild() {
  const [rows, setRows] = useState<any[]>([]),
    [students, setStudents] = useState<any[]>([]),
    [childId, setChildId] = useState(""),
    [month, setMonth] = useState(new Date().getMonth() + 1),
    [year, setYear] = useState(new Date().getFullYear()),
    [comment, setComment] = useState(""),
    [busy, setBusy] = useState(true),
    [msg, setMsg] = useState("");
  const load = async () => {
    setBusy(true);
    try {
      const [r, s] = await Promise.all([
        getGoodChildRecords({ month, year, pageSize: 100 }),
        getStudents(),
      ]);
      setRows(list(r));
      setStudents(list(s));
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Không tải được sổ bé ngoan");
    } finally {
      setBusy(false);
    }
  };
  useEffect(() => {
    void load();
  }, [month, year]);
  const name = (id: string) => {
    const s = students.find((x) => String(x.id || x.Id) === String(id));
    return s?.tenHocSinh || s?.TenHocSinh || id;
  };
  const create = async () => {
    try {
      await createGoodChildRecord({
        childId,
        month,
        year,
      });
      setMsg("Đã tạo sổ bé ngoan theo tháng.");
      await load();
    } catch (e) {
      setMsg(
        e instanceof Error
          ? e.message
          : "Sổ tháng này đã tồn tại hoặc không thể tạo",
      );
    }
  };
  const saveComment = async (r: any) => {
    try {
      await updateGoodChildTeacherComment(r.id, comment);
      setComment("");
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Không thể lưu nhận xét");
    }
  };
  const award = async (r: any) => {
    try {
      await awardFlower(r.id, {
          flowerDate: new Date().toISOString().slice(0, 10),
          reason: "Điều đáng khen trong ngày",
        },
      );
      setMsg("Đã tặng hoa nhỏ. Đủ 4 hoa nhỏ sẽ tự động thêm 1 hoa lớn.");
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Không thể tặng hoa");
    }
  };
  return (
    <section className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <p className="admin-eyebrow">KHEN THƯỞNG</p>
          <h1 className="admin-title">Sổ bé ngoan</h1>
          <p className="admin-subtitle">
            Mỗi tháng là một sổ riêng. Hoa nhỏ được tích lũy trong tháng.
          </p>
        </div>
        <button
          onClick={() => void load()}
          className="admin-btn admin-btn-secondary"
        >
          <RefreshCw size={16} /> Làm mới
        </button>
      </header>
      {msg && <div className="admin-alert">{msg}</div>}
      <div className="admin-card flex flex-wrap gap-3 p-4">
        <select
          className="admin-input w-auto"
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              Tháng {i + 1}
            </option>
          ))}
        </select>
        <input
          className="admin-input w-28"
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        />
        <select
          className="admin-input min-w-56"
          value={childId}
          onChange={(e) => setChildId(e.target.value)}
        >
          <option value="">Chọn học sinh</option>
          {students.map((x) => (
            <option key={x.id || x.Id} value={x.id || x.Id}>
              {x.tenHocSinh || x.TenHocSinh}
            </option>
          ))}
        </select>
        <button
          disabled={!childId}
          onClick={() => void create()}
          className="admin-btn admin-btn-primary disabled:opacity-50"
        >
          <Plus size={16} /> Tạo sổ tháng
        </button>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <Kpi icon={Award} label="Sổ tháng" value={rows.length} />
        <Kpi
          icon={Flower2}
          label="Hoa nhỏ"
          value={rows.reduce((n, x) => n + x.dailyFlowerCount, 0)}
        />
        <Kpi
          icon={Award}
          label="Hoa lớn"
          value={rows.reduce((n, x) => n + x.bonusFlowerCount, 0)}
        />
      </div>
      <div className="space-y-3">
        {busy ? (
          <Loader2 className="mx-auto my-12 animate-spin text-emerald-500" />
        ) : (
          rows.map((r) => (
            <article key={r.id} className="admin-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-black">{name(r.childId)}</h2>
                  <p className="text-xs text-slate-400">
                    Tháng {r.month}/{r.year}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="status-pill status-warn">
                    <Flower2 size={13} /> {r.dailyFlowerCount} hoa nhỏ
                  </span>
                  <span className="status-pill status-ok">
                    🏅 {r.bonusFlowerCount} hoa lớn
                  </span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <input
                  className="admin-input"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={r.teacherComment || "Nhận xét giáo viên"}
                />
                <button
                  onClick={() => void saveComment(r)}
                  className="admin-btn admin-btn-secondary"
                >
                  Lưu nhận xét
                </button>
                <button
                  onClick={() => void award(r)}
                  className="admin-btn admin-btn-primary"
                >
                  Tặng hoa nhỏ
                </button>
              </div>
            </article>
          ))
        )}
        {!busy && !rows.length && (
          <div className="admin-card p-12 text-center text-sm text-slate-400">
            Chưa có sổ bé ngoan trong tháng này.
          </div>
        )}
      </div>
    </section>
  );
}
function Kpi({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: number;
}) {
  return (
    <div className="admin-card p-4">
      <Icon className="text-emerald-600" size={19} />
      <p className="mt-2 text-xs text-slate-400">{label}</p>
      <p className="text-2xl font-black">{value}</p>
    </div>
  );
}
