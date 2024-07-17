import type { ICart, ICategory, IProduct, IReview, IUser } from '@/types'

export interface ICategoryForm {
  id?: string | undefined
  name: string
  isActive: boolean
  thumbnail?: File | undefined
  mainCategoryId?: string
  parentCategoryId?: string
  level: number
}

export type ILoginForm = {
  mobileNumber: string
  password: string
}

export type IRegisterForm = {
  mobileNumber: string
  password: string
}

export type AddressFormBody = {
  id?: string
  userId: string
  fullName: string
  mobileNumber: string
  province: string
  city: string
  fullAddress: string
  postalCode: string
}

export interface IBrandForm {
  id?: string
  name: string
  Thumbnail: FileList
  inSlider: boolean
  isActive: boolean
  Description: number
  description: string
}

export interface IProductForm {
  Id : string
  Title: string
  IsActive: boolean
  MainThumbnail?: File | null
  Thumbnail?: File[] | null
  CategoryId: string
  Description: string
  IsFake: boolean
  BrandId?: string
  FeatureValueIds?: string[]
  StockItems?: IStockItem[]
  ProductScale?: IProductScaleCreate
}

export interface IStockItem {
  id?: string
  stockId?: string
  ImageStock?: File 
  featureValueId?: string[]
  sizeId?: string
  quantity?: number
  price?: number
  discount?: number
  [key: string]: any
}

export interface IProductScaleCreate {
  columnSizes?: ISizeIds[]
  Rows: ISizeInfoModel[]
  productId?: string
}

export interface ISizeIds {
  id: string
  name: string
}

export interface ISizeInfoModel {
  id: string
  idx: string
  scaleValues?: any[]
  productSizeValue: string
  productSizeValueId: string
}

export type IReviewForm = {
  userId: string
  productId: string
  rating: number
  positivePoints: {
    id: string
    title: string
  }[]
  negativePoints: {
    id: string
    title: string
  }[]
  comment: string
  Thumbnail: FileList
}

export type IOrderForm = {
  id: string
  orderNum: string
  status: number
  user: IUser
  address: string
  cart: ICart[]
  cancelOrder: string
  totalItems: number
  totalPrice: number
  orgPrice: number
  totalDiscount: number
  paymentMethod: string
  delivered: boolean
  paid: boolean
  purchaseInvoice?: FileList
}
