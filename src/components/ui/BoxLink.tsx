import Link from 'next/link'
import { useRouter } from 'next/router'

import { ArrowLeft } from '@/icons'
import { IconType } from 'react-icons'
import { BsTriangleFill } from 'react-icons/bs'

interface Props {
  children: React.ReactNode
  path: string
  name: string
  icon: IconType
}

const BoxLink: React.FC<Props> = (props) => {
  // ? Props
  const {path, name } = props

  // ? Assets
  const router = useRouter()

  // ? Render(s)
  return (
    <>
      <Link
        href={path}
        className={`hidden md:flex-center mx-4 text-gray-500 gap-x-1 py-4 text-xs font-medium md:text-sm}`}
      >
        <props.icon className={`w-5 h-5 ${router.pathname === path ? 'text-[#e90089] ' : ' text-gray-500'}`} />
        <span className={`ml-auto mr-3 ${router.pathname === path ? 'text-[#e90089] ' : ' text-gray-500'}`}>
          {name}
        </span>
      </Link>
      <Link
        href={path}
        className={`md:hidden relative py-1.5 w-[1100px] border rounded-lg flex items-center flex-col ${
          router.pathname === path ? 'bg-[#e90089]' : ' text-gray-500'
        }  gap-x-1  text-xs font-medium md:text-sm}`}
      >
        <props.icon className={`w-5 h-5 ${router.pathname === path ? 'text-white ' : ' text-gray-500'}`} />
        <span className={`whitespace-nowrap ${router.pathname === path ? 'text-white ' : ' text-gray-500'}`}>
          {name}
        </span>
        {router.pathname == path ? (
          <BsTriangleFill className="rotate-180 text-[#e90089]  absolute -bottom-2.5" />
        ) : null}
      </Link>
    </>
  )
}

export default BoxLink
