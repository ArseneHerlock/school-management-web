export type Raw = Record<string, any>

export type Teacher = {
  accountId: string
  name: string
  classes: string[]
  children: string[]
}

export const cid = (x?: Raw | null) =>
  String(x?.messageConversationId || x?.MessageConversationId || x?.id || x?.Id || '').trim()

export const textOf = (x: Raw) =>
  String(x.messageContent ?? x.MessageContent ?? x.content ?? x.Content ?? '')

export const messageId = (x: Raw) =>
  String(x.messageId ?? x.MessageId ?? x.id ?? x.Id ?? '').trim()

export const senderId = (x: Raw) =>
  String(x.senderUserId ?? x.SenderUserId ?? x.senderId ?? x.SenderId ?? '')
    .toLowerCase()
    .trim()

export const users = (x: Raw) => [
  String(x.userAId ?? x.UserAId ?? '')
    .toLowerCase()
    .trim(),
  String(x.userBId ?? x.UserBId ?? '')
    .toLowerCase()
    .trim(),
]

export const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((x) => x[0])
    .join('')
    .toUpperCase() || 'GV'

export function dedupeMessages(list: Raw[]): Raw[] {
  const seen = new Set<string>()
  const result: Raw[] = []
  for (const m of list) {
    const id = messageId(m)
    const text = textOf(m)
    const sId = senderId(m)
    const timeKey = String(m.messageSentAt || m.MessageSentAt || m.createdAt || '').slice(0, 16)
    const key = id ? id : `${sId}:${text}:${timeKey}`
    if (seen.has(key)) continue
    seen.add(key)
    result.push(m)
  }
  return result
}
