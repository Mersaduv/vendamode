import { ResponsiveImage } from '@/components/ui'

import type { IBanner } from '@/types'

interface Props {
  data: IBanner[]
}

const FooterBanner: React.FC<Props> = (props) => {
  const { data } = props

  if (data.length === 0) return null

  const BannerImage = ({ item, index }: { item: IBanner; index: number }) => (
    <ResponsiveImage
      dimensions="w-full h-64 "
      imageStyles=" w-full "
      src={item.image.imageUrl}
      alt={`بنر ${index + 1}`}
      unoptimized={true}
      blurDataURL={item.image.placeholder}
    />
  )

  return (
    <section className="bg-white dark:bg-gray-800 h-full">
      {data
        .filter((item) => item.isActive)
        .map((item, index) => (
          <div key={index}>
            {item.type === 'link' && item.link.trim() !== '' ? (
              <a href={item.link.startsWith('http') ? item.link : `https://${item.link}`} className="">
                <BannerImage index={index} item={item} />
              </a>
            ) : item.type === 'category' ? (
              <a href={`/products?categoryId=${item.categoryId}`} className="">
                <BannerImage index={index} item={item} />
              </a>
            ) : (
              <BannerImage index={index} item={item} />
            )}
          </div>
        ))}
    </section>
  )
}

export default FooterBanner
