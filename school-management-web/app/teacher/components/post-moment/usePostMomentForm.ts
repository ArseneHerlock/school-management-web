import { useState, useEffect, useMemo } from 'react';
import { uploadMedia } from '@/services';
import { createLearningProduct } from '@/services/learning';
import { getActivities, ActivityItem } from "@/services/development";
import { loadLiveTeacherChildren, loadLiveTeacherContext, Child } from '../../data';
import { buildMomentDescription } from '@/lib/moments';
import { SelectedFilePreview, TeacherPostMomentModalProps } from './types';

export function usePostMomentForm({
  isOpen,
  onClose,
  defaultActivityId = '',
  defaultActivityTitle = '',
  defaultDate = '',
  defaultClassId = '',
  defaultClassName = '',
  onSuccess,
}: TeacherPostMomentModalProps) {
  const [children, setChildren] = useState<Child[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [classInfo, setClassInfo] = useState<any>(null);

  const [activityId, setActivityId] = useState<string>(defaultActivityId);
  const [activityTitle, setActivityTitle] = useState<string>(defaultActivityTitle);
  const [activityDate, setActivityDate] = useState<string>(
    defaultDate || new Date().toISOString().slice(0, 10)
  );
  const [scope, setScope] = useState<'class' | 'child'>('class');
  const [selectedChildIds, setSelectedChildIds] = useState<string[]>([]);
  const [studentSearch, setStudentSearch] = useState<string>('');
  const [category, setCategory] = useState<string>('Hoạt động học tập');
  const [teacherNote, setTeacherNote] = useState<string>('');

  const [files, setFiles] = useState<SelectedFilePreview[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgressText, setUploadProgressText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setErrorMessage('');
    setSuccessMessage('');
    setActivityId(defaultActivityId);
    setActivityTitle(defaultActivityTitle);
    setActivityDate(defaultDate || new Date().toISOString().slice(0, 10));
    setScope('class');
    setSelectedChildIds([]);
    setTeacherNote('');
    setFiles([]);

    Promise.all([
      loadLiveTeacherContext().catch(() => null),
      loadLiveTeacherChildren().catch(() => []),
      getActivities({ page: 1, pageSize: 200 }).catch(() => ({ items: [] })),
    ]).then(([ctx, kids, actRes]) => {
      if (!isMounted) return;
      if (ctx?.cls) setClassInfo(ctx.cls);
      setChildren(kids || []);
      setActivities(actRes?.items || []);
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, defaultActivityId, defaultActivityTitle, defaultDate]);

  useEffect(() => {
    return () => {
      files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    };
  }, [files]);

  const filteredChildren = useMemo(() => {
    if (!studentSearch.trim()) return children;
    const kw = studentSearch.toLowerCase();
    return children.filter(
      (c) =>
        c.name.toLowerCase().includes(kw) ||
        (c.nickname && c.nickname.toLowerCase().includes(kw))
    );
  }, [children, studentSearch]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles: SelectedFilePreview[] = [];
    Array.from(e.target.files).forEach((file) => {
      const isVideo = file.type.startsWith('video/');
      const previewUrl = URL.createObjectURL(file);
      newFiles.push({
        file,
        previewUrl,
        type: isVideo ? 'video' : 'image',
        name: file.name,
        size: file.size,
      });
    });
    setFiles((prev) => [...prev, ...newFiles]);
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const item = prev[index];
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const toggleSelectChild = (childIdentifier: string) => {
    setSelectedChildIds((prev) =>
      prev.includes(childIdentifier)
        ? prev.filter((id) => id !== childIdentifier)
        : [...prev, childIdentifier]
    );
  };

  const selectAllChildren = () => {
    setSelectedChildIds(children.map((c) => String(c.apiId || c.id)));
  };

  const clearAllChildren = () => {
    setSelectedChildIds([]);
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      setErrorMessage('Vui lòng chọn ít nhất 1 hình ảnh hoặc video khoảnh khắc!');
      return;
    }

    const currentClassId = defaultClassId || classInfo?.id || classInfo?.Id;
    const currentClassNameResolved =
      defaultClassName || classInfo?.tenLop || 'Lớp của cô';

    if (!currentClassId) {
      setErrorMessage('Không xác định được lớp học hiện tại. Vui lòng thử lại sau.');
      return;
    }

    if (scope === 'child' && selectedChildIds.length === 0) {
      setErrorMessage('Vui lòng chọn ít nhất 1 bé để đăng khoảnh khắc riêng!');
      return;
    }

    setIsUploading(true);
    setErrorMessage('');
    setUploadProgressText('Đang bắt đầu tải lên tập tin phương tiện...');

    try {
      const finalActivityTitle = activityTitle.trim() || 'Hoạt động trải nghiệm';
      let totalCreated = 0;

      for (let i = 0; i < files.length; i++) {
        const item = files[i];
        setUploadProgressText(
          `Đang tải lên tệp ${i + 1}/${files.length}: ${item.name}...`
        );

        const uploadRes = await uploadMedia(item.file);
        const uploadedMediaId = uploadRes.id || uploadRes.mediaId || '';

        if (!uploadedMediaId) {
          throw new Error(`Không thể lưu tệp ${item.name}. Vui lòng thử lại.`);
        }

        if (scope === 'class') {
          const momentDesc = buildMomentDescription({
            classId: String(currentClassId),
            className: currentClassNameResolved,
            activityId: activityId || undefined,
            activityTitle: finalActivityTitle,
            category,
            date: activityDate,
            note:
              teacherNote ||
              `Khoảnh khắc tham gia hoạt động ${finalActivityTitle} của tập thể lớp ${currentClassNameResolved}`,
          });

          let cleanTitle = finalActivityTitle;
          if (!cleanTitle.toLowerCase().includes(currentClassNameResolved.toLowerCase())) {
            cleanTitle = `${finalActivityTitle} - ${currentClassNameResolved}`;
          }

          await createLearningProduct({
            childId: String(currentClassId),
            activityId: activityId || null,
            mediaId: uploadedMediaId,
            title: cleanTitle,
            description: momentDesc,
          });
          totalCreated++;
        } else {
          for (const kidId of selectedChildIds) {
            const matchedChild = children.find(
              (c) => String(c.apiId || c.id) === kidId
            );
            const kidName = matchedChild?.name || 'Bé yêu';

            const momentDesc = buildMomentDescription({
              classId: String(currentClassId),
              className: currentClassNameResolved,
              childId: kidId,
              childName: kidName,
              activityId: activityId || undefined,
              activityTitle: finalActivityTitle,
              category,
              date: activityDate,
              note:
                teacherNote ||
                `Hình ảnh hoạt động của bé ${kidName} trong hoạt động ${finalActivityTitle}`,
            });

            await createLearningProduct({
              childId: kidId,
              activityId: activityId || null,
              mediaId: uploadedMediaId,
              title: `${finalActivityTitle} - Bé ${kidName}`,
              description: momentDesc,
            });
            totalCreated++;
          }
        }
      }

      setSuccessMessage(
        `Đã đăng thành công ${totalCreated} hình ảnh hoạt động cho "${finalActivityTitle}"!`
      );

      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Có lỗi xảy ra trong quá trình đăng tải. Vui lòng kiểm tra lại.'
      );
    } finally {
      setIsUploading(false);
      setUploadProgressText('');
    }
  };

  const currentClassNameResolved =
    defaultClassName || classInfo?.tenLop || 'Lớp phụ trách';

  return {
    children,
    activities,
    classInfo,
    activityId,
    setActivityId,
    activityTitle,
    setActivityTitle,
    activityDate,
    setActivityDate,
    scope,
    setScope,
    selectedChildIds,
    studentSearch,
    setStudentSearch,
    category,
    setCategory,
    teacherNote,
    setTeacherNote,
    files,
    isUploading,
    uploadProgressText,
    errorMessage,
    successMessage,
    filteredChildren,
    handleFileChange,
    removeFile,
    toggleSelectChild,
    selectAllChildren,
    clearAllChildren,
    handleSubmit,
    currentClassNameResolved,
  };
}
