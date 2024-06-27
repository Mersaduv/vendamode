import Link from 'next/link'
import { useRouter } from 'next/router'

// import { useUserInfo } from '@/hooks'

import { Login, User } from '@/icons'
import { UserMenuDropdown } from '@/components/user'
import { Skeleton } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/hooks'

const UserAuthLinks = () => {
  const { asPath } = useRouter()
  const dispatch = useAppDispatch()

  // ? Get UserInfo
  const { userInfo } = useAppSelector((state) => state.auth)
  // ? Render(s)
  if (false) return <Skeleton.Item height="h-8" width="w-7 lg:w-12" animated="background" />
  else if (!userInfo) {
    return (
      <Link href={`/authentication/login?redirectTo=${asPath}`} className="flex-center gap-x-1">
        <div className="flex-center gap-x-2 lg:rounded-xl lg:border lg:border-[#e90089] lg:px-3 lg:py-2">
          <Login className="text-2xl rotate-180" />
          <span className='text-sm hidden sm:block font-medium'>ورود</span>
        </div>
      </Link>
    )
  } else if (userInfo) {
    return (
      <div className="sm:border rounded-lg">
        <div className="lg:hidden sm:px-3 py-1 hover:shadow rounded-lg">
          <Link href="/profile">
            <User className="icon h-7 w-7" />
          </Link>
        </div>
        <div className="hidden lg:block">
          <UserMenuDropdown name={userInfo.fullName!} />
        </div>
      </div>
    )
  }
}

export default UserAuthLinks
