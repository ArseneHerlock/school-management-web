export interface AuthorizedPersonItem {
  Id?: string;
  ParentId?: string;
  FullName: string;
  Relationship: string;
  PhoneNumber: string | null;
  IdCardNumber: string | null;
  PhotoUrl: string | null;
  IsDefault: boolean;
  IsOfficialParent?: boolean;
  Notes?: string | null;
}

export interface DailyAuthItem {
  Id: string;
  PickupDate: string;
  PickupPersonName: string;
  Relationship: string;
  PhoneNumber: string | null;
  IdCardNumber: string | null;
  PhotoUrl: string | null;
  ExpectedTime: string | null;
  ParentNote: string | null;
  Status: string;
  ActualPickupTime: string | null;
  TeacherConfirmedBy: string | null;
}

export interface StudentPickupItem {
  studentId: string;
  studentName: string;
  gender: string;
  dob: string;
  attendanceStatus: string;
  isPickedUp: boolean;
  pickupTime: any;
  pickedUpBy: string | null;
  pickupNote: string | null;
  authorizedPersons: AuthorizedPersonItem[];
  todayAuthorization: DailyAuthItem | null;
}
