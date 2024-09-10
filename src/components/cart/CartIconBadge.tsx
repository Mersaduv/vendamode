import { useAppSelector } from '@/hooks'
import { Cart } from '@/icons'

import { formatNumber } from '@/utils'
import { digitsArToFa, digitsEnToFa } from '@persian-tools/persian-tools'

// import { useAppSelector } from '@/hooks'

export default function CartIconBadge() {
  // ? Store
  const { totalItems } = useAppSelector((state) => state.cart)

  // ? Render(s)
  return (
    <div className="relative">
      {totalItems === 0 ? null : (
        <span className="farsi-digits absolute bottom-3.5 left-5 h-5 w-5 rounded-md bg-[#e90089] p-0.5 text-center text-xs text-white outline outline-2">
          {digitsEnToFa(totalItems)}
        </span>
      )}

      <Cart className="icon h-6 w-6 text-gray-500" />
    </div>
  )
}
