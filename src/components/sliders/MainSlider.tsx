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

  // ? Local Component
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
  if (data?.filter((item) => item.isActive).length === 0) return <div className="w-full mt-24 "></div>

  return (
    <section className={`section-swiper ${isActive ? '' : ''} relative`}>
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
                item.link !== '' ? (
                  <a href={item.link.startsWith('http') ? item.link : `https://${item.link}`} className="">
                    <SliderImage index={index} item={item} />
                  </a>
                ) : (
                  <div className="">
                    <SliderImage index={index} item={item} />
                  </div>
                )
              ) : item.type === 'category' ? (
                <a href={`/products?categoryId=${item.categoryId}`} className="">
                  <SliderImage index={index} item={item} />
                </a>
              ) : (
                <SliderImage index={index} item={item} />
              )}
            </SwiperSlide>
          ))}
      </Swiper>
      <hr className="pb-8 mx-8 border-t-2" />
    </section>
  )
}

export default MainSlider
