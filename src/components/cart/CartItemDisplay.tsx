import Link from 'next/link'

import { formatNumber } from '@/utils'

import { Rule, Save, ShieldCheck, Toman } from '@/icons'
import { ProductSpecialOffer } from '@/components/product'
import { ResponsiveImage } from '@/components/ui'
import { CartItemActions, CartDiscountItem } from '@/components/cart'

import type { ICart } from '@/types'

interface Props {
  item: ICart
}

const CartItemDisplay: React.FC<Props> = (props) => {
  // ? Props
  const { item } = props

  // ? Render(s)
  return (
    <article className="flex gap-x-4 px-4 py-5 border border-[#e90089] rounded-xl m-6">
      {/* image & CartItemActions */}
      <div className="space-y-4">
        <ResponsiveImage
          dimensions="w-28 h-28"
          src={item.img.imageUrl}
          blurDataURL={item.img.placeholder}
          alt={item.name}
          imageStyles="object-contain"
        />

        <CartItemActions item={item} />
      </div>

      {/* name */}
      <div>
        <h5 className="mb-3 text-sm text-start">
          <Link href={`/products/${item.slug}`}>{item.name}</Link>
        </h5>

        {/* info */}
        <div className="space-y-3">
          {item.color && (
            <div className="flex items-center gap-x-2">
              <span className="inline-block h-5 w-5 rounded-xl shadow" style={{ background: item.color.hexCode }} />
              <span>{item.color.name}</span>
            </div>
          )}
          {item.size && (
            <div className="flex items-center gap-x-2">
              <Rule className="icon" />
              <span className="farsi-digits">{item.size.name}</span>
            </div>
          )}

          {item.features && (
            <div>
              <div className="flex gap-2 items-center flex-wrap text-xs xs:text-sm md:text-base">
                {item.features.title}
                {item.features.value?.map((val) => (
                  <div key={val.id} className="font-light border rounded-lg p-0.5">
                    {val.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {item.discount > 0 ? (
            <CartDiscountItem discount={item.discount} price={item.price} />
          ) : (
            <div className="flex items-center gap-x-2">
              <span className="text-xs xs:text-sm text-gray-700">{formatNumber(item.price)}</span>
              تومان{' '}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export default CartItemDisplay
