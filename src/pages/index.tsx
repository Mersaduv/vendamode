import Head from 'next/head'
import ClientLayout from '@/components/Layouts/ClientLayout'
import { siteDescription } from '@/utils'
import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import { IBanner, ICategory, ISlider } from '@/types'
import { getCategories, getSliders } from '@/services'
import config from '@/configs'
import { DiscountSlider, MainSlider, NewSlider } from '@/components/sliders'
import { Button } from '@/components/ui'
import { CategoryList } from '@/components/categories'
import { LargeBanner } from '@/components/banners'
import { PriceRange } from '@/components/product'

interface Props {
  sliders: ISlider[]
  childCategories: {
    title: string
    categories: ICategory[]
  }
}

const bannerAds: IBanner[] = [
  {
    id: '87789902000',
    categoryId: '98762544333333',
    image: {
      url: '/images/Tab/tabimg1.jpg',
      placeholder: '/images/Tab/tabimg1.jpg',
    },
    uri: 'wwww.wwwwwwwwww.com',
    title: 'بنر تبلیغاتی',
    isPublic: true,
    type: 'بزرگ',
    created: '',
    updated: '',
  },
  {
    id: '877289902000',
    categoryId: '987654423333233',
    image: {
      url: '/images/Tab/tabimg2.jpg',
      placeholder: '/images/Tab/tabimg1.jpg',
    },
    uri: 'wwww.wwwwwwwwww.com',
    title: 'بنر تبلیغاتی',
    isPublic: true,
    type: 'بزرگ',
    created: '',
    updated: '',
  },
  {
    id: '877899020020',
    categoryId: '982765443323333',
    image: {
      url: '/images/Tab/tabimg3.jpg',
      placeholder: '/images/Tab/tabimg1.jpg',
    },
    uri: 'wwww.wwwwwwwwww.com',
    title: 'بنر تبلیغاتی',
    isPublic: true,
    type: 'بزرگ',
    created: '',
    updated: '',
  },
  {
    id: '8727899000220',
    categoryId: '987265443333233',
    image: {
      url: '/images/Tab/tabimg4.jpg',
      placeholder: '/images/Tab/tabimg1.jpg',
    },
    uri: 'wwww.wwwwwwwwww.com',
    title: 'بنر تبلیغاتی',
    isPublic: true,
    type: 'بزرگ',
    created: '',
    updated: '',
  },
]

export const getStaticProps: GetStaticProps<Props> = async () => {
  const dataSlider = await getSliders()
  const dataCategory = await getCategories()

  const slidersData = dataSlider?.data ?? []
  const categoriesData = dataCategory?.data?.categoryList ?? []
  return {
    revalidate: config.revalidate,
    props: {
      sliders: slidersData,
      childCategories: {
        title: 'دسته‌بندهای',
        categories: categoriesData,
      },
    },
  }
}

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (props) => {
  // ? Props
  const { sliders, childCategories } = props

  // ? Render(s)
  return (
    <ClientLayout>
      <main className="min-h-screen">
        <Head>
          <title>وندامد</title>
          <meta name="description" content={siteDescription} />
        </Head>
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
          <LargeBanner data={bannerAds} />
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
        </div>
      </main>
    </ClientLayout>
  )
}

export default Home
