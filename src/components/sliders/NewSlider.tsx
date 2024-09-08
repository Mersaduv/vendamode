import Link from 'next/link'
import { useGetProductsQuery } from '@/services'

import { ProductPriceDisplay } from '@/components/product'
import { Button, ResponsiveImage } from '@/components/ui'

import type { ICategory } from '@/types'
import { useAppSelector } from '@/hooks'
import dynamic from 'next/dynamic'
import 'owl.carousel/dist/assets/owl.carousel.css'
import 'owl.carousel/dist/assets/owl.theme.default.css'
interface Props {
  currentCategory?: ICategory
}
const OwlCarousel = dynamic(() => import('react-owl-carousel'), {
  ssr: false,
})

const NewSlider: React.FC<Props> = (props) => {
  const { currentCategory } = props
  const { generalSetting } = useAppSelector((state) => state.design)
  const { products, isFetching } = useGetProductsQuery(
    {
      sortBy: 'Created',
      pageSize: 30,
    },
    {
      selectFromResult: ({ data, isFetching }) => ({
        products: data?.data?.pagination.data,
        isFetching,
      }),
    }
  )

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
            const stockItemWithOutDiscount = product.stockItems.find((stockItem) => stockItem.discount === null)

            return (
              <div
                key={product.id}
                className="w-[150px] sm:w-[200px] z-50 shadow-article rounded-lg mb-3 bg-white"
              >
                <Link href={`/products/${product.slug}`}>
                  <ResponsiveImage
                    dimensions="w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] lg:w-[200px] lg:h-[200px]"
                    className="mx-auto relative"
                    src={product.mainImageSrc.imageUrl}
                    blurDataURL={product.mainImageSrc.placeholder}
                    alt={product.title}
                    imageStyles="object-center rounded-t-lg"
                  />
                  <div className="flex flex-col gap-y-4 py-4">
                    <h2 className="text-center line-clamp-2 overflow-hidden text-ellipsis">{product.title}</h2>
                    <div className="mt-1.5 flex justify-center gap-x-2 px-2">
                      <ProductPriceDisplay
                        inStock={product.inStock}
                        discount={0}
                        price={stockItemWithOutDiscount?.price ?? stockItemWithDiscount?.price ?? 0}
                      />
                    </div>
                  </div>
                </Link>
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
            const stockItemWithOutDiscount = product.stockItems.find((stockItem) => stockItem.discount === null)

            return (
              <div
                key={product.id}
                className="w-[150px] sm:w-[200px] z-50 shadow-article rounded-lg mb-3 bg-white"
              >
                <Link href={`/products/${product.slug}`}>
                  <ResponsiveImage
                    dimensions="w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] lg:w-[200px] lg:h-[200px]"
                    className="mx-auto relative"
                    src={product.mainImageSrc.imageUrl}
                    blurDataURL={product.mainImageSrc.placeholder}
                    alt={product.title}
                    imageStyles="object-center rounded-t-lg"
                  />
                  <div className="flex flex-col gap-y-4 py-4">
                    <h2 className="text-center line-clamp-2 overflow-hidden text-ellipsis">{product.title}</h2>
                    <div className="mt-1.5 flex justify-center gap-x-2 px-2">
                      <ProductPriceDisplay
                        inStock={product.inStock}
                        discount={0}
                        price={stockItemWithOutDiscount?.price ?? stockItemWithDiscount?.price ?? 0}
                      />
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}

          <div>
            <div className="line-clamp-2 overflow-hidden text-ellipsis text-center -mt-16 text-lg text-gray-400 px-3 w-full">
              جدید ترین های {generalSetting?.title}
            </div>
            <div className="mt-10 flex justify-center">
              <img className="w-[120px] xs2:w-[180px] static-img" src="/images/NEW.webp" alt="offer" />
            </div>
            <p className="text-gray-500 font-normal text-md w-full text-center my-4 mb-5">
              تخفیف های امروز رو از دست نده
            </p>
            <div className="w-full sm:flex justify-center hidden">
              <Link href={`/products?sortBy=Created`}>
                <Button className="bg-red-500 hover:bg-red-400 rounded-lg py-2 px-8 text-white">نمایش همه</Button>
              </Link>
            </div>
          </div>
        </OwlCarousel>
      </div>
    </>
  )
}

export default NewSlider
