export interface Student {
  id: string;
  name: string;
  dob: string;
  gender: 'Nam' | 'Nữ';
  block: string;
  className: string;
  parentName: string;
  parentPhone: string;
  status: 'Đang học' | 'Chờ nhập học' | 'Đã nghỉ' | 'Chuyển lớp';
  attendance: 'Có mặt' | 'Vắng có phép' | 'Vắng không phép' | 'Đi muộn' | 'Chưa điểm danh';
  profileComplete: number;
  allergies?: string[];
  note?: string;
}

export interface SchoolClass {
  id: string;
  name: string;
  block: string;
  capacity: number;
  currentCount: number;
  teacher: string;
  assistant: string;
  room: string;
  status: 'Đang hoạt động' | 'Không hoạt động';
}

export interface Teacher {
  id: string;
  name: string;
  role: 'Giáo viên chủ nhiệm' | 'Giáo viên phụ' | 'Nhân viên' | 'Ban giám hiệu';
  className?: string;
  phone: string;
  email: string;
  status: 'Đang làm' | 'Nghỉ phép' | 'Nghỉ bệnh';
  joinDate: string;
}

export interface Parent {
  id: string;
  name: string;
  relationship: 'Bố' | 'Mẹ' | 'Ông' | 'Bà' | 'Người giám hộ';
  phone: string;
  email: string;
  studentNames: string[];
  lastContact: string;
  accountStatus: 'Hoạt động' | 'Không hoạt động';
}

export interface Transaction {
  id: string;
  type: 'thu' | 'chi';
  studentName?: string;
  category: string;
  amount: number;
  date: string;
  dueDate?: string;
  status: 'Đã thanh toán' | 'Chờ thanh toán' | 'Quá hạn';
  note?: string;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  className: string;
  teacher: string;
  room: string;
  day: number;
  startHour: number;
  duration: number;
  type: 'Học tập' | 'Ăn' | 'Ngủ' | 'Vui chơi' | 'Hoạt động ngoài trời' | 'Sinh hoạt' | 'Sự kiện';
  conflict?: boolean;
  conflictMessage?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  type: 'Thông báo chung' | 'Thông báo nghỉ' | 'Thông báo họp' | 'Khẩn cấp';
  audience: string;
  readCount: number;
  totalRecipients: number;
  pinned: boolean;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
  participants: number;
  status: 'Sắp diễn ra' | 'Đang diễn ra' | 'Đã hoàn thành';
}


export interface Message {
  id: string;
  from: string;
  role: string;
  preview: string;
  time: string;
  unread: number;
  avatar: string;
}

export interface Notification {
  id: string;
  title: string;
  sub: string;
  time: string;
  read: boolean;
}

export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  time: string;
  isMe: boolean;
}

export const BLOCKS = ['Khối Mầm', 'Khối Chồi', 'Khối Lá'];

export const CLASSES: SchoolClass[] = [
  { id: 'MM1', name: 'Mầm 1', block: 'Khối Mầm', capacity: 25, currentCount: 22, teacher: 'Cô Nguyễn Thị Lan', assistant: 'Cô Phạm Thị Thu', room: 'Phòng 101', status: 'Đang hoạt động' },
  { id: 'MM2', name: 'Mầm 2', block: 'Khối Mầm', capacity: 25, currentCount: 24, teacher: 'Cô Trần Ngọc Anh', assistant: 'Cô Lê Thị Bình', room: 'Phòng 102', status: 'Đang hoạt động' },
  { id: 'MM3', name: 'Mầm 3', block: 'Khối Mầm', capacity: 25, currentCount: 20, teacher: 'Cô Hoàng Thị Hương', assistant: 'Cô Vũ Thị Nhung', room: 'Phòng 103', status: 'Đang hoạt động' },
  { id: 'MM4', name: 'Mầm 4', block: 'Khối Mầm', capacity: 25, currentCount: 21, teacher: 'Cô Đặng Thị Quỳnh', assistant: 'Cô Bùi Thị Hà', room: 'Phòng 104', status: 'Đang hoạt động' },
  { id: 'CH1', name: 'Chồi 1', block: 'Khối Chồi', capacity: 28, currentCount: 26, teacher: 'Cô Lê Thị Hoa', assistant: 'Cô Ngô Thị Minh', room: 'Phòng 201', status: 'Đang hoạt động' },
  { id: 'CH2', name: 'Chồi 2', block: 'Khối Chồi', capacity: 28, currentCount: 28, teacher: 'Cô Phạm Thị Mai', assistant: 'Cô Trương Thị Loan', room: 'Phòng 202', status: 'Đang hoạt động' },
  { id: 'CH3', name: 'Chồi 3', block: 'Khối Chồi', capacity: 28, currentCount: 25, teacher: 'Cô Nguyễn Thị Hạnh', assistant: 'Cô Đinh Thị Phương', room: 'Phòng 203', status: 'Đang hoạt động' },
  { id: 'CH4', name: 'Chồi 4', block: 'Khối Chồi', capacity: 28, currentCount: 27, teacher: 'Cô Võ Thị Thanh', assistant: 'Cô Lưu Thị Hằng', room: 'Phòng 204', status: 'Đang hoạt động' },
  { id: 'CH5', name: 'Chồi 5', block: 'Khối Chồi', capacity: 28, currentCount: 23, teacher: 'Cô Tô Thị Yến', assistant: 'Cô Phan Thị Hồng', room: 'Phòng 205', status: 'Đang hoạt động' },
  { id: 'LA1', name: 'Lá 1', block: 'Khối Lá', capacity: 30, currentCount: 29, teacher: 'Cô Hoàng Thị Linh', assistant: 'Cô Dương Thị Thu', room: 'Phòng 301', status: 'Đang hoạt động' },
  { id: 'LA2', name: 'Lá 2', block: 'Khối Lá', capacity: 30, currentCount: 28, teacher: 'Cô Đặng Thu Hương', assistant: 'Cô Cao Thị Lan', room: 'Phòng 302', status: 'Đang hoạt động' },
  { id: 'LA3', name: 'Lá 3', block: 'Khối Lá', capacity: 30, currentCount: 27, teacher: 'Cô Trịnh Thị Nga', assistant: 'Cô Lý Thị Vân', room: 'Phòng 303', status: 'Đang hoạt động' },
  { id: 'LA4', name: 'Lá 4', block: 'Khối Lá', capacity: 30, currentCount: 30, teacher: 'Cô Lê Ngọc Trinh', assistant: 'Cô Hà Thị Kim', room: 'Phòng 304', status: 'Đang hoạt động' },
  { id: 'LA5', name: 'Lá 5', block: 'Khối Lá', capacity: 30, currentCount: 26, teacher: '', assistant: 'Cô Bùi Thị Ngọc', room: 'Phòng 305', status: 'Đang hoạt động' },
];

export const STUDENTS: Student[] = [
  { id: 'HS001', name: 'Nguyễn Minh Anh', dob: '2021-03-15', gender: 'Nam', block: 'Khối Mầm', className: 'Mầm 1', parentName: 'Nguyễn Văn Hùng', parentPhone: '0901 234 567', status: 'Đang học', attendance: 'Có mặt', profileComplete: 100, allergies: [] },
  { id: 'HS002', name: 'Trần Gia Hân', dob: '2021-07-22', gender: 'Nữ', block: 'Khối Mầm', className: 'Mầm 1', parentName: 'Trần Thị Mai', parentPhone: '0912 345 678', status: 'Đang học', attendance: 'Vắng có phép', profileComplete: 100, allergies: ['Hải sản'] },
  { id: 'HS003', name: 'Lê Hoàng Nam', dob: '2020-11-08', gender: 'Nam', block: 'Khối Chồi', className: 'Chồi 1', parentName: 'Lê Văn Bình', parentPhone: '0923 456 789', status: 'Đang học', attendance: 'Có mặt', profileComplete: 85, allergies: ['Đậu phộng'] },
  { id: 'HS004', name: 'Phạm Ngọc Linh', dob: '2021-05-20', gender: 'Nữ', block: 'Khối Mầm', className: 'Mầm 2', parentName: 'Phạm Quốc Anh', parentPhone: '0934 567 890', status: 'Đang học', attendance: 'Đi muộn', profileComplete: 100, allergies: [] },
  { id: 'HS005', name: 'Hoàng Gia Bảo', dob: '2020-09-14', gender: 'Nam', block: 'Khối Chồi', className: 'Chồi 2', parentName: 'Hoàng Văn Minh', parentPhone: '0945 678 901', status: 'Đang học', attendance: 'Có mặt', profileComplete: 70, allergies: [] },
  { id: 'HS006', name: 'Đặng Minh Khôi', dob: '2019-12-03', gender: 'Nam', block: 'Khối Lá', className: 'Lá 1', parentName: 'Đặng Thị Hồng', parentPhone: '0956 789 012', status: 'Đang học', attendance: 'Có mặt', profileComplete: 100, allergies: [] },
  { id: 'HS007', name: 'Vũ Bảo Châu', dob: '2019-04-18', gender: 'Nữ', block: 'Khối Lá', className: 'Lá 1', parentName: 'Vũ Văn Long', parentPhone: '0967 890 123', status: 'Đang học', attendance: 'Có mặt', profileComplete: 100, allergies: ['Sữa'] },
  { id: 'HS008', name: 'Ngô Quốc Khánh', dob: '2020-08-25', gender: 'Nam', block: 'Khối Chồi', className: 'Chồi 3', parentName: 'Ngô Thị Thanh', parentPhone: '0978 901 234', status: 'Đang học', attendance: 'Vắng không phép', profileComplete: 90, allergies: [] },
  { id: 'HS009', name: 'Bùi Khánh Linh', dob: '2021-01-30', gender: 'Nữ', block: 'Khối Mầm', className: 'Mầm 3', parentName: 'Bùi Văn Khoa', parentPhone: '0989 012 345', status: 'Chờ nhập học', attendance: 'Chưa điểm danh', profileComplete: 60, allergies: [] },
  { id: 'HS010', name: 'Đinh Tuấn Khang', dob: '2019-06-12', gender: 'Nam', block: 'Khối Lá', className: 'Lá 2', parentName: 'Đinh Thị Lan', parentPhone: '0990 123 456', status: 'Đang học', attendance: 'Có mặt', profileComplete: 100, allergies: ['Trứng'] },
  { id: 'HS011', name: 'Lý Thị Ngọc Huyền', dob: '2021-02-14', gender: 'Nữ', block: 'Khối Mầm', className: 'Mầm 4', parentName: 'Lý Văn Tài', parentPhone: '0901 234 789', status: 'Đang học', attendance: 'Có mặt', profileComplete: 100, allergies: [] },
  { id: 'HS012', name: 'Trương Minh Tiến', dob: '2020-10-05', gender: 'Nam', block: 'Khối Chồi', className: 'Chồi 1', parentName: 'Trương Văn Nam', parentPhone: '0912 456 789', status: 'Đang học', attendance: 'Có mặt', profileComplete: 45, allergies: [] },
];

export const TEACHERS: Teacher[] = [
  { id: 'GV001', name: 'Nguyễn Thị Lan', role: 'Giáo viên chủ nhiệm', className: 'Mầm 1', phone: '0901 111 222', email: 'lan.nguyen@mamnonhoasen.edu.vn', status: 'Đang làm', joinDate: '2018-08-01' },
  { id: 'GV002', name: 'Trần Ngọc Anh', role: 'Giáo viên chủ nhiệm', className: 'Mầm 2', phone: '0912 222 333', email: 'anh.tran@mamnonhoasen.edu.vn', status: 'Đang làm', joinDate: '2019-08-01' },
  { id: 'GV003', name: 'Lê Thị Hoa', role: 'Giáo viên chủ nhiệm', className: 'Chồi 1', phone: '0923 333 444', email: 'hoa.le@mamnonhoasen.edu.vn', status: 'Đang làm', joinDate: '2017-08-01' },
  { id: 'GV004', name: 'Phạm Thị Mai', role: 'Giáo viên chủ nhiệm', className: 'Chồi 2', phone: '0934 444 555', email: 'mai.pham@mamnonhoasen.edu.vn', status: 'Nghỉ phép', joinDate: '2020-08-01' },
  { id: 'GV005', name: 'Hoàng Thị Linh', role: 'Giáo viên chủ nhiệm', className: 'Lá 1', phone: '0945 555 666', email: 'linh.hoang@mamnonhoasen.edu.vn', status: 'Đang làm', joinDate: '2016-08-01' },
  { id: 'GV006', name: 'Đặng Thu Hương', role: 'Giáo viên chủ nhiệm', className: 'Lá 2', phone: '0956 666 777', email: 'huong.dang@mamnonhoasen.edu.vn', status: 'Đang làm', joinDate: '2021-08-01' },
  { id: 'GV007', name: 'Lê Ngọc Trinh', role: 'Giáo viên chủ nhiệm', className: 'Lá 3', phone: '0967 777 888', email: 'trinh.le@mamnonhoasen.edu.vn', status: 'Đang làm', joinDate: '2022-08-01' },
  { id: 'NV001', name: 'Nguyễn Văn Đức', role: 'Nhân viên', phone: '0978 888 999', email: 'duc.nguyen@mamnonhoasen.edu.vn', status: 'Đang làm', joinDate: '2019-01-15' },
  { id: 'BGH001', name: 'TS. Nguyễn Thị Phương', role: 'Ban giám hiệu', phone: '0979 000 111', email: 'phuong.nguyen@mamnonhoasen.edu.vn', status: 'Đang làm', joinDate: '2015-08-01' },
  { id: 'BGH002', name: 'ThS. Trần Văn Minh', role: 'Ban giám hiệu', phone: '0989 111 222', email: 'minh.tran@mamnonhoasen.edu.vn', status: 'Đang làm', joinDate: '2016-01-01' },
];

export const PARENTS: Parent[] = [
  { id: 'PH001', name: 'Nguyễn Văn Hùng', relationship: 'Bố', phone: '0901 234 567', email: 'hung.nguyen@gmail.com', studentNames: ['Nguyễn Minh Anh'], lastContact: '2024-11-18', accountStatus: 'Hoạt động' },
  { id: 'PH002', name: 'Trần Thị Mai', relationship: 'Mẹ', phone: '0912 345 678', email: 'mai.tran@gmail.com', studentNames: ['Trần Gia Hân'], lastContact: '2024-11-17', accountStatus: 'Hoạt động' },
  { id: 'PH003', name: 'Lê Văn Bình', relationship: 'Bố', phone: '0923 456 789', email: 'binh.le@gmail.com', studentNames: ['Lê Hoàng Nam'], lastContact: '2024-11-15', accountStatus: 'Hoạt động' },
  { id: 'PH004', name: 'Phạm Quốc Anh', relationship: 'Bố', phone: '0934 567 890', email: 'anh.pham@gmail.com', studentNames: ['Phạm Ngọc Linh'], lastContact: '2024-11-18', accountStatus: 'Hoạt động' },
  { id: 'PH005', name: 'Hoàng Văn Minh', relationship: 'Bố', phone: '0945 678 901', email: 'minh.hoang@gmail.com', studentNames: ['Hoàng Gia Bảo'], lastContact: '2024-11-10', accountStatus: 'Hoạt động' },
  { id: 'PH006', name: 'Vũ Văn Long', relationship: 'Bố', phone: '0967 890 123', email: 'long.vu@gmail.com', studentNames: ['Vũ Bảo Châu'], lastContact: '2024-11-18', accountStatus: 'Hoạt động' },
];

export const TRANSACTIONS: Transaction[] = [
  { id: 'HD001', type: 'thu', studentName: 'Nguyễn Minh Anh', category: 'Học phí tháng 11', amount: 2500000, date: '2024-11-01', dueDate: '2024-11-10', status: 'Đã thanh toán' },
  { id: 'HD002', type: 'thu', studentName: 'Trần Gia Hân', category: 'Học phí tháng 11', amount: 2500000, date: '2024-11-01', dueDate: '2024-11-10', status: 'Chờ thanh toán' },
  { id: 'HD003', type: 'thu', studentName: 'Lê Hoàng Nam', category: 'Học phí tháng 11', amount: 2700000, date: '2024-11-01', dueDate: '2024-11-10', status: 'Quá hạn' },
  { id: 'HD004', type: 'thu', studentName: 'Phạm Ngọc Linh', category: 'Tiền ăn tháng 11', amount: 800000, date: '2024-11-01', dueDate: '2024-11-10', status: 'Đã thanh toán' },
  { id: 'HD005', type: 'thu', studentName: 'Hoàng Gia Bảo', category: 'Học phí tháng 11', amount: 2700000, date: '2024-11-01', dueDate: '2024-11-10', status: 'Quá hạn' },
  { id: 'HD006', type: 'thu', studentName: 'Đặng Minh Khôi', category: 'Học phí tháng 11', amount: 2900000, date: '2024-11-01', dueDate: '2024-11-10', status: 'Đã thanh toán' },
  { id: 'HD007', type: 'chi', category: 'Lương nhân sự tháng 11', amount: 45000000, date: '2024-11-25', status: 'Đã thanh toán' },
  { id: 'HD008', type: 'chi', category: 'Chi phí thực phẩm', amount: 12000000, date: '2024-11-15', status: 'Đã thanh toán' },
  { id: 'HD009', type: 'chi', category: 'Điện nước tháng 11', amount: 3500000, date: '2024-11-20', status: 'Chờ thanh toán' },
  { id: 'HD010', type: 'chi', category: 'Đồ dùng học tập', amount: 2100000, date: '2024-11-10', status: 'Đã thanh toán' },
];

export const ANNOUNCEMENTS: Announcement[] = [
  { id: 'TB001', title: 'Thông báo nghỉ Tết Dương lịch 2025', content: 'Kính gửi Quý phụ huynh, Nhà trường thông báo lịch nghỉ Tết Dương lịch từ ngày 1/1/2025. Học sinh nghỉ học từ ngày 31/12/2024 đến hết ngày 1/1/2025, trở lại học ngày 2/1/2025.', author: 'TS. Nguyễn Thị Phương', date: '2024-11-18', type: 'Thông báo nghỉ', audience: 'Toàn trường', readCount: 287, totalRecipients: 320, pinned: true },
  { id: 'TB002', title: 'Họp phụ huynh cuối học kỳ I năm học 2024-2025', content: 'Kính mời Quý phụ huynh tham dự buổi họp phụ huynh cuối học kỳ I. Thời gian: Thứ Bảy, ngày 30/11/2024 lúc 8:00 sáng tại hội trường nhà trường.', author: 'ThS. Trần Văn Minh', date: '2024-11-15', type: 'Thông báo họp', audience: 'Toàn trường', readCount: 195, totalRecipients: 320, pinned: false },
  { id: 'TB003', title: 'Thông báo khẩn: Phòng chống dịch bệnh mùa đông', content: 'Nhà trường thông báo các biện pháp phòng chống dịch bệnh trong mùa đông. Phụ huynh cần theo dõi sức khỏe con em và thông báo ngay khi trẻ có biểu hiện bệnh.', author: 'TS. Nguyễn Thị Phương', date: '2024-11-12', type: 'Khẩn cấp', audience: 'Toàn trường', readCount: 310, totalRecipients: 320, pinned: false },
  { id: 'TB004', title: 'Kế hoạch hoạt động tháng 12 - Khối Lá', content: 'Kính gửi phụ huynh học sinh Khối Lá, nhà trường thông báo kế hoạch hoạt động tháng 12 bao gồm các chương trình văn nghệ, tổng kết cuối năm và các hoạt động ngoại khóa.', author: 'Cô Hoàng Thị Linh', date: '2024-11-10', type: 'Thông báo chung', audience: 'Khối Lá', readCount: 89, totalRecipients: 140, pinned: false },
];

export const EVENTS: Event[] = [
  { id: 'SK001', title: 'Ngày hội "Bé với thiên nhiên"', date: '2024-11-25', time: '07:30 - 11:00', location: 'Sân trường', type: 'Hoạt động ngoài trời', participants: 420, status: 'Sắp diễn ra' },
  { id: 'SK002', title: 'Họp phụ huynh cuối học kỳ I', date: '2024-11-30', time: '08:00 - 10:30', location: 'Hội trường', type: 'Họp phụ huynh', participants: 280, status: 'Sắp diễn ra' },
  { id: 'SK004', title: 'Hội thi "Bé khéo tay"', date: '2024-12-05', time: '08:00 - 11:00', location: 'Hội trường', type: 'Hoạt động học tập', participants: 200, status: 'Sắp diễn ra' },
];

export const MESSAGES: Message[] = [
  { id: 'M001', from: 'Nguyễn Văn Hùng', role: 'Phụ huynh', preview: 'Thưa cô, hôm nay bé Minh Anh bị sốt nhẹ, gia đình xin phép...', time: '08:35', unread: 1, avatar: 'NH' },
  { id: 'M002', from: 'Cô Nguyễn Thị Lan', role: 'GVCN Mầm 1', preview: 'Kính gửi Ban giám hiệu, lớp Mầm 1 hôm nay có 3 bé vắng...', time: '07:52', unread: 0, avatar: 'NL' },
  { id: 'M003', from: 'Trần Thị Mai', role: 'Phụ huynh', preview: 'Chào cô, gia đình em xin đơn xin nghỉ phép cho bé Gia Hân...', time: 'Hôm qua', unread: 2, avatar: 'TM' },
  { id: 'M004', from: 'Cô Hoàng Thị Linh', role: 'GVCN Lá 1', preview: 'Ban giám hiệu ơi, lớp Lá 1 cần bổ sung thêm đồ dùng học tập...', time: 'Hôm qua', unread: 0, avatar: 'HL' },
  { id: 'M005', from: 'Lê Văn Bình', role: 'Phụ huynh', preview: 'Dạ cô ơi, cho em hỏi lịch nghỉ lễ tháng 12 ạ?', time: '17/11', unread: 0, avatar: 'LB' },
];

export const NOTIFICATIONS: Notification[] = [
  { id: 'N001', title: 'Có yêu cầu nghỉ học mới', sub: 'Nguyễn Văn Hùng • Nguyễn Minh Anh • Mầm 1', time: '08:35', read: false },
  { id: 'N002', title: 'Giáo viên đã hoàn thành đánh giá', sub: 'Cô Nguyễn Thị Lan • Mầm 1', time: '07:52', read: false },
  { id: 'N003', title: 'Có khoản thu quá hạn cần xử lý', sub: '2 hóa đơn học phí tháng 11', time: 'Hôm qua', read: true },
  { id: 'N004', title: 'Cảnh báo hồ sơ sức khỏe', sub: 'Trần Gia Hân • dị ứng hải sản', time: 'Hôm qua', read: true },
  { id: 'N005', title: 'Lịch hoạt động mới được tạo', sub: 'Ngày hội Bé với thiên nhiên • Toàn trường', time: '17/11', read: true },
];

export const CHAT_MESSAGES: ChatMessage[] = [
  { id: 'CM001', sender: 'Nguyễn Văn Hùng', content: 'Thưa cô, hôm nay bé Minh Anh bị sốt nhẹ (37.5°C) từ tối qua. Gia đình muốn xin phép cho bé nghỉ học hôm nay ạ.', time: '08:35', isMe: false },
  { id: 'CM002', sender: 'Admin', content: 'Dạ, nhà trường đã ghi nhận. Phụ huynh yên tâm. Bé Minh Anh sẽ được nghỉ phép hôm nay. Chúc bé mau khỏe ạ!', time: '08:38', isMe: true },
  { id: 'CM003', sender: 'Nguyễn Văn Hùng', content: 'Cảm ơn cô nhiều ạ. Nếu bé khỏe, tuần sau bé sẽ đi học lại ạ.', time: '08:40', isMe: false },
  { id: 'CM004', sender: 'Admin', content: 'Vâng ạ. Phụ huynh nhớ mang theo giấy xác nhận của bác sĩ (nếu có) khi bé quay lại nhé.', time: '08:41', isMe: true },
];

export const MONTHLY_REVENUE = [
  { month: 'T6', thu: 285, chi: 195 },
  { month: 'T7', thu: 290, chi: 188 },
  { month: 'T8', thu: 278, chi: 201 },
  { month: 'T9', thu: 312, chi: 195 },
  { month: 'T10', thu: 305, chi: 210 },
  { month: 'T11', thu: 320, chi: 198 },
];

export const ATTENDANCE_TREND = [
  { day: 'T2', rate: 94 },
  { day: 'T3', rate: 92 },
  { day: 'T4', rate: 96 },
  { day: 'T5', rate: 91 },
  { day: 'T6', rate: 88 },
  { day: 'T2', rate: 95 },
  { day: 'T3', rate: 93 },
];

export const DEVELOPMENT_CRITERIA = [
  { subject: 'Phát triển thể chất', A: 85, fullMark: 100 },
  { subject: 'Nhận thức', A: 78, fullMark: 100 },
  { subject: 'Ngôn ngữ', A: 92, fullMark: 100 },
  { subject: 'Tình cảm xã hội', A: 88, fullMark: 100 },
  { subject: 'Vận động', A: 82, fullMark: 100 },
  { subject: 'Tự phục vụ', A: 75, fullMark: 100 },
];

export const SCHEDULE_EVENTS: ScheduleEvent[] = [
  { id: 'LH001', title: 'Hoạt động học tập', className: 'Mầm 1', teacher: 'Cô Nguyễn Thị Lan', room: 'Phòng 101', day: 1, startHour: 8, duration: 1, type: 'Học tập' },
  { id: 'LH002', title: 'Bữa ăn sáng', className: 'Mầm 1', teacher: 'Cô Nguyễn Thị Lan', room: 'Phòng ăn', day: 1, startHour: 9, duration: 1, type: 'Ăn' },
  { id: 'LH003', title: 'Hoạt động ngoài trời', className: 'Mầm 1', teacher: 'Cô Nguyễn Thị Lan', room: 'Sân trường', day: 1, startHour: 10, duration: 1, type: 'Hoạt động ngoài trời', conflict: false },
  { id: 'LH004', title: 'Giờ ngủ trưa', className: 'Mầm 1', teacher: 'Cô Nguyễn Thị Lan', room: 'Phòng 101', day: 1, startHour: 11.5, duration: 1.5, type: 'Ngủ' },
  { id: 'LH005', title: 'Hoạt động học tập', className: 'Chồi 1', teacher: 'Cô Lê Thị Hoa', room: 'Phòng 201', day: 1, startHour: 8, duration: 1.5, type: 'Học tập' },
  { id: 'LH006', title: 'Hoạt động ngoài trời', className: 'Chồi 1', teacher: 'Cô Lê Thị Hoa', room: 'Sân trường', day: 1, startHour: 10, duration: 1, type: 'Hoạt động ngoài trời', conflict: true, conflictMessage: 'Sân trường có 5 lớp cùng sử dụng lúc 10:00. Sức chứa có thể vượt giới hạn.' },
  { id: 'LH007', title: 'Hoạt động học tập', className: 'Lá 1', teacher: 'Cô Hoàng Thị Linh', room: 'Phòng 301', day: 1, startHour: 8, duration: 2, type: 'Học tập' },
];

export const TASK_ITEMS = [
  { id: 1, type: 'error', message: '3 học sinh chưa hoàn tất hồ sơ nhập học', link: 'hoc-sinh', count: 3 },
  { id: 2, type: 'warning', message: '1 lớp thiếu giáo viên chủ nhiệm (Lá 5)', link: 'lop', count: 1 },
  { id: 3, type: 'warning', message: '5 đơn xin nghỉ đang chờ duyệt', link: 'diem-danh', count: 5 },
  { id: 4, type: 'error', message: '4 hóa đơn quá hạn cần thu', link: 'thu-chi', count: 4 },
  { id: 5, type: 'warning', message: '1 xung đột lịch hoạt động ngoài trời', link: 'lich-hoc', count: 1 },
  { id: 6, type: 'info', message: '7 phụ huynh chưa đọc thông báo nghỉ lễ', link: 'tin-tuc', count: 7 },
];
