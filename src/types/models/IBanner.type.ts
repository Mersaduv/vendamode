export interface IBanner {
  id: string
  categoryId: string
  image: {
    url: string
    placeholder: string
  }
  title: string
  uri?: string
  isPublic: boolean
  type: string
  created: string
  updated: string
}