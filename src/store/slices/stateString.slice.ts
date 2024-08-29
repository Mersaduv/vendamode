import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface StateStringState {
  isBoolean?: boolean
  name: string
}

const initialState: StateStringState = {
  isBoolean: false,
  name: '',
}

const stateStringSlice = createSlice({
  name: 'stateString',
  initialState,
  reducers: {
    setStateStringSlice: (state, action: PayloadAction<StateStringState>) => {
      state.isBoolean = action.payload.isBoolean ?? false
      state.name = action.payload.name
    },
  },
})

export const { setStateStringSlice } = stateStringSlice.actions
export default stateStringSlice.reducer
