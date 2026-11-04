export interface FormThuocState {
  tenThuoc: string;
  lieuLuong: string;
  gioUongDuKien: string;
  baoQuan: string;
  loiNhan: string;
  ngayUong: string;
}

export interface FormConditionState {
  loaiBenh: string;
  tenBenh: string;
  mucDoNguyHiem: number;
  luuYVanDong: string;
  luuYAnUong: string;
  phacDoSoCuu: string;
  soDienThoaiKhanCap: string;
  bacSiDieuTri: string;
  ghiChu: string;
}

export function getStatusBadge(status: string) {
  switch (status) {
    case 'CHO_TIEP_NHAN':
      return {
        label: 'Đã gửi - Đang chờ cô tiếp nhận',
        color: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
      };
    case 'DA_TIEP_NHAN':
      return {
        label: 'Cô đã nhận thuốc vào tủ lớp',
        color: 'bg-sky-50 text-sky-700 border-sky-200',
        dot: 'bg-sky-500',
      };
    case 'DA_CHO_UONG':
      return {
        label: 'Đã cho bé uống an toàn',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
      };
    case 'SU_CO':
      return {
        label: 'Bé nôn trớ / Có sự cố',
        color: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-500',
      };
    default:
      return {
        label: 'Đang xử lý',
        color: 'bg-slate-50 text-slate-700 border-slate-200',
        dot: 'bg-slate-400',
      };
  }
}
