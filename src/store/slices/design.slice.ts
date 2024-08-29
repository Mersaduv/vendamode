import { IGeneralSetting, ILogoImages } from '@/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface State {
  generalSetting: IGeneralSetting | null
  logoImages: ILogoImages | null
}

const initialState: State = {
  generalSetting: null,
  logoImages: null,
}

const designSlice = createSlice({
  name: 'design',
  initialState,
  reducers: {
    setGeneralSetting: (state, action: PayloadAction<IGeneralSetting>) => {
      state.generalSetting = action.payload
    },
    setLogoImages: (state, action: PayloadAction<ILogoImages>) => {
      state.logoImages = action.payload
    },
    clearSettings: (state) => {
      state.generalSetting = null
      state.logoImages = null
    },
  },
})

export const { setGeneralSetting, setLogoImages, clearSettings } = designSlice.actions
export default designSlice.reducer
