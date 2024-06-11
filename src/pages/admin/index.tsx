import dynamic from 'next/dynamic'
import Head from 'next/head'
import Image from 'next/image'

import { roles } from '@/utils'

import { ProtectedRouteWrapper } from '@/components/user'
import { DashboardAdminAside } from '@/components/shared'

import type { NextPage } from 'next'

const AdminPage: NextPage = () => {
  return (
    <ProtectedRouteWrapper allowedRoles={[roles.ADMIN, roles.SUPERADMIN]}>
      <div className="lg:container lg:flex lg:max-w-7xl lg:gap-x-4 lg:px-3 ">
        <Head>
          <title>وندامد | مدیریت</title>
        </Head>

        <div>
          <DashboardAdminAside />
        </div>
        <div className="hidden h-fit py-6 lg:mt-6 lg:inline-block lg:flex-1 lg:rounded-md lg:border lg:border-gray-400">
          <section className="py-20">
      چارت و انالیز..
          </section>
        </div>
      </div>
    </ProtectedRouteWrapper>
  )
}

export default dynamic(() => Promise.resolve(AdminPage), { ssr: false })
