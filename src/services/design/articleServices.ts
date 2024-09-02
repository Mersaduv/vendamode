import { AxiosError } from 'axios'
import instance from '../axiosConfig'
import { IArticle, ServiceResponse } from '@/types'

export const getArticleBySlug = async (slug: string): Promise<ServiceResponse<IArticle>> => {
  try {
    const response = await instance.get<ServiceResponse<IArticle>>(`/api/article?slug=${slug}`)
    return response.data
  } catch (error) {
    throw null
  }
}

export const getArticleByCategory = async (id: string): Promise<ServiceResponse<IArticle>> => {
  try {
    const response = await instance.get<ServiceResponse<IArticle>>(`/api/article/category/${id}`)
    return response.data
  } catch (error) {
    throw null
  }
}
