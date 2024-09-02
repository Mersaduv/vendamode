// components/Slider.js
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { Navigation, Pagination } from 'swiper/modules'
import { useGetArticlesQuery } from '@/services'

const ReadableArticlePlace = () => {
  const {
    data: articleData,
    isLoading: isLoadingArticle,
    isError: isErrorArticle,
  } = useGetArticlesQuery({
    page: 1,
    pageSize: 99999,
    place: '1',
  })
  console.log(articleData, 'articleData')

  return (
    <Swiper
      modules={[Navigation]}
      navigation
      pagination={{ clickable: true }}
      spaceBetween={30}
      slidesPerView={5}
      className="readableArticlePlaceSwiper"
      breakpoints={{
        100: { slidesPerView: 2 },
        520: { slidesPerView: 3 },
        700: { slidesPerView: 4 },
        1000: { slidesPerView: 5 },
      }}
    >
      {articleData?.data?.data?.map((slide) => (
        <SwiperSlide key={slide.id}>
          <a target="_blank" href={`/articles/${slide.slug}`} className="blank w-full ">
            <div className="slide-content  py-6">
              <img
                src={slide.image.imageUrl}
                alt={slide.title}
                className="rounded-lg transition duration-300 ease-in-out transform hover:scale-110"
              />
              <p className="text-center text-gray-500 line-clamp-2 overflow-hidden text-ellipsis mt-4">{slide.title}</p>
            </div>
          </a>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default ReadableArticlePlace
