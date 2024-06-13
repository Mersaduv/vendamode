/* eslint-disable tailwindcss/no-custom-classname */
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

import { ResponsiveImage } from '@/components/ui'

import type { ISlider } from '@/types'

interface Props {
  data: ISlider[]
}

const MainSlider: React.FC<Props> = (props) => {
  // ? Props
  const { data } = props

  const SliderImage = ({ item }: { item: ISlider }) => (
    <ResponsiveImage
      dimensions="w-full h-64 md:h-[480px] lg:h-[520px] xl:h-[560px]"
      imageStyles="object-cover object-[72%] lg:object-center "
      src={item.image.imageUrl}
      alt={item.title}
      unoptimized={true}
      blurDataURL={item.image.placeholder}
    />
  )

  // ? Render(s)
  if (data?.length === 0) return null

  return (
    <section className="">
      <Swiper
        pagination={{ clickable: true }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Pagination, Autoplay]}
        className="mySwiper overflow-hidden"
      >
        {data
          .filter((item) => item.isPublic)
          .map((item, index) => (
            <SwiperSlide key={index}>
              {item.uri ? (
                <a href={item.uri} target="_blank" className="">
                  <SliderImage item={item} />
                </a>
              ) : (
                <SliderImage item={item} />
              )}
            </SwiperSlide>
          ))}
      </Swiper>
    </section>
  )
}

export default MainSlider
