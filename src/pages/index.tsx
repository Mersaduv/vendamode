import Head from 'next/head'
import ClientLayout from '@/components/Layouts/ClientLayout'
import { siteDescription } from '@/utils'
import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import { IBanner, ICategory, ISlider } from '@/types'
import { getAllBanners, getCategories, getFooterBanner, getHeaderText, getSliders } from '@/services'
import config from '@/configs'
import { DiscountSlider, MainSlider, NewSlider } from '@/components/sliders'
import { Button } from '@/components/ui'
import { CategoryList } from '@/components/categories'
import { ArticleBanners, FooterBanner, LargeBanner } from '@/components/banners'
import { PriceRange } from '@/components/product'
import { IHeaderText } from '@/types/IHeaderText.type'
import { useAppSelector } from '@/hooks'
import { MetaTags } from '@/components/shared'

interface Props {
  sliders: ISlider[]
  banners: IBanner[]
  footerBanners: IBanner[]
  headerText: IHeaderText | null
  childCategories: {
    title: string
    categories: ICategory[]
  }
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const dataSlider = await getSliders()
  const dataBanner = await getAllBanners()
  const dataFooterBanner = await getFooterBanner()
  const dataHeaderText = await getHeaderText()
  const dataCategory = await getCategories()

  const slidersData = dataSlider?.data ?? []
  const bannersData = dataBanner?.data ?? []
  const footerBannersData = dataFooterBanner?.data ?? []
  const headerTextData = dataHeaderText?.data ?? null
  const categoriesData = dataCategory?.data?.categoryList ?? []

  return {
    revalidate: config.revalidate,
    props: {
      sliders: slidersData,
      banners: bannersData,
      footerBanners: footerBannersData,
      headerText: headerTextData,
      childCategories: {
        title: 'دسته‌بندهای',
        categories: categoriesData,
      },
    },
  }
}

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (props) => {
  // ? Props
  const { sliders, banners, headerText, childCategories, footerBanners } = props
  console.log(sliders, 'sliders')
  const { generalSetting } = useAppSelector((state) => state.design)
  // ? Render(s)
  return (
    <ClientLayout>
      <main className="min-h-screen">
        <MetaTags
          title={generalSetting?.title || 'فروشگاه اینترنتی'}
          description={generalSetting?.shortIntroduction || 'توضیحاتی فروشگاه اینترنتی'}
          keywords={generalSetting?.googleTags || ' اینترنتی, فروشگاه'}
        />
        <div className="mx-auto space-y-24 py-4 ">
          <MainSlider data={sliders} />
          <hr className="pb-8 mx-8 border-t-2" />
          {/* // slider */}
          <div className="relative w-full flex bg-slate-300">
            <div className="bg-[#dcb6db] w-full h-[410px] xs:h-[330px] sm:h-[360px] relative">
              <DiscountSlider />
            </div>
          </div>
          <CategoryList childCategories={childCategories} name={'وندامد'} homePage />
          <hr className="pb-8 mx-8 border-t-2" />
          <LargeBanner data={banners} />
          <hr className="pb-8 mx-8 border-t-2" />
          {/* // slider */}
          <div className="relative w-full flex bg-slate-300">
            <div className="bg-[#dee2e6] w-full h-[410px] xs:h-[330px] sm:h-[360px] relative">
              <NewSlider />
            </div>
          </div>
          {/* brand slider */}
          {/* <div className="relative w-full flex bg-slate-300">
            <div className="bg-[#dee2e6] w-full h-[410px] xs:h-[330px] sm:h-[360px] relative">
              <BrandSlider />
            </div>
          </div> */}

          {/* best seller slider */}
          {/* <div className="relative w-full flex bg-slate-300">
            <div className="bg-[#dee2e6] w-full h-[410px] xs:h-[330px] sm:h-[360px] relative">
              <SellerSlider />
            </div>
          </div> */}

          {/* Readable Article slider */}
          {/* <div className="relative w-full flex bg-slate-300">
            <div className="bg-[#dee2e6] w-full h-[410px] xs:h-[330px] sm:h-[360px] relative">
              <ReadableSlider />
            </div>
          </div> */}

          {/* Recently viewed products by you slider */}
          {/* <div className="relative w-full flex bg-slate-300">
            <div className="bg-[#dee2e6] w-full h-[410px] xs:h-[330px] sm:h-[360px] relative">
              <ReadableSlider />
            </div>
          </div> */}

          {/* article Banners  */}
          <ArticleBanners />
          <hr className="pb-8 mx-8 border-t-2" />
          <FooterBanner data={footerBanners} />
        </div>
      </main>
    </ClientLayout>
  )
}

export default Home
