/* eslint-disable tailwindcss/no-custom-classname */
import { useEffect, useRef, useState } from 'react'

import { ResponsiveImage } from '@/components/ui'
import { ProductSpecialOffer } from '@/components/product'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { BsArrowLeftCircle, BsArrowRightCircle } from 'react-icons/bs'
import { ArrowDown } from '@/icons'
import { IProduct } from '@/types'

interface Props {
  images: {
    id: string
    imageUrl: string
    placeholder: string
  }[]
  discount: number
  inStock: number
  productName: string
  product?: IProduct
}

const ProductGallery: React.FC<Props> = (props) => {
  // ? Porps
  const { images, discount, inStock, productName, product } = props
  console.log(images, 'imagesimagesimages')

  // ? States
  const [currentImage, setCurrentImage] = useState(0)
  const [fade, setFade] = useState(false)

  // ? Refs
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])

  // ? Handlers
  const handlePrevImage = () => {
    setFade(true)
    setTimeout(() => {
      setCurrentImage((prev) => {
        const newIndex = prev > 0 ? prev - 1 : images.length - 1
        imageRefs.current[newIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
        return newIndex
      })
      setFade(false)
    }, 300)
  }

  const handleNextImage = () => {
    setFade(true)
    setTimeout(() => {
      setCurrentImage((prev) => {
        const newIndex = prev < images.length - 1 ? prev + 1 : 0
        imageRefs.current[newIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
        return newIndex
      })
      setFade(false)
    }, 300)
  }
  // ? Render(s)
  return (
    <section className="mb-5 relative">
      <div className="hidden md:block">
        <div
          className={`transition-opacity lg:border-none border-y-2 border-[#e90089] ease-in-out duration-300 ${
            fade ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <ResponsiveImage
            dimensions="md:h-[320px] md:w-[320px] xl:h-[420px] xl:w-[420px] 2xl:h-[500px] 2xl:w-[500px] "
            className="mx-auto"
            imageStyles="object-contain rounded-xl shadow-product"
            src={images[currentImage].imageUrl}
            blurDataURL={images[currentImage].placeholder}
            alt={productName}
          />
        </div>
        {product?.imagesSrc && product?.imagesSrc?.length > 0 && (
          <div className="mt-5 flex lg:justify-start justify-center gap-x-5 overflow-auto max-w-lg">
            {images.map((image, index) => (
              <div
                key={index}
                ref={(el) => {
                  imageRefs.current[index] = el
                }}
                onClick={() => {
                  setCurrentImage(index)
                  imageRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
                }}
              >
                <ResponsiveImage
                  dimensions="h-24 w-24"
                  className={`relative h-24 w-24 cursor-pointer overflow-hidden rounded-xl border-2 ${
                    index === currentImage ? 'border-[#e90089] shadow-3xl' : 'border-white'
                  }`}
                  imageStyles="object-contain"
                  src={image.imageUrl}
                  blurDataURL={image.placeholder}
                  alt={productName}
                />
              </div>
            ))}
            <button
              onClick={handlePrevImage}
              className="bg-[#e90089] text-white rounded-full rotate-90 absolute right-6 lg:-right-8 bottom-8 z-[50]"
            >
              <ArrowDown className="text-2xl rotate-180" />
            </button>
            <button
              onClick={handleNextImage}
              className=" bg-[#e90089] text-white rounded-full rotate-90 absolute left-6 lg:z-[100] lg:-left-10 bottom-8 z-[50]"
            >
              <ArrowDown className="text-2xl" />
            </button>
          </div>
        )}
      </div>
      {product?.imagesSrc && product?.imagesSrc?.length > 0 && (
        <div className="md:hidden">
          <Swiper
            pagination={{
              type: 'fraction',
            }}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="detailSwiper"
          >
            {images.map((image, index) => (
              <SwiperSlide className="border-y border-[#e90089]" key={index}>
                <ResponsiveImage
                  dimensions="h-[95vw] sm:h-[50vw] w-full"
                  src={image.imageUrl}
                  blurDataURL={image.placeholder}
                  alt={productName}
                  imageStyles="object-contain"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </section>
  )
}

export default ProductGallery
