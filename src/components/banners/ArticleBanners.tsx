import { ResponsiveImage } from '@/components/ui'
import { useGetAllArticleBannersQuery } from '@/services'

import type { IBanner } from '@/types'

const ArticleBanners: React.FC = (props) => {
  const {
    data: articleBannerData,
    isLoading: isLoadingArticleBanner,
    isError: isErrorArticleBanner,
  } = useGetAllArticleBannersQuery()
  if (articleBannerData?.data?.length === 0) return null

  return (

    <div className="grid grid-cols-2 gap-2 justify-center">
    <div>
      <img
        className="h-auto max-w-full rounded-lg"
        src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg"
        alt=""
      />
    </div>
    <div>
      <img
        className="h-auto max-w-full rounded-lg"
        src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg"
        alt=""
      />
    </div>
    <div>
      <img
        className="h-auto max-w-full rounded-lg"
        src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg"
        alt=""
      />
    </div>
    <div>
      <img
        className="h-auto max-w-full rounded-lg"
        src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-4.jpg"
        alt=""
      />
    </div>
  </div>
  )
}

export default ArticleBanners
