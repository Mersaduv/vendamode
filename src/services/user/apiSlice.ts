import baseApi from '@/services/baseApi'

import type { AddUserAddressQuery, EditUserQuery, GetQuery, GetUserAddressResult, MsgResult, MsgResultSecond } from './types'
import { getToken } from '@/utils'

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
      query: ({page}) => ({
        url: `/api/addresses?page=${page}&pagesize=5`,
        method: 'GET',
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

export const { useEditUserMutation,useGetUserAddressInfoQuery, useAddUserAddressMutation,useEditUserAddressMutation } = userApiSlice
