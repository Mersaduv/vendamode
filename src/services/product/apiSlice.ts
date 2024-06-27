import baseApi from '@/services/baseApi'

import { generateQueryParams } from '@/utils'

import type { GetProductsQuery, GetProductsResult, IdQuery, MsgResult } from './types'

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
        result?.data?.pagination?.data
          ? [
              ...result.data.pagination.data.map(({ id }) => ({
                type: 'Product' as const,
                id: id,
              })),
              'Product',
            ]
          : ['Product'],
    }),

    // getSingleProduct: builder.query<GetSingleProductResult, IdQuery>({
    //   query: ({ id }) => ({
    //     url: `/api/products/${id}`,
    //     method: 'GET',
    //   }),
    //   providesTags: (result, error, arg) => [{ type: 'Product', id: arg.id }],
    // }),

    // deleteProduct: builder.mutation<MsgResult, IdQuery>({
    //   query: ({ id }) => ({
    //     url: `/api/products/${id}`,
    //     method: 'DELETE',
    //   }),
    //   invalidatesTags: ['Product'],
    // }),

    createProduct: builder.mutation<MsgResult, FormData>({
      query: (body) => ({
        url: `/api/products`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Product'],
    }),

    // updateProduct: builder.mutation<MsgResult, UpdateProductQuery>({
    //   query: ({ id, body }) => ({
    //     url: `/api/products/${id}`,
    //     method: 'PUT',
    //     body,
    //   }),
    //   invalidatesTags: (result, error, arg) => [{ type: 'Product', id: arg.id }],
    // }),
  }),
})

export const { useGetProductsQuery , useCreateProductMutation } = productApiSlice
