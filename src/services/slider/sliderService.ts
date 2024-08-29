import { ISlider } from '@/types'
import instance from '../axiosConfig'
import { AxiosError } from 'axios'
import { GetSliderResult } from './types'

export const getSliders = async (): Promise<GetSliderResult | null> => {
  try {
    const response = await instance.get('/api/sliders');
    return response.data;
  } catch (error) {
    return null;
  }
}