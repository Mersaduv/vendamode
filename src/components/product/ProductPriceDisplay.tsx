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
    <div className={`${singleProduct && 'flex flex-col'}`}>
      {discount > 0 && (
        <div className='text-center mb-1'>
          <span className="farsi-digits ml-2 text-lg text-red-500 font-bold line-through-a">
            {digitsEnToFa(formatNumber(price))}
          </span>
        </div>
      )}
      <div className="flex items-center">
        <span className={`flex gap-2 justify-center ${singleProduct ? 'text-lg text-green-500' : 'farsi-digits text-lg text-gray-700'}`}>
          <div className='font-semibold'>{digitsEnToFa(formatNumber(price - (discount * price) / 100))}</div> تومان
        </span>
      </div>
    </div>
  )
}

export default ProductPriceDisplay
