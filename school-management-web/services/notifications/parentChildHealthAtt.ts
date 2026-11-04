import { api } from "../client";
import { classifyWhoBmi } from "@/app/teacher/health/components/whoStandards";
import {
  AppNotification,
  ParentChildSummary,
  toIsoDateOnly,
  resolveRealtimeTimestamp,
} from "./types";

export async function checkAttendanceAndHealth({
  child,
  todayIso,
  readSet,
}: {
  child: ParentChildSummary;
  todayIso: string;
  readSet: Set<string>;
}): Promise<AppNotification[]> {
  const items: AppNotification[] = [];
  const [attRes, healthRes] = await Promise.allSettled([
    api.get<any>(
      "attendance",
      `/api/DiemDanh/today/${child.id}?date=${todayIso}`
    ),
    api.get<any>("health", `/api/SucKhoe/lich-su/${child.id}`),
  ]);

  // 1. Điểm danh hôm nay
  if (
    attRes.status === "fulfilled" &&
    attRes.value?.coBanGhi &&
    attRes.value?.data
  ) {
    const todayRecord = attRes.value.data;
    const status = String(
      todayRecord.trangThai || todayRecord.TrangThai || ""
    ).trim();
    const gioDen =
      todayRecord.gioDen || todayRecord.GioDen
        ? String(todayRecord.gioDen || todayRecord.GioDen).slice(0, 5)
        : "";
    const gioVe =
      todayRecord.gioVe || todayRecord.GioVe
        ? String(todayRecord.gioVe || todayRecord.GioVe).slice(0, 5)
        : "";

    if (
      status.toLowerCase().includes("vắng") ||
      status.toLowerCase().includes("nghỉ")
    ) {
      const notifId = `parent-att-absent-${child.id}-${todayIso}-${status}`;
      items.push({
        id: notifId,
        category: "attendance",
        severity: "danger",
        isUrgent: true,
        title: `Điểm danh hôm nay (${todayIso}): ${child.hoTen} - ${status}`,
        message: `Giáo viên lớp ${
          child.lop || ""
        } đã điểm danh trạng thái "${status}" trong ngày ${todayIso}.`,
        timestamp: resolveRealtimeTimestamp(
          notifId,
          todayRecord.updatedAt || todayRecord.createdAt
        ),
        read: readSet.has(notifId),
        targetTab: "attendance",
        childId: child.id,
        childName: child.hoTen,
        badgeText: status,
      });
    } else if (gioVe) {
      const notifId = `parent-att-checkout-${child.id}-${todayIso}-${gioVe}`;
      items.push({
        id: notifId,
        category: "attendance",
        severity: "success",
        isUrgent: true,
        title: `${child.hoTen} đã được đón về lúc ${gioVe}`,
        message: `Điểm danh ngày ${todayIso}: Giờ đến lớp ${
          gioDen || "--:--"
        }, giờ đón về ${gioVe}.`,
        timestamp: resolveRealtimeTimestamp(notifId, `${todayIso}T${gioVe}:00`),
        read: readSet.has(notifId),
        targetTab: "attendance",
        childId: child.id,
        childName: child.hoTen,
        badgeText: "Đã về",
      });
    } else if (gioDen || status) {
      const isLate = status.toLowerCase().includes("muộn");
      const notifId = `parent-att-checkin-${child.id}-${todayIso}-${gioDen}-${status}`;
      items.push({
        id: notifId,
        category: "attendance",
        severity: isLate ? "warning" : "success",
        isUrgent: true,
        title: `${child.hoTen} đã đến lớp${
          gioDen ? ` lúc ${gioDen}` : ""
        } (${status})`,
        message: `Điểm danh ngày ${todayIso}: Trạng thái "${status}"${
          gioDen ? `, giờ đến ${gioDen}` : ""
        }. Chưa ghi nhận giờ về.`,
        timestamp: resolveRealtimeTimestamp(
          notifId,
          gioDen ? `${todayIso}T${gioDen}:00` : undefined
        ),
        read: readSet.has(notifId),
        targetTab: "attendance",
        childId: child.id,
        childName: child.hoTen,
        badgeText: "Đã đến lớp",
      });
    }
  }

  // 2. Sức khỏe & WHO BMI
  if (healthRes.status === "fulfilled" && healthRes.value) {
    const rawHealth = Array.isArray(healthRes.value)
      ? healthRes.value
      : [healthRes.value];
    const sortedHealth = rawHealth
      .filter((h: any) => h && (h.canNang || h.chieuCao))
      .sort((a: any, b: any) =>
        String(b.ngayDo || "").localeCompare(String(a.ngayDo || ""))
      );

    const latestHealth = sortedHealth[0];
    if (latestHealth) {
      const weight = Number(latestHealth.canNang || 0);
      const heightCm = Number(latestHealth.chieuCao || 0);
      const heightM = heightCm > 0 ? heightCm / 100 : 0;
      const bmi =
        heightM > 0 ? Math.round((weight / (heightM * heightM)) * 10) / 10 : 0;
      const bmiRounded = bmi > 0 ? bmi.toFixed(1) : "";
      const note = String(latestHealth.ghiChu || "").trim();
      const noteLower = note.toLowerCase();
      const measureDate = toIsoDateOnly(latestHealth.ngayDo);

      const whoClass = classifyWhoBmi(bmi, child.gioiTinh, child.ngaySinh);
      const isObese =
        whoClass.code === "BEO_PHI_DO_I" ||
        whoClass.code === "BEO_PHI_DO_II" ||
        noteLower.includes("béo phì");
      const isOverweight =
        !isObese &&
        (whoClass.code === "TIEN_BEO_PHI" || noteLower.includes("thừa cân"));
      const isUnderweight =
        !isObese &&
        !isOverweight &&
        (whoClass.code === "CAN_NANG_THAP" ||
          noteLower.includes("suy dinh dưỡng") ||
          noteLower.includes("nhẹ cân") ||
          noteLower.includes("thấp còi"));

      if (isObese || isOverweight || isUnderweight) {
        const statusLabel =
          whoClass.code !== "BINH_THUONG"
            ? whoClass.shortLabel
            : isObese
            ? "Béo phì"
            : isOverweight
            ? "Thừa cân"
            : "Nhẹ cân / Suy dinh dưỡng";
        const notifId = `parent-health-alert-${child.id}-${
          latestHealth.id || measureDate
        }-${weight}-${heightCm}-${statusLabel}`;
        items.push({
          id: notifId,
          category: "health",
          severity: isObese ? "danger" : "warning",
          isUrgent: true,
          title: `Cảnh báo sức khỏe (${statusLabel} - Chuẩn WHO): ${child.hoTen}`,
          message: `Số đo ngày ${measureDate}: Cân nặng ${weight}kg, Chiều cao ${heightCm}cm (BMI ${bmiRounded} - ${
            whoClass.label
          }).${note ? ` Ghi chú y tế: ${note}` : ""}`,
          timestamp: resolveRealtimeTimestamp(
            notifId,
            latestHealth.updatedAt ||
              latestHealth.createdAt ||
              latestHealth.ngayDo
          ),
          read: readSet.has(notifId),
          targetTab: "health",
          childId: child.id,
          childName: child.hoTen,
          badgeText: statusLabel,
        });
      }
    }
  }

  return items;
}
