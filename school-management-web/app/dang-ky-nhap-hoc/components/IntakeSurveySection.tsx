"use client";

import React from "react";
import { CheckCircle2, ClipboardCheck, Sparkles } from "lucide-react";

interface IntakeSurveySectionProps {
  surveyValues: Record<string, number>;
  onSurveyChange: (key: string, value: number) => void;
}

export const INTAKE_DOMAINS = [
  {
    domain: "Thể chất",
    color: "text-blue-700 bg-blue-50 border-blue-200",
    badge: "6 chỉ số phát triển vận động & thể lực",
    items: [
      { key: "phys_balance_walk", label: "Giữ thăng bằng cơ thể khi vận động (đi thăng bằng, đi lùi)" },
      { key: "phys_hold_pencil", label: "Cầm nắm dụng cụ, bút hoặc thìa đúng cách" },
      { key: "phys_self_clean", label: "Tự rửa tay bằng xà phòng, lau mặt, súc miệng" },
      { key: "phys_toilet_dress", label: "Tự đi vệ sinh, tự thay quần áo khi bị ướt/bẩn" },
      { key: "phys_small_objects", label: "Khéo léo cử động bàn tay, nhặt/cầm nắm đồ vật nhỏ" },
      { key: "phys_stamina_active", label: "Thể lực tốt, vận động liên tục 15-20 phút không mệt mỏi" },
    ],
  },
  {
    domain: "Nhận thức",
    color: "text-emerald-700 bg-emerald-50 border-emerald-200",
    badge: "8 chỉ số tư duy & khám phá",
    items: [
      { key: "cog_curiosity_env", label: "Tò mò, hay đặt câu hỏi tìm hiểu thế giới xung quanh" },
      { key: "cog_classify_objects", label: "Phân loại đồ vật theo màu sắc, hình dạng, công dụng" },
      { key: "cog_solve_problems", label: "Biết tìm cách giải quyết khó khăn đơn giản khi chơi" },
      { key: "cog_count_20", label: "Đếm được các số từ 1 đến 20" },
      { key: "cog_association", label: "Biết liên tưởng, ghép nối các sự vật có quan hệ với nhau" },
      { key: "cog_count_10", label: "Đếm và so sánh số lượng nhóm đồ vật trong phạm vi 10" },
      { key: "cog_geometry_shape", label: "Nhận biết các hình khối cơ bản (vuông, tròn, tam giác...)" },
      { key: "cog_compare_numbers", label: "So sánh nhiều hơn - ít hơn giữa hai nhóm đồ vật" },
    ],
  },
  {
    domain: "Ngôn ngữ",
    color: "text-amber-800 bg-amber-50 border-amber-200",
    badge: "10 chỉ số giao tiếp & diễn đạt",
    items: [
      { key: "lang_communicate_clear", label: "Diễn đạt nhu cầu, ý muốn rõ ràng thành câu" },
      { key: "lang_follow_commands", label: "Hiểu và làm theo các chỉ dẫn 2-3 bước liên tiếp" },
      { key: "lang_listen_classroom", label: "Chú ý lắng nghe khi người khác trò chuyện hoặc kể chuyện" },
      { key: "lang_appropriate_words", label: "Sử dụng từ ngữ lễ phép, phù hợp với hoàn cảnh" },
      { key: "lang_tell_story", label: "Kể lại được câu chuyện ngắn hoặc sự việc đơn giản đã xảy ra" },
      { key: "lang_rhyme_poetry", label: "Đọc thuộc các bài thơ, đồng dao ngắn quen thuộc" },
      { key: "lang_voice_control", label: "Biết điều chỉnh âm lượng giọng nói phù hợp không gian" },
      { key: "lang_clear_pronounce", label: "Phát âm rõ ràng, người lớn dễ nghe hiểu" },
      { key: "lang_book_interest", label: "Thích xem tranh, lật giở sách và chỉ vào hình ảnh" },
      { key: "lang_write_name", label: "Nhận biết hoặc tập viết/tô các nét tên của mình" },
    ],
  },
  {
    domain: "Tình cảm - Xã hội",
    color: "text-purple-700 bg-purple-50 border-purple-200",
    badge: "5 chỉ số kỹ năng xã hội & cảm xúc",
    items: [
      { key: "soc_finish_task_ontime", label: "Cố gắng hoàn thành nhiệm vụ đơn giản được giao" },
      { key: "soc_tidy_toys", label: "Tự giác cất dọn đồ chơi sau khi chơi xong" },
      { key: "soc_emotion_stability", label: "Biết kiềm chế cơn giận, không la hét quấy khóc vô cớ" },
      { key: "soc_obey_rules", label: "Tuân thủ quy định và nội quy sinh hoạt chung" },
      { key: "soc_wait_turn", label: "Biết kiên nhẫn chờ đến lượt khi tham gia hoạt động" },
    ],
  },
  {
    domain: "Thẩm mỹ",
    color: "text-rose-700 bg-rose-50 border-rose-200",
    badge: "2 chỉ số sáng tạo nghệ thuật",
    items: [
      { key: "aes_draw_creative", label: "Thích thú vẽ tranh, tô màu, nặn và tạo hình sáng tạo" },
      { key: "aes_special_talent", label: "Có năng khiếu hoặc hứng thú đặc biệt với hát, múa, tạo hình" },
    ],
  },
];

export default function IntakeSurveySection({
  surveyValues,
  onSurveyChange,
}: IntakeSurveySectionProps) {
  return (
    <div className="space-y-6 pt-4 border-t border-slate-200">
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
            <ClipboardCheck size={18} />
          </span>
          <h3 className="font-bold text-sm sm:text-base text-slate-800">
            5. Khảo sát năng lực ban đầu của trẻ khi nhập học
          </h3>
        </div>
        <p className="text-xs text-slate-600 mt-1">
          Kính nhờ quý phụ huynh đánh giá khách quan các thói quen và khả năng hiện tại của bé ở nhà theo 5 lĩnh vực để nhà trường nắm bắt hồ sơ ban đầu và hỗ trợ bé hòa nhập tốt nhất.
        </p>
      </div>

      <div className="space-y-6">
        {INTAKE_DOMAINS.map((group) => (
          <div
            key={group.domain}
            className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${group.color}`}>
                Lĩnh vực: {group.domain}
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                {group.badge}
              </span>
            </div>

            <div className="space-y-3">
              {group.items.map((item, idx) => {
                const currentVal = surveyValues[item.key] ?? 1.0;
                return (
                  <div
                    key={item.key}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition"
                  >
                    <div className="text-xs font-semibold text-slate-800 pr-2">
                      <span className="font-bold text-slate-500 mr-1.5">{idx + 1}.</span>
                      {item.label}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => onSurveyChange(item.key, 1.0)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                          currentVal === 1.0
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        Đạt
                      </button>
                      <button
                        type="button"
                        onClick={() => onSurveyChange(item.key, 0.5)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                          currentVal === 0.5
                            ? "bg-amber-500 text-white shadow-xs"
                            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        Đang rèn luyện
                      </button>
                      <button
                        type="button"
                        onClick={() => onSurveyChange(item.key, 0.0)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                          currentVal === 0.0
                            ? "bg-rose-600 text-white shadow-xs"
                            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        Chưa đạt
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
