"use client";

import React, { useMemo, useState } from "react";
import Modal from "@/app/components/ui/Modal";
import { Plus, Edit3, Trash2, Search } from "lucide-react";
import {
  ActivityItem,
  CriterionItem,
  DomainItem,
  CreateCriterionInput,
  UpdateCriterionInput,
} from "@/services/development";
import CriterionEditForm from "./CriterionEditForm";

interface HoatDongCriteriaModalProps {
  activity: ActivityItem | null;
  onClose: () => void;
  domains?: DomainItem[];
  criteria: CriterionItem[];
  onLinkCriterion: (critId: string) => Promise<void>;
  onUnlinkCriterion: (critId: string) => Promise<void>;
  onCreateCriterion?: (input: CreateCriterionInput) => Promise<void>;
  onUpdateCriterion?: (
    critId: string,
    input: UpdateCriterionInput,
  ) => Promise<void>;
  onDeleteCriterion?: (critId: string) => Promise<void>;
}

export default function HoatDongCriteriaModal({
  activity,
  onClose,
  domains = [],
  criteria,
  onLinkCriterion,
  onUnlinkCriterion,
  onCreateCriterion,
  onUpdateCriterion,
  onDeleteCriterion,
}: HoatDongCriteriaModalProps) {
  const [isCriterionFormOpen, setIsCriterionFormOpen] = useState(false);
  const [editingCriterion, setEditingCriterion] =
    useState<CriterionItem | null>(null);
  const [critSearchQuery, setCritSearchQuery] = useState("");
  const [selectedFilterDomainId, setSelectedFilterDomainId] = useState("ALL");
  const [critForm, setCritForm] = useState({
    name: "",
    description: "",
    developmentDomainId: "",
  });
  const [savingCriterion, setSavingCriterion] = useState(false);

  const filteredCriteria = useMemo(() => {
    return criteria.filter((c) => {
      const matchDomain =
        selectedFilterDomainId === "ALL" ||
        c.developmentDomainId === selectedFilterDomainId;
      const matchSearch =
        !critSearchQuery.trim() ||
        c.name.toLowerCase().includes(critSearchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(critSearchQuery.toLowerCase()) ||
        (c.description || "")
          .toLowerCase()
          .includes(critSearchQuery.toLowerCase());
      return matchDomain && matchSearch;
    });
  }, [criteria, selectedFilterDomainId, critSearchQuery]);

  const handleOpenAddCriterion = () => {
    setEditingCriterion(null);
    setCritForm({
      name: "",
      description: "",
      developmentDomainId: domains[0]?.id || "",
    });
    setIsCriterionFormOpen(true);
  };

  const handleOpenEditCriterion = (c: CriterionItem) => {
    setEditingCriterion(c);
    setCritForm({
      name: c.name,
      description: c.description || "",
      developmentDomainId: c.developmentDomainId || domains[0]?.id || "",
    });
    setIsCriterionFormOpen(true);
  };

  const handleSaveCriterionForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!critForm.name.trim()) return;
    setSavingCriterion(true);
    try {
      const domainId = critForm.developmentDomainId || domains[0]?.id || "";
      if (editingCriterion && onUpdateCriterion) {
        await onUpdateCriterion(editingCriterion.id, {
          developmentDomainId: domainId,
          code: editingCriterion.code,
          name: critForm.name.trim(),
          description: critForm.description.trim() || undefined,
          isActive: true,
        });
      } else if (onCreateCriterion) {
        await onCreateCriterion({
          developmentDomainId: domainId,
          code: "",
          name: critForm.name.trim(),
          description: critForm.description.trim() || undefined,
        });
      }
      setIsCriterionFormOpen(false);
      setEditingCriterion(null);
    } finally {
      setSavingCriterion(false);
    }
  };

  return (
    <Modal
      isOpen={Boolean(activity)}
      onClose={() => {
        setIsCriterionFormOpen(false);
        setEditingCriterion(null);
        onClose();
      }}
      title={`Quản lý tiêu chí đánh giá: "${activity?.name || ""}"`}
      subtitle="Thêm, sửa, xóa và liên kết tiêu chí rèn luyện cho hoạt động này"
      maxWidth="lg"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-slate-600 font-medium">
            Các tiêu chí được gắn sẽ hiển thị trực tiếp khi giáo viên đánh giá:
          </p>
          <button
            type="button"
            onClick={handleOpenAddCriterion}
            className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition cursor-pointer shrink-0"
          >
            <Plus size={13} /> Tạo tiêu chí mới
          </button>
        </div>

        {isCriterionFormOpen && (
          <CriterionEditForm
            editingCriterion={editingCriterion}
            critForm={critForm}
            setCritForm={setCritForm}
            domains={domains}
            savingCriterion={savingCriterion}
            onSave={handleSaveCriterionForm}
            onClose={() => {
              setIsCriterionFormOpen(false);
              setEditingCriterion(null);
            }}
          />
        )}

        <div className="space-y-2">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-2.5 text-slate-400"
            />
            <input
              type="text"
              value={critSearchQuery}
              onChange={(e) => setCritSearchQuery(e.target.value)}
              placeholder="Tìm kiếm chỉ số theo tên hoặc mã MT..."
              className="w-full rounded-xl border border-slate-200 py-1.5 pl-8 pr-3 text-xs outline-none focus:border-emerald-500"
            />
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setSelectedFilterDomainId("ALL")}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                selectedFilterDomainId === "ALL"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Tất cả chỉ số
            </button>
            {domains.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedFilterDomainId(d.id)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                  selectedFilterDomainId === d.id
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {d.name.replace("Phát triển ", "")}
              </button>
            ))}
          </div>
        </div>

        <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
          {filteredCriteria.map((c) => {
            const isLinked = (activity?.developmentCriteria || []).some(
              (dc) => dc.developmentCriterionId === c.id,
            );
            const domainName = domains.find(
              (d) => d.id === c.developmentDomainId,
            )?.name;
            return (
              <div
                key={c.id}
                className={`flex items-center justify-between gap-2 p-2.5 rounded-xl border transition ${
                  isLinked
                    ? "border-emerald-200 bg-emerald-50/40"
                    : "border-slate-100 hover:bg-slate-50"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {c.name}
                    </span>
                    {isLinked && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-700 shrink-0">
                        Đã gắn
                      </span>
                    )}
                  </div>
                  {(domainName || c.description) && (
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {domainName ? `[${domainName}] ` : ""}
                      {c.description || ""}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEditCriterion(c)}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-amber-50 hover:text-amber-600 transition cursor-pointer"
                    title="Sửa tiêu chí"
                  >
                    <Edit3 size={13} />
                  </button>
                  {onDeleteCriterion && (
                    <button
                      type="button"
                      onClick={() => void onDeleteCriterion(c.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition cursor-pointer"
                      title="Xóa tiêu chí khỏi hệ thống"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      isLinked ? onUnlinkCriterion(c.id) : onLinkCriterion(c.id)
                    }
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      isLinked
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
                  >
                    {isLinked ? "Gỡ liên kết" : "Gắn tiêu chí"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
