'use client';

import React from 'react';
import {
  ArrowLeft,
  Phone,
  ShieldCheck,
  Loader2,
  MessageSquare,
  CheckCheck,
  Send,
} from 'lucide-react';
import { ParentContact, RawRecord } from '../types';
import {
  getInitials,
  getMessageId,
  getMessageContent,
  getSenderId,
} from '../helpers';

interface ChatConversationPaneProps {
  selectedParent: ParentContact | null;
  activeConversation: RawRecord | null;
  messages: RawRecord[];
  loadingMessages: boolean;
  draftMessage: string;
  setDraftMessage: (s: string) => void;
  sending: boolean;
  currentTeacherId: string;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onBack: () => void;
  onSendMessage: () => void;
}

export function ChatConversationPane({
  selectedParent,
  activeConversation,
  messages,
  loadingMessages,
  draftMessage,
  setDraftMessage,
  sending,
  currentTeacherId,
  messagesEndRef,
  onBack,
  onSendMessage,
}: ChatConversationPaneProps) {
  if (!selectedParent || !activeConversation) {
    return (
      <main className="min-h-0 min-w-0 flex-col bg-white flex-1 hidden md:flex items-center justify-center p-8 text-center text-slate-400">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-50 text-orange-400 mb-4 border border-orange-100">
          <MessageSquare size={40} />
        </div>
        <h3 className="text-lg font-black text-slate-700">Chọn phụ huynh để bắt đầu trò chuyện</h3>
        <p className="mt-1.5 max-w-sm text-xs text-slate-500 leading-relaxed">
          Chọn một phụ huynh trong danh sách lớp học ở cột bên trái để xem lịch sử trao đổi hoặc gửi thông báo trực tiếp.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-0 min-w-0 flex-col bg-white flex-1 flex w-full">
      <div className="flex shrink-0 items-center justify-between border-b border-orange-100 bg-white px-4 sm:px-6 py-3">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            onClick={onBack}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 cursor-pointer md:hidden shrink-0"
            title="Quay lại danh sách phụ huynh"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-sm font-black text-white shadow-xs">
            {getInitials(selectedParent.name)}
          </div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-black text-slate-800 truncate">
              {selectedParent.name}
            </h2>
            <p className="text-[11px] sm:text-xs text-orange-600 font-bold truncate">
              Phụ huynh của bé: {selectedParent.children.join(', ')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedParent.phoneNumber && (
            <a
              href={`tel:${selectedParent.phoneNumber}`}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition"
              title="Gọi điện cho phụ huynh"
            >
              <Phone size={13} />
              <span className="hidden sm:inline">{selectedParent.phoneNumber}</span>
            </a>
          )}

          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <ShieldCheck size={13} />
            <span>Học sinh trong lớp</span>
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-50/60 p-6 space-y-4">
        {loadingMessages ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <Loader2 className="animate-spin text-orange-500 mb-2" size={30} />
            <p className="text-xs font-bold text-slate-600">Đang tải lịch sử tin nhắn...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-100 text-orange-500 mb-3">
              <MessageSquare size={32} />
            </div>
            <p className="text-base font-black text-slate-700">Chưa có tin nhắn nào</p>
            <p className="mt-1 text-xs text-slate-500 max-w-sm">
              Hãy gửi lời chào đầu tiên để trao đổi về tình hình học tập và sinh hoạt của bé với phụ huynh.
            </p>
          </div>
        ) : (
          <>
            <div className="text-center my-2">
              <span className="text-[11px] font-bold text-slate-400 bg-white/80 border border-slate-200/60 rounded-full px-3 py-1">
                Hội thoại được lưu trữ và bảo mật
              </span>
            </div>

            {messages.map((message, index) => {
              const sender = getSenderId(message);
              const isTeacherMessage = Boolean(
                currentTeacherId && sender && sender === currentTeacherId
              );
              const content = getMessageContent(message);
              const timeString = String(
                message.messageSentAt || message.MessageSentAt || message.createdAt || ''
              ).slice(11, 16);

              return (
                <div
                  key={getMessageId(message) || index}
                  className={`flex items-end gap-2 ${
                    isTeacherMessage ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {!isTeacherMessage && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-[11px] font-black text-orange-700">
                      {getInitials(selectedParent.name)}
                    </div>
                  )}

                  <div
                    className={`max-w-[75%] rounded-3xl px-4 py-3 text-sm shadow-xs ${
                      isTeacherMessage
                        ? 'rounded-br-xs bg-orange-500 text-white font-medium'
                        : 'rounded-bl-xs bg-white text-slate-800 border border-slate-200/70'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words leading-relaxed">
                      {content}
                    </p>

                    <div
                      className={`mt-1.5 flex items-center gap-1 text-[10px] ${
                        isTeacherMessage
                          ? 'justify-end text-orange-100'
                          : 'text-slate-400'
                      }`}
                    >
                      <span>{timeString || 'Vừa xong'}</span>
                      {isTeacherMessage && <CheckCheck size={13} className="text-orange-200" />}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="shrink-0 border-t border-orange-100 bg-white p-4">
        <div className="flex items-end gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-2 focus-within:border-orange-400 focus-within:bg-white transition">
          <textarea
            rows={2}
            value={draftMessage}
            onChange={(e) => setDraftMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSendMessage();
              }
            }}
            placeholder={`Nhắn tin trao đổi với phụ huynh bé ${selectedParent.children.join(', ')}... (Nhấn Enter để gửi)`}
            className="w-full resize-none bg-transparent px-2 py-1 text-sm text-slate-800 placeholder:text-slate-400 outline-none"
          />

          <button
            disabled={!draftMessage.trim() || sending}
            onClick={onSendMessage}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white shadow-sm shadow-orange-500/30 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            title="Gửi tin nhắn"
          >
            {sending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={17} />
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
