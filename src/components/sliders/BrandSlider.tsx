import type { IBrand, ICategory } from '@/types'
import { useAppSelector } from '@/hooks'
import dynamic from 'next/dynamic'
import 'owl.carousel/dist/assets/owl.carousel.css'
import 'owl.carousel/dist/assets/owl.theme.default.css'
import { GetBrandsResult } from '@/services/brand/types'
import Link from 'next/link'
import { useRouter } from 'next/router'
interface Props {
  currentCategory?: ICategory
  brandData: IBrand[]
  isFetching: boolean
}
const OwlCarousel = dynamic(() => import('react-owl-carousel'), {
  ssr: false,
})

const BrandSlider: React.FC<Props> = (props) => {
  const { currentCategory, brandData, isFetching } = props
  const { generalSetting } = useAppSelector((state) => state.design)
  const { query, push } = useRouter()
  const carouselOptions = {
    margin: 10,
    nav: true,
    center: true,
    startPosition: brandData
      ? Math.floor(brandData.length / 2) // Set startPosition to middle
      : 0,
      responsive: {
        0: {
          items: 3,
        },
        640: {
          items: 3,
        },
        768: {
          items: 3,
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
  const handleChangeRoute = (id: string) => {
    push(`/products?brands=${id}`)
  }

  return (
    <div>
      <h1 className="w-full text-center text-gray-400 font-normal text-lg pb-4">
        برند های معتبر {generalSetting?.title}
      </h1>
      <div className="new-products-slider-containers  relative w-full ">
        <OwlCarousel
          className="new-products-slider new-brand-slider owl-carousel owl-theme d-inline-block owl-loaded owl-drag"
          {...carouselOptions}
          dir="ltr"
        >
          {brandData
            .filter((item) => item.isActive)
            ?.map((brand) => {
              return (
                <div
                  onClick={() => handleChangeRoute(brand.id)}
                  key={brand.id}
                  className="w-[90px] sx:w-[120px]  sm:w-[150px] cursor-pointer z-50  rounded-lg mb-2 bg-white"
                  title={brand.nameFa}
                >
                  <div className="slide-content  py-6">
                    <img
                      src={brand.imagesSrc.imageUrl}
                      alt={brand.nameFa}
                      className="rounded-lg transition duration-300 ease-in-out transform hover:scale-110"
                    />
                  </div>
                </div>
              )
            })}
        </OwlCarousel>
      </div>
    </div>
  )
}

export default BrandSlider
