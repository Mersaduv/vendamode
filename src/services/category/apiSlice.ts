import baseApi from '@/services/baseApi'

import { generateQueryParams, getToken } from '@/utils'

import type {
  CreateCategoryQuery,
  GetCategoriesResult,
  GetSingleCategoryResult,
  GetSubCategoriesQuery,
  GetSubCategoriesResult,
  IdQuery,
  MsgResult,
  UpdateCategoryQuery,
} from './types'
import { ICategory, ServiceResponse } from '@/types'

export const categoryApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<GetCategoriesResult, void>({
      query: () => ({
        url: '/api/categories',
        method: 'GET',
      }),
      providesTags: (result) =>
        result?.data?.categoryDTO
          ? [
              ...result.data.categoryDTO.map(({ id }) => ({
                type: 'Category' as const,
                id: id,
              })),
              'Category',
            ]
          : ['Category'],
      
    }),

    getCategoriesTree: builder.query<ServiceResponse<ICategory[]>, void>({
      query: () => ({
        url: '/api/categories-tree',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: 'Category' as const,
                id: id,
              })),
              'Category',
            ]
          : ['Category'],
      
    }),

    getSingleCategory: builder.query<GetSingleCategoryResult, IdQuery>({
      query: ({ id }) => ({
        url: `/api/category/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) => [{ type: 'Category', id: arg.id }],
    }),

    getSubCategories: builder.query<GetSubCategoriesResult, GetSubCategoriesQuery>({
      query: ({ ...params }) => {
        const queryParams = generateQueryParams(params)
        return {
          url: `/api/category/subCategories?${queryParams}`,
          method: 'GET',
        }
      },
    }),

    updateCategory: builder.mutation<MsgResult, UpdateCategoryQuery>({
      query: (data) => ({
        url: `/api/category/${data.id}`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Category', id: arg.id }],
    }),

    createCategory: builder.mutation<MsgResult, CreateCategoryQuery>({
      query: (data) => ({
        url: '/api/category',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Category'],
    }),
  }),
})

export const {
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useGetSingleCategoryQuery,
  useUpdateCategoryMutation,
  useGetSubCategoriesQuery,
  useGetCategoriesTreeQuery
} = categoryApiSlice
