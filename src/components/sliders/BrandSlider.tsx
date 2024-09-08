import Link from 'next/link'
import { useGetArticlesQuery, useGetBrandsQuery, useGetProductsQuery } from '@/services'

import { ProductPriceDisplay } from '@/components/product'
import { Button, ResponsiveImage } from '@/components/ui'

import type { ICategory } from '@/types'
import { useAppSelector } from '@/hooks'
import dynamic from 'next/dynamic'
import 'owl.carousel/dist/assets/owl.carousel.css'
import 'owl.carousel/dist/assets/owl.theme.default.css'
import { TbRuler2 } from 'react-icons/tb'
interface Props {
  currentCategory?: ICategory
}
const OwlCarousel = dynamic(() => import('react-owl-carousel'), {
  ssr: false,
})

const BrandSlider: React.FC<Props> = (props) => {
  const { currentCategory } = props
  const { generalSetting } = useAppSelector((state) => state.design)
  const {
    data: brandData,
    isLoading: isLoadingArticle,
    isFetching,
    isError: isErrorArticle,
  } = useGetBrandsQuery({
    page: 1,
    pageSize: 99999,
    isActiveSlider: true,
  })

  const carouselOptions = {
    margin: 10,
    nav: true,
    startPosition: brandData && brandData.data && brandData.data?.data ? brandData.data.data.length - 1 : 0,
    responsive: {
      0: {
        items: 2,
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

  if (brandData) {
    console.log(brandData, 'brandData')
  }
  if (isFetching) {
    return <div>Loading...</div>
  }
  return (
    <>
      <h1 className="w-full text-center text-gray-400 font-normal text-lg pb-4">
        برند های معتبر {generalSetting?.title}
      </h1>
      <div className="new-products-slider-containers  relative w-full ">
        <OwlCarousel
          className="new-products-slider owl-carousel owl-theme d-inline-block owl-loaded owl-drag"
          {...carouselOptions}
          dir="ltr"
        >
          {brandData?.data?.data?.map((brand) => {
            return (
              <div key={brand.id} className="w-[150px] sm:w-[280px] z-50  rounded-lg mb-2 bg-white" title={brand.name}>
                <a target="_blank" href={`/`} className="blank w-full ">
                  <div className="slide-content  py-6">
                    <img
                      src={brand.imagesSrc.imageUrl}
                      alt={brand.name}
                      className="rounded-lg transition duration-300 ease-in-out transform hover:scale-110"
                    />
                  </div>
                </a>
              </div>
            )
          })}
        </OwlCarousel>
      </div>
    </>
  )
}

export default BrandSlider
