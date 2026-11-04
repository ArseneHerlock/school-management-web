import { z } from "zod";
import { ClassItem, Grade } from "./types";

export const classFormSchema = z
  .object({
    tenLop: z.string().trim().min(1, "Tên lớp không được để trống.").max(100),
    siSo: z
      .coerce
      .number()
      .int()
      .min(1, "Sĩ số phải lớn hơn 0.")
      .max(35, "Sĩ số lớp mầm non tối đa 35 trẻ theo Thông tư 19/2023 của Bộ GD&ĐT."),
    namHoc: z.string().trim().regex(/^\d{4}-\d{4}$/, "Năm học phải theo dạng YYYY-YYYY."),
    giaoVienChuNhiemId: z.string().uuid("Vui lòng chọn Giáo viên phụ trách 1 (Chủ nhiệm)."),
    giaoVienPhuId: z.string().uuid("Vui lòng chọn Giáo viên phụ trách 2 (Đồng phụ trách). Mỗi lớp mầm non bắt buộc 2 cô."),
    khoiId: z.string().uuid("Vui lòng chọn khối học."),
  })
  .refine((data) => data.giaoVienChuNhiemId !== data.giaoVienPhuId, {
    message: "Hai giáo viên phụ trách lớp không được trùng nhau.",
    path: ["giaoVienPhuId"],
  });

export function generateNextClassName(
  gradeId: string,
  currentClasses: ClassItem[],
  gradesList: Grade[]
): string {
  const selectedGrade = gradesList.find((gradeItem) => gradeItem.id === gradeId);
  if (!selectedGrade) {
    return "Lớp Mới 1";
  }

  const rawGradeName = selectedGrade.tenKhoi.replace(/^(Khối\s+)/i, "").trim();
  const classesInSameGrade = currentClasses.filter((classItem) => classItem.khoiId === gradeId);

  let maxNumber = 0;
  classesInSameGrade.forEach(function (classItem) {
    const matchResult = classItem.tenLop.match(/(\d+)$/);
    if (matchResult) {
      const extractedNumber = parseInt(matchResult[1], 10);
      if (extractedNumber > maxNumber) {
        maxNumber = extractedNumber;
      }
    }
  });

  return `Lớp ${rawGradeName} ${maxNumber + 1}`;
}
