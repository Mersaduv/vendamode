// sizeApiSlice.ts
import baseApi from '@/services/baseApi';
import { getToken } from '@/utils';
import type {
  GetSizesResult,
  GetSizeResult,
  GetProductSizeResult,
  CreateSizeResult,
  DeleteSizeResult,
  IdQuery,
  CreateSizeQuery,
  CreateProductSizeQuery
} from './types';

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
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Size' as const, id })),
              'Size',
            ]
          : ['Size'],
    }),

    getSize: builder.query<GetSizeResult, IdQuery>({
      query: ({ id }) => ({
        url: `/api/size/${id}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
      providesTags: (result, err, arg) => [{ type: 'Size', id: arg.id }],
    }),

    getSizeByCategoryId: builder.query<GetProductSizeResult, IdQuery>({
      query: ({ id }) => ({
        url: `/api/size/category-sizes/${id}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
      providesTags: (result, err, arg) => [{ type: 'ProductSize', id: arg.id }],
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
      invalidatesTags: ['Size'],
    }),

    createCategorySize: builder.mutation<CreateSizeResult, CreateProductSizeQuery>({
      query: (body) => ({
        url: '/api/size/category',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body,
      }),
      invalidatesTags: ['ProductSize'],
    }),

    deleteSize: builder.mutation<DeleteSizeResult, IdQuery>({
      query: ({ id }) => ({
        url: `/api/size/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
      invalidatesTags: ['Size'],
    }),
  }),
});

export const {
  useGetSizesQuery,
  useGetSizeQuery,
  useGetSizeByCategoryIdQuery,
  useCreateSizeMutation,
  useCreateCategorySizeMutation,
  useDeleteSizeMutation,
} = sizeApiSlice;
