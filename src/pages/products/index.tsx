import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { useGetProductsQuery } from '@/services'

import { EmptyCustomList } from '@/components/emptyList'
import { ClientLayout } from '@/components/Layouts'
import { ProductSubCategoriesList, ProductCard, ProductFilterControls, ProductSort } from '@/components/product'
import { DataStateDisplay } from '@/components/shared'
import { ProductSkeleton } from '@/components/skeleton'
import { Pagination } from '@/components/navigation'
import { FilterModal } from '@/components/modals'

import type { NextPage } from 'next'

const ProductsHome: NextPage = () => {
  // ? Assets
  const { query } = useRouter()
  const category = query?.category?.toString() ?? ''

  // ? Querirs
  //*    Get Products Data
  const { data, ...productsQueryProps } = useGetProductsQuery(query)

  // ? Render(s)
  return (
    <>
      <Head>
        <title> وندامد | فروشگاه</title>
      </Head>

      <ClientLayout>
        <main className="lg:container lg:max-w-[1700px] lg:px-3 xl:mt-10">
          <ProductSubCategoriesList category={category} />

          <div className="px-1 lg:flex lg:gap-x-0 xl:gap-x-3">
            {!productsQueryProps.isLoading && (
              <aside className="hidden lg:sticky lg:top-40 lg:mt-6 lg:block lg:h-fit lg:w-[400px] lg:rounded-md lg:border-gray-200 lg:px-3 lg:py-4 ">
                <ProductFilterControls
                  mainMaxPrice={data?.data?.mainMaxPrice}
                  mainMinPrice={data?.data?.mainMinPrice}
                />
              </aside>
            )}
            <div id="_products" className="mt-3 w-full p-4 ">
              {/* Filters & Sort */}
              <div className=" divide-gray-300/90">
                <div className="flex gap-x-3 py-2">
                  <div className="block lg:hidden">
                    {!productsQueryProps.isLoading && (
                      <FilterModal mainMaxPrice={data?.data?.mainMaxPrice} mainMinPrice={data?.data?.mainMinPrice} />
                    )}
                  </div>
                  <div className='w-full flex flex-col'>
                  <div className='mb-6'>دسته بندی محصولات : <span className='text-[#00c3e1] font-bold'>وندامد</span></div>
                  <ProductSort />
                  </div>
         
                </div>

                <div className="flex justify-end py-1 text-end">
                  <span className="farsi-digits">{data?.data?.productsLength} کالا</span>
                </div>
              </div>

              <DataStateDisplay
                {...productsQueryProps}
                dataLength={data?.data?.productsLength ? data.data.productsLength : 0}
                loadingComponent={<ProductSkeleton />}
                emptyComponent={<EmptyCustomList />}
              >
                {data && data.data!.pagination.data!.length > 0 && (
                  <section className="space-y-3 divide-y divide-gray-300 sm:grid sm:grid-cols-2 sm:space-y-0 sm:divide-y-0 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    {data?.data?.pagination.data!.map((item) => (
                      <ProductCard product={item} key={item.id} />
                    ))}
                  </section>
                )}
              </DataStateDisplay>
            </div>
          </div>

          {data && data.data?.productsLength! > 10 && (
            <div className="mx-auto py-4 lg:max-w-5xl">
              <Pagination pagination={data?.data?.pagination!} section="_products" client />
            </div>
          )}
        </main>
      </ClientLayout>
    </>
  )
}

export default dynamic(() => Promise.resolve(ProductsHome), { ssr: false })
