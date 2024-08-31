import { ArticleCard } from '@/components/articles'
import { EmptyCustomList } from '@/components/emptyList'
import { ClientLayout } from '@/components/Layouts'
import { Pagination } from '@/components/navigation'
import { DataStateDisplay, MetaTags } from '@/components/shared'
import { ProductSkeleton } from '@/components/skeleton'
import { useAppSelector } from '@/hooks'
import { useGetArticlesQuery } from '@/services'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const Articles: NextPage = () => {
  // ? Assets
  const { query } = useRouter()
  const category = query?.categorySlug?.toString() ?? ''
  const { generalSetting } = useAppSelector((state) => state.design)
  // ? Querirs
  //*    Get Products Data
  const { data: articleData, ...articlesQueryProps } = useGetArticlesQuery(query)

  // ? Render(s)
  return (
    <>
      <MetaTags
        title={generalSetting?.title + ' | ' + 'مقالات'}
        description={generalSetting?.shortIntroduction || 'توضیحاتی فروشگاه اینترنتی'}
        keywords={generalSetting?.googleTags || ' اینترنتی, فروشگاه'}
      />
      <ClientLayout>
        <main className="lg:container overflow-y-auto lg:max-w-[1700px] lg:px-3 xl:mt-10">
          <h1 className='mt-10'>مقالات</h1>
          <DataStateDisplay
            {...articlesQueryProps}
            dataLength={articleData?.data?.totalCount ? articleData.data.totalCount : 0}
            loadingComponent={<ProductSkeleton />}
            emptyComponent={<EmptyCustomList />}
          >
            {articleData && articleData.data && articleData.data.data && articleData.data.data.length > 0 && (
              <section className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-8">
                {articleData.data.data.map((item) => (
                  <ArticleCard article={item} key={item.id} />
                ))}
              </section>
            )}
          </DataStateDisplay>

          {articleData && articleData.data && articleData.data?.totalCount > 5 && (
            <div className="mx-auto py-4 lg:max-w-5xl">
              <Pagination pagination={articleData?.data} section="_articles" client />
            </div>
          )}
        </main>
      </ClientLayout>
    </>
  )
}

export default dynamic(() => Promise.resolve(Articles), { ssr: false })
