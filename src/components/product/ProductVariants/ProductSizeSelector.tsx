import { setTempSize } from '@/store'

import { formatNumber } from '@/utils'

import { useAppDispatch, useAppSelector } from '@/hooks'

interface Props {
  sizes: SizeDTO[]
}

const ProductSizeSelector: React.FC<Props> = (props) => {
  // ? Props
  const { sizes } = props

  // ? Assets
  const dispatch = useAppDispatch()

  // ? Store
  const { tempSize } = useAppSelector((state) => state.cart)

  // ? Render(s)
  return (
    <div className="flex gap-2.5">
      {sizes.map((item) => (
        <button
          type="button"
          key={item.id}
          onClick={() => dispatch(setTempSize(item))}
          className={`border cursor-pointer  font-semibold flex pt-0.5 items-center justify-center rounded-md text-gray-500 border-gray-400 w-8 h-7  ${
            tempSize?.id === item.id ? 'bg-[#686868] text-white' : ''
          }`}
        >
          {item.name}
        </button>
      ))}
    </div>
  )
}

export default ProductSizeSelector
