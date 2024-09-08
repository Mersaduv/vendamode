import Head from 'next/head'
import ClientLayout from '@/components/Layouts/ClientLayout'
import { siteDescription } from '@/utils'
import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import { IBanner, ICategory, ISlider } from '@/types'
import { getAllBanners, getCategories, getFooterBanner, getHeaderText, getSliders } from '@/services'
import config from '@/configs'
import { BestSeller, BrandSlider, DiscountSlider, LastSeenSlider, MainSlider, NewSlider, ReadableArticlePlace } from '@/components/sliders'
import { Button } from '@/components/ui'
import { CategoryList } from '@/components/categories'
import { ArticleBanners, FooterBanner, LargeBanner } from '@/components/banners'
import { PriceRange } from '@/components/product'
import { IHeaderText } from '@/types/IHeaderText.type'
import { useAppSelector } from '@/hooks'
import { MetaTags } from '@/components/shared'
import Link from 'next/link'

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
    // revalidate: config.revalidate,
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

          {/* //  newest slider */}
          <div className="relative">
            <div className="w-full block text-center px-3 line-clamp-2 overflow-hidden text-ellipsis  sm:hidden whitespace-nowrap -mt-20 text-lg text-gray-400 ">
              جدید ترین های {generalSetting?.title}
            </div>
            <div className="flex w-full bg-slate-300 relative h-[275px] mt-28">
              <div className="hidden w-[38%] sm:block md:w-[20%]">
                <div className="hidden sm:block">
                  <div className=" line-clamp-2 overflow-hidden text-ellipsis text-center -mt-20 text-lg text-gray-400  px-3 w-full">
                    جدید ترین های {generalSetting?.title}
                  </div>
                </div>
                <div className="mt-14 flex justify-center">
                  <img className="w-[220px]" src="/images/NEW.webp" alt="offer" />
                </div>
                <p className="text-gray-500 font-normal text-md w-full text-center my-4 mb-5">بروز باش</p>
                <div className="w-full  sm:flex justify-center hidden">
                  <Link href={`/products?sortBy=Created`}>
                    <Button className="bg-red-500 hover:bg-red-400 rounded-lg py-3 px-5 text-white">نمایش همه</Button>
                  </Link>
                </div>
              </div>
              <div className="w-[100%] sm:w-[62%] md:w-[80%] -mt-20">
                <NewSlider />
              </div>
            </div>
            <div className="w-full  sm:hidden justify-center flex absolute bottom-3">
              <Link href={`/products?sortBy=Created`}>
                <Button className="bg-red-500 hover:bg-red-400 rounded-lg py-3 px-5 text-white">نمایش همه</Button>
              </Link>
            </div>
          </div>

          <CategoryList childCategories={childCategories} name={generalSetting?.title ?? ''} homePage />
          <hr className="pb-8 mx-8 border-t-2" />
          <LargeBanner data={banners} />
          <hr className="pb-8 mx-8 border-t-2" />
          {/* // Discount slider */}
          {/* <div className="relative w-full flex bg-slate-300">
            <div className="bg-[#dcb6db] w-full h-[410px] xs:h-[330px] sm:h-[360px] relative">
              <DiscountSlider />
            </div>
          </div> */}
          {/* //  newest slider */}
          <div className="relative">
            <div className="w-full block text-center px-3 line-clamp-2 overflow-hidden text-ellipsis  sm:hidden whitespace-nowrap -mt-20 text-lg text-gray-400 ">
              تخفیف های {generalSetting?.title}
            </div>
            <div className="flex w-full bg-[#dcb6db] relative h-[275px] mt-28">
              <div className="hidden w-[38%] sm:block md:w-[20%]">
                <div className="hidden sm:block">
                  <div className=" line-clamp-2 overflow-hidden text-ellipsis text-center -mt-20 text-lg text-gray-400  px-3 w-full">
                    تخفیف های {generalSetting?.title}
                  </div>
                </div>
                <div className="mt-14 flex justify-center">
                  <img className="w-[220px]" src="/images/Offer.webp" alt="offer" />
                </div>
                <p className="text-gray-500 font-normal text-md w-full text-center my-4 mb-5">
                  تخفیف های امروز رو از دست نده
                </p>
                <div className="w-full  sm:flex justify-center hidden">
                  <Link href={`/products?sortBy=Discount&discount=true`}>
                    <Button className="bg-red-500 hover:bg-red-400 rounded-lg py-3 px-5 text-white">نمایش همه</Button>
                  </Link>
                </div>
              </div>
              <div className="w-[100%] sm:w-[62%] md:w-[80%] -mt-20">
                <DiscountSlider />
              </div>
            </div>
            <div className="w-full  sm:hidden justify-center flex absolute bottom-3">
              <Link href={`/products?sortBy=Discount&discount=true`}>
                <Button className="bg-red-500 hover:bg-red-400 rounded-lg py-3 px-5 text-white">نمایش همه</Button>
              </Link>
            </div>
          </div>

          {/* brand slider */}
          <div className=" pt-44 sm:pt-0">
            <BrandSlider />
          </div>

          {/* best seller slider */}
          <div className="relative">
            <div className="w-full block text-center px-3 line-clamp-2 overflow-hidden text-ellipsis  sm:hidden whitespace-nowrap -mt-20 text-lg text-gray-400 ">
              پرفروش های
              {generalSetting?.title}
            </div>
            <div className="flex w-full bg-slate-300 relative h-[275px] mt-44">
              <div className="hidden w-[38%] sm:block md:w-[20%]">
                <div className="hidden sm:block">
                  <div className=" line-clamp-2 overflow-hidden text-ellipsis text-center -mt-20 text-lg text-gray-400  px-3 w-full">
                    پرفروش های
                    {generalSetting?.title}
                  </div>
                </div>
                <div className="mt-14 flex justify-center">
                  <img className="w-[220px]" src="/images/NEW.webp" alt="offer" />
                </div>
                <p className="text-gray-500 font-normal text-md w-full text-center my-4 mb-5">
                  محصولات پرفروش رو اینجا ببین
                </p>
                <div className="w-full  sm:flex justify-center hidden">
                  <Link href={`/products?bestSelling=true`}>
                    <Button className="bg-red-500 hover:bg-red-400 rounded-lg py-3 px-5 text-white">نمایش همه</Button>
                  </Link>
                </div>
              </div>
              <div className="w-[100%] sm:w-[62%] md:w-[80%] -mt-20">
                <BestSeller />
              </div>
            </div>
            <div className="w-full  sm:hidden justify-center flex absolute bottom-3">
              <Link href={`/products?bestSelling=true`}>
                <Button className="bg-red-500 hover:bg-red-400 rounded-lg py-3 px-5 text-white">نمایش همه</Button>
              </Link>
            </div>
          </div>

          {/* last seen slider */}
          <div className="relative">
            <div className="w-full block text-center px-3 line-clamp-2 overflow-hidden text-ellipsis  sm:hidden whitespace-nowrap -mt-20 text-lg text-gray-400 ">
              بازدید های اخیر شما
            </div>
            <div className="flex w-full bg-slate-300 relative h-[275px] mt-52">
              <div className="hidden w-[38%] sm:block md:w-[20%]">
                <div className="hidden sm:block">
                  <div className=" line-clamp-2 overflow-hidden text-ellipsis text-center -mt-20 text-lg text-gray-400  px-3 w-full">
                    بازدید های اخیر شما
                  </div>
                </div>
                <div className="mt-14 flex justify-center">
                  <img className="w-[220px]" src="/images/Recent Visited.webp" alt="offer" />
                </div>
                <p className="text-gray-500 font-normal text-md w-full text-center my-4 mb-5">
                  بازدید های اخیر رو اینجا ببین
                </p>
                <div className="w-full  sm:flex justify-center hidden">
                  <Link href={`/products`}>
                    <Button className="bg-red-500 hover:bg-red-400 rounded-lg py-3 px-5 text-white">نمایش همه</Button>
                  </Link>
                </div>
              </div>
              <div className="w-[100%] sm:w-[62%] md:w-[80%] -mt-20">
                <LastSeenSlider />
              </div>
            </div>
            <div className="w-full  sm:hidden justify-center flex absolute bottom-3">
              <Link href={`/products`}>
                <Button className="bg-red-500 hover:bg-red-400 rounded-lg py-3 px-5 text-white">نمایش همه</Button>
              </Link>
            </div>
          </div>

          {/* Readable Article Place slider */}
          <div className=" pt-44 sm:pt-0">
            <h1 className="text-center text-xl text-gray-500 border-t py-7 ">خواندنی ها</h1>
            <ReadableArticlePlace />
            <div className="text-center mt-48">
              <Link href={`/articles?place=1`} className="bg-red-500 hover:bg-red-400 rounded-lg py-3 px-5 text-white">
                نمایش همه
              </Link>
            </div>
          </div>

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
