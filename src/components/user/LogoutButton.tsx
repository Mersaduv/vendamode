import { useState } from 'react'
import { BiLogOut } from 'react-icons/bi'
import { useAppDispatch } from '@/hooks'
import { HandleResponse } from '@/components/shared'
import { Button } from '@/components/ui'
import { clearCredentials } from '@/store'

interface Props {
  isShowDropDown?: boolean
}

export default function LogoutButton(prop: Props) {
  const { isShowDropDown } = prop
  const dispatch = useAppDispatch()

  // Handlers
  const handleLogout = () => {
    dispatch(clearCredentials())
  }

  return (
    <>
      <Button
        className={!isShowDropDown ? 'bg-white p-0 mr-4' : 'bg-gray-50 p-0 flex w-44 pr-4 py-2'}
        onClick={handleLogout}
      >
        <BiLogOut className="icon text-red-500" />
        {isShowDropDown ? (
          <span className="ml-auto mr-2 text-gray-700 text-xs whitespace-nowrap font-semibold">
            خروج از حساب کاربری
          </span>
        ) : (
          <span className="ml-auto mr-1 text-gray-700 text-xs xl:text-sm whitespace-nowrap font-semibold">خروج</span>
        )}
      </Button>
    </>
  )
}
