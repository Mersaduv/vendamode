import { useState } from 'react'

import { useLogoutQuery, userApiSlice } from '@/services'
import { BiLogOut } from 'react-icons/bi'

import { useAppDispatch } from '@/hooks'

import { Logout as LogoutIcon } from '@/icons'
import { HandleResponse } from '@/components/shared'
import { Button } from '@/components/ui'

interface Props {
  isShowDropDown?: boolean
}
export default function LogoutButton(prop: Props) {
  const { isShowDropDown } = prop
  const [skip, setSkip] = useState(true)

  const dispatch = useAppDispatch()

  // ? Logout Query
  const { data, isError, isLoading, error, isSuccess } = useLogoutQuery(undefined, {
    skip,
  })

  // ? Handlers
  const handleLogout = () => {
    setSkip(false)
  }
  const onSuccess = () => {
    dispatch(userApiSlice.util.invalidateTags(['User']))
  }

  // ? Render(s)
  return (
    <>
      {/* Handle Delete Response */}
      {(isSuccess || isError) && (
        <HandleResponse
          isError={isError}
          isSuccess={isSuccess}
          error={error}
          message={data?.msg}
          onSuccess={onSuccess}
        />
      )}

      <Button
        className={!isShowDropDown ? 'bg-white p-0' : 'bg-gray-50 p-0 flex w-44 pr-4 py-2'}
        onClick={handleLogout}
        isLoading={isLoading}
      >
        <BiLogOut className="icon text-red-500" />
        {isShowDropDown ? (
          <span className="ml-auto mr-2 text-gray-700 text-xs xl:text-sm whitespace-nowrap font-semibold">
            خروج از حساب کاربری
          </span>
        ) : (
          <span className="ml-auto mr-1 text-gray-700 text-xs xl:text-sm whitespace-nowrap font-semibold">خروج</span>
        )}
      </Button>
    </>
  )
}
