import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5244',
    timeout: 60000,
  }),

  tagTypes: ['User', 'Category'],
  endpoints: (builder) => ({}),
})

export default apiSlice

// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'
// import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
// import type { BaseQueryFn, FetchArgs, FetchBaseQueryMeta } from '@reduxjs/toolkit/query';


// const baseQuery = fetchBaseQuery({
//   baseUrl: 'https://localhost:7004',
//   prepareHeaders: (headers) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       headers.set('Authorization', `Bearer ${token}`);
//     }
//     return headers;
//   },
//   timeout: 60000,
// });

// const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta> = async (
//   args,
//   api,
//   extraOptions
// ) => {
//   let result = await baseQuery(args, api, extraOptions);

//   if (result.error && result.error.status === 401) {
//     const refreshResult = await baseQuery(
//       {
//         url: '/api/auth/generateToken',
//         method: 'POST',
//         body: { refreshToken: localStorage.getItem('refreshToken') , token : localStorage.getItem('token') },
//       },
//       api,
//       extraOptions
//     );

//     if (refreshResult.data) {
//       localStorage.setItem('token', (refreshResult.data as any).token);
//       result = await baseQuery(args, api, extraOptions);
//     } else {
//       localStorage.removeItem('token');
//       localStorage.removeItem('refreshToken');
//       api.dispatch({ type: 'auth/logout' });
//     }
//   }
//   return result;
// }

// const apiSlice = createApi({
//   reducerPath: 'api',
//   baseQuery: baseQueryWithReauth,

//   tagTypes: ['User', 'Review', 'Details', 'Order', 'Product', 'Category', 'Slider', 'Banner'],
//   endpoints: (builder) => ({}),
// })

// export default apiSlice

