import { useState, useEffect, useMemo } from 'react';
import { currentUser } from '@/services/client';
import { loadLiveTeacherContext, loadLiveTeacherChildren } from '../data';
import {
  MedicationItem,
  SpecialConditionItem,
  fetchMedications,
  updateMedicationStatus,
  fetchSpecialConditions,
} from '@/services/medications';

export type ActiveTab = 'TODAY' | 'SPECIAL' | 'ALL';

export function useTeacherMedications() {
  const teacher = currentUser();
  const [currentClassId, setCurrentClassId] = useState<string>('');
  const [className, setClassName] = useState<string>('Lớp học');
  const [teacherName, setTeacherName] = useState<string>('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('TODAY');
  const [searchQuery, setSearchQuery] = useState('');

  const [medications, setMedications] = useState<MedicationItem[]>([]);
  const [conditions, setConditions] = useState<SpecialConditionItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal xác nhận uống thuốc / sự cố
  const [confirmModalItem, setConfirmModalItem] = useState<MedicationItem | null>(null);
  const [confirmType, setConfirmType] = useState<'SUCCESS' | 'ISSUE'>('SUCCESS');
  const [issueNote, setIssueNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const ctx = await loadLiveTeacherContext().catch(() => null);
      const cId = (ctx?.cls as any)?.id || (ctx?.cls as any)?.Id || '';
      setCurrentClassId(cId);
      setClassName(ctx?.cls?.tenLop || 'Lớp Mầm 1');

      const realStaffName =
        ctx?.me?.fullName ||
        (ctx?.me as any)?.FullName ||
        (ctx?.cls as any)?.FullName ||
        teacher?.name ||
        teacher?.username ||
        'Giáo viên phụ trách';
      setTeacherName(realStaffName);

      await loadLiveTeacherChildren().catch(() => null);

      const todayStr = new Date().toISOString().slice(0, 10);
      const [meds, conds] = await Promise.all([
        fetchMedications({ date: todayStr }).catch(() => []),
        fetchSpecialConditions().catch(() => []),
      ]);

      setMedications(meds);
      setConditions(conds);
    } catch (err) {
      console.error('Error loading teacher medication data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const todayMeds = medications;

  const filteredTodayMeds = useMemo(() => {
    if (!searchQuery.trim()) return todayMeds;
    const q = searchQuery.toLowerCase();
    return todayMeds.filter(
      (m) =>
        (m.TenHocSinh && m.TenHocSinh.toLowerCase().includes(q)) ||
        (m.TenThuoc && m.TenThuoc.toLowerCase().includes(q))
    );
  }, [todayMeds, searchQuery]);

  const filteredConditions = useMemo(() => {
    if (!searchQuery.trim()) return conditions;
    const q = searchQuery.toLowerCase();
    return conditions.filter(
      (c) =>
        (c.TenHocSinh && c.TenHocSinh.toLowerCase().includes(q)) ||
        (c.TenBenh && c.TenBenh.toLowerCase().includes(q))
    );
  }, [conditions, searchQuery]);

  const handleConfirmSubmit = async () => {
    if (!confirmModalItem) return;
    setUpdating(true);
    try {
      const nowTimeStr = new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      });

      const teacherDisplayName =
        teacherName ||
        teacher?.name ||
        teacher?.username ||
        'Giáo viên phụ trách';

      if (confirmType === 'SUCCESS') {
        await updateMedicationStatus({
          id: confirmModalItem.Id,
          trangThai: 'DA_CHO_UONG',
          gioUongThucTe: nowTimeStr,
          giaoVienXacNhan: teacherDisplayName,
          ghiChuGiaoVien: 'Bé đã uống thuốc ngoan và đúng giờ.',
        });
      } else {
        await updateMedicationStatus({
          id: confirmModalItem.Id,
          trangThai: 'SU_CO',
          gioUongThucTe: nowTimeStr,
          giaoVienXacNhan: teacherDisplayName,
          ghiChuGiaoVien: issueNote.trim() || 'Bé có dấu hiệu nôn trớ / chưa uống được thuốc.',
        });
      }

      setConfirmModalItem(null);
      setIssueNote('');
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi cập nhật trạng thái đơn thuốc.');
    } finally {
      setUpdating(false);
    }
  };

  const openConfirm = (item: MedicationItem, type: 'SUCCESS' | 'ISSUE') => {
    setConfirmModalItem(item);
    setConfirmType(type);
  };

  const closeConfirm = () => {
    setConfirmModalItem(null);
    setIssueNote('');
  };

  return {
    className,
    teacherName,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    medications,
    conditions,
    loading,
    todayMeds,
    filteredTodayMeds,
    filteredConditions,
    confirmModalItem,
    confirmType,
    issueNote,
    setIssueNote,
    updating,
    loadData,
    handleConfirmSubmit,
    openConfirm,
    closeConfirm,
  };
}
