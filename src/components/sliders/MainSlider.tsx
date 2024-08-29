/* eslint-disable tailwindcss/no-custom-classname */
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

import { ResponsiveImage } from '@/components/ui'

import type { ISlider } from '@/types'
import { useGetHeaderTextQuery } from '@/services'
import { useAppDispatch, useAppSelector } from '@/hooks'

interface Props {
  data: ISlider[]
}

const MainSlider: React.FC<Props> = (props) => {
  // ? Props
  const { data } = props
  const { isActive } = useAppSelector((state) => state.headerTextState)
  const SliderImage = ({ item, index }: { item: ISlider; index: number }) => (
    <ResponsiveImage
      dimensions="w-full h-64 md:h-[480px] lg:h-[520px] xl:h-[560px]"
      imageStyles="object-cover object-[72%] lg:object-center "
      src={item.image.imageUrl}
      alt={`اسلایدر ${index + 1}`}
      unoptimized={true}
      blurDataURL={item.image.placeholder}
    />
  )

  // ? Render(s)
  if (data?.length === 0)
    return (
      <div className="w-full h-64 md:h-[480px] lg:h-[520px] xl:h-[560px] mt-24 py-8">
        {' '}
        <ResponsiveImage
          dimensions="w-full h-64 md:h-[480px] lg:h-[520px] xl:h-[560px]"
          imageStyles="object-cover object-[72%] lg:object-center "
          src={'/logo/Logo.png'}
          alt={`اسلایدر`}
          unoptimized={true}
          blurDataURL={'/logo/'}
        />
      </div>
    )

  return (
    <section className={`section-swiper ${isActive ? 'mt-24' : ''} relative`}>
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
          .filter((item) => item.isActive)
          .map((item, index) => (
            <SwiperSlide key={index}>
              {item.type === 'link' ? (
                <a href={item.link} target="_blank" className="">
                  <SliderImage index={index} item={item} />
                </a>
              ) : item.type === 'category' ? (
                <a href={`/products?categoryId=${item.categoryId}`} target="_blank" className="">
                  <SliderImage index={index} item={item} />
                </a>
              ) : (
                <SliderImage index={index} item={item} />
              )}
            </SwiperSlide>
          ))}
      </Swiper>
    </section>
  )
}

export default MainSlider
