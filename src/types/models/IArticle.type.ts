export interface IArticle {
  id: string
  title: string
  slug: string
  isActive: boolean
  code: string
  isDeleted: boolean
  image: {
    id: string
    imageUrl: string
    placeholder: string
  }
  place: number
  description: string
  categoryId: string
  category: string
  author: string
  numReviews : number
  created: string
  lastUpdated: string
}
