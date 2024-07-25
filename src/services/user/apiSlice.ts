import baseApi from '@/services/baseApi'

import type {
  AddUserAddressQuery,
  EditUserQuery,
  GetQuery,
  GetUserAddressResult,
  MsgResult,
  MsgResultSecond,
} from './types'
import { getToken } from '@/utils'
import { ServiceResponse } from '@/types'

export const userApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    editUser: builder.mutation<MsgResult, EditUserQuery>({
      query: ({ body }) => ({
        url: '/api/user',
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body,
      }),
    }),

    addUserAddress: builder.mutation<MsgResultSecond, AddUserAddressQuery>({
      query: ({ body }) => ({
        url: '/api/address',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body,
      }),
    }),

    editUserAddress: builder.mutation<MsgResultSecond, AddUserAddressQuery>({
      query: ({ body }) => ({
        url: '/api/address',
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body,
      }),
    }),

    getUserAddressInfo: builder.query<GetUserAddressResult, GetQuery>({
      query: ({ page }) => ({
        url: `/api/addresses?page=${page}&pagesize=5`,
        method: 'GET',
      }),
    }),

    deleteUserAddress: builder.mutation<ServiceResponse<boolean>, string>({
      query: (id) => ({
        url: `/api/address/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
    }),

    // editUser: builder.mutation<MsgResult, EditUserQuery>({
    //   query: ({ body }) => ({
    //     url: '/api/user',
    //     method: 'PUT',
    //     headers: {
    //       Authorization: `Bearer ${getToken()}`,
    //     },
    //     body,
    //   }),
    //   invalidatesTags: ['User'],
    // }),
  }),
})

export const {
  useDeleteUserAddressMutation,
  useEditUserMutation,
  useGetUserAddressInfoQuery,
  useAddUserAddressMutation,
  useEditUserAddressMutation,
} = userApiSlice
