import { AxiosError } from 'axios'
import instance from '../axiosConfig'
import { IBanner, ServiceResponse } from '@/types'

export const getFooterBanner = async (): Promise<ServiceResponse<IBanner[]> | null> => {
  try {
    const response = await instance.get('/api/footer-banners')
    return response.data
  } catch (error) {
    return null
  }
}
