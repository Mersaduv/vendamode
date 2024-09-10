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
    <>
      <div className="grid max-w-[1370px] grid-cols-1 xs2:grid-cols-2 gap-4 justify-center px-4 mx-auto">
        {/* {articleBannerData?.data?.map((articleBanner) => {
          return ( */}
            <div className="relative" key={articleBannerData?.data[0].id}>
              <div className="rounded-lg p-[13px] rounded-r-none absolute bottom-[30px] right-0 bg-[#f7f7f5] shadow-article-banner ">
                <div className="line-clamp-1 overflow-hidden text-ellipsis max-w-96">{articleBannerData?.data[0].title}</div>
              </div>
              <img
                className="h-auto max-w-full rounded-lg"
                src={articleBannerData?.data[0].imagesSrc?.imageUrl}
                alt={articleBannerData?.data[0].title}
              />
            </div>
            
            <div className="relative" key={articleBannerData?.data[1].id}>
              <div className="rounded-lg p-[13px] rounded-l-none absolute bottom-[30px] left-0 bg-[#f7f7f5] shadow-article-banner-l ">
                <div className="line-clamp-1 overflow-hidden text-ellipsis max-w-96">{articleBannerData?.data[1].title}</div>
              </div>
              <img
                className="h-auto max-w-full rounded-lg"
                src={articleBannerData?.data[1].imagesSrc?.imageUrl}
                alt={articleBannerData?.data[1].title}
              />
            </div>

            <div className="relative" key={articleBannerData?.data[2].id}>
              <div className="rounded-lg p-[13px] rounded-r-none absolute bottom-[30px] right-0 bg-[#f7f7f5] shadow-article-banner ">
                <div className="line-clamp-1 overflow-hidden text-ellipsis max-w-96">{articleBannerData?.data[2].title}</div>
              </div>
              <img
                className="h-auto max-w-full rounded-lg"
                src={articleBannerData?.data[2].imagesSrc?.imageUrl}
                alt={articleBannerData?.data[2].title}
              />
            </div>

            <div className="relative" key={articleBannerData?.data[3].id}>
              <div className="rounded-lg p-[13px] rounded-l-none absolute bottom-[30px] left-0 bg-[#f7f7f5] shadow-article-banner-l ">
                <div className="line-clamp-1 overflow-hidden text-ellipsis max-w-96">{articleBannerData?.data[3].title}</div>
              </div>
              <img
                className="h-auto max-w-full rounded-lg"
                src={articleBannerData?.data[3].imagesSrc?.imageUrl}
                alt={articleBannerData?.data[3].title}
              />
            </div>
        {/* //   )
        // })} */}
      </div>
      <hr className="pb-20 mx-8 border-t-2 mt-20" />
    </>
  )
}

export default ArticleBanners
