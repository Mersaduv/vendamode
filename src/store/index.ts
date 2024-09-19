import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

// Reducers
import authReducer from '../store/slices/auth.slice'
import lastSeenReducer from '../store/slices/lastSeen.slice'
import cartReducer from '../store/slices/cart.slice'
import alertReducer from '../store/slices/alert.slice'
import featureValuesReducer from '../store/slices/featureValues.slice'
import sizesReducer from '../store/slices/sizes.slice'
import updateReducer from '../store/slices/productUpdate.slice'
import headerTextReducer from '../store/slices/headerText.slice'
import stateStringReducer from '../store/slices/stateString.slice'
import designReducer from '../store/slices/design.slice'
import objectValueReducer from '../store/slices/objectValue.slice'
import apiSlice from '@/services/baseApi'

// Actions
export * from '../store/slices/auth.slice'
export * from '../store/slices/lastSeen.slice'
export * from '../store/slices/cart.slice'
export * from '../store/slices/alert.slice'
export * from '../store/slices/productUpdate.slice'
export * from '../store/slices/headerText.slice'
export * from '../store/slices/stateString.slice'
export * from '../store/slices/design.slice'
export * from '../store/slices/objectValue.slice'

export const store = configureStore({
  reducer: {
    lastSeen: lastSeenReducer,
    cart: cartReducer,
    alert: alertReducer,
    auth: authReducer,
    featureValues: featureValuesReducer,
    sizes: sizesReducer,
    stateUpdate: updateReducer,
    headerTextState: headerTextReducer,
    stateString: stateStringReducer,
    design: designReducer,
    objectValue: objectValueReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (gDM) => gDM().concat(apiSlice.middleware),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

setupListeners(store.dispatch)
