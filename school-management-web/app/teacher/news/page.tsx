'use client';
import { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
type NewsCategory = 'announcement' | 'event' | 'academic' | 'health' | 'activity';

type NewsArticle = {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: NewsCategory;
  author: string;
  authorRole: string;
  date: string; // YYYY-MM-DD
  pinned: boolean;
  readBy: string[]; // teacher IDs who read it
  attachments: string[];
  forTeacher: boolean; // if true = only teachers see it; false = parents too
};

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORY_META: Record<NewsCategory, { label: string; icon: string; color: string; bg: string }> = {
  announcement: { label: 'Thông báo',    icon: '📢', color: 'text-orange-700', bg: 'bg-orange-100' },
  event:        { label: 'Sự kiện',       icon: '🎉', color: 'text-purple-700', bg: 'bg-purple-100' },
  academic:     { label: 'Học vụ',        icon: '📚', color: 'text-blue-700',   bg: 'bg-blue-100'   },
  health:       { label: 'Sức khỏe',      icon: '🏥', color: 'text-green-700',  bg: 'bg-green-100'  },
  activity:     { label: 'Hoạt động',     icon: '⛅', color: 'text-teal-700',   bg: 'bg-teal-100'   },
};

const CURRENT_TEACHER_ID = 'T001';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_NEWS: NewsArticle[] = [
  {
    id: 'n1',
    title: 'Lịch nghỉ lễ Quốc khánh 2/9 và điều chỉnh thời khóa biểu',
    summary: 'Nhà trường thông báo lịch nghỉ lễ 2/9 và bố trí dạy bù cho các lớp.',
    content: `Kính gửi quý thầy cô,\n\nNhà trường xin thông báo:\n\n• Trường nghỉ lễ từ thứ Hai 2/9 đến hết thứ Tư 4/9.\n• Thứ Năm 5/9 học bình thường, tiết bù sẽ được sắp xếp vào thứ Bảy 7/9.\n• Giáo viên chủ nhiệm thông báo lại cho phụ huynh trước 30/8.\n\nTrân trọng,\nBan Giám hiệu`,
    category: 'announcement',
    author: 'BGH Nhà trường',
    authorRole: 'Ban Giám hiệu',
    date: '2026-09-20',
    pinned: true,
    readBy: [],
    attachments: ['Lich_nghi_le_2-9.pdf'],
    forTeacher: false,
  },
  {
    id: 'n2',
    title: 'Họp hội đồng sư phạm tháng 9 — Thứ Sáu 26/9 lúc 16:30',
    summary: 'Toàn thể giáo viên tham dự họp hội đồng tháng 9, địa điểm phòng họp tầng 2.',
    content: `Kính gửi quý thầy cô,\n\nNhà trường triệu tập họp hội đồng sư phạm tháng 9:\n\n📅 Thời gian: 16:30 thứ Sáu, 26/09/2026\n📍 Địa điểm: Phòng họp tầng 2\n\nNội dung:\n1. Tổng kết công tác tháng 9\n2. Triển khai kế hoạch tháng 10\n3. Kết quả kiểm tra định kỳ\n4. Công tác chăm sóc sức khỏe học sinh\n\nĐề nghị toàn thể giáo viên tham dự đầy đủ, đúng giờ.\n\nTrân trọng,\nHiệu trưởng`,
    category: 'announcement',
    author: 'Hiệu trưởng Lan',
    authorRole: 'Hiệu trưởng',
    date: '2026-09-22',
    pinned: true,
    readBy: [CURRENT_TEACHER_ID],
    attachments: [],
    forTeacher: true,
  },
  {
    id: 'n3',
    title: 'Ngày hội "Bé yêu thiên nhiên" — 15/10/2026',
    summary: 'Nhà trường tổ chức ngày hội ngoại khóa cho toàn trường tại công viên xanh.',
    content: `Nhà trường tổ chức Ngày hội "Bé yêu thiên nhiên" nhân dịp tháng hành động vì môi trường:\n\n📅 Ngày: 15/10/2026 (thứ Năm)\n📍 Địa điểm: Công viên Gia Định, Q.Bình Thạnh\n🚌 Phương tiện: Xe buýt trường\n\nCác hoạt động:\n• Trồng cây xanh\n• Vẽ tranh thiên nhiên ngoài trời\n• Biểu diễn văn nghệ\n• Ăn trưa dã ngoại\n\nGiáo viên vui lòng hướng dẫn học sinh mang theo: mũ, bình nước, kem chống nắng.\n\nPhụ huynh có nhu cầu tham gia cùng vui lòng đăng ký trước 10/10.`,
    category: 'event',
    author: 'GV Nguyễn Thị Mai',
    authorRole: 'Giáo viên phụ trách ngoại khóa',
    date: '2026-09-18',
    pinned: false,
    readBy: [CURRENT_TEACHER_ID],
    attachments: ['Chuong_trinh_ngoai_khoa.pdf', 'Danh_sach_dang_ky.xlsx'],
    forTeacher: false,
  },
  {
    id: 'n4',
    title: 'Hướng dẫn ghi nhận xét học bạ học kỳ 1 năm học 2026-2027',
    summary: 'Quy trình và mẫu nhận xét học bạ học kỳ 1, hạn nộp 20/12/2026.',
    content: `Kính gửi quý giáo viên chủ nhiệm,\n\nPhòng học vụ hướng dẫn quy trình ghi nhận xét học bạ học kỳ 1:\n\n1. Thời hạn nộp: 20/12/2026\n2. Mẫu nhận xét: Theo biểu mẫu đính kèm\n3. Ngôn ngữ: Tiếng Việt, rõ ràng, tích cực\n4. Nội dung cần có:\n   • Thể chất và sức khỏe\n   • Nhận thức và học tập\n   • Kỹ năng ngôn ngữ\n   • Tình cảm - xã hội\n   • Thẩm mỹ và sáng tạo\n\nLưu ý: Không sử dụng nhận xét chung chung, cần cụ thể từng bé.\n\nMọi thắc mắc liên hệ phòng học vụ ext. 102.`,
    category: 'academic',
    author: 'P. Học vụ',
    authorRole: 'Phòng Học vụ',
    date: '2026-09-15',
    pinned: false,
    readBy: [],
    attachments: ['Mau_nhan_xet_HK1.docx'],
    forTeacher: true,
  },
  {
    id: 'n5',
    title: 'Thông báo tiêm phòng định kỳ tháng 10 — cúm mùa',
    summary: 'Chương trình tiêm phòng cúm mùa cho toàn bộ học sinh ngày 8/10.',
    content: `Nhà trường phối hợp với Trạm Y tế phường tổ chức tiêm phòng cúm mùa:\n\n📅 Ngày tiêm: 08/10/2026 (thứ Tư)\n🕐 Thời gian: 8:00 – 11:00\n📍 Địa điểm: Phòng y tế nhà trường\n\nGiáo viên chủ nhiệm:\n• Thu phiếu đồng ý của phụ huynh trước 5/10\n• Dẫn học sinh xuống theo lịch từng lớp\n• Theo dõi học sinh sau tiêm 30 phút\n\nHọc sinh có tiền sử dị ứng thuốc vui lòng thông báo cho y tế trường.`,
    category: 'health',
    author: 'Y tế trường',
    authorRole: 'Nhân viên Y tế',
    date: '2026-09-19',
    pinned: false,
    readBy: [],
    attachments: ['Phieu_dong_y_tiem.pdf'],
    forTeacher: false,
  },
  {
    id: 'n6',
    title: 'Kết quả hội thi giáo viên dạy giỏi cấp trường năm học 2026-2027',
    summary: 'Công bố kết quả và danh sách giáo viên đạt danh hiệu dạy giỏi năm học mới.',
    content: `Nhà trường trân trọng công bố kết quả Hội thi Giáo viên dạy giỏi cấp trường năm học 2026-2027:\n\n🥇 Giải Nhất: Cô Nguyễn Thị Mai — Lớp Mầm A\n🥈 Giải Nhì: Thầy Trần Văn Đức — Lớp Chồi B\n🥉 Giải Ba: Cô Lê Thị Hoa — Lớp Lá C\n\nBan Giám hiệu xin chúc mừng các thầy cô đã đạt giải và trân trọng cảm ơn tất cả giáo viên đã tích cực tham gia hội thi.\n\nLễ trao giải sẽ được tổ chức trong buổi họp Hội đồng tháng 10.`,
    category: 'activity',
    author: 'BGH Nhà trường',
    authorRole: 'Ban Giám hiệu',
    date: '2026-09-10',
    pinned: false,
    readBy: [CURRENT_TEACHER_ID],
    attachments: [],
    forTeacher: true,
  },
];

// ─── Post form (teacher can post news to parents) ─────────────────────────────
type PostForm = {
  title: string;
  summary: string;
  content: string;
  category: NewsCategory;
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function NewsPage() {
  const [news, setNews]             = useState<NewsArticle[]>(MOCK_NEWS);
  const [filterCat, setFilterCat]   = useState<NewsCategory | 'all'>('all');
  const [filterRead, setFilterRead] = useState<'all' | 'unread'>('all');
  const [selected, setSelected]     = useState<NewsArticle | null>(null);
  const [showPost, setShowPost]     = useState(false);
  const [postForm, setPostForm]     = useState<PostForm>({
    title: '', summary: '', content: '', category: 'announcement',
  });

  // Mark as read
  const markRead = (article: NewsArticle) => {
    if (!article.readBy.includes(CURRENT_TEACHER_ID)) {
      setNews(p => p.map(n => n.id === article.id
        ? { ...n, readBy: [...n.readBy, CURRENT_TEACHER_ID] }
        : n
      ));
    }
    setSelected({ ...article, readBy: [...article.readBy, CURRENT_TEACHER_ID] });
  };

  const submitPost = () => {
    if (!postForm.title.trim() || !postForm.content.trim()) return;
    const newArticle: NewsArticle = {
      id: `n${Date.now()}`,
      title: postForm.title,
      summary: postForm.summary || postForm.content.slice(0, 80) + '...',
      content: postForm.content,
      category: postForm.category,
      author: 'Cô Nguyễn Thị Lan',
      authorRole: 'Giáo viên chủ nhiệm',
      date: new Date().toISOString().split('T')[0],
      pinned: false,
      readBy: [CURRENT_TEACHER_ID],
      attachments: [],
      forTeacher: false,
    };
    setNews(p => [newArticle, ...p]);
    setPostForm({ title: '', summary: '', content: '', category: 'announcement' });
    setShowPost(false);
  };

  const fmt = (d: string) => new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const filtered = news
    .filter(n => filterCat === 'all' || n.category === filterCat)
    .filter(n => filterRead === 'all' || !n.readBy.includes(CURRENT_TEACHER_ID))
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.date.localeCompare(a.date);
    });

  const unreadCount = news.filter(n => !n.readBy.includes(CURRENT_TEACHER_ID)).length;

  // ── Detail view ──
  if (selected) {
    const cat = CATEGORY_META[selected.category];
    return (
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        {/* Back + actions */}
        <div className="flex items-center gap-3">
          <button onClick={() => setSelected(null)}
            className="flex items-center gap-2 text-slate-500 hover:text-orange-600 font-semibold text-sm transition-colors">
            ← Quay lại
          </button>
          {selected.forTeacher && (
            <span className="ml-auto text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-semibold">
              🔒 Nội bộ giáo viên
            </span>
          )}
        </div>

        {/* Article */}
        <div className="bg-white border border-orange-100 rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-orange-400 to-orange-500 p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 text-white`}>
                {cat.icon} {cat.label}
              </span>
              {selected.pinned && <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-bold">📌 Ghim</span>}
            </div>
            <h2 className="text-xl font-black text-white leading-tight mb-3">{selected.title}</h2>
            <div className="flex items-center gap-3 text-orange-100 text-sm">
              <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-base">
                {selected.authorRole === 'Ban Giám hiệu' ? '👔' : selected.authorRole === 'Hiệu trưởng' ? '🎓' : '👩‍🏫'}
              </div>
              <div>
                <p className="font-semibold text-white">{selected.author}</p>
                <p className="text-xs">{selected.authorRole} · <span suppressHydrationWarning>{fmt(selected.date)}</span></p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">{selected.content}</div>

            {/* Attachments */}
            {selected.attachments.length > 0 && (
              <div className="mt-5 border-t border-orange-100 pt-4">
                <p className="text-xs font-bold text-slate-500 mb-2">📎 Tài liệu đính kèm</p>
                <div className="flex flex-col gap-2">
                  {selected.attachments.map(file => (
                    <button key={file}
                      className="flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-xl text-sm text-orange-700 font-semibold hover:bg-orange-100 transition-colors text-left">
                      <span>{file.endsWith('.pdf') ? '📄' : file.endsWith('.xlsx') ? '📊' : '📁'}</span>
                      <span className="flex-1 truncate">{file}</span>
                      <span className="text-xs text-slate-400">Tải xuống</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Share to parents button (if not teacher-only) */}
            {!selected.forTeacher && (
              <div className="mt-5 border-t border-orange-100 pt-4">
                <button className="w-full bg-orange-400 hover:bg-orange-500 text-white py-3 rounded-xl font-bold transition-colors">
                  📤 Gửi thông báo này đến phụ huynh
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── List view ──
  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-4">

      {/* Header bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <h2 className="font-black text-slate-800 text-lg">Tin tức & Thông báo</h2>
          {unreadCount > 0 && (
            <p className="text-sm text-orange-600 font-semibold">{unreadCount} thông báo chưa đọc</p>
          )}
        </div>
        <button onClick={() => setShowPost(true)}
          className="flex items-center gap-2 bg-orange-400 hover:bg-orange-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors">
          ✏️ Đăng bài
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2">
        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button onClick={() => setFilterCat('all')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${filterCat === 'all' ? 'bg-orange-400 text-white' : 'bg-white border border-orange-200 text-orange-600 hover:bg-orange-50'}`}>
            Tất cả ({news.length})
          </button>
          {(Object.entries(CATEGORY_META) as [NewsCategory, typeof CATEGORY_META[NewsCategory]][]).map(([k, v]) => {
            const count = news.filter(n => n.category === k).length;
            return (
              <button key={k} onClick={() => setFilterCat(k)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${filterCat === k ? 'bg-orange-400 text-white' : 'bg-white border border-orange-200 text-slate-600 hover:bg-orange-50'}`}>
                <span>{v.icon}</span><span>{v.label}</span><span className="opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
        {/* Read filter */}
        <div className="flex gap-2">
          {(['all', 'unread'] as const).map(f => (
            <button key={f} onClick={() => setFilterRead(f)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${filterRead === f ? 'bg-slate-700 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
              {f === 'all' ? 'Tất cả' : `Chưa đọc (${unreadCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Article list */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <p className="text-4xl mb-2">📭</p>
            <p className="font-semibold">Không có thông báo nào</p>
          </div>
        )}
        {filtered.map(article => {
          const cat = CATEGORY_META[article.category];
          const isRead = article.readBy.includes(CURRENT_TEACHER_ID);
          return (
            <button key={article.id} onClick={() => markRead(article)}
              className={`text-left w-full rounded-2xl border transition-all hover:shadow-md hover:-translate-y-0.5 ${
                isRead ? 'bg-white border-orange-100' : 'bg-orange-50 border-orange-300'
              }`}>
              <div className="p-4">
                {/* Top row */}
                <div className="flex items-start gap-3">
                  {/* Category icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${cat.bg}`}>
                    {cat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cat.bg} ${cat.color}`}>
                        {cat.label}
                      </span>
                      {article.pinned && <span className="text-xs text-amber-600 font-bold">📌 Ghim</span>}
                      {article.forTeacher && <span className="text-xs text-orange-600 font-bold">🔒 Nội bộ</span>}
                      {!isRead && <span className="ml-auto text-xs bg-orange-400 text-white px-2 py-0.5 rounded-full font-bold">Mới</span>}
                    </div>
                    <h3 className={`font-bold text-sm leading-tight ${isRead ? 'text-slate-700' : 'text-slate-900'}`}>
                      {article.title}
                    </h3>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 pl-13">{article.summary}</p>

                {/* Footer */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-orange-100 text-xs text-slate-400">
                  <span className="font-semibold text-slate-500">{article.author}</span>
                  <span>·</span>
                  <span suppressHydrationWarning>{fmt(article.date)}</span>
                  {article.attachments.length > 0 && (
                    <><span>·</span><span>📎 {article.attachments.length} tệp</span></>
                  )}
                  <span className="ml-auto">{isRead ? '✓ Đã đọc' : '→ Chưa đọc'}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Post modal ── */}
      {showPost && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end" onClick={() => setShowPost(false)}>
          <div className="bg-white w-full max-w-lg mx-auto rounded-t-3xl p-5 slide-in max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <h3 className="font-bold text-slate-800 text-lg flex-1">✏️ Đăng bài thông báo</h3>
              <button onClick={() => setShowPost(false)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>

            {/* Category */}
            <label className="text-xs font-bold text-slate-500 mb-2 block">Phân loại</label>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {(Object.entries(CATEGORY_META) as [NewsCategory, typeof CATEGORY_META[NewsCategory]][]).map(([k, v]) => (
                <button key={k} onClick={() => setPostForm(p => ({ ...p, category: k }))}
                  className={`flex items-center gap-1.5 px-2 py-2 rounded-xl border text-xs font-semibold transition-all ${
                    postForm.category === k ? 'bg-orange-100 border-orange-400 text-orange-800' : 'bg-white border-slate-200 text-slate-600 hover:border-orange-200'
                  }`}>
                  <span>{v.icon}</span><span>{v.label}</span>
                </button>
              ))}
            </div>

            {/* Title */}
            <label className="text-xs font-bold text-slate-500 mb-1 block">Tiêu đề *</label>
            <input value={postForm.title} onChange={e => setPostForm(p => ({ ...p, title: e.target.value }))}
              className="w-full border border-orange-200 rounded-xl px-4 py-2.5 text-sm mb-3 focus:outline-none focus:border-orange-400"
              placeholder="Tiêu đề thông báo..." autoFocus />

            {/* Summary */}
            <label className="text-xs font-bold text-slate-500 mb-1 block">Tóm tắt (tuỳ chọn)</label>
            <input value={postForm.summary} onChange={e => setPostForm(p => ({ ...p, summary: e.target.value }))}
              className="w-full border border-orange-200 rounded-xl px-4 py-2.5 text-sm mb-3 focus:outline-none focus:border-orange-400"
              placeholder="Một dòng tóm tắt nội dung..." />

            {/* Content */}
            <label className="text-xs font-bold text-slate-500 mb-1 block">Nội dung *</label>
            <textarea value={postForm.content} onChange={e => setPostForm(p => ({ ...p, content: e.target.value }))} rows={6}
              className="w-full border border-orange-200 rounded-xl px-4 py-2.5 text-sm mb-4 focus:outline-none focus:border-orange-400 resize-none"
              placeholder="Viết nội dung thông báo..." />

            {/* Audience note */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex gap-2 text-sm text-blue-700 mb-4">
              <span>ℹ️</span>
              <span>Bài đăng của giáo viên sẽ được gửi đến <strong>phụ huynh lớp</strong> và hiển thị trong bảng tin chung.</span>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setShowPost(false)}
                className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50">
                Huỷ
              </button>
              <button onClick={submitPost}
                disabled={!postForm.title.trim() || !postForm.content.trim()}
                className="flex-1 bg-orange-400 hover:bg-orange-500 text-white py-3 rounded-xl font-bold transition-colors disabled:opacity-40">
                📤 Đăng bài
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
