import { ReactNode, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import clsx from 'clsx';

interface TabDashboardLayoutProps {
  children: ReactNode;
}

const tabs = [
  { path: '/admin/product-configuration/categories', label: 'دسته بندی محصولات' },
  { path: '/admin/product-configuration/features', label: 'ویژگی محصولات' },
  { path: '/admin/product-configuration/brands', label: 'برندها' },
  { path: '/admin/product-configuration/jewelry', label: 'زیورالات' },
];

const TabDashboardLayout: React.FC<TabDashboardLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { pathname } = router;

  const handleTabClick = useCallback((path: string) => {
    router.push(path).catch((error) => {
      console.error('Failed to navigate:', error);
    });
  }, [router]);

  const renderedTabs = useMemo(
    () => tabs.map((tab) => (
      <div
        key={tab.path}
        onClick={() => handleTabClick(tab.path)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleTabClick(tab.path)}
        className={clsx(
          'px-3 py-2.5 whitespace-nowrap rounded-[10px] hover:shadow cursor-pointer text-sm',
          pathname.startsWith(tab.path)
            ? 'bg-[#e90089] text-white hover:bg-[#cf057b]'
            : 'bg-white text-black'
        )}
        aria-current={pathname.startsWith(tab.path) ? 'page' : undefined}
      >
        {tab.label}
      </div>
    )),
    [handleTabClick, pathname]
  );

  return (
    <div className="min-h-screen max-w-screen-2xl flex flex-col mx-auto w-full pt-7 md:p-7">
      {/* Tab Navigation */}
      <div className="py-4 overflow-auto flex gap-4 p-2 shadow-item mx-2 bg-white rounded-lg border-gray-200">
        {renderedTabs}
      </div>
      {/* Page Content */}
      <div className="mt-4 mb-4 overflow-auto rounded-lg shadow-item mx-2 bg-white">
        {children}
      </div>
    </div>
  );
}

export default TabDashboardLayout;
