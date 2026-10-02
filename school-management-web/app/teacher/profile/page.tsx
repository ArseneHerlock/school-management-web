'use client';
import { useState } from 'react';
import { CLASS_INFO, CHILDREN } from '../data/mockData';

export default function ProfilePage() {
  const teacher = CLASS_INFO.teachers.find(t => t.id === CLASS_INFO.currentTeacher)!;
  const otherTeacher = CLASS_INFO.teachers.find(t => t.id !== CLASS_INFO.currentTeacher)!;
  const [editMode, setEditMode] = useState(false);
  const [phone, setPhone] = useState('0901234567');
  const [email, setEmail] = useState('nguyen.thi.lan@kindercare.edu.vn');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setEditMode(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5">
      {/* Profile card */}
      <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg shadow-orange-200">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
        <div className="flex items-center gap-4 relative z-10">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg"
            style={{ background: 'rgba(255,255,255,0.2)' }}
          >
            {teacher.avatar}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{teacher.name}</h2>
            <p className="text-orange-100">{teacher.role}</p>
            <div className="flex gap-2 mt-2">
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
                {CLASS_INFO.name}
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
                {CLASS_INFO.room}
              </span>
            </div>
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className="bg-white/20 hover:bg-white/30 px-3 py-2 rounded-xl text-xs font-bold transition-colors"
          >
            {editMode ? 'Huỷ' : '✏️ Sửa'}
          </button>
        </div>
      </div>

      {/* Contact info */}
      <div className="bg-white border border-orange-100 rounded-2xl p-5 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4">Thông tin liên hệ</h3>
        <div className="flex flex-col gap-3">
          {[
            { icon: '📱', label: 'Số điện thoại', value: phone, setter: setPhone },
            { icon: '📧', label: 'Email', value: email, setter: setEmail },
          ].map(f => (
            <div key={f.label} className="flex items-center gap-3">
              <span className="text-xl w-7">{f.icon}</span>
              <div className="flex-1">
                <p className="text-xs text-slate-400 font-semibold">{f.label}</p>
                {editMode ? (
                  <input
                    value={f.value}
                    onChange={e => f.setter(e.target.value)}
                    className="w-full border border-orange-200 rounded-lg px-3 py-1.5 text-sm mt-0.5 focus:outline-none focus:border-orange-400"
                  />
                ) : (
                  <p className="text-sm font-semibold text-slate-700">{f.value}</p>
                )}
              </div>
            </div>
          ))}

          {/* Static fields */}
          {[
            { icon: '🎓', label: 'Trình độ học vấn', value: 'Cử nhân Sư phạm Mầm non' },
            { icon: '📅', label: 'Ngày vào làm', value: '15/08/2020' },
            { icon: '⭐', label: 'Kinh nghiệm', value: '6 năm' },
          ].map(f => (
            <div key={f.label} className="flex items-center gap-3">
              <span className="text-xl w-7">{f.icon}</span>
              <div>
                <p className="text-xs text-slate-400 font-semibold">{f.label}</p>
                <p className="text-sm font-semibold text-slate-700">{f.value}</p>
              </div>
            </div>
          ))}
        </div>

        {editMode && (
          <button
            onClick={handleSave}
            className="mt-4 w-full bg-orange-400 text-white py-3 rounded-xl font-bold hover:bg-orange-500 transition-colors"
          >
            Lưu thay đổi
          </button>
        )}

        {saved && (
          <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2 slide-in">
            <span>✅</span>
            <span className="text-green-700 font-semibold text-sm">Đã lưu thông tin!</span>
          </div>
        )}
      </div>

      {/* Co-teacher */}
      <div className="bg-white border border-orange-100 rounded-2xl p-5 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-3">👥 Giáo viên cùng lớp</h3>
        <div className="flex items-center gap-3 bg-pink-50 border border-pink-100 rounded-xl p-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
            style={{ background: otherTeacher.color }}
          >
            {otherTeacher.avatar}
          </div>
          <div className="flex-1">
            <p className="font-bold text-slate-800">{otherTeacher.name}</p>
            <p className="text-sm text-pink-600">{otherTeacher.role}</p>
          </div>
          <button className="text-xs bg-white border border-pink-200 text-pink-600 px-3 py-1.5 rounded-lg font-semibold hover:bg-pink-50 transition-colors">
            💬 Nhắn tin
          </button>
        </div>
      </div>

      {/* Class stats */}
      <div className="bg-white border border-orange-100 rounded-2xl p-5 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-3">📊 Thống kê lớp</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Tổng học sinh', value: CHILDREN.length, icon: '👶', color: 'text-orange-500' },
            { label: 'Nữ', value: CHILDREN.filter(c => c.gender === 'F').length, icon: '👧', color: 'text-pink-500' },
            { label: 'Nam', value: CHILDREN.filter(c => c.gender === 'M').length, icon: '👦', color: 'text-blue-500' },
          ].map(s => (
            <div key={s.label} className="text-center bg-orange-50 rounded-xl p-3">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500 font-semibold">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
