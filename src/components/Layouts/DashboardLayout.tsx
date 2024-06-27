import { ProtectedRouteWrapper } from '@/components/user'
import { DashboardAdminAside } from '@/components/shared'

import { roles } from '@/utils'
import Link from 'next/link'

interface Props {
  children: React.ReactNode
}

const DashboardLayout: React.FC<Props> = ({ children }) => {
  return (
    <ProtectedRouteWrapper allowedRoles={[roles.ADMIN, roles.SUPERADMIN]}>
      <header className="w-full shadow py-2">
        <div className="w-[265px] flex items-center justify-center">
          <Link className="" passHref href="/">
            <img width={175} src={'/logo/Logo.png'} alt="Venda Mode" />
          </Link>
        </div>
      </header>
      <div className="flex">
        <div className="">
          <DashboardAdminAside />
        </div>
        <div className="w-full">{children}</div>
      </div>
    </ProtectedRouteWrapper>
  )
}

export default DashboardLayout
