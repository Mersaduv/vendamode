export interface IBanner {
  id: string
  categoryId: string
  image: {
    imageUrl: string
    placeholder: string
  }
  link: string
  type: string
  isActive: boolean
  index: number
}
