import { RawRecord } from './types';

export function extractArray(value: any): RawRecord[] {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  return [];
}

export function getConversationId(item?: RawRecord | null): string {
  return String(
    item?.messageConversationId ||
      item?.MessageConversationId ||
      item?.id ||
      item?.Id ||
      ''
  ).trim();
}

export function getMessageId(item: RawRecord): string {
  return String(
    item?.messageId ||
      item?.MessageId ||
      item?.id ||
      item?.Id ||
      ''
  ).trim();
}

export function getMessageContent(item: RawRecord): string {
  return String(
    item?.messageContent ??
      item?.MessageContent ??
      item?.content ??
      item?.Content ??
      ''
  );
}

export function getSenderId(item: RawRecord): string {
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

export function getParticipantIds(item: RawRecord): string[] {
  return [
    String(item?.userAId || item?.UserAId || '').toLowerCase().trim(),
    String(item?.userBId || item?.UserBId || '').toLowerCase().trim(),
  ];
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0]?.slice(0, 2).toUpperCase() || 'PH';
}

export function deduplicateMessages(messageList: RawRecord[]): RawRecord[] {
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
