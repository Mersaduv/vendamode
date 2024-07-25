import { useAppDispatch, useAppSelector } from '@/hooks'
import { setTempObjectValue } from '@/store'
import { IObjectValue } from '@/types'

interface Props {
  objectValues: IObjectValue[]
}
const ProductObjectValueSelector: React.FC<Props> = (props) => {
  const { objectValues } = props

  const dispatch = useAppDispatch()
  const { tempObjectValue } = useAppSelector((state) => state.cart)

  const handleClicked = (
    val: {
      id: string
      name: string
    },
    id: string,
    title: string
  ) => {
    dispatch(setTempObjectValue({ id, title, value: [val] } as IObjectValue))
  }

  return (
    <div className="flex gap-2.5">
      {objectValues.map((item) => (
        <div className="flex items-center gap-2.5" key={item.id}>
          {item.value?.map((val) => (
            <button
              type="button"
              onClick={() => handleClicked(val, item.id, item.title)}
              key={val.id}
              className={`border cursor-pointer font-medium flex pt-0.5 items-center justify-center rounded-md text-gray-500 border-gray-400 w-16 h-8 ${
                tempObjectValue?.value?.[0]?.id === val.id ? 'bg-[#686868] text-white' : ''
              }`}
            >
              {val.name}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}

export default ProductObjectValueSelector
