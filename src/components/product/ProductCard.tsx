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

  const stockItemWithDiscount = product.stockItems.find((stockItem) => stockItem.discount! > 0)
  const stockItemWithOutDiscount = product.stockItems.find((stockItem) => stockItem.discount === null)
  const stockItemPrice = product.stockItems.find( (stockItem) => stockItem.quantity! > 0 && (stockItem.price !== undefined || stockItem.price > 0))
  const hasStock = product.stockItems.some(
    (stockItem) => stockItem.quantity! > 0 && (stockItem.price !== undefined || stockItem.price > 0)
  )
  console.log(product.stockItems, 'product.stockItems')

  // ? Render(s)
  return (
    <a target="_blank" href={`/products/${product.slug}`} className="block">
      <article
        className={`flex flex-col flex-1 items-center justify-center rounded-lg shadow hover:shadow-xl relative`}
      >
        <>
          <ResponsiveImage
            dimensions="h-[155px] xs:h-[210px] sm:h-[300px] lg:h-[280px] xl:h-[300px] w-full"
            className="mx-auto relative sm:object-center"
            src={product.mainImageSrc.imageUrl}
            blurDataURL={product.mainImageSrc.placeholder}
            alt={product.title}
            imageStyles="object-center rounded-t-lg"
          />
          <div className="h-full flex flex-col gap-y-4 pt-4 pb-2">
            <h2 className="text-center">{product.title}</h2>
            <div className="mt-1.5 flex justify-center gap-x-2 px-2 ">
              <div>
                {stockItemWithDiscount && stockItemWithDiscount?.discount !== null && (
                  <ProductDiscountTag
                    price={stockItemWithDiscount.price ?? 0}
                    discount={stockItemWithDiscount.discount ?? 0}
                  />
                )}
              </div>
              {hasStock ? (
                <ProductPriceDisplay
                  inStock={product.inStock}
                  discount={0}
                  price={stockItemPrice?.price!}
                />
              ) : (
                <div className="text-gray-400 font-semibold mb-1">ناموجود</div>
              )}
            </div>
          </div>
        </>
      </article>
    </a>
  )
}

export default ProductCard
