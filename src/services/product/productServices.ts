import { AxiosError } from 'axios'
import instance from '../axiosConfig'
import { GetProductResult, GetSimilarProductResult } from './types'

export const getProductBySlug = async (slug: string): Promise<GetProductResult> => {
  try {
    const response = await instance.get<GetProductResult>(`/api/product?slug=${slug}`)
    return response.data
  } catch (error) {
    throw null
  }
}

export const getProductByCategory = async (id: string): Promise<GetSimilarProductResult> => {
  try {
    const response = await instance.get<GetSimilarProductResult>(`/api/products/category/${id}`)
    return response.data
  } catch (error) {
    throw null
  }
}
