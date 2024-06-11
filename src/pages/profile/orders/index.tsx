import { ProfileLayout } from '@/components/Layouts'
import { EmptyOrdersList } from '@/components/emptyList'
import { Header } from '@/components/shared'
import { PageContainer } from '@/components/ui'
import { NextPage } from 'next'
import Head from 'next/head'
const OrderPage : NextPage = () => {
  return (
    <main id="profileOrders">
      <Head>
        <title>پروفایل | تاریخچه سفارشات</title>
      </Head>
      <Header />
      <ProfileLayout>
        <PageContainer title="تاریخچه سفارشات">
          {/* <DataStateDisplay
            {...ordersQueryProps}
            dataLength={data ? data.ordersLength : 0}
            emptyComponent={<EmptyOrdersList />}
            loadingComponent={<OrderSkeleton />}
          >
            <div className="space-y-3 px-4 py-3">
              {data?.orders.map((item) => (
                <OrderCard key={item._id} order={item} />
              ))}
            </div>
          </DataStateDisplay> */}
          <EmptyOrdersList />
          {/* {data && data.ordersLength > 5 && (
            <div className="mx-auto py-4 lg:max-w-5xl">
              <Pagination pagination={data.pagination} section="profileOrders" client />
            </div>
          )} */}
        </PageContainer>
      </ProfileLayout>
    </main>
  )
}

export default OrderPage
