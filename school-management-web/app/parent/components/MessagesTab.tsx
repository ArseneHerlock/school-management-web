'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ChildInfo } from '../types';

interface MessagesTabProps {
  child: ChildInfo;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onOpenCall: () => void;
}

export default function MessagesTab({
  child,
  messages,
  onSendMessage,
  onOpenCall,
}: MessagesTabProps) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  return (
    <section className="space-y-4">
      {/* Teacher Profile Bar with Call Actions */}
      <div className="card-frame p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-sky-600 text-white flex items-center justify-center font-bold text-lg shadow-xs border border-sky-300">
              NL
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-800 text-base">{child.giaoVienChuNhiem}</h3>
              <span className="text-[11px] font-bold px-2 py-0.5 bg-sky-50 text-sky-600 border border-sky-200 rounded-full">
                GVCN
              </span>
            </div>
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Đang trực tuyến · {child.lop} (SĐT: {child.sdtGiaoVien})
            </p>
          </div>
        </div>

        {/* Quick Call Buttons (Yêu cầu: bổ sung nút gọi điện cho giáo viên) */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCall}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-xs transition-all cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span>Gọi điện cho cô giáo</span>
          </button>
          <a
            href={`tel:${child.sdtGiaoVien.replace(/\s+/g, '')}`}
            title="Gọi trực tiếp qua SIM"
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><line x1="12" x2="12.01" y1="18" y2="18"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Chat History Box */}
      <div className="card-frame flex flex-col h-[520px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto parent-scroll">
          {/* Timestamp Divider */}
          <div className="flex items-center justify-center">
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
              Hôm nay, 25 Tháng 9
            </span>
          </div>

          {messages.map((msg) => {
            const isParent = msg.sender === 'parent';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 max-w-[85%] ${
                  isParent ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-1 text-white ${
                    isParent ? 'bg-indigo-500' : 'bg-sky-500'
                  }`}
                >
                  {msg.avatarText}
                </div>
                <div className={`flex flex-col ${isParent ? 'items-end' : ''}`}>
                  {!isParent && (
                    <p className="text-[11px] font-bold text-slate-500 mb-1 ml-1">{msg.senderName}</p>
                  )}
                  <div
                    className={`p-3.5 text-sm shadow-xs leading-relaxed ${
                      isParent
                        ? 'bg-sky-500 text-white rounded-2xl rounded-tr-xs'
                        : 'bg-slate-100 text-slate-800 border border-slate-200 rounded-2xl rounded-tl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className={`flex items-center gap-1 mt-1 ${isParent ? 'mr-1' : 'ml-1'}`}>
                    <span className="text-[10px] text-slate-400">{msg.time}</span>
                    {isParent && <span className="text-sky-500 text-[10px] font-bold">✓✓</span>}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/50 rounded-b-2xl">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <button
              type="button"
              className="p-2 text-slate-400 hover:text-sky-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Đính kèm ảnh/tài liệu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
              </svg>
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Nhập tin nhắn trao đổi với cô giáo..."
              className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="bg-sky-500 hover:bg-sky-600 text-white p-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
              title="Gửi tin nhắn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
