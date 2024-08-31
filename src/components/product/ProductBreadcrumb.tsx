import { useAppSelector } from '@/hooks'
import type { CategoryWithAllParents, ICategoryLevel, IProduct } from '@/types'
import Link from 'next/link'

interface Props {
  categoryLevels: CategoryWithAllParents
  isAdmin?: boolean
  isSelector?: boolean
}

const ProductBreadcrumb: React.FC<Props> = ({ categoryLevels, isAdmin, isSelector }) => {
  const { generalSetting } = useAppSelector((state) => state.design)
  // ? Render(s)
  return (
    <>
      {isSelector ? (
        <div className={` ${isAdmin ? '' : 'pr-2 '}flex items-center`}>
          {categoryLevels.parentCategories?.filter(x=>x.level !== 0).map((category, index) => (
            <div key={category.id}>
              <Link
                href={`/products?category=${category.slug}`}
                className="inline-block p-1 text-sm text-gray-500 font-light"
              >
                {category.name}
              </Link>
              {index < categoryLevels.parentCategories.length - 1 && '>'}
            </div>
          ))}
    
          <div>
            <Link
              href={`/products?category=${categoryLevels.category.slug}`}
              className="inline-block p-1 text-sm text-gray-500 font-light"
            >
              {categoryLevels.category.name}
            </Link>
          </div>
        </div>
      ) : (
        <div className={` ${isAdmin ? '' : 'pr-2 '}flex items-center`}>
          {!isAdmin && (
            <>
              {' '}
              <Link href="/" className="inline-block font-light p-1 text-sm text-[#00c3e1]">
                وندامد
              </Link>
              {'>'}
            </>
          )}
          {categoryLevels.parentCategories?.map((category, index) => (
            <div key={category.id}>
              <Link
                href={`/products?category=${category.slug}`}
                className="inline-block p-1 text-sm text-[#00c3e1] font-light"
              >
                {category.name}
              </Link>
              {index < categoryLevels.parentCategories.length - 1 && '>'}
            </div>
          ))}
          {'>'}
          <div>
            <Link
              href={`/products?category=${categoryLevels.category.slug}`}
              className="inline-block p-1 text-sm text-[#00c3e1] font-light"
            >
              {categoryLevels.category.name}
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

export default ProductBreadcrumb
