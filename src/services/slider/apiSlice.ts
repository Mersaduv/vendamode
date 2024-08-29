import baseApi from '@/services/baseApi'
import { generateQueryParams } from '@/utils'
import { GetSliderResult } from './types'
import { ServiceResponse } from '@/types'
import { IHeaderText } from '@/types/IHeaderText.type'

export const sliderApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSliders: builder.query<GetSliderResult, void>({
      query: () => ({
        url: '/api/sliders',
        method: 'GET',
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: 'Slider' as const,
                id: id,
              })),
              'Slider',
            ]
          : ['Slider'],
    }),
    upsertSliders: builder.mutation<ServiceResponse<boolean>, FormData>({
      query: (body) => ({
        url: '/api/slider/upsert',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Slider'],
    }),

    deleteSlider: builder.mutation<ServiceResponse<boolean>, string>({
      query: (id) => ({
        url: `/api/slider/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Slider'],
    }),
  }),
})
export const { useGetAllSlidersQuery, useUpsertSlidersMutation, useDeleteSliderMutation } = sliderApiSlice
