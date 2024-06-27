import { setTempColor } from '@/store'

import { useAppDispatch, useAppSelector } from '@/hooks'

import { Check } from '@/icons'
import { IColorDTO } from '@/types'


interface Props {
  colors: IColorDTO[]
}

const ProductColorSelector: React.FC<Props> = (props) => {
  // ? Props
  const { colors } = props

  // ? Assets
  const dispatch = useAppDispatch()

  // ? Store
  const { tempColor } = useAppSelector((state) => state.cart)

  // ? Render(s)
  return (
      <div className="flex sm:justify-center items-center gap-4">
        {colors.map((item) => (
          <div
            key={item.id}
            onClick={() => dispatch(setTempColor(item))}
            className={` flex cursor-pointer  ${
              tempColor?.id === item.id ? 'border-b-2 border-red-600' : ''
            }`}
          >
            <div className="inline-block mb-1 w-6 h-6 rounded-md shadow-3xl" style={{ background: item.hexCode }}>

            </div>
          </div>
        ))}
      </div>
  )
}

export default ProductColorSelector
