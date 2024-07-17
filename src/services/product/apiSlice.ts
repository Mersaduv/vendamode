import baseApi from '@/services/baseApi'

import { generateQueryParams, getToken } from '@/utils'

import type { GetProductResult, GetProductsQuery, GetProductsResult, IdQuery, MsgResult } from './types'
import { ICategory } from '@/types'

export const productApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<GetProductsResult, GetProductsQuery>({
      query: ({ ...params }) => {
        const queryParams = generateQueryParams(params)
        return {
          url: `/api/product-list?${queryParams}`,
          method: 'GET',
        }
      },
    }),

    getSingleProduct: builder.query<GetProductResult, IdQuery>({
      query: ({ id }) => ({
        url: `/api/product/${id}`,
        method: 'GET',
      }),
    }),

    getProductByCategory: builder.query<GetProductResult, IdQuery>({
      query: ({ id }) => ({
        url: `/api/products/category/${id}`,
        method: 'GET',
      }),
    }),

    deleteProduct: builder.mutation<MsgResult, IdQuery>({
      query: ({ id }) => ({
        url: `/api/product/${id}`,
        method: 'DELETE',
      }),
    }),

    createProduct: builder.mutation<MsgResult, FormData>({
      query: (body) => ({
        url: `/api/product`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body,
      }),
    }),

    updateProduct: builder.mutation<MsgResult, FormData>({
      query: (body) => ({
        url: `/api/product/update`,
        method: 'POST',
        body,
      }),
    }),

    bulkUpdateProduct: builder.mutation<MsgResult, { productIds: string[]; isActive: boolean }>({
      query: (body) => ({
        url: `/api/product/bulk-update`,
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetSingleProductQuery,
  useDeleteProductMutation,
  useBulkUpdateProductMutation,
  useGetProductByCategoryQuery,
} = productApiSlice
