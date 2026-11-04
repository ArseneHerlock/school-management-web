export type Staff = {
  staffId: string;
  userId: string;
  staffCode: string;
  fullName: string;
  dateOfBirth: string;
  gender: number;
  nationalId: string;
  phoneNumber: string;
  email: string;
  address: string;
  positionId: string;
  contractType: number;
  hireDate: string;
  professionalQualification?: string;
  major?: string;
  status: any;
};

export type Position = {
  positionId: string;
  positionName: string;
};

export type Cls = {
  id: string;
  tenLop: string;
};

export type Assignment = {
  assignmentId: string;
  staffId: string;
  classId: string;
  role: number;
  startDate: string;
  endDate?: string;
};

export const emptyStaffForm = {
  staffCode: '',
  fullName: '',
  dateOfBirth: '',
  gender: 1,
  nationalId: '',
  phoneNumber: '',
  email: '',
  address: '',
  positionId: '',
  contractType: 2,
  hireDate: new Date().toISOString().slice(0, 10),
  professionalQualification: '',
  major: '',
};

export const getRoleLabel = (v: number) =>
  v === 1 ? 'Chủ nhiệm' : v === 2 ? 'Phó chủ nhiệm' : 'Giảng dạy';
