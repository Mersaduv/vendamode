import Head from 'next/head'
import ClientLayout from '@/components/Layouts/ClientLayout'
import { siteDescription } from '@/utils'
import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import { ISlider } from '@/types'
import { getSliders } from '@/services'
import config from '@/configs'
import { MainSlider } from '@/components/sliders'

interface Props {
  sliders: ISlider[]
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const { data: sliders } = await getSliders()
  const slidersData = sliders ?? []
  return {
    revalidate: config.revalidate,
    props: {
      sliders: slidersData,
    },
  }
}

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (props) => {
  // ? Props
  const { sliders } = props

  // ? Render(s)
  return (
    <ClientLayout>
      <main className="min-h-screen">
        <Head>
          <title>وندامد</title>
          <meta name="description" content={siteDescription} />
        </Head>
        <div className="mx-auto space-y-24 py-4 md:max-w-[1450px]">
          <MainSlider data={sliders} />
          {/* <DiscountSlider currentCategory={currentCategory} /> */}
        </div>
      </main>
    </ClientLayout>
  )
}

export default Home
