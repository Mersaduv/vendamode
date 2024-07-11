import { roles } from '@/utils'
import { ProtectedRouteWrapper } from '@/components/user'
import { UserProfileAside } from '@/components/shared'

interface Props {
  children: React.ReactNode
}

const ProfileLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
    <ProtectedRouteWrapper allowedRoles={[roles.ADMIN, roles.SUPERADMIN, roles.USER]}>
      <div className="lg:container md:flex md:max-w-7xl md:gap-x-6 md:px-3 pt-40 md:pt-32">
        <div className="hidden md:block">
          <UserProfileAside />
        </div>
        <div className="h-fit flex-1 md:mt-10 rounded-md shadow-item ">
          {children}
        </div>
      </div>
    </ProtectedRouteWrapper>
    </>
  )
}
export default ProfileLayout
