import { checkInStudent, checkOutStudent } from '@/services';
import { Child } from '../data';

export const getLocalDateString = (date = new Date()) => {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
};

export async function submitLockMorningAction(
  selectedDate: string,
  children: Child[],
  absentIds: Set<number>,
  lateIds: Set<number>
) {
  const utcNgay = `${selectedDate}T00:00:00Z`;

  const requests = children.filter((child) => child.apiId).map((child) =>
    checkInStudent({
      hocSinhId: child.apiId!,
      ngay: utcNgay,
      trangThai: absentIds.has(child.id)
        ? 'Vắng có phép'
        : lateIds.has(child.id)
        ? 'Đi muộn'
        : 'Có mặt',
    })
  );
  await Promise.all(requests);

  await fetch('/api/attendance/edge-cases', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'LOCK_DAY',
      date: selectedDate,
    }),
  });
}

export async function submitLateArrivalAction(
  childApiId: string,
  selectedDate: string,
  data: { time: string; coAnTrua: boolean; note: string }
) {
  await fetch('/api/attendance/edge-cases', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'LATE_ARRIVAL',
      hocSinhId: childApiId,
      date: selectedDate,
      time: data.time,
      coAnTrua: data.coAnTrua,
      ghiChu: data.note,
    }),
  });
}

export async function submitEarlyPickupAction(
  childApiId: string,
  selectedDate: string,
  data: { time: string; nguoiDon: string; lyDo: string; note: string }
) {
  await fetch('/api/attendance/edge-cases', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'EARLY_PICKUP',
      hocSinhId: childApiId,
      date: selectedDate,
      time: data.time,
      nguoiDon: data.nguoiDon,
      lyDoVeSom: data.lyDo,
      ghiChu: data.note,
    }),
  });
}

export async function submitCheckOutAction(childApiId: string, selectedDate: string) {
  const utcNgay = `${selectedDate}T00:00:00Z`;
  await checkOutStudent({
    hocSinhId: childApiId,
    ngay: utcNgay,
  });
}
