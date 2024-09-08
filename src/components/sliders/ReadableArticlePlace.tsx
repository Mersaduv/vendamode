import Link from 'next/link'
import { useGetArticlesQuery, useGetProductsQuery } from '@/services'

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

const ReadableArticlePlace: React.FC<Props> = (props) => {
  const { currentCategory } = props
  const { generalSetting } = useAppSelector((state) => state.design)
  const {
    data: articleData,
    isLoading: isLoadingArticle,
    isError: isErrorArticle,
  } = useGetArticlesQuery({
    page: 1,
    pageSize: 99999,
    place: '1',
  })

  const carouselOptions = {
    margin: 10,
    nav: true,
    startPosition: articleData && articleData.data && articleData.data?.data ? articleData.data.data.length - 1 : 0,
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

  return (
    <>
      <div className="new-products-slider-containers  relative w-full ">
        <OwlCarousel
          className="new-products-slider owl-carousel owl-theme d-inline-block owl-loaded owl-drag"
          {...carouselOptions}
          dir="ltr"
        >
          {articleData?.data?.data?.map((article) => {
            return (
              <div
                key={article.id}
                className="w-[150px] sm:w-[280px] z-50  rounded-lg mb-2 bg-white"
              >
                <a target="_blank" href={`/articles/${article.slug}`} className="blank w-full ">
                  <div className="slide-content  py-6">
                    <img
                      src={article.image.imageUrl}
                      alt={article.title}
                      className="rounded-lg transition duration-300 ease-in-out transform hover:scale-110"
                    />
                    <p className="text-center text-gray-500 line-clamp-1 overflow-hidden text-ellipsis mt-4">
                      {article.title}
                    </p>
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

export default ReadableArticlePlace
