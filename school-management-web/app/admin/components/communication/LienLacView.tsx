'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  ChevronRight,
  Filter,
  Loader2,
  MessageCircle,
  RefreshCw,
  Search,
  Send,
  Users,
  Wifi,
  WifiOff,
  X,
} from 'lucide-react'
import { currentUser } from '@/services/client'
import { createHubConnection } from '@/services/hubs'
import { getParents } from '@/services/parents'
import { getStaff } from '@/services/staff'
import { getClasses } from '@/services/classes'
import { getGrades } from '@/services/grades'
import { getStudentParentLinks } from '@/services/students'
import {
  getMyConversations,
  getOrCreateConversation,
  getConversationMessages,
  sendConversationMessage,
} from '@/services/communication'

type RawRecord = Record<string, any>

interface ContactPerson {
  accountId: string
  name: string
  role: 'PHU_HUYNH' | 'GIAO_VIEN'
  classIds: string[]
  gradeIds: string[]
  classNames: string[]
  conversation?: RawRecord
}

/**
 * Chuẩn hóa dữ liệu mảng an toàn
 */
function extractArrayData(responseValue: unknown): RawRecord[] {
  if (Array.isArray(responseValue)) {
    return responseValue as RawRecord[]
  }
  if (responseValue && typeof responseValue === 'object') {
    const objectMap = responseValue as { items?: unknown }
    if (Array.isArray(objectMap.items)) {
      return objectMap.items as RawRecord[]
    }
  }
  return []
}

/**
 * Lấy ID cuộc trò chuyện từ đối tượng conversation
 */
function getConversationId(conversationObj: RawRecord | null | undefined): string {
  if (!conversationObj) {
    return ''
  }
  return String(
    conversationObj.messageConversationId ||
      conversationObj.MessageConversationId ||
      conversationObj.id ||
      conversationObj.Id ||
      ''
  )
}

/**
 * Lấy nội dung văn bản của tin nhắn
 */
function getMessageText(messageObj: RawRecord): string {
  return String(
    messageObj.messageContent ??
      messageObj.MessageContent ??
      messageObj.content ??
      messageObj.Content ??
      ''
  )
}

/**
 * Lấy ID người gửi tin nhắn
 */
function getSenderUserId(messageObj: RawRecord): string {
  return String(messageObj.senderUserId ?? messageObj.SenderUserId ?? '')
}

/**
 * Lấy 2 chữ cái viết tắt của tên người liên hệ để làm avatar
 */
function getInitials(fullName: string): string {
  const words = fullName.trim().split(/\s+/)
  if (words.length === 0) {
    return 'ND'
  }
  const initialsChars = words
    .slice(-2)
    .map(function (word) {
      return word[0]
    })
    .join('')
    .toUpperCase()

  return initialsChars || 'ND'
}

export default function LienLacView() {
  // Danh sách danh bạ và cuộc trò chuyện được chọn
  const [contactsList, setContactsList] = useState<ContactPerson[]>([])
  const [selectedContact, setSelectedContact] = useState<ContactPerson | null>(null)
  const [messagesList, setMessagesList] = useState<RawRecord[]>([])

  // Danh mục lớp và khối
  const [classesList, setClassesList] = useState<RawRecord[]>([])
  const [gradesList, setGradesList] = useState<RawRecord[]>([])

  // Các trường tìm kiếm và bộ lọc
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL')
  const [selectedClassId, setSelectedClassId] = useState<string>('ALL')
  const [selectedGradeId, setSelectedGradeId] = useState<string>('ALL')

  // Trạng thái nhập tin nhắn và tải
  const [inputMessageText, setInputMessageText] = useState<string>('')
  const [isLoadingContacts, setIsLoadingContacts] = useState<boolean>(true)
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false)
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isConnectedToHub, setIsConnectedToHub] = useState<boolean>(false)

  const selectedContactRef = useRef<ContactPerson | null>(null)
  const currentUserId = String(currentUser()?.id || '')

  useEffect(() => {
    selectedContactRef.current = selectedContact
  }, [selectedContact])

  /**
   * Tải toàn bộ danh bạ phụ huynh, giáo viên, lớp, khối và danh sách cuộc hội thoại
   */
  async function loadContactsDirectory(): Promise<void> {
    setIsLoadingContacts(true)
    try {
      const [
        parentsResponse,
        staffResponse,
        classesResponse,
        gradesResponse,
        conversationsResponse,
        allLinksResponse,
      ] = await Promise.all([
        getParents(),
        getStaff(),
        getClasses(),
        getGrades(),
        getMyConversations(),
        getStudentParentLinks(),
      ])

      const parentsData = extractArrayData(parentsResponse)
      const staffData = extractArrayData(staffResponse)
      const classesData = extractArrayData(classesResponse)
      const gradesData = extractArrayData(gradesResponse)
      const conversationsData = extractArrayData(conversationsResponse)
      const linksData = extractArrayData(allLinksResponse)

      setClassesList(classesData)
      setGradesList(gradesData)

      // Bản đồ liên kết học sinh - phụ huynh
      const parentChildrenMap: Record<string, any[]> = {}
      linksData.forEach(function (linkItem) {
        const parentId = String(linkItem.parentId)
        if (!parentChildrenMap[parentId]) {
          parentChildrenMap[parentId] = []
        }
        parentChildrenMap[parentId].push(linkItem)
      })

      // Chuyển đổi dữ liệu phụ huynh thành danh bạ liên lạc
      const parentContacts = parentsData.map(function (parentItem) {
        const accountId = String(parentItem.taiKhoanId || parentItem.TaiKhoanId || '')
        const parentId = String(parentItem.id || parentItem.Id || '')
        const children = parentChildrenMap[parentId] || []
        const linkedClassIds = children
          .map(function (child) {
            return String(child.lopId || child.LopId || '')
          })
          .filter(Boolean)

        const ownClasses = classesData.filter(function (classItem) {
          return linkedClassIds.includes(String(classItem.id || classItem.Id))
        })

        const matchedConversation = conversationsData.find(function (conversationItem) {
          const userA = String(conversationItem.userAId || conversationItem.UserAId)
          const userB = String(conversationItem.userBId || conversationItem.UserBId)
          return userA === accountId || userB === accountId
        })

        return {
          accountId: accountId,
          name: String(parentItem.hoTen || parentItem.HoTen || 'Phụ huynh'),
          role: 'PHU_HUYNH' as const,
          classIds: linkedClassIds,
          gradeIds: ownClasses.map(function (item) {
            return String(item.khoiId || item.KhoiId || '')
          }),
          classNames: ownClasses.map(function (item) {
            return String(item.tenLop || item.TenLop || '')
          }),
          conversation: matchedConversation,
        }
      })

      // Chuyển đổi dữ liệu nhân sự/giáo viên thành danh bạ liên lạc
      const teacherContacts = staffData.map(function (staffItem) {
        const staffId = String(staffItem.staffId || staffItem.StaffId || '')
        const accountId = String(staffItem.userId || staffItem.UserId || '')

        const assignedClasses = classesData.filter(function (classItem) {
          return (
            String(classItem.giaoVienChuNhiemId || classItem.GiaoVienChuNhiemId) === staffId
          )
        })

        const matchedConversation = conversationsData.find(function (conversationItem) {
          const userA = String(conversationItem.userAId || conversationItem.UserAId)
          const userB = String(conversationItem.userBId || conversationItem.UserBId)
          return userA === accountId || userB === accountId
        })

        return {
          accountId: accountId,
          name: String(staffItem.fullName || staffItem.FullName || 'Giáo viên'),
          role: 'GIAO_VIEN' as const,
          classIds: assignedClasses.map(function (item) {
            return String(item.id || item.Id)
          }),
          gradeIds: assignedClasses.map(function (item) {
            return String(item.khoiId || item.KhoiId || '')
          }),
          classNames: assignedClasses.map(function (item) {
            return String(item.tenLop || item.TenLop || '')
          }),
          conversation: matchedConversation,
        }
      })

      // Loại bỏ chính mình và những người chưa có tài khoản đăng nhập
      const combinedContacts = [...parentContacts, ...teacherContacts].filter(function (contact) {
        return contact.accountId && contact.accountId !== currentUserId
      })

      setContactsList(combinedContacts)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không tải được danh bạ liên lạc'
      setErrorMessage(message)
    } finally {
      setIsLoadingContacts(false)
    }
  }

  // Kết nối SignalR Hub cho tin nhắn thời gian thực
  useEffect(() => {
    loadContactsDirectory()

    const signalRHub = createHubConnection('chat')

    function handleReceiveRealtimeMessage(payload: RawRecord, maybeMessage?: RawRecord) {
      const incomingMessage = maybeMessage || payload
      const currentConversationId = getConversationId(
        selectedContactRef.current?.conversation
      )
      if (getConversationId(incomingMessage) === currentConversationId) {
        setMessagesList(function (previousMessages) {
          return [...previousMessages, incomingMessage]
        })
      }
    }

    signalRHub.on('ReceiveMessage', handleReceiveRealtimeMessage)
    signalRHub.on('MessageReceived', handleReceiveRealtimeMessage)

    let isDisposed = false
    signalRHub
      .start()
      .then(function () {
        if (!isDisposed) {
          setIsConnectedToHub(true)
        }
      })
      .catch(function () {
        setIsConnectedToHub(false)
      })

    return function cleanup() {
      isDisposed = true
      signalRHub.off('ReceiveMessage', handleReceiveRealtimeMessage)
      signalRHub.off('MessageReceived', handleReceiveRealtimeMessage)
      setIsConnectedToHub(false)
      if (signalRHub.state === 'Connected') {
        signalRHub.stop()
      }
    }
  }, [])

  /**
   * Lọc danh sách liên lạc theo từ khóa, vai trò, lớp và khối
   */
  const filteredContacts = useMemo(() => {
    const keyword = searchKeyword.toLowerCase().trim()

    return contactsList.filter(function (contactItem) {
      const isKeywordMatch =
        !keyword ||
        `${contactItem.name} ${contactItem.classNames.join(' ')}`
          .toLowerCase()
          .includes(keyword)

      const isRoleMatch =
        selectedRoleFilter === 'ALL' || contactItem.role === selectedRoleFilter

      const isClassMatch =
        selectedClassId === 'ALL' || contactItem.classIds.includes(selectedClassId)

      const isGradeMatch =
        selectedGradeId === 'ALL' || contactItem.gradeIds.includes(selectedGradeId)

      return isKeywordMatch && isRoleMatch && isClassMatch && isGradeMatch
    })
  }, [contactsList, searchKeyword, selectedRoleFilter, selectedClassId, selectedGradeId])

  /**
   * Mở cuộc hội thoại với một người liên hệ
   */
  async function handleOpenConversation(contactItem: ContactPerson): Promise<void> {
    try {
      let activeConversation = contactItem.conversation

      // Nếu chưa có hội thoại, tự động tạo mới qua Backend CommunicationService
      if (!activeConversation) {
        activeConversation = await getOrCreateConversation(contactItem.accountId)

        setContactsList(function (previousList) {
          return previousList.map(function (item) {
            if (item.accountId === contactItem.accountId) {
              return { ...item, conversation: activeConversation }
            }
            return item
          })
        })
      }

      const updatedContact: ContactPerson = {
        ...contactItem,
        conversation: activeConversation,
      }

      setSelectedContact(updatedContact)
      selectedContactRef.current = updatedContact

      // Tải lịch sử tin nhắn của cuộc hội thoại
      setIsLoadingMessages(true)
      const conversationId = getConversationId(activeConversation)
      const rawMessages = await getConversationMessages(conversationId)
      setMessagesList(extractArrayData(rawMessages))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không mở được hội thoại'
      setErrorMessage(message)
    } finally {
      setIsLoadingMessages(false)
    }
  }

  /**
   * Gửi tin nhắn mới trong cuộc trò chuyện
   */
  async function handleSendMessage(): Promise<void> {
    const content = inputMessageText.trim()
    const conversationId = getConversationId(selectedContact?.conversation)

    if (!content || !conversationId || isSendingMessage) {
      return
    }

    setIsSendingMessage(true)
    try {
      await sendConversationMessage({
        messageConversationId: conversationId,
        messageContent: content,
        messageType: 0,
      })

      setInputMessageText('')

      // Tải lại tin nhắn mới nhất
      const updatedMessages = await getConversationMessages(conversationId)
      setMessagesList(extractArrayData(updatedMessages))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không gửi được tin nhắn'
      setErrorMessage(message)
    } finally {
      setIsSendingMessage(false)
    }
  }

  return (
    <section className="flex h-[calc(100vh-120px)] flex-col gap-4 overflow-hidden lg:h-[calc(100vh-136px)]">
      {/* Tiêu đề */}
      <header className="flex shrink-0 items-center justify-between">
        <div>
          <p className="admin-eyebrow">LIÊN LẠC</p>
          <h1 className="admin-title">Danh bạ liên lạc</h1>
          <p className="admin-subtitle">Lọc danh bạ trước khi mở khung chat.</p>
        </div>
        <button
          onClick={loadContactsDirectory}
          className="admin-btn admin-btn-secondary"
        >
          <RefreshCw size={16} /> Làm mới
        </button>
      </header>

      {/* Thông báo lỗi */}
      {errorMessage && (
        <div className="admin-alert shrink-0">
          {errorMessage}
          <button onClick={() => setErrorMessage('')}>
            <X size={16} />
          </button>
        </div>
      )}

      {!selectedContact ? (
        <>
          {/* Bộ lọc danh bạ */}
          <div className="admin-card shrink-0 space-y-3 p-4">
            <div className="flex items-center gap-2 text-sm font-black text-slate-700">
              <Filter size={17} className="text-emerald-600" /> Bộ lọc liên lạc
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  className="admin-input pl-10"
                  value={searchKeyword}
                  onChange={(event) => setSearchKeyword(event.target.value)}
                  placeholder="Tìm tên người liên lạc..."
                />
              </div>

              <select
                className="admin-input"
                value={selectedClassId}
                onChange={(event) => setSelectedClassId(event.target.value)}
              >
                <option value="ALL">Tất cả lớp</option>
                {classesList.map(function (classItem) {
                  const classId = classItem.id || classItem.Id
                  const className = classItem.tenLop || classItem.TenLop
                  return (
                    <option key={classId} value={classId}>
                      {className}
                    </option>
                  )
                })}
              </select>

              <select
                className="admin-input"
                value={selectedGradeId}
                onChange={(event) => setSelectedGradeId(event.target.value)}
              >
                <option value="ALL">Tất cả khối</option>
                {gradesList.map(function (gradeItem) {
                  const gradeId = gradeItem.id || gradeItem.Id
                  const gradeName = gradeItem.tenKhoi || gradeItem.TenKhoi
                  return (
                    <option key={gradeId} value={gradeId}>
                      {gradeName}
                    </option>
                  )
                })}
              </select>

              <select
                className="admin-input"
                value={selectedRoleFilter}
                onChange={(event) => setSelectedRoleFilter(event.target.value)}
              >
                <option value="ALL">Tất cả vai trò</option>
                <option value="PHU_HUYNH">Phụ huynh</option>
                <option value="GIAO_VIEN">Giáo viên</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Users size={15} />
              Hiển thị {filteredContacts.length} người
            </div>
          </div>

          {/* Lưới danh bạ liên lạc */}
          <div className="min-h-0 flex-1 overflow-hidden">
            {isLoadingContacts ? (
              <div className="flex justify-center py-16">
                <Loader2 className="animate-spin text-emerald-500" />
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredContacts.map(function (person) {
                  return (
                    <button
                      key={`${person.role}-${person.accountId}`}
                      onClick={() => handleOpenConversation(person)}
                      className="group admin-card p-5 text-left transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 font-black text-emerald-700">
                          {getInitials(person.name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h2 className="truncate font-black text-slate-800">
                            {person.name}
                          </h2>
                          <p className="mt-1 text-xs font-bold text-emerald-600">
                            {person.role === 'PHU_HUYNH' ? 'Phụ huynh' : 'Giáo viên'}
                          </p>
                        </div>
                        <ChevronRight
                          size={18}
                          className="text-slate-300 group-hover:text-emerald-600"
                        />
                      </div>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {person.classNames.length > 0 ? (
                          person.classNames.map(function (className) {
                            return (
                              <span key={className} className="admin-chip">
                                {className}
                              </span>
                            )
                          })
                        ) : (
                          <span className="text-xs text-slate-400">
                            Chưa có lớp liên kết
                          </span>
                        )}
                      </div>

                      <p className="mt-3 truncate text-xs text-slate-400">
                        {person.conversation ? 'Đã có hội thoại' : 'Chưa mở hội thoại'}
                      </p>
                    </button>
                  )
                })}

                {filteredContacts.length === 0 && (
                  <div className="admin-card p-12 text-center text-sm text-slate-400 col-span-full">
                    Không tìm thấy người phù hợp.
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        /* Giao diện khung Chat */
        <div className="admin-card flex min-h-0 flex-1 flex-col overflow-hidden">
          <header className="flex shrink-0 items-center gap-3 border-b border-emerald-100 bg-white p-4">
            <button
              onClick={() => setSelectedContact(null)}
              className="rounded-xl p-2 text-slate-500 hover:bg-slate-50"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 font-black text-emerald-700">
              {getInitials(selectedContact.name)}
            </div>
            <div>
              <h2 className="font-black text-slate-800">{selectedContact.name}</h2>
              <p className="text-xs text-emerald-600">
                {selectedContact.role === 'PHU_HUYNH' ? 'Phụ huynh' : 'Giáo viên'}
                {selectedContact.classNames.length > 0 &&
                  ` · ${selectedContact.classNames.join(', ')}`}
              </p>
            </div>
            <span className="ml-auto flex items-center gap-1 text-xs text-slate-400">
              {isConnectedToHub ? (
                <>
                  <Wifi size={14} className="text-emerald-500" />
                  Đang kết nối
                </>
              ) : (
                <>
                  <WifiOff size={14} />
                  Ngoại tuyến
                </>
              )}
            </span>
          </header>

          <div className="flex min-h-0 flex-1 flex-col bg-slate-50">
            {/* Lịch sử tin nhắn */}
            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              {isLoadingMessages ? (
                <Loader2 className="mx-auto my-16 animate-spin text-emerald-500" />
              ) : messagesList.length > 0 ? (
                <div className="space-y-2">
                  {messagesList.map(function (messageItem, index) {
                    const messageId =
                      messageItem.messageId ||
                      messageItem.MessageId ||
                      messageItem.id ||
                      index
                    const isMyMessage = getSenderUserId(messageItem) === currentUserId

                    return (
                      <div
                        key={messageId}
                        className={`max-w-[78%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                          isMyMessage
                            ? 'ml-auto bg-emerald-600 text-white'
                            : 'bg-white text-slate-700 shadow-sm'
                        }`}
                      >
                        {getMessageText(messageItem)}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="py-20 text-center text-sm text-slate-400">
                  <MessageCircle className="mx-auto mb-2 text-slate-300" />
                  Chưa có tin nhắn trong hội thoại này
                </div>
              )}
            </div>

            {/* Thanh soạn thảo và gửi tin nhắn */}
            <div className="flex shrink-0 gap-2 border-t border-slate-200 bg-white p-3">
              <textarea
                rows={1}
                className="min-w-0 flex-1 resize-none rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-400"
                value={inputMessageText}
                onChange={(event) => setInputMessageText(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    handleSendMessage()
                  }
                }}
                placeholder="Nhập tin nhắn..."
              />
              <button
                disabled={!inputMessageText.trim() || isSendingMessage}
                onClick={handleSendMessage}
                className="rounded-xl bg-emerald-600 px-4 text-white disabled:opacity-40"
              >
                <Send size={17} />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
