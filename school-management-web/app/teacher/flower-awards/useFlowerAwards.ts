import { useEffect, useRef, useState, useCallback } from 'react';
import { currentUser } from '@/services/client';
import { getStaffByUserId } from '@/services/staff';
import { getClasses } from '@/services/classes';
import { getStudents, Student } from '@/services/students';
import { getGoodChildRecords, awardFlower, revokeFlower } from '@/services/learning';
import { FlowerRecord, GoodChildRecord } from './types';

export function padZero(num: number): string {
  return String(num).padStart(2, '0');
}

export function useFlowerAwards() {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());

  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [recordsList, setRecordsList] = useState<GoodChildRecord[]>([]);

  const [selectedStudentForAward, setSelectedStudentForAward] = useState<{
    student: Student;
    record?: GoodChildRecord;
  } | null>(null);

  const [awardDate, setAwardDate] = useState<string>(
    `${currentDate.getFullYear()}-${padZero(currentDate.getMonth() + 1)}-${padZero(
      currentDate.getDate()
    )}`
  );
  const [awardReason, setAwardReason] = useState<string>('');

  const [flowerToRevoke, setFlowerToRevoke] = useState<FlowerRecord | null>(null);
  const [revokeReason, setRevokeReason] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const requestCounterRef = useRef<number>(0);
  const lastDayOfMonth = new Date(selectedYear, selectedMonth, 0).getDate();

  const loadFlowerAwardsData = useCallback(async () => {
    const currentRequestId = ++requestCounterRef.current;
    setIsLoading(true);
    setErrorMessage('');

    try {
      const activeUser = currentUser();
      if (!activeUser) return;

      const staffMember = await getStaffByUserId(activeUser.id);
      const allClasses = await getClasses();
      const myClass = allClasses.find(
        (c: any) => c.giaoVienChuNhiemId === staffMember?.staffId || c.giaoVienPhuId === staffMember?.staffId
      );

      let students: Student[] = [];
      if (myClass) {
        students = await getStudents({ lopId: myClass.id });
      } else {
        students = await getStudents();
      }

      if (currentRequestId !== requestCounterRef.current) return;
      setStudentsList(students);

      const rawRecords = await getGoodChildRecords({
        month: selectedMonth,
        year: selectedYear,
        pageSize: 100,
      });

      if (currentRequestId === requestCounterRef.current) {
        const recordsArray: GoodChildRecord[] = Array.isArray(rawRecords) ? rawRecords : [];
        const filteredByMonthYear = recordsArray.filter(
          (item) =>
            Number(item.month) === selectedMonth && Number(item.year) === selectedYear
        );
        setRecordsList(filteredByMonthYear);
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Không tải được dữ liệu hoa bé ngoan';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    setAwardDate(`${selectedYear}-${padZero(selectedMonth)}-01`);
    setSelectedStudentForAward(null);
    void loadFlowerAwardsData();
  }, [selectedMonth, selectedYear, loadFlowerAwardsData]);

  function getRecordForStudent(studentId: string): GoodChildRecord | undefined {
    return recordsList.find((record) => String(record.childId) === String(studentId));
  }

  function handleOpenAwardModal(student: Student): void {
    const studentRecord = getRecordForStudent(student.id);
    setSelectedStudentForAward({ student, record: studentRecord });
    setAwardReason('');
  }

  async function handleAwardFlower(): Promise<void> {
    if (!selectedStudentForAward?.record) return;

    const currentSmallFlowers = Number(selectedStudentForAward.record.dailyFlowerCount || 0);
    if (currentSmallFlowers >= 4) {
      setErrorMessage('Bé đã đủ 4/4 hoa nhỏ trong tháng này.');
      return;
    }

    const parsedDate = new Date(`${awardDate}T00:00:00`);
    if (
      parsedDate.getMonth() + 1 !== selectedMonth ||
      parsedDate.getFullYear() !== selectedYear
    ) {
      setErrorMessage('Ngày tặng hoa phải thuộc đúng tháng đang được chọn.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const updatedRecord = await awardFlower(
        selectedStudentForAward.record.id,
        {
          flowerDate: awardDate,
          reason: awardReason.trim() || 'Bé có việc làm tốt đáng khen trong ngày',
        }
      );

      setRecordsList((prevList) =>
        prevList.map((item) => (item.id === updatedRecord.id ? updatedRecord : item))
      );

      setSelectedStudentForAward({
        ...selectedStudentForAward,
        record: updatedRecord,
      });

      setAwardReason('');
      const isUpgraded = Number(updatedRecord.dailyFlowerCount || 0) >= 4;
      setFeedbackMessage(
        isUpgraded
          ? 'Đã tặng hoa nhỏ thứ 4! Hệ thống tự động trao tặng thêm 1 Hoa lớn cho bé.'
          : 'Đã tặng 1 hoa nhỏ cho bé thành công.'
      );
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Không thể tặng hoa';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleConfirmRevokeFlower(): Promise<void> {
    if (!flowerToRevoke || !revokeReason.trim() || !selectedStudentForAward?.record) return;

    try {
      setIsSubmitting(true);
      const updatedRecord = await revokeFlower(
        selectedStudentForAward.record.id,
        flowerToRevoke.id,
        revokeReason.trim()
      );

      const mergedRecord: GoodChildRecord = {
        ...selectedStudentForAward.record,
        ...updatedRecord,
        flowers: updatedRecord.flowers ?? selectedStudentForAward.record.flowers ?? [],
      };

      setSelectedStudentForAward({
        ...selectedStudentForAward,
        record: mergedRecord,
      });

      setRecordsList((prevList) =>
        prevList.map((item) => (item.id === mergedRecord.id ? mergedRecord : item))
      );

      setFlowerToRevoke(null);
      setRevokeReason('');
      setFeedbackMessage('Đã thu hồi hoa và ghi nhận lý do thành công.');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Không thể gỡ hoa';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    lastDayOfMonth,
    studentsList,
    recordsList,
    selectedStudentForAward,
    setSelectedStudentForAward,
    awardDate,
    setAwardDate,
    awardReason,
    setAwardReason,
    flowerToRevoke,
    setFlowerToRevoke,
    revokeReason,
    setRevokeReason,
    isLoading,
    isSubmitting,
    feedbackMessage,
    setFeedbackMessage,
    errorMessage,
    setErrorMessage,
    loadFlowerAwardsData,
    getRecordForStudent,
    handleOpenAwardModal,
    handleAwardFlower,
    handleConfirmRevokeFlower,
  };
}
