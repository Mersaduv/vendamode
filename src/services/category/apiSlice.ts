import baseApi from '@/services/baseApi'

import { generateQueryParams, getToken } from '@/utils'

import type {
  CreateCategoryQuery,
  GetAllCategoriesResult,
  GetCategoriesQuery,
  GetCategoriesResult,
  GetSingleCategoryResult,
  GetSubCategoriesQuery,
  GetSubCategoriesResult,
  IdAndQuery,
  IdQuery,
  MsgResult,
  UpdateCategoryFeature,
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
    }),

    getAllCategories: builder.query<GetAllCategoriesResult, GetCategoriesQuery>({
      query: ({ ...params }) => {
        const queryParams = generateQueryParams(params)
        return {
          url: `/api/all-categories?${queryParams}`,
          method: 'GET',
        }
      },
    }),

    getCategoriesTree: builder.query<ServiceResponse<ICategory[]>, void>({
      query: () => ({
        url: '/api/categories-tree',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
    }),

    getSingleCategory: builder.query<GetSingleCategoryResult, IdQuery>({
      query: ({ id }) => ({
        url: `/api/category/${id}`,
        method: 'GET',
      }),
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

    getParenSubCategories: builder.query<ServiceResponse<ICategory[]>, IdAndQuery>({
      query: ({ id, query }) => {
        const queryParams = generateQueryParams(query)
        return {
          url: `/api/category/parentSub/${id}?${queryParams}`,
          method: 'GET',
        }
      },
    }),

    updateCategory: builder.mutation<MsgResult, FormData>({
      query: (body) => ({
        url: `/api/category/update`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body,
      }),
    }),

    createCategory: builder.mutation<MsgResult, FormData>({
      query: (body) => ({
        url: `/api/category`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body,
      }),
    }),

    updateCategoryFeature: builder.mutation<ServiceResponse<boolean>, UpdateCategoryFeature>({
      query: (data) => {
        return {
          url: '/api/category/feature-update',
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      },
    }),

    deleteCategory: builder.mutation<MsgResult, IdQuery>({
      query: ({ id }) => ({
        url: `/api/category/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
})

export const {
  useGetParenSubCategoriesQuery,
  useGetCategoriesQuery,
  useGetAllCategoriesQuery,
  useGetSingleCategoryQuery,
  useGetSubCategoriesQuery,
  useGetCategoriesTreeQuery,
  useUpdateCategoryFeatureMutation,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApiSlice
