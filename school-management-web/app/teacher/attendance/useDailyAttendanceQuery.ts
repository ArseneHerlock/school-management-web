import { useState, useEffect } from 'react';
import { CHILDREN } from '../data';
import { createHubConnection } from '@/services';
import { fetchDailyAttendanceData } from './components/attendanceData';

export function useDailyAttendanceQuery(selectedDate: string, childrenVersion: number) {
  const [absentIds, setAbsentIds] = useState<Set<number>>(new Set());
  const [lateIds, setLateIds] = useState<Set<number>>(new Set());
  const [approvedLeaveMap, setApprovedLeaveMap] = useState<
    Map<number, { reason: string; fromDate: string; toDate: string }>
  >(new Map());
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [checkedOutIds, setCheckedOutIds] = useState<Set<number>>(new Set());
  const [earlyPickedMap, setEarlyPickedMap] = useState<
    Map<number, { time: string; nguoiDon: string; lyDo: string }>
  >(new Map());
  const [loadingData, setLoadingData] = useState<boolean>(false);

  useEffect(() => {
    let isDisposed = false;
    const hubConnection = createHubConnection('attendance');
    if (hubConnection) {
      void hubConnection
        .start()
        .then(() => {
          if (isDisposed) {
            void hubConnection.stop();
            return;
          }
          hubConnection.on('DiemDanhCapNhat', () => {});
        })
        .catch((error: unknown) => {
          if (!isDisposed) console.warn('AttendanceHub warning:', error);
        });

      return () => {
        isDisposed = true;
        void hubConnection.stop();
      };
    }
  }, []);

  useEffect(() => {
    if (!CHILDREN.some((child) => child.apiId)) return;
    let isCancelled = false;
    setLoadingData(true);

    Promise.all([
      fetchDailyAttendanceData(selectedDate, CHILDREN),
      fetch(`/api/attendance/edge-cases?date=${selectedDate}`)
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
    ])
      .then(([{ leaveMap, absent, late }, edgeData]) => {
        if (!isCancelled) {
          setApprovedLeaveMap(leaveMap);
          setAbsentIds(absent);
          setLateIds(late);

          if (edgeData) {
            setIsLocked(Boolean(edgeData.isLocked));

            const newCheckedOut = new Set<number>();
            const newEarlyPicked = new Map<number, { time: string; nguoiDon: string; lyDo: string }>();

            if (Array.isArray(edgeData.records)) {
              edgeData.records.forEach((rec: any) => {
                const childObj = CHILDREN.find(
                  (c) => String(c.apiId).toLowerCase() === String(rec.HocSinhId).toLowerCase()
                );
                if (!childObj) return;

                if (rec.GioVe) newCheckedOut.add(childObj.id);

                if (rec.TrangThai === 'Về sớm' || rec.NguoiDon) {
                  newEarlyPicked.set(childObj.id, {
                    time: rec.GioVe ? String(rec.GioVe) : 'Giữa giờ',
                    nguoiDon: rec.NguoiDon || 'Người thân',
                    lyDo: rec.LyDoVeSom || 'Việc gia đình',
                  });
                  newCheckedOut.add(childObj.id);
                }
              });
            }

            setCheckedOutIds(newCheckedOut);
            setEarlyPickedMap(newEarlyPicked);
          } else {
            setIsLocked(false);
          }
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setAbsentIds(new Set());
          setLateIds(new Set());
          setApprovedLeaveMap(new Map());
          setIsLocked(false);
        }
      })
      .finally(() => {
        if (!isCancelled) setLoadingData(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedDate, childrenVersion]);

  return {
    absentIds,
    setAbsentIds,
    lateIds,
    setLateIds,
    approvedLeaveMap,
    setApprovedLeaveMap,
    isLocked,
    setIsLocked,
    checkedOutIds,
    setCheckedOutIds,
    earlyPickedMap,
    setEarlyPickedMap,
    loadingData,
  };
}
