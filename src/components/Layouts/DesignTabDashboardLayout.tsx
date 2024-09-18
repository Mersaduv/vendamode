import { ReactNode, useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import clsx from 'clsx'

interface DesignTabDashboardLayoutProps {
  children: ReactNode
}

const tabs = [
  { path: '/admin/ads/main', label: 'صفحه اصلی' },
  { path: '/admin/design/siteItems', label: 'تنظیمات عمومی' },
  { path: '/admin/design/footer', label: 'فوتر' },
  { path: '/admin/design/paints', label: 'رنگ آمیزی' },
]

const DesignTabDashboardLayout: React.FC<DesignTabDashboardLayoutProps> = ({ children }) => {
  const router = useRouter()
  const { pathname } = router

  const handleTabClick = useCallback(
    (path: string) => {
      router.push(path).catch((error) => {
        console.error('Failed to navigate:', error)
      })
    },
    [router]
  )

  const renderedTabs = useMemo(
    () =>
      tabs.map((tab) => (
        <a
          key={tab.path}
          href={tab.path}
          onClick={(e) => {
            e.preventDefault()
            handleTabClick(tab.path)
          }}
          className={clsx(
            'px-3 py-2.5 whitespace-nowrap rounded-[10px] hover:shadow cursor-pointer text-sm',
            pathname.startsWith(tab.path) ? 'bg-[#e90089] text-white hover:bg-[#cf057b]' : 'bg-white text-black'
          )}
          aria-current={pathname.startsWith(tab.path) ? 'page' : undefined}
        >
          {tab.label}
        </a>
      )),
    [handleTabClick, pathname]
  )

  return (
    <div className="min-h-screen max-w-screen-2xl flex flex-col mx-auto w-full pt-7 relative">
      {/* Tab Navigation */}
      <nav className="fixed pt-[103px] top-0 z-50  max-w-screen-2xl w-full bg-[#f5f8fa] pb-3">
        <div className="py-4 overflow-auto  flex gap-4 p-2 shadow-item mx-3 bg-white rounded-lg border-gray-200">
          {renderedTabs}
        </div>
      </nav>
      {/* Page Content */}
      <div className="mt-[88px] mb-4 overflow-auto rounded-lg">{children}</div>
    </div>
  )
}

export default DesignTabDashboardLayout
