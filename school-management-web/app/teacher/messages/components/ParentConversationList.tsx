'use client';

import React from 'react';
import { UserRound, Search, X, Loader2, ChevronRight } from 'lucide-react';
import { ParentContact, RawRecord } from '../types';
import { getInitials, getParticipantIds } from '../helpers';

interface ParentConversationListProps {
  parentContacts: ParentContact[];
  filteredParents: ParentContact[];
  selectedParent: ParentContact | null;
  conversations: RawRecord[];
  searchKeyword: string;
  setSearchKeyword: (s: string) => void;
  loadingContacts: boolean;
  onSelectParent: (p: ParentContact) => void;
}

export function ParentConversationList({
  parentContacts,
  filteredParents,
  selectedParent,
  conversations,
  searchKeyword,
  setSearchKeyword,
  loadingContacts,
  onSelectParent,
}: ParentConversationListProps) {
  return (
    <aside
      className={`min-h-0 flex-col border-r border-orange-100 bg-slate-50/50 md:w-80 lg:w-96 shrink-0 ${
        selectedParent ? 'hidden md:flex' : 'flex w-full'
      }`}
    >
      <div className="p-4 border-b border-orange-100/80 bg-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
            <UserRound size={15} className="text-orange-500" />
            Danh sách phụ huynh trong lớp
          </span>
          <span className="text-[11px] font-extrabold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
            {parentContacts.length} phụ huynh
          </span>
        </div>

        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Tìm theo tên bố mẹ hoặc tên bé..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-8 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-orange-400 focus:bg-white transition"
          />
          {searchKeyword && (
            <button
              onClick={() => setSearchKeyword('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {loadingContacts ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Loader2 className="animate-spin text-orange-500 mb-2" size={26} />
            <p className="text-xs font-bold text-slate-600">Đang đồng bộ phụ huynh...</p>
          </div>
        ) : filteredParents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-xs text-slate-400">
            {searchKeyword
              ? 'Không tìm thấy phụ huynh nào khớp với từ khóa.'
              : 'Chưa có dữ liệu phụ huynh nào trong lớp được phân công.'}
          </div>
        ) : (
          filteredParents.map((parent) => {
            const isSelected = selectedParent?.accountId === parent.accountId;
            const hasExistingChat = conversations.some((conv) =>
              getParticipantIds(conv).includes(parent.accountId)
            );

            return (
              <button
                key={parent.accountId}
                onClick={() => onSelectParent(parent)}
                className={`w-full text-left rounded-2xl p-3 border transition-all cursor-pointer flex items-center gap-3 ${
                  isSelected
                    ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20'
                    : 'bg-white border-slate-200/80 hover:border-orange-300 hover:bg-orange-50/30'
                }`}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xs font-black transition-all ${
                    isSelected
                      ? 'bg-white text-orange-600'
                      : 'bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-xs'
                  }`}
                >
                  {getInitials(parent.name)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p
                      className={`font-black text-sm truncate ${
                        isSelected ? 'text-white' : 'text-slate-800'
                      }`}
                    >
                      {parent.name}
                    </p>
                  </div>

                  <p
                    className={`text-xs truncate font-bold mt-0.5 ${
                      isSelected ? 'text-orange-100' : 'text-orange-600'
                    }`}
                  >
                    Bé: {parent.children.join(', ')}
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`inline-block text-[10px] font-semibold ${
                        isSelected
                          ? 'text-orange-200'
                          : hasExistingChat
                          ? 'text-slate-500'
                          : 'text-slate-400 italic'
                      }`}
                    >
                      {hasExistingChat ? 'Đã có lịch sử trò chuyện' : 'Chưa có tin nhắn'}
                    </span>
                  </div>
                </div>

                <ChevronRight
                  size={16}
                  className={`shrink-0 ${
                    isSelected ? 'text-white' : 'text-slate-300'
                  }`}
                />
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
