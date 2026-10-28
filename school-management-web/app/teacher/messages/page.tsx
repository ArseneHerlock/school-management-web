'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  CheckCheck,
  ChevronRight,
  Loader2,
  MessageSquare,
  RefreshCw,
  Search,
  Send,
  UserRound,
  Wifi,
  WifiOff,
  X,
  Phone,
  Smile,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { api, currentUser, createHubConnection } from '@/services';
import { CHILDREN, loadLiveTeacherChildren } from '../data';

interface ParentContact {
  accountId: string;
  name: string;
  phoneNumber?: string;
  children: string[];
}

type RawRecord = Record<string, any>;

/**
 * Trích xuất danh sách mảng an toàn từ response API
 */
function extractArray(value: any): RawRecord[] {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  return [];
}

/**
 * Lấy ID cuộc trò chuyện từ bản ghi
 */
function getConversationId(item?: RawRecord | null): string {
  return String(
    item?.messageConversationId ||
      item?.MessageConversationId ||
      item?.id ||
      item?.Id ||
      ''
  ).trim();
}

/**
 * Lấy ID của tin nhắn
 */
function getMessageId(item: RawRecord): string {
  return String(
    item?.messageId ||
      item?.MessageId ||
      item?.id ||
      item?.Id ||
      ''
  ).trim();
}

/**
 * Lấy nội dung văn bản của tin nhắn
 */
function getMessageContent(item: RawRecord): string {
  return String(
    item?.messageContent ??
      item?.MessageContent ??
      item?.content ??
      item?.Content ??
      ''
  );
}

/**
 * Lấy ID của người gửi tin nhắn
 */
function getSenderId(item: RawRecord): string {
  return String(
    item?.senderUserId ??
      item?.SenderUserId ??
      item?.senderId ??
      item?.SenderId ??
      ''
  )
    .toLowerCase()
    .trim();
}

/**
 * Lấy danh sách ID người tham gia cuộc trò chuyện
 */
function getParticipantIds(item: RawRecord): string[] {
  return [
    String(item?.userAId || item?.UserAId || '').toLowerCase().trim(),
    String(item?.userBId || item?.UserBId || '').toLowerCase().trim(),
  ];
}

/**
 * Tạo chữ cái viết tắt đại diện cho tên
 */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0]?.slice(0, 2).toUpperCase() || 'PH';
}

/**
 * Loại bỏ các tin nhắn trùng lặp theo ID hoặc nội dung + thời gian
 */
function deduplicateMessages(messageList: RawRecord[]): RawRecord[] {
  const seenKeys = new Set<string>();
  const uniqueList: RawRecord[] = [];

  for (const message of messageList) {
    const id = getMessageId(message);
    const content = getMessageContent(message);
    const sender = getSenderId(message);
    const timeKey = String(
      message.messageSentAt || message.MessageSentAt || message.createdAt || ''
    ).slice(0, 16);

    const uniqueKey = id ? id : `${sender}:${content}:${timeKey}`;
    if (seenKeys.has(uniqueKey)) {
      continue;
    }
    seenKeys.add(uniqueKey);
    uniqueList.push(message);
  }

  return uniqueList;
}

export default function TeacherMessagesPage() {
  const [parentContacts, setParentContacts] = useState<ParentContact[]>([]);
  const [conversations, setConversations] = useState<RawRecord[]>([]);
  const [selectedParent, setSelectedParent] = useState<ParentContact | null>(null);
  const [activeConversation, setActiveConversation] = useState<RawRecord | null>(null);
  const [messages, setMessages] = useState<RawRecord[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [draftMessage, setDraftMessage] = useState<string>('');
  const [loadingContacts, setLoadingContacts] = useState<boolean>(true);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const currentTeacherId = String(currentUser()?.id || '').toLowerCase().trim();
  const conversationRef = useRef<RawRecord | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    conversationRef.current = activeConversation;
  }, [activeConversation]);

  // Tự động cuộn xuống tin nhắn mới nhất
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Tải danh sách phụ huynh của các học sinh trong lớp được phân công
   */
  const loadParentContacts = useCallback(async () => {
    setLoadingContacts(true);
    setErrorMessage('');

    try {
      await loadLiveTeacherChildren();
      const validChildren = CHILDREN.filter((child) => child.apiId).map((child) => ({
        id: String(child.apiId),
        name: child.name,
      }));
      const childNameMap = new Map(validChildren.map((child) => [child.id.toLowerCase(), child.name]));

      // Tải liên kết học sinh - phụ huynh và thông tin phụ huynh
      const [linksResponse, parentsResponse] = await Promise.allSettled([
        api.get<any[]>('students', '/api/students/all-links'),
        api.get<any[]>('parents', '/api/parents'),
      ]);

      const allLinks =
        linksResponse.status === 'fulfilled' && Array.isArray(linksResponse.value)
          ? linksResponse.value
          : [];
      const allParents =
        parentsResponse.status === 'fulfilled' && Array.isArray(parentsResponse.value)
          ? parentsResponse.value
          : [];

      const parentById = new Map(
        allParents.map((parent: any) => [String(parent.id || parent.Id).toLowerCase(), parent])
      );

      const contactMap = new Map<string, ParentContact>();

      for (const link of allLinks) {
        const studentId = String(link.studentId || '').toLowerCase();
        if (childNameMap.has(studentId)) {
          const childName = childNameMap.get(studentId)!;
          const parentInfo = parentById.get(String(link.parentId || '').toLowerCase());
          const accountId = String(
            parentInfo?.taiKhoanId || parentInfo?.TaiKhoanId || ''
          )
            .toLowerCase()
            .trim();

          if (!accountId) continue;

          const existingContact = contactMap.get(accountId) || {
            accountId,
            name: String(parentInfo?.hoTen || parentInfo?.HoTen || 'Phụ huynh'),
            phoneNumber: String(parentInfo?.soDienThoai || parentInfo?.SoDienThoai || ''),
            children: [],
          };

          if (!existingContact.children.includes(childName)) {
            existingContact.children.push(childName);
          }
          contactMap.set(accountId, existingContact);
        }
      }

      setParentContacts(Array.from(contactMap.values()));

      // Tải danh sách các cuộc hội thoại hiện có của giáo viên
      const myConversations = await api.get<any>('communication', '/api/Conversations/mine');
      setConversations(extractArray(myConversations));
    } catch (cause) {
      setErrorMessage(
        cause instanceof Error ? cause.message : 'Không thể tải danh sách phụ huynh của lớp'
      );
    } finally {
      setLoadingContacts(false);
    }
  }, []);

  /**
   * Kết nối SignalR Real-time Chat Hub
   */
  useEffect(() => {
    void loadParentContacts();

    const chatHub = createHubConnection('chat');
    let isDisposed = false;

    const handleReceiveMessage = (firstArg: RawRecord, secondArg?: RawRecord) => {
      if (firstArg?.type === 'MUTATION') {
        const activeId = getConversationId(conversationRef.current);
        if (activeId) {
          void api
            .get<any>('communication', `/api/Messages/conversation/${activeId}`)
            .then((data) => {
              if (!isDisposed) {
                setMessages(deduplicateMessages(extractArray(data)));
              }
            })
            .catch(() => {});
        }
        return;
      }
      const incomingMessage = secondArg || firstArg;
      const conversationIdFromEvent = secondArg
        ? String(firstArg || '')
        : getConversationId(incomingMessage);

      if (
        !incomingMessage ||
        conversationIdFromEvent !== getConversationId(conversationRef.current)
      ) {
        return;
      }

      setMessages((prevMessages) => deduplicateMessages([...prevMessages, incomingMessage]));
    };

    chatHub.on('ReceiveMessage', handleReceiveMessage);
    chatHub.on('MessageReceived', handleReceiveMessage);

    void chatHub
      .start()
      .then(() => {
        if (!isDisposed) setIsConnected(true);
      })
      .catch(() => {
        if (!isDisposed) setIsConnected(false);
      });

    return () => {
      isDisposed = true;
      setIsConnected(false);
      chatHub.off('ReceiveMessage', handleReceiveMessage);
      chatHub.off('MessageReceived', handleReceiveMessage);
      if (chatHub.state === 'Connected') {
        void chatHub.stop();
      }
    };
  }, [loadParentContacts]);

  /**
   * Mở hoặc tạo mới cuộc hội thoại với một phụ huynh
   */
  const handleSelectParent = async (parent: ParentContact) => {
    setErrorMessage('');
    setSelectedParent(parent);
    setLoadingMessages(true);

    try {
      let targetConversation = conversations.find((item) =>
        getParticipantIds(item).includes(parent.accountId)
      );

      if (!targetConversation) {
        targetConversation = await api.post<RawRecord>('communication', '/api/Conversations', {
          userBId: parent.accountId,
        });
        if (targetConversation) {
          setConversations((prev) => [...prev, targetConversation!]);
        }
      }

      setActiveConversation(targetConversation);
      conversationRef.current = targetConversation;

      const conversationId = getConversationId(targetConversation);
      const fetchedMessages = await api.get<any>(
        'communication',
        `/api/Messages/conversation/${conversationId}`
      );
      setMessages(deduplicateMessages(extractArray(fetchedMessages)));
    } catch (cause) {
      setErrorMessage(
        cause instanceof Error ? cause.message : 'Không thể mở cuộc trò chuyện với phụ huynh này'
      );
    } finally {
      setLoadingMessages(false);
    }
  };

  /**
   * Gửi tin nhắn mới đến phụ huynh
   */
  const handleSendMessage = async () => {
    const content = draftMessage.trim();
    const conversationId = getConversationId(activeConversation);

    if (!content || !conversationId || sending) return;

    setSending(true);
    try {
      const createdMessage = await api.post<RawRecord>('communication', '/api/Messages', {
        messageConversationId: conversationId,
        messageContent: content,
        messageType: 0,
      });

      if (createdMessage) {
        setMessages((prev) => deduplicateMessages([...prev, createdMessage]));
      }
      setDraftMessage('');
    } catch (cause) {
      setErrorMessage(
        cause instanceof Error ? cause.message : 'Không thể gửi tin nhắn. Vui lòng thử lại.'
      );
    } finally {
      setSending(false);
    }
  };

  // Lọc danh sách phụ huynh theo từ khóa tìm kiếm
  const filteredParents = parentContacts.filter((parent) => {
    if (!searchKeyword.trim()) return true;
    const term = searchKeyword.toLowerCase();
    const matchName = parent.name.toLowerCase().includes(term);
    const matchChild = parent.children.some((child) => child.toLowerCase().includes(term));
    return matchName || matchChild;
  });

  return (
    <div className="flex h-[calc(100vh-130px)] min-h-[500px] flex-col rounded-2xl md:rounded-3xl border border-orange-100 bg-white shadow-sm overflow-hidden">
      {/* Header chính của mô-đun */}
      <header className="flex shrink-0 items-center justify-between border-b border-orange-100/80 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-sm">
            <MessageSquare size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black tracking-widest text-orange-600 uppercase bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/60">
                Kênh liên lạc gia đình - nhà trường
              </span>
            </div>
            <h1 className="text-xl font-black text-slate-800 mt-0.5">Tin nhắn phụ huynh</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Huy hiệu trạng thái kết nối SignalR */}
          <div
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
              isConnected
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-slate-100 text-slate-500 border border-slate-200'
            }`}
          >
            {isConnected ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Kết nối trực tiếp</span>
              </>
            ) : (
              <>
                <WifiOff size={13} />
                <span>Ngoại tuyến</span>
              </>
            )}
          </div>

          <button
            onClick={() => void loadParentContacts()}
            disabled={loadingContacts}
            title="Tải lại danh sách"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-200 bg-white text-orange-600 hover:bg-orange-50 transition cursor-pointer"
          >
            <RefreshCw size={16} className={loadingContacts ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

      {/* Thông báo lỗi nếu có */}
      {errorMessage && (
        <div className="flex shrink-0 items-center justify-between bg-rose-50 px-6 py-2.5 text-xs font-bold text-rose-700 border-b border-rose-200">
          <span>{errorMessage}</span>
          <button
            onClick={() => setErrorMessage('')}
            className="text-rose-500 hover:text-rose-800 cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Thân giao diện 2 cột: Danh sách phụ huynh (Trái) & Khung chat (Phải) */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Cột trái: Danh bạ phụ huynh */}
        <aside
          className={`min-h-0 flex-col border-r border-orange-100 bg-slate-50/50 md:w-80 lg:w-96 shrink-0 ${
            selectedParent ? 'hidden md:flex' : 'flex w-full'
          }`}
        >
          {/* Ô tìm kiếm */}
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

          {/* Danh sách cuộn */}
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
                    onClick={() => void handleSelectParent(parent)}
                    className={`w-full text-left rounded-2xl p-3 border transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20'
                        : 'bg-white border-slate-200/80 hover:border-orange-300 hover:bg-orange-50/30'
                    }`}
                  >
                    {/* Avatar phụ huynh */}
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xs font-black transition-all ${
                        isSelected
                          ? 'bg-white text-orange-600'
                          : 'bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-xs'
                      }`}
                    >
                      {getInitials(parent.name)}
                    </div>

                    {/* Chi tiết phụ huynh */}
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

        {/* Cột phải: Khu vực trò chuyện */}
        <main
          className={`min-h-0 min-w-0 flex-col bg-white flex-1 ${
            selectedParent ? 'flex w-full' : 'hidden md:flex'
          }`}
        >
          {selectedParent && activeConversation ? (
            <>
              {/* Header cuộc trò chuyện */}
              <div className="flex shrink-0 items-center justify-between border-b border-orange-100 bg-white px-4 sm:px-6 py-3">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <button
                    onClick={() => {
                      setSelectedParent(null);
                      setActiveConversation(null);
                    }}
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

              {/* Luồng tin nhắn */}
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

              {/* Hộp soạn thảo tin nhắn */}
              <div className="shrink-0 border-t border-orange-100 bg-white p-4">
                <div className="flex items-end gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-2 focus-within:border-orange-400 focus-within:bg-white transition">
                  <textarea
                    rows={2}
                    value={draftMessage}
                    onChange={(e) => setDraftMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        void handleSendMessage();
                      }
                    }}
                    placeholder={`Nhắn tin trao đổi với phụ huynh bé ${selectedParent.children.join(', ')}... (Nhấn Enter để gửi)`}
                    className="w-full resize-none bg-transparent px-2 py-1 text-sm text-slate-800 placeholder:text-slate-400 outline-none"
                  />

                  <button
                    disabled={!draftMessage.trim() || sending}
                    onClick={() => void handleSendMessage()}
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
            </>
          ) : (
            /* Trạng thái chưa chọn cuộc trò chuyện nào */
            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-slate-400">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-50 text-orange-400 mb-4 border border-orange-100">
                <MessageSquare size={40} />
              </div>
              <h3 className="text-lg font-black text-slate-700">Chọn phụ huynh để bắt đầu trò chuyện</h3>
              <p className="mt-1.5 max-w-sm text-xs text-slate-500 leading-relaxed">
                Chọn một phụ huynh trong danh sách lớp học ở cột bên trái để xem lịch sử trao đổi hoặc gửi thông báo trực tiếp.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
