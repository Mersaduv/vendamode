import Link from 'next/link'
import { useRouter } from 'next/router'

import { ArrowLeft } from '@/icons'
import { IconType } from 'react-icons'

interface Props {
  children: React.ReactNode
  path: string
  name: string
  icon: IconType
}

const BoxLink: React.FC<Props> = (props) => {
  // ? Props
  const { path, name, icon } = props

  // ? Assets
  const router = useRouter()

  // ? Render(s)
  return (
    <Link
      href={path}
      className={`flex-center mx-4 text-gray-700 gap-x-1 py-4 text-xs font-medium md:text-sm}`}
    >
      <props.icon className={`icon ${router.pathname === path ? 'text-[#e90089] ' : ' text-gray-700'}`} />
      <span className={`ml-auto mr-3 ${router.pathname === path ? 'text-[#e90089] ' : ' text-gray-700'}`}>{name}</span>
    </Link>
  )
}

export default BoxLink
