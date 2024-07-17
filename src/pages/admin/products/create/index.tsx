import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { DashboardLayout } from '@/components/Layouts'
import { HandleResponse } from '@/components/shared'
import { IProductForm } from '@/types'
import { useCreateProductMutation } from '@/services'
import { ProductForm } from '@/components/form'
import { useDispatch } from 'react-redux'
import { setUpdated } from '@/store'

interface Props {}
const Create: NextPage<Props> = () => {
  // ? Assets
  const { push } = useRouter()
  const dispatch = useDispatch()
  // ? Queries
  //*   Create Product
  const [createProduct, { data, isSuccess, isLoading, isError, error }] = useCreateProductMutation()

  // ? Handlers
  const createHandler = (data: FormData) => {
    createProduct(data)
  }

  const onSuccess = () => {
    dispatch(setUpdated(true))
    push('/admin/products')
  }

  return (
    <>
      {(isSuccess || isError) && (
        <HandleResponse
          isError={isError}
          isSuccess={isSuccess}
          error={error}
          message={data?.message}
          onSuccess={onSuccess}
        />
      )}

      <main>
        <Head>
          <title>مدیریت | محصول</title>
        </Head>
        <DashboardLayout>
          <section className="bg-[#f5f8fa] w-full px-8 lg:px-14">
            <ProductForm mode="create" createHandler={createHandler} isLoadingCreate={isLoading} />
          </section>
        </DashboardLayout>
      </main>
    </>
  )
}

export default dynamic(() => Promise.resolve(Create), { ssr: false })
