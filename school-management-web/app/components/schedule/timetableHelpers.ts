import {
  TimetableScheduleItem,
  CardStyleConfig,
  DayInfo,
  isEvaluableActivity,
} from "./types";

export function computeWeekDays(selectedDate: string): DayInfo[] {
  const [y, m, d] = selectedDate.split("-").map(Number);
  const dateObj = new Date(y, m - 1, d);
  const dayOfWeek = dateObj.getDay(); // 0 is Sunday
  const diffToMonday = dateObj.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);

  const monday = new Date(y, m - 1, diffToMonday);
  const days: DayInfo[] = [];
  const dayNames = [
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "Chủ nhật",
  ];

  const todayStr = new Date().toISOString().slice(0, 10);

  for (let i = 0; i < 7; i++) {
    const current = new Date(monday);
    current.setDate(monday.getDate() + i);

    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, "0");
    const day = String(current.getDate()).padStart(2, "0");
    const isoDate = `${year}-${month}-${day}`;
    const formattedDate = `${day}/${month}/${year}`;

    days.push({
      dayIndex: i,
      dayName: dayNames[i],
      isoDate,
      formattedDate,
      isToday: isoDate === todayStr,
    });
  }

  return days;
}

export function getPeriodLabel(item: TimetableScheduleItem): string {
  if (item.description && /tiết\s*:\s*\d+/i.test(item.description)) {
    const match = item.description.match(/tiết\s*:\s*[\d\s\-]+/i);
    if (match) return match[0];
  }
  const start = item.startTime || "07:30";
  const end = item.endTime || "09:30";
  return `Giờ: ${start} - ${end}`;
}

export function getCardStyle(item: TimetableScheduleItem): CardStyleConfig {
  const evaluable = isEvaluableActivity(item);

  if (!evaluable) {
    return {
      variant: "routine",
      containerClass:
        "bg-slate-50 border border-slate-200 text-slate-700 shadow-2xs hover:bg-slate-100/80 transition",
      titleClass: "font-semibold text-[11px] text-slate-700 leading-tight",
      textClass: "text-[10px] text-slate-500 leading-snug",
      badge: "⏰ SINH HOẠT",
      badgeClass: "bg-slate-200 text-slate-600 font-bold",
    };
  }

  const isEvent =
    Boolean(item.isSchoolWide) ||
    item.type === 2 ||
    Boolean(
      item.title &&
        /lễ hội|sự kiện|dã ngoại|hội thao|trải nghiệm|toàn trường/i.test(item.title)
    );

  if (isEvent) {
    return {
      variant: "event",
      containerClass:
        "bg-[#fef3c7] border border-[#fde68a] text-amber-950 shadow-2xs hover:shadow-xs",
      titleClass: "font-bold text-[12px] text-amber-950 leading-tight",
      textClass: "text-[11px] text-amber-900 leading-snug",
      badge: item.isSchoolWide ? "TOÀN TRƯỜNG" : "⭐ SỰ KIỆN - HOẠT ĐỘNG",
      badgeClass: "bg-amber-200 text-amber-900 font-bold",
    };
  }

  const textToScan = `${item.title || ""} ${item.description || ""} ${
    item.location || ""
  }`.toLowerCase();

  const isOutdoor =
    textToScan.includes("vận động") ||
    textToScan.includes("ngoài trời") ||
    textToScan.includes("sân trường") ||
    textToScan.includes("thể chất");

  if (isOutdoor) {
    return {
      variant: "outdoor",
      containerClass:
        "bg-[#dcfce7] border border-[#bbf7d0] text-emerald-950 shadow-2xs hover:shadow-xs",
      titleClass: "font-bold text-[12px] text-emerald-950 leading-tight",
      textClass: "text-[11px] text-emerald-900 leading-snug",
      badge: "🏃 VẬN ĐỘNG / NGOÀI TRỜI",
      badgeClass: "bg-emerald-200 text-emerald-900 font-bold",
    };
  }

  return {
    variant: "routine",
    containerClass:
      "bg-[#e0f2fe] border border-[#bae6fd] text-sky-950 shadow-2xs hover:shadow-xs",
    titleClass: "font-bold text-[12px] text-sky-950 leading-tight",
    textClass: "text-[11px] text-sky-800 leading-snug",
    badge: "🎨 HOẠT ĐỘNG GIÁO DỤC",
    badgeClass: "bg-sky-200 text-sky-800 font-bold",
  };
}
