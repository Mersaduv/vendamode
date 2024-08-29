import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'

import type { NextPage } from 'next'
import { DashboardLayout } from '@/components/Layouts'
import { MainPageAdsForm } from '@/components/form'

const Main: NextPage = () => {
  // ? Assets
  const { replace, query } = useRouter()

  // ? Handlers

  const onSuccess = () => replace(query?.redirectTo?.toString() || '/admin/Main')

  // ? Render(s)
  return (
    <>
      {/*  Handle Login Response */}
      {/* {(isSuccess || isError) && (
        <HandleResponse
          isError={isError}
          isSuccess={isSuccess}
          error={error}
          message={data?.data?.fullName}
          onSuccess={onSuccess}
          isLogin
        />
      )} */}

      <main className="grid min-h-screen items-center">
        <Head>
          <title>مدیریت | صفحه اصلی</title>
        </Head>
        <DashboardLayout>
          <section className="bg-[#f5f8fa] w-full pt-[65px]">
            <MainPageAdsForm />
          </section>
        </DashboardLayout>
      </main>
    </>
  )
}

export default dynamic(() => Promise.resolve(Main), { ssr: false })
