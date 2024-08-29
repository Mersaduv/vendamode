export interface ISlider {
  id: string
  categoryId: string
  image: {
    imageUrl: string
    placeholder: string
  }
  link: string
  type: string
  isActive: boolean
}