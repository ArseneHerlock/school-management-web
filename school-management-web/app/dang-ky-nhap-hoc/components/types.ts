import React from "react";

export interface AdmissionFormData {
  // Child info
  tenTre: string;
  gioiTinh: string;
  ngaySinh: string;
  danToc: string;
  canNang: string;
  chieuCao: string;
  tienSuBenh: string;
  conThuMay: string;
  tongSoCon: string;
  namHoc: string;
  khoiMongMuon: string;

  // Father info
  tenCha: string;
  namSinhCha: string;
  trinhDoCha: string;
  ngheNghiepCha: string;
  noiLamViecCha: string;
  dienThoaiCha: string;

  // Mother info
  tenMe: string;
  namSinhMe: string;
  trinhDoMe: string;
  ngheNghiepMe: string;
  noiLamViecMe: string;
  dienThoaiMe: string;

  // Household & Address
  hoKhauThuongTru: string;
  choOHienNay: string;
  tenChuHo: string;
  dienThoaiLienHe: string;
  ghiChu: string;
}

export const INITIAL_FORM_DATA: AdmissionFormData = {
  tenTre: "",
  gioiTinh: "Nam",
  ngaySinh: "",
  danToc: "Kinh",
  canNang: "",
  chieuCao: "",
  tienSuBenh: "",
  conThuMay: "1",
  tongSoCon: "1",
  namHoc: "2026 - 2027",
  khoiMongMuon: "Khối Mầm",
  tenCha: "",
  namSinhCha: "",
  trinhDoCha: "",
  ngheNghiepCha: "",
  noiLamViecCha: "",
  dienThoaiCha: "",
  tenMe: "",
  namSinhMe: "",
  trinhDoMe: "",
  ngheNghiepMe: "",
  noiLamViecMe: "",
  dienThoaiMe: "",
  hoKhauThuongTru: "",
  choOHienNay: "",
  tenChuHo: "",
  dienThoaiLienHe: "",
  ghiChu: "",
};

export type FormChangeHandler = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >
) => void;
