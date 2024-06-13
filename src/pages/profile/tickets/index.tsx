import { ProfileLayout } from '@/components/Layouts'
import { Header } from '@/components/shared'
import { PageContainer } from '@/components/ui'
import type { NextPage } from 'next'
import Head from 'next/head'
const Tickets: NextPage = () => {
  return (
    <main id="profileTickets">
      <Head>
        <title>پروفایل | تیکت های پشتیبانی</title>
      </Head>
      <Header />
      <ProfileLayout>
        <PageContainer title="">
            <div>تیکت ها</div>
        </PageContainer>
      </ProfileLayout>
    </main>
  )
}

export default Tickets
