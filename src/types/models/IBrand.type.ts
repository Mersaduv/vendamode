export interface IBrand{
  id: string
  nameFa: string
  nameEn: string
  imagesSrc: {
    imageUrl: string
    placeholder: string
  }
  inSlider: boolean
  isActive: boolean
  isDeleted : boolean
  count: number
  description: string
  isDelete: boolean
  created: string
  updated: string
}
