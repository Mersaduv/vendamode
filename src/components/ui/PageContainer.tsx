import { BackIconButton } from '@/components/ui'

interface Props {
  title: string
  children: React.ReactNode
}

const PageContainer: React.FC<Props> = (props) => {
  // ? Props
  const { title, children } = props

  // ? Render(s)
  return (
    <>
      <div className="flex items-center py-1">
        <div className="lg:hidden">
          <BackIconButton />
        </div>
        <h3 className="pr-4 text-sm md:text-base lg:mx-3 lg:border lg:border-[#e90089] w-full rounded-md py-3 flex justify-start items-center bg-[#fde5f3] text-[#e90089]">{title}</h3>
      </div>
      <div className="section-divide-y" />

      {children}
    </>
  )
}

export default PageContainer
