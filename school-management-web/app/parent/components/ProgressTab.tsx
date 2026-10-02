'use client';

import React from 'react';
import { ChildInfo } from '../types';

interface ProgressTabProps {
  child: ChildInfo;
}

export default function ProgressTab({ child }: ProgressTabProps) {
  return (
    <section className="space-y-5">
      {/* Title Banner */}
      <div className="card-frame p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-slate-800">Học Tập & Phát Triển Toàn Diện</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Theo dõi sự phát triển các kỹ năng trọng yếu của bé {child.hoTen}
          </p>
        </div>
        <span className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200 self-start sm:self-auto">
          Học kỳ 1 · {child.lop}
        </span>
      </div>

      {/* 6 Domains Radar Chart */}
      <div className="card-frame p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm">Biểu đồ phát triển 6 lĩnh vực cốt lõi</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Dựa trên khung chuẩn phát triển mầm non quốc gia
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
            Điểm TB: 85/100
          </span>
        </div>

        {/* Radar SVG Canvas & Score Breakdown */}
        <div className="flex flex-col md:flex-row items-center justify-around gap-6 py-2">
          <div className="w-64 h-64 relative flex items-center justify-center p-2 rounded-xl bg-slate-50/70 border border-slate-200">
            <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-xs">
              {/* Background Webs */}
              <polygon points="150,30 254,90 254,210 150,270 46,210 46,90" fill="none" stroke="#cbd5e1" strokeWidth="1"/>
              <polygon points="150,54 233,102 233,198 150,246 67,198 67,102" fill="none" stroke="#cbd5e1" strokeWidth="1"/>
              <polygon points="150,78 212,114 212,186 150,222 88,186 88,114" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
              <polygon points="150,102 192,126 192,174 150,198 108,174 108,126" fill="none" stroke="#e2e8f0" strokeWidth="1"/>

              {/* Spoke Lines */}
              <line x1="150" y1="150" x2="150" y2="30" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2,2"/>
              <line x1="150" y1="150" x2="254" y2="90" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2,2"/>
              <line x1="150" y1="150" x2="254" y2="210" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2,2"/>
              <line x1="150" y1="150" x2="150" y2="270" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2,2"/>
              <line x1="150" y1="150" x2="46" y2="210" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2,2"/>
              <line x1="150" y1="150" x2="46" y2="90" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2,2"/>

              {/* Data Polygon */}
              <polygon
                points="150,48 231,105 241,202 150,256 69,195 56,96"
                fill="rgba(14, 165, 233, 0.25)"
                stroke="#0284c7"
                strokeWidth="2.5"
              />

              {/* Data Points */}
              <circle cx="150" cy="48" r="4" fill="#0284c7"/>
              <circle cx="231" cy="105" r="4" fill="#0284c7"/>
              <circle cx="241" cy="202" r="4" fill="#0284c7"/>
              <circle cx="150" cy="256" r="4" fill="#0284c7"/>
              <circle cx="69" cy="195" r="4" fill="#0284c7"/>
              <circle cx="56" cy="96" r="4" fill="#0284c7"/>

              {/* Axis Labels */}
              <text x="150" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0369a1">Ngôn ngữ (85)</text>
              <text x="262" y="92" textAnchor="start" fontSize="11" fontWeight="bold" fill="#475569">Toán tư duy (78)</text>
              <text x="262" y="215" textAnchor="start" fontSize="11" fontWeight="bold" fill="#059669">Vận động (92)</text>
              <text x="150" y="290" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#475569">Âm nhạc (88)</text>
              <text x="38" y="215" textAnchor="end" fontSize="11" fontWeight="bold" fill="#475569">Sáng tạo (75)</text>
              <text x="38" y="92" textAnchor="end" fontSize="11" fontWeight="bold" fill="#059669">Xã hội (90)</text>
            </svg>
          </div>

          {/* Detail Pills */}
          <div className="grid grid-cols-2 gap-2.5 w-full md:w-64">
            <div className="subcard-frame p-2.5">
              <span className="text-xs text-slate-500 font-semibold">🏃 Vận động</span>
              <p className="text-base font-extrabold text-emerald-600">92 <span className="text-xs text-slate-400 font-normal">/100</span></p>
            </div>
            <div className="subcard-frame p-2.5">
              <span className="text-xs text-slate-500 font-semibold">🤝 Xã hội</span>
              <p className="text-base font-extrabold text-emerald-600">90 <span className="text-xs text-slate-400 font-normal">/100</span></p>
            </div>
            <div className="subcard-frame p-2.5">
              <span className="text-xs text-slate-500 font-semibold">🎵 Âm nhạc</span>
              <p className="text-base font-extrabold text-sky-600">88 <span className="text-xs text-slate-400 font-normal">/100</span></p>
            </div>
            <div className="subcard-frame p-2.5">
              <span className="text-xs text-slate-500 font-semibold">🗣️ Ngôn ngữ</span>
              <p className="text-base font-extrabold text-sky-600">85 <span className="text-xs text-slate-400 font-normal">/100</span></p>
            </div>
            <div className="subcard-frame p-2.5">
              <span className="text-xs text-slate-500 font-semibold">🔢 Toán tư duy</span>
              <p className="text-base font-extrabold text-slate-700">78 <span className="text-xs text-slate-400 font-normal">/100</span></p>
            </div>
            <div className="subcard-frame p-2.5">
              <span className="text-xs text-slate-500 font-semibold">🎨 Sáng tạo</span>
              <p className="text-base font-extrabold text-slate-700">75 <span className="text-xs text-slate-400 font-normal">/100</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Chuyên cần 6 tháng */}
      <div className="card-frame p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm">Chuyên cần 6 tháng gần đây</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Số ngày có mặt và số ngày vắng theo từng tháng</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-sky-50 border border-sky-200 text-sky-700">
              <span className="w-2.5 h-2.5 rounded-xs bg-sky-500"></span> Có mặt
            </span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-rose-700">
              <span className="w-2.5 h-2.5 rounded-xs bg-rose-300"></span> Vắng
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200">
          <div className="relative h-44 flex flex-col justify-between border-b border-slate-300 pb-1">
            <div className="border-b border-dashed border-slate-200 w-full flex justify-between text-[10px] text-slate-400">
              <span>20 ngày</span>
            </div>
            <div className="border-b border-dashed border-slate-200 w-full flex justify-between text-[10px] text-slate-400">
              <span>15 ngày</span>
            </div>
            <div className="border-b border-dashed border-slate-200 w-full flex justify-between text-[10px] text-slate-400">
              <span>10 ngày</span>
            </div>
            <div className="border-b border-dashed border-slate-200 w-full flex justify-between text-[10px] text-slate-400">
              <span>5 ngày</span>
            </div>

            <div className="absolute inset-0 grid grid-cols-6 gap-2 sm:gap-4 items-end px-2">
              {[
                { month: 'T4', present: '90%', absent: '10%' },
                { month: 'T5', present: '85%', absent: '15%' },
                { month: 'T6', present: '95%', absent: '5%' },
                { month: 'T7', present: '80%', absent: '20%' },
                { month: 'T8', present: '100%', absent: '0%' },
                { month: 'T9', present: '90%', absent: '10%', active: true },
              ].map((bar, i) => (
                <div key={i} className="flex flex-col items-center gap-1 h-full justify-end">
                  <div className="w-full max-w-[32px] flex items-end justify-center gap-1 h-36">
                    <div style={{ height: bar.present }} className="w-3 bg-sky-500 rounded-t-xs" />
                    <div style={{ height: bar.absent }} className="w-3 bg-rose-300 rounded-t-xs" />
                  </div>
                  <span className={`text-xs font-bold mt-1 ${bar.active ? 'text-sky-600' : 'text-slate-600'}`}>
                    {bar.month}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-500 text-center mt-2.5 font-medium">
            Bé duy trì tỉ lệ chuyên cần rất cao đạt trên 90% trung bình toàn năm học
          </p>
        </div>
      </div>

      {/* Teacher's Evaluation Card */}
      <div className="card-frame p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-800 text-sm">Nhận xét chi tiết từ Giáo viên Chủ nhiệm (Tuần 37)</h3>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md">
            ⭐ Đạt tiêu chuẩn
          </span>
        </div>

        <div className="space-y-3 divide-y divide-slate-100">
          <div className="pt-2 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-slate-700">Ngôn ngữ & Giao tiếp</p>
              <p className="text-xs text-slate-500 mt-0.5">Bé nói chuyện lưu loát, lễ phép chào hỏi, biết chú ý lắng nghe lời cô dặn.</p>
            </div>
            <div className="flex text-amber-400 text-sm shrink-0">★★★★★</div>
          </div>
          <div className="pt-3 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-slate-700">Kỹ năng vận động</p>
              <p className="text-xs text-slate-500 mt-0.5">Hoạt bát, nhanh nhẹn, tham gia trò chơi vận động phối hợp tay chân rất khéo léo.</p>
            </div>
            <div className="flex text-amber-400 text-sm shrink-0">★★★★★</div>
          </div>
          <div className="pt-3 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-slate-700">Tính tự lập</p>
              <p className="text-xs text-slate-500 mt-0.5">Tự xúc ăn hết phần, tự cất giày dép và ba lô đúng ngăn quy định.</p>
            </div>
            <div className="flex text-amber-400 text-sm shrink-0">★★★★<span className="text-slate-200">★</span></div>
          </div>
          <div className="pt-3 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-slate-700">Tương tác bạn bè</p>
              <p className="text-xs text-slate-500 mt-0.5">Hòa đồng, rất biết chia sẻ đồ chơi cùng bạn bè, không tranh giành.</p>
            </div>
            <div className="flex text-amber-400 text-sm shrink-0">★★★★★</div>
          </div>
        </div>

        {/* General Note Box */}
        <div className="bg-sky-50/70 rounded-xl p-4 border border-sky-200 mt-4">
          <p className="text-xs font-bold text-sky-800 flex items-center gap-1.5">
            <span>📝 Lời nhắn của {child.giaoVienChuNhiem}:</span>
          </p>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            "Bé {child.hoTen} có tiến bộ vượt bậc trong tháng này. Bé ngày càng tự tin, năng động và xung phong hát trước lớp. Ba mẹ ở nhà tiếp tục duy trì thói quen đọc sách cùng con mỗi tối trước khi đi ngủ nhé!"
          </p>
        </div>
      </div>
    </section>
  );
}
