import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fff8f3] font-sans">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-orange-100">
        <div className="w-16 h-16 bg-orange-400 rounded-2xl flex items-center justify-center text-white font-black text-3xl mx-auto mb-4 shadow-lg shadow-orange-200">
          K
        </div>
        <h1 className="text-2xl font-black text-slate-800 mb-1">KinderCare</h1>
        <p className="text-slate-500 text-sm mb-8">Hệ thống quản lý trường mầm non</p>

        <p className="font-bold text-slate-700 mb-4 text-left">Vui lòng chọn vai trò của bạn:</p>

        <div className="flex flex-col gap-3">
          <Link href="/teacher" className="flex items-center gap-4 p-4 rounded-2xl border-2 border-orange-100 bg-orange-50 hover:border-orange-400 hover:bg-orange-100 transition-all group">
            <span className="text-3xl group-hover:scale-110 transition-transform">👩‍🏫</span>
            <div className="text-left">
              <p className="font-bold text-orange-900">Giáo viên</p>
              <p className="text-xs text-orange-700">Quản lý lớp học, điểm danh, nhận xét...</p>
            </div>
          </Link>
          
          <button disabled className="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed text-left">
            <span className="text-3xl grayscale">👨‍👩‍👦</span>
            <div>
              <p className="font-bold text-slate-700">Phụ huynh (Đang phát triển)</p>
              <p className="text-xs text-slate-500">Xem tình hình của bé, xin nghỉ...</p>
            </div>
          </button>
          
          <button disabled className="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed text-left">
            <span className="text-3xl grayscale">👑</span>
            <div>
              <p className="font-bold text-slate-700">Quản trị viên (Đang phát triển)</p>
              <p className="text-xs text-slate-500">Quản lý toàn trường, giáo viên...</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
