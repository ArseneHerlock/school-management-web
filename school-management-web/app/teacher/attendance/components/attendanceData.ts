import { getDailyAttendance, getChildAttendanceHistory } from '@/services/attendance'
import { getLeaves } from '@/services/leave'
import { Child } from '../../data'

export async function fetchDailyAttendanceData(selectedDate: string, children: Child[]) {
  const [records, leavesData] = await Promise.all([
    getDailyAttendance(selectedDate).catch(() => []),
    getLeaves({ status: 'Approved', subjectType: 'Child' }).catch(() => []),
  ])

  const attList = Array.isArray(records) ? records : []
  const attMap = new Map(attList.map((x: any) => [String(x.hocSinhId || x.HocSinhId), x]))
  const rawLeaves = Array.isArray(leavesData) ? leavesData : Array.isArray((leavesData as any)?.items) ? (leavesData as any).items : []
  const leaveMap = new Map<number, { reason: string; fromDate: string; toDate: string }>()
  const curDate = selectedDate.slice(0, 10)

  children.forEach((child) => {
    if (!child.apiId) return
    const match = rawLeaves.find((l: any) => {
      const cId = String(l.childId || l.ChildId || '')
      if (cId !== String(child.apiId)) return false
      const from = String(l.fromDate || l.FromDate || '').slice(0, 10)
      const to = String(l.toDate || l.ToDate || '').slice(0, 10)
      const statusStr = String(l.status || l.Status || '').toLowerCase()
      const isApp = statusStr === 'approved' || statusStr === '1' || statusStr === 'daduyet'
      return isApp && from <= curDate && curDate <= to
    })

    if (match) {
      leaveMap.set(child.id, {
        reason: match.reason || match.Reason || 'Nghỉ phép có đơn',
        fromDate: String(match.fromDate || match.FromDate || '').slice(0, 10),
        toDate: String(match.toDate || match.ToDate || '').slice(0, 10),
      })
    }
  })

  const absent = new Set<number>()
  const late = new Set<number>()

  children.forEach((child) => {
    if (!child.apiId) return
    const rec: any = attMap.get(String(child.apiId))
    const status = rec?.trangThai || rec?.TrangThai || (rec ? 'Có mặt' : 'Chưa điểm danh')

    if (status === 'Đi muộn') {
      late.add(child.id)
    } else if (status === 'Vắng có phép' || status === 'Vắng không phép') {
      absent.add(child.id)
    } else if (!rec && leaveMap.has(child.id)) {
      absent.add(child.id)
    }
  })

  return { leaveMap, absent, late }
}

export async function fetchAttendanceHistory(
  children: Child[],
  historyFrom: string,
  historyTo: string
) {
  return Promise.all(
    children
      .filter((child) => child.apiId)
      .map(async (child) => {
        try {
          const result = await getChildAttendanceHistory(child.apiId!, historyFrom, historyTo)
          return {
            childId: String(child.apiId),
            childName: child.name,
            rows: Array.isArray(result) ? result : [],
          }
        } catch {
          return { childId: String(child.apiId), childName: child.name, rows: [] }
        }
      })
  )
}
