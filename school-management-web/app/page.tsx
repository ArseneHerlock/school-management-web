import Link from "next/link";

export const metadata = {
  title: "Hệ Thống Quản Lý Giáo Dục Mầm Non - OneKids & KinderCare",
  description: "Cổng thông tin tích hợp dành cho Phụ huynh, Giáo viên và Quản trị viên",
};

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#f0f9ff] via-[#eef2f6] to-[#e0f2fe] font-sans p-4">
      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl max-w-md w-full text-center border border-sky-100">
        <div className="w-16 h-16 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl mx-auto mb-4 shadow-lg shadow-sky-200">
          K
        </div>
        <h1 className="text-2xl font-black text-slate-800 mb-1">OneKids & KinderCare</h1>
        <p className="text-slate-500 text-sm mb-8 font-medium">Hệ thống quản lý trường học thông minh</p>

        <p className="font-bold text-slate-700 mb-4 text-left text-sm">Vui lòng chọn cổng đăng nhập của bạn:</p>

        <div className="flex flex-col gap-3">
          {/* Parent portal - Active */}
          <Link
            href="/parent"
            className="flex items-center gap-4 p-4 rounded-2xl border-2 border-sky-200 bg-sky-50/80 hover:border-sky-500 hover:bg-sky-100/70 transition-all group shadow-xs text-left"
          >
            <span className="text-3xl group-hover:scale-110 transition-transform">👨‍👩‍👦</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-extrabold text-sky-900 text-sm">Cổng Phụ Huynh (OneKids)</p>
                <span className="text-[10px] bg-sky-500 text-white font-bold px-2 py-0.5 rounded-full">Sẵn sàng</span>
              </div>
              <p className="text-xs text-sky-700 mt-0.5">Tình hình bé, tin nhắn cô giáo, học phí, khoảnh khắc...</p>
            </div>
          </Link>

          {/* Teacher portal */}
          <Link
            href="/teacher"
            className="flex items-center gap-4 p-4 rounded-2xl border-2 border-orange-100 bg-orange-50/70 hover:border-orange-400 hover:bg-orange-100/60 transition-all group text-left"
          >
            <span className="text-3xl group-hover:scale-110 transition-transform">👩‍🏫</span>
            <div className="flex-1 min-w-0">
              <p className="font-extrabold text-orange-900 text-sm">Cổng Giáo Viên</p>
              <p className="text-xs text-orange-700 mt-0.5">Quản lý lớp học, điểm danh, nhận xét...</p>
            </div>
          </Link>

          {/* Admin portal */}
          <Link
            href="/admin"
            className="flex items-center gap-4 p-4 rounded-2xl border-2 border-indigo-100 bg-indigo-50/70 hover:border-indigo-400 hover:bg-indigo-100/60 transition-all group text-left"
          >
            <span className="text-3xl group-hover:scale-110 transition-transform">👑</span>
            <div className="flex-1 min-w-0">
              <p className="font-extrabold text-indigo-900 text-sm">Cổng Quản Trị Viên</p>
              <p className="text-xs text-indigo-700 mt-0.5">Quản trị toàn trường, nhân sự, tài chính...</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
