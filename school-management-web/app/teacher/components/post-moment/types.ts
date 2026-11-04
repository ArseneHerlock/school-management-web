export interface SelectedFilePreview {
  file: File;
  previewUrl: string;
  type: 'image' | 'video';
  name: string;
  size: number;
}

export interface TeacherPostMomentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultActivityId?: string;
  defaultActivityTitle?: string;
  defaultDate?: string; // YYYY-MM-DD
  defaultClassId?: string;
  defaultClassName?: string;
  onSuccess?: () => void;
}
