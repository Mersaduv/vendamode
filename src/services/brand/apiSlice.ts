import baseApi from '@/services/baseApi';
import { generateQueryParams, getToken } from '@/utils';
import { CreateBrandQuery, GetAllBrandsResult, GetBrandsQuery, GetBrandsResult, GetSingleBrandResult, IdQuery, MsgResult, UpdateBrandQuery } from './types';

export const brandApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBrands: builder.query<GetAllBrandsResult, void>({
      query: () => ({
        url: '/api/allBrands',
        method: 'GET',
      }),
    }),

    getBrands: builder.query<GetBrandsResult, GetBrandsQuery>({
      query: ({ ...params }) => {
        const queryParams = generateQueryParams(params);
        return {
          url: `/api/brands?${queryParams}`,
          method: 'GET',
        };
      },
    }),

    getSingleBrand: builder.query<GetSingleBrandResult, IdQuery>({
      query: ({ id }) => ({
        url: `/api/brand/${id}`,
        method: 'GET',
      }),
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
    }),

    updateBrand: builder.mutation<MsgResult, FormData>({
      query: (body) => ({
        url: `/api/brand/update`,
        method: 'POST',
        body,
      }),
    }),

    deleteBrand: builder.mutation<MsgResult, IdQuery>({
      query: ({ id }) => ({
        url: `/api/brand/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetAllBrandsQuery,
  useGetBrandsQuery,
  useGetSingleBrandQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandApiSlice;
