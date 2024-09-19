import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the interface for the object value
interface IObjectValue {
  id: string;
  title: string;
  value: { id: string; name: string }[];
}

// Define the state structure
interface ObjectValueState {
  featureObjectValues: { [key: string]: IObjectValue };
}

// Initial state
const initialState: ObjectValueState = {
  featureObjectValues: {},
};

// Create the slice
const objectValueSlice = createSlice({
  name: 'objectValue',
  initialState,
  reducers: {
    setTempObjectValue2: (state, action: PayloadAction<IObjectValue>) => {
      const { id, title, value } = action.payload;
      // Update the state for the specific feature by its ID
      state.featureObjectValues[id] = { id, title, value };
    },
  },
});

// Export the action and the reducer
export const { setTempObjectValue2 } = objectValueSlice.actions;
export default objectValueSlice.reducer;
