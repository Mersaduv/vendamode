import { Cart } from '@/icons'

import { formatNumber } from '@/utils'

// import { useAppSelector } from '@/hooks'

export default function CartIconBadge() {
  // ? Store
  // const { totalItems } = useAppSelector((state) => state.cart)

  // ? Render(s)
  return (
    <div className="relative">
      <span className="farsi-digits absolute bottom-3.5 left-5 h-5 w-5 rounded-md bg-[#e90089] p-0.5 text-center text-xs text-white outline outline-2">
        {formatNumber(12)}
      </span>

      <Cart className="icon h-7 w-7" />
    </div>
  )
}
