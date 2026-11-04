import { useState, useEffect } from 'react';
import { loadLiveTeacherContext, loadLiveTeacherChildren } from '../data';
import { getClassYearEndAwards, saveClassYearEndAwards, YearEndAwardItem } from '@/services/awards';

export const AVAILABLE_TITLES = [
  'Bé Vững Vàng Toàn Diện',
  'Bé Tài Năng',
  'Bé Khỏe - Bé Ngoan',
  'Bé Chuyên Cần',
  'Bé Chăm Ngoan',
  'Bé Có Nhiều Tiến Bộ',
];

export function useYearEndAwards() {
  const [classId, setClassId] = useState<string>('');
  const [className, setClassName] = useState<string>('Lớp học');
  const [schoolYear, setSchoolYear] = useState<string>('2026-2027');
  const [semester, setSemester] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string>('');

  const [awards, setAwards] = useState<YearEndAwardItem[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isApproved, setIsApproved] = useState<boolean>(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const ctx = await loadLiveTeacherContext().catch(() => null);
      const cId = (ctx?.cls as any)?.id || (ctx?.cls as any)?.Id || '';
      setClassId(cId);
      setClassName(ctx?.cls?.tenLop || 'Lớp Mầm 1');

      await loadLiveTeacherChildren().catch(() => null);

      if (cId) {
        const res = await getClassYearEndAwards(cId, schoolYear, semester).catch(() => null);
        if (res) {
          setAwards(res.awards);
          setIsSubmitted(res.submitted);
          setIsApproved(res.approved);
        }
      }
    } catch (err) {
      console.error('Error loading year end awards:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [schoolYear, semester]);

  const handleTitleChange = (childId: string, newTitle: string) => {
    setAwards((prev) =>
      prev.map((a) => (a.childId === childId ? { ...a, awardTitle: newTitle } : a))
    );
  };

  const handleNoteChange = (childId: string, note: string) => {
    setAwards((prev) =>
      prev.map((a) => (a.childId === childId ? { ...a, teacherNote: note } : a))
    );
  };

  const handleApplyAllSuggestions = (force = false) => {
    setAwards((prev) =>
      prev.map((a) => {
        if (force || !a.awardTitle) {
          return { ...a, awardTitle: a.suggestedTitle };
        }
        return a;
      })
    );
  };

  const handleSave = async (isSubmit: boolean) => {
    if (!classId || awards.length === 0) return;

    if (isSubmit) {
      const unselected = awards.filter((a) => !a.awardTitle || a.awardTitle.trim() === '');
      if (unselected.length > 0) {
        alert(
          `Còn ${unselected.length} học sinh chưa được chọn danh hiệu khen thưởng chính thức. Vui lòng chọn danh hiệu cho tất cả học sinh trước khi trình Ban Giám Hiệu.`
        );
        return;
      }
    }

    setSaving(true);
    try {
      const res = await saveClassYearEndAwards({
        classId,
        schoolYear,
        semester,
        awardsList: awards.map((a) => ({
          childId: a.childId,
          awardTitle: a.awardTitle,
          suggestedTitle: a.suggestedTitle,
          attendanceRate: a.attendanceRate ?? undefined,
          healthStatus: a.healthStatus,
          teacherNote: a.teacherNote,
        })),
        action: isSubmit ? 'SUBMIT_CLASS' : 'SAVE_CLASS',
      });

      setSuccessToast(res.message);
      setTimeout(() => setSuccessToast(''), 4000);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi lưu bảng khen thưởng.');
    } finally {
      setSaving(false);
    }
  };

  const unassignedCount = awards.filter((a) => !a.awardTitle).length;

  return {
    className,
    schoolYear,
    setSchoolYear,
    semester,
    setSemester,
    loading,
    saving,
    successToast,
    awards,
    isSubmitted,
    isApproved,
    unassignedCount,
    handleTitleChange,
    handleNoteChange,
    handleApplyAllSuggestions,
    handleSave,
  };
}
