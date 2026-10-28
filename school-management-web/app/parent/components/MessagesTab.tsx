'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MessageCircle, Phone, Wifi, WifiOff, X } from 'lucide-react'
import { currentUser, createHubConnection } from '@/lib/api'
import {
  getMyConversations,
  getOrCreateConversation,
  getConversationMessages,
  sendConversationMessage,
} from '@/services/communication'
import { ChildInfo } from '../types'
import { Teacher, Raw, cid, dedupeMessages, users } from './messages/types'
import { TeacherListSidebar } from './messages/TeacherListSidebar'
import { ChatConversationView } from './messages/ChatConversationView'

export default function MessagesTab({
  childrenData,
  onOpenCall,
}: {
  child: ChildInfo
  childrenData: ChildInfo[]
  onOpenCall: () => void
}) {
  const [conversations, setConversations] = useState<Raw[]>([])
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [conversation, setConversation] = useState<Raw | null>(null)
  const [messages, setMessages] = useState<Raw[]>([])
  const [search, setSearch] = useState('')
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [connected, setConnected] = useState(false)

  const me = String(currentUser()?.id || '').toLowerCase().trim()
  const selectedRef = useRef<Raw | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const teachers = useMemo(() => {
    const map = new Map<string, Teacher>()
    childrenData.forEach((c) => {
      const name = c.giaoVienChuNhiem || 'Giáo viên chưa cập nhật'
      const accountId = String(c.giaoVienUserId || '').toLowerCase().trim()
      const key = accountId || name
      const item = map.get(key) || {
        accountId,
        name,
        classes: [],
        children: [],
      }
      if (c.lop && !item.classes.includes(c.lop)) item.classes.push(c.lop)
      if (c.hoTen && !item.children.includes(c.hoTen)) item.children.push(c.hoTen)
      map.set(key, item)
    })
    return [...map.values()]
  }, [childrenData])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return teachers.filter(
      (t) =>
        !q || `${t.name} ${t.classes.join(' ')} ${t.children.join(' ')}`.toLowerCase().includes(q)
    )
  }, [teachers, search])

  const loadConversations = useCallback(async () => {
    try {
      const data = await getMyConversations()
      setConversations(Array.isArray(data) ? data : [])
    } catch (e: any) {
      setError(e instanceof Error ? e.message : 'Không tải được hội thoại')
    }
  }, [])

  useEffect(() => {
    void loadConversations().finally(() => setLoading(false))
  }, [loadConversations])

  const openTeacher = async (t: Teacher) => {
    try {
      setError('')
      let c = conversations.find((x) => users(x).includes(t.accountId))
      if (!c) {
        if (!t.accountId) {
          setError('Giáo viên chưa có tài khoản liên lạc.')
          return
        }
        c = await getOrCreateConversation(t.accountId)
        setConversations((x) => [...x, c!])
      }
      setTeacher(t)
      setConversation(c)
      selectedRef.current = c
      setLoadingMessages(true)
      const data = await getConversationMessages(cid(c))
      setMessages(dedupeMessages(Array.isArray(data) ? data : []))
    } catch (e: any) {
      setError(e instanceof Error ? e.message : 'Không mở được hội thoại')
    } finally {
      setLoadingMessages(false)
    }
  }

  useEffect(() => {
    const hub = createHubConnection('chat')
    let disposed = false
    const receive = (payload: Raw, maybeIncoming?: Raw) => {
      if (payload?.type === 'MUTATION') {
        const activeId = cid(selectedRef.current)
        if (activeId) {
          void getConversationMessages(activeId)
            .then((data) => {
              if (!disposed && Array.isArray(data)) {
                setMessages(dedupeMessages(data))
              }
            })
            .catch(() => {})
        }
        return
      }
      const incoming = maybeIncoming || payload
      const conversationId = maybeIncoming ? String(payload || '') : cid(incoming)
      if (!incoming || conversationId !== cid(selectedRef.current)) return
      setMessages((prev) => dedupeMessages([...prev, incoming]))
    }
    hub.on('ReceiveMessage', receive)
    hub.on('MessageReceived', receive)
    void hub
      .start()
      .then(() => {
        if (!disposed) setConnected(true)
      })
      .catch(() => {
        if (!disposed) setConnected(false)
      })
    return () => {
      disposed = true
      setConnected(false)
      hub.off('ReceiveMessage', receive)
      hub.off('MessageReceived', receive)
      if (hub.state === 'Connected') void hub.stop()
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    const value = text.trim()
    const id = cid(conversation)
    if (!value || !id || sending) return
    setSending(true)
    try {
      const created = await sendConversationMessage({
        messageConversationId: id,
        messageContent: value,
        messageType: 0,
      })
      setMessages((x) => dedupeMessages([...x, created]))
      setText('')
    } catch (e: any) {
      setError(e instanceof Error ? e.message : 'Không gửi được tin nhắn')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="flex h-[calc(100vh-140px)] min-h-[500px] flex-col overflow-hidden rounded-2xl md:rounded-[28px] border border-slate-200 bg-white shadow-xs">
      <header className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shrink-0">
            <MessageCircle size={19} />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base md:text-lg font-extrabold text-slate-900 truncate">
              {teacher ? teacher.name : 'Liên lạc với giáo viên'}
            </h2>
            <p className="text-[11px] text-slate-500 truncate">
              {teacher ? `Lớp: ${teacher.classes.join(', ')}` : 'Giáo viên chủ nhiệm của tất cả các con'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] sm:text-[11px] font-bold sm:flex ${
              connected ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
            }`}
          >
            {connected ? <Wifi size={12} /> : <WifiOff size={12} />}
            {connected ? 'Trực tuyến' : 'Ngoại tuyến'}
          </span>
          <button
            onClick={onOpenCall}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-700 cursor-pointer"
          >
            <Phone size={14} />
            <span className="hidden sm:inline">Gọi GV</span>
          </button>
        </div>
      </header>

      {error && (
        <div className="flex shrink-0 items-center justify-between border-b border-rose-100 bg-rose-50 px-4 py-2 text-xs text-rose-700">
          <span>{error}</span>
          <button onClick={() => setError('')} className="cursor-pointer">
            <X size={15} />
          </button>
        </div>
      )}

      {/* Responsive layout: List on mobile; Chat on mobile when selected with Back button; Side-by-side on md+ */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Sidebar list */}
        <div
          className={`min-h-0 flex-col border-r border-slate-100 md:w-[320px] lg:w-[360px] shrink-0 bg-[#fbfcff] ${
            teacher ? 'hidden md:flex' : 'flex w-full'
          }`}
        >
          <TeacherListSidebar
            teachers={teachers}
            filtered={filtered}
            search={search}
            setSearch={setSearch}
            loading={loading}
            selectedTeacher={teacher}
            totalChildren={childrenData.length}
            onSelectTeacher={openTeacher}
          />
        </div>

        {/* Conversation area */}
        <main
          className={`min-h-0 min-w-0 flex-col bg-[#f8f9fc] flex-1 ${
            teacher ? 'flex w-full' : 'hidden md:flex'
          }`}
        >
          <ChatConversationView
            teacher={teacher}
            conversation={conversation}
            messages={messages}
            loadingMessages={loadingMessages}
            text={text}
            setText={setText}
            sending={sending}
            onSend={send}
            onBack={() => {
              setTeacher(null)
              setConversation(null)
            }}
            currentUserId={me}
            bottomRef={bottomRef}
          />
        </main>
      </div>
    </section>
  )
}
