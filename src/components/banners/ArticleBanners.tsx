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
    <div className="grid max-w-[1370px] grid-cols-1 xs2:grid-cols-2 gap-4 justify-center px-4 mx-auto">
      {articleBannerData?.data?.map((articleBanner) => {
        return (
          <div className='relative' key={articleBanner.id}>
            <div className='rounded-lg p-[13px] rounded-r-none absolute bottom-[30px] right-0 bg-[#f7f7f5] shadow-article-banner '>

            <div className='line-clamp-1 overflow-hidden text-ellipsis max-w-96'>{articleBanner.title}</div>
            </div>
            <img
              className="h-auto max-w-full rounded-lg"
              src={articleBanner.imagesSrc?.imageUrl}
              alt={articleBanner.title}
            />
          </div>
        )
      })}
    </div>
  )
}

export default ArticleBanners
