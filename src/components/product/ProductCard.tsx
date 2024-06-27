import { truncate } from '@/utils'

import { Plus, Star } from '@/icons'
import { ResponsiveImage } from '@/components/ui'
import {
  ProductDiscountTag,
  ProductSpecialOffer,
  ProductPriceDisplay,
  ProductStockIndicator,
} from '@/components/product'

import type { IProduct } from '@/types'

interface Props {
  product: IProduct
  slide?: boolean
}

const ProductCard: React.FC<Props> = (props) => {
  // ? Props
  const { product, slide } = props

  // ? Render(s)
  return (
    <a target="_blank" href={`/products/${product.slug}`} className="block">
      <article className={`bg-red-200 flex flex-col flex-1 items-center justify-center rounded-lg shadow hover:shadow-xl relative`}>
        <ResponsiveImage
          dimensions=" h-[155px] xs:h-[210px] sm:h-[300px] lg:h-[280px] xl:h-[300px] w-full"
          className="mx-auto relative sm:object-center"
          src={product.imagesSrc[0].imageUrl}
          blurDataURL={product.imagesSrc[0].placeholder}
          alt={product.title}
          imageStyles="object-center rounded-t-lg "
        />
        <div className="h-full flex flex-col gap-y-4 pt-4 ">
          <h2 className="text-center">{product.title}</h2>
          <div className="mt-1.5 flex justify-center gap-x-2 px-2 ">
            <div>
              <ProductDiscountTag discount={product.discount} />
            </div>
            <ProductPriceDisplay inStock={product.inStock} discount={product.discount} price={product.price} />
          </div>
        </div>
      </article>
    </a>
  )
}

export default ProductCard
