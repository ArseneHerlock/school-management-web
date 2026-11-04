import { z } from "zod";

export type Student = {
  id: string;
  tenHocSinh: string;
  ngaySinh: string;
  gioiTinh: string;
  diaChi: string;
  lopId?: string | null;
  trangThaiHoc?: string;
};

export type Cls = {
  id: string;
  tenLop: string;
  siSo: number;
  giaoVienChuNhiemId: string;
};

export type StudentFormState = {
  tenHocSinh: string;
  ngaySinh: string;
  gioiTinh: string;
  diaChi: string;
  lopId: string;
  trangThaiHoc: string;
};

export const emptyStudentForm: StudentFormState = {
  tenHocSinh: "",
  ngaySinh: "",
  gioiTinh: "Nam",
  diaChi: "",
  lopId: "",
  trangThaiHoc: "Đang học",
};

export const studentFormSchema = z.object({
  tenHocSinh: z
    .string()
    .trim()
    .min(2, "Họ và tên học sinh tối thiểu 2 ký tự.")
    .max(100, "Họ và tên tối đa 100 ký tự."),
  ngaySinh: z.string().refine((val) => {
    if (!val) return false;
    const birthDate = new Date(val);
    const now = new Date();
    const ageInYears =
      (now.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    return ageInYears >= 0.8 && ageInYears <= 7;
  }, "Độ tuổi học sinh mầm non phải từ 12 tháng đến 6 tuổi (theo Thông tư Bộ GD&ĐT)."),
  gioiTinh: z.string().min(1, "Vui lòng chọn giới tính."),
  lopId: z.string().optional(),
  diaChi: z.string().max(255, "Địa chỉ tối đa 255 ký tự.").optional(),
});
