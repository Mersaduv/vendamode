import '../styles/main.css'
import '../styles/browser-styles.css'
import '../styles/swiper.css'
import { ComponentType, FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Provider, useDispatch } from 'react-redux'
import { AppProps } from 'next/app'
import { store } from '@/store'
import { setCredentials, clearCredentials } from '@/store'
import { PageTransitionLoading, Alert } from '@/components/ui'
import { authApiSlice, useGenerateNewTokenMutation } from '@/services'
import { checkTokenValidity, useAppSelector } from '@/hooks'
import { UserInfo } from '@/types'
interface AppContentProps {
  Component: ComponentType<any>
  pageProps: any
}
const AppContent: FC<AppContentProps> = ({ Component, pageProps }) => {
  const { asPath } = useRouter()
  const { userInfo } = useAppSelector((state) => state.auth)
  // Fix Hydration
  const [showChild, setShowChild] = useState<boolean>(false)
  useEffect(() => {
    setShowChild(true)
  }, [])

  if (!showChild) {
    return null
  }

  // ? Get user in initial
  // if (typeof window !== 'undefined') {
  //   const info = JSON.parse(localStorage.getItem('userInfo') as string)
  //   if (info) {
  //     const loggedIn = localStorage.getItem('loggedIn')
  //     if (loggedIn) store.dispatch(authApiSlice.endpoints.getUserInfo.initiate(info.mobileNumber))
  //   }
  // }
  return (
    <>
      <Component {...pageProps} />
      {!asPath.includes('/products?category') ? <PageTransitionLoading /> : null}
      <Alert />
    </>
  )
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <AppContent Component={Component} pageProps={pageProps} />
    </Provider>
  )
}
