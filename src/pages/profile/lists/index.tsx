import dynamic from 'next/dynamic'
import Head from 'next/head'

import { FavoritesListEmpty } from '@/icons'

import { ProfileLayout } from '@/components/Layouts'
import { PageContainer } from '@/components/ui'

import type { NextPage } from 'next'
import { Header } from '@/components/shared'

const Lists: NextPage = () => {
  // ? Render(s)
  return (
    <main>
      <Head>
        <title>پروفایل | لیست‌ها</title>
      </Head>
      <Header />
      <ProfileLayout>
        <PageContainer title="لیست‌ها">
          <section className="py-20">
            <FavoritesListEmpty className="mx-auto h-52 w-52" />
            <p className="text-center">لیست علاقه‌مندی‌های شما خالی است.</p>
          </section>
        </PageContainer>
      </ProfileLayout>
    </main>
  )
}

export default dynamic(() => Promise.resolve(Lists), { ssr: false })
