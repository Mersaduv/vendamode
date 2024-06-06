import baseApi from '@/services/baseApi'

import type { EditUserQuery, GetUsersQuery, GetUsersResult, MsgResult } from './types'

export const userApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<GetUsersResult, GetUsersQuery>({
      query: ({ page, pageSize = 5 }) => ({
        url: `/api/auth/user?page=${page}&page_size=${pageSize}`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    editUser: builder.mutation<MsgResult, EditUserQuery>({
      query: ({ body }) => ({
        url: '/api/auth/user',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    // getUserInfo: builder.query<GetUserInfoResult, void>({
    //   query: () => ({
    //     url: '/api/auth/user/me',
    //     method: 'GET',
    //     credentials: 'include',
    //   }),
    //   providesTags: ['User'],
    // }),
  }),
})

export const { useEditUserMutation, useGetUsersQuery } = userApiSlice
