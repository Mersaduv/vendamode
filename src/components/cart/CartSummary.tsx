import { formatNumber } from '@/utils'

import { Button } from '@/components/ui'
import { Toman, TomanRed } from '@/icons'

import { useAppSelector } from '@/hooks'
import { digitsEnToFa } from '@persian-tools/persian-tools'

interface Props {
  address?: boolean
  cart?: boolean
  handleRoute?: () => void
}

const CartSummary: React.FC<Props> = (props) => {
  // ? Porps
  const { handleRoute, cart, address } = props

  // ? Store
  const { totalItems, totalPrice, totalDiscount } = useAppSelector((state) => state.cart)

  // ? Render(s)
  return (
    <div className=" mb-[90px] space-y-5 px-4 py-2  md:h-fit md:py-4">
      {/* total cart price */}
      <div className="flex justify-between  items-start gap-1 pb-2">
        <img className="w-4 h-4 mt-0.5" src="/images/icons/0002.png" alt="warning" />
        <div className="text-sm text-gray-500 font-normal">
          هزینه این سفارش هنوز پرداخت نشده و در صورت اتمام موجودی ، کالا ها از سبد خرید حذف میشود
        </div>
      </div>

      {address && (
        <div className="flex justify-between">
          <span className="text-sm text-gray-500 font-normal">هزینه ارسال</span>
          <div className="flex-center">وابسته به آدرس </div>
        </div>
      )}
      <div className="flex justify-between">
        <span className="text-sm text-gray-500 font-normal">جمع مبلغ سبد خرید</span>
        <div className="flex-center gap-1">
          <span className="farsi-digits text-sm">{digitsEnToFa(formatNumber(totalPrice - totalDiscount))}</span>
          تومان{' '}
        </div>
      </div>
      {address && (
        <Button onClick={handleRoute} className="hidden w-full md:block hover:text-gray-800">
          تایید اطلاعات و ادامه
        </Button>
      )}
      {cart && (
        <Button onClick={handleRoute} className="hidden w-full md:block hover:text-gray-800">
          ثبت و ادامه
        </Button>
      )}
    </div>
  )
}

export default CartSummary
