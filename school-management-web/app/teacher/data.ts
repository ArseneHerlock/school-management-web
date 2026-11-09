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

interface CachedTeacherContext {
  timestamp: number;
  userId: string;
  data: {
    classes: any[];
    staff: any[];
    me: any;
    cls: any;
  };
}

let inMemoryContextCache: CachedTeacherContext | null = null;
let inFlightContextPromise: Promise<any> | null = null;
const CONTEXT_CACHE_TTL = 300_000; // 5 phút

interface CachedChildrenData {
  timestamp: number;
  classId: string;
  data: Child[];
}

let inMemoryChildrenCache: CachedChildrenData | null = null;
let inFlightChildrenPromise: Promise<Child[]> | null = null;
const CHILDREN_CACHE_TTL = 300_000; // 5 phút

export function invalidateTeacherCache(): void {
  inMemoryContextCache = null;
  inMemoryChildrenCache = null;
  inFlightContextPromise = null;
  inFlightChildrenPromise = null;
}

function updateClassInfoFromContext(
  assignedClass: any,
  currentStaff: any,
  staffList: any[],
  activeUser: any
) {
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
        avatar:
          teacher1.fullName
            .split(/\s+/)
            .slice(-2)
            .map((p: string) => p[0])
            .join('')
            .toUpperCase() || 'GV',
        color: '#f97316',
      });
    }
    if (teacher2) {
      teacherListItems.push({
        id: teacher2.staffId,
        name: teacher2.fullName,
        role: 'Giáo viên đồng phụ trách (GV2)',
        avatar:
          teacher2.fullName
            .split(/\s+/)
            .slice(-2)
            .map((p: string) => p[0])
            .join('')
            .toUpperCase() || 'GV',
        color: '#0ea5e9',
      });
    }
  }

  if (teacherListItems.length === 0 && currentStaff) {
    const teacherName =
      currentStaff?.fullName || (currentStaff as any)?.FullName || activeUser?.name || '';
    teacherListItems.push({
      id: currentStaff.staffId,
      name: teacherName,
      role: 'Giáo viên',
      avatar:
        teacherName
          .split(/\s+/)
          .slice(-2)
          .map((part: string) => part[0])
          .join('')
          .toUpperCase() || 'GV',
      color: '#f97316',
    });
  }

  CLASS_INFO.teachers = teacherListItems;
  CLASS_INFO.currentTeacher = currentStaff?.staffId || '';
}

/**
 * Tải danh sách học sinh thực tế của lớp học mà giáo viên hiện tại phụ trách
 * Tích hợp bộ đệm In-Memory + SessionStorage + chống gọi trùng (In-Flight Deduplication)
 */
export async function loadLiveTeacherChildren(forceRefresh = false): Promise<Child[]> {
  const activeUser = typeof window !== 'undefined' ? currentUser() : null;
  const activeUserId = (activeUser?.id || '').toLowerCase().trim();

  // 1. Kiểm tra bộ nhớ In-Memory Cache (0ms)
  if (!forceRefresh && inMemoryChildrenCache && Date.now() - inMemoryChildrenCache.timestamp < CHILDREN_CACHE_TTL) {
    if (inMemoryChildrenCache.data.length > 0) {
      CHILDREN.splice(0, CHILDREN.length, ...inMemoryChildrenCache.data);
      return CHILDREN;
    }
  }

  // 2. Chống gọi trùng lặp (nhiều component/hook cùng gọi đồng thời)
  if (inFlightChildrenPromise && !forceRefresh) {
    return inFlightChildrenPromise;
  }

  // 3. Kiểm tra SessionStorage Cache để tải tức thời ngay khi chuyển trang
  if (!forceRefresh && typeof window !== 'undefined') {
    try {
      const stored = sessionStorage.getItem(`teacher_live_children_${activeUserId}`);
      if (stored) {
        const parsed: Child[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          CHILDREN.splice(0, CHILDREN.length, ...parsed);
          inMemoryChildrenCache = {
            timestamp: Date.now(),
            classId: '',
            data: parsed,
          };
          // Chạy revalidate ngầm không chặn UI
          void (async () => {
            try {
              await fetchAndCacheChildren(true);
            } catch {}
          })();
          return CHILDREN;
        }
      }
    } catch {}
  }

  inFlightChildrenPromise = fetchAndCacheChildren(forceRefresh);
  return inFlightChildrenPromise;
}

async function fetchAndCacheChildren(forceRefresh: boolean): Promise<Child[]> {
  try {
    const activeUser = typeof window !== 'undefined' ? currentUser() : null;
    const activeUserId = (activeUser?.id || '').toLowerCase().trim();
    const context = await loadLiveTeacherContext(forceRefresh);
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
    inMemoryChildrenCache = {
      timestamp: Date.now(),
      classId: String(classId || ''),
      data: mappedChildren,
    };

    if (typeof window !== 'undefined' && mappedChildren.length > 0) {
      try {
        sessionStorage.setItem(
          `teacher_live_children_${activeUserId}`,
          JSON.stringify(mappedChildren)
        );
      } catch {}
    }

    return CHILDREN;
  } finally {
    inFlightChildrenPromise = null;
  }
}

/**
 * Tải thông tin ngữ cảnh giáo viên và lớp học được phân công từ Staff & Classes Service
 * Tích hợp bộ đệm In-Memory + SessionStorage + chống gọi trùng (In-Flight Deduplication)
 */
export async function loadLiveTeacherContext(forceRefresh = false) {
  const activeUser = typeof window !== 'undefined' ? currentUser() : null;
  const activeUserId = (activeUser?.id || '').toLowerCase().trim();
  const activeUsername = (activeUser?.username || '').toLowerCase().trim();

  // 1. Kiểm tra In-Memory Cache (0ms)
  if (
    !forceRefresh &&
    inMemoryContextCache &&
    inMemoryContextCache.userId === activeUserId &&
    Date.now() - inMemoryContextCache.timestamp < CONTEXT_CACHE_TTL
  ) {
    return inMemoryContextCache.data;
  }

  // 2. Chống gọi trùng lặp (In-Flight Deduplication)
  if (inFlightContextPromise && !forceRefresh) {
    return inFlightContextPromise;
  }

  // 3. Khôi phục tức thời từ SessionStorage nếu có
  if (!forceRefresh && typeof window !== 'undefined') {
    try {
      const stored = sessionStorage.getItem(`teacher_ctx_${activeUserId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.cls || parsed?.me) {
          inMemoryContextCache = {
            timestamp: Date.now(),
            userId: activeUserId,
            data: parsed,
          };
          updateClassInfoFromContext(parsed.cls, parsed.me, parsed.staff || [], activeUser);
          // Chạy revalidate ngầm
          void (async () => {
            try {
              await fetchAndCacheContext(true);
            } catch {}
          })();
          return parsed;
        }
      }
    } catch {}
  }

  inFlightContextPromise = fetchAndCacheContext(forceRefresh);
  return inFlightContextPromise;
}

async function fetchAndCacheContext(forceRefresh: boolean) {
  try {
    const activeUser = typeof window !== 'undefined' ? currentUser() : null;
    const activeUserId = (activeUser?.id || '').toLowerCase().trim();
    const activeUsername = (activeUser?.username || '').toLowerCase().trim();

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

    updateClassInfoFromContext(assignedClass, currentStaff, staffList, activeUser);

    const result = {
      classes,
      staff: staffList,
      me: currentStaff,
      cls: assignedClass,
    };

    inMemoryContextCache = {
      timestamp: Date.now(),
      userId: activeUserId,
      data: result,
    };

    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(`teacher_ctx_${activeUserId}`, JSON.stringify(result));
      } catch {}
    }

    return result;
  } finally {
    inFlightContextPromise = null;
  }
}
