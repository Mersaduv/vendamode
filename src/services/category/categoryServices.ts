import { AxiosError } from 'axios'
import instance from '../axiosConfig'
import { GetCategoriesResult } from './types'

export const getCategories = async (): Promise<GetCategoriesResult | null> => {
  try {
    const response = await instance.get('/api/categories')
    return response.data
  } catch (error) {
    return null; // در صورت بروز خطا، null برگردانید
  }
}