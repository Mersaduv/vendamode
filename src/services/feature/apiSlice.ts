import baseApi from '@/services/baseApi'
import { ServiceResponse } from '@/types';

export const productFeatureApi  = baseApi.injectEndpoints({
    endpoints: (builder) => ({
    getFeatures: builder.query<ServiceResponse<ProductFeature[]>, void>({
      query: () => ({
        url: '/api/features',
        method: 'GET',
      }),
    }),

    getFeatureValues: builder.query<ServiceResponse<FeatureValue[]>, void>({
      query: () => ({
        url: '/api/feature/values',
        method: 'GET',
      }),
    }),

    createFeature: builder.mutation<ServiceResponse<boolean>, ProductFeatureCreateDTO>({
      query: (body) => ({
        url: '/api/feature',
        method: 'POST',
        body,
      }),
    }),

    createFeatureValue: builder.mutation<ServiceResponse<boolean>, FeatureValueCreateDTO>({
      query: (body) => ({
        url: '/api/feature/value',
        method: 'POST',
        body,
      }),
    }),

    updateFeature: builder.mutation<ServiceResponse<boolean>, ProductFeatureUpdateDTO>({
      query: (body) => ({
        url: '/api/feature',
        method: 'PUT',
        body,
      }),
    }),

    updateFeatureValue: builder.mutation<ServiceResponse<boolean>, ProductFeatureUpdateDTO>({
      query: (body) => ({
        url: '/api/feature/value',
        method: 'PUT',
        body,
      }),
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
    }),

    deleteFeatureValue: builder.mutation<ServiceResponse<boolean>, string>({
      query: (id) => ({
        url: `/api/feature/value/${id}`,
        method: 'DELETE',
      }),
    }),

    getFeaturesByCategory: builder.query<ServiceResponse<GetCategoryFeaturesByCategory>, string>({
      query: (id) => ({
        url: `/api/feature/by-category/${id}`,
        method: 'GET',
      }),
    }),
  }),
});

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
} = productFeatureApi;
