import Link from 'next/link'

import { ResponsiveImage } from '@/components/ui'

import type { ICategory } from '@/types'

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
  const { homePage, childCategories,name } = props

  // ? Re-Renders
  if (childCategories.categories.length > 0) {
    return (
      <section className="px-3 border-t-2 pt-8 mx-8 ">
        <h4 className="mb-3 text-center text-2xl">
          {childCategories.title}{' '}
          <span
            className="text-2xl"
            style={{}}
          >
            {name}
          </span>
        </h4>
        <div className="mx-auto flex w-fit flex-wrap justify-center gap-4 space-x-4">
          {childCategories.categories.map((item, index) => (
            <div key={index} className="text-center">
              <Link href={homePage ? `/main/${item.slug}` : `/products?category=${item.slug}`} className="text-center">
                <ResponsiveImage
                  dimensions="w-28 h-28 lg:h-44 lg:w-44"
                  className="mx-auto mb-1  transition duration-300 ease-in-out transform hover:scale-110"
                  src={item.imagesSrc?.imageUrl}
                  alt={item.name}
                  blurDataURL={item.imagesSrc?.placeholder}
                  imageStyles="object-contain"
                />
                <span className="text-lg text-black">{item.name}</span>
              </Link>
            </div>
          ))}
        </div>
      </section>
    )
  }
  return null
}

export default CategoryList