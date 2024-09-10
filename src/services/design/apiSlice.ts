import baseApi from '@/services/baseApi'
import { generateQueryParams, getToken } from '@/utils'
import {
  ArticleBannerBulkForm,
  ColumnFooterBulkForm,
  GetArticlesResult,
  HeaderTextUpsertQuery,
  IdQuery,
  StoreCategoryBulkForm,
  UpsertGeneralSettingQuery,
} from './types'
import {
  IArticle,
  IArticleBanner,
  IArticleBannerForm,
  IBanner,
  ICategory,
  IColumnFooter,
  ICopyright,
  IDesignItem,
  IGeneralSetting,
  IGeneralSettingForm,
  ILogoImages,
  IPagination,
  IRedirect,
  ISloganFooter,
  IStoreCategory,
  ISupport,
  QueryParams,
  ServiceResponse,
} from '@/types'
import { IHeaderText } from '@/types/IHeaderText.type'

export const designApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHeaderText: builder.query<ServiceResponse<IHeaderText>, void>({
      query: () => ({
        url: `/api/design/headerText`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) =>
        result?.data ? [{ type: 'HeaderText', id: result.data.id }] : ['HeaderText'],
    }),

    getSloganFooter: builder.query<ServiceResponse<ISloganFooter>, void>({
      query: () => ({
        url: `/api/design/sloganFooter`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) =>
        result?.data ? [{ type: 'SloganFooter', id: result.data.id }] : ['SloganFooter'],
    }),

    getRedirects: builder.query<ServiceResponse<IRedirect>, void>({
      query: () => ({
        url: `/api/design/redirects`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) =>
        result?.data ? [{ type: 'Redirects', id: result.data.id }] : ['Redirects'],
    }),

    getSupport: builder.query<ServiceResponse<ISupport>, void>({
      query: () => ({
        url: `/api/design/support`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) => (result?.data ? [{ type: 'Support', id: result.data.id }] : ['Support']),
    }),

    getCopyright: builder.query<ServiceResponse<ICopyright>, void>({
      query: () => ({
        url: `/api/design/copyright`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) =>
        result?.data ? [{ type: 'Copyright', id: result.data.id }] : ['Copyright'],
    }),

    upsertSupport: builder.mutation<ServiceResponse<boolean>, ISupport>({
      query: (body) => ({
        url: '/api/design/support',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Support'],
    }),

    upsertRedirects: builder.mutation<ServiceResponse<boolean>, IRedirect>({
      query: (body) => ({
        url: '/api/design/redirects',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Redirects'],
    }),

    getGeneralSetting: builder.query<ServiceResponse<IGeneralSetting>, void>({
      query: () => ({
        url: `/api/design/generalSetting`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) =>
        result?.data ? [{ type: 'GeneralSetting', id: result.data.id }] : ['GeneralSetting'],
    }),

    getColumnFooters: builder.query<ServiceResponse<IColumnFooter[]>, void>({
      query: () => {
        return {
          url: '/api/design/columnFooters',
          method: 'GET',
        }
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: 'ColumnFooter' as const,
                id: id,
              })),
              'ColumnFooter',
            ]
          : ['ColumnFooter'],
    }),

    upsertHeaderText: builder.mutation<ServiceResponse<boolean>, HeaderTextUpsertQuery>({
      query: (body) => ({
        url: '/api/design/headerText',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['HeaderText'],
    }),

    upsertSloganFooter: builder.mutation<ServiceResponse<boolean>, ISloganFooter>({
      query: (body) => ({
        url: '/api/design/sloganFooter',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['SloganFooter'],
    }),

    upsertGeneralSetting: builder.mutation<ServiceResponse<boolean>, UpsertGeneralSettingQuery>({
      query: (body) => ({
        url: '/api/design/generalSetting',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['GeneralSetting'],
    }),

    upsertCopyright: builder.mutation<ServiceResponse<boolean>, ICopyright>({
      query: (body) => ({
        url: '/api/design/copyright',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Copyright'],
    }),

    upsertColumnFooter: builder.mutation<ServiceResponse<boolean>, ColumnFooterBulkForm>({
      query: (body) => ({
        url: '/api/design/columnFooters',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ColumnFooter'],
    }),

    deleteColumnFooter: builder.mutation<ServiceResponse<boolean>, string>({
      query: (id) => ({
        url: `/api/design/columnFooters/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ColumnFooter'],
    }),

    upsertDesignItems: builder.mutation<ServiceResponse<boolean>, FormData>({
      query: (body) => {
        return {
          url: '/api/design/items',
          method: 'POST',
          body,
        }
      },
      invalidatesTags: ['DesignItem'],
    }),

    getDesignItems: builder.query<ServiceResponse<IDesignItem[]>, void>({
      query: () => ({
        url: '/api/design/items',
        method: 'GET',
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: 'DesignItem' as const,
                id: id,
              })),
              'DesignItem',
            ]
          : ['DesignItem'],
    }),

    deleteDesignItems: builder.mutation<ServiceResponse<boolean>, string>({
      query: (id) => ({
        url: `/api/design/items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['DesignItem'],
    }),

    getAllBanners: builder.query<ServiceResponse<IBanner[]>, void>({
      query: () => ({
        url: '/api/banners',
        method: 'GET',
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: 'Banner' as const,
                id: id,
              })),
              'Banner',
            ]
          : ['Banner'],
    }),
    getLogoImages: builder.query<ServiceResponse<ILogoImages[]>, void>({
      query: () => ({
        url: '/api/design/logoImages',
        method: 'GET',
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: 'LogoImages' as const,
                id: id,
              })),
              'LogoImages',
            ]
          : ['LogoImages'],
    }),

    getAllArticleBanners: builder.query<ServiceResponse<IArticleBanner[]>, void>({
      query: () => ({
        url: '/api/article-banners',
        method: 'GET',
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: 'ArticleBanner' as const,
                id: id,
              })),
              'ArticleBanner',
            ]
          : ['ArticleBanner'],
    }),

    getAllFooterBanners: builder.query<ServiceResponse<IBanner[]>, void>({
      query: () => ({
        url: '/api/footer-banners',
        method: 'GET',
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: 'FooterBrand' as const,
                id: id,
              })),
              'FooterBrand',
            ]
          : ['FooterBrand'],
    }),

    getArticles: builder.query<GetArticlesResult, QueryParams>({
      query: ({ ...params }) => {
        const queryParams = generateQueryParams(params)
        return {
          url: `/api/articles?${queryParams}`,
          method: 'GET',
        }
      },
      providesTags: (result) =>
        result?.data?.data
          ? [
              ...result.data?.data?.map(({ id }) => ({
                type: 'Article' as const,
                id: id,
              })),
              'Article',
            ]
          : ['Article'],
    }),

    getStoreCategories: builder.query<ServiceResponse<IStoreCategory[]>, void>({
      query: () => {
        return {
          url: '/api/design/storeCategories',
          method: 'GET',
        }
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: 'StoreCategories' as const,
                id: id,
              })),
              'StoreCategories',
            ]
          : ['StoreCategories'],
    }),

    getStoreCategoryList: builder.query<ServiceResponse<ICategory[]>, void>({
      query: () => {
        return {
          url: '/api/design/storeCategoryList',
          method: 'GET',
        }
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: 'StoreCategories' as const,
                id: id,
              })),
              'StoreCategories',
            ]
          : ['StoreCategories'],
    }),

    getSingleArticle: builder.query<ServiceResponse<IArticle>, IdQuery>({
      query: ({ id }) => ({
        url: `/api/article/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) => [{ type: 'Article', id: arg.id }],
    }),

    upsertBanner: builder.mutation<ServiceResponse<boolean>, FormData>({
      query: (body) => {
        return {
          url: '/api/banner/upsert',
          method: 'POST',
          body,
        }
      },
      invalidatesTags: ['Banner'],
    }),

    upsertLogoImages: builder.mutation<ServiceResponse<boolean>, FormData>({
      query: (body) => {
        return {
          url: '/api/design/logoImages',
          method: 'POST',
          body,
        }
      },
      invalidatesTags: ['LogoImages'],
    }),

    upsertStoreCategories: builder.mutation<ServiceResponse<boolean>, StoreCategoryBulkForm>({
      query: (body) => {
        return {
          url: '/api/design/storeCategory',
          method: 'POST',
          body: body,
        }
      },
      invalidatesTags: ['StoreCategories'],
    }),

    upsertArticleBanner: builder.mutation<ServiceResponse<boolean>, ArticleBannerBulkForm>({
      query: (body) => {
        console.log(body, 'body -- body')

        return {
          url: '/api/banner/article-upsert',
          method: 'POST',
          body: body,
        }
      },
      invalidatesTags: ['ArticleBanner'],
    }),

    upsertArticle: builder.mutation<ServiceResponse<string>, FormData>({
      query: (body) => {
        return {
          url: '/api/article',
          method: 'POST',
          body,
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      },
      invalidatesTags: ['Article'],
    }),

    deleteArticle: builder.mutation<ServiceResponse<boolean>, IdQuery>({
      query: ({ id }) => ({
        url: `/api/article/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Article'],
    }),

    deleteStoreCategory: builder.mutation<ServiceResponse<boolean>, string>({
      query: (id) => ({
        url: `/api/design/storeCategory/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['StoreCategories'],
    }),
    deleteTrashArticle: builder.mutation<ServiceResponse<boolean>, IdQuery>({
      query: ({ id }) => {
        return {
          url: `/api/article/trash/${id}`,
          method: 'POST',
        }
      },
      invalidatesTags: ['Article'],
    }),

    restoreArticle: builder.mutation<ServiceResponse<boolean>, IdQuery>({
      query: ({ id }) => {
        return {
          url: `/api/article/restore/${id}`,
          method: 'POST',
        }
      },
      invalidatesTags: ['Article'],
    }),

    upsertFooterBanner: builder.mutation<ServiceResponse<boolean>, FormData>({
      query: (body) => {
        return {
          url: '/api/banner/banner-footer/upsert',
          method: 'POST',
          body,
        }
      },
      invalidatesTags: ['FooterBrand'],
    }),

    deleteBanner: builder.mutation<ServiceResponse<boolean>, string>({
      query: (id) => ({
        url: `/api/banner/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Banner'],
    }),
  }),
})
export const {
  useUpsertHeaderTextMutation,
  useGetHeaderTextQuery,
  useGetAllBannersQuery,
  useUpsertBannerMutation,
  useDeleteBannerMutation,
  useGetAllFooterBannersQuery,
  useUpsertFooterBannerMutation,
  useGetArticlesQuery,
  useDeleteArticleMutation,
  useDeleteTrashArticleMutation,
  useRestoreArticleMutation,
  useUpsertArticleMutation,
  useGetSingleArticleQuery,
  useGetAllArticleBannersQuery,
  useUpsertArticleBannerMutation,
  useUpsertLogoImagesMutation,
  useUpsertGeneralSettingMutation,
  useGetGeneralSettingQuery,
  useGetLogoImagesQuery,
  useDeleteDesignItemsMutation,
  useGetDesignItemsQuery,
  useUpsertDesignItemsMutation,
  useDeleteStoreCategoryMutation,
  useGetStoreCategoriesQuery,
  useUpsertStoreCategoriesMutation,
  useUpsertSloganFooterMutation,
  useGetSloganFooterQuery,
  useGetRedirectsQuery,
  useGetSupportQuery,
  useUpsertRedirectsMutation,
  useUpsertSupportMutation,
  useUpsertCopyrightMutation,
  useGetCopyrightQuery,
  useGetColumnFootersQuery,
  useUpsertColumnFooterMutation,
  useGetStoreCategoryListQuery,
  useDeleteColumnFooterMutation,
} = designApiSlice
