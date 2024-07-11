import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SizesState {
  selectedSizes: SizeDTO[]
}

const initialState: SizesState = {
  selectedSizes: [],
}

const sizesSlice = createSlice({
  name: 'sizes',
  initialState,
  reducers: {
    setSelectedSizes: (state, action: PayloadAction<SizeDTO[]>) => {
      state.selectedSizes = action.payload
    },
    removeSize: (state, action: PayloadAction<string>) => {
      state.selectedSizes = state.selectedSizes.filter((size) => size.id !== action.payload)
    },
  },
})

export const { setSelectedSizes, removeSize } = sizesSlice.actions
export default sizesSlice.reducer