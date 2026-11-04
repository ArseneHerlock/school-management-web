'use client';

import React, { useState } from 'react';
import { Lock, Loader2 } from 'lucide-react';
import { currentUser, changeUserPassword } from '@/services';

interface ParentPasswordTabProps {
  onSuccess: (msg: string) => void;
  onError: (err: string) => void;
}

export function ParentPasswordTab({
  onSuccess,
  onError,
}: ParentPasswordTabProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    onError('');
    if (newPassword.length < 6) {
      onError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      onError('Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }

    setChangingPassword(true);
    try {
      const user = currentUser();
      if (!user?.id) throw new Error('Không xác định được tài khoản');

      await changeUserPassword(user.id, currentPassword, newPassword);

      onSuccess('Đổi mật khẩu thành công! Vui lòng ghi nhớ mật khẩu mới.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      onError(
        err?.message ||
          'Không thể đổi mật khẩu. Vui lòng kiểm tra lại mật khẩu hiện tại.'
      );
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <form onSubmit={handleChangePassword} className="space-y-4 max-w-md mx-auto py-2">
      <div className="text-center pb-2">
        <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
          <Lock size={22} />
        </div>
        <h4 className="font-extrabold text-slate-800 text-sm">Đổi mật khẩu tài khoản</h4>
        <p className="text-xs text-slate-500 mt-0.5">
          Mật khẩu mới cần tối thiểu 6 ký tự để đảm bảo an toàn
        </p>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-600 mb-1">
          Mật khẩu hiện tại *
        </label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          placeholder="Nhập mật khẩu hiện tại"
          className="w-full text-xs font-semibold rounded-xl px-3 py-2.5 border border-slate-200 outline-none focus:ring-1 focus:ring-sky-500"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-600 mb-1">
          Mật khẩu mới *
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          placeholder="Tối thiểu 6 ký tự"
          className="w-full text-xs font-semibold rounded-xl px-3 py-2.5 border border-slate-200 outline-none focus:ring-1 focus:ring-sky-500"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-600 mb-1">
          Xác nhận mật khẩu mới *
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder="Nhập lại mật khẩu mới"
          className="w-full text-xs font-semibold rounded-xl px-3 py-2.5 border border-slate-200 outline-none focus:ring-1 focus:ring-sky-500"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={changingPassword}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 shadow-md transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
        >
          {changingPassword ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Đang cập nhật mật khẩu...
            </>
          ) : (
            'Lưu mật khẩu mới'
          )}
        </button>
      </div>
    </form>
  );
}
