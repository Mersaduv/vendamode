import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface HeaderTextState {
  isActive: boolean
  name: string
}

const initialState: HeaderTextState = {
  isActive: false,
  name: '',
}

const headerTextSlice = createSlice({
  name: 'headerText',
  initialState,
  reducers: {
    setHeaderText: (state, action: PayloadAction<HeaderTextState>) => {
      state.isActive = action.payload.isActive
      state.name = action.payload.name
    },
  },
})

export const { setHeaderText } = headerTextSlice.actions
export default headerTextSlice.reducer