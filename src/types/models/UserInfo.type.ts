export default interface IUserInfo {
  roles: string[]
  mobileNumber: string | null
  fullName: string | null
  expireTime: number | null
  refreshTokenExpireTime: number | null
}
