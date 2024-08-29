import { IArticle, IArticleBannerForm, IPagination, IStoreCategory, ServiceResponse } from '@/types'

export type IdQuery = { id: string }
export type HeaderTextUpsertQuery = {
  id?: string | null
  name: string
  isActive: boolean
}
export type UpsertGeneralSettingQuery = {
  id?: string | null
  title: string
  shortIntroduction: string
  googleTags: string
}
export type GetArticlesResult = ServiceResponse<IPagination<IArticle[]>>

export type ArticleBannerBulkForm = {
  articleBanners: IArticleBannerForm[]
}
export type StoreCategoryBulkForm = {
  storeCategories: IStoreCategory[]
}
