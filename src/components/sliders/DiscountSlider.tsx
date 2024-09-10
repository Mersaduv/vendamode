// import Link from 'next/link'

// import { Swiper, SwiperSlide } from 'swiper/react'
// import 'swiper/css'
// import 'swiper/css/pagination'
// import 'swiper/css/navigation'
// import { useGetProductsQuery } from '@/services'
// import { digitsEnToFa } from '@persian-tools/persian-tools'
// import { AmazingTypo } from '@/icons'

// import { ProductDiscountTag, ProductPriceDisplay } from '@/components/product'
// import { Button, ResponsiveImage, Skeleton } from '@/components/ui'

// import type { ICategory } from '@/types'
// import { Pagination, Navigation } from 'swiper/modules'
// import { useAppSelector } from '@/hooks'

// interface Props {
//   currentCategory?: ICategory
// }

// const DiscountSlider: React.FC<Props> = (props) => {
//   // ? Props
//   const { currentCategory } = props
//   const { generalSetting } = useAppSelector((state) => state.design)
//   const { products, isFetching } = useGetProductsQuery(
//     {
//       sortBy: 'Discount',
//       pageSize: 15,
//       discount: true,
//     },
//     {
//       selectFromResult: ({ data, isFetching }) => ({
//         products: data?.data?.pagination.data,
//         isFetching,
//       }),
//     }
//   )

//   // ? Render(s)
//   return (
//     <>
//       <section className="hidden sm:flex absolute w-full -top-24 py-2.5">
//         <div className="flex gap-8 flex-col bg-[#dcb6db]  z-50 items-center -ml-24 ab">
//           <div className="w-full h-[86px] text-center pt-6 text-2xl text-gray-400 bg-white pr-10">تخفیف های {generalSetting?.title}</div>
//           <div className="flex gap-8 flex-col pl-8  items-center pr-10">
//             <img width={260} src="/images/Offer.webp" alt="offer img" />
//             <span className="text-white font-normal whitespace-nowrap text-lg">تخفیف های امروز از دست نده</span>
//             <Button className="bg-red-600 hover:shadow-lg mt-4 p-0">
//               <Link className="w-full h-full px-5 py-3" href={`/products?sortBy=Discount&discount=true`}>
//                 نمایش همه
//               </Link>
//             </Button>
//           </div>{' '}
//         </div>
//         <Swiper
//           breakpoints={{
//             490: { width: 640, height: 1000, slidesPerView: 3 },
//           }}
//           style={{ width: '100%', background: '' }}
//           slidesPerView={3}
//           centeredSlides={true}
//           spaceBetween={20}
//           pagination={{
//             type: 'fraction',
//           }}
//           navigation={true}
//           modules={[Navigation]}
//           className="mySwiper"
//         >
//           <div className="">
//             {products?.map((product, index) => {
//               const stockItemWithDiscount = product.stockItems.find((stockItem) => stockItem.discount! > 0)

//               return (
//                 <SwiperSlide
//                   style={{ height: '330px', width: '200px' }}
//                   key={product.id}
//                   className="bg-white rounded-lg absolute shadow-product my-4 "
//                 >
//                   {stockItemWithDiscount != undefined &&
//                     stockItemWithDiscount.price &&
//                     stockItemWithDiscount.discount && (
//                       <Link href={`/products/${product.slug}`} className="w-full inline-block">
//                         <ResponsiveImage
//                           dimensions="w-[200px] h-[200px]"
//                           className="mx-auto relative"
//                           src={product.mainImageSrc.imageUrl}
//                           blurDataURL={product.mainImageSrc.placeholder}
//                           alt={product.title}
//                           imageStyles="object-center rounded-t-lg"
//                         />
//                         <div className="h-full flex flex-col gap-y-4 pt-4 ">
//                           <h2 className="text-center">{product.title}</h2>
//                           <div className="flex justify-center gap-x-2 px-2 ">
//                             <div>
//                               <ProductDiscountTag
//                                 price={stockItemWithDiscount.price}
//                                 discount={stockItemWithDiscount.discount}
//                               />
//                             </div>
//                             <ProductPriceDisplay
//                               inStock={product.inStock}
//                               discount={stockItemWithDiscount.discount ?? 0}
//                               price={stockItemWithDiscount.price ?? 0}
//                             />
//                           </div>
//                         </div>
//                       </Link>
//                     )}
//                 </SwiperSlide>
//               )
//             })}
//           </div>
//         </Swiper>
//       </section>

//       <section className="flex flex-col-reverse sm:flex-row  sm:hidden absolute w-full -top-24 py-2.5">
//         <div className=" gap-8 flex-col bg-[#dcb6db]  z-50 items-center sm:-ml-24">
//           <div className="hidden sm:block w-full h-[86px] text-center pt-6 text-lg text-gray-400 bg-white pr-10">
//             تخفیف های {generalSetting?.title}
//           </div>
//           <div className="flex gap-8 flex-col pl-8  items-center pr-10">
//             <img className="w-[200px]" src="/images/Offer.webp" alt="offer img" />
//             <span className="text-white font-normal whitespace-nowrap text-lg">تخفیف های امروز از دست نده</span>
//             <Button className="bg-red-600 hover:shadow-lg mt-4 p-0 mb-4">
//               <Link className="w-full h-full px-5 py-3" href={`/products?sortBy=Discount&discount=true`}>
//                 نمایش همه
//               </Link>
//             </Button>
//           </div>{' '}
//         </div>
//         <Swiper
//           breakpoints={{
//             320: { width: 490, height: 450, slidesPerView: 3 },
//           }}
//           style={{ width: '100%', background: '' }}
//           slidesPerView={3}
//           centeredSlides={true}
//           spaceBetween={20}
//           pagination={{
//             type: 'fraction',
//           }}
//           navigation={true}
//           modules={[Navigation]}
//           className="mySwiper overflow-auto"
//         >
//           <div className="">
//             {products?.map((product, index) => {
//               const stockItemWithDiscount = product.stockItems.find((stockItem) => stockItem.discount! > 0)

//               return (
//                 <SwiperSlide
//                   style={{ height: '300px', width: '300px' }}
//                   key={product.id}
//                   className="bg-white rounded-lg absolute shadow-product my-4 "
//                 >
//                   {stockItemWithDiscount != undefined &&
//                     stockItemWithDiscount.price &&
//                     stockItemWithDiscount.discount && (
//                       <Link href={`/products/${product.slug}`} className="w-full">
//                         <ResponsiveImage
//                           dimensions="w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] lg:w-[200px] lg:h-[200px]"
//                           className="mx-auto relative"
//                           src={product.mainImageSrc.imageUrl}
//                           blurDataURL={product.mainImageSrc.placeholder}
//                           alt={product.title}
//                           imageStyles="object-center rounded-t-lg"
//                         />
//                         <div className="h-full flex flex-col gap-y-4 pt-4 ">
//                           <h2 className="text-center">{product.title}</h2>
//                           <div className="mt-1.5 flex justify-center gap-x-2 px-2 ">
//                             <div>
//                               <ProductDiscountTag
//                                 price={stockItemWithDiscount.price}
//                                 discount={stockItemWithDiscount.discount}
//                               />
//                             </div>
//                             <ProductPriceDisplay
//                               inStock={product.inStock}
//                               discount={stockItemWithDiscount.discount ?? 0}
//                               price={stockItemWithDiscount.price ?? 0}
//                             />
//                           </div>
//                         </div>
//                       </Link>
//                     )}
//                 </SwiperSlide>
//               )
//             })}
//           </div>
//         </Swiper>
//       </section>
//     </>
//   )
// }

// export default DiscountSlider

import Link from 'next/link'
import { useGetProductsQuery } from '@/services'
import { ProductDiscountTag, ProductPriceDisplay } from '@/components/product'
import { Button, ResponsiveImage } from '@/components/ui'

import type { ICategory, IProduct } from '@/types'
import { useAppSelector } from '@/hooks'
import dynamic from 'next/dynamic'
import 'owl.carousel/dist/assets/owl.carousel.css'
import 'owl.carousel/dist/assets/owl.theme.default.css'
interface Props {
  currentCategory?: ICategory
  products : IProduct[]
  isFetching: boolean
}
const OwlCarousel = dynamic(() => import('react-owl-carousel'), {
  ssr: false,
})

const DiscountSlider: React.FC<Props> = (props) => {
  // ? Props
  const { currentCategory,isFetching,products } = props
  const { generalSetting } = useAppSelector((state) => state.design)
  const carouselOptions = {
    margin: 10,
    nav: true,
    startPosition: products ? products.length - 1 : 0,
    responsive: {
      0: {
        items: 2,
      },
      640: {
        items: 1,
      },
      768: {
        items: 2,
      },
      950: {
        items: 3,
      },
      1200: {
        items: 4,
      },
      1500: {
        items: 5,
      },
    },
    navText: [
      `<button class="custom-prev"><img className='h-3 w-3' src='/icons/left.png' alt="left" /></button>`,
      `<button class="custom-next"><img className='h-3 w-3' src='/icons/right.png' alt="right" /></button>`,
    ],
  }

  if (isFetching) {
    return <div>Loading...</div>
  }
  // ? Render(s)
  return (
    <>
      {/**************** There is a responsive issue here, which is why duplicate code was created *****************/}
      <div className="new-products-slider-containers hidden sm:flex relative w-full ">
        <OwlCarousel
          className="new-products-slider owl-carousel owl-theme d-inline-block owl-loaded owl-drag"
          {...carouselOptions}
          dir="ltr"
        >
            {products?.map((product) => {
            const stockItemWithDiscount = product.stockItems.find((stockItem) => stockItem.discount! > 0)
            const stockItemWithOutDiscount = product.stockItems.find((stockItem) => stockItem.discount === 0)

            return (
              <div
                key={product.id}
                className="w-[150px] sm:w-[200px] z-50 shadow-item2 rounded-lg mb-3 bg-white h-[328px]"
              >
                <div className="h-slider">
                  <Link href={`/products/${product.slug}`}>
                    <ResponsiveImage
                      dimensions="w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] lg:w-[200px] lg:h-[200px]"
                      className="mx-auto relative"
                      src={product.mainImageSrc.imageUrl}
                      blurDataURL={product.mainImageSrc.placeholder}
                      alt={product.title}
                      imageStyles="object-center rounded-t-lg"
                    />
                    <div className="flex flex-col justify-between gap-y-1 py-3 h-[130px] ">
                      <h2 dir="rtl" className="text-right line-clamp-2 overflow-hidden text-ellipsis px-2 text-sm">
                        {product.title}
                      </h2>
                      <div className="mt-1.5 flex justify-center gap-x-2 px-2 relative">
                        <div className="">
                          {stockItemWithOutDiscount === undefined && (
                            <ProductDiscountTag
                              price={stockItemWithDiscount?.price ?? 0}
                              discount={stockItemWithDiscount?.discount ?? 0}
                              isSlider
                            />
                          )}
                        </div>
                        <ProductPriceDisplay
                          inStock={product.inStock}
                          discount={stockItemWithDiscount?.discount || 0}
                          price={
                            stockItemWithDiscount?.discount === undefined
                              ? stockItemWithOutDiscount?.price!
                              : stockItemWithDiscount?.price ?? 0
                          }
                        />
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )
          })}
        </OwlCarousel>
      </div>

      <div className="new-products-slider-containers flex sm:hidden relative w-full ">
        <OwlCarousel
          className="new-products-slider owl-carousel owl-theme d-inline-block owl-loaded owl-drag"
          {...carouselOptions}
          dir="ltr"
        >
       {products?.map((product) => {
            const stockItemWithDiscount = product.stockItems.find((stockItem) => stockItem.discount! > 0)
            const stockItemWithOutDiscount = product.stockItems.find((stockItem) => stockItem.discount === 0)

            return (
              <div
                key={product.id}
                className="w-[150px] sm:w-[200px] z-50 shadow-item2 rounded-lg mb-3 bg-white h-[300px]"
              >
                <div className="h-slider">
                  <Link href={`/products/${product.slug}`}>
                    <ResponsiveImage
                      dimensions="w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] lg:w-[200px] lg:h-[200px]"
                      className="mx-auto relative"
                      src={product.mainImageSrc.imageUrl}
                      blurDataURL={product.mainImageSrc.placeholder}
                      alt={product.title}
                      imageStyles="object-center rounded-t-lg"
                    />
                    <div className="flex flex-col justify-between py-3 h-[150px] ">
                      <h2 dir="rtl" className="text-right line-clamp-2 overflow-hidden text-ellipsis px-2 text-sm">
                        {product.title}
                      </h2>
                      <div className="mt-1.5 flex justify-center gap-x-2 px-2 relative">
                        <div className="">
                          {stockItemWithOutDiscount === undefined && (
                            <ProductDiscountTag
                              price={stockItemWithDiscount?.price ?? 0}
                              discount={stockItemWithDiscount?.discount ?? 0}
                              isSlider
                            />
                          )}
                        </div>
                        <ProductPriceDisplay
                          inStock={product.inStock}
                          discount={stockItemWithDiscount?.discount || 0}
                          price={
                            stockItemWithDiscount?.discount === undefined
                              ? stockItemWithOutDiscount?.price!
                              : stockItemWithDiscount?.price ?? 0
                          }
                        />
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )
          })}

          <div>
            <div className="mt-10 flex justify-center">
              <img className="w-[120px] xs2:w-[180px] static-img" src="/images/Offer.webp" alt="offer" />
            </div>
            <p className="text-gray-500 font-normal text-md w-full text-center my-4 mb-5">
            تخفیف های امروز رو از دست نده

            </p>
            <div className="w-full sm:flex justify-center hidden">
              <Link href={`/products?sortBy=Discount&discount=true`}>
                <Button className="bg-red-500 hover:bg-red-400 rounded-lg py-2 px-8 text-white">نمایش همه</Button>
              </Link>
            </div>
          </div>
        </OwlCarousel>
      </div>
    </>
  )
}

export default DiscountSlider
