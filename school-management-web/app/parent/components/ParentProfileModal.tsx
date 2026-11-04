'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Camera, Lock, LogOut, User, Check, AlertCircle, Loader2, X } from 'lucide-react';
import { ParentProfile } from '../types';
import { ParentProfileForm } from './ParentProfileForm';
import { currentUser, uploadMedia, saveParentProfile } from '@/services';
import { ParentPasswordTab } from './profile/ParentPasswordTab';
import { ParentAccountTab } from './profile/ParentAccountTab';

interface ParentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  parent: ParentProfile;
  onSave: (updated: ParentProfile) => void;
}

export default function ParentProfileModal({
  isOpen,
  onClose,
  parent,
  onSave,
}: ParentProfileModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'account'>('profile');
  const [formData, setFormData] = useState<ParentProfile>(parent);
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    setFormData(parent);
  }, [parent]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    setErrorMsg('');
    try {
      let avatarUrl = '';
      try {
        const uploadRes = await uploadMedia(file);
        avatarUrl = uploadRes?.url || uploadRes?.fileUrl || '';
      } catch {
        avatarUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }

      const user = currentUser();
      await saveParentProfile({ id: formData.id, taiKhoanId: user?.id, avatar: avatarUrl });

      const updated = { ...formData, avatar: avatarUrl };
      setFormData(updated);
      onSave(updated);
      setSaveSuccess('Đã cập nhật ảnh đại diện thành công vào CSDL!');
      setTimeout(() => setSaveSuccess(''), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi tải ảnh đại diện');
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const user = currentUser();
      await saveParentProfile({ ...formData, taiKhoanId: user?.id });

      onSave(formData);
      setIsEditing(false);
      setSaveSuccess('Đã lưu thông tin phụ huynh thành công vào CSDL!');
      setTimeout(() => setSaveSuccess(''), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi lưu thông tin');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden shadow-2xl relative border border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Avatar and Basic Info */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-sky-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-md overflow-hidden border-2 border-white">
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  formData.hoTen
                    .split(' ')
                    .slice(-1)[0]
                    ?.slice(0, 2)
                    .toUpperCase() || 'PH'
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center shadow hover:bg-sky-600 transition cursor-pointer"
                title="Thay đổi ảnh đại diện (Lưu CSDL)"
              >
                {uploadingAvatar ? <Loader2 size={12} className="animate-spin" /> : <Camera size={12} />}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarSelect}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-slate-800">
                  {formData.hoTen || 'Phụ huynh'}
                </h3>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-700 border border-sky-200">
                  {formData.moiQuanHe || 'Phụ huynh'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Cập nhật thông tin hồ sơ & bảo mật tài khoản
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-600 border border-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 bg-slate-50/70 px-5 gap-2 pt-2">
          <button
            type="button"
            onClick={() => { setActiveTab('profile'); setErrorMsg(''); }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white text-sky-600 border-t border-x border-slate-200 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User size={14} />
            Hồ sơ cá nhân
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('password'); setErrorMsg(''); }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
              activeTab === 'password'
                ? 'bg-white text-sky-600 border-t border-x border-slate-200 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock size={14} />
            Đổi mật khẩu
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('account'); setErrorMsg(''); }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
              activeTab === 'account'
                ? 'bg-white text-rose-600 border-t border-x border-slate-200 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogOut size={14} />
            Tài khoản & Đăng xuất
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-5 overflow-y-auto parent-scroll space-y-4">
          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <Check size={16} className="text-emerald-600 shrink-0" />
              {saveSuccess}
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <AlertCircle size={16} className="text-rose-600 shrink-0" />
              {errorMsg}
            </div>
          )}

          {activeTab === 'profile' && (
            <>
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {isEditing ? 'Chỉnh sửa thông tin phụ huynh' : 'Thông tin cá nhân & Liên lạc'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline cursor-pointer"
                >
                  {isEditing ? 'Hủy chỉnh sửa' : 'Thay đổi thông tin'}
                </button>
              </div>

              <ParentProfileForm
                formData={formData}
                isEditing={isEditing}
                onChange={handleChange}
                onSubmit={handleSaveProfile}
                onCancel={() => setIsEditing(false)}
              />
            </>
          )}

          {activeTab === 'password' && (
            <ParentPasswordTab
              onSuccess={(msg) => {
                setSaveSuccess(msg);
                setTimeout(() => setSaveSuccess(''), 4000);
              }}
              onError={setErrorMsg}
            />
          )}

          {activeTab === 'account' && (
            <ParentAccountTab
              parentName={formData.hoTen}
              onClose={onClose}
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Dữ liệu được lưu trữ trực tiếp vào CSDL hệ thống trường học</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
