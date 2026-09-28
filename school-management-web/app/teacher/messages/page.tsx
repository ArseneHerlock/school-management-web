'use client';
import { useState, useMemo } from 'react';
import { CHILDREN } from '../data/mockData';
import Avatar from '../components/Avatar';

// ─── Types ────────────────────────────────────────────────────────────────────

type ContactType = 'father' | 'mother' | 'guardian';

type ParentContact = {
  type: ContactType;
  name: string;
  phone: string;
};

type ParentInfo = {
  childId: number;
  contacts: ParentContact[];
  primaryContact: ContactType;
};

type ChatMsg = { text: string; from: 'me' | 'parent'; time: string };

const CONTACT_META: Record<ContactType, { label: string; icon: string; color: string; bg: string; border: string }> = {
  father:   { label: 'Bố',            icon: '👨', color: 'text-blue-700',  bg: 'bg-blue-50',   border: 'border-blue-300'  },
  mother:   { label: 'Mẹ',            icon: '👩', color: 'text-pink-700',  bg: 'bg-pink-50',   border: 'border-pink-300'  },
  guardian: { label: 'G.hộ',          icon: '👤', color: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-300' },
};

// ─── Mock data ────────────────────────────────────────────────────────────────

const PARENT_DATA: ParentInfo[] = [
  { childId: 1,  primaryContact: 'mother', contacts: [{ type:'mother', name:'Nguyễn Thị Hoa',  phone:'0901234567' }, { type:'father', name:'Nguyễn Văn Bình', phone:'0901234590' }]},
  { childId: 2,  primaryContact: 'father', contacts: [{ type:'father', name:'Trần Văn Nam',    phone:'0902345678' }, { type:'mother', name:'Trần Thị Lan',    phone:'0902345699' }]},
  { childId: 3,  primaryContact: 'mother', contacts: [{ type:'mother', name:'Ngô Thị Hạnh',   phone:'0903456789' }, { type:'father', name:'Lê Văn Hùng',    phone:'0903456700' }]},
  { childId: 4,  primaryContact: 'guardian', contacts: [{ type:'mother', name:'Phạm Thị Liên', phone:'0904567890' }, { type:'guardian', name:'Phạm Văn Tú',  phone:'0904567800' }]},
  { childId: 5,  primaryContact: 'mother', contacts: [{ type:'mother', name:'Bùi Thị Yến',    phone:'0905678901' }, { type:'father', name:'Vũ Văn Tuấn',    phone:'0905678900' }]},
  { childId: 6,  primaryContact: 'father', contacts: [{ type:'father', name:'Hoàng Văn Minh', phone:'0906789012' }, { type:'mother', name:'Hoàng Thị Nga',  phone:'0906789000' }]},
  { childId: 7,  primaryContact: 'mother', contacts: [{ type:'mother', name:'Trần Thị Thu',   phone:'0907890123' }, { type:'father', name:'Đặng Văn Bình',  phone:'0907890100' }]},
  { childId: 8,  primaryContact: 'father', contacts: [{ type:'father', name:'Bùi Văn Quân',   phone:'0908901234' }, { type:'mother', name:'Bùi Thị Lan',    phone:'0908901200' }]},
  { childId: 9,  primaryContact: 'mother', contacts: [{ type:'mother', name:'Nguyễn Thị Mai', phone:'0909012345' }, { type:'father', name:'Ngô Văn Phúc',   phone:'0909012300' }]},
  { childId: 10, primaryContact: 'mother', contacts: [{ type:'mother', name:'Đinh Thị Kim',   phone:'0910123456' }, { type:'father', name:'Đinh Văn Long',  phone:'0910123400' }]},
  { childId: 11, primaryContact: 'guardian', contacts: [{ type:'guardian', name:'Lý Thị Bảo', phone:'0911234567' }, { type:'mother', name:'Lý Thị Ngân',   phone:'0911234500' }]},
  { childId: 12, primaryContact: 'father', contacts: [{ type:'father', name:'Trương Văn Hào', phone:'0912345678' }, { type:'mother', name:'Trương Thị Yến', phone:'0912345600' }]},
  { childId: 13, primaryContact: 'mother', contacts: [{ type:'mother', name:'Võ Thị Tuyết',  phone:'0913456789' }, { type:'father', name:'Võ Văn Tài',     phone:'0913456700' }]},
  { childId: 14, primaryContact: 'father', contacts: [{ type:'father', name:'Dương Văn Phú',  phone:'0914567890' }, { type:'mother', name:'Dương Thị Thu',  phone:'0914567800' }]},
  { childId: 15, primaryContact: 'mother', contacts: [{ type:'mother', name:'Lê Thị Hồng',   phone:'0915678901' }, { type:'father', name:'Mai Văn Hải',    phone:'0915678900' }]},
  { childId: 16, primaryContact: 'mother', contacts: [{ type:'mother', name:'Phan Thị Loan',  phone:'0916789012' }, { type:'father', name:'Phan Văn Dũng',  phone:'0916789000' }]},
  { childId: 17, primaryContact: 'father', contacts: [{ type:'father', name:'Tô Văn Khải',   phone:'0917890123' }, { type:'mother', name:'Tô Thị Hương',  phone:'0917890100' }]},
  { childId: 18, primaryContact: 'guardian', contacts: [{ type:'guardian', name:'Châu Văn Sơn', phone:'0918901234' }, { type:'mother', name:'Châu Thị Bảo', phone:'0918901200' }]},
  { childId: 19, primaryContact: 'mother', contacts: [{ type:'mother', name:'Nguyễn Thị Nhung', phone:'0919012345' }, { type:'father', name:'Lưu Văn Sơn',  phone:'0919012300' }]},
  { childId: 20, primaryContact: 'father', contacts: [{ type:'father', name:'Tạ Văn Bình',   phone:'0920123456' }, { type:'mother', name:'Tạ Thị Hương',  phone:'0920123400' }]},
  { childId: 21, primaryContact: 'mother', contacts: [{ type:'mother', name:'Lưu Thị Yến',   phone:'0921234567' }, { type:'father', name:'Cao Văn Minh',   phone:'0921234500' }]},
  { childId: 22, primaryContact: 'mother', contacts: [{ type:'mother', name:'Lâm Thị Trang',  phone:'0922345678' }, { type:'father', name:'Lâm Văn Quốc',   phone:'0922345600' }]},
];

const INIT_CHATS: Record<string, ChatMsg[]> = {
  '2-father': [{ text: 'Cô ơi, hôm nay bé Long có chút sổ mũi, cô chú ý giúp con với ạ', from: 'parent', time: '08:15' }],
  '5-mother': [{ text: 'Cô ơi hôm nay bé Linh mang theo thuốc xịt hen, cô để ở ba lô bé giúp em', from: 'parent', time: '07:50' }],
  '1-mother': [{ text: 'Cảm ơn cô đã chăm sóc bé Anh chu đáo ạ 🙏', from: 'parent', time: 'Hôm qua' }],
  '10-mother':[{ text: 'Cô ơi bé Bảo về có kể hôm nay được khen, vui lắm ạ ❤️', from: 'parent', time: 'Hôm qua' }],
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function MessagesPage() {
  const [view, setView]           = useState<'list' | 'chat' | 'group'>('list');
  const [activeChildId, setActiveChildId]       = useState<number | null>(null);
  const [activeContact, setActiveContact]       = useState<ContactType | null>(null);
  const [input, setInput]         = useState('');
  const [readKeys, setReadKeys]   = useState<Set<string>>(new Set(['1-mother','10-mother']));
  const [chats, setChats]         = useState<Record<string, ChatMsg[]>>(INIT_CHATS);
  const [searchQuery, setSearchQuery] = useState('');
  const [groupSearchQuery, setGroupSearchQuery] = useState('');
  const [parentData, setParentData]   = useState<ParentInfo[]>(PARENT_DATA);

  // Group send
  const [selectedGroup, setSelectedGroup] = useState<Set<number>>(new Set());
  const [groupMsg, setGroupMsg]     = useState('');
  const [groupSent, setGroupSent]   = useState(false);
  // Broadcast
  const [broadcast, setBroadcast]   = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // ── Helpers ──
  const chatKey = (childId: number, type: ContactType) => `${childId}-${type}`;

  const getInfo    = (childId: number) => parentData.find(p => p.childId === childId)!;
  const getContact = (childId: number, type: ContactType) =>
    getInfo(childId).contacts.find(c => c.type === type)!;

  const setPrimary = (childId: number, type: ContactType) =>
    setParentData(p => p.map(info => info.childId === childId ? { ...info, primaryContact: type } : info));

  // Check if any contact of a child has an unread message
  const hasUnread = (childId: number) => {
    const info = getInfo(childId);
    return info.contacts.some(c => {
      const k = chatKey(childId, c.type);
      return chats[k]?.length && !readKeys.has(k);
    });
  };

  // Check if a specific contact has unread messages
  const contactHasUnread = (childId: number, type: ContactType) => {
    const k = chatKey(childId, type);
    return chats[k]?.length && !readKeys.has(k);
  };

  // Last message across all contacts of a child
  const lastMsgForChild = (childId: number) => {
    const info = getInfo(childId);
    let last: (ChatMsg & { contactType: ContactType }) | null = null;
    info.contacts.forEach(c => {
      const msgs = chats[chatKey(childId, c.type)] || [];
      const m = msgs.at(-1);
      if (m && (!last || m.time > last.time)) last = { ...m, contactType: c.type };
    });
    return last as (ChatMsg & { contactType: ContactType }) | null;
  };

  // Figure out which contact to open for a child:
  // 1. If any contact has an unread message, pick the most recent one.
  // 2. Otherwise, pick the primary contact.
  const openChatForChild = (childId: number) => {
    const info = getInfo(childId);
    let targetContact = info.primaryContact;
    let mostRecentUnread: string | null = null;
    
    info.contacts.forEach(c => {
      if (contactHasUnread(childId, c.type)) {
        const m = chats[chatKey(childId, c.type)].at(-1);
        if (m && (!mostRecentUnread || m.time > mostRecentUnread)) {
          mostRecentUnread = m.time;
          targetContact = c.type;
        }
      }
    });

    const k = chatKey(childId, targetContact);
    setActiveChildId(childId);
    setActiveContact(targetContact);
    setReadKeys(p => new Set([...p, k]));
    setView('chat');
  };

  const sendMsg = () => {
    if (!input.trim() || activeChildId === null || activeContact === null) return;
    const k = chatKey(activeChildId, activeContact);
    const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    setChats(p => ({ ...p, [k]: [...(p[k] || []), { text: input, from: 'me', time: now }] }));
    setInput('');
  };

  const switchContact = (type: ContactType) => {
    if (!activeChildId) return;
    const k = chatKey(activeChildId, type);
    setActiveContact(type);
    setReadKeys(p => new Set([...p, k]));
  };

  // ── Search & Filter ──
  const searchFilter = (q: string) => {
    const query = q.toLowerCase().trim();
    if (!query) return CHILDREN;
    return CHILDREN.filter(c => {
      const info = getInfo(c.id);
      return (
        c.name.toLowerCase().includes(query) ||
        c.nickname.toLowerCase().includes(query) ||
        info.contacts.some(p => p.name.toLowerCase().includes(query) || p.phone.includes(query))
      );
    });
  };

  const filteredListChildren = useMemo(() => searchFilter(searchQuery), [searchQuery, parentData]); // eslint-disable-line react-hooks/exhaustive-deps
  const sortedList = [...filteredListChildren].sort((a, b) => {
    if (hasUnread(a.id) !== hasUnread(b.id)) return hasUnread(a.id) ? -1 : 1;
    return a.nickname.localeCompare(b.nickname);
  });

  const filteredGroupChildren = useMemo(() => searchFilter(groupSearchQuery), [groupSearchQuery, parentData]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Group ──
  const toggleGroup = (id: number) =>
    setSelectedGroup(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const sendGroupMsg = () => {
    if (!groupMsg.trim() || selectedGroup.size === 0) return;
    const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    setChats(p => {
      const updated = { ...p };
      selectedGroup.forEach(id => {
        const info = getInfo(id);
        const k = chatKey(id, info.primaryContact);
        updated[k] = [...(updated[k] || []), { text: groupMsg, from: 'me', time: now }];
      });
      return updated;
    });
    setGroupSent(true);
    setGroupMsg('');
    setSelectedGroup(new Set());
    setTimeout(() => { setGroupSent(false); setView('list'); }, 2000);
  };

  const handleBroadcast = () => {
    if (!broadcast.trim()) return;
    const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    setChats(p => {
      const updated = { ...p };
      CHILDREN.forEach(c => {
        const info = getInfo(c.id);
        const k = chatKey(c.id, info.primaryContact);
        updated[k] = [...(updated[k] || []), { text: broadcast, from: 'me', time: now }];
      });
      return updated;
    });
    setBroadcastSent(true);
    setBroadcast('');
    setTimeout(() => setBroadcastSent(false), 3000);
  };

  const activeChild = CHILDREN.find(c => c.id === activeChildId);

  // ════════════════════════════════════════════════════════
  // VIEW: CHAT
  // ════════════════════════════════════════════════════════
  if (view === 'chat' && activeChildId !== null && activeContact !== null && activeChild) {
    const info    = getInfo(activeChildId);
    const contact = getContact(activeChildId, activeContact);
    const meta    = CONTACT_META[activeContact];
    const k       = chatKey(activeChildId, activeContact);

    return (
      <div className="max-w-2xl mx-auto h-[calc(100vh-120px)] flex flex-col -m-4 sm:-m-6 overflow-hidden bg-slate-50">
        {/* Header (Child Info) */}
        <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-4 pb-2 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('list')} className="text-white text-2xl w-8 flex-shrink-0">←</button>
            <Avatar initials={activeChild.avatar} id={activeChild.id} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-lg leading-tight">{activeChild.name}</p>
            </div>
          </div>
        </div>

        {/* Header (Tabs for contacts) */}
        <div className="bg-orange-500 px-4 pt-1 pb-0 shadow-sm flex gap-1 overflow-x-auto flex-shrink-0">
          {info.contacts.map(c => {
            const m = CONTACT_META[c.type];
            const isActive = c.type === activeContact;
            const isPrimary = c.type === info.primaryContact;
            const hasMsg = !!(chats[chatKey(activeChildId, c.type)]?.length);
            const isUnreadTab = hasMsg && !readKeys.has(chatKey(activeChildId, c.type));

            return (
              <button key={c.type} onClick={() => switchContact(c.type)}
                className={`relative px-4 py-2.5 rounded-t-xl text-sm font-bold flex items-center gap-1.5 transition-all
                  ${isActive ? 'bg-slate-50 text-orange-600' : 'bg-transparent text-white/80 hover:text-white hover:bg-white/10'}`}>
                <span>{m.icon}</span>
                <span>{m.label} <span className="opacity-75 font-normal text-xs">({c.name.split(' ').at(-1)})</span></span>
                {isPrimary && <span className={isActive ? 'text-orange-400' : 'text-orange-200'}>★</span>}
                {isUnreadTab && !isActive && <span className="absolute top-2 right-2 w-2 h-2 bg-red-400 border border-orange-500 rounded-full" />}
              </button>
            );
          })}
        </div>
        
        {/* Active Contact Subheader */}
        <div className="bg-white border-b border-orange-100 px-4 py-2 flex items-center justify-between shadow-sm z-10 flex-shrink-0">
          <div className="text-sm">
            <span className="font-semibold text-slate-700">{contact.name}</span>
            <span className="text-slate-400 mx-2">•</span>
            <span className="text-slate-500 font-mono text-xs">{contact.phone}</span>
          </div>
          <div className="flex gap-2">
            <a href={`tel:${contact.phone}`}
               className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-100 transition-colors">
              📞 Gọi
            </a>
            {activeContact !== info.primaryContact && (
              <button onClick={() => setPrimary(activeChildId, activeContact)}
                className="bg-orange-50 text-orange-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-orange-100 transition-colors">
                ☆ Đặt làm chính
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {!(chats[k]?.length) && (
            <div className="text-center py-10 text-slate-400 flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-3xl mb-3">
                {meta.icon}
              </div>
              <p className="text-sm font-semibold">Chưa có tin nhắn</p>
              <p className="text-xs mt-1 text-slate-400">Bắt đầu trò chuyện với {meta.label} của bé {activeChild.nickname}</p>
            </div>
          )}
          {(chats[k] || []).map((msg, i) => (
            <div key={i} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-sm px-4 py-2.5 rounded-2xl text-sm ${
                msg.from === 'me'
                  ? 'bg-orange-400 text-white rounded-br-sm shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm shadow-sm'
              }`}>
                <p>{msg.text}</p>
                <p className={`text-[10px] mt-1 text-right ${msg.from === 'me' ? 'text-orange-100' : 'text-slate-400'}`}>{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-slate-200 flex gap-2 flex-shrink-0">
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMsg()}
            className="flex-1 border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:bg-white transition-colors"
            placeholder={`Nhắn cho ${meta.label.toLowerCase()} bé...`} />
          <button onClick={sendMsg} disabled={!input.trim()}
            className="bg-orange-400 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-orange-500 transition-colors disabled:opacity-50 shadow-sm">
            Gửi
          </button>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════
  // VIEW: GROUP SELECT
  // ════════════════════════════════════════════════════════
  if (view === 'group') {
    return (
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => { setView('list'); setSelectedGroup(new Set()); setGroupMsg(''); setGroupSearchQuery(''); }}
            className="text-slate-500 hover:text-orange-600 font-semibold text-sm">← Quay lại</button>
          <h2 className="flex-1 font-black text-slate-800">Gửi tin nhóm</h2>
          {selectedGroup.size > 0 && (
            <span className="bg-orange-400 text-white text-xs font-bold px-2.5 py-1 rounded-full">{selectedGroup.size} đã chọn</span>
          )}
        </div>
        
        {/* Search for group */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
          <input value={groupSearchQuery} onChange={e => setGroupSearchQuery(e.target.value)}
            className="w-full border border-orange-200 rounded-xl pl-9 pr-10 py-2.5 text-sm focus:outline-none focus:border-orange-400 bg-white"
            placeholder="Tìm theo tên bé, tên phụ huynh để chọn..." />
          {groupSearchQuery && (
            <button onClick={() => setGroupSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          {[
            { label:'Chọn tất cả (đang hiển thị)', fn: () => setSelectedGroup(new Set(filteredGroupChildren.map(c => c.id))), cls:'bg-orange-50 border-orange-200 text-orange-700' },
            { label:'👦 Bé trai',   fn: () => setSelectedGroup(new Set(filteredGroupChildren.filter(c => c.gender === 'M').map(c => c.id))), cls:'bg-blue-50 border-blue-200 text-blue-700' },
            { label:'👧 Bé gái',   fn: () => setSelectedGroup(new Set(filteredGroupChildren.filter(c => c.gender === 'F').map(c => c.id))), cls:'bg-pink-50 border-pink-200 text-pink-700' },
            { label:'Bỏ chọn',     fn: () => setSelectedGroup(new Set()), cls:'bg-slate-50 border-slate-200 text-slate-600' },
          ].map(b => (
            <button key={b.label} onClick={b.fn}
              className={`text-xs border px-3 py-1.5 rounded-full font-semibold hover:opacity-80 transition-opacity ${b.cls}`}>
              {b.label}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
          {filteredGroupChildren.length === 0 && (
             <div className="col-span-3 sm:col-span-4 text-center py-4 text-slate-400 text-sm">Không tìm thấy kết quả</div>
          )}
          {filteredGroupChildren.map(c => {
            const sel = selectedGroup.has(c.id);
            const info = getInfo(c.id);
            const primary = info.contacts.find(ct => ct.type === info.primaryContact)!;
            const m = CONTACT_META[primary.type];
            return (
              <button key={c.id} onClick={() => toggleGroup(c.id)}
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 transition-all ${sel ? 'bg-orange-50 border-orange-400' : 'bg-white border-slate-200 hover:border-orange-200'}`}>
                <div className="relative">
                  <Avatar initials={c.avatar} id={c.id} size="sm" />
                  {sel && <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-full text-white text-xs flex items-center justify-center font-bold">✓</span>}
                </div>
                <span className="text-xs font-bold truncate w-full text-center">{c.nickname}</span>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 w-full justify-center">
                  <span>{m.icon}</span><span className="truncate">{primary.name.split(' ').at(-1)}</span>
                </div>
              </button>
            );
          })}
        </div>
        {groupSent ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
            <p className="text-green-700 font-bold">✅ Đã gửi đến {selectedGroup.size} phụ huynh!</p>
          </div>
        ) : (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex flex-col gap-3">
            <p className="text-sm font-bold text-orange-800">
              ✉️ Soạn tin gửi {selectedGroup.size > 0 ? `${selectedGroup.size} bé đã chọn` : 'nhóm'}
            </p>
            <p className="text-xs text-slate-500 -mt-2">Tin sẽ được gửi đến liên lạc chính (★) của mỗi bé được chọn</p>
            <textarea value={groupMsg} onChange={e => setGroupMsg(e.target.value)} rows={3}
              className="w-full border border-orange-200 bg-white rounded-xl p-3 text-sm focus:outline-none focus:border-orange-400 resize-none"
              placeholder="Nội dung tin nhắn gửi nhóm..." />
            <button onClick={sendGroupMsg} disabled={!groupMsg.trim() || selectedGroup.size === 0}
              className="w-full bg-orange-400 hover:bg-orange-500 text-white py-3 rounded-xl font-bold transition-colors disabled:opacity-40">
              📤 Gửi đến {selectedGroup.size} phụ huynh
            </button>
          </div>
        )}
      </div>
    );
  }

  // ════════════════════════════════════════════════════════
  // VIEW: LIST
  // ════════════════════════════════════════════════════════
  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <h2 className="font-black text-slate-800 text-lg">💬 Liên lạc phụ huynh</h2>
          <p className="text-sm text-slate-400">{CHILDREN.length} gia đình · {CHILDREN.filter(c => hasUnread(c.id)).length > 0 ? `${CHILDREN.filter(c => hasUnread(c.id)).length} chưa đọc` : 'Đã đọc hết'}</p>
        </div>
        <button onClick={() => setView('group')}
          className="flex items-center gap-1.5 bg-orange-50 border border-orange-300 text-orange-700 px-3 py-2 rounded-xl text-sm font-bold hover:bg-orange-100 transition-colors shadow-sm">
          👥 Gửi nhóm
        </button>
      </div>

      {/* Search */}
      <div className="relative shadow-sm rounded-xl">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
        <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          className="w-full border border-orange-200 rounded-xl pl-9 pr-10 py-2.5 text-sm focus:outline-none focus:border-orange-400 bg-white"
          placeholder="Tìm theo tên bé, tên phụ huynh, số điện thoại..." />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
        )}
      </div>
      {searchQuery && (
        <p className="text-xs text-slate-500 -mt-2">Tìm thấy <strong>{filteredListChildren.length}</strong> kết quả</p>
      )}

      {/* List */}
      <div className="flex flex-col gap-2">
        {sortedList.length === 0 && (
          <div className="text-center py-10 text-slate-400">
            <p className="text-3xl mb-2">🔍</p>
            <p className="font-semibold">Không tìm thấy kết quả</p>
          </div>
        )}

        {sortedList.map(c => {
          const info    = getInfo(c.id);
          const unread  = hasUnread(c.id);
          const lastMsg = lastMsgForChild(c.id);
          
          let lastMsgSenderName = '';
          if (lastMsg && lastMsg.from === 'parent') {
             const mContact = info.contacts.find(ct => ct.type === lastMsg.contactType);
             if (mContact) {
               lastMsgSenderName = `${CONTACT_META[mContact.type].icon} ${mContact.name.split(' ').at(-1)}: `;
             }
          }

          return (
            <button key={c.id} onClick={() => openChatForChild(c.id)}
              className={`flex items-center gap-4 bg-white border rounded-2xl p-4 transition-all text-left hover:shadow-sm ${
                unread ? 'border-orange-400 bg-orange-50/20' : 'border-slate-100 hover:border-orange-200'
              }`}>
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <Avatar initials={c.avatar} id={c.id} size="md" />
                {unread && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white" />}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-slate-800">{c.name}</span>
                  {lastMsg && <span className="text-xs text-slate-400 ml-auto flex-shrink-0">{lastMsg.time}</span>}
                </div>
                
                <p className={`text-sm truncate ${unread ? 'text-slate-800 font-semibold' : 'text-slate-500'}`}>
                  {lastMsg
                    ? (lastMsg.from === 'me' ? `Bạn: ${lastMsg.text}` : `${lastMsgSenderName}${lastMsg.text}`)
                    : <span className="italic text-slate-400">Chưa có tin nhắn</span>}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Broadcast */}
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mt-2">
        <p className="font-bold text-orange-800 mb-1">📢 Thông báo nhanh toàn lớp</p>
        <p className="text-xs text-slate-500 mb-3">Gửi đến liên lạc chính của tất cả {CHILDREN.length} gia đình</p>
        <textarea value={broadcast} onChange={e => setBroadcast(e.target.value)} rows={2}
          className="w-full border border-orange-200 rounded-xl p-3 text-sm bg-white focus:outline-none focus:border-orange-400 resize-none"
          placeholder="Nhập thông báo gửi toàn bộ phụ huynh lớp..." />
        {broadcastSent && <p className="text-xs text-green-600 font-semibold mt-1">✅ Đã gửi thông báo đến {CHILDREN.length} phụ huynh!</p>}
        <button onClick={handleBroadcast} disabled={!broadcast.trim()}
          className="mt-2 w-full bg-orange-400 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-orange-500 transition-colors disabled:opacity-50 shadow-sm">
          📤 Gửi đến tất cả
        </button>
      </div>
    </div>
  );
}
