import type { ICategory } from '@/types'

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
  id?: string;
  name: string;
  Thumbnail: FileList;
  inSlider: boolean;
  isActive: boolean;
  Description: number;
  description: string;
}