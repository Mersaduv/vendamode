import Link from 'next/link'

import { useGetSubCategoriesQuery } from '@/services'
import { generateQueryParams } from '@/utils'

import { SubCategoriesSkeleton } from '@/components/skeleton'
import { ResponsiveImage } from '@/components/ui'

interface Props {
  category: string
}

const ProductSubCategoriesList: React.FC<Props> = (props) => {
  const { category } = props
  console.log(category, 'categorycategory')

  const { childCategories, isLoading } = useGetSubCategoriesQuery(
    { slug: category },
    {
      skip: !category,
      selectFromResult: ({ isLoading, data }) => ({
        childCategories: data?.data?.children,
        isLoading,
      }),
    }
  )

  // ? Render(s)
  return (
    <section className="ps-4 md:px-4">
      {isLoading ? (
        <SubCategoriesSkeleton />
      ) : childCategories && childCategories.length > 0 ? (
        <>
          <h4 className="mb-4 text-base text-black sm:hidden lg:pt-4">دسته‌بندی‌ها</h4>
          <div className="flex gap-3 overflow-x-auto scroll-smooth pb-3">
            {childCategories.filter(x=>x.isActive).map((item) => (
              <Link
                key={item.id}
                href={`/products?${generateQueryParams({
                  categorySlug: item.slug,
                  categoryId: item.id,
                  sort: '',
                })}`}
                className="rounded-md bg-gray-50 border-4 border-gray-100 px-3 pb-2 pt-4 text-center"
              >
                <ResponsiveImage
                  dimensions="w-24 h-24"
                  src={item.imagesSrc?.imageUrl!}
                  blurDataURL={item.imagesSrc?.placeholder}
                  alt={item.name}
                  imageStyles="object-contain"
                />

                <span className="mt-2 inline-block">{item.name}</span>
              </Link>
            ))}
          </div>
        </>
      ) : null}
    </section>
  )
}

export default ProductSubCategoriesList
