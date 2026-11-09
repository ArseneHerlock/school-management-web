'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Plus, Search, Trash2, Edit3, RefreshCw, Loader2, Database, TrendingUp, Layers3 } from 'lucide-react';
import { api } from "@/services";
import Pagination from '@/app/admin/components/shared/Pagination';
import { ResourceModal } from './ResourceModal';
import { ResourceCharts } from './ResourceCharts';
import { useAsyncResource } from '@/lib/hooks/useAsyncResource';

export type Field = {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'select';
  required?: boolean;
  options?: { label: string; value: string }[];
};

const listOf = (v: any) =>
  Array.isArray(v) ? v : Array.isArray(v?.items) ? v.items : Array.isArray(v?.data) ? v.data : Array.isArray(v?.results) ? v.results : [];

function valueOf(row: any, key: string) {
  return key.split('.').reduce((v, k) => v?.[k], row);
}

function distribution(rows: any[], key?: string, label = 'Khác') {
  const map = new Map<string, number>();
  if (!key) return [];
  rows.forEach((r) => {
    const raw = valueOf(r, key);
    const name = raw === undefined || raw === null || raw === '' ? label : String(raw);
    map.set(name, (map.get(name) || 0) + 1);
  });
  return [...map]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
}

export default function ResourcePage({
  title,
  subtitle,
  service,
  path,
  columns,
  fields,
  createPayload,
  updatePayload,
  canDelete = true,
  extraActions,
}: {
  title: string;
  subtitle: string;
  service: string;
  path: string;
  columns: { key: string; label: string }[];
  fields: Field[];
  createPayload?: (x: any) => any;
  updatePayload?: (x: any, row: any) => any;
  canDelete?: boolean;
  extraActions?: (row: any, reload: () => void) => ReactNode;
}) {
  const resource = useAsyncResource<any[]>(
    async () => listOf(await api.get<any>(service, path)),
    [] as any[],
    [service, path]
  );
  const rows = resource.data;
  const loading = resource.isLoading;
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<any>({});
  const error = resource.error;
  const setError = resource.setError;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const load = resource.reload;

  const filtered = useMemo(
    () => rows.filter((r) => JSON.stringify(r).toLowerCase().includes(search.toLowerCase())),
    [rows, search]
  );

  useEffect(() => {
    setPage(1);
  }, [search]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const primaryChart = useMemo(() => distribution(rows, columns[1]?.key || columns[0]?.key), [rows, columns]);
  const secondaryChart = useMemo(() => distribution(rows, columns[columns.length - 1]?.key), [rows, columns]);

  const start = (row?: any) => {
    setEditing(row || null);
    const next: any = {};
    fields.forEach((f) => (next[f.key] = row ? valueOf(row, f.key) ?? '' : ''));
    setForm(next);
    setError('');
    setOpen(true);
  };

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      if (editing) {
        await api.put(
          service,
          `${path.replace(/\/$/, '')}/${editing.id || editing.staffId || editing.Id}`,
          updatePayload ? updatePayload(form, editing) : form
        );
      } else {
        await api.post(service, path, createPayload ? createPayload(form) : form);
      }
      setOpen(false);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lưu dữ liệu thất bại.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row: any) => {
    const id = row.id || row.staffId || row.Id;
    if (!id || !confirm('Xóa bản ghi này?')) return;
    try {
      await api.delete(service, `${path.replace(/\/$/, '')}/${id}`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Xóa thất bại.');
    }
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="admin-eyebrow">QUẢN TRỊ DỮ LIỆU</p>
          <h1 className="admin-title">{title}</h1>
          <p className="admin-subtitle">{subtitle}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => void load()} className="admin-btn admin-btn-secondary">
            <RefreshCw size={16} />
            Tải lại
          </button>
          <button onClick={() => start()} className="admin-btn admin-btn-primary">
            <Plus size={16} />
            Thêm mới
          </button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="admin-card p-4">
          <div className="flex items-center gap-3">
            <div className="admin-icon"><Database size={18} /></div>
            <div>
              <p className="text-xs text-slate-400">Tổng bản ghi từ API</p>
              <p className="mt-1 text-2xl font-black text-slate-800">{rows.length}</p>
            </div>
          </div>
        </div>
        <div className="admin-card p-4">
          <div className="flex items-center gap-3">
            <div className="admin-icon"><TrendingUp size={18} /></div>
            <div>
              <p className="text-xs text-slate-400">Đang hiển thị</p>
              <p className="mt-1 text-2xl font-black text-emerald-600">{filtered.length}</p>
            </div>
          </div>
        </div>
        <div className="admin-card p-4">
          <div className="flex items-center gap-3">
            <div className="admin-icon"><Layers3 size={18} /></div>
            <div>
              <p className="text-xs text-slate-400">Nhóm dữ liệu</p>
              <p className="mt-1 text-2xl font-black text-slate-800">{primaryChart.length}</p>
            </div>
          </div>
        </div>
      </div>

      <ResourceCharts
        primaryLabel={columns[1]?.label || columns[0]?.label}
        secondaryLabel={columns[columns.length - 1]?.label}
        primaryChart={primaryChart}
        secondaryChart={secondaryChart}
      />

      <div className="card-frame p-4">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm kiếm..." className="input pl-9" />
        </div>
      </div>

      {error && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{error}</div>}

      <div className="card-frame overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-emerald-50/80 text-left text-xs uppercase tracking-wide text-emerald-800 font-bold">
              <tr>
                {columns.map((c) => (
                  <th key={c.key} className="px-4 py-3">{c.label}</th>
                ))}
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50/60">
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="p-10 text-center text-slate-400">
                    <Loader2 className="mx-auto animate-spin text-emerald-600" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="p-10 text-center text-slate-400">
                    Không có dữ liệu từ máy chủ.
                  </td>
                </tr>
              ) : (
                paginatedRows.map((r, i) => (
                  <tr key={r.id || r.staffId || i} className="hover:bg-emerald-50/30 transition-colors">
                    {columns.map((c) => (
                      <td key={c.key} className="px-4 py-3 text-slate-700">
                        {String(valueOf(r, c.key) ?? '—')}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => start(r)} className="rounded-lg p-2 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 transition">
                          <Edit3 size={15} />
                        </button>
                        {canDelete && (
                          <button onClick={() => void remove(r)} className="rounded-lg p-2 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition">
                            <Trash2 size={15} />
                          </button>
                        )}
                        {extraActions?.(r, load)}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      <ResourceModal
        open={open}
        editing={editing}
        title={title}
        fields={fields}
        form={form}
        setForm={setForm}
        saving={saving}
        error={error}
        onClose={() => setOpen(false)}
        onSave={() => void save()}
      />
    </section>
  );
}
