import baseApi from '@/services/baseApi'
import { generateQueryParams, getToken } from '@/utils'
import type { BulkRequest, GetProductResult, GetProductsQuery, GetProductsResult, IdQuery, MsgResult } from './types'
import { ICategory, ServiceResponse } from '@/types'

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
      providesTags: (result) =>
        result?.data?.pagination.data
          ? [
              ...result.data?.pagination.data.map(({ id }) => ({
                type: 'Product' as const,
                id: id,
              })),
              'Product',
            ]
          : ['Product'],
    }),

    getSingleProduct: builder.query<GetProductResult, IdQuery>({
      query: ({ id }) => ({
        url: `/api/product/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) => [{ type: 'Product', id: arg.id }],
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
      invalidatesTags: ['Product'],
    }),

    deleteTrashProduct: builder.mutation<MsgResult, IdQuery>({
      query: ({ id }) => {
        return {
          url: `/api/product/trash/${id}`,
          method: 'POST',
        }
      },
      invalidatesTags: ['Product'],
    }),

    restoreProduct: builder.mutation<MsgResult, IdQuery>({
      query: ({ id }) => {
        return {
          url: `/api/product/restore/${id}`,
          method: 'POST',
        }
      },
      invalidatesTags: ['Product'],
    }),

    createProduct: builder.mutation<ServiceResponse<string>, FormData>({
      query: (body) => ({
        url: `/api/product`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body,
      }),
      invalidatesTags: ['Product', 'Category'],
    }),

    updateProduct: builder.mutation<ServiceResponse<string>, FormData>({
      query: (body) => ({
        url: `/api/product/update`,
        method: 'POST',
        body,
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
      invalidatesTags: ['Product'],
    }),

    bulkUpdateProduct: builder.mutation<MsgResult, BulkRequest>({
      query: (body) => ({
        url: `/api/product/bulk-update`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Product'],
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
  useDeleteTrashProductMutation,
  useRestoreProductMutation,
} = productApiSlice
