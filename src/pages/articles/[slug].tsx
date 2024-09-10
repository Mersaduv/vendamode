import { ClientLayout } from '@/components/Layouts'
import { MetaTags } from '@/components/shared'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { getArticleBySlug, getProductByCategory, useGetArticlesQuery, useGetProductsQuery } from '@/services'
import { GetStockItems, IArticle, IProduct } from '@/types'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination as PaginationSlider, Autoplay, Navigation } from 'swiper/modules'
import { Button, ResponsiveImage } from '@/components/ui'
import { digitsEnToFa } from '@persian-tools/persian-tools'
import 'ckeditor5/ckeditor5.css'
import { ProductDiscountTag, ProductPriceDisplay } from '@/components/product'
import Link from 'next/link'
import { LastSeenSlider, NewSlider, SmilarProductsSlider } from '@/components/sliders'
import SimilarProductsSlider from '@/components/sliders/SimilarProductsSlider'
import { ReviewArticleList, ReviewsList } from '@/components/review'
interface Props {
  article: IArticle
  products: IProduct[]
}

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ')
}

export const getServerSideProps: GetServerSideProps<Props, { slug: string }> = async ({ params }) => {
  const { data: article } = await getArticleBySlug(params?.slug ?? '')

  if (!article) return { notFound: true }

  const articleCategoryID = article.categoryId
  const { data } = await getProductByCategory(articleCategoryID)
  const similarProduct = data ?? []
  return {
    props: {
      article: JSON.parse(JSON.stringify(article)),
      products: similarProduct,
    },
  }
}

const SingleArticle: NextPage<Props> = (props) => {
  // ? Props
  const { article, products } = props

  // ? Assets
  const dispatch = useAppDispatch()
  const { query } = useRouter()

  const { generalSetting } = useAppSelector((state) => state.design)
  const { lastSeen } = useAppSelector((state) => state.lastSeen)
  const { data: latestArticlesData, ...latestArticlesQueryProps } = useGetArticlesQuery({
    ...query,
    sort: '1',
    pageSize: 5,
  })

  const { data: articlesDataByCategory, ...articlesByCategoryQueryProps } = useGetArticlesQuery({
    ...query,
    pageSize: 5,
    categoryId: article.categoryId ?? 'default',
  })

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
      dimensions="w-[250px] h-[250px]"
      imageStyles="object-cover"
      className="transition duration-300 ease-in-out transform hover:scale-110"
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
        title={generalSetting?.title + ' | ' + `خرید ${article.title}` || 'فروشگاه اینترنتی'}
        description={generalSetting?.shortIntroduction + article.title || 'توضیحاتی فروشگاه اینترنتی'}
        keywords={generalSetting?.googleTags || ' اینترنتی, فروشگاه'}
      />
      <ClientLayout>
        <>
          <main className="mx-auto space-y-4 py-4 lg:max-w-[1550px] lg:mt-20 sm:mt-8 md:mt-16  mt-10 border-b-2 pb-16">
            <div className="flex flex-col justify-around sm:flex-row relative">
              <div className="mdx:pr-4">
                <h2 className="text-gray-600 text-2xl">{article.title}</h2>
                <div className="text-gray-400 text-sm">کد مقاله : {article.code}</div>
                <div className="flex justify-center mt-12">
                  <img
                    className="rounded-lg shadow-other2 w-[88%] mdx:w-2/3"
                    src={article.image.imageUrl}
                    alt={article.title}
                  />
                </div>
                <hr className="my-7 mt-12" />
                <div
                  className="ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred"
                  dangerouslySetInnerHTML={{ __html: article.description }}
                />
              </div>
              {/* sticky content */}
              <div className="flex- flex-col pl-4">
                <aside className="left-0 top-0 sm:w-[284px] h-[450px] border rounded-lg p-3 shadow-item  px-4 mb-8">
                  <h3 className="my-2 mb-5 text-gray-600 text-center">پیشنهاد لحظه ای</h3>
                  <Swiper
                    pagination={{ clickable: true }}
                    autoplay={{
                      delay: 2500,
                      disableOnInteraction: false,
                    }}
                    navigation={true}
                    modules={[Navigation, Autoplay]}
                    className="articlePageSwiper overflow-hidden"
                  >
                    {productData &&
                      productData.map((product, index) => {
                        const filteredItems = product.stockItems.filter((item) => {
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

                        const getStockStatus = (stockItems: GetStockItems[]) => {
                          if (stockItems.every((item) => item.quantity === 0)) {
                            return 'ناموجود'
                          }
                          return 'موجود'
                        }
                        return (
                          <SwiperSlide className="" key={index}>
                            <a href={`/products/${product.slug}`} target="_blank" className="">
                              <div className="w-full flex justify-center">
                                <SliderImage index={index} item={product} />
                              </div>
                              <h2 className="text-gray-500 text-sm text-right mt-6 line-clamp-2 overflow-hidden text-ellipsis h-[40px]">
                                {product.title}
                              </h2>
                              <div className="mt-1.5 flex justify-center gap-x-2 px-2 relative ">
                                <div className="">
                                  {filteredItems.length > 0 ? (
                                    <>
                                      {filteredItems[0].discount > 0 && (
                                        <ProductDiscountTag
                                          price={filteredItems[0].price}
                                          discount={filteredItems[0].discount}
                                          isSlider
                                        />
                                      )}

                                      <ProductPriceDisplay
                                        inStock={product.inStock}
                                        discount={filteredItems[0].discount}
                                        price={filteredItems[0].price}
                                      />
                                    </>
                                  ) : (
                                    <div className="text-gray-400 font-semibold mb-1">ناموجود</div>
                                  )}
                                </div>
                              </div>
                            </a>
                          </SwiperSlide>
                        )
                      })}
                  </Swiper>
                </aside>
                <aside className=" left-0 top-[900px] sm:w-[284px] h-auto border rounded-lg p-3 shadow-item px-4">
                  <h3 className="my-2 mb-5 text-gray-600 text-center">مطالب جدید</h3>
                  {latestArticlesData &&
                    latestArticlesData.data &&
                    latestArticlesData.data.data &&
                    latestArticlesData.data.data.filter((item) => item.id !== article.id).length > 0 && (
                      <section className="flex flex-wrap gap-4">
                        {latestArticlesData.data.data.map((item) => (
                          <a target="_blank" href={`/articles/${item.slug}`} className="blank w-full">
                            <article className={`flex w-full rounded-lg shadow-item hover:shadow-article p-1.5`}>
                              <img
                                className="mx-auto relative rounded-lg w-[60px] h-[60px] ml-1.5"
                                src={item.image.imageUrl}
                                alt={item.title}
                              />
                              <div className="flex-1 flex items-center justify-start">
                                <h3 className="text-right text-gray-500 line-clamp-2 overflow-hidden text-ellipsis">
                                  {item.title}
                                </h3>
                              </div>
                            </article>
                          </a>
                        ))}
                      </section>
                    )}
                </aside>

                {articlesDataByCategory &&
                  articlesDataByCategory.data &&
                  articlesDataByCategory.data.data &&
                  articlesDataByCategory.data.data.filter((item) => item.id !== article.id).length > 0 && (
                    <aside className=" left-0 top-[900px] sm:w-[284px] h-auto border rounded-lg p-3 mt-8 shadow-item px-4">
                      <h3 className="my-2 mb-5 text-gray-600 text-center">مطالب مرتبط</h3>
                      <section className="flex flex-wrap gap-4">
                        {articlesDataByCategory.data.data
                          .filter((item) => item.id !== article.id)
                          .map((item) => (
                            <a target="_blank" href={`/articles/${item.slug}`} className="blank w-full">
                              <article className={`flex w-full rounded-lg shadow-item hover:shadow-article p-1.5`}>
                                <img
                                  className="mx-auto relative rounded-lg w-[60px] h-[60px] ml-1.5"
                                  src={item.image.imageUrl}
                                  alt={item.title}
                                />
                                <div className="flex-1 flex items-center justify-start">
                                  <h3 className="text-right text-gray-500 line-clamp-2 overflow-hidden text-ellipsis">
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
          <ReviewArticleList numReviews={article.numReviews ?? 0} article={article} />
          {/* //  Similar slider */}
          {products && products.length > 0 && (
            <div className="relative pt-28 sm:pt-0">
              <div className="w-full block  sm:hidden text-center px-3 line-clamp-2 overflow-hidden text-ellipsis  whitespace-nowrap -mt-20 text-lg text-gray-400 ">
                محصولات مرتبط
              </div>
              <div className="flex w-full bg-slate-300 relative h-[340px] sm:h-[275px] mt-28">
                <div className="hidden w-[38%] sm:block md:w-[20%]">
                  <div className="hidden sm:block">
                    <div className=" line-clamp-2 overflow-hidden text-ellipsis text-center -mt-20 text-lg text-gray-400  px-3 pt-4 w-full">
                      محصولات مرتبط
                    </div>
                  </div>
                  <div className="mt-10 flex justify-center">
                    <img className="w-[220px]" src="/images/Similar.webp" alt="offer" />
                  </div>
                  <p className="text-gray-500 font-normal text-md w-full text-center my-4 mb-5">
                    محصولات مرتبط رو اینجا ببین
                  </p>
                  <div className="w-full  sm:flex justify-center hidden">
                    <Link href={`/products?sortBy=Created`}>
                      <Button className="bg-red-500 hover:bg-red-400 rounded-lg py-2 px-8 text-white">نمایش همه</Button>
                    </Link>
                  </div>
                </div>
                <div className="w-[100%] sm:w-[62%] md:w-[80%] -mt-20 ">
                  <SimilarProductsSlider isFetching={false} products={products} />
                </div>
              </div>
              <div className="w-full  sm:hidden justify-center flex absolute bottom-[105px]">
                <Link href={`/products?sortBy=Created`}>
                  <Button className="bg-red-500 hover:bg-red-400 rounded-lg py-2 px-8 text-white">نمایش همه</Button>
                </Link>
              </div>
              <hr className="pb-2 mx-8 border-t-2 mt-20" />
            </div>
          )}

          {/* last seen slider */}
          {lastSeen.length > 0 && (
            <div className="pt-10 sm:pt-0 relative">
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
                  <LastSeenSlider products={lastSeen} />
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
        </>
      </ClientLayout>
    </>
  )
}

export default SingleArticle
