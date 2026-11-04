"use client";

import React, { useState } from "react";
import {
  Layers,
  Plus,
  Link2,
  Edit2,
  Unlink,
  Trash2,
} from "lucide-react";
import {
  ActivityItem,
  CriterionItem,
  DomainItem,
  createCriterion,
  updateCriterion,
  deleteCriterion,
  linkActivityCriterion,
  unlinkActivityCriterion,
} from "@/services/development";
import CriteriaSubForm from "./CriteriaSubForm";

interface CriteriaManagerSectionProps {
  selectedActivity: ActivityItem;
  linkedCriteria: Array<CriterionItem & { observationGuide?: string | null }>;
  unlinkedCriteria: CriterionItem[];
  domains: DomainItem[];
  onReloadBank: () => Promise<void>;
}

export default function CriteriaManagerSection({
  selectedActivity,
  linkedCriteria,
  unlinkedCriteria,
  domains,
  onReloadBank,
}: CriteriaManagerSectionProps) {
  const [selectedCriterionToLink, setSelectedCriterionToLink] = useState("");
  const [criterionFormOpen, setCriterionFormOpen] = useState(false);
  const [editingCriterion, setEditingCriterion] = useState<CriterionItem | null>(null);
  const [critDomainId, setCritDomainId] = useState("");
  const [critCode, setCritCode] = useState("");
  const [critName, setCritName] = useState("");
  const [critDesc, setCritDesc] = useState("");
  const [savingCriterion, setSavingCriterion] = useState(false);

  const handleLinkExistingCriterion = async () => {
    if (!selectedActivity.id || !selectedCriterionToLink) return;
    setSavingCriterion(true);
    try {
      await linkActivityCriterion(selectedActivity.id, selectedCriterionToLink);
      setSelectedCriterionToLink("");
      await onReloadBank();
    } catch (err: any) {
      alert("Không thể gắn tiêu chí: " + (err?.message || err));
    } finally {
      setSavingCriterion(false);
    }
  };

  const handleUnlinkCriterion = async (criterionId: string) => {
    if (!selectedActivity.id) return;
    setSavingCriterion(true);
    try {
      await unlinkActivityCriterion(selectedActivity.id, criterionId);
      await onReloadBank();
    } catch (err: any) {
      alert("Không thể gỡ tiêu chí: " + (err?.message || err));
    } finally {
      setSavingCriterion(false);
    }
  };

  const handleOpenCreateCriterion = () => {
    setEditingCriterion(null);
    setCritDomainId(domains[0]?.id || "");
    setCritCode(`TC-${Date.now().toString().slice(-4)}`);
    setCritName("");
    setCritDesc("");
    setCriterionFormOpen(true);
  };

  const handleOpenEditCriterion = (crit: CriterionItem) => {
    setEditingCriterion(crit);
    setCritDomainId(crit.developmentDomainId || domains[0]?.id || "");
    setCritCode(crit.code);
    setCritName(crit.name);
    setCritDesc(crit.description || "");
    setCriterionFormOpen(true);
  };

  const handleSaveCriterion = async () => {
    if (!critName.trim() || !critDomainId) return;
    setSavingCriterion(true);
    try {
      if (editingCriterion) {
        await updateCriterion(editingCriterion.id, {
          developmentDomainId: critDomainId,
          code: critCode.trim() || editingCriterion.code,
          name: critName.trim(),
          description: critDesc.trim(),
          isActive: true,
        });
      } else {
        const created = await createCriterion({
          developmentDomainId: critDomainId,
          code: critCode.trim() || `TC-${Date.now().toString().slice(-4)}`,
          name: critName.trim(),
          description: critDesc.trim(),
        });
        if (selectedActivity.id && created?.id) {
          await linkActivityCriterion(selectedActivity.id, created.id);
        }
      }
      setCriterionFormOpen(false);
      setEditingCriterion(null);
      await onReloadBank();
    } catch (err: any) {
      alert("Không thể lưu tiêu chí: " + (err?.message || err));
    } finally {
      setSavingCriterion(false);
    }
  };

  const handleDeleteCriterionPermanently = async (crit: CriterionItem) => {
    if (!confirm(`Xóa vĩnh viễn tiêu chí "${crit.name}" khỏi hệ thống?`)) return;
    setSavingCriterion(true);
    try {
      if (selectedActivity.id) {
        await unlinkActivityCriterion(selectedActivity.id, crit.id).catch(() => {});
      }
      await deleteCriterion(crit.id);
      await onReloadBank();
    } catch (err: any) {
      alert("Không thể xóa tiêu chí: " + (err?.message || err));
    } finally {
      setSavingCriterion(false);
    }
  };

  return (
    <div className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-3.5 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Layers size={15} className="text-indigo-600" />
          <span className="text-xs font-extrabold text-indigo-950">
            Tiêu chí đánh giá của hoạt động &ldquo;{selectedActivity.name}&rdquo; ({linkedCriteria.length} tiêu chí)
          </span>
        </div>
        <button
          type="button"
          onClick={handleOpenCreateCriterion}
          className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-indigo-700 transition cursor-pointer"
        >
          <Plus size={12} />
          <span>Thêm tiêu chí mới</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <select
          value={selectedCriterionToLink}
          onChange={(e) => setSelectedCriterionToLink(e.target.value)}
          className="flex-1 rounded-xl border border-indigo-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-400"
        >
          <option value="">-- Chọn tiêu chí có sẵn để gắn thêm vào hoạt động --</option>
          {unlinkedCriteria.map((c) => (
            <option key={c.id} value={c.id}>
              [{c.code}] {c.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={!selectedCriterionToLink || savingCriterion}
          onClick={handleLinkExistingCriterion}
          className="inline-flex items-center justify-center gap-1 rounded-xl border border-indigo-300 bg-white px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 disabled:opacity-50 cursor-pointer shrink-0"
        >
          <Link2 size={13} />
          <span>Gắn vào hoạt động</span>
        </button>
      </div>

      {criterionFormOpen && (
        <CriteriaSubForm
          editingCriterion={editingCriterion}
          critDomainId={critDomainId}
          setCritDomainId={setCritDomainId}
          critCode={critCode}
          setCritCode={setCritCode}
          critName={critName}
          setCritName={setCritName}
          critDesc={critDesc}
          setCritDesc={setCritDesc}
          domains={domains}
          savingCriterion={savingCriterion}
          onSave={handleSaveCriterion}
          onClose={() => setCriterionFormOpen(false)}
        />
      )}

      {linkedCriteria.length === 0 ? (
        <p className="rounded-xl border border-dashed border-indigo-200 bg-white/80 p-3 text-center text-[11px] text-slate-500">
          Hoạt động này chưa có tiêu chí đánh giá nào. Hãy chọn tiêu chí ở trên hoặc bấm <b>&ldquo;Thêm tiêu chí mới&rdquo;</b>.
        </p>
      ) : (
        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
          {linkedCriteria.map((crit) => (
            <div
              key={crit.id}
              className="flex items-center justify-between gap-2 rounded-xl border border-indigo-100 bg-white px-3 py-2 text-xs shadow-2xs"
            >
              <div className="min-w-0 flex-1">
                <span className="mr-1.5 rounded bg-indigo-50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-indigo-700">
                  {crit.code}
                </span>
                <span className="font-bold text-slate-800">{crit.name}</span>
                {crit.description && (
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {crit.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenEditCriterion(crit)}
                  className="rounded-lg p-1 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer"
                  title="Sửa nội dung tiêu chí"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => handleUnlinkCriterion(crit.id)}
                  className="rounded-lg p-1 text-slate-500 hover:bg-amber-50 hover:text-amber-700 cursor-pointer"
                  title="Gỡ tiêu chí khỏi hoạt động"
                >
                  <Unlink size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteCriterionPermanently(crit)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                  title="Xóa vĩnh viễn tiêu chí"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
