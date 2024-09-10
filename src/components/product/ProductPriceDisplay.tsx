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
  // Calculate discounted price
  const discountedPrice = price - discount
  // ? Render(s)
  return (
    <div className={`${singleProduct && 'flex flex-col'}`}>
      {discount > 0 ? (
        <div className="text-center mb-1">
          <span dir="rtl" className="farsi-digits text-sm text-red-500 font-normal line-through-a">
            {digitsEnToFa(formatNumber(price))} 
          </span>
        </div>
      ) : (
        <div className='py-[14px]'>

        </div>
      )}
      <div className="flex items-center">
        <span
          className={`flex gap-2 justify-center ${
            singleProduct ? 'text-lg text-green-500' : 'farsi-digits text-base text-gray-700'
          }`}
        >
           <div className="font-semibold text-base">{digitsEnToFa(formatNumber(discountedPrice))}</div>{' '} تومان
        </span>
      </div>
    </div>
  )
}

export default ProductPriceDisplay
