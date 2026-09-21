'use client';
import { useState } from 'react';
import { CHILDREN, MESSAGES_DATA } from '../data/mockData';
import Avatar from '../components/Avatar';

type ChatMsg = { text: string; from: 'me' | 'parent'; time: string };

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [input, setInput] = useState('');
  const [readIds, setReadIds] = useState<Set<number>>(new Set([3, 4]));
  const [chats, setChats] = useState<Record<number, ChatMsg[]>>({
    2: [{ text: 'Cô ơi, hôm nay bé Long có chút sổ mũi, cô chú ý giúp con với ạ', from: 'parent', time: '08:15' }],
    5: [{ text: 'Cô ơi hôm nay bé Linh mang theo thuốc xịt hen, cô để ở ba lô bé giúp em', from: 'parent', time: '07:50' }],
    1: [{ text: 'Cảm ơn cô đã chăm sóc bé Anh chu đáo ạ 🙏', from: 'parent', time: 'Hôm qua' }],
    10: [{ text: 'Cô ơi bé Bảo về có kể hôm nay được khen, vui lắm ạ ❤️', from: 'parent', time: 'Hôm qua' }],
  });
  const [broadcast, setBroadcast] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const openChat = (childId: number) => {
    setActiveChat(childId);
    setReadIds(p => new Set([...p, childId]));
  };

  const sendMsg = () => {
    if (!input.trim() || activeChat === null) return;
    const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    setChats(p => ({
      ...p,
      [activeChat]: [...(p[activeChat] || []), { text: input, from: 'me', time: now }],
    }));
    setInput('');
  };

  const activeMsg = MESSAGES_DATA.find(m => m.childId === activeChat);
  const activeChild = CHILDREN.find(c => c.id === activeChat);

  const handleBroadcast = () => {
    setBroadcastSent(true);
    setBroadcast('');
    setTimeout(() => setBroadcastSent(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      {!activeChat ? (
        <>
          <h2 className="font-bold text-slate-800 text-xl mb-4">💬 Liên lạc phụ huynh</h2>

          {/* Message list */}
          <div className="flex flex-col gap-2 mb-5">
            {MESSAGES_DATA.map(m => {
              const c = CHILDREN.find(ch => ch.id === m.childId)!;
              const isRead = readIds.has(m.childId);
              const lastMsg = chats[m.childId]?.at(-1);
              return (
                <button
                  key={m.id}
                  onClick={() => openChat(m.childId)}
                  className="flex items-center gap-3 bg-white border border-orange-100 rounded-2xl p-4 text-left hover:border-orange-300 transition-all card-hover"
                >
                  <div className="relative">
                    <Avatar initials={c.avatar} id={c.id} size="md" />
                    {!isRead && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 text-sm">{m.parentName}</span>
                      <span className="text-xs text-slate-400 ml-auto flex-shrink-0">{lastMsg?.time || m.time}</span>
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${isRead ? 'text-slate-400' : 'text-slate-700 font-semibold'}`}>
                      {lastMsg?.from === 'me' ? '✓ ' : ''}{lastMsg?.text || m.message}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Broadcast */}
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mt-auto">
            <p className="font-bold text-orange-800 mb-3">📢 Thông báo nhanh đến tất cả phụ huynh</p>
            <textarea
              value={broadcast}
              onChange={e => setBroadcast(e.target.value)}
              className="w-full border border-orange-200 rounded-xl p-3 text-sm bg-white focus:outline-none focus:border-orange-400 resize-none"
              rows={2}
              placeholder="Nhập thông báo gửi toàn bộ phụ huynh lớp..."
            />
            {broadcastSent && (
              <p className="text-xs text-green-600 font-semibold mt-1 slide-in">
                ✅ Đã gửi thông báo đến {CHILDREN.length} phụ huynh!
              </p>
            )}
            <button
              onClick={handleBroadcast}
              disabled={!broadcast.trim()}
              className="mt-2 w-full bg-orange-400 text-white py-2 rounded-xl font-bold text-sm hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📤 Gửi thông báo
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col flex-1 -m-6 overflow-hidden bg-orange-50/30">
          {/* Chat header */}
          <div className="bg-gradient-to-br from-orange-400 to-orange-500 p-4 flex items-center gap-3 flex-shrink-0">
            <button onClick={() => setActiveChat(null)} className="text-white text-2xl w-8">←</button>
            <Avatar initials={activeChild!.avatar} id={activeChild!.id} size="sm" />
            <div>
              <p className="text-white font-bold">{activeMsg?.parentName || 'Phụ huynh'}</p>
              <p className="text-orange-100 text-xs">Phụ huynh bé {activeChild?.nickname}</p>
            </div>
            <button className="ml-auto bg-white/20 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:bg-white/30 transition-colors">
              📞 Gọi
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {(chats[activeChat] || []).map((c, i) => (
              <div key={i} className={`flex ${c.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs lg:max-w-sm px-4 py-2.5 rounded-2xl text-sm ${
                    c.from === 'me'
                      ? 'bg-orange-400 text-white rounded-br-sm'
                      : 'bg-white border border-orange-100 text-slate-700 rounded-bl-sm shadow-sm'
                  }`}
                >
                  <p>{c.text}</p>
                  <p className={`text-xs mt-1 ${c.from === 'me' ? 'text-orange-100' : 'text-slate-400'}`}>
                    {c.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-orange-100 flex gap-2 flex-shrink-0">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMsg()}
              className="flex-1 border border-orange-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
              placeholder="Nhắn tin cho phụ huynh..."
            />
            <button
              onClick={sendMsg}
              disabled={!input.trim()}
              className="bg-orange-400 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-orange-500 transition-colors disabled:opacity-50"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
