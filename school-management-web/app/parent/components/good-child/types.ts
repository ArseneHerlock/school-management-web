export const list = (value: any) =>
  Array.isArray(value) ? value : Array.isArray(value?.items) ? value.items : [];

export const flowers = (record: any) =>
  Array.isArray(record?.flowers) ? record.flowers : [];

export const activeFlowers = (record: any) =>
  flowers(record).filter((flower: any) => !flower.isRevoked);

export const isLarge = (flower: any) =>
  Number(flower.flowerType) === 2 ||
  String(flower.flowerType).toLowerCase() === 'vàng' ||
  String(flower.flowerType).toLowerCase() === 'star';
