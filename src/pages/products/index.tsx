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
        <main className="lg:container overflow-y-auto lg:max-w-[1900px] lg:px-3 xl:mt-10">
          <ProductSubCategoriesList category={category} />

          <div className="px-1 lg:flex lg:gap-x-0 xl:gap-x-3">
            {!productsQueryProps.isLoading && (
              <aside className="hidden lg:sticky lg:top-40 lg:mt-6 lg:block lg:h-fit max-w-md w-[40%] lg:rounded-md lg:border-gray-200 lg:px-3 lg:py-4 ">
                <ProductFilterControls
                  mainMaxPrice={data?.data?.mainMaxPrice}
                  mainMinPrice={data?.data?.mainMinPrice}
                />
              </aside>
            )}
            <div id="_products" className="mt-3 w-full p-4 ">
              {/* Filters & Sort */}
              <div className=" divide-gray-300/90">
                {/* <div className="flex gap-x-3 py-2">
                  <div className="block lg:hidden">
                    {!productsQueryProps.isLoading && (
                      <FilterModal mainMaxPrice={data?.data?.mainMaxPrice} mainMinPrice={data?.data?.mainMinPrice} />
                    )}
                  </div>
                  <div className='w-full flex flex-col'>
                  <div className='mb-6'>دسته بندی محصولات : <span className='text-[#00c3e1] font-bold'>وندامد</span></div>
                  <ProductSort />
                  </div>
         
                </div> */}
                <div className="flex gap-x-3 py-2 flex-col">
                <div className="w-full lg:flex flex-col hidden">
                      <div className="mb-6 text-gray-400 text-sm -mt-2 md:-mt-0 md:text-lg md:text-gray-800">
                        دسته بندی محصولات : <span className="text-[#00c3e1] md:font-bold">وندامد</span>
                      </div>
                      <ProductSort />
                    </div>
                  <div className="block lg:hidden">
                    {!productsQueryProps.isLoading && (
                      <FilterModal mainMaxPrice={data?.data?.mainMaxPrice} mainMinPrice={data?.data?.mainMinPrice} />
                    )}
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
                  <section className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-8">
                    {data?.data?.pagination.data!.map((item) => (
                      <ProductCard product={item} key={item.id} />
                    ))}
                  </section>
                )}
              </DataStateDisplay>
            </div>
          </div>

          {data && data.data?.productsLength! > 5 && (
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
