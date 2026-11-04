import { useCallback, useEffect, useState, useMemo } from 'react';
import { currentUser } from '@/services/client';
import { getStaffByUserId } from '@/services/staff';
import { getClasses } from '@/services/classes';
import { getStudents, Student } from '@/services/students';
import { getLeaves, reviewLeave } from '@/services/leave';
import { LeaveApplication, resolveLeaveStatus } from './types';

export function useTeacherLeave() {
  const [leaveApplications, setLeaveApplications] = useState<LeaveApplication[]>([]);
  const [classStudents, setClassStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [processingId, setProcessingId] = useState<string>('');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'pending' | 'approved' | 'rejected'>('ALL');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const loadLeaveData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const activeUser = currentUser();
      if (!activeUser) return;

      const staffMember = await getStaffByUserId(activeUser.id);
      const allClasses = await getClasses();
      const assignedClass = allClasses.find(
        (c) => c.giaoVienChuNhiemId === staffMember?.staffId || c.giaoVienPhuId === staffMember?.staffId,
      );

      let studentsList: Student[] = [];
      if (assignedClass) {
        studentsList = await getStudents({ lopId: assignedClass.id });
      } else {
        studentsList = await getStudents();
      }
      setClassStudents(studentsList);

      const studentNameMap = new Map(
        studentsList.map((student) => [
          String(student.id).toLowerCase(),
          student.tenHocSinh,
        ]),
      );

      const rawLeaves = await getLeaves({ subjectType: 'Child' });
      const leaveList: any[] = Array.isArray(rawLeaves) ? rawLeaves : [];

      const matchedLeaves: LeaveApplication[] = [];
      for (const leaveItem of leaveList) {
        const childId = String(leaveItem.childId || '').toLowerCase();
        if (studentNameMap.has(childId)) {
          matchedLeaves.push({
            id: leaveItem.id,
            childId: leaveItem.childId,
            childName: studentNameMap.get(childId) || 'Học sinh',
            fromDate: leaveItem.fromDate,
            toDate: leaveItem.toDate,
            reason: leaveItem.reason || 'Nghỉ có phép',
            status: leaveItem.status,
            note: leaveItem.note,
            createdAt: leaveItem.createdAt,
          });
        }
      }

      matchedLeaves.sort((a, b) =>
        String(b.fromDate || '').localeCompare(String(a.fromDate || ''))
      );

      setLeaveApplications(matchedLeaves);
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message
          : 'Không tải được danh sách đơn nghỉ';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLeaveData();
  }, [loadLeaveData]);

  async function handleReviewApplication(
    application: LeaveApplication,
    isApproved: boolean,
  ): Promise<void> {
    setProcessingId(String(application.id));
    setFeedbackMessage('');
    setErrorMessage('');

    try {
      const reviewNote = isApproved
        ? 'Giáo viên chủ nhiệm đã duyệt đơn nghỉ.'
        : 'Giáo viên từ chối đơn nghỉ học.';

      await reviewLeave(application.id, {
        approve: isApproved,
        note: reviewNote,
      });

      const actionText = isApproved
        ? `Đã duyệt đơn nghỉ cho học sinh ${application.childName}. Hệ thống tự động đồng bộ trạng thái Vắng có phép vào sổ điểm danh.`
        : `Đã từ chối đơn nghỉ của học sinh ${application.childName}.`;

      setFeedbackMessage(actionText);
      await loadLeaveData();
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : 'Không thể xử lý đơn xin nghỉ';
      setErrorMessage(msg);
    } finally {
      setProcessingId('');
    }
  }

  const pendingCount = leaveApplications.filter(
    (app) => resolveLeaveStatus(app.status).key === 'pending',
  ).length;
  const approvedCount = leaveApplications.filter(
    (app) => resolveLeaveStatus(app.status).key === 'approved',
  ).length;
  const rejectedCount = leaveApplications.filter(
    (app) => resolveLeaveStatus(app.status).key === 'rejected',
  ).length;

  const filteredApplications = useMemo(() => {
    const keyword = searchKeyword.toLowerCase().trim();

    return leaveApplications.filter((app) => {
      const statusInfo = resolveLeaveStatus(app.status);
      const isStatusMatch =
        statusFilter === 'ALL' || statusInfo.key === statusFilter;

      const searchContent =
        `${app.childName} ${app.reason} ${app.note || ''}`.toLowerCase();
      const isKeywordMatch = !keyword || searchContent.includes(keyword);

      return isStatusMatch && isKeywordMatch;
    });
  }, [leaveApplications, statusFilter, searchKeyword]);

  return {
    leaveApplications,
    classStudents,
    isLoading,
    processingId,
    feedbackMessage,
    setFeedbackMessage,
    errorMessage,
    setErrorMessage,
    statusFilter,
    setStatusFilter,
    searchKeyword,
    setSearchKeyword,
    pendingCount,
    approvedCount,
    rejectedCount,
    filteredApplications,
    loadLeaveData,
    handleReviewApplication,
  };
}
