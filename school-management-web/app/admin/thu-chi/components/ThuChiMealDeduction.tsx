'use client';

import React, { useState, useEffect } from 'react';
import {
  Utensils,
  Calendar,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  DollarSign,
  Users,
} from 'lucide-react';

interface StudentMealSummary {
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  absentDays: number;
  dailyRate: number;
  standardFee: number;
  deductionAmount: number;
  netMealFee: number;
  isSynchronized: boolean;
}

const money = (n: any) => Number(n || 0).toLocaleString('vi-VN');

export default function ThuChiMealDeduction({ classes }: { classes: any[] }) {
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [students, setStudents] = useState<StudentMealSummary[]>([]);
  const [totalAbsentDays, setTotalAbsentDays] = useState<number>(0);
  const [totalSchoolDeduction, setTotalSchoolDeduction] = useState<number>(0);
  const [notice, setNotice] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      let url = `/api/tuition/meal-deduction?month=${month}&year=${year}`;
      if (selectedClass) url += `&classId=${selectedClass}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students || []);
        setTotalAbsentDays(data.totalAbsentDays || 0);
        setTotalSchoolDeduction(data.totalSchoolDeduction || 0);
      }
    } catch (err) {
      console.error('Lỗi tải dữ liệu khấu trừ tiền ăn:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [month, year, selectedClass]);

  const handleSyncDeductions = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/tuition/meal-deduction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          month,
          year,
          classId: selectedClass || undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setNotice(data.message || 'Đã đồng bộ khấu trừ tiền ăn vào học phí thành công!');
        loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  const filteredStudents = students.filter((s) =>
    s.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {notice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-emerald-500 hover:text-emerald-700">✕</button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Định mức tiền ăn hoàn trả</div>
          <div className="text-2xl font-black text-slate-900 mt-2">45.000 đ</div>
          <div className="text-xs text-slate-400 mt-1">/ ngày học sinh không ăn trưa</div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">Tổng số ngày nghỉ tháng</div>
            <div className="text-2xl font-black text-amber-600 mt-2">{totalAbsentDays} ngày</div>
            <div className="text-xs text-amber-600/80 mt-1">Ghi nhận từ sổ điểm danh</div>
          </div>
          <Calendar className="text-amber-500" size={36} />
        </div>

        <div className="bg-white rounded-3xl p-5 border border-emerald-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Tổng tiền ăn khấu trừ</div>
            <div className="text-2xl font-black text-emerald-600 mt-2">- {money(totalSchoolDeduction)} đ</div>
            <div className="text-xs text-emerald-600/80 mt-1">Giảm trừ trên hóa đơn phụ huynh</div>
          </div>
          <Utensils className="text-emerald-500" size={36} />
        </div>

        <div className="bg-white rounded-3xl p-5 border border-teal-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-teal-700 uppercase tracking-wider">Học sinh được giảm trừ</div>
            <div className="text-2xl font-black text-teal-600 mt-2">
              {students.filter((s) => s.absentDays > 0).length} / {students.length}
            </div>
            <div className="text-xs text-teal-600/80 mt-1">Trẻ có ngày nghỉ trong tháng</div>
          </div>
          <Users className="text-teal-500" size={36} />
        </div>
      </div>

      {/* Thanh điều khiển bộ lọc & Thao tác đồng bộ */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Tháng:</span>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="text-xs font-bold rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:outline-teal-600"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                <option key={m} value={m}>Tháng {m}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Năm:</span>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="text-xs font-bold rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:outline-teal-600"
            >
              {[2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Lớp:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="text-xs font-bold rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:outline-teal-600"
            >
              <option value="">Tất cả các lớp</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.tenLop}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Tìm tên bé..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-teal-600 w-44"
            />
          </div>
        </div>

        <button
          onClick={handleSyncDeductions}
          disabled={syncing}
          className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-teal-600 text-white text-xs font-bold shadow hover:bg-teal-700 disabled:opacity-50 transition"
        >
          <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
          {syncing ? 'Đang cập nhật...' : 'Đồng bộ khấu trừ vào học phí tháng'}
        </button>
      </div>

      {/* Bảng chi tiết khấu trừ tiền ăn học sinh */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Bảng quyết toán tiền ăn theo ngày vắng thực tế
            </h3>
            <p className="text-xs text-slate-500">
              Dữ liệu được đối soát tự động từ sổ điểm danh chuyên cần của các giáo viên chủ nhiệm.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500">
            Tổng cộng: {filteredStudents.length} học sinh
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400">Đang tải dữ liệu quyết toán...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            Không tìm thấy học sinh nào trong phạm vi tra cứu.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60 font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">STT</th>
                  <th className="py-3.5 px-4">Họ và tên bé</th>
                  <th className="py-3.5 px-4">Lớp học</th>
                  <th className="py-3.5 px-4 text-center">Số ngày nghỉ / Không ăn</th>
                  <th className="py-3.5 px-4 text-right">Tiền ăn gốc</th>
                  <th className="py-3.5 px-4 text-right">Số tiền khấu trừ</th>
                  <th className="py-3.5 px-4 text-right">Tiền ăn thực thu</th>
                  <th className="py-3.5 px-4 text-center">Trạng thái đồng bộ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((st, idx) => (
                  <tr key={st.studentId} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 text-slate-400 font-semibold">{idx + 1}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{st.studentName}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-600">{st.className}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block font-extrabold px-2.5 py-0.5 rounded-full ${
                        st.absentDays > 0
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {st.absentDays} ngày
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-slate-600">
                      {money(st.standardFee)} đ
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-600">
                      {st.deductionAmount > 0 ? `- ${money(st.deductionAmount)} đ` : '0 đ'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-slate-900">
                      {money(st.netMealFee)} đ
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {st.isSynchronized ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                          <CheckCircle2 size={12} /> Đã áp dụng
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-xl">
                          Chờ đồng bộ
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
