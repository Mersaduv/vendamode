import Link from 'next/link'

import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { useGetProductsQuery } from '@/services'
import { digitsEnToFa } from '@persian-tools/persian-tools'
import { AmazingTypo } from '@/icons'

import { ProductDiscountTag, ProductPriceDisplay } from '@/components/product'
import { Button, ResponsiveImage, Skeleton } from '@/components/ui'

import type { ICategory } from '@/types'
import { Pagination, Navigation } from 'swiper/modules'

interface Props {
  currentCategory?: ICategory
}

const DiscountSlider: React.FC<Props> = (props) => {
  // ? Props
  const { currentCategory } = props

  const { products, isFetching } = useGetProductsQuery(
    {
      sortBy: 'Discount',
      pageSize: 15,
      discount: true,
    },
    {
      selectFromResult: ({ data, isFetching }) => ({
        products: data?.data?.pagination.data,
        isFetching,
      }),
    }
  )

  // ? Render(s)
  return (
    <>
      <section className="hidden sm:flex absolute w-full -top-24 py-2.5">
        <div className="flex gap-8 flex-col bg-[#dcb6db]  z-50 items-center -ml-24 ab">
          <div className="w-full h-[86px] text-center pt-6 text-2xl text-gray-400 bg-white pr-10">تخفیف های وندامد</div>
          <div className="flex gap-8 flex-col pl-8  items-center pr-10">
            <img width={260} src="/images/Offer.webp" alt="offer img" />
            <span className="text-white font-normal whitespace-nowrap text-lg">تخفیف های امروز از دست نده</span>
            <Button className="bg-red-600 hover:shadow-lg mt-4 p-0">
              <Link className="w-full h-full px-5 py-3" href={`/products?sortBy=Discount&discount=true`}>
                نمایش همه
              </Link>
            </Button>
          </div>{' '}
        </div>
        <Swiper
          breakpoints={{
            490: { width: 640, height: 1000, slidesPerView: 3 },
          }}
          style={{ width: '100%', background: '' }}
          slidesPerView={3}
          centeredSlides={true}
          spaceBetween={20}
          pagination={{
            type: 'fraction',
          }}
          navigation={true}
          modules={[Navigation]}
          className="mySwiper"
        >
          <div className="">
            {products?.map((product, index) => {
              const stockItemWithDiscount = product.stockItems.find((stockItem) => stockItem.discount! > 0)

              return (
                <SwiperSlide
                  style={{ height: '330px', width: '200px' }}
                  key={product.id}
                  className="bg-white rounded-lg absolute shadow-product my-4 "
                >
                  {stockItemWithDiscount != undefined &&
                    stockItemWithDiscount.price &&
                    stockItemWithDiscount.discount && (
                      <Link href={`/products/${product.slug}`} className="w-full inline-block">
                        <ResponsiveImage
                          dimensions="w-[200px] h-[200px]"
                          className="mx-auto relative"
                          src={product.imagesSrc[0].imageUrl}
                          blurDataURL={product.imagesSrc[0].placeholder}
                          alt={product.title}
                          imageStyles="object-center rounded-t-lg"
                        />
                        <div className="h-full flex flex-col gap-y-4 pt-4 ">
                          <h2 className="text-center">{product.title}</h2>
                          <div className="flex justify-center gap-x-2 px-2 ">
                            <div>
                              <ProductDiscountTag
                                price={stockItemWithDiscount.price}
                                discount={stockItemWithDiscount.discount}
                              />
                            </div>
                            <ProductPriceDisplay
                              inStock={product.inStock}
                              discount={stockItemWithDiscount.discount ?? 0}
                              price={stockItemWithDiscount.price ?? 0}
                            />
                          </div>
                        </div>
                      </Link>
                    )}
                </SwiperSlide>
              )
            })}
          </div>
        </Swiper>
      </section>

      <section className="flex flex-col-reverse sm:flex-row  sm:hidden absolute w-full -top-24 py-2.5">
        <div className=" gap-8 flex-col bg-[#dcb6db]  z-50 items-center sm:-ml-24">
          <div className="hidden sm:block w-full h-[86px] text-center pt-6 text-lg text-gray-400 bg-white pr-10">
            تخفیف های وندامد
          </div>
          <div className="flex gap-8 flex-col pl-8  items-center pr-10">
            <img className="w-[200px]" src="/images/Offer.webp" alt="offer img" />
            <span className="text-white font-normal whitespace-nowrap text-lg">تخفیف های امروز از دست نده</span>
            <Button className="bg-red-600 hover:shadow-lg mt-4 p-0 mb-4">
              <Link className="w-full h-full px-5 py-3" href={`/products?sortBy=Discount&discount=true`}>
                نمایش همه
              </Link>
            </Button>
          </div>{' '}
        </div>
        <Swiper
          breakpoints={{
            320: { width: 490, height: 450, slidesPerView: 3 },
          }}
          style={{ width: '100%', background: '' }}
          slidesPerView={3}
          centeredSlides={true}
          spaceBetween={20}
          pagination={{
            type: 'fraction',
          }}
          navigation={true}
          modules={[Navigation]}
          className="mySwiper overflow-auto"
        >
          <div className="">
            {products?.map((product, index) => {
              const stockItemWithDiscount = product.stockItems.find((stockItem) => stockItem.discount! > 0)

              return (
                <SwiperSlide
                  style={{ height: '300px', width: '300px' }}
                  key={product.id}
                  className="bg-white rounded-lg absolute shadow-product my-4 "
                >
                  {stockItemWithDiscount != undefined &&
                    stockItemWithDiscount.price &&
                    stockItemWithDiscount.discount && (
                      <Link href={`/products/${product.slug}`} className="w-full">
                        <ResponsiveImage
                          dimensions="w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] lg:w-[200px] lg:h-[200px]"
                          className="mx-auto relative"
                          src={product.imagesSrc[0].imageUrl}
                          blurDataURL={product.imagesSrc[0].placeholder}
                          alt={product.title}
                          imageStyles="object-center rounded-t-lg"
                        />
                        <div className="h-full flex flex-col gap-y-4 pt-4 ">
                          <h2 className="text-center">{product.title}</h2>
                          <div className="mt-1.5 flex justify-center gap-x-2 px-2 ">
                            <div>
                              <ProductDiscountTag
                                price={stockItemWithDiscount.price}
                                discount={stockItemWithDiscount.discount}
                              />
                            </div>
                            <ProductPriceDisplay
                              inStock={product.inStock}
                              discount={stockItemWithDiscount.discount ?? 0}
                              price={stockItemWithDiscount.price ?? 0}
                            />
                          </div>
                        </div>
                      </Link>
                    )}
                </SwiperSlide>
              )
            })}
          </div>
        </Swiper>
      </section>
    </>
  )
}

export default DiscountSlider
