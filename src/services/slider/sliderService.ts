import { ISlider } from '@/types'
import instance from '../axiosConfig'
import { AxiosError } from 'axios'
import { GetUserAddressResult } from './types'

export const getSliders = async (): Promise<GetUserAddressResult> => {
  try {
    const response = await instance.get('/api/main/sliders')
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('An error occurred while fetching sliders: ', error.message)
      throw error
    }
    console.error('An unexpected error occurred: ', error)
    throw error
  }
}
