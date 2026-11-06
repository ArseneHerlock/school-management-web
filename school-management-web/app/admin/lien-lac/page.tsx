"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { RefreshCw, X } from "lucide-react";
import { currentUser } from "@/services/client";
import { createHubConnection } from "@/services/hubs";
import { getParents } from "@/services/parents";
import { getStaff } from "@/services/staff";
import { getClasses } from "@/services/classes";
import { getGrades } from "@/services/grades";
import { getStudentParentLinks } from "@/services/students";
import {
  getMyConversations,
  getOrCreateConversation,
  getConversationMessages,
  sendConversationMessage,
} from "@/services/communication";
import {
  ContactPerson,
  RawRecord,
  extractArrayData,
  getConversationId,
} from "./types";
import { transformContactsDirectory } from "./lienLacUtils";
import { LienLacContactsDirectory } from "./components/LienLacContactsDirectory";
import { LienLacChatBox } from "./components/LienLacChatBox";

export default function LienLacPage() {
  const [contactsList, setContactsList] = useState<ContactPerson[]>([]);
  const [selectedContact, setSelectedContact] = useState<ContactPerson | null>(
    null
  );
  const [messagesList, setMessagesList] = useState<RawRecord[]>([]);

  const [classesList, setClassesList] = useState<RawRecord[]>([]);
  const [gradesList, setGradesList] = useState<RawRecord[]>([]);

  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("ALL");
  const [selectedClassId, setSelectedClassId] = useState<string>("ALL");
  const [selectedGradeId, setSelectedGradeId] = useState<string>("ALL");

  const [inputMessageText, setInputMessageText] = useState<string>("");
  const [isLoadingContacts, setIsLoadingContacts] = useState<boolean>(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isConnectedToHub, setIsConnectedToHub] = useState<boolean>(false);

  const selectedContactRef = useRef<ContactPerson | null>(null);
  const currentUserId = String(currentUser()?.id || "");

  useEffect(() => {
    selectedContactRef.current = selectedContact;
  }, [selectedContact]);

  async function loadContactsDirectory(): Promise<void> {
    setIsLoadingContacts(true);
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
      ]);

      const classesData = extractArrayData(classesResponse);
      const gradesData = extractArrayData(gradesResponse);

      setClassesList(classesData);
      setGradesList(gradesData);

      const directory = transformContactsDirectory(
        extractArrayData(parentsResponse),
        extractArrayData(staffResponse),
        classesData,
        extractArrayData(conversationsResponse),
        extractArrayData(allLinksResponse),
        currentUserId
      );

      setContactsList(directory);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Không tải được danh bạ liên lạc"
      );
    } finally {
      setIsLoadingContacts(false);
    }
  }

  useEffect(() => {
    void loadContactsDirectory();

    const signalRHub = createHubConnection("chat");

    function handleReceiveRealtimeMessage(payload: RawRecord, maybeMessage?: RawRecord) {
      const incomingMessage = maybeMessage || payload;
      const currentConversationId = getConversationId(
        selectedContactRef.current?.conversation
      );
      if (getConversationId(incomingMessage) === currentConversationId) {
        setMessagesList((prev) => [...prev, incomingMessage]);
      }
    }

    signalRHub.on("ReceiveMessage", handleReceiveRealtimeMessage);
    signalRHub.on("MessageReceived", handleReceiveRealtimeMessage);

    let isDisposed = false;
    signalRHub
      .start()
      .then(() => {
        if (!isDisposed) setIsConnectedToHub(true);
      })
      .catch(() => {
        setIsConnectedToHub(false);
      });

    return () => {
      isDisposed = true;
      signalRHub.off("ReceiveMessage", handleReceiveRealtimeMessage);
      signalRHub.off("MessageReceived", handleReceiveRealtimeMessage);
      setIsConnectedToHub(false);
      if (signalRHub.state === "Connected") {
        signalRHub.stop();
      }
    };
  }, []);

  const filteredContacts = useMemo(() => {
    const keyword = searchKeyword.toLowerCase().trim();

    return contactsList.filter((contactItem) => {
      const isKeywordMatch =
        !keyword ||
        `${contactItem.name} ${contactItem.classNames.join(" ")}`
          .toLowerCase()
          .includes(keyword);

      const isRoleMatch =
        selectedRoleFilter === "ALL" || contactItem.role === selectedRoleFilter;

      const isClassMatch =
        selectedClassId === "ALL" || contactItem.classIds.includes(selectedClassId);

      const isGradeMatch =
        selectedGradeId === "ALL" || contactItem.gradeIds.includes(selectedGradeId);

      return isKeywordMatch && isRoleMatch && isClassMatch && isGradeMatch;
    });
  }, [contactsList, searchKeyword, selectedRoleFilter, selectedClassId, selectedGradeId]);

  async function handleOpenConversation(contactItem: ContactPerson): Promise<void> {
    try {
      let activeConversation = contactItem.conversation;

      if (!activeConversation) {
        activeConversation = await getOrCreateConversation(contactItem.accountId);

        setContactsList((prev) =>
          prev.map((item) => {
            if (item.accountId === contactItem.accountId) {
              return { ...item, conversation: activeConversation };
            }
            return item;
          })
        );
      }

      const updatedContact: ContactPerson = {
        ...contactItem,
        conversation: activeConversation,
      };

      setSelectedContact(updatedContact);
      selectedContactRef.current = updatedContact;

      setIsLoadingMessages(true);
      const conversationId = getConversationId(activeConversation);
      const rawMessages = await getConversationMessages(conversationId);
      setMessagesList(extractArrayData(rawMessages));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Không mở được hội thoại"
      );
    } finally {
      setIsLoadingMessages(false);
    }
  }

  async function handleSendMessage(): Promise<void> {
    const content = inputMessageText.trim();
    const conversationId = getConversationId(selectedContact?.conversation);

    if (!content || !conversationId || isSendingMessage) return;

    setIsSendingMessage(true);
    try {
      await sendConversationMessage({
        messageConversationId: conversationId,
        messageContent: content,
        messageType: 0,
      });

      setInputMessageText("");
      const updatedMessages = await getConversationMessages(conversationId);
      setMessagesList(extractArrayData(updatedMessages));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Không gửi được tin nhắn"
      );
    } finally {
      setIsSendingMessage(false);
    }
  }

  return (
    <section
      className={
        selectedContact
          ? "flex h-[calc(100vh-120px)] flex-col gap-4 overflow-hidden lg:h-[calc(100vh-136px)]"
          : "flex flex-col gap-4 pb-12"
      }
    >
      <header className="flex shrink-0 items-center justify-between">
        <div>
          <p className="admin-eyebrow">LIÊN LẠC</p>
          <h1 className="admin-title">Danh bạ liên lạc</h1>
          <p className="admin-subtitle">Lọc danh bạ trước khi mở khung chat.</p>
        </div>
        <button
          onClick={() => void loadContactsDirectory()}
          className="admin-btn admin-btn-secondary cursor-pointer"
        >
          <RefreshCw size={16} /> Làm mới
        </button>
      </header>

      {errorMessage && (
        <div className="admin-alert shrink-0">
          {errorMessage}
          <button onClick={() => setErrorMessage("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {!selectedContact ? (
        <LienLacContactsDirectory
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          selectedClassId={selectedClassId}
          setSelectedClassId={setSelectedClassId}
          selectedGradeId={selectedGradeId}
          setSelectedGradeId={setSelectedGradeId}
          selectedRoleFilter={selectedRoleFilter}
          setSelectedRoleFilter={setSelectedRoleFilter}
          classesList={classesList}
          gradesList={gradesList}
          filteredContacts={filteredContacts}
          isLoadingContacts={isLoadingContacts}
          onOpenConversation={(p) => void handleOpenConversation(p)}
        />
      ) : (
        <LienLacChatBox
          selectedContact={selectedContact}
          onBack={() => setSelectedContact(null)}
          isConnectedToHub={isConnectedToHub}
          isLoadingMessages={isLoadingMessages}
          messagesList={messagesList}
          currentUserId={currentUserId}
          inputMessageText={inputMessageText}
          setInputMessageText={setInputMessageText}
          isSendingMessage={isSendingMessage}
          onSendMessage={() => void handleSendMessage()}
        />
      )}
    </section>
  );
}
