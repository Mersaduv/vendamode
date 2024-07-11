import baseApi from '@/services/baseApi'

import type {
  CreateReviewQuery,
  EditReviewQuery,
  GetProductReviewsQuery,
  GetProductReviewsResult,
  GetReviewsQuery,
  GetReviewsResult,
  GetSingleReviewResult,
  IdQuery,
  MsgResult,
} from './types'
import { ServiceResponse } from '@/types'
import { getToken } from '@/utils'

export const reviewApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query<GetReviewsResult, GetReviewsQuery>({
      query: ({ page }) => ({
        url: `/api/reviews?page=${page}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
      providesTags: (result) =>
        result?.data?.pagination.data
          ? [
              ...result.data?.pagination?.data.map(({ id }) => ({
                type: 'Review' as const,
                id: id,
              })),
              'Review',
            ]
          : ['Review'],
    }),

    createReview: builder.mutation<ServiceResponse<boolean>, FormData>({
      query: (body) => ({
        url: `/api/reviews`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body,
      }),
      invalidatesTags: ['Review'],
    }),

    getProductReviews: builder.query<GetProductReviewsResult, GetProductReviewsQuery>({
      query: ({ id, page }) => ({
        url: `/api/reviews/${id}?page=${page}&pageSize=5`,
        method: 'GET',
      }),
      providesTags: (result) =>
        result?.data?.pagination.data
          ? [
              ...result.data?.pagination.data.map(({ id }) => ({
                type: 'Review' as const,
                id: id,
              })),
              'Review',
            ]
          : ['Review'],
    }),

    getSingleReview: builder.query<GetSingleReviewResult, IdQuery>({
      query: ({ id }) => ({
        url: `/api/review/${id}`,
        method: 'GET',
      }),
      providesTags: (result, err, arg) => [{ type: 'Review', id: arg.id }],
    }),

    deleteReview: builder.mutation<MsgResult, IdQuery>({
      query: ({ id }) => ({
        url: `/api/reviews/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Review'],
    }),

    editReview: builder.mutation<MsgResult, EditReviewQuery>({
      query: ({ id, body }) => ({
        url: `/api/reviews/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, err, arg) => [{ type: 'Review', id: arg.id }],
    }),
  }),
})

export const {
  useGetReviewsQuery,
  useGetSingleReviewQuery,
  useDeleteReviewMutation,
  useGetProductReviewsQuery,
  useEditReviewMutation,
  useCreateReviewMutation,
} = reviewApiSlice
