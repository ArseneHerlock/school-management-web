'use client';

import React, { useState } from 'react';
import './parent.css';
import {
  INITIAL_PARENT,
  ACTIVE_CHILD,
  INITIAL_MESSAGES,
  INITIAL_ABSENCES,
  INITIAL_MOMENTS,
  INITIAL_NEWS,
  TUITION_ITEMS,
  TUITION_HISTORY,
} from './data/mockData';
import { AbsenceRequest, ChatMessage, MomentItem, ParentProfile } from './types';
import ParentSidebar from './components/ParentSidebar';
import ParentHeader from './components/ParentHeader';
import DashboardTab from './components/DashboardTab';
import ProgressTab from './components/ProgressTab';
import MessagesTab from './components/MessagesTab';
import AbsenceTab from './components/AbsenceTab';
import MomentsTab from './components/MomentsTab';
import NewsTab from './components/NewsTab';
import TuitionTab from './components/TuitionTab';
import CallModal from './components/CallModal';
import LightboxModal from './components/LightboxModal';
import ParentProfileModal from './components/ParentProfileModal';

interface ParentAppProps {
  initialTab?: string;
}

export default function ParentApp({ initialTab = 'dashboard' }: ParentAppProps) {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [selectedMoment, setSelectedMoment] = useState<MomentItem | null>(null);

  // Core state
  const [parent, setParent] = useState<ParentProfile>(INITIAL_PARENT);
  const [child] = useState(ACTIVE_CHILD);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [absences, setAbsences] = useState<AbsenceRequest[]>(INITIAL_ABSENCES);
  const [moments, setMoments] = useState<MomentItem[]>(INITIAL_MOMENTS);
  const [news] = useState(INITIAL_NEWS);

  const pageHeaders: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Tổng quan', subtitle: 'Thứ Sáu, ngày 25 tháng 09, 2026' },
    progress: { title: 'Học tập & Phát triển', subtitle: `Đánh giá sự tiến bộ của bé ${child.hoTen}` },
    messages: { title: 'Tin nhắn cô giáo', subtitle: `Trao đổi 1-1 trực tiếp với GVCN ${child.lop}` },
    absence: { title: 'Xin nghỉ học', subtitle: 'Gửi đơn phép trực tuyến cho bé' },
    moments: { title: 'Khoảnh khắc lớp', subtitle: `Album ảnh sinh hoạt ${child.lop} & bé ${child.hoTen}` },
    news: { title: 'Tin tức trường', subtitle: 'Thông báo & sự kiện quan trọng' },
    tuition: { title: 'Học phí', subtitle: 'Biên lai & thanh toán trực tuyến' },
  };

  const currentHeader = pageHeaders[activeTab] || pageHeaders.dashboard;

  // Handlers
  const handleSendMessage = (text: string) => {
    const now = new Date();
    const timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'parent',
      senderName: `${parent.moiQuanHe} bé ${child.hoTen}`,
      text,
      time: timeStr,
      avatarText: 'PH',
    };

    setMessages((prev) => [...prev, newMsg]);

    // Simulated auto-reply from teacher after 2.5s
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'teacher',
        senderName: child.giaoVienChuNhiem,
        text: 'Dạ cô đã nhận được tin nhắn của phụ huynh rồi ạ! Cô sẽ theo dõi và hỗ trợ bé ngay nhé! ❤️',
        time: timeStr,
        avatarText: 'NL',
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 2500);
  };

  const handleSubmitAbsence = (newAbsence: Omit<AbsenceRequest, 'id' | 'createdAt'>) => {
    const entry: AbsenceRequest = {
      ...newAbsence,
      id: `abs-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('vi-VN'),
    };
    setAbsences((prev) => [entry, ...prev]);
  };

  const handleToggleLike = (id: string) => {
    setMoments((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const isLiked = !m.liked;
          return {
            ...m,
            liked: isLiked,
            likes: isLiked ? m.likes + 1 : m.likes - 1,
          };
        }
        return m;
      })
    );

    if (selectedMoment && selectedMoment.id === id) {
      const isLiked = !selectedMoment.liked;
      setSelectedMoment({
        ...selectedMoment,
        liked: isLiked,
        likes: isLiked ? selectedMoment.likes + 1 : selectedMoment.likes - 1,
      });
    }
  };

  const handleSaveParentProfile = (updated: ParentProfile) => {
    setParent(updated);
  };

  return (
    <div className="parent-portal min-h-screen flex text-slate-700 antialiased font-sans selection:bg-sky-500 selection:text-white">
      {/* Sidebar */}
      <ParentSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        child={child}
        parent={parent}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto parent-scroll">
        {/* Sticky Header */}
        <ParentHeader
          title={currentHeader.title}
          subtitle={currentHeader.subtitle}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onOpenCall={() => setIsCallModalOpen(true)}
          onOpenNotifications={() => setActiveTab('news')}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          parent={parent}
        />

        {/* Content Container */}
        <div className="flex-1 p-4 lg:p-6 max-w-4xl w-full mx-auto pb-16">
          {activeTab === 'dashboard' && (
            <DashboardTab
              child={child}
              parent={parent}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'progress' && <ProgressTab child={child} />}

          {activeTab === 'messages' && (
            <MessagesTab
              child={child}
              messages={messages}
              onSendMessage={handleSendMessage}
              onOpenCall={() => setIsCallModalOpen(true)}
            />
          )}

          {activeTab === 'absence' && (
            <AbsenceTab
              child={child}
              absences={absences}
              onSubmitAbsence={handleSubmitAbsence}
            />
          )}

          {activeTab === 'moments' && (
            <MomentsTab
              moments={moments}
              onSelectMoment={(m) => setSelectedMoment(m)}
              onToggleLike={handleToggleLike}
            />
          )}

          {activeTab === 'news' && <NewsTab newsList={news} />}

          {activeTab === 'tuition' && (
            <TuitionTab
              child={child}
              items={TUITION_ITEMS}
              history={TUITION_HISTORY}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      <CallModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        teacherName={child.giaoVienChuNhiem}
        teacherRole={`Giáo viên chủ nhiệm · ${child.lop}`}
        teacherPhone={child.sdtGiaoVien}
      />

      <LightboxModal
        moment={selectedMoment}
        onClose={() => setSelectedMoment(null)}
        onToggleLike={handleToggleLike}
      />

      <ParentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        parent={parent}
        onSave={handleSaveParentProfile}
      />
    </div>
  );
}
