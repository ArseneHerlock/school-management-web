'use client';

import React, { useState, useEffect } from 'react';
import { useParentContext } from '../ParentContext';
import {
  ShieldCheck,
  UserCheck,
  Calendar,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { AuthorizedPerson, DailyAuth, RecentPickupLog } from './types';
import { PickupRegisteredList } from './components/PickupRegisteredList';
import { DailyAuthForm } from './components/DailyAuthForm';
import { PickupHistoryTable } from './components/PickupHistoryTable';
import { AddAuthorizedPersonModal } from './components/AddAuthorizedPersonModal';

export default function ParentPickupPage() {
  const { child } = useParentContext();
  const [activeSubTab, setActiveSubTab] = useState<'REGISTERED' | 'DAILY' | 'HISTORY'>('REGISTERED');

  const [loading, setLoading] = useState(true);
  const [persons, setPersons] = useState<AuthorizedPerson[]>([]);
  const [todayAuth, setTodayAuth] = useState<DailyAuth | null>(null);
  const [history, setHistory] = useState<RecentPickupLog[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal đăng ký người đón mới
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    relationship: 'Ông nội',
    phoneNumber: '',
    idCardNumber: '',
    photoUrl: '',
    isDefault: false,
    notes: '',
  });

  // Form ủy quyền hôm nay
  const [dailyForm, setDailyForm] = useState({
    pickupPersonName: '',
    relationship: 'Ông',
    phoneNumber: '',
    idCardNumber: '',
    expectedTime: '17:00',
    parentNote: '',
  });

  const loadPickupData = async () => {
    if (!child?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/pickup?childId=${child.id}`);
      if (res.ok) {
        const data = await res.json();
        setPersons(data.authorizedPersons || []);
        setTodayAuth(data.todayAuthorization || null);
        setHistory(data.recentPickups || []);
      }
    } catch (err) {
      console.error('Lỗi tải dữ liệu người đón:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPickupData();
  }, [child?.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCreatePerson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!child?.id || !formData.fullName) return;

    try {
      const res = await fetch('/api/pickup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE_PERSON',
          childId: child.id,
          ...formData,
        }),
      });

      if (res.ok) {
        showToast('Đã đăng ký người đón bé thành công!');
        setIsModalOpen(false);
        setFormData({
          fullName: '',
          relationship: 'Ông nội',
          phoneNumber: '',
          idCardNumber: '',
          photoUrl: '',
          isDefault: false,
          notes: '',
        });
        loadPickupData();
      } else {
        const err = await res.json();
        alert(err.error || 'Lỗi khi thêm người đón.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateDailyAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!child?.id || !dailyForm.pickupPersonName) return;

    try {
      const res = await fetch('/api/pickup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'DAILY_AUTHORIZATION',
          childId: child.id,
          ...dailyForm,
        }),
      });

      if (res.ok) {
        showToast('Đã gửi giấy ủy quyền đón bé đến giáo viên chủ nhiệm!');
        loadPickupData();
      } else {
        const err = await res.json();
        alert(err.error || 'Lỗi gửi giấy ủy quyền.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePerson = async (id?: string) => {
    if (!id) return;
    if (!confirm('Bạn có chắc chắn muốn ngừng ủy quyền đón bé cho người này?')) return;
    try {
      const res = await fetch(`/api/pickup?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Đã hủy quyền đón bé thành công.');
        loadPickupData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 font-sans">
      {/* Banner đầu trang */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-indigo-100 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck size={16} /> An toàn đón trả bé
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Quản lý người đón bé {child?.hoTen || ''}
          </h1>
          <p className="text-indigo-50 text-sm mt-1 max-w-2xl">
            Quản lý thông tin Bố Mẹ và những người thân được gia đình ủy quyền đón bé.
            Nhà trường đối chiếu thông tin và số điện thoại trước khi bàn giao trẻ nhằm đảm bảo an toàn tuyệt đối.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-15 translate-x-8 translate-y-8 pointer-events-none">
          <UserCheck size={180} />
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-sm font-semibold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-indigo-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-indigo-500 hover:text-indigo-700 cursor-pointer font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Tabs điều hướng phụ */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('REGISTERED')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm transition cursor-pointer ${
            activeSubTab === 'REGISTERED'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UserCheck size={16} /> Người đón hợp lệ ({persons.length})
        </button>

        <button
          onClick={() => setActiveSubTab('DAILY')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm transition relative cursor-pointer ${
            activeSubTab === 'DAILY'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar size={16} /> Ủy quyền đón hôm nay
          {todayAuth && (
            <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-2 right-2 animate-pulse"></span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('HISTORY')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm transition cursor-pointer ${
            activeSubTab === 'HISTORY'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock size={16} /> Lịch sử đón trả ({history.length})
        </button>
      </div>

      {/* Nội dung tab */}
      {activeSubTab === 'REGISTERED' && (
        <PickupRegisteredList
          persons={persons}
          loading={loading}
          onOpenModal={() => setIsModalOpen(true)}
          onDeletePerson={handleDeletePerson}
        />
      )}

      {activeSubTab === 'DAILY' && (
        <DailyAuthForm
          dailyForm={dailyForm}
          setDailyForm={setDailyForm}
          onSubmit={handleCreateDailyAuth}
          todayAuth={todayAuth}
        />
      )}

      {activeSubTab === 'HISTORY' && <PickupHistoryTable history={history} />}

      {/* Modal đăng ký người đón */}
      <AddAuthorizedPersonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePerson}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
}
