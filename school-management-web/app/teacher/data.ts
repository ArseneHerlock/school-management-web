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

  const activeUser = typeof window !== 'undefined' ? currentUser() : null;
  const activeUserId = (activeUser?.id || '').toLowerCase().trim();
  const activeUsername = (activeUser?.username || '').toLowerCase().trim();

  const currentStaff = staffList.find((member: any) => {
    const mUserId = String(member.userId || member.UserId || '').toLowerCase().trim();
    const mStaffCode = String(member.staffCode || member.StaffCode || '').toLowerCase().trim();
    const mEmail = String(member.email || member.Email || '').toLowerCase().trim();
    return (
      (activeUserId && mUserId === activeUserId) ||
      (activeUsername && (mStaffCode === activeUsername || mEmail === activeUsername))
    );
  });

  const staffId = currentStaff?.staffId || (currentStaff as any)?.StaffId;
  const currentStaffUserId = currentStaff?.userId || (currentStaff as any)?.UserId || activeUserId;
  const assignedClass =
    classes.find((clsItem: any) => {
      const gv1 = String(clsItem.giaoVienChuNhiemId || clsItem.GiaoVienChuNhiemId || '').toLowerCase();
      const gv2 = String(clsItem.giaoVienPhuId || clsItem.GiaoVienPhuId || '').toLowerCase();
      const sId = String(staffId || '').toLowerCase();
      const uId = String(currentStaffUserId || '').toLowerCase();
      return (
        (sId && (gv1 === sId || gv2 === sId)) ||
        (uId && (gv1 === uId || gv2 === uId))
      );
    }) || null;

  CLASS_INFO.name = assignedClass?.tenLop || (currentStaff ? 'Chưa phân công lớp' : '');
  CLASS_INFO.room = assignedClass?.phongHoc || '';
  CLASS_INFO.ageGroup = assignedClass?.namHoc ? `Năm học ${assignedClass.namHoc}` : '';

  const teacherListItems: TeacherMember[] = [];
  if (assignedClass) {
    const rawClass = assignedClass as any;
    const gv1Id = assignedClass.giaoVienChuNhiemId || rawClass.GiaoVienChuNhiemId;
    const gv2Id = assignedClass.giaoVienPhuId || rawClass.GiaoVienPhuId;
    
    const teacher1 = staffList.find((s) => s.staffId === gv1Id);
    const teacher2 = staffList.find((s) => s.staffId === gv2Id);

    if (teacher1) {
      teacherListItems.push({
        id: teacher1.staffId,
        name: teacher1.fullName,
        role: 'Giáo viên chủ nhiệm (GV1)',
        avatar: teacher1.fullName.split(/\s+/).slice(-2).map((p: string) => p[0]).join('').toUpperCase() || 'GV',
        color: '#f97316',
      });
    }
    if (teacher2) {
      teacherListItems.push({
        id: teacher2.staffId,
        name: teacher2.fullName,
        role: 'Giáo viên đồng phụ trách (GV2)',
        avatar: teacher2.fullName.split(/\s+/).slice(-2).map((p: string) => p[0]).join('').toUpperCase() || 'GV',
        color: '#0ea5e9',
      });
    }
  }

  if (teacherListItems.length === 0 && currentStaff) {
    const teacherName = currentStaff?.fullName || (currentStaff as any)?.FullName || activeUser?.name || '';
    teacherListItems.push({
      id: currentStaff.staffId,
      name: teacherName,
      role: 'Giáo viên',
      avatar: teacherName.split(/\s+/).slice(-2).map((part: string) => part[0]).join('').toUpperCase() || 'GV',
      color: '#f97316',
    });
  }

  CLASS_INFO.teachers = teacherListItems;

  CLASS_INFO.currentTeacher = currentStaff?.staffId || '';

  return {
    classes,
    staff: staffList,
    me: currentStaff,
    cls: assignedClass,
  };
}
