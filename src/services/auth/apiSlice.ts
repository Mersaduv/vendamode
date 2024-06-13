import baseApi from '@/services/baseApi'

import type {
  GenerateNewTokeResult,
  GenerateNewToken,
  LoginQuery,
  LoginResult,
  MsgResult,
  RegisterUserQuery,
  RegisterUserResult,
  UserData,
  UserResult,
} from './types'

import { setCredentials, clearCredentials, setCredentialsToken } from '@/store'
import { getToken } from '@/utils'
import { ApiError } from '@/types'

export const authApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegisterUserResult, RegisterUserQuery>({
      query: (data) => ({
        url: '/api/auth/register',
        method: 'POST',
        data,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data && data.data!.token && data.data!.refreshToken) {
            dispatch(
              setCredentials({
                token: data.data!.token,
                refreshToken: data.data!.refreshToken,
                userInfo: {
                  roles: data.data?.roles,
                  mobileNumber: data.data!.mobileNumber,
                  fullName: data.data!.fullName,
                  expireTime: data.data!.expireTime,
                  refreshTokenExpireTime: data.data!.refreshTokenExpireTime,
                },
                loggedIn: true,
              })
            )
          }
        } catch (error) {
          console.error('Failed to register and save tokens:', error)
        }
      },
    }),

    login: builder.mutation<LoginResult, LoginQuery>({
      query: (body) => ({
        url: '/api/auth/login',
        method: 'POST',
        body,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log(data)
          if (data && data.data!.token && data.data!.refreshToken) {
            dispatch(
              setCredentials({
                token: data.data!.token,
                refreshToken: data.data!.refreshToken,
                userInfo: {
                  roles: data.data?.roles,
                  mobileNumber: data.data!.mobileNumber,
                  fullName: data.data!.fullName,
                  expireTime: data.data!.expireTime,
                  refreshTokenExpireTime: data.data!.refreshTokenExpireTime,
                },
                loggedIn: true,
              })
            )
          }
        } catch (error) {
          console.error('Failed to login and save tokens:', error)
        }
      },
    }),
    logout: builder.mutation<MsgResult, void>({
      query: () => ({
        url: '/api/auth/logout',
        method: 'GET',
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          // Clear credentials in redux store
          dispatch(clearCredentials())
          console.log("success" , (await queryFulfilled).data)
        } catch (error) {
          console.error('Failed to logout:', error)
        }
      },
    }),

    generateNewToken: builder.mutation<GenerateNewTokeResult, GenerateNewToken>({
      query: (data) => ({
        url: '/api/auth/generateToken',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data && data.data!.token && data.data!.refreshToken) {
            console.log('generateNewToken -----------', data)
            dispatch(
              setCredentialsToken({
                token: data.data!.token,
                refreshToken: data.data!.refreshToken,
                loggedIn: true,
              })
            )
          }
        } catch (error) {
          console.error('Failed to refresh token:', error)
          dispatch(clearCredentials())
        }
      },
    }),

    getUserInfo: builder.query<UserResult, string>({
      query: (mobileNumber) => ({
        url: `/api/user/info?mobileNumber=${mobileNumber}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
      async onQueryStarted(mobileNumber, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled
          // save new data localStorage
          window.localStorage.setItem('userInfo', JSON.stringify(data.data))
        } catch (error) {
          const err = error as ApiError
          if (err.error.status === 401) {
            console.log('try to getting new token ------------', err.error.status)
            // if 401 unauthorize
            const token = window.localStorage.getItem('token')
            const refreshToken = window.localStorage.getItem('refreshToken')
            try {
              const { data: newTokenData } = await dispatch(
                authApiSlice.endpoints.generateNewToken.initiate({ token: token!, refreshToken: refreshToken! })
              ).unwrap()

              dispatch(
                setCredentialsToken({
                  token: newTokenData!.token,
                  refreshToken: newTokenData!.refreshToken,
                  loggedIn: true,
                })
              )

              // try again to getting new data of user by new token
              const { data } = await dispatch(authApiSlice.endpoints.getUserInfo.initiate(mobileNumber)).unwrap()
              console.log('save new data into local storage ------------', data)
              // save new data on localStorage
              window.localStorage.setItem('userInfo', JSON.stringify(data))
            } catch (error) {
              console.error('Failed to refresh token and retry getUserInfo:', error)
              dispatch(clearCredentials())
            }
          } else {
            console.error('Failed to fetch user info:', error)
          }
        }
      },
    }),

    getUserInfoMe: builder.query<UserData, void>({
      query: () => ({
        url: `/api/user/info/me`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled
          // save new data localStorage
          console.log('getUserInfo ------------', data)
          window.localStorage.setItem('userInfo', JSON.stringify(data.data))    } catch (error) {
          const err = error as ApiError
          if (err.error.status === 401) {
            console.log('try to getting new token ------------', err.error.status)
            // if 401 unauthorize
            const token = window.localStorage.getItem('token')
            const refreshToken = window.localStorage.getItem('refreshToken')
            try {
              const { data: newTokenData } = await dispatch(
                authApiSlice.endpoints.generateNewToken.initiate({ token: token!, refreshToken: refreshToken! })
              ).unwrap()

              dispatch(
                setCredentialsToken({
                  token: newTokenData!.token,
                  refreshToken: newTokenData!.refreshToken,
                  loggedIn: true,
                })
              )

              // try again to getting new data of user by new token
              const { data } = await dispatch(authApiSlice.endpoints.getUserInfo.initiate(newTokenData?.mobileNumber!)).unwrap()
              console.log('save new data into local storage ------------', data)
              // save new data on localStorage
              window.localStorage.setItem('userInfo', JSON.stringify(data))
            } catch (error) {
              console.error('Failed to refresh token and retry getUserInfo:', error)
              dispatch(clearCredentials())
            }
          } else {
            console.error('Failed to fetch user info:', error)
          }
        }
      },
    }),
  }),
})

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useGenerateNewTokenMutation,
  useGetUserInfoQuery,
  useGetUserInfoMeQuery,
} = authApiSlice
