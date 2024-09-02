import { ClientLayout } from '@/components/Layouts'
import { MetaTags } from '@/components/shared'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { getArticleBySlug, useGetArticlesQuery, useGetProductsQuery } from '@/services'
import { IArticle, IProduct } from '@/types'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination as PaginationSlider, Autoplay, Navigation } from 'swiper/modules'
import { ResponsiveImage } from '@/components/ui'
import { digitsEnToFa } from '@persian-tools/persian-tools'
import 'ckeditor5/ckeditor5.css';
interface Props {
  article: IArticle
}

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ')
}

export const getServerSideProps: GetServerSideProps<Props, { slug: string }> = async ({ params }) => {
  const { data: article } = await getArticleBySlug(params?.slug ?? '')

  if (!article) return { notFound: true }

  const articleCategoryID = article.categoryId

  return {
    props: {
      article: JSON.parse(JSON.stringify(article)),
    },
  }
}

const SingleArticle: NextPage<Props> = (props) => {
  // ? Props
  const { article } = props

  // ? Assets
  const dispatch = useAppDispatch()
  const { query } = useRouter()

  const { generalSetting } = useAppSelector((state) => state.design)

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
        <main className="mx-auto space-y-4 py-4 lg:max-w-[1550px] lg:mt-20 sm:mt-8 md:mt-16  mt-10">
          <div className="flex flex-col sm:flex-row relative">
            <div className="px-4">
              <h2 className="text-gray-500">{article.title}</h2>
              <div className="text-gray-400 text-sm">کد مقاله : {article.code}</div>
             <div className='flex justify-center'>
             <img className='rounded-lg shadow-item mdx:w-2/3' src={article.image.imageUrl} alt={article.title} />
             </div>
              <hr className='my-7 mt-12' />
              <div className='ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred' dangerouslySetInnerHTML={{ __html: article.description }} />
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
              <aside className=" left-0 top-[900px] w-[274px] h-auto border rounded-lg p-3 shadow-item  px-4">
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

export default SingleArticle
