import { ResponsiveImage } from '@/components/ui'
import { useGetAllArticleBannersQuery } from '@/services'

import type { IBanner } from '@/types'
const ArticleBanners: React.FC = () => {
  const {
    data: articleBannerData,
    isLoading: isLoadingArticleBanner,
    isError: isErrorArticleBanner,
  } = useGetAllArticleBannersQuery()

  if (!articleBannerData?.data || articleBannerData.data.length === 0) return null

  // مرتب‌سازی داده‌های بنر
  const articleBannerSort = [...articleBannerData.data].sort((a, b) => a.index - b.index)

  return (
    <>
      <div className="grid max-w-[1370px] grid-cols-1 xs2:grid-cols-2 gap-4 justify-center px-4 mx-auto">
        {articleBannerSort.slice(0, 4).map((articleBanner, index) => (
          <div className="relative" key={articleBanner.id}>
            <div
              className={`rounded-lg p-[13px] absolute bottom-[30px] ${
                index % 2 === 0 ? 'right-0 rounded-r-none' : 'left-0 rounded-l-none'
              } bg-[#f7f7f5] shadow-article-banner${index % 2 === 0 ? '' : '-l'}`}
            >
              <div className="line-clamp-1 overflow-hidden text-ellipsis max-w-96">{articleBanner.title}</div>
            </div>
            <img
              className="h-auto max-w-full rounded-lg"
              src={articleBanner.imagesSrc?.imageUrl}
              alt={articleBanner.title}
            />
          </div>
        ))}
      </div>
      <hr className="pb-20 mx-8 border-t-2 mt-20" />
    </>
  )
}

export default ArticleBanners
