export interface FlowerRecord {
  id: string;
  flowerDate: string;
  reason?: string;
  flowerType: number; // 1: Hoa nhỏ, 2: Hoa lớn
  isRevoked?: boolean;
}

export interface GoodChildRecord {
  id: string;
  childId: string;
  month: number;
  year: number;
  dailyFlowerCount: number;
  bonusFlowerCount: number;
  flowers?: FlowerRecord[];
}
