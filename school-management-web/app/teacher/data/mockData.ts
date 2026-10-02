// ─── Mock Data for Teacher Dashboard ─────────────────────────────────────────

export const CLASS_INFO = {
  name: 'Lớp Hoa Hướng Dương',
  room: 'Phòng B3',
  ageGroup: '3–4 tuổi',
  teachers: [
    { id: 1, name: 'Nguyễn Thị Lan', role: 'Giáo viên chủ nhiệm', avatar: 'NL', color: '#f97316' },
    { id: 2, name: 'Trần Thị Mai',   role: 'Giáo viên hỗ trợ',   avatar: 'TM', color: '#ec4899' },
  ],
  currentTeacher: 1,
};

export type Child = {
  id: number; name: string; nickname: string;
  dob: string; gender: 'M' | 'F';
  avatar: string; parentName: string; parentPhone: string; notes: string;
};

export const CHILDREN: Child[] = [
  { id:1,  name:'Nguyễn Minh Anh',     nickname:'Anh',    dob:'2022-03-15', gender:'F', avatar:'MA', parentName:'Nguyễn Thị Hoa',  parentPhone:'0901234567', notes:'' },
  { id:2,  name:'Trần Bảo Long',        nickname:'Long',   dob:'2022-01-20', gender:'M', avatar:'BL', parentName:'Trần Văn Nam',     parentPhone:'0902345678', notes:'Dị ứng hải sản' },
  { id:3,  name:'Lê Thị Bích Ngọc',    nickname:'Ngọc',   dob:'2022-05-10', gender:'F', avatar:'BN', parentName:'Lê Văn Hùng',     parentPhone:'0903456789', notes:'' },
  { id:4,  name:'Phạm Hoài Nam',        nickname:'Nam',    dob:'2022-02-28', gender:'M', avatar:'HN', parentName:'Phạm Thị Liên',   parentPhone:'0904567890', notes:'' },
  { id:5,  name:'Vũ Khánh Linh',        nickname:'Linh',   dob:'2022-04-05', gender:'F', avatar:'KL', parentName:'Vũ Văn Tuấn',    parentPhone:'0905678901', notes:'Hen suyễn nhẹ' },
  { id:6,  name:'Hoàng Đức Thịnh',      nickname:'Thịnh',  dob:'2022-06-12', gender:'M', avatar:'DT', parentName:'Hoàng Thị Nga',   parentPhone:'0906789012', notes:'' },
  { id:7,  name:'Đặng Thị Thu Hà',      nickname:'Hà',     dob:'2022-03-30', gender:'F', avatar:'TH', parentName:'Đặng Văn Bình',   parentPhone:'0907890123', notes:'' },
  { id:8,  name:'Bùi Minh Tuấn',        nickname:'Tuấn',   dob:'2022-07-08', gender:'M', avatar:'MT', parentName:'Bùi Thị Lan',     parentPhone:'0908901234', notes:'' },
  { id:9,  name:'Ngô Thị Mỹ Duyên',    nickname:'Duyên',  dob:'2022-01-15', gender:'F', avatar:'MD', parentName:'Ngô Văn Phúc',    parentPhone:'0909012345', notes:'' },
  { id:10, name:'Đinh Quốc Bảo',        nickname:'Bảo',    dob:'2022-08-20', gender:'M', avatar:'QB', parentName:'Đinh Thị Kim',    parentPhone:'0910123456', notes:'' },
  { id:11, name:'Lý Thị Phương Anh',   nickname:'P.Anh',  dob:'2022-02-14', gender:'F', avatar:'PA', parentName:'Lý Văn Đức',     parentPhone:'0911234567', notes:'' },
  { id:12, name:'Trương Gia Huy',        nickname:'Huy',    dob:'2022-09-03', gender:'M', avatar:'GH', parentName:'Trương Thị Yến',  parentPhone:'0912345678', notes:'Lactose' },
  { id:13, name:'Võ Thị Thanh Trúc',   nickname:'Trúc',   dob:'2022-04-22', gender:'F', avatar:'TT', parentName:'Võ Văn Tài',     parentPhone:'0913456789', notes:'' },
  { id:14, name:'Dương Nhật Khoa',      nickname:'Khoa',   dob:'2022-10-11', gender:'M', avatar:'NK', parentName:'Dương Thị Thu',   parentPhone:'0914567890', notes:'' },
  { id:15, name:'Mai Thị Cẩm Tú',       nickname:'Tú',     dob:'2022-05-28', gender:'F', avatar:'CT', parentName:'Mai Văn Hải',     parentPhone:'0915678901', notes:'' },
  { id:16, name:'Phan Quang Vinh',      nickname:'Vinh',   dob:'2022-11-07', gender:'M', avatar:'QV', parentName:'Phan Thị Loan',   parentPhone:'0916789012', notes:'' },
  { id:17, name:'Tô Thị Ngọc Hân',     nickname:'Hân',    dob:'2022-06-15', gender:'F', avatar:'NH', parentName:'Tô Văn Khải',    parentPhone:'0917890123', notes:'' },
  { id:18, name:'Châu Minh Khải',       nickname:'Khải',   dob:'2022-12-01', gender:'M', avatar:'MK', parentName:'Châu Thị Bảo',   parentPhone:'0918901234', notes:'' },
  { id:19, name:'Lưu Thị Diệu Ly',     nickname:'Ly',     dob:'2022-07-19', gender:'F', avatar:'DL', parentName:'Lưu Văn Sơn',    parentPhone:'0919012345', notes:'' },
  { id:20, name:'Tạ Đức Thành',         nickname:'Thành',  dob:'2022-08-25', gender:'M', avatar:'DT2',parentName:'Tạ Thị Hương',   parentPhone:'0920123456', notes:'' },
  { id:21, name:'Cao Thị Hải Yến',      nickname:'Yến',    dob:'2022-03-08', gender:'F', avatar:'HY', parentName:'Cao Văn Minh',    parentPhone:'0921234567', notes:'' },
  { id:22, name:'Lâm Gia Bảo',          nickname:'G.Bảo',  dob:'2022-09-14', gender:'M', avatar:'GB', parentName:'Lâm Thị Trang',   parentPhone:'0922345678', notes:'' },
];

export const HEALTH_METRICS = [
  { id:'weight', label:'Cân nặng', unit:'kg',  icon:'⚖️' },
  { id:'height', label:'Chiều cao',unit:'cm',  icon:'📏' },
  { id:'head',   label:'Vòng đầu', unit:'cm',  icon:'🔵' },
  { id:'chest',  label:'Vòng ngực',unit:'cm',  icon:'💗' },
];

export const ASSESSMENT_CRITERIA = [
  { category:'Thể chất',        icon:'🏃', color:'#f97316',
    items:[{id:'run',label:'Chạy, nhảy, leo trèo'},{id:'balance',label:'Giữ thăng bằng'},{id:'finemotor',label:'Vận động tinh (tô màu, xếp hình)'},{id:'selfcare',label:'Tự chăm sóc bản thân'}] },
  { category:'Nhận thức',        icon:'🧠', color:'#3b82f6',
    items:[{id:'counting',label:'Đếm số, nhận biết chữ số'},{id:'shape',label:'Nhận biết hình dạng, màu sắc'},{id:'memory',label:'Trí nhớ, tập trung'},{id:'creative',label:'Tư duy sáng tạo'},{id:'puzzle',label:'Giải quyết vấn đề đơn giản'}] },
  { category:'Ngôn ngữ',         icon:'💬', color:'#a855f7',
    items:[{id:'speak',label:'Phát âm rõ ràng'},{id:'vocab',label:'Vốn từ vựng'},{id:'story',label:'Kể chuyện, diễn đạt'},{id:'listen',label:'Lắng nghe và hiểu lời'},{id:'sing',label:'Hát, đọc thơ'}] },
  { category:'Tình cảm – Xã hội',icon:'🤝', color:'#ec4899',
    items:[{id:'share',label:'Chia sẻ, nhường bạn'},{id:'cooperate',label:'Hợp tác trong nhóm'},{id:'emotion',label:'Kiểm soát cảm xúc'},{id:'respect',label:'Tôn trọng người lớn'},{id:'friend',label:'Kết bạn, hòa đồng'}] },
  { category:'Thẩm mỹ',          icon:'🎨', color:'#22c55e',
    items:[{id:'draw',label:'Vẽ, tô màu'},{id:'craft',label:'Thủ công, cắt dán'},{id:'music',label:'Cảm thụ âm nhạc'},{id:'dance',label:'Vũ đạo, thể dục nhịp điệu'}] },
];

export const BADGE_TYPES = [
  { emoji:'🌹', label:'Bé ngoan',     desc:'Ngoan ngoãn, lễ phép' },
  { emoji:'⭐', label:'Bé xuất sắc',  desc:'Học tốt, tiến bộ vượt bậc' },
  { emoji:'🏆', label:'Bé tài năng',  desc:'Có năng khiếu đặc biệt' },
  { emoji:'💪', label:'Bé dũng cảm',  desc:'Khắc phục khó khăn' },
  { emoji:'🎨', label:'Bé sáng tạo',  desc:'Tư duy sáng tạo tốt' },
  { emoji:'🤝', label:'Bé đoàn kết',  desc:'Biết chia sẻ, giúp bạn' },
];

export const DEFAULT_BADGES: Record<number, string[]> = {
  1:[' 🌹','⭐'], 2:['⭐'], 3:['🌹'], 6:['💪'], 10:['🏆','🌹','⭐'], 13:['🎨'],
};

export const MESSAGES_DATA = [
  { id:1, childId:2,  parentName:'Anh Nam (ba Long)',  time:'08:15', message:'Cô ơi, hôm nay bé Long có chút sổ mũi, cô chú ý giúp con với ạ', read:false },
  { id:2, childId:5,  parentName:'Anh Tuấn (ba Linh)', time:'07:50', message:'Cô ơi hôm nay bé Linh mang theo thuốc xịt hen, cô để ở ba lô bé giúp em', read:false },
  { id:3, childId:1,  parentName:'Chị Hoa (mẹ Anh)',   time:'Hôm qua',message:'Cảm ơn cô đã chăm sóc bé Anh chu đáo ạ 🙏', read:true },
  { id:4, childId:10, parentName:'Chị Kim (mẹ Bảo)',   time:'Hôm qua',message:'Cô ơi bé Bảo về có kể hôm nay được khen, vui lắm ạ ❤️', read:true },
];

export const PHOTO_ALBUMS = [
  { id:1, title:'Hoạt động ngoài trời', date:'15/09/2026', photos:12, cover:'outdoor', tags:['vận động','ngoài trời'] },
  { id:2, title:'Tiết học tạo hình',    date:'12/09/2026', photos:8,  cover:'art',     tags:['sáng tạo','nghệ thuật'] },
  { id:3, title:'Lễ sinh nhật tháng 9', date:'10/09/2026', photos:15, cover:'birthday',tags:['sinh nhật','lễ hội'] },
  { id:4, title:'Giờ ăn trưa',          date:'08/09/2026', photos:6,  cover:'lunch',   tags:['dinh dưỡng'] },
];

export const UNSPLASH: Record<string,string> = {
  outdoor: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=250&fit=crop&auto=format',
  art:     'https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?w=400&h=250&fit=crop&auto=format',
  birthday:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop&auto=format',
  lunch:   'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=250&fit=crop&auto=format',
};

export const SCHEDULE_TODAY = [
  { time:'07:00', activity:'Đón trẻ, điểm danh',          icon:'👋', done:true  },
  { time:'07:30', activity:'Thể dục buổi sáng',            icon:'🤸', done:true  },
  { time:'08:00', activity:'Ăn sáng',                       icon:'🍚', done:true  },
  { time:'08:30', activity:'Hoạt động học tập: Toán',      icon:'🔢', done:false, current:true },
  { time:'09:15', activity:'Hoạt động ngoài trời',         icon:'⛅', done:false },
  { time:'10:00', activity:'Hoạt động góc',                 icon:'🎮', done:false },
  { time:'11:00', activity:'Ăn trưa',                       icon:'🍱', done:false },
  { time:'11:30', activity:'Vệ sinh, ngủ trưa',            icon:'😴', done:false },
  { time:'14:00', activity:'Ăn xế',                         icon:'🍎', done:false },
  { time:'14:30', activity:'Hoạt động chiều',               icon:'🎨', done:false },
  { time:'17:00', activity:'Trả trẻ',                       icon:'🏠', done:false },
];
