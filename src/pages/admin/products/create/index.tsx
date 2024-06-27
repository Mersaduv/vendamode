import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { DashboardLayout } from '@/components/Layouts'
import { HandleResponse } from '@/components/shared'
import { IProductForm } from '@/types'
import { useCreateProductMutation } from '@/services'
import { ProductForm } from '@/components/form'

interface Props {}
const Create: NextPage<Props> = () => {
  // ? Assets
  const { push } = useRouter()

  // ? Queries
  //*   Create Product
  const [createProduct, { data, isSuccess, isLoading, isError, error }] = useCreateProductMutation()

  // ? Handlers
  const createHandler = (data: FormData) => {
    createProduct(data)
  }

  const onSuccess = () => {
    push('/admin/products')
  }

  return (
    <>
      {(isSuccess || isError) && (
        <HandleResponse
          isError={isError}
          isSuccess={isSuccess}
          error={error}
          message={data?.msg}
          onSuccess={onSuccess}
        />
      )}

      <main>
        <Head>
          <title>مدیریت | ایجاد محصول</title>
        </Head>
        <DashboardLayout>
          <section className="bg-[#f5f8fa] w-full h-screen px-8 lg:px-14">
            <ProductForm mode="create" createHandler={createHandler} isLoadingCreate={isLoading} />
          </section>
        </DashboardLayout>
      </main>
    </>
  )
}

export default dynamic(() => Promise.resolve(Create), { ssr: false })
