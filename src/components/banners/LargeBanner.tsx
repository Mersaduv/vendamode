import { ResponsiveImage } from '@/components/ui'

import type { IBanner } from '@/types'
interface Props {
  data: IBanner[]
}

const LargeBanner: React.FC<Props> = (props) => {
  const { data: bannerAds } = props

  if (bannerAds.length === 0) return null

  const getWrapperTag = (banner: IBanner, index: number) => {
    const href =
      banner.type === 'link'
        ? banner.link.startsWith('http')
          ? banner.link
          : `https://${banner.link}`
        : banner.type === 'category'
        ? `/products?categoryId=${banner.categoryId}`
        : '#'

    const isLink = (banner.type === 'link' && banner.link.trim() !== '') || banner.type === 'category'

    const WrapperTag = isLink ? 'a' : 'div'

    return (
      <WrapperTag
        {...(isLink && { href, rel: banner.type === 'link' ? 'noopener noreferrer' : undefined })}
        className={`group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg ${
          index === 1 || index === 2 ? 'md:col-span-2' : ''
        } md:h-80`}
        key={index}
      >
        <img
          src={banner.image.imageUrl}
          loading="lazy"
          alt={'بنر '}
          className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50"></div>
      </WrapperTag>
    )
  }

  return (
    <>
      <section className="bg-white dark:bg-gray-800 h-full ">
        <div className="mx-auto max-w-[1550px] px-2 md:px-3">
          <div className="grid xs:grid-cols-2 gap-2 md:grid-cols-3 md:gap-6 xl:gap-4">
            {bannerAds.map((banner, index) => banner.isActive && getWrapperTag(banner, index))}
          </div>
        </div>
      </section>
      <hr className="pb-8 mx-8 border-t-2 mt-20" />
    </>
  )
}

export default LargeBanner
