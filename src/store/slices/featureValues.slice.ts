import { createSlice, PayloadAction } from '@reduxjs/toolkit'


interface FeatureValuesState {
  selectedFeatureValues: FeatureValue[]
}

const initialState: FeatureValuesState = {
  selectedFeatureValues: [],
}

const featureValuesSlice = createSlice({
  name: 'featureValues',
  initialState,
  reducers: {
    setSelectedFeatureValues: (state, action: PayloadAction<FeatureValue[]>) => {
      state.selectedFeatureValues = action.payload
    },
    removeFeatureValue: (state, action: PayloadAction<string>) => {
      state.selectedFeatureValues = state.selectedFeatureValues.filter(
        (feature) => feature.id !== action.payload
      )
    },
  },
})

export const { setSelectedFeatureValues, removeFeatureValue } = featureValuesSlice.actions
export default featureValuesSlice.reducer