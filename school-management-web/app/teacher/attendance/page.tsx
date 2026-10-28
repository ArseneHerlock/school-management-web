'use client';

import { useMemo, useState, useEffect } from 'react';
import {
  CheckCircle2,
  Search,
  Loader2,
  Users,
  CheckCheck,
  AlertCircle,
  Save,
  Clock,
  UserX,
  UserCheck,
  CalendarCheck,
} from 'lucide-react';
import { CHILDREN, loadLiveTeacherChildren } from '../data';
import { checkInStudent, checkOutStudent, createHubConnection } from '@/services';
import { AttendanceSummaryCard } from './components/AttendanceSummaryCard';
import { AttendanceList } from './components/AttendanceList';
import { AttendanceHistory } from './components/AttendanceHistory';
import { AttendanceNoteModal } from './components/AttendanceNoteModal';
import { fetchDailyAttendanceData, fetchAttendanceHistory } from './components/attendanceData';

type FilterTab = 'ALL' | 'PRESENT' | 'LATE' | 'ABSENT' | 'APPROVED_LEAVE';

export default function AttendancePage() {
  const getLocalDateString = (date = new Date()) => {
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
  };

  const [selectedDate, setSelectedDate] = useState<string>(getLocalDateString());
  const [absentIds, setAbsentIds] = useState<Set<number>>(new Set());
  const [lateIds, setLateIds] = useState<Set<number>>(new Set());
  const [approvedLeaveMap, setApprovedLeaveMap] = useState<
    Map<number, { reason: string; fromDate: string; toDate: string }>
  >(new Map());
  const [mode, setMode] = useState<'DEN' | 'VE'>('DEN');
  const [noteMap, setNoteMap] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilterTab, setActiveFilterTab] = useState<FilterTab>('ALL');
  const [openNoteChildId, setOpenNoteChildId] = useState<number | null>(null);
  const [tempNoteText, setTempNoteText] = useState<string>('');
  const [childrenVersion, setChildrenVersion] = useState<number>(0);
  const [historyRows, setHistoryRows] = useState<
    Array<{ childId: string; childName: string; rows: any[] }>
  >([]);
  const [historyFromDate, setHistoryFromDate] = useState<string>(() =>
    getLocalDateString(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  );
  const [historyToDate, setHistoryToDate] = useState<string>(getLocalDateString());
  const [historyChildId, setHistoryChildId] = useState<string>('ALL');
  const [loadingData, setLoadingData] = useState<boolean>(false);

  // Khởi tạo và kết nối SignalR Hub
  useEffect(() => {
    void loadLiveTeacherChildren()
      .catch(() => undefined)
      .finally(() => setChildrenVersion((version) => version + 1));

    let isDisposed = false;
    const hubConnection = createHubConnection('attendance');
    if (hubConnection) {
      void hubConnection
        .start()
        .then(() => {
          if (isDisposed) {
            void hubConnection.stop();
            return;
          }
          hubConnection.on('DiemDanhCapNhat', () => {
            // Nhận thông báo cập nhật điểm danh thời gian thực
          });
        })
        .catch((error: unknown) => {
          if (!isDisposed) console.warn('AttendanceHub warning:', error);
        });

      return () => {
        isDisposed = true;
        void hubConnection.stop();
      };
    }
  }, []);

  // Tải dữ liệu điểm danh theo ngày được chọn
  useEffect(() => {
    if (!CHILDREN.some((child) => child.apiId)) return;
    let isCancelled = false;
    setLoadingData(true);

    fetchDailyAttendanceData(selectedDate, CHILDREN)
      .then(({ leaveMap, absent, late }) => {
        if (!isCancelled) {
          setApprovedLeaveMap(leaveMap);
          setAbsentIds(absent);
          setLateIds(late);
          setSubmitted(false);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setAbsentIds(new Set());
          setLateIds(new Set());
          setApprovedLeaveMap(new Map());
        }
      })
      .finally(() => {
        if (!isCancelled) setLoadingData(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedDate, childrenVersion]);

  // Tải lịch sử điểm danh
  useEffect(() => {
    if (!CHILDREN.some((child) => child.apiId)) return;
    let isCancelled = false;
    fetchAttendanceHistory(CHILDREN, historyFromDate, historyToDate)
      .then((rows) => {
        if (!isCancelled) setHistoryRows(rows);
      })
      .catch(() => {});

    return () => {
      isCancelled = true;
    };
  }, [historyFromDate, historyToDate, childrenVersion, submitted]);

  // Số lượng học sinh
  const totalCount = CHILDREN.length;
  const presentCount = totalCount - absentIds.size - lateIds.size;
  const approvedLeaveCount = Array.from(approvedLeaveMap.keys()).filter((id) =>
    CHILDREN.some((child) => child.id === id)
  ).length;

  const selectedDateLabel = new Date(`${selectedDate}T00:00:00`).toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  // Chuyển đổi trạng thái điểm danh
  const handleToggleStatus = (id: number, type: 'absent' | 'late') => {
    setSubmitted(false);
    if (type === 'absent') {
      setAbsentIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
          setLateIds((prevLate) => {
            const nextLate = new Set(prevLate);
            nextLate.delete(id);
            return nextLate;
          });
        }
        return next;
      });
    } else {
      setLateIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
          setAbsentIds((prevAbsent) => {
            const nextAbsent = new Set(prevAbsent);
            nextAbsent.delete(id);
            return nextAbsent;
          });
        }
        return next;
      });
    }
  };

  // Đánh dấu nhanh tất cả học sinh có mặt (trừ các bé đã có đơn nghỉ phép)
  const handleMarkAllPresent = () => {
    setSubmitted(false);
    const leaveSet = new Set(approvedLeaveMap.keys());
    setAbsentIds(new Set(leaveSet));
    setLateIds(new Set());
  };

  // Lưu điểm danh lên hệ thống Microservices
  const handleSubmitAttendance = async () => {
    setSaving(true);
    setErrorMessage('');
    try {
      const utcNgay = `${selectedDate}T00:00:00Z`;
      if (mode === 'DEN') {
        const requests = CHILDREN.filter((child) => child.apiId).map((child) =>
          checkInStudent({
            hocSinhId: child.apiId!,
            ngay: utcNgay,
            trangThai: absentIds.has(child.id)
              ? 'Vắng có phép'
              : lateIds.has(child.id)
              ? 'Đi muộn'
              : 'Có mặt',
          })
        );
        await Promise.all(requests);
      } else {
        const requests = CHILDREN.filter((child) => child.apiId && !absentIds.has(child.id)).map(
          async (child) => {
            try {
              return await checkOutStudent({
                hocSinhId: child.apiId!,
                ngay: utcNgay,
              });
            } catch {
              await checkInStudent({
                hocSinhId: child.apiId!,
                ngay: utcNgay,
                trangThai: lateIds.has(child.id) ? 'Đi muộn' : 'Có mặt',
              });
              return await checkOutStudent({
                hocSinhId: child.apiId!,
                ngay: utcNgay,
              });
            }
          }
        );
        await Promise.all(requests);
      }
      setSubmitted(true);
    } catch (cause: any) {
      setErrorMessage(
        cause instanceof Error ? cause.message : 'Không thể lưu thông tin điểm danh lên hệ thống.'
      );
    } finally {
      setSaving(false);
    }
  };

  // Lọc danh sách học sinh theo từ khóa và tab
  const filteredChildren = useMemo(() => {
    return CHILDREN.filter((child) => {
      // Tìm kiếm theo tên
      const matchesSearch =
        !searchQuery.trim() ||
        child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        child.nickname.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Lọc theo tab
      const isAbsent = absentIds.has(child.id);
      const isLate = lateIds.has(child.id);
      const isPresent = !isAbsent && !isLate;
      const isApprovedLeave = approvedLeaveMap.has(child.id);

      if (activeFilterTab === 'PRESENT') return isPresent;
      if (activeFilterTab === 'LATE') return isLate;
      if (activeFilterTab === 'ABSENT') return isAbsent && !isApprovedLeave;
      if (activeFilterTab === 'APPROVED_LEAVE') return isApprovedLeave;

      return true;
    });
  }, [searchQuery, activeFilterTab, childrenVersion, absentIds, lateIds, approvedLeaveMap]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Thẻ Hero Tổng quan Điểm danh */}
      <AttendanceSummaryCard
        mode={mode}
        setMode={(newMode) => {
          setMode(newMode);
          setSubmitted(false);
        }}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedLabel={selectedDateLabel}
        presentCount={presentCount}
        absentCount={absentIds.size}
        lateCount={lateIds.size}
        approvedLeaveCount={approvedLeaveCount}
        totalCount={totalCount}
      />

      {/* Thông báo hướng dẫn nghiệp vụ */}
      <div className="flex items-start gap-3 rounded-2xl bg-amber-50/80 border border-amber-200/80 p-4 text-xs text-amber-900 shadow-xs">
        <CheckCircle2 size={18} className="shrink-0 text-amber-600 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Lưu ý nghiệp vụ mầm non:</strong> Mặc định toàn bộ học sinh được đánh dấu{' '}
          <strong className="text-emerald-700">Có mặt</strong>. Học sinh có đơn nghỉ học đã được Ban giám hiệu hoặc giáo viên phê duyệt sẽ tự động chuyển sang trạng thái{' '}
          <strong className="text-teal-700">Vắng có phép</strong>.
        </div>
      </div>

      {/* Thanh công cụ: Tìm kiếm, Bộ lọc Tabs, Thao tác nhanh & Nút Lưu */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-3xl border border-orange-100 bg-white p-4 shadow-xs">
        {/* Ô tìm kiếm bé */}
        <div className="relative min-w-[240px] flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên bé hoặc tên gọi ở nhà..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2 text-xs font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-orange-400 focus:bg-white transition"
          />
        </div>

        {/* Các tabs lọc danh sách */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveFilterTab('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
              activeFilterTab === 'ALL'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả ({totalCount})
          </button>
          <button
            onClick={() => setActiveFilterTab('PRESENT')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
              activeFilterTab === 'PRESENT'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Có mặt ({presentCount})
          </button>
          <button
            onClick={() => setActiveFilterTab('LATE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
              activeFilterTab === 'LATE'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            Trễ ({lateIds.size})
          </button>
          <button
            onClick={() => setActiveFilterTab('ABSENT')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
              activeFilterTab === 'ABSENT'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            Vắng ({absentIds.size})
          </button>
        </div>

        {/* Nút hành động nhanh: Chọn tất cả có mặt */}
        {mode === 'DEN' && (
          <button
            onClick={handleMarkAllPresent}
            className="flex items-center gap-1.5 rounded-2xl border border-orange-200 bg-orange-50/70 px-3.5 py-2 text-xs font-black text-orange-700 hover:bg-orange-100 transition cursor-pointer shrink-0"
          >
            <CheckCheck size={15} />
            <span>Đánh dấu cả lớp có mặt</span>
          </button>
        )}
      </div>

      {/* Thông báo lỗi nếu có */}
      {errorMessage && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-700 flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Thông báo lưu thành công */}
      {submitted && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 flex items-center gap-2 text-emerald-800 text-xs font-bold">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>
            {mode === 'DEN'
              ? `Đã lưu thành công dữ liệu đón trẻ! (${presentCount}/${totalCount} học sinh có mặt, ${approvedLeaveCount} bé duyệt nghỉ phép).`
              : 'Đã xác nhận trả trẻ thành công vào hệ thống!'}
          </span>
        </div>
      )}

      {/* Danh sách học sinh */}
      {loadingData ? (
        <div className="flex flex-col items-center justify-center p-20 bg-white rounded-3xl border border-orange-100 shadow-sm min-h-[300px]">
          <Loader2 className="h-10 w-10 animate-spin text-orange-500 mb-3" />
          <p className="text-sm font-bold text-slate-700">Đang đồng bộ dữ liệu điểm danh...</p>
        </div>
      ) : (
        <AttendanceList
          childrenList={filteredChildren}
          absentIds={absentIds}
          lateIds={lateIds}
          approvedLeaveMap={approvedLeaveMap}
          noteMap={noteMap}
          mode={mode}
          toggle={handleToggleStatus}
          onOpenNote={(childId) => {
            setTempNoteText(noteMap[childId] || '');
            setOpenNoteChildId(childId);
          }}
        />
      )}

      {/* Nút Submit Lưu Điểm Danh Nổi Bật */}
      <div className="sticky bottom-6 z-20 rounded-3xl bg-white/90 p-3 shadow-xl shadow-orange-500/10 border border-orange-200/80 backdrop-blur-md flex items-center justify-between gap-4">
        <div className="pl-3 hidden sm:block">
          <p className="text-xs font-black text-slate-800">
            {mode === 'DEN' ? 'Xác nhận sổ đón trẻ' : 'Xác nhận trả trẻ'} · {selectedDateLabel}
          </p>
          <p className="text-[11px] text-slate-500 font-medium">
            {presentCount} có mặt · {lateIds.size} trễ · {absentIds.size} vắng
          </p>
        </div>

        <button
          onClick={handleSubmitAttendance}
          disabled={saving}
          className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-3.5 rounded-2xl font-black text-sm transition-all shadow-md shadow-orange-500/30 disabled:opacity-60 cursor-pointer"
        >
          {saving ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Đang lưu lên hệ thống...</span>
            </>
          ) : (
            <>
              <Save size={18} />
              <span>
                {mode === 'DEN'
                  ? `Lưu sổ điểm danh đón trẻ (${presentCount}/${totalCount} có mặt)`
                  : 'Lưu xác nhận trả trẻ hôm nay'}
              </span>
            </>
          )}
        </button>
      </div>

      {/* Lịch sử điểm danh */}
      <AttendanceHistory
        historyRows={historyRows}
        historyFrom={historyFromDate}
        setHistoryFrom={setHistoryFromDate}
        historyTo={historyToDate}
        setHistoryTo={setHistoryToDate}
        historyChildId={historyChildId}
        setHistoryChildId={setHistoryChildId}
        childrenList={CHILDREN}
        loadingData={loadingData}
      />

      {/* Modal Nhập Ghi Chú Cá Nhân */}
      {openNoteChildId !== null && (
        <AttendanceNoteModal
          childName={CHILDREN.find((c) => c.id === openNoteChildId)?.name}
          tempNote={tempNoteText}
          setTempNote={setTempNoteText}
          onClose={() => setOpenNoteChildId(null)}
          onSave={() => {
            if (openNoteChildId !== null) {
              setNoteMap((prev) => ({ ...prev, [openNoteChildId]: tempNoteText }));
            }
            setOpenNoteChildId(null);
          }}
        />
      )}
    </div>
  );
}
