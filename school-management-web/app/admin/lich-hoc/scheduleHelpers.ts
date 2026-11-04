import { TimetableScheduleItem } from "@/app/components/schedule/WeeklyTimetable";

export function formatScheduleItems(
  fetchedList: any[],
  classes: any[],
): TimetableScheduleItem[] {
  return fetchedList.map((x: any) => {
    const clsName = x.isSchoolWide
      ? "Toàn trường"
      : classes.find((l: any) => l.id === (x.classId || x.lopId))?.tenLop ||
        x.className ||
        "Lớp học";

    const teacher =
      x.teacherName ||
      x.teachers?.[0]?.teacherId ||
      x.tenNguoiTao ||
      "";

    const rawSubj = String(x.teachers?.[0]?.subject || "");
    const extractedActId = rawSubj.startsWith("ACT:")
      ? rawSubj.slice(4).trim()
      : x.activityId || "";

    return {
      id: String(x.id || ""),
      activityId: extractedActId,
      title: x.title || x.tieuDe || x.tenSuKien || "Hoạt động",
      description: x.description || x.moTa || "",
      type: Number(x.type ?? x.loai ?? 1),
      date: String(x.date || x.ngay || new Date().toISOString()).slice(0, 10),
      startTime: String(x.startTime || x.gioBatDau || "07:30").slice(0, 5),
      endTime: String(x.endTime || x.gioKetThuc || "09:30").slice(0, 5),
      location: x.location || x.diaDiem || "Phòng học",
      classId: x.classId || x.lopId,
      className: clsName,
      isSchoolWide: Boolean(x.isSchoolWide),
      status: x.status ?? 1,
      teacherName: teacher,
      teachers: x.teachers,
    };
  });
}

export function buildSchedulePayload(form: any, resolvedActivityId: string) {
  const teacherAssignee = form.teacherName.trim() || "Giáo viên";
  const subjectTag = resolvedActivityId ? `ACT:${resolvedActivityId}` : form.title.trim();

  return {
    title: form.title.trim(),
    description: form.description.trim(),
    type: Number(form.type),
    date: form.date,
    startTime: form.startTime,
    endTime: form.endTime,
    location: form.location.trim(),
    classId: form.isSchoolWide ? null : form.classId || null,
    isSchoolWide: form.isSchoolWide,
    teacherName: form.teacherName.trim(),
    teachers: [{ teacherId: teacherAssignee, subject: subjectTag }],
  };
}
