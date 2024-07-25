// Import Swiper styles
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'

// import required modules
import { Navigation, FreeMode } from 'swiper/modules'

import Link from 'next/link'

import { Swiper, SwiperSlide } from 'swiper/react'

import { ProductDiscountTag, ProductPriceDisplay } from '@/components/product'
import { Button, ResponsiveImage, Skeleton } from '@/components/ui'

import type { IProduct } from '@/types'
import { Product } from '@/store'

interface Props {
  lastSeenProduct: {
    title: string
    products: Product[]
  }
}

const RecentVisitedSlider: React.FC<Props> = (props) => {
  // ? Props
  const { lastSeenProduct } = props

  // ? Render(s)
  return (
    <>
      <section className="hidden sm:flex absolute w-full -top-24 py-2.5">
        <div className="flex gap-8 flex-col bg-[#dee2e6]  z-50 items-center -ml-24 ab">
          <div className="w-full h-[86px] whitespace-nowrap text-center pt-6 text-2xl text-gray-400 bg-white pr-10">
            بازدید های اخیر{' '}
          </div>
          <div className="flex gap-8 flex-col pl-8  items-center pr-10">
            <img width={260} src="/images/Recent Visited.webp" alt="offer img" />
            <span className="text-gray-800 font-normal text-lg">بازدید های اخیر رو اینجا ببین</span>
            <Button className="bg-red-600 hover:shadow-lg mt-4 ">نمایش همه</Button>
          </div>{' '}
        </div>{' '}
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
          {lastSeenProduct.products.map((product) => (
            <SwiperSlide
              style={{ height: '330px', width: '200px' }}
              key={product.productID}
              className="bg-white rounded-lg absolute shadow-product my-4 "
            >
              <Link href={`/products/${product.slug}`} className="w-full inline-block pb-9">
                <ResponsiveImage
                  dimensions="w-[200px] h-[200px] lg:w-[200px] lg:h-[200px]"
                  className="mx-auto relative"
                  src={product.image.imageUrl}
                  blurDataURL={product.image.placeholder}
                  alt={product.title}
                  imageStyles="object-center rounded-t-lg"
                />
                <div className="h-full flex flex-col gap-y-4 pt-4 ">
                  <h2 className="text-center">{product.title}</h2>
                  <div className="mt-1.5 flex justify-center gap-x-2 px-2 ">
                    <div>{/* <ProductDiscountTag discount={product.discount} tag={'جدید'} /> */}</div>
                    <ProductPriceDisplay inStock={product.inStock} discount={0} price={product.price} />
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section className="flex flex-col-reverse sm:flex-row  sm:hidden absolute w-full -top-24 py-2.5">
        <div className=" gap-8 flex-col bg-[#dee2e6]  z-50 items-center sm:-ml-24">
          <div className="hidden sm:block w-full h-[86px] text-center pt-6 text-lg text-gray-400 bg-white pr-10">
            بازدید های اخیر{' '}
          </div>
          <div className="flex gap-8 flex-col pl-8  items-center pr-10">
            <img className="w-[200px]" src="/images/Recent Visited.webp" alt="offer img" />
            <span className="text-gray-500 font-normal whitespace-nowrap text-lg">بازدید های اخیر رو اینجا ببین</span>
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
          {lastSeenProduct?.products.map((product, index) => (
            <SwiperSlide
              style={{ height: '300px', width: '300px' }}
              key={product.productID}
              className="bg-white rounded-lg absolute shadow-product my-4 "
            >
              <Link href={`/products/${product.slug}`} className="w-full inline-block pb-9">
                <ResponsiveImage
                  dimensions="w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] lg:w-[200px] lg:h-[200px]"
                  className="mx-auto relative"
                  src={product.image.imageUrl}
                  blurDataURL={product.image.placeholder}
                  alt={product.title}
                  imageStyles="object-center rounded-t-lg"
                />
                <div className="h-full flex flex-col gap-y-4 pt-4 ">
                  <h2 className="text-center">{product.title}</h2>
                  <div className="mt-1.5 flex justify-center gap-x-2 px-2 ">
                    <div>{/* <ProductDiscountTag discount={product.discount} /> */}</div>
                    <ProductPriceDisplay inStock={product.inStock} discount={product.discount} price={product.price} />
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </>
  )
}

export default RecentVisitedSlider
