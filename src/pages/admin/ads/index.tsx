import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'




import type { NextPage } from 'next'

const Ads: NextPage = () => {
  // ? Assets
  const { replace, query } = useRouter()

  // ? Handlers

  const onSuccess = () => replace(query?.redirectTo?.toString() || '/admin/ads')

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
          <title>مدیریت | تبلیغات</title>
        </Head>
        <section className="container max-w-xl space-y-6 px-12 py-6 lg:rounded-lg lg:border-gray-100">ads</section>
      </main>
    </>
  )
}

export default dynamic(() => Promise.resolve(Ads), { ssr: false })
