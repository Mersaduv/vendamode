import type { ICategoryLevel, IProduct } from '@/types'
import Link from 'next/link'

interface Props {
  categoryLevels: ICategoryLevel[]
}

const ProductBreadcrumb: React.FC<Props> = ({ categoryLevels }) => {

  // ? Render(s)
  return (
    <div className="pr-2 flex items-center">
      <Link href="/" className="inline-block font-light p-1 text-sm text-[#00c3e1]">
        وندامد
      </Link>
      {'|'}
      {categoryLevels?.map((category, index) => (
        <div key={category.id}>
          <Link href={`/products?category=${category.slug}`} className="inline-block p-1 text-sm text-[#00c3e1] font-light">
            {category.name}
          </Link>
          {index < categoryLevels.length - 1 && '|'}
        </div>
      ))}
    </div>
  )
}

export default ProductBreadcrumb
