import { truncate } from '@/utils'

import { Plus, Star } from '@/icons'
import { ResponsiveImage } from '@/components/ui'
import {
  ProductDiscountTag,
  ProductSpecialOffer,
  ProductPriceDisplay,
  ProductStockIndicator,
} from '@/components/product'

import type { IArticle } from '@/types'

interface Props {
  article: IArticle
  slide?: boolean
}

const ArticleCard: React.FC<Props> = (props) => {
  // ? Props
  const { article, slide } = props

  // ? Render(s)
  return (
    <a target="_blank" href={`/articles/${article.slug}`} className="block">
      <article
        className={`flex flex-col flex-1 items-center justify-center rounded-lg shadow hover:shadow-xl relative`}
      >
        <>
          <ResponsiveImage
            dimensions="h-[155px] w-[155px] xs:h-[210px] xs:w-[210px] sm:h-[200px] sm:w-[200px] lg:h-[280px] lg:w-[280px] xl:h-[250px] xl:w-[250px] w-full"
            className="mx-auto relative sm:object-center"
            src={article.image.imageUrl}
            blurDataURL={article.image.placeholder}
            alt={article.title}
            imageStyles="object-center rounded-t-lg"
          />
          <div className="h-full flex flex-col gap-y-4 pt-4 pb-2">
            <h2 className="text-center">{article.title}</h2>
            <div className="mt-1.5 flex justify-center gap-x-2 px-2 ">
                
            </div>
          </div>
        </>
      </article>
    </a>
  )
}

export default ArticleCard
