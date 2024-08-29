import { Logo } from '@/icons'
import { FullInlineLoading, InlineLoading } from '@/components/ui'
import { useAppSelector } from '@/hooks'

export default function FullScreenLoading() {
  const { logoImages } = useAppSelector((state) => state.design)
  return (
    <div className="mx-auto z-[400] max-w-max space-y-10 rounded-lg bg-[#f5e2ed] p-8 text-center ">
      <img className="h-12 w-40" src={(logoImages?.orgImage && logoImages?.orgImage.imageUrl) || ''} alt="تصویر لوگو" />
      <FullInlineLoading />
    </div>
  )
}
