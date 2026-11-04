export type RawRecord = Record<string, any>;

export interface ContactPerson {
  accountId: string;
  name: string;
  role: "PHU_HUYNH" | "GIAO_VIEN";
  classIds: string[];
  gradeIds: string[];
  classNames: string[];
  conversation?: RawRecord;
}

export function extractArrayData(responseValue: unknown): RawRecord[] {
  if (Array.isArray(responseValue)) {
    return responseValue as RawRecord[];
  }
  if (responseValue && typeof responseValue === "object") {
    const objectMap = responseValue as { items?: unknown };
    if (Array.isArray(objectMap.items)) {
      return objectMap.items as RawRecord[];
    }
  }
  return [];
}

export function getConversationId(
  conversationObj: RawRecord | null | undefined
): string {
  if (!conversationObj) return "";
  return String(
    conversationObj.messageConversationId ||
      conversationObj.MessageConversationId ||
      conversationObj.id ||
      conversationObj.Id ||
      ""
  );
}

export function getMessageText(messageObj: RawRecord): string {
  return String(
    messageObj.messageContent ??
      messageObj.MessageContent ??
      messageObj.content ??
      messageObj.Content ??
      ""
  );
}

export function getSenderUserId(messageObj: RawRecord): string {
  return String(messageObj.senderUserId ?? messageObj.SenderUserId ?? "");
}

export function getInitials(fullName: string): string {
  const words = fullName.trim().split(/\s+/);
  if (words.length === 0) return "ND";
  const initialsChars = words
    .slice(-2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
  return initialsChars || "ND";
}
