export interface ISlider {
  _id: string
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