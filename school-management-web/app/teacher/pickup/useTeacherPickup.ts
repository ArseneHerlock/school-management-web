import { useState, useEffect, useMemo } from 'react';
import { getClasses } from '@/services';
import { loadLiveTeacherContext } from '../data';
import { StudentPickupItem } from './types';

export function useTeacherPickup() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [students, setStudents] = useState<StudentPickupItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<'ALL' | 'WAITING' | 'PICKED_UP'>('ALL');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    (async () => {
      try {
        const [cls, teacherCtx] = await Promise.all([
          getClasses(),
          loadLiveTeacherContext().catch(() => null),
        ]);

        if (cls && cls.length > 0) {
          setClasses(cls);
          const teacherClassId = (teacherCtx?.cls as any)?.id || (teacherCtx?.cls as any)?.Id;
          const defaultClassId = teacherClassId || cls[0].id;
          setSelectedClassId(defaultClassId);
        }
      } catch (err) {
        console.error('Lỗi khởi tạo lớp học:', err);
      }
    })();
  }, []);

  const loadClassPickups = async () => {
    if (!selectedClassId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/pickup?classId=${selectedClassId}`);
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students || []);
      }
    } catch (err) {
      console.error('Lỗi tải danh sách đón trẻ:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadClassPickups();
  }, [selectedClassId]);

  const handleConfirmPickup = async (
    student: StudentPickupItem,
    pickupPersonName: string
  ) => {
    if (!student || !pickupPersonName) return;
    setProcessingId(student.studentId);
    try {
      const res = await fetch('/api/pickup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CONFIRM_PICKUP',
          childId: student.studentId,
          pickupPersonName: pickupPersonName.trim(),
          teacherName: 'Giáo viên phụ trách',
        }),
      });

      if (res.ok) {
        showToast(
          `✓ Đã bàn giao bé ${student.studentName} cho ${pickupPersonName}. Đã tự động đồng bộ giờ về vào sổ điểm danh!`
        );
        await loadClassPickups();
      } else {
        const err = await res.json();
        alert(err.error || 'Lỗi khi xác nhận trả bé.');
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Lỗi kết nối máy chủ.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancelPickup = async (studentId: string, studentName: string) => {
    if (
      !confirm(
        `Bạn có chắc muốn hoàn tác trạng thái đã đón của bé ${studentName} để chuyển về Chờ đón?`
      )
    )
      return;
    setProcessingId(studentId);
    try {
      const res = await fetch('/api/pickup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CANCEL_PICKUP',
          childId: studentId,
        }),
      });

      if (res.ok) {
        showToast(`Đã chuyển bé ${studentName} về trạng thái Chờ đón.`);
        await loadClassPickups();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredList = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return students.filter((s) => {
      if (filterType === 'WAITING' && s.isPickedUp) return false;
      if (filterType === 'PICKED_UP' && !s.isPickedUp) return false;

      if (!q) return true;

      const matchChild = s.studentName.toLowerCase().includes(q);

      const matchParent = s.authorizedPersons.some(
        (p) =>
          p.FullName.toLowerCase().includes(q) ||
          (p.PhoneNumber && p.PhoneNumber.replace(/\s+/g, '').includes(q))
      );

      const matchDaily =
        s.todayAuthorization &&
        (s.todayAuthorization.PickupPersonName.toLowerCase().includes(q) ||
          (s.todayAuthorization.PhoneNumber &&
            s.todayAuthorization.PhoneNumber.replace(/\s+/g, '').includes(q)));

      return matchChild || matchParent || Boolean(matchDaily);
    });
  }, [students, searchQuery, filterType]);

  const waitingCount = students.filter((s) => !s.isPickedUp).length;
  const pickedUpCount = students.filter((s) => s.isPickedUp).length;

  return {
    classes,
    selectedClassId,
    setSelectedClassId,
    loading,
    students,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    processingId,
    toastMessage,
    setToastMessage,
    filteredList,
    waitingCount,
    pickedUpCount,
    handleConfirmPickup,
    handleCancelPickup,
  };
}
