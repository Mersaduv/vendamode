import dynamic from 'next/dynamic'
import Head from 'next/head'

import { roles } from '@/utils'

import { ProtectedRouteWrapper } from '@/components/user'
import { Header, UserProfileAside } from '@/components/shared'

import { ProfileLayout } from '@/components/Layouts'
import { UserNameModal, UserMobileModal } from '@/components/modals'
import { Skeleton, PageContainer } from '@/components/ui'


import type { NextPage } from 'next'
import { useGetUserInfoMeQuery } from '@/services'
import { useAppSelector } from '@/hooks'

  // ? Local Component
  const InfoField = ({
    label,
    info,
    isLoading,
    children,
  }: {
    label: string
    info: string | undefined
    isLoading: boolean
    children: React.ReactNode
  }) => (
    <div className="flex-1 px-5">
      <div className="flex items-center justify-between border-b border-gray-200 py-4">
        <div className="w-full">
          <span className="text-xs text-gray-700">{label}</span>
          {isLoading ? (
            <Skeleton.Item animated="background" height="h-5" width="w-44" />
          ) : (
            <div className="flex items-center justify-between">
              <p className="h-5 text-sm">{info}</p>
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  )

const ProfilePage: NextPage = () => {
  const { data, isLoading } = useGetUserInfoMeQuery()
  const { userInfo } = useAppSelector((state) => state.auth)

  return (
    <ProtectedRouteWrapper allowedRoles={[roles.ADMIN, roles.SUPERADMIN, roles.USER]}>
      <Head>
        <title>وندامد | پروفایل</title>
      </Head>
      <Header />
      <div className="lg:container lg:flex lg:max-w-7xl lg:gap-x-4 lg:px-3 xl:mt-28">
        <ProfileLayout>
        <PageContainer title="حساب کاربری">
          <section className="lg:flex">
            <InfoField label="نام و نام خانوادگی" info={data?.data?.fullName} isLoading={isLoading}>
              <UserNameModal editedData={data?.data?.fullName} />
            </InfoField>
            <InfoField label="شماره موبایل" info={data?.data?.mobileNumber} isLoading={isLoading}>
              <UserMobileModal editedData={data?.data?.mobileNumber} />
            </InfoField>
          </section>
        </PageContainer>
      </ProfileLayout>
      </div>
    </ProtectedRouteWrapper>
  )
}

export default dynamic(() => Promise.resolve(ProfilePage), { ssr: false })
