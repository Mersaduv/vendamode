import type { AddressFormBody, IAddress, IPagination, IUser, ProfileForm, ServiceResponse } from '@/types'

interface ResultBody {
  guid: string
}
export type MsgResult = ServiceResponse<ResultBody>
export type MsgResultSecond = ServiceResponse<boolean>

export type GetUsersResult = {
  users: Exclude<IUser, 'password' | 'address'>[]
  usersLength: number
  pagination: IPagination
}
export type GetQuery = {
  page: number
  pageSize?: number
}
export type EditUserQuery = {
  body: ProfileForm
}
export type GetUserInfoResult = Exclude<IUser, 'password'>

// address
export type AddUserAddressQuery = {
  body: Omit<IAddress, 'id' | 'userId'>
}

export type GetUserAddressResult =ServiceResponse<IAddress>
