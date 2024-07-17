import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface ProductUpdateState {
  isUpdated: boolean
}

const initialState: ProductUpdateState = {
  isUpdated: false,
}

const productUpdateSlice = createSlice({
  name: 'stateUpdate',
  initialState,
  reducers: {
    setUpdated: (state, action: PayloadAction<boolean>) => {
      state.isUpdated = action.payload
    },
  },
})

export const { setUpdated } = productUpdateSlice.actions
export default productUpdateSlice.reducer
