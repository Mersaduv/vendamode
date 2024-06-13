import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'
import { setCredentials, clearCredentials } from '@/store'
import { addDaysToCurrentTime } from '@/utils'

interface GenerateNewTokenResponse {
  data: {
    token: string
    refreshToken: string
    expireTime: number
    refreshTokenExpireTime: number
  }
}

const checkTokenValidity = async (
  token: string,
  refreshToken: string,
  expireTime: number | null,
  dispatch: Dispatch<any>,
  generateNewToken: any
): Promise<boolean> => {
  if (!expireTime) return false
  const currentTime = Math.floor(Date.now() / 1000)

  if (currentTime < expireTime) {
    return true
  } else {
    try {
      const response = (await generateNewToken({ token, refreshToken }).unwrap()) as GenerateNewTokenResponse
      if (response && response.data.token) {
        const newExpireTime = addDaysToCurrentTime(response.data.expireTime)
        const newRefreshTokenExpireTime = addDaysToCurrentTime(response.data.refreshTokenExpireTime)

        dispatch(
          setCredentials({
            token: response.data.token,
            refreshToken: response.data.refreshToken,
            userInfo: {
              expireTime: newExpireTime,
              refreshTokenExpireTime: newRefreshTokenExpireTime,
            },
          })
        )
        return true
      } else {
        dispatch(clearCredentials())
        return false
      }
    } catch (error) {
      dispatch(clearCredentials())
      return false
    }
  }
}

export default checkTokenValidity
