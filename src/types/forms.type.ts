import type { ICart, ICategory, IProduct, IReview, IUser } from '@/types'


export interface ICategoryForm {
  id?: string
  name: string
  isActive: boolean
  thumbnail?: FileList
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
  Title: string;
  IsActive: boolean;
  Thumbnail: FileList;
  CategoryId: string;
  Description: string;
  IsFake: boolean;
  BrandId?: string;
  FeatureValueIds?: string[];
  InStock: number;
  Price: number;
  Discount?: number;
  ProductScale?: IProductScale;
  StockItems?: IStockItem[];
}

export interface IStockItem {
  FeatureId?: string;
  SizeId?: string;
  Quantity: number;
}

export interface IProductScale {
  Columns?: ISizeIds[];
  Rows?: ISizeModel[];
  ProductId: string;
}

export interface ISizeIds {
  Id: string;
  Name: string;
}

export interface ISizeModel {
  Id: string;
  ScaleValues?: string[];
  ProductSizeValueName: string;
  ProductSizeValueId: string;
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