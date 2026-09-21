'use client';
import { useState } from 'react';

const LEAVE_TYPES = [
  { id: 'sick', label: '🤒 Nghỉ ốm / bệnh' },
  { id: 'personal', label: '🏡 Việc cá nhân / gia đình' },
  { id: 'conference', label: '📚 Tham gia hội nghị, tập huấn' },
  { id: 'maternity', label: '👶 Thai sản' },
  { id: 'other', label: '📌 Lý do khác' },
];

type LeaveReq = {
  id: number;
  from: string;
  to: string;
  type: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
};

export default function LeaveRequestPage() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [requests, setRequests] = useState<LeaveReq[]>([
    {
      id: 1,
      from: '2026-09-05',
      to: '2026-09-05',
      type: 'sick',
      reason: 'Sốt nhẹ, cần nghỉ ngơi',
      status: 'approved',
      submittedAt: '04/09/2026',
    },
    {
      id: 2,
      from: '2026-08-20',
      to: '2026-08-21',
      type: 'personal',
      reason: 'Việc gia đình ở quê',
      status: 'approved',
      submittedAt: '18/08/2026',
    },
  ]);

  const handleSubmit = () => {
    if (!from || !to || !leaveType || !reason.trim()) return;
    const newReq: LeaveReq = {
      id: requests.length + 1,
      from,
      to,
      type: leaveType,
      reason,
      status: 'pending',
      submittedAt: new Date().toLocaleDateString('vi-VN'),
    };
    setRequests(p => [newReq, ...p]);
    setFrom('');
    setTo('');
    setLeaveType('');
    setReason('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const statusMap = {
    pending: { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    approved: { label: 'Đã duyệt', color: 'bg-green-100 text-green-700 border-green-200' },
    rejected: { label: 'Từ chối', color: 'bg-red-100 text-red-600 border-red-200' },
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5">
      {/* Form */}
      <div className="bg-white border border-orange-100 rounded-2xl p-5 shadow-sm">
        <h2 className="font-bold text-slate-800 text-xl mb-4">📝 Đơn xin nghỉ phép</h2>

        {/* Date range */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Từ ngày</label>
            <input
              type="date"
              value={from}
              onChange={e => setFrom(e.target.value)}
              className="w-full border border-orange-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Đến ngày</label>
            <input
              type="date"
              value={to}
              min={from}
              onChange={e => setTo(e.target.value)}
              className="w-full border border-orange-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
            />
          </div>
        </div>

        {/* Leave type */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-slate-500 mb-2 block">Loại nghỉ phép</label>
          <div className="flex flex-col gap-2">
            {LEAVE_TYPES.map(t => (
              <button
                key={t.id}
                onClick={() => setLeaveType(t.id)}
                className={`text-left px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                  leaveType === t.id
                    ? 'bg-orange-400 text-white border-orange-400'
                    : 'bg-white border-orange-100 text-slate-600 hover:border-orange-300 hover:bg-orange-50'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reason */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-slate-500 mb-1 block">Lý do chi tiết</label>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            rows={3}
            placeholder="Mô tả lý do xin nghỉ..."
            className="w-full border border-orange-200 rounded-xl p-3 text-sm focus:outline-none focus:border-orange-400 resize-none"
          />
        </div>

        {from && to && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-4 text-sm text-orange-800">
            <span className="font-semibold">Tổng thời gian nghỉ: </span>
            {Math.ceil((new Date(to).getTime() - new Date(from).getTime()) / 86400000) + 1} ngày
            ({new Date(from).toLocaleDateString('vi-VN')} → {new Date(to).toLocaleDateString('vi-VN')})
          </div>
        )}

        {submitted && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 flex items-center gap-2 slide-in">
            <span>✅</span>
            <span className="text-green-700 font-semibold text-sm">
              Đã gửi đơn xin nghỉ thành công! Chờ ban giám hiệu phê duyệt.
            </span>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!from || !to || !leaveType || !reason.trim()}
          className="w-full bg-orange-400 hover:bg-orange-500 text-white py-3.5 rounded-2xl font-bold transition-colors shadow-lg shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          📤 Gửi đơn xin nghỉ
        </button>
      </div>

      {/* History */}
      <div>
        <p className="text-sm font-bold text-slate-600 mb-3">📋 Lịch sử đơn nghỉ phép</p>
        <div className="flex flex-col gap-2">
          {requests.map(r => (
            <div key={r.id} className="bg-white border border-orange-100 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-slate-800">
                      {LEAVE_TYPES.find(t => t.id === r.type)?.label || r.type}
                    </span>
                    <span
                      className={`ml-auto px-2 py-0.5 rounded-full text-xs font-bold border ${statusMap[r.status].color}`}
                    >
                      {statusMap[r.status].label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-1" suppressHydrationWarning>
                    {new Date(r.from).toLocaleDateString('vi-VN')} →{' '}
                    {new Date(r.to).toLocaleDateString('vi-VN')} · Gửi ngày {r.submittedAt}
                  </p>
                  <p className="text-sm text-slate-600 italic">{r.reason}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
