export interface ISlider {
  id: string
  categoryId: string
  image: {
    imageUrl: string
    placeholder: string
  }
  title: string
  uri?: string
  isPublic: boolean
  isMain: boolean
}