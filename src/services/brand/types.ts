import { IBrandForm, IPagination, QueryParams, ServiceResponse } from '@/types'

export interface IBrand {
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

export type MsgResult = { msg: string }
export type IdQuery = { id: string }
export type GetBrandsQuery = QueryParams

export type GetBrandsResult = ServiceResponse<IPagination<IBrand[]>>
export type GetAllBrandsResult = ServiceResponse<IBrand[]>
export type GetSingleBrandResult = ServiceResponse<IBrand>

export type CreateBrandQuery = IBrandForm
export type UpdateBrandQuery = IBrandForm
