export const WHO_ZSCORE_GUIDELINES = {
  HAZ: {
    title: "HAZ – Chiều cao theo tuổi",
    desc: "Đánh giá tình trạng phát triển chiều cao và phát hiện suy dinh dưỡng thể thấp còi.",
    rules: [
      { threshold: "Z-score ≥ -2", label: "Bình thường", type: "success" },
      { threshold: "-3 ≤ Z-score < -2", label: "Thấp còi", type: "warning" },
      { threshold: "Z-score < -3", label: "Thấp còi nặng", type: "danger" },
    ],
  },
  WAZ: {
    title: "WAZ – Cân nặng theo tuổi",
    desc: "Đánh giá tình trạng cân nặng theo chuẩn WHO 2006.",
    rules: [
      { threshold: "Z-score > +3", label: "Béo phì", type: "danger" },
      { threshold: "+2 < Z-score ≤ +3", label: "Thừa cân", type: "warning" },
      { threshold: "-2 ≤ Z-score ≤ +2", label: "Bình thường", type: "success" },
      { threshold: "-3 ≤ Z-score < -2", label: "Nhẹ cân", type: "warning" },
      { threshold: "Z-score < -3", label: "Nhẹ cân nặng", type: "danger" },
    ],
  },
  WHZ: {
    title: "WHZ – Cân nặng theo chiều cao",
    desc: "Đánh giá thể trạng phát triển cân đối, gầy còm cấp tính, thừa cân và béo phì.",
    rules: [
      { threshold: "Z-score > +3", label: "Béo phì", type: "danger" },
      { threshold: "+2 < Z-score ≤ +3", label: "Thừa cân", type: "warning" },
      { threshold: "-2 ≤ Z-score ≤ +2", label: "Bình thường", type: "success" },
      { threshold: "-3 ≤ Z-score < -2", label: "Gầy còm", type: "warning" },
      { threshold: "Z-score < -3", label: "Gầy còm nặng", type: "danger" },
    ],
  },
};

export function getWhoOverallAdvice(
  wazZ: number,
  hazZ: number,
  whzZ: number,
  hazCode: string,
  wazCode: string,
  whzCode: string
): { trangThaiTongThe: string; canCanThiep: boolean; loiKhuyen: string } {
  let trangThaiTongThe = 'Đạt chuẩn WHO';
  let canCanThiep = false;
  let loiKhuyen = 'Bé phát triển cân đối theo chuẩn WHO 2006. Duy trì chế độ dinh dưỡng và vận động hiện tại.';

  if (Math.abs(wazZ) > 5 || Math.abs(hazZ) > 5 || Math.abs(whzZ) > 5) {
    trangThaiTongThe = 'Cảnh báo số đo (> 5 SD)';
    canCanThiep = true;
    loiKhuyen = 'Số đo cân nặng hoặc chiều cao vượt quá ngưỡng sinh học khả dĩ (> 5 SD theo WHO Anthro). Cần kiểm tra lại có bị gõ nhầm số đo không.';
  } else {
    const activeLabels: string[] = [];
    if (hazCode === 'THAP_COI_NANG') activeLabels.push('Thấp còi nặng');
    else if (hazCode === 'THAP_COI') activeLabels.push('Thấp còi');

    if (wazCode === 'NHE_CAN_NANG') activeLabels.push('Nhẹ cân nặng');
    else if (wazCode === 'NHE_CAN') activeLabels.push('Nhẹ cân');

    if (whzCode === 'GAY_COM_NANG') activeLabels.push('Gầy còm nặng');
    else if (whzCode === 'GAY_COM') activeLabels.push('Gầy còm');

    if (whzCode === 'BEO_PHI' || wazCode === 'BEO_PHI') activeLabels.push('Béo phì');
    else if (whzCode === 'THUA_CAN' || wazCode === 'THUA_CAN') activeLabels.push('Thừa cân');

    if (activeLabels.length > 0) {
      trangThaiTongThe = activeLabels.join(' · ');
      canCanThiep = true;

      if (whzCode === 'BEO_PHI' || wazCode === 'BEO_PHI') {
        loiKhuyen = 'Trẻ béo phì (Z-score > +3 SD). Cần điều chỉnh khẩu phần ăn giảm tinh bột, nước ngọt có đường; tăng cường rau xanh và vận động ngoài trời ít nhất 60 phút mỗi ngày.';
      } else if (whzCode === 'THUA_CAN' || wazCode === 'THUA_CAN') {
        loiKhuyen = 'Trẻ thừa cân (+2 SD < Z-score ≤ +3 SD). Theo dõi sát cân nặng, hạn chế thức ăn nhiều dầu mỡ, đồ ngọt và duy trì thói quen tập thể dục hàng ngày.';
      } else if (whzCode === 'GAY_COM_NANG' || hazCode === 'THAP_COI_NANG' || wazCode === 'NHE_CAN_NANG') {
        loiKhuyen = 'Trẻ có dấu hiệu suy dinh dưỡng mức độ nặng (Z-score < -3 SD). Cần can thiệp y tế và chế độ dinh dưỡng điều trị tăng cường.';
      } else {
        loiKhuyen = 'Trẻ có dấu hiệu thiếu chuẩn dinh dưỡng (-3 SD ≤ Z-score < -2 SD). Cần tăng cường vi chất (Kẽm, Canxi, D3), bổ sung bữa phụ giàu đạm và năng lượng.';
      }
    }
  }

  return { trangThaiTongThe, canCanThiep, loiKhuyen };
}
