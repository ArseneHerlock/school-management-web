import Link from "next/link";

export const metadata = {
  title: "Hệ Thống Quản Lý Giáo Dục Mầm Non - OneKids & KinderCare",
  description:
    "Cổng thông tin tích hợp dành cho Phụ huynh, Giáo viên và Quản trị viên",
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#f0f9ff] via-[#eef2f6] to-[#e0f2fe] p-4 font-sans">
      <div className="w-full max-w-md rounded-3xl border border-sky-100 bg-white p-8 text-center shadow-xl sm:p-10">
        {/* Logo */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-3xl font-black text-white shadow-lg shadow-sky-200">
          K
        </div>

        {/* Title */}
        <h1 className="mb-1 text-2xl font-black text-slate-800">
          OneKids & KinderCare
        </h1>

        <p className="mb-8 text-sm font-medium text-slate-500">
          Hệ thống quản lý trường học thông minh
        </p>

        <p className="mb-4 text-left text-sm font-bold text-slate-700">
          Vui lòng chọn cổng đăng nhập của bạn:
        </p>

        <div className="flex flex-col gap-3">
          {/* Parent Portal */}
          <Link
            href="/parent"
            className="group flex items-center gap-4 rounded-2xl border-2 border-sky-200 bg-sky-50/80 p-4 text-left transition-all hover:border-sky-500 hover:bg-sky-100/70"
          >
            <span className="text-3xl transition-transform group-hover:scale-110">
              👨‍👩‍👦
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-extrabold text-sky-900">
                  Cổng Phụ Huynh (OneKids)
                </p>

                <span className="rounded-full bg-sky-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  Sẵn sàng
                </span>
              </div>

              <p className="mt-0.5 text-xs text-sky-700">
                Tình hình bé, tin nhắn cô giáo, học phí, khoảnh khắc...
              </p>
            </div>
          </Link>

          {/* Teacher Portal */}
          <Link
            href="/teacher"
            className="group flex items-center gap-4 rounded-2xl border-2 border-orange-100 bg-orange-50/70 p-4 text-left transition-all hover:border-orange-400 hover:bg-orange-100/60"
          >
            <span className="text-3xl transition-transform group-hover:scale-110">
              👩‍🏫
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-extrabold text-orange-900">
                Cổng Giáo Viên
              </p>

              <p className="mt-0.5 text-xs text-orange-700">
                Quản lý lớp học, điểm danh, nhận xét...
              </p>
            </div>
          </Link>

          {/* Admin Portal */}
          <Link
            href="/admin"
            className="group flex items-center gap-4 rounded-2xl border-2 border-indigo-100 bg-indigo-50/70 p-4 text-left transition-all hover:border-indigo-400 hover:bg-indigo-100/60"
          >
            <span className="text-3xl transition-transform group-hover:scale-110">
              👑
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-extrabold text-indigo-900">
                Cổng Quản Trị Viên
              </p>

              <p className="mt-0.5 text-xs text-indigo-700">
                Quản trị toàn trường, nhân sự, tài chính...
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
