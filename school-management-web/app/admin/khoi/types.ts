export type Grade = {
  id: string;
  maKhoi: string;
  tenKhoi: string;
  doTuoiBatDau: number;
  doTuoiKetThuc: number;
  moTa?: string;
};

export type GradeFormData = {
  maKhoi: string;
  tenKhoi: string;
  doTuoiBatDau: number;
  doTuoiKetThuc: number;
  moTa: string;
};
