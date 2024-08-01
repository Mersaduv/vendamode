import baseApi from '@/services/baseApi'
import { IPagination, QueryParams, ServiceResponse } from '@/types'
import {
  FeatureValue,
  FeatureValueDTO,
  GetCategoryFeaturesByCategory,
  GetFeaturesQuery,
  ProductFeature,
  ProductFeatureCreateDTO,
  ProductFeatureUpdateDTO,
  ProductFeatureValueUpdateDTO,
} from './types'
import { generateQueryParams } from '@/utils'

export const productFeatureApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFeatures: builder.query<ServiceResponse<IPagination<ProductFeature[]>>, GetFeaturesQuery>({
      query: ({ ...params }) => {
        const queryParams = generateQueryParams(params)
        return {
          url: `/api/features?${queryParams}`,
          method: 'GET',
        }
      },
      providesTags: (result) =>
        result?.data?.data
          ? [
              ...result?.data?.data.map(({ id }) => ({
                type: 'Features' as const,
                id: id,
              })),
              'Features',
            ]
          : ['Features'],
    }),

    getFeatureValues: builder.query<ServiceResponse<IPagination<FeatureValue[]>>, QueryParams>({
      query: ({ ...params }) => {
        const queryParams = generateQueryParams(params)
        return {
          url: `/api/feature/values?${queryParams}`,
          method: 'GET',
        }
      },
      providesTags: (result) =>
        result?.data?.data
          ? [
              ...result?.data?.data.map(({ id }) => ({
                type: 'FeatureValues' as const,
                id: id,
              })),
              'FeatureValues',
            ]
          : ['FeatureValues'],
    }),

    createFeature: builder.mutation<ServiceResponse<boolean>, ProductFeatureCreateDTO>({
      query: (body) => ({
        url: '/api/feature',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Features'],
    }),

    createFeatureValue: builder.mutation<ServiceResponse<boolean>, FeatureValueDTO>({
      query: (body) => ({
        url: '/api/feature/value',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['FeatureValues'],
    }),

    updateFeature: builder.mutation<ServiceResponse<boolean>, ProductFeatureUpdateDTO>({
      query: (body) => ({
        url: '/api/feature',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Features'],
    }),

    updateFeatureValue: builder.mutation<ServiceResponse<boolean>, FeatureValueDTO>({
      query: (body) => ({
        url: '/api/feature/value',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['FeatureValues'],
    }),

    getFeature: builder.query<ServiceResponse<ProductFeature>, string>({
      query: (id) => ({
        url: `/api/feature/${id}`,
        method: 'GET',
      }),
    }),

    getFeatureValue: builder.query<ServiceResponse<FeatureValue>, string>({
      query: (id) => ({
        url: `/api/feature/value/${id}`,
        method: 'GET',
      }),
    }),

    deleteFeature: builder.mutation<ServiceResponse<boolean>, string>({
      query: (id) => ({
        url: `/api/feature/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Features'],
    }),

    deleteFeatureValue: builder.mutation<ServiceResponse<boolean>, string>({
      query: (id) => ({
        url: `/api/feature/value/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['FeatureValues'],
    }),

    getFeaturesByCategory: builder.query<ServiceResponse<GetCategoryFeaturesByCategory>, string>({
      query: (id) => ({
        url: `/api/feature/by-category/${id}`,
        method: 'GET',
      }),
      providesTags: (result) =>
        result?.data?.productFeatures
          ? [
              ...result.data.productFeatures.map(({ id }) => ({
                type: 'Features' as const,
                id: id,
              })),
              'Features',
            ]
          : ['Features'],
    }),
  }),
})

export const {
  useGetFeaturesQuery,
  useGetFeatureValuesQuery,
  useCreateFeatureMutation,
  useCreateFeatureValueMutation,
  useUpdateFeatureMutation,
  useUpdateFeatureValueMutation,
  useGetFeatureQuery,
  useGetFeatureValueQuery,
  useDeleteFeatureMutation,
  useDeleteFeatureValueMutation,
  useGetFeaturesByCategoryQuery,
} = productFeatureApi
