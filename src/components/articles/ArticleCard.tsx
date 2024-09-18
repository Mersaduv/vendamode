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
    <a target="_blank" href={`/articles/${article.slug}`} className="blank px-4">
      <article
        className={`flex  w-[210px] flex-col flex-1 items-center justify-center rounded-lg shadow-item hover:shadow-article relative `}
      >
        <>
          <ResponsiveImage
            dimensions="w-full h-[150px]"
            className="mx-auto relative sm:object-cover"
            src={article.image.imageUrl}
            blurDataURL={article.image.placeholder}
            alt={article.title}
            imageStyles="object-center rounded-t-lg"
          />
          <div className="h-[80px] flex flex-col items-center gap-y-4 pt-4 pb-2 w-full px-4">
            <h4 className="text-start w-full text-gray-500 line-clamp-2 overflow-hidden text-ellipsis">{article.title}</h4>
            {/* <hr className=" border-b-2 border-sky-300 w-16 " /> */}
          </div>
        </>
      </article>
    </a>
  )
}

export default ArticleCard
