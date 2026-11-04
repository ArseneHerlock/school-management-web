import React from 'react';
import { Info } from 'lucide-react';

export type WhoFilterGroup =
  | 'ALL'
  | 'DAT_CHUAN_WHO'
  | 'THAP_COI'
  | 'THAP_COI_NANG'
  | 'NHE_CAN'
  | 'NHE_CAN_NANG'
  | 'GAY_COM'
  | 'GAY_COM_NANG'
  | 'THUA_CAN'
  | 'BEO_PHI';

export interface WhoGroupButtonItem {
  key: WhoFilterGroup;
  label: string;
  sub: string;
  count: number;
  icon: React.ElementType;
  activeClass: string;
  idleClass: string;
  iconIdle: string;
  subActive: string;
}

interface TeacherHealthFcmButtonsProps {
  buttons: WhoGroupButtonItem[];
  filterGroup: WhoFilterGroup;
  setFilterGroup: (g: WhoFilterGroup) => void;
}

export function TeacherHealthFcmButtons({
  buttons,
  filterGroup,
  setFilterGroup,
}: TeacherHealthFcmButtonsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {buttons.map((btn) => {
          const IconComp = btn.icon;
          const isSelected = filterGroup === btn.key;
          return (
            <button
              key={btn.key}
              type="button"
              onClick={() => setFilterGroup(isSelected ? 'ALL' : btn.key)}
              className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                isSelected ? btn.activeClass : btn.idleClass
              }`}
            >
              <div className="flex items-center justify-between">
                <IconComp size={18} className={isSelected ? 'text-white' : btn.iconIdle} />
                <span className="text-lg font-black">{btn.count}</span>
              </div>
              <p className="text-xs font-black mt-2">{btn.label}</p>
              <p className={`text-[10px] ${isSelected ? btn.subActive : 'text-slate-400'}`}>
                {btn.sub}
              </p>
            </button>
          );
        })}
      </div>

      <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200/80 text-xs text-indigo-950 flex items-start gap-3">
        <Info size={18} className="text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Biện pháp điều chỉnh kịp thời cho giáo viên: </span>
          {(filterGroup === 'THAP_COI' || filterGroup === 'THAP_COI_NANG') &&
            'Với các bé thấp còi / thấp còi nặng: Nhắc nhở phụ huynh bổ sung vi chất (Canxi, Kẽm, Vitamin D3); khuyến khích bé uống đủ sữa tại lớp và tham gia các hoạt động vươn vai, kéo giãn ngoài trời.'}
          {(filterGroup === 'NHE_CAN' || filterGroup === 'NHE_CAN_NANG') &&
            'Với các bé nhẹ cân / nhẹ cân nặng: Phối hợp nhà bếp tăng khẩu phần đạm và dầu mỡ lành mạnh; theo dõi bé ăn hết suất và bổ sung bữa phụ buổi chiều.'}
          {(filterGroup === 'GAY_COM' || filterGroup === 'GAY_COM_NANG') &&
            'Với các bé gầy còm / gầy còm nặng (suy dinh dưỡng cấp): Báo ngay cho phụ huynh và nhân viên y tế trường để có chế độ chăm sóc và theo dõi cân nặng hàng tuần.'}
          {(filterGroup === 'THUA_CAN' || filterGroup === 'BEO_PHI') &&
            'Với các bé thừa cân / béo phì: Hạn chế cho bé ăn thêm tinh bột hoặc uống nước ngọt có đường; khuyến khích bé làm "trực nhật", tăng cường chạy nhảy vận động ngoài trời ít nhất 60 phút mỗi ngày.'}
          {(filterGroup === 'ALL' || filterGroup === 'DAT_CHUAN_WHO') &&
            'Bấm vào một trong 9 mức phân loại WHO ở trên (Đạt chuẩn WHO, Thấp còi, Thấp còi nặng, Nhẹ cân, Nhẹ cân nặng, Gầy còm, Gầy còm nặng, Thừa cân, Béo phì) để lọc danh sách các bé cần hỗ trợ đặc biệt.'}
        </div>
      </div>
    </div>
  );
}
