"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Filter, Search, Users, Loader2, ChevronRight } from "lucide-react";
import { ContactPerson, RawRecord, getInitials } from "../types";
import Pagination from "@/app/admin/components/shared/Pagination";

interface LienLacContactsDirectoryProps {
  searchKeyword: string;
  setSearchKeyword: (val: string) => void;
  selectedClassId: string;
  setSelectedClassId: (val: string) => void;
  selectedGradeId: string;
  setSelectedGradeId: (val: string) => void;
  selectedRoleFilter: string;
  setSelectedRoleFilter: (val: string) => void;
  classesList: RawRecord[];
  gradesList: RawRecord[];
  filteredContacts: ContactPerson[];
  isLoadingContacts: boolean;
  onOpenConversation: (person: ContactPerson) => void;
}

export function LienLacContactsDirectory({
  searchKeyword,
  setSearchKeyword,
  selectedClassId,
  setSelectedClassId,
  selectedGradeId,
  setSelectedGradeId,
  selectedRoleFilter,
  setSelectedRoleFilter,
  classesList,
  gradesList,
  filteredContacts,
  isLoadingContacts,
  onOpenConversation,
}: LienLacContactsDirectoryProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(24);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword, selectedClassId, selectedGradeId, selectedRoleFilter]);

  const totalPages = Math.ceil(filteredContacts.length / pageSize) || 1;
  const paginatedContacts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredContacts.slice(start, start + pageSize);
  }, [filteredContacts, currentPage, pageSize]);

  return (
    <>
      {/* Bộ lọc danh bạ */}
      <div className="admin-card shrink-0 space-y-3 p-4">
        <div className="flex items-center gap-2 text-sm font-black text-slate-700">
          <Filter size={17} className="text-emerald-600" /> Bộ lọc liên lạc
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              className="admin-input pl-10"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Tìm tên người liên lạc..."
            />
          </div>

          <select
            className="admin-input"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
          >
            <option value="ALL">Tất cả lớp</option>
            {classesList.map((classItem) => {
              const classId = classItem.id || classItem.Id;
              const className = classItem.tenLop || classItem.TenLop;
              return (
                <option key={classId} value={classId}>
                  {className}
                </option>
              );
            })}
          </select>

          <select
            className="admin-input"
            value={selectedGradeId}
            onChange={(e) => setSelectedGradeId(e.target.value)}
          >
            <option value="ALL">Tất cả khối</option>
            {gradesList.map((gradeItem) => {
              const gradeId = gradeItem.id || gradeItem.Id;
              const gradeName = gradeItem.tenKhoi || gradeItem.TenKhoi;
              return (
                <option key={gradeId} value={gradeId}>
                  {gradeName}
                </option>
              );
            })}
          </select>

          <select
            className="admin-input"
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
          >
            <option value="ALL">Tất cả vai trò</option>
            <option value="PHU_HUYNH">Phụ huynh</option>
            <option value="GIAO_VIEN">Giáo viên</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Users size={15} />
          Hiển thị {filteredContacts.length} người
        </div>
      </div>

      {/* Lưới danh bạ liên lạc */}
      <div className="w-full space-y-6">
        {isLoadingContacts ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-emerald-500" />
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {paginatedContacts.map((person) => (
                <button
                  key={`${person.role}-${person.accountId}`}
                  onClick={() => onOpenConversation(person)}
                  className="group admin-card p-5 text-left transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 font-black text-emerald-700">
                      {getInitials(person.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="truncate font-black text-slate-800">
                        {person.name}
                      </h2>
                      <p className="mt-1 text-xs font-bold text-emerald-600">
                        {person.role === "PHU_HUYNH" ? "Phụ huynh" : "Giáo viên"}
                      </p>
                    </div>
                    <ChevronRight
                      size={18}
                      className="text-slate-300 group-hover:text-emerald-600"
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {person.classNames.length > 0 ? (
                      person.classNames.map((className) => (
                        <span key={className} className="admin-chip">
                          {className}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400">
                        Chưa có lớp liên kết
                      </span>
                    )}
                  </div>

                  <p className="mt-3 truncate text-xs text-slate-400">
                    {person.conversation ? "Đã có hội thoại" : "Chưa mở hội thoại"}
                  </p>
                </button>
              ))}

              {filteredContacts.length === 0 && (
                <div className="admin-card p-12 text-center text-sm text-slate-400 col-span-full">
                  Không tìm thấy người phù hợp.
                </div>
              )}
            </div>

            {filteredContacts.length > pageSize && (
              <div className="flex justify-center pt-2">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredContacts.length}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={(sz) => {
                    setPageSize(sz);
                    setCurrentPage(1);
                  }}
                  pageSizeOptions={[18, 24, 48, 96]}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
