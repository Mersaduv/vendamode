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
import apiSlice from '@/services/baseApi'

// Actions
export * from '../store/slices/auth.slice'
export * from '../store/slices/lastSeen.slice'
export * from '../store/slices/cart.slice'
export * from '../store/slices/alert.slice'
export * from '../store/slices/productUpdate.slice'


export const store = configureStore({
  reducer: {
    lastSeen: lastSeenReducer,
    cart: cartReducer,
    alert: alertReducer,
    auth : authReducer,
    featureValues: featureValuesReducer,
    sizes: sizesReducer,
    stateUpdate: updateReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (gDM) => gDM().concat(apiSlice.middleware),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

setupListeners(store.dispatch)
