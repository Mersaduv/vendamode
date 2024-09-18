import Link from 'next/link'

import { ResponsiveImage } from '@/components/ui'

import type { ICategory } from '@/types'
import { useGetStoreCategoriesQuery, useGetStoreCategoryListQuery } from '@/services'

interface Props {
  homePage?: boolean
  childCategories: {
    title: string
    categories: ICategory[]
  }
  name: string
}

const CategoryList: React.FC<Props> = (props) => {
  // ? Props
  const { homePage, childCategories, name } = props
  const {
    data: storeCategoriesData,
    isLoading: isLoadingStoreCategories,
    isError: isErrorStoreCategories,
    isFetching,
  } = useGetStoreCategoryListQuery()

  if (isFetching) {
    return <div>Loading...</div>
  }
  // ? Re-Renders
  if (
    childCategories.categories.length > 0 &&
    storeCategoriesData &&
    storeCategoriesData?.data &&
    storeCategoriesData?.data?.length > 0
  ) {
    return (
      <section className="px-3   sm:mx-8 margin-categorySlider">
        <h4 className="w-full text-center text-gray-400 font-normal text-lg pb-4">
          {childCategories.title}{' '}
          <span className="w-full text-center text-gray-400 font-normal text-lg pb-4" style={{}}>
            {name}
          </span>
        </h4>
        <div className="mx-auto flex w-fit flex-wrap justify-center gap-7 space-x-4">
          {storeCategoriesData?.data?.map((item, index) => (
            <div key={index} className="text-center">
              <Link href={`/products?categorySlug=${item.slug}&categoryId=${item.id}`} className="text-center">
                <ResponsiveImage
                  dimensions="w-28 h-28 "
                  className="mx-auto mb-1  transition duration-300 ease-in-out transform hover:scale-110"
                  src={item.imagesSrc?.imageUrl!}
                  alt={item.name}
                  blurDataURL={item.imagesSrc?.placeholder}
                  imageStyles="object-contain"
                />
                <p dir="rtl" className="text-center text-gray-500 line-clamp-1 overflow-hidden text-ellipsis mt-4">
                  {item.name}
                </p>
              </Link>
            </div>
          ))}
        </div>
        <hr className="pb-20 border-t-2 mt-20" />
      </section>
    )
  }
  return null
}

export default CategoryList
