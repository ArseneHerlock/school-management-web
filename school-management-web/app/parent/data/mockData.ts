import { ParentProfile, ChildInfo, AttendanceDay, AbsenceRequest, MomentItem, NewsItem, ChatMessage, TuitionItem, TuitionPaymentHistory } from '../types';

export const INITIAL_PARENT: ParentProfile = {
  id: 'ph-9981',
  hoTen: 'Nguyễn Thị Lan',
  soDienThoai: '0987 654 321',
  email: 'lan.nguyen@example.com',
  diaChi: '123 Đường Nguyễn Văn Cừ, Phường 4, Quận 5, TP. Hồ Chí Minh',
  moiQuanHe: 'Mẹ',
  ngheNghiep: 'Kế toán trưởng',
  noiLamViec: 'Công ty Cổ phần Công nghệ & Giải pháp Sao Mai',
  cccd: '079195001234',
  ngaySinh: '1992-08-15',
  gioiTinh: 'Nữ',
};

export const ACTIVE_CHILD: ChildInfo = {
  id: 'hs-2021089',
  hoTen: 'Nguyễn Bảo Minh',
  lop: 'Lớp Chồi 2',
  khoi: 'Khối Mầm',
  giaoVienChuNhiem: 'Cô Nguyễn Thị Lan',
  sdtGiaoVien: '0982 123 456',
  avatar: '👦',
  ngaySinh: '12/05/2021',
  gioiTinh: 'Nam',
  maHocSinh: 'OKD-2021-089',
};

export const WEEKLY_ATTENDANCE: AttendanceDay[] = [
  { dayOfWeek: 'Thứ 2', status: 'present', label: 'Có mặt', symbol: '✓' },
  { dayOfWeek: 'Thứ 3', status: 'present', label: 'Có mặt', symbol: '✓' },
  { dayOfWeek: 'Thứ 4', status: 'leave', label: 'Nghỉ phép', symbol: 'P' },
  { dayOfWeek: 'Thứ 5', status: 'present', label: 'Có mặt', symbol: '✓' },
  { dayOfWeek: 'Hôm nay', status: 'ongoing', label: 'Đang học', symbol: '✓' },
];

export const TIMELINE_TODAY = [
  { time: '07:30 - 08:00', title: 'Đón trẻ & Sinh hoạt thể dục sáng', status: 'done', statusLabel: 'Đã xong' },
  { time: '08:00 - 09:00', title: 'Làm quen chữ cái & Ngôn ngữ', status: 'done', statusLabel: 'Đã xong' },
  { time: '09:00 - 10:30', title: 'Toán tư duy & Hoạt động tạo hình', status: 'current', statusLabel: 'Đang diễn ra' },
  { time: '10:30 - 11:30', title: 'Vệ sinh & Bữa ăn trưa dinh dưỡng', status: 'upcoming', statusLabel: 'Sắp tới' },
  { time: '11:30 - 14:00', title: 'Ngủ trưa phục hồi thể lực', status: 'upcoming', statusLabel: 'Sắp tới' },
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'teacher',
    senderName: 'Cô Nguyễn Thị Lan',
    text: 'Bé Minh hôm nay ăn rất ngoan, uống hết 200ml sữa và ngủ trưa tròn 1.5 tiếng. Buổi chiều bé tham gia hoạt động vẽ tranh sắc màu rất tích cực 🎨',
    time: '08:32',
    avatarText: 'NL',
  },
  {
    id: 'msg-2',
    sender: 'parent',
    senderName: 'Mẹ bé Bảo Minh',
    text: 'Dạ cảm ơn cô nhiều ạ! Chiều nay tầm 16h45 ba bé sẽ ghé đón, nhờ cô nhắc bé chuẩn bị balo sẵn giúp gia đình nhé.',
    time: '09:10',
    avatarText: 'PH',
  },
  {
    id: 'msg-3',
    sender: 'teacher',
    senderName: 'Cô Nguyễn Thị Lan',
    text: 'Dạ vâng ba mẹ yên tâm ạ, cô sẽ thông báo cho bé trước. Nếu phụ huynh có việc gấp muốn trao đổi nhanh thì bấm nút "Gọi điện cho cô giáo" ở phía trên nhé!',
    time: '09:15',
    avatarText: 'NL',
  },
];

export const INITIAL_ABSENCES: AbsenceRequest[] = [
  {
    id: 'abs-1',
    reasonCategory: 'sick',
    reasonTitle: 'Bé bị sốt nhẹ mọc răng',
    fromDate: '2026-09-24',
    toDate: '2026-09-24',
    note: 'Bé bị sốt nhẹ do mọc răng hàm, gia đình xin phép cho bé nghỉ ngơi theo dõi.',
    status: 'approved',
    createdAt: '24/09/2026',
  },
  {
    id: 'abs-2',
    reasonCategory: 'family',
    reasonTitle: 'Việc gia đình về quê ngoại',
    fromDate: '2026-08-14',
    toDate: '2026-08-15',
    note: 'Gia đình có việc hiếu hỷ ở quê Tiền Giang nên xin phép cô cho bé nghỉ 2 ngày.',
    status: 'approved',
    createdAt: '14/08/2026',
  },
];

export const INITIAL_MOMENTS: MomentItem[] = [
  {
    id: 'm-1',
    title: 'Bé Minh say sưa giờ học vẽ tranh sáng tạo',
    imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&auto=format&fit=crop',
    category: 'child',
    categoryLabel: '👦 Của con (Bảo Minh)',
    date: 'Hôm nay · 25/09',
    likes: 18,
    liked: true,
  },
  {
    id: 'm-2',
    title: 'Tập thể dục sáng ngoài sân trường cả lớp Chồi 2',
    imageUrl: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&auto=format&fit=crop',
    category: 'class',
    categoryLabel: '🏫 Tập thể lớp',
    date: '24/09/2026',
    likes: 24,
    liked: false,
  },
  {
    id: 'm-3',
    title: 'Bé Minh tự xúc ăn trưa hết suất ngoan',
    imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&auto=format&fit=crop',
    category: 'child',
    categoryLabel: '👦 Của con (Bảo Minh)',
    date: '23/09/2026',
    likes: 15,
    liked: false,
  },
  {
    id: 'm-4',
    title: 'Bé vui chơi ngoài trời cùng các bạn',
    imageUrl: 'https://images.unsplash.com/photo-1551966775-a4ddc8df052b?w=800&auto=format&fit=crop',
    category: 'child',
    categoryLabel: '👦 Của con (Bảo Minh)',
    date: '22/09/2026',
    likes: 21,
    liked: true,
  },
  {
    id: 'm-5',
    title: 'Hoạt động nhóm khám phá khoa học thực vật',
    imageUrl: 'https://images.unsplash.com/photo-1526634332515-d56c5fd16991?w=800&auto=format&fit=crop',
    category: 'class',
    categoryLabel: '🏫 Tập thể lớp',
    date: '20/09/2026',
    likes: 19,
    liked: false,
  },
  {
    id: 'm-6',
    title: 'Giờ âm nhạc: Bé học hát cùng cô và nhạc cụ gõ',
    imageUrl: 'https://images.unsplash.com/photo-1546961342-ea5f62d5a27b?w=800&auto=format&fit=crop',
    category: 'child',
    categoryLabel: '👦 Của con (Bảo Minh)',
    date: '18/09/2026',
    likes: 17,
    liked: true,
  },
  {
    id: 'm-7',
    title: 'Tiệc sinh nhật tháng 9 ấm cúng tập thể lớp Chồi 2',
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop',
    category: 'class',
    categoryLabel: '🏫 Tập thể lớp',
    date: '16/09/2026',
    likes: 32,
    liked: false,
  },
  {
    id: 'm-8',
    title: 'Bé say mê lắp ráp lego phát triển tư duy logic',
    imageUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop',
    category: 'child',
    categoryLabel: '👦 Của con (Bảo Minh)',
    date: '15/09/2026',
    likes: 20,
    liked: false,
  },
];

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 1,
    title: 'Thông báo lịch nghỉ Lễ Quốc khánh 2/9',
    category: 'Thông báo chung',
    date: '15/09/2026',
    summary: 'Ban Giám Hiệu nhà trường xin thông báo kế hoạch nghỉ lễ...',
    content: 'Nhà trường thông báo đến toàn thể Quý phụ huynh lịch nghỉ lễ Quốc khánh 2/9 từ ngày 01/09/2026 đến hết ngày 03/09/2026. Các bé sẽ quay trở lại trường học tập bình thường vào sáng Thứ Hai ngày 04/09/2026. Chúc các gia đình có kỳ nghỉ lễ an toàn và vui vẻ!',
    icon: '📢',
    badge: 'Quan trọng',
    isImportant: true,
  },
  {
    id: 2,
    title: 'Ngày Hội Trung Thu 2026: Vầng Trăng Yêu Thương',
    category: 'Sự kiện lễ hội',
    date: '12/09/2026',
    summary: 'Mời Quý phụ huynh cùng tham gia phá cỗ và rước đèn cùng các bé...',
    content: 'Kính mời Quý phụ huynh bớt chút thời gian đến tham dự đêm hội Trăng Rằm cùng các bé vào lúc 17h30 ngày 28/09/2026 tại sân trường. Chương trình bao gồm: Rước đèn ông sao, xem múa lân sư rồng, tiệc buffet bánh kẹo và trao quà khuyến học cho các bé chăm ngoan.',
    icon: '🏮',
  },
  {
    id: 3,
    title: 'Thực đơn dinh dưỡng tuần 38 (Từ 22/09 - 26/09)',
    category: 'Dinh dưỡng học đường',
    date: '09/09/2026',
    summary: 'Cập nhật thực đơn chuẩn hữu cơ bổ sung vitamin và canxi...',
    content: 'Thực đơn tuần này được Trung tâm Dinh dưỡng phê duyệt với các món chính: Canh sườn bí đỏ, thịt bò xào rau củ ngũ sắc, cá phi lê sốt cà chua, sữa hạt óc chó và tráng miệng chuối laba, dưa hấu thanh mát. Đảm bảo đầy đủ calo và vi chất phát triển cho các bé.',
    icon: '🥗',
  },
];

export const TUITION_ITEMS: TuitionItem[] = [
  { name: 'Học phí bán trú chính khóa', amount: 3200000 },
  { name: 'Tiền ăn dinh dưỡng (Bữa sáng + trưa + xế)', amount: 850000 },
  { name: 'Phí hoạt động ngoại khóa & Kỹ năng sống', amount: 350000 },
];

export const TUITION_HISTORY: TuitionPaymentHistory[] = [
  { id: 'h-1', period: 'Học phí Tháng 09/2026', date: '02/09/2026', method: 'Chuyển khoản VNPay', amount: 4200000, status: 'paid' },
  { id: 'h-2', period: 'Học phí Tháng 08/2026', date: '01/08/2026', method: 'Ví MoMo', amount: 4200000, status: 'paid' },
  { id: 'h-3', period: 'Học phí Tháng 07/2026', date: '03/07/2026', method: 'Ngân hàng BIDV', amount: 4200000, status: 'paid' },
];
