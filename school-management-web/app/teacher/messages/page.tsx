'use client';

import React from 'react';
import { MessageSquare, RefreshCw, WifiOff, X } from 'lucide-react';
import { useTeacherMessages } from './useTeacherMessages';
import { ParentConversationList } from './components/ParentConversationList';
import { ChatConversationPane } from './components/ChatConversationPane';

export default function TeacherMessagesPage() {
  const {
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
  } = useTeacherMessages();

  return (
    <div className="flex h-[calc(100vh-130px)] min-h-[500px] flex-col rounded-2xl md:rounded-3xl border border-orange-100 bg-white shadow-sm overflow-hidden">
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

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <ParentConversationList
          parentContacts={parentContacts}
          filteredParents={filteredParents}
          selectedParent={selectedParent}
          conversations={conversations}
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          loadingContacts={loadingContacts}
          onSelectParent={(parent) => void handleSelectParent(parent)}
        />

        <ChatConversationPane
          selectedParent={selectedParent}
          activeConversation={activeConversation}
          messages={messages}
          loadingMessages={loadingMessages}
          draftMessage={draftMessage}
          setDraftMessage={setDraftMessage}
          sending={sending}
          currentTeacherId={currentTeacherId}
          messagesEndRef={messagesEndRef}
          onBack={() => {
            setSelectedParent(null);
            setActiveConversation(null);
          }}
          onSendMessage={() => void handleSendMessage()}
        />
      </div>
    </div>
  );
}
