import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Head from 'next/head'
import { DashboardLayout } from '@/components/Layouts'
import { PageContainer } from '@/components/ui'
const CategoryPage: NextPage = () => {
  return (
    <main>
      <Head>
        <title>مدیریت | دسته بندی ها</title>
      </Head>
      <DashboardLayout>
          <div>دسته بندی ها</div>
      </DashboardLayout>
    </main>
  )
}

export default CategoryPage
