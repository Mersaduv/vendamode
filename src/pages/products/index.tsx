import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { useGetProductsQuery, useGetSingleCategoryQuery } from '@/services'

import { EmptyCustomList } from '@/components/emptyList'
import { ClientLayout } from '@/components/Layouts'
import {
  ProductSubCategoriesList,
  ProductCard,
  ProductFilterControls,
  ProductSort,
  ProductBreadcrumb,
} from '@/components/product'
import { DataStateDisplay, MetaTags } from '@/components/shared'
import { ProductSkeleton } from '@/components/skeleton'
import { Pagination } from '@/components/navigation'
import { FilterModal } from '@/components/modals'

import type { NextPage } from 'next'
import { digitsEnToFa } from '@persian-tools/persian-tools'
import { useAppSelector } from '@/hooks'
import { useEffect, useState } from 'react'
import { CategoryWithAllParents, ICategory } from '@/types'

const ProductsHome: NextPage = () => {
  // ? Assets
  const { query, events } = useRouter()
  const category = query?.categorySlug?.toString() ?? ''
  const categoryId = query?.categoryId?.toString() ?? undefined
  const brands = typeof query.brands === 'string' ? query.brands.split(',') : undefined
  const { generalSetting } = useAppSelector((state) => state.design)
  // ? Querirs
  //*    Get Products Data
  const { data, ...productsQueryProps } = useGetProductsQuery(query)
  
  const { data: singleCategoryData, refetch: refetchSingleCategoryData } = useGetSingleCategoryQuery({
    id: categoryId,
  })
  
  // ? States
  const [slugData, setSlugData] = useState<CategoryWithAllParents | null>(null)

  useEffect(() => {
    if (singleCategoryData && singleCategoryData.data) {
      console.log(singleCategoryData, 'singleCategoryData')

      setSlugData({
        category: singleCategoryData.data,
        parentCategories: singleCategoryData.data?.parentCategories ?? [],
      })
    }
  }, [refetchSingleCategoryData])

  useEffect(() => {
    events.on('routeChangeComplete', refetchSingleCategoryData)

    return () => {
      events.off('routeChangeComplete', refetchSingleCategoryData)
    }
  }, [events, refetchSingleCategoryData])

  // ? Render(s)
  return (
    <>
      <MetaTags
        title={generalSetting?.title + ' | ' + 'فروشگاه' || 'فروشگاه اینترنتی'}
        description={generalSetting?.shortIntroduction || 'توضیحاتی فروشگاه اینترنتی'}
        keywords={generalSetting?.googleTags || ' اینترنتی, فروشگاه'}
      />
      <ClientLayout>
        <main className="lg:container overflow-y-auto lg:max-w-[1900px] lg:px-3 xl:mt-10">
          <ProductSubCategoriesList category={category} />

          <div className="px-1 lg:flex lg:gap-x-0 xl:gap-x-3">
            {/* incorrect  */}
            {!productsQueryProps.isLoading && (
              <aside className="hidden lg:static lg:top-40 lg:mt-6 lg:block lg:h-fit max-w-md w-[40%] lg:rounded-md lg:border-gray-200 lg:px-3 lg:py-4 ">
                <ProductFilterControls
                  mainMaxPrice={data?.data?.mainMaxPrice}
                  mainMinPrice={data?.data?.mainMinPrice}
                />
              </aside>
            )}
            <div id="_products" className="mt-3 w-full p-4 ">
              {/* Filters & Sort */}
              <div className=" divide-gray-300/90">
                <div className="flex gap-x-3 py-2 flex-col">
                  <div className="w-full lg:flex flex-col hidden">
                    <div className="mb-6 text-gray-400 text-sm -mt-2 md:-mt-0 md:text-lg md:text-gray-800 flex">
                      دسته بندی محصولات :
                      {singleCategoryData && singleCategoryData?.data !== undefined && singleCategoryData?.data !== null ? (
                        <div className="flex items-center">
                          <ProductBreadcrumb  categoryLevelProductList={singleCategoryData?.data} isAdmin />
                        </div>
                      ) : null}
                      {/* <span className="text-[#00c3e1] md:font-bold">{generalSetting?.title}</span> */}
                    </div>
                    {/* correct  */}
                    <ProductSort />
                  </div>
                  <div className="block lg:hidden mt-4">
                    {/* incorrect  */}
                    {/* {!productsQueryProps.isLoading && (
                      <FilterModal mainMaxPrice={data?.data?.mainMaxPrice} mainMinPrice={data?.data?.mainMinPrice} />
                    )} */}
                  </div>
                </div>

                <div className="flex justify-end py-1 text-end">
                  <span className="farsi-digits">{digitsEnToFa(data?.data?.productsLength ?? 0)} کالا</span>
                </div>
              </div>

              <DataStateDisplay
                {...productsQueryProps}
                dataLength={data?.data?.productsLength ? data.data.productsLength : 0}
                loadingComponent={<ProductSkeleton />}
                emptyComponent={<EmptyCustomList />}
              >
                {data && data.data && data.data.pagination.data && data.data.pagination.data.length > 0 && (
                  <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  gap-8">
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
