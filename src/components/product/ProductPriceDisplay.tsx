import { formatNumber } from '@/utils'

import { Toman } from '@/icons'
import { ProductDiscountTag } from '@/components/product'
import { digitsEnToFa } from '@persian-tools/persian-tools'

interface Props {
  singleProduct?: boolean
  inStock: number
  discount: number
  price: number
}

const ProductPriceDisplay: React.FC<Props> = (props) => {
  // ? Props
  const { singleProduct, inStock, discount, price } = props

  // ? Render(s)
  return (
    <div className={`${singleProduct && 'flex flex-col-reverse'}`}>
      {discount > 0 && (
        <div>
          <span className="farsi-digits ml-2 text-lg text-red-500 font-bold line-through-a">{digitsEnToFa(formatNumber(price))}</span>
          {singleProduct && discount > 0 && inStock !== 0 && <ProductDiscountTag discount={discount} />}
        </div>
      )}
      <div className="flex items-center">
        <span className="farsi-digits text-lg text-gray-700">{digitsEnToFa(formatNumber(price - (discount * price) / 100))}</span>
      </div>

    </div>
  )
}

export default ProductPriceDisplay
