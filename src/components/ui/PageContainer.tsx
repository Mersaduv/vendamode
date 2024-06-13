import { BackIconButton, BoxLink } from '@/components/ui'
import { useState } from 'react'
import { profilePaths } from '../shared/UserProfileAside'
import { LogoutButton } from '../user'
import { useGetUserInfoMeQuery } from '@/services'
import { Person } from '@/icons'

interface Props {
  title: string
  children: React.ReactNode
}

const PageContainer: React.FC<Props> = (props) => {
  // ? Props
  const { children } = props
  const { data, isLoading } = useGetUserInfoMeQuery()
  // ? Render(s)
  return (
    <div className='pb-1 mb-2'>
      <div className="flex items-center bg-gree flex-col py-1 ml-3 mr-4">
        <div className="md:hidden flex items-center w-full  rounded-lg shadow-item justify-between px-4">
          <Person className="h-12 w-12" />
          <div className="flex flex-col gap-y-1">
            {isLoading ? (
              <>
                <div className="h-5 w-32 animate-pulse rounded-md bg-red-200 lg:h-6 lg:w-28" />
                <div className="h-5 w-24 animate-pulse rounded-md bg-red-200 lg:h-6 lg:w-20" />
              </>
            ) : (
              <>
                <span className="text-sm font-medium lg:text-base">{data?.data?.fullName}</span>
                <span className="text-[11px] text-gray-400">{data?.data?.mobileNumber}</span>
              </>
            )}
          </div>
          <LogoutButton />
        </div>
      </div>
      {/* <div className="section-divide-y" /> */}
      <div className="block md:hidden mt-4 overflow-auto shadow-item py-4">
        <div className="flex justify-around w-[800px] gap-3 mr-3">
          {profilePaths.map((item, index) => (
            <BoxLink key={index} icon={item.Icon} path={item.path} name={item.name}>
              <item.Icon className="icon text-black" />
            </BoxLink>
          ))}
        </div>
      </div>
      {children}
    </div>
  )
}

export default PageContainer
