import type { ICategory } from '@/types'
import { useAppSelector } from '@/hooks'
import dynamic from 'next/dynamic'
import 'owl.carousel/dist/assets/owl.carousel.css'
import 'owl.carousel/dist/assets/owl.theme.default.css'
import { GetBrandsResult } from '@/services/brand/types'
import Link from 'next/link'
import { useRouter } from 'next/router'
interface Props {
  currentCategory?: ICategory
  brandData: GetBrandsResult
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
    startPosition:
      brandData && brandData.data && brandData.data?.data
        ? Math.floor(brandData.data.data.length / 2) // Set startPosition to middle
        : 0,
    responsive: {
      950: {
        items: 7,
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
          {brandData?.data?.data?.map((brand) => {
            return (
              <div
                onClick={() => handleChangeRoute(brand.id)}
                key={brand.id}
                className="w-[150px] cursor-pointer z-50  rounded-lg mb-2 bg-white"
                title={brand.name}
              >
                <div className="slide-content  py-6">
                  <img
                    src={brand.imagesSrc.imageUrl}
                    alt={brand.name}
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
