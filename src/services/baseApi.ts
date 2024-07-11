import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5244',
    timeout: 60000,
  }),

  tagTypes: ['User', 'Category', 'Product', 'Brand', 'Review','Order','Canceled','Features','FeatureValues','ProductSize','Size'],
  endpoints: (builder) => ({}),
})

export default apiSlice