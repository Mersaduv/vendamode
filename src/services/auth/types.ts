import { IUser, ServiceResponse } from '@/types'

export type MsgResult = { msg: string }

export type GenerateNewToken = {
  token: string
  refreshToken: string
}
export type GenerateNewTokeResult = ServiceResponse<ResultBody>

export type RegisterUserResult = ServiceResponse<ResultBody>
export type RegisterUserQuery = {
  mobileNumber: string
  passCode: string
}

interface ResultBody {
  roles: string[]
  mobileNumber: string
  fullName: string
  token: string
  refreshToken: string
  refreshTokenExpireTime: number
  expireTime: number
  loggedIn: boolean
}
export type LoginResult = ServiceResponse<ResultBody>
export type LoginQuery = {
  mobileNumber: string
  password: string
}


export type UserResult = ServiceResponse<ResultBody>

export type UserData = ServiceResponse<IUser>


