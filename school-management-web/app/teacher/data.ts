import { currentUser, getStudents, getClasses, getStaff } from '@/services';

export interface TeacherMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
}

export interface ClassInfoState {
  name: string;
  room: string;
  ageGroup: string;
  teachers: TeacherMember[];
  currentTeacher: string;
}

export const CLASS_INFO: ClassInfoState = {
  name: '',
  room: '',
  ageGroup: '',
  teachers: [],
  currentTeacher: '',
};

export interface Child {
  id: number;
  apiId?: string;
  name: string;
  nickname: string;
  dob: string;
  gender: 'M' | 'F';
  avatar: string;
  parentName: string;
  parentPhone: string;
  notes: string;
}

export const CHILDREN: Child[] = [];

export const HEALTH_METRICS = [
  { id: 'weight', label: 'Cân nặng', unit: 'kg' },
  { id: 'height', label: 'Chiều cao', unit: 'cm' },
  { id: 'bmi', label: 'BMI', unit: '' },
];

/**
 * Tải danh sách học sinh thực tế của lớp học mà giáo viên hiện tại phụ trách
 */
export async function loadLiveTeacherChildren(): Promise<Child[]> {
  const context = await loadLiveTeacherContext();
  const classId = context.cls?.id;
  let rawStudentRows: any[] = [];

  if (classId) {
    try {
      const result = await getStudents({ lopId: String(classId) });
      rawStudentRows = Array.isArray(result) ? result : [];
    } catch (error) {
      console.warn('Không thể tải danh sách học sinh theo lớp:', error);
    }
  }

  const mappedChildren: Child[] = rawStudentRows.map((student: any, index: number) => {
    const studentName = String(student.tenHocSinh || '').trim();
    const nameParts = studentName.split(/\s+/);
    const nickname = nameParts.length > 0 ? nameParts[nameParts.length - 1] : '';
    const initials = nameParts
      .slice(-2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();

    return {
      id: index + 1,
      apiId: student.id || student.Id,
      name: studentName,
      nickname: nickname,
      dob: String(student.ngaySinh || '').slice(0, 10),
      gender: student.gioiTinh === 'Nữ' ? 'F' : 'M',
      avatar: initials || 'HS',
      parentName: '',
      parentPhone: '',
      notes: '',
    };
  });

  CHILDREN.splice(0, CHILDREN.length, ...mappedChildren);
  return CHILDREN;
}

/**
 * Tải thông tin ngữ cảnh giáo viên và lớp học được phân công từ Staff & Classes Service
 */
export async function loadLiveTeacherContext() {
  const [classesResult, staffResult] = await Promise.allSettled([
    getClasses(),
    getStaff(),
  ]);

  const classes =
    classesResult.status === 'fulfilled' && Array.isArray(classesResult.value)
      ? classesResult.value
      : [];
  const staffList =
    staffResult.status === 'fulfilled' && Array.isArray(staffResult.value)
      ? staffResult.value
      : [];

  const activeUserId = typeof window !== 'undefined' ? currentUser()?.id : '';
  const currentStaff = staffList.find((member: any) => member.userId === activeUserId);

  const assignedClass =
    classes.find((clsItem: any) => clsItem.giaoVienChuNhiemId === currentStaff?.staffId) ||
    null;

  CLASS_INFO.name = assignedClass?.tenLop || (currentStaff ? 'Chưa phân công lớp' : '');
  CLASS_INFO.room = assignedClass?.phongHoc || '';
  CLASS_INFO.ageGroup = assignedClass?.namHoc ? `Năm học ${assignedClass.namHoc}` : '';

  const teacherName = currentStaff?.fullName || '';
  const initials = teacherName
    .split(/\s+/)
    .slice(-2)
    .map((part: string) => part[0])
    .join('')
    .toUpperCase();

  CLASS_INFO.teachers = currentStaff
    ? [
        {
          id: currentStaff.staffId,
          name: teacherName,
          role: 'Giáo viên chủ nhiệm',
          avatar: initials || 'GV',
          color: '#f97316',
        },
      ]
    : [];

  CLASS_INFO.currentTeacher = currentStaff?.staffId || '';

  return {
    classes,
    staff: staffList,
    me: currentStaff,
    cls: assignedClass,
  };
}
