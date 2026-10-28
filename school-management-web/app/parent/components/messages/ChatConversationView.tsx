'use client'

import React from 'react'
import { ArrowLeft, Loader2, MessageCircle, Send, CheckCheck } from 'lucide-react'
import { Teacher, Raw, initials, senderId, messageId, textOf } from './types'

interface ChatConversationViewProps {
  teacher: Teacher | null
  conversation: Raw | null
  messages: Raw[]
  loadingMessages: boolean
  text: string
  setText: (t: string) => void
  sending: boolean
  onSend: () => Promise<void>
  onBack: () => void
  currentUserId: string
  bottomRef: React.RefObject<HTMLDivElement | null>
}

export const ChatConversationView: React.FC<ChatConversationViewProps> = ({
  teacher,
  conversation,
  messages,
  loadingMessages,
  text,
  setText,
  sending,
  onSend,
  onBack,
  currentUserId,
  bottomRef,
}) => {
  if (!teacher || !conversation) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center text-slate-400">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-500">
          <MessageCircle size={28} />
        </div>
        <p className="font-extrabold text-slate-800">Chọn giáo viên để mở chat</p>
        <p className="mt-1 text-xs">Danh sách giáo viên nằm ở cột bên trái.</p>
      </div>
    )
  }

  return (
    <>
      <header className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-white px-5 py-3.5">
        <div className="flex min-w-0 items-center gap-3">
          <button
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 cursor-pointer md:hidden shrink-0"
            onClick={onBack}
            title="Quay lại danh sách"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 font-extrabold text-white">
            {initials(teacher.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold text-slate-900">{teacher.name}</p>
            <p className="truncate text-[11px] text-indigo-600">
              Lớp: {teacher.classes.join(', ')} · Con: {teacher.children.join(', ')}
            </p>
          </div>
        </div>
        <span className="hidden rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold text-indigo-600 sm:block">
          Giáo viên chủ nhiệm
        </span>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 lg:px-8">
        {loadingMessages ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="animate-spin text-indigo-500" />
          </div>
        ) : messages.length ? (
          <div className="mx-auto max-w-3xl space-y-3">
            {messages.map((m, i) => {
              const sId = senderId(m)
              const mine = Boolean(currentUserId && sId && sId === currentUserId)
              return (
                <div
                  key={messageId(m) || i}
                  className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm ${
                      mine ? 'bg-indigo-600 text-white' : 'border border-slate-200 bg-white text-slate-700 shadow-2xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{textOf(m)}</p>
                    <p
                      className={`mt-1 flex items-center gap-1 text-[10px] ${
                        mine ? 'justify-end text-indigo-100' : 'text-slate-400'
                      }`}
                    >
                      {String(m.messageSentAt || m.MessageSentAt || m.createdAt || '').slice(11, 16)}{' '}
                      {mine && <CheckCheck size={12} />}
                    </p>
                  </div>
                </div>
              )
            })}
            <div ref={bottomRef} />
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center text-slate-400">
            <MessageCircle size={32} className="mb-3 text-indigo-300" />
            <p className="font-bold text-slate-700">Chưa có tin nhắn</p>
            <p className="mt-1 text-xs">Hãy gửi lời nhắn đầu tiên cho giáo viên.</p>
          </div>
        )}
      </div>

      <div className="flex shrink-0 gap-2 border-t border-slate-100 bg-white p-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              void onSend()
            }
          }}
          placeholder="Nhập tin nhắn..."
          className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-300"
        />
        <button
          onClick={() => void onSend()}
          disabled={!text.trim() || sending}
          className="rounded-xl bg-indigo-600 px-4 text-white disabled:opacity-40 cursor-pointer"
        >
          <Send size={17} />
        </button>
      </div>
    </>
  )
}
