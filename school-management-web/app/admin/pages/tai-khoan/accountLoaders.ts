import { getUsers, getStaff, getParents } from '@/services'
import { UserAccount } from './types'

export async function loadAllUserAccounts(): Promise<UserAccount[]> {
  let usersList: any[] = []

  try {
    const x = await getUsers()
    const payload: any = x
    const items = Array.isArray(payload) ? payload : Array.isArray(payload?.items) ? payload.items : []
    if (items.length > 0) {
      usersList = items
    }
  } catch (err) {
    console.warn('Could not fetch users list from auth service:', err)
  }

  const [staff, parents] = await Promise.all([
    getStaff().catch(() => []),
    getParents().catch(() => []),
  ])

  const staffArr: any[] = Array.isArray(staff) ? staff as any[] : []
  const parentArr: any[] = Array.isArray(parents) ? parents as any[] : []

  const parentByAccountId = new Map<string, any>()
  const parentById = new Map<string, any>()
  parentArr.forEach((p) => {
    const accId = p.taiKhoanId || p.TaiKhoanId
    if (accId) parentByAccountId.set(String(accId).toLowerCase(), p)
    if (p.id) parentById.set(String(p.id).toLowerCase(), p)
  })

  const staffByUserId = new Map<string, any>()
  staffArr.forEach((s) => {
    const uId = s.userId || s.UserId || s.staffId || s.StaffId
    if (uId) staffByUserId.set(String(uId).toLowerCase(), s)
  })

  const mergedMap = new Map<string, UserAccount>()

  mergedMap.set('admin-001', {
    id: 'admin-001',
    userName: 'admin',
    displayName: 'Quản trị viên Hệ thống',
    email: 'admin@onekids.edu.vn',
    status: 'Active',
    mustChangePassword: false,
    roles: ['ADMIN'],
    rawUserName: 'admin',
  })

  usersList.forEach((u) => {
    const uId = String(u.id || u.userId || u.Id || '').toLowerCase()
    if (!uId) return

    const rawUserName = String(u.userName || u.UserName || '')
    const pInfo =
      parentByAccountId.get(uId) ||
      parentById.get(uId) ||
      parentById.get(rawUserName.toLowerCase()) ||
      parentByAccountId.get(rawUserName.toLowerCase())
    const sInfo =
      staffByUserId.get(uId) ||
      staffByUserId.get(rawUserName.toLowerCase())

    let displayName =
      pInfo?.hoTen ||
      pInfo?.HoTen ||
      sInfo?.fullName ||
      sInfo?.FullName ||
      ''
    let phone =
      pInfo?.soDienThoai ||
      pInfo?.SoDienThoai ||
      sInfo?.phoneNumber ||
      sInfo?.PhoneNumber ||
      ''

    const isGuidName =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        rawUserName
      )
    let loginUserName = rawUserName
    if (isGuidName || !rawUserName) {
      loginUserName = phone || displayName || rawUserName
    }
    if (!displayName) {
      displayName = loginUserName || 'Người dùng'
    }

    const rolesList = Array.isArray(u.roles)
      ? u.roles
      : [u.roles || (pInfo ? 'PHU_HUYNH' : sInfo ? 'GIAO_VIEN' : 'USER')]

    mergedMap.set(uId, {
      id: u.id || uId,
      userName: loginUserName,
      displayName: displayName,
      phone: phone,
      email: u.email || pInfo?.email || sInfo?.email || null,
      status: u.status || 'Active',
      mustChangePassword: Boolean(u.mustChangePassword),
      roles: rolesList,
      rawUserName: rawUserName,
    })
  })

  parentArr.forEach((p) => {
    const uId = String(p.taiKhoanId || p.TaiKhoanId || p.id || p.Id || '').toLowerCase()
    if (uId && !mergedMap.has(uId)) {
      mergedMap.set(uId, {
        id: uId,
        userName: p.soDienThoai || p.SoDienThoai || p.hoTen || p.HoTen || uId,
        displayName: p.hoTen || p.HoTen || 'Phụ huynh',
        phone: p.soDienThoai || p.SoDienThoai || '',
        email: p.email || p.Email || null,
        status: p.trangThai || p.TrangThai || 'Active',
        mustChangePassword: Boolean(p.mustChangePassword),
        roles: ['PHU_HUYNH'],
        rawUserName: p.soDienThoai || uId,
      })
    }
  })

  staffArr.forEach((s) => {
    const uId = String(s.userId || s.UserId || s.staffId || s.StaffId || '').toLowerCase()
    if (uId && !mergedMap.has(uId)) {
      mergedMap.set(uId, {
        id: uId,
        userName: s.staffCode || s.phoneNumber || s.email || s.fullName || uId,
        displayName: s.fullName || s.FullName || 'Nhân sự',
        phone: s.phoneNumber || s.PhoneNumber || '',
        email: s.email || s.Email || null,
        status: s.status || s.Status || 'Active',
        mustChangePassword: Boolean(s.mustChangePassword),
        roles: [s.role || s.Role || 'GIAO_VIEN'],
        rawUserName: s.staffCode || uId,
      })
    }
  })

  return Array.from(mergedMap.values())
}
