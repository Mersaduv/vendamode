import dynamic from 'next/dynamic'
import Head from 'next/head'

import { ClientLayout } from '@/components/Layouts'
import { ArrowLink, ResponsiveImage } from '@/components/ui'
import { useAppSelector } from '@/hooks'
import { MetaTags } from '@/components/shared'

function NotFoundPage() {
  const { generalSetting } = useAppSelector((state) => state.design)
  // ? Render(s)
  return (
    <ClientLayout>
      <main className="flex flex-col items-center justify-center gap-y-6 py-8 xl:mt-28">
        <MetaTags
          title={generalSetting?.title + ' | ' + '404' || 'فروشگاه اینترنتی'}
          description={generalSetting?.shortIntroduction || 'توضیحاتی فروشگاه اینترنتی'}
          keywords={generalSetting?.googleTags || ' اینترنتی, فروشگاه'}
        />
        <p className="text-base font-semibold text-black">صفحه‌ای که دنبال آن بودید پیدا نشد!</p>
        <ArrowLink path="/">صفحه اصلی</ArrowLink>
        <ResponsiveImage dimensions="w-full max-w-lg h-72" src="/icons/page-not-found.png" alt="404" />
      </main>
    </ClientLayout>
  )
}

export default dynamic(() => Promise.resolve(NotFoundPage), { ssr: false })
