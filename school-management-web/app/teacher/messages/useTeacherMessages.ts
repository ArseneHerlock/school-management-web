import { useCallback, useEffect, useRef, useState } from 'react';
import { api, currentUser, createHubConnection } from '@/services';
import { CHILDREN, loadLiveTeacherChildren } from '../data';
import { ParentContact, RawRecord } from './types';
import {
  extractArray,
  getConversationId,
  getParticipantIds,
  deduplicateMessages,
} from './helpers';

export function useTeacherMessages() {
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const filteredParents = parentContacts.filter((parent) => {
    if (!searchKeyword.trim()) return true;
    const term = searchKeyword.toLowerCase();
    const matchName = parent.name.toLowerCase().includes(term);
    const matchChild = parent.children.some((child) => child.toLowerCase().includes(term));
    return matchName || matchChild;
  });

  return {
    parentContacts,
    conversations,
    selectedParent,
    setSelectedParent,
    activeConversation,
    setActiveConversation,
    messages,
    searchKeyword,
    setSearchKeyword,
    draftMessage,
    setDraftMessage,
    loadingContacts,
    loadingMessages,
    sending,
    isConnected,
    errorMessage,
    setErrorMessage,
    currentTeacherId,
    messagesEndRef,
    loadParentContacts,
    handleSelectParent,
    handleSendMessage,
    filteredParents,
  };
}
