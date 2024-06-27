import Image from 'next/image'

import { Check, Rule, ShieldCheck } from '@/icons'

import { formatNumber } from '@/utils'

import { useAppSelector } from '@/hooks'

import { CartOperations } from '@/components/cart'
import { ResponsiveImage } from '@/components/ui'
import { ProductStockIndicator } from '@/components/product'

import type { IProduct } from '@/types'
import { digitsEnToFa } from '@persian-tools/persian-tools'

interface Props {
  second?: boolean
  product: IProduct
}

const AddToCartButton: React.FC<Props> = (props) => {
  // ? Props
  const { second, product } = props

  // ? Store
  const {
     tempColor, tempSize 

  } = useAppSelector((state) => state.cart)

  // ? Render(s)
  return (
    <>
      {/* mobile */}
      <div className="fixed inset-x-0 bottom-0 z-20 md:hidden">
        <CartOperations product={product} />
      </div>

      {/* desktop */}
      <div
        className={`hidden md:sticky md:col-start-8 md:col-end-10 md:row-start-2 md:row-end-5 md:flex md:flex-col md:rounded-md  xl:row-end-5 mt-4 border-none ${
          second ? 'md:top-4 xl:top-32' : 'md:top-60 xl:top-[260px]'
        } `}
      >
        {second && (
          <>
            <div className="flex gap-x-4 py-3 ">
              <ResponsiveImage
                dimensions="w-28 h-28"
                src={product.imagesSrc[0].imageUrl}
                blurDataURL={product.imagesSrc[0].placeholder}
                alt={product.title}
                imageStyles="object-contain"
              />

              <span className="flex-1 text-justify">{product.title}</span>
            </div>

            {tempColor && (
              <div className="flex items-center gap-x-2 py-3">
                <span className="inline-block h-5 w-5 rounded-xl shadow" style={{ background: tempColor.hexCode }} />
                <span>{tempColor.name}</span>
              </div>
            )}
            {tempSize && (
              <div className="flex items-center gap-x-2 py-3">
                <Rule className="icon" />
                <span className="farsi-digits">{tempSize.name}</span>
              </div>
            )}
          </>
        )}

        <CartOperations product={product} />
      </div>
    </>
  )
}

export default AddToCartButton
