import baseApi from '@/services/baseApi'
import { generateQueryParams, getToken } from '@/utils'
import {
  CreateBrandQuery,
  GetAllBrandsResult,
  GetBrandsQuery,
  GetBrandsResult,
  GetSingleBrandResult,
  IdQuery,
  MsgResult,
  UpdateBrandQuery,
} from './types'

export const brandApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBrands: builder.query<GetAllBrandsResult, void>({
      query: () => ({
        url: '/api/allBrands',
        method: 'GET',
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result?.data.map(({ id }) => ({
                type: 'Brand' as const,
                id: id,
              })),
              'Brand',
            ]
          : ['Brand'],
    }),

    getBrands: builder.query<GetBrandsResult, GetBrandsQuery>({
      query: ({ ...params }) => {
        const queryParams = generateQueryParams(params)
        return {
          url: `/api/brands?${queryParams}`,
          method: 'GET',
        }
      },
      providesTags: (result) =>
        result?.data?.data
          ? [
              ...result?.data?.data.map(({ id }) => ({
                type: 'Brand' as const,
                id: id,
              })),
              'Brand',
            ]
          : ['Brand'],
    }),

    getSingleBrand: builder.query<GetSingleBrandResult, IdQuery>({
      query: ({ id }) => ({
        url: `/api/brand/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) => [{ type: 'Brand', id: arg.id }],
    }),

    createBrand: builder.mutation<MsgResult, FormData>({
      query: (body) => ({
        url: '/api/brand',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body,
      }),
      invalidatesTags: ['Brand'],
    }),

    updateBrand: builder.mutation<MsgResult, FormData>({
      query: (body) => ({
        url: `/api/brand/update`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Brand'],
    }),

    deleteBrand: builder.mutation<MsgResult, IdQuery>({
      query: ({ id }) => ({
        url: `/api/brand/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Brand'],
    }),
  }),
})

export const {
  useGetAllBrandsQuery,
  useGetBrandsQuery,
  useGetSingleBrandQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandApiSlice
