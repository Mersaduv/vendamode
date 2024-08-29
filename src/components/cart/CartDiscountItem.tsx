import { Toman, TomanRed } from '@/icons'

import { formatNumber } from '@/utils'
import { digitsEnToFa } from '@persian-tools/persian-tools'

interface Props {
  discount: number
  price: number
}

const CartDiscountItem: React.FC<Props> = (props) => {
  // ? Props
  const { discount, price } = props

  // ? Assets
  // Calculate discounted price
  const discountedPrice = price - discount
  // ? Render(s)
  return (
    <div>
      <div className="flex items-center gap-x-2">
        <span className=" text-red-500">{digitsEnToFa(formatNumber(discount))}</span>
        <span className="text-red-500">تخفیف</span>
      </div>
      <div className="flex items-center gap-x-2">
        <span className="farsi-digits text-xs xs:text-sm text-gray-700">
          {digitsEnToFa(formatNumber(discountedPrice))}
        </span>
        تومان{' '}
      </div>
    </div>
  )
}

export default CartDiscountItem
