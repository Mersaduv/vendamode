export interface IArticleBanner {
  id: string
  index: number
  articleId: string
  isActive: boolean
  title: string
  imagesSrc?: {
    id: string
    imageUrl: string
    placeholder: string
  } | null
  created: string
  lastUpdated: string
}
