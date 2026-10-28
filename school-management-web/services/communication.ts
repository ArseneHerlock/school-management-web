import { api, normalizeList } from "./client";

export interface ConversationItem {
  id: string;
  userAId?: string;
  userBId?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface ChatMessageItem {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  sentAt?: string;
  createdAt?: string;
  [key: string]: any;
}

/**
 * Lấy danh sách hội thoại của người dùng hiện tại
 */
export async function getMyConversations(): Promise<ConversationItem[]> {
  const res = await api.get<any>("communication", "/api/Conversations/mine").catch(() => []);
  return normalizeList<ConversationItem>(res);
}

/**
 * Tạo hoặc mở hội thoại 1-1 với người dùng khác
 */
export async function getOrCreateConversation(userBId: string): Promise<ConversationItem> {
  return await api.post<ConversationItem>("communication", "/api/Conversations", { userBId });
}

/**
 * Lấy danh sách tin nhắn trong một hội thoại
 */
export async function getConversationMessages(conversationId: string): Promise<ChatMessageItem[]> {
  const res = await api
    .get<any>("communication", `/api/Messages/conversation/${encodeURIComponent(conversationId)}`)
    .catch(() => []);
  return normalizeList<ChatMessageItem>(res);
}

/**
 * Gửi tin nhắn mới vào hội thoại
 */
export async function sendConversationMessage(data: {
  conversationId?: string;
  content?: string;
  messageConversationId?: string;
  messageContent?: string;
  messageType?: number;
  [key: string]: any;
}): Promise<ChatMessageItem> {
  const payload = {
    messageConversationId: data.messageConversationId || data.conversationId,
    messageContent: data.messageContent || data.content,
    messageType: data.messageType ?? 0,
    ...data,
  };
  return await api.post<ChatMessageItem>("communication", "/api/Messages", payload);
}
