export interface FCMClusterMeta {
  id: number;
  name: string;
  tag: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  description: string;
}

export const FCM_CLUSTERS: Record<number, FCMClusterMeta> = {
  1: {
    id: 1,
    name: "Nhóm 1: Phát triển Vượt trội / Toàn diện",
    tag: "Vượt trội",
    color: "#8b5cf6", // purple
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-700",
    description:
      "Bé phát triển toàn diện trên cả 5 miền, có thiên hướng nổi trội về năng khiếu nghệ thuật, tạo hình và thẩm mĩ.",
  },
  2: {
    id: 2,
    name: "Nhóm 2: Phát triển Đạt chuẩn / Khá",
    tag: "Đạt chuẩn",
    color: "#10b981", // emerald
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-700",
    description:
      "Bé phát triển đồng đều, nề nếp sinh hoạt và các kỹ năng vận động, nhận thức, ngôn ngữ đạt chuẩn vững vàng.",
  },
  3: {
    id: 3,
    name: "Nhóm 3: Đang phát triển / Cần rèn luyện",
    tag: "Mức khá",
    color: "#f59e0b", // amber
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-800",
    description:
      "Bé có nhận thức khá tốt nhưng kỹ năng cảm xúc, ngôn ngữ hoặc sự kiên nhẫn khi chơi cùng bạn còn chậm hơn một chút.",
  },
  4: {
    id: 4,
    name: "Nhóm 4: Cần cô giáo & gia đình đồng hành",
    tag: "Cần đồng hành",
    color: "#ef4444", // rose
    badgeBg: "bg-rose-100",
    badgeText: "text-rose-700",
    description:
      "Bé cần cô giáo và gia đình dành thêm thời gian quan tâm, trò chuyện để thúc đẩy ngôn ngữ, vận động và tự phục vụ.",
  },
};

export interface RadarScores {
  "Thể chất": number;
  "Nhận thức": number;
  "Ngôn ngữ": number;
  "Tình cảm - Xã hội": number;
  "Thẩm mĩ": number;
}

export interface FCMInferenceResult {
  childId?: string;
  clusterId: number;
  clusterName: string;
  clusterTag: string;
  memberships: number[]; // [u1, u2, u3, u4]
  radarScores: RadarScores;
  previousClusterId?: number | null;
  trend?: "IMPROVED" | "MAINTAIN" | "ATTENTION";
  featuresSnapshot?: Record<string, number>;
}

export interface FCMHistoryRecord {
  id: string;
  childId: string;
  classId: string;
  month: number;
  year: number;
  clusterId: number;
  clusterName: string;
  previousClusterId?: number | null;
  trend: "IMPROVED" | "MAINTAIN" | "ATTENTION";
  memberships: number[];
  radarScores: RadarScores;
  createdAt: string;
}

export const FCM_MICROSERVICE_URL =
  process.env.FCM_SERVICE_URL || "http://localhost:8008";

/**
 * 31 Feature Names in exact order according to preschool curriculum standard
 */
export const INDICATOR_31_FEATURES = [
  "phys_balance_walk",
  "phys_hold_pencil",
  "phys_self_clean",
  "phys_toilet_dress",
  "phys_small_objects",
  "phys_stamina_active",
  "cog_curiosity_env",
  "cog_classify_objects",
  "cog_solve_problems",
  "cog_count_20",
  "cog_association",
  "cog_count_10",
  "cog_geometry_shape",
  "cog_compare_numbers",
  "lang_communicate_clear",
  "lang_follow_commands",
  "lang_listen_classroom",
  "lang_appropriate_words",
  "lang_tell_story",
  "lang_rhyme_poetry",
  "lang_voice_control",
  "lang_clear_pronounce",
  "lang_book_interest",
  "lang_write_name",
  "soc_finish_task_ontime",
  "soc_tidy_toys",
  "soc_emotion_stability",
  "soc_obey_rules",
  "soc_wait_turn",
  "aes_draw_creative",
  "aes_special_talent",
];

/**
 * GỌI ĐẾN CONTAINER DỊCH VỤ PYTHON FCM (school-fcm:8008).
 */
export async function predictFCMBatch(
  items: {
    child_id: string;
    features: Record<string, number | null | undefined>;
  }[],
): Promise<FCMInferenceResult[]> {
  try {
    const res = await fetch(
      `${FCM_MICROSERVICE_URL}/api/v1/fcm/batch-predict`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      },
    );
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`FCM batch HTTP ${res.status}:${errText}`);
    }
    const data = await res.json();
    return (data.items || []).map((it: any) => ({
      childId: it.child_id,
      clusterId: it.cluster_id,
      clusterName: it.cluster_name,
      clusterTag: it.cluster_tag,
      memberships: it.memberships,
      radarScores: it.radar_scores,
      featuresSnapshot: it.features_snapshot,
    }));
  } catch (err: any) {
    console.error("[FCM Batch Error]:", err.message);
    throw err;
  }
}
