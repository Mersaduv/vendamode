import baseApi from '@/services/baseApi';
import { generateQueryParams } from '@/utils';
import {
  CreateCanceledQuery,
  GetAllCanceledsResult,
  GetCanceledsQuery,
  GetCanceledsResult,
  GetSingleCanceledResult,
  IdQuery,
  MsgResult,
  UpdateCanceledQuery,
} from './types';

export const canceledApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCanceleds: builder.query<GetAllCanceledsResult, void>({
      query: () => ({
        url: '/api/allCanceleds',
        method: 'GET',
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: 'Canceled' as const,
                id: id,
              })),
              'Canceled',
            ]
          : ['Canceled'],
    }),

    getCanceleds: builder.query<GetCanceledsResult, GetCanceledsQuery>({
      query: ({ ...params }) => {
        const queryParams = generateQueryParams(params);
        return {
          url: `/api/canceled-orders?${queryParams}`,
          method: 'GET',
        };
      },
      providesTags: ['Canceled'],
    }),

    getSingleCanceled: builder.query<GetSingleCanceledResult, IdQuery>({
      query: ({ id }) => ({
        url: `/api/canceled-orders/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) => [{ type: 'Canceled', id: arg.id }],
    }),

    createCanceled: builder.mutation<MsgResult, CreateCanceledQuery>({
      query: (data) => ({
        url: '/api/canceled-orders',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Canceled'],
    }),

    updateCanceled: builder.mutation<MsgResult, UpdateCanceledQuery>({
      query: ({ id, ...data }) => ({
        url: `/api/canceled-orders/${id}`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Canceled', id: arg.id }],
    }),

    deleteCanceled: builder.mutation<MsgResult, IdQuery>({
      query: ({ id }) => ({
        url: `/api/canceled-orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Canceled', id: arg.id }],
    }),
  }),
});

export const {
  useGetAllCanceledsQuery,
  useGetCanceledsQuery,
  useGetSingleCanceledQuery,
  useCreateCanceledMutation,
  useUpdateCanceledMutation,
  useDeleteCanceledMutation,
} = canceledApiSlice;
