export type UserAccount = {
  id: string
  userName: string
  displayName: string
  phone?: string
  email?: string | null
  status: string
  mustChangePassword: boolean
  roles: string[]
  rawUserName?: string
}
