// sizeApiSlice.ts
import baseApi from '@/services/baseApi'
import { getToken } from '@/utils'
import type {
  GetSizesResult,
  GetSizeResult,
  GetProductSizeResult,
  CreateSizeResult,
  DeleteSizeResult,
  IdQuery,
  CreateSizeQuery,
  IdsQuery,
} from './types'
import { ServiceResponse } from '@/types'

export const sizeApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSizes: builder.query<GetSizesResult, void>({
      query: () => ({
        url: '/api/sizes',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
    }),

    getSize: builder.query<GetSizeResult, IdQuery>({
      query: ({ id }) => ({
        url: `/api/size/${id}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
    }),

    getSizeByCategoryId: builder.query<GetProductSizeResult, IdsQuery>({
      query: (ids) => ({
        url: `/api/size/category-sizes/${ids.categoryId}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
    }),

    getSizeByProductSizeId: builder.query<GetProductSizeResult, IdsQuery>({
      query: (ids) => ({
        url: `/api/size/category-productSizes/${ids.productSizeId}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
    }),

    createSize: builder.mutation<CreateSizeResult, CreateSizeQuery>({
      query: (body) => ({
        url: '/api/size',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body,
      }),
    }),

    createCategorySize: builder.mutation<ServiceResponse<boolean>, FormData>({
      query: (body) => ({
        url: '/api/size/category',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body,
      }),
    }),

    updateCategorySize: builder.mutation<ServiceResponse<boolean>, FormData>({
      query: (body) => ({
        url: '/api/size/category-update',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body,
      }),
    }),

    deleteSize: builder.mutation<DeleteSizeResult, IdQuery>({
      query: ({ id }) => ({
        url: `/api/size/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
    }),
  }),
})

export const {
  useGetSizesQuery,
  useGetSizeQuery,
  useGetSizeByCategoryIdQuery,
  useGetSizeByProductSizeIdQuery,
  useCreateSizeMutation,
  useUpdateCategorySizeMutation,
  useCreateCategorySizeMutation,
  useDeleteSizeMutation,
} = sizeApiSlice
