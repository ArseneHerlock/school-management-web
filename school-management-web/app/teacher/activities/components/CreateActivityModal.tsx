import React, { useState } from 'react';
import { X, Loader2, Check } from 'lucide-react';

interface CreateActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId?: string;
  onSuccess: (name: string) => void;
}

export function CreateActivityModal({
  isOpen,
  onClose,
  classId,
  onSuccess,
}: CreateActivityModalProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [actForm, setActForm] = useState({
    name: '',
    domainCode: 'GDMN-PHYSICAL',
    domainName: 'Thể chất',
    description: '',
    minAgeMonths: 36,
    maxAgeMonths: 72,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actForm.name.trim()) return;

    setIsCreating(true);
    try {
      const res = await fetch('/api/development/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: actForm.name.trim(),
          domainCode: actForm.domainCode,
          domainName: actForm.domainName,
          scope: 'CLASS',
          classId,
          description: actForm.description.trim(),
          minAgeMonths: actForm.minAgeMonths,
          maxAgeMonths: actForm.maxAgeMonths,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || 'Không thể tạo hoạt động cho lớp.');
      }

      onSuccess(actForm.name);
      onClose();
      setActForm({
        name: '',
        domainCode: 'GDMN-PHYSICAL',
        domainName: 'Thể chất',
        description: '',
        minAgeMonths: 36,
        maxAgeMonths: 72,
      });
    } catch (err: any) {
      alert(err.message || 'Lỗi khi tạo hoạt động.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase text-purple-700">
              Dành riêng cho lớp của cô
            </span>
            <h3 className="text-lg font-black text-slate-900">
              Tạo hoạt động rèn luyện cho lớp
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Tên hoạt động rèn luyện của lớp *
            </label>
            <input
              type="text"
              required
              placeholder="VD: Bé thực hành gấp khăn ăn, Trò chơi xếp hàng..."
              value={actForm.name}
              onChange={(e) => setActForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-purple-400 font-semibold"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Lĩnh vực phát triển mầm non *
            </label>
            <select
              required
              value={actForm.domainCode}
              onChange={(e) => {
                const code = e.target.value;
                const map: Record<string, string> = {
                  'GDMN-PHYSICAL': 'Thể chất',
                  'GDMN-COGNITION': 'Nhận thức',
                  'GDMN-LANGUAGE': 'Ngôn ngữ',
                  'GDMN-SOCIAL-EMOTIONAL': 'Tình cảm - Xã hội',
                  'GDMN-AESTHETIC': 'Thẩm mỹ',
                };
                setActForm((p) => ({
                  ...p,
                  domainCode: code,
                  domainName: map[code] || 'Thể chất',
                }));
              }}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-purple-400 font-bold bg-white cursor-pointer"
            >
              <option value="GDMN-PHYSICAL">1. Thể chất (Vận động, thể lực, tự phục vụ)</option>
              <option value="GDMN-COGNITION">2. Nhận thức (Khám phá, tư duy, quan sát)</option>
              <option value="GDMN-LANGUAGE">3. Ngôn ngữ (Giao tiếp, lắng nghe, kể chuyện)</option>
              <option value="GDMN-SOCIAL-EMOTIONAL">4. Tình cảm - Xã hội (Hòa đồng, cảm xúc, chờ lượt)</option>
              <option value="GDMN-AESTHETIC">5. Thẩm mỹ (Vẽ, tạo hình, âm nhạc, sáng tạo)</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Mô tả mục tiêu rèn luyện
            </label>
            <textarea
              rows={3}
              placeholder="Mô tả kỹ năng cần quan sát ở trẻ trong hoạt động này..."
              value={actForm.description}
              onChange={(e) => setActForm((p) => ({ ...p, description: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-purple-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 text-xs font-bold shadow-md shadow-purple-600/20 cursor-pointer"
            >
              {isCreating ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              <span>Lưu hoạt động</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
