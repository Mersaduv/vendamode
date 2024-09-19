import { ArticleCard } from '@/components/articles'
import { EmptyCustomList } from '@/components/emptyList'
import { ClientLayout } from '@/components/Layouts'
import { Pagination } from '@/components/navigation'
import { DataStateDisplay, MetaTags } from '@/components/shared'
import { ProductSkeleton } from '@/components/skeleton'
import { useAppSelector } from '@/hooks'
import { useGetAllSlidersQuery, useGetArticlesQuery, useGetProductsQuery } from '@/services'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
/* eslint-disable tailwindcss/no-custom-classname */
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination as PaginationSlider, Autoplay, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

import { Button, ResponsiveImage } from '@/components/ui'

import type { IProduct, ISlider } from '@/types'
import { digitsEnToFa } from '@persian-tools/persian-tools'
import { ProductDiscountTag, ProductPriceDisplay } from '@/components/product'
import { LastSeenSlider, NewSlider, RecentVisitedSlider } from '@/components/sliders'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Product } from '@/store'
const Articles: NextPage = () => {
  // ? Assets
  const { query } = useRouter()
  const category = query?.categorySlug?.toString() ?? ''
  const { generalSetting } = useAppSelector((state) => state.design)
  const { lastSeen } = useAppSelector((state) => state.lastSeen)

  // ? States
  const [lastSeenData, setLastSeenData] = useState<IProduct[]>([])

  // ? Querirs
  //*    Get Products Data
  const { data: articleData, ...articlesQueryProps } = useGetArticlesQuery({
    ...query,
    isCategory: true,
    isActive: true,
  })
  const { data: latestArticlesData, ...latestArticlesQueryProps } = useGetArticlesQuery({
    ...query,
    sort: '1',
    isCategory: true,
    isActive: true,
    pageSize: 5,
  })

  const { products: productData, isFetching: isFetchingNew } = useGetProductsQuery(
    {
      inStock: '1', //
      pageSize: 30, //
      isActive: true,
    },
    {
      selectFromResult: ({ data, isFetching }) => ({
        products: data?.data?.pagination.data,
        isFetching,
      }),
    }
  )

  const { products: productDataLastSeen, isFetching: isFetchingLastSeen } = useGetProductsQuery(
    {
      pageSize: 9999, //
      isActive: true,
    },
    {
      selectFromResult: ({ data, isFetching }) => ({
        products: data?.data?.pagination.data,
        isFetching,
      }),
    }
  )

  const { products: newProductsData, isFetching: isFetchingNewData } = useGetProductsQuery(
    {
      sortBy: 'LastUpdated',
      sort: 'desc',
      inStock: '1',
      pageSize: 30,
      isActive: true,
    },
    {
      selectFromResult: ({ data, isFetching }) => ({
        products: data?.data?.pagination.data,
        isFetching,
      }),
    }
  )

  useEffect(() => {
    if (productDataLastSeen) {
      const updatedLastSeenData = productDataLastSeen.map((item) => {
        const lastSeenItem = lastSeen.find((itemLastSeen) => itemLastSeen.productID === item.id)

        if (lastSeenItem) {
          return {
            ...item,
            created: lastSeenItem.lastTime, // جایگزینی created با lastTime
          }
        }

        return item
      })

      setLastSeenData(updatedLastSeenData)
    }
  }, [productDataLastSeen, lastSeen])

  if (lastSeenData) {
    console.log(lastSeenData, 'lastSeenData')
  }

  // ? Local Component
  const SliderImage = ({ item, index }: { item: IProduct; index: number }) => (
    <ResponsiveImage
      dimensions="w-full h-[250px]"
      imageStyles="object-cov"
      className="   transition duration-300 ease-in-out transform hover:scale-110"
      src={item.mainImageSrc.imageUrl}
      alt={`${item.title}`}
      unoptimized={true}
      blurDataURL={item.mainImageSrc.placeholder}
    />
  )
  if (isFetchingNew) {
    return <div>Loading...</div>
  }

  // ? Render(s)
  return (
    <>
      <MetaTags
        title={generalSetting?.title + ' | ' + 'مقالات'}
        description={generalSetting?.shortIntroduction || 'توضیحاتی فروشگاه اینترنتی'}
        keywords={generalSetting?.googleTags || ' اینترنتی, فروشگاه'}
      />
      <ClientLayout>
        <>
          <main className="lg:container overflow-y-auto lg:max-w-[1700px] lg:px-3 relative">
            <h1 className="mt-10 sm:mt-20 xl:mt-10">مقالات</h1>

            <div className="flex flex-col sm:flex-row relative">
              {' '}
              {/* articles */}
              <div className="my-4 flex-1">
                <DataStateDisplay
                  {...articlesQueryProps}
                  dataLength={articleData?.data?.totalCount ? articleData.data.totalCount : 0}
                  loadingComponent={<ProductSkeleton />}
                  emptyComponent={<EmptyCustomList />}
                >
                  {articleData && articleData.data && articleData.data.data && articleData.data.data.length > 0 && (
                    <section className="flex flex-wrap gap-4">
                      {articleData.data.data.map((item) => (
                        <ArticleCard article={item} key={item.id} />
                      ))}
                    </section>
                  )}
                </DataStateDisplay>

                {articleData && articleData.data && articleData?.data?.data && articleData?.data?.data?.length > 0 && (
                  <div className="mx-auto mt-10 py-4 lg:max-w-5xl">
                    <Pagination pagination={articleData?.data} section="articles" client />
                  </div>
                )}
              </div>
              {/* sticky content */}
              <div className="flex- flex-col ">
                <aside className="left-0 top-0 w-[274px] border rounded-lg p-3 shadow-item  px-4 mb-8">
                  <h3 className="my-2 mb-5 text-gray-600 text-center">پیشنهاد لحظه ای</h3>
                  <Swiper
                    pagination={{ clickable: true }}
                    autoplay={{
                      delay: 2500,
                      disableOnInteraction: false,
                    }}
                    navigation={true}
                    modules={[Autoplay, Navigation]}
                    className="articlePageSwiper overflow-hidden"
                  >
                    {productData &&
                      productData.map((product, index) => {
                        const filteredItems = product?.stockItems.filter((item) => {
                          if (item.discount === 0 && item.price > 0 && item.quantity === 0) {
                            return true
                          } else if (item.discount > 0 && item.price > 0 && item.quantity === 0) {
                            return true
                          } else if (item.discount === 0 && item.price > 0 && item.quantity > 0) {
                            return true
                          } else if (item.discount > 0 && item.price > 0 && item.quantity > 0) {
                            return true
                          }
                          return false
                        })

                        return (
                          <SwiperSlide key={index}>
                            <a href={`/products/${product.slug}`} target="_blank" className="">
                              <SliderImage index={index} item={product} />
                              <h3 className="text-gray-500 text-start mt-2">{product.title}</h3>
                              <div className="mt-1.5 flex justify-center gap-x-2 px-2 relative">
                                <div className="">
                                  {filteredItems[0].discount > 0 && (
                                    <ProductDiscountTag
                                      price={filteredItems[0].price}
                                      discount={filteredItems[0].discount}
                                      isSlider
                                    />
                                  )}
                                </div>
                                <ProductPriceDisplay
                                  inStock={product.inStock}
                                  discount={filteredItems[0].discount}
                                  price={filteredItems[0].price}
                                />
                              </div>
                            </a>
                          </SwiperSlide>
                        )
                      })}
                  </Swiper>
                </aside>

                {latestArticlesData &&
                  latestArticlesData.data &&
                  latestArticlesData.data.data &&
                  latestArticlesData.data.data.length > 0 && (
                    <aside className="left-0 top-0 w-[274px] h-auto border rounded-lg p-3 shadow-item  px-4">
                      <h3 className="my-2 mb-5 text-gray-600 text-center">مطالب جدید</h3>
                      <section className="flex flex-wrap gap-4">
                        {latestArticlesData.data.data.map((item) => (
                          <a target="_blank" href={`/articles/${item.slug}`} className="blank w-full">
                            <article className={`flex w-full rounded-lg shadow-item hover:shadow-article p-1.5`}>
                              <img
                                className="mx-auto relative rounded-lg w-[60px] h-[60px] ml-1.5"
                                src={item.image.imageUrl}
                                alt={item.title}
                              />
                              <div className="flex-1 flex items-center justify-center">
                                <h3 className="text-center text-gray-500 line-clamp-2 overflow-hidden text-ellipsis">
                                  {item.title}
                                </h3>
                              </div>
                            </article>
                          </a>
                        ))}
                      </section>
                    </aside>
                  )}
              </div>
            </div>
          </main>
        </>
        {/* last seen slider */}
        {lastSeenData.length > 0 && (
          <div className="pt-10 sm:pt-0 relative">
            <hr className="pb-20 mx-8 border-t-2 mt-20" />
            <div className="w-full block text-center px-3 line-clamp-2 overflow-hidden text-ellipsis  sm:hidden whitespace-nowrap -mt-20 text-lg text-gray-400 ">
              بازدید های اخیر شما
            </div>
            <div className="flex w-full bg-slate-300 relative  h-[340px] sm:h-[275px] mt-28">
              <div className="hidden w-[38%] sm:block md:w-[20%]">
                <div className="hidden sm:block">
                  <div className=" line-clamp-2 overflow-hidden text-ellipsis text-center -mt-20 text-lg text-gray-400  px-3 w-full">
                    بازدید های اخیر شما
                  </div>
                </div>
                <div className="mt-20 flex justify-center">
                  <img className="w-[220px]" src="/images/Recent Visited.webp" alt="offer" />
                </div>
                <p className="text-gray-500 font-normal text-md w-full text-center my-4 mb-5">
                  بازدید های اخیر رو اینجا ببین
                </p>
                <div className="w-full  sm:flex justify-center hidden">
                  <Link href={`/products`}>
                    <Button className="bg-red-500 hover:bg-red-400 rounded-lg py-2 px-8 text-white">نمایش همه</Button>
                  </Link>
                </div>
              </div>
              <div className="w-[100%] sm:w-[62%] md:w-[80%] -mt-20">
                <RecentVisitedSlider products={lastSeenData} isFetching={isFetchingLastSeen} />
              </div>
            </div>
            <div className="w-full  sm:hidden justify-center flex absolute bottom-[150px]">
              <Link href={`/products`}>
                <Button className="bg-red-500 hover:bg-red-400 rounded-lg py-2 px-8 text-white">نمایش همه</Button>
              </Link>
            </div>
            <hr className="pb-10 mx-8 border-t-2 mt-20" />
          </div>
        )}
        {/* //  newest slider */}
        {newProductsData &&
          newProductsData.filter((item) => item.stockItems.every((item) => item.quantity !== 0)).length > 0 && (
            <div className="relative pt-28 sm:pt-0 pb-10">
              <div className="w-full block  sm:hidden text-center px-3 line-clamp-2 overflow-hidden text-ellipsis  whitespace-nowrap -mt-20 text-lg text-gray-400 ">
                جدید ترین های {generalSetting?.title}
              </div>
              <div className="flex w-full bg-slate-300 relative h-[340px] sm:h-[275px] mt-28">
                <div className="hidden w-[38%] sm:block md:w-[20%]">
                  <div className="hidden sm:block h-[72px]">
                    <div className=" line-clamp-2 overflow-hidden text-ellipsis text-center -mt-20 text-lg text-gray-400  px-3 pt-4 w-full">
                      جدید ترین های {generalSetting?.title}
                    </div>
                  </div>
                  <div className="mt-10 flex justify-center">
                    <img className="w-[220px]" src="/images/NEW.webp" alt="offer" />
                  </div>
                  <p className="text-gray-500 font-normal text-md w-full text-center my-4 mb-5">به روز باش</p>
                  <div className="w-full  sm:flex justify-center hidden">
                    <Link href={`/products?sortBy=LastUpdated&sort=desc&inStock=1`}>
                      <Button className="bg-red-500 hover:bg-red-400 rounded-lg py-2 px-8 text-white">نمایش همه</Button>
                    </Link>
                  </div>
                </div>
                <div className="w-[100%] sm:w-[62%] md:w-[80%] -mt-20 ">
                  <NewSlider isFetching={isFetchingNewData} products={newProductsData} />
                </div>
              </div>
              <div className="w-full  sm:hidden justify-center flex absolute bottom-[105px]">
                <Link href={`/products?sortBy=LastUpdated&sort=desc&inStock=1`}>
                  <Button className="bg-red-500 hover:bg-red-400 rounded-lg py-2 px-8 text-white">نمایش همه</Button>
                </Link>
              </div>
            </div>
          )}
      </ClientLayout>
    </>
  )
}

export default dynamic(() => Promise.resolve(Articles), { ssr: false })
