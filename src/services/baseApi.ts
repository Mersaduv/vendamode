import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://localhost:7004',
    // baseUrl: 'https://apivendamode.liara.run',
    timeout: 60000,
  }),

  tagTypes: ['User', 'Category', 'Product', 'Brand', 'Review','Order','Canceled','Features','FeatureValues','ProductSize','Size'],
  endpoints: (builder) => ({}),
})

export default apiSlice