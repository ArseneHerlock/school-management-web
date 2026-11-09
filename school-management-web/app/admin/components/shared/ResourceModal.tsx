'use client';

import React from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import type { Field } from './ResourcePage';

interface ResourceModalProps {
  open: boolean;
  editing: any | null;
  title: string;
  fields: Field[];
  form: any;
  setForm: (form: any) => void;
  saving: boolean;
  error: string;
  onClose: () => void;
  onSave: () => void;
}

export const ResourceModal: React.FC<ResourceModalProps> = ({
  open,
  editing,
  title,
  fields,
  form,
  setForm,
  saving,
  error,
  onClose,
  onSave,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black">
              {editing ? 'Chỉnh sửa' : 'Thêm mới'} · {title}
            </h2>
            <p className="text-xs text-slate-500">Dữ liệu được gửi trực tiếp đến hệ thống.</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <label key={f.key} className="block">
              <span className="mb-1.5 block text-xs font-bold text-slate-600">{f.label}</span>
              {f.type === 'select' ? (
                <select
                  required={f.required}
                  value={form[f.key] ?? ''}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  className="input"
                >
                  <option value="">Chọn...</option>
                  {f.options?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  required={f.required}
                  type={f.type || 'text'}
                  value={form[f.key] ?? ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value,
                    })
                  }
                  className="input"
                />
              )}
            </label>
          ))}
        </div>
        {error && <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{error}</div>}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-500"
          >
            Hủy
          </button>
          <button
            disabled={saving}
            onClick={onSave}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-sm font-bold text-white transition disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};
