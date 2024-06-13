import { AxiosError } from 'axios'
import instance from '../axiosConfig'
import { GetCategoriesResult } from './types'

export const getCategories = async (): Promise<GetCategoriesResult> => {
  try {
    const response = await instance.get('/api/categories')
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('An error occurred while fetching Categories: ', error.message)
      throw error
    }
    console.error('An unexpected error occurred: ', error)
    throw error
  }
}