// types.ts
import { IPagination, ServiceResponse } from '@/types'
import { SizeDTO } from '../feature/types'

export type SizeCreateDTO = {
  name: string
  description: string
}

export type SizeUpdateDTO = {
  id: string
  name: string
  description: string
}

export type ProductSizeValuesDTO = {
  id: string
  name: string
  productSizeId: string
}

export type ProductSizeDTO = {
  id: string
  sizeType: '0' | '1'
  productSizeValues?: ProductSizeValuesDTO[]
  imagesSrc?: {
    id: string
    imageUrl: string
    placeholder: string
  }
}

export type GetSizesResult = ServiceResponse<IPagination<SizeDTO[]>>
export type GetSizeResult = ServiceResponse<SizeDTO>
export type GetProductSizeResult = ServiceResponse<ProductSizeDTO>
export type SizeResult = ServiceResponse<boolean>
export type DeleteSizeResult = ServiceResponse<boolean>

export type IdQuery = { id: string }
export type IdsQuery = { categoryId?: string; productSizeId?: string }
export type CreateSizeQuery = SizeCreateDTO
