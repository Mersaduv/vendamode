export interface IBrand{
  id: string
  name: string
  imagesSrc: {
    url: string
    placeholder: string
  }
  inSlider: boolean
  isActive: boolean
  count: number
  description: string
  isDelete: boolean
  created: string
  updated: string
}
