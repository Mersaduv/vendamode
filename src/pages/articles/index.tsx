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

import { ResponsiveImage } from '@/components/ui'

import type { IProduct, ISlider } from '@/types'
import { digitsEnToFa } from '@persian-tools/persian-tools'
const Articles: NextPage = () => {
  // ? Assets
  const { query } = useRouter()
  const category = query?.categorySlug?.toString() ?? ''
  const { generalSetting } = useAppSelector((state) => state.design)
  // ? Querirs
  //*    Get Products Data
  const { data: articleData, ...articlesQueryProps } = useGetArticlesQuery(query)
  const { data: latestArticlesData, ...latestArticlesQueryProps } = useGetArticlesQuery(
    { ...query, sort: '1' } // Passing 'created' to fetch latest articles
  )

  const { data: productData } = useGetProductsQuery(
    { pageSize: 5 },
    {
      selectFromResult: ({ data }) => ({
        data: data?.data?.pagination.data,
      }),
    }
  )

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

  // ? Render(s)
  return (
    <>
      <MetaTags
        title={generalSetting?.title + ' | ' + 'مقالات'}
        description={generalSetting?.shortIntroduction || 'توضیحاتی فروشگاه اینترنتی'}
        keywords={generalSetting?.googleTags || ' اینترنتی, فروشگاه'}
      />
      <ClientLayout>
        <main className="lg:container overflow-y-auto lg:max-w-[1700px] lg:px-3 xl:mt-10 relative">
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

              {articleData &&
                articleData.data &&
                articleData?.data?.data &&
                articleData?.data?.data?.length > 0 && (
                  <div className="mx-auto mt-10 py-4 lg:max-w-5xl">
                    <Pagination pagination={articleData?.data} section="articles" client />
                  </div>
                )}
            </div>
            {/* sticky content */}
            <div className="flex- flex-col ">
              <aside className="left-0 top-0 w-[274px] h-[405px] border rounded-lg p-3 shadow-item  px-4 mb-8">
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
                    productData.map((item, index) => {
                      const stockItemPrice = item.stockItems.find(
                        (stockItem) => stockItem.quantity! > 0 && (stockItem.price !== undefined || stockItem.price > 0)
                      )
                      return (
                        <SwiperSlide key={index}>
                          <a href={`/products/${item.slug}`} target="_blank" className="">
                            <SliderImage index={index} item={item} />
                            <h2 className="text-gray-500 text-center mt-6">{item.title}</h2>
                            <div className="text-gray-400 text-center text-sm">
                              {digitsEnToFa(stockItemPrice?.price ?? '')} تومان
                            </div>
                          </a>
                        </SwiperSlide>
                      )
                    })}
                </Swiper>
              </aside>
              <aside className="left-0 top-0 w-[274px] h-auto border rounded-lg p-3 shadow-item  px-4">
                <h3 className="my-2 mb-5 text-gray-600 text-center">مطالب جدید</h3>
                {latestArticlesData &&
                  latestArticlesData.data &&
                  latestArticlesData.data.data &&
                  latestArticlesData.data.data.length > 0 && (
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
                  )}
              </aside>
            </div>
          </div>
        </main>
      </ClientLayout>
    </>
  )
}

export default dynamic(() => Promise.resolve(Articles), { ssr: false })
