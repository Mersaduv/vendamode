import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { DashboardLayout } from '@/components/Layouts'
const ProductConfiguration: NextPage = () => {
 return (
    <>
      <main>
        <Head>
          <title>مدیریت | پیکربندی محصول</title>
        </Head>
        <DashboardLayout>{''}</DashboardLayout>
      </main>
    </>
  )
}
export default dynamic(() => Promise.resolve(ProductConfiguration), { ssr: false })
