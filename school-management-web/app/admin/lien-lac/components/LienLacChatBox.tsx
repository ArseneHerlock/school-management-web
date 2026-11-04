"use client";

import React from "react";
import {
  ArrowLeft,
  Loader2,
  MessageCircle,
  Send,
  Wifi,
  WifiOff,
} from "lucide-react";
import {
  ContactPerson,
  RawRecord,
  getInitials,
  getMessageText,
  getSenderUserId,
} from "../types";

interface LienLacChatBoxProps {
  selectedContact: ContactPerson;
  onBack: () => void;
  isConnectedToHub: boolean;
  isLoadingMessages: boolean;
  messagesList: RawRecord[];
  currentUserId: string;
  inputMessageText: string;
  setInputMessageText: (val: string) => void;
  isSendingMessage: boolean;
  onSendMessage: () => void;
}

export function LienLacChatBox({
  selectedContact,
  onBack,
  isConnectedToHub,
  isLoadingMessages,
  messagesList,
  currentUserId,
  inputMessageText,
  setInputMessageText,
  isSendingMessage,
  onSendMessage,
}: LienLacChatBoxProps) {
  return (
    <div className="admin-card flex min-h-0 flex-1 flex-col overflow-hidden">
      {/* Header chat */}
      <header className="flex shrink-0 items-center gap-3 border-b border-emerald-100 bg-white p-4">
        <button
          onClick={onBack}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-50 cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 font-black text-emerald-700">
          {getInitials(selectedContact.name)}
        </div>
        <div>
          <h2 className="font-black text-slate-800">{selectedContact.name}</h2>
          <p className="text-xs text-emerald-600">
            {selectedContact.role === "PHU_HUYNH" ? "Phụ huynh" : "Giáo viên"}
            {selectedContact.classNames.length > 0 &&
              ` · ${selectedContact.classNames.join(", ")}`}
          </p>
        </div>
        <span className="ml-auto flex items-center gap-1 text-xs text-slate-400">
          {isConnectedToHub ? (
            <>
              <Wifi size={14} className="text-emerald-500" />
              Đang kết nối
            </>
          ) : (
            <>
              <WifiOff size={14} />
              Ngoại tuyến
            </>
          )}
        </span>
      </header>

      {/* Vùng tin nhắn */}
      <div className="flex min-h-0 flex-1 flex-col bg-slate-50">
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {isLoadingMessages ? (
            <Loader2 className="mx-auto my-16 animate-spin text-emerald-500" />
          ) : messagesList.length > 0 ? (
            <div className="space-y-2">
              {messagesList.map((messageItem, index) => {
                const messageId =
                  messageItem.messageId ||
                  messageItem.MessageId ||
                  messageItem.id ||
                  index;
                const isMyMessage =
                  getSenderUserId(messageItem) === currentUserId;

                return (
                  <div
                    key={messageId}
                    className={`max-w-[78%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      isMyMessage
                        ? "ml-auto bg-emerald-600 text-white"
                        : "bg-white text-slate-700 shadow-sm"
                    }`}
                  >
                    {getMessageText(messageItem)}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center text-sm text-slate-400">
              <MessageCircle className="mx-auto mb-2 text-slate-300" />
              Chưa có tin nhắn trong hội thoại này
            </div>
          )}
        </div>

        {/* Thanh soạn thảo và gửi tin nhắn */}
        <div className="flex shrink-0 gap-2 border-t border-slate-200 bg-white p-3">
          <textarea
            rows={1}
            className="min-w-0 flex-1 resize-none rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-400"
            value={inputMessageText}
            onChange={(e) => setInputMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSendMessage();
              }
            }}
            placeholder="Nhập tin nhắn..."
          />
          <button
            disabled={!inputMessageText.trim() || isSendingMessage}
            onClick={onSendMessage}
            className="rounded-xl bg-emerald-600 px-4 text-white disabled:opacity-40 cursor-pointer"
          >
            <Send size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
