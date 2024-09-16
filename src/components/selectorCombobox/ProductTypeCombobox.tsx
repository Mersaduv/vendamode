import { Dispatch, SetStateAction, useState } from 'react'
import { Combobox } from '@headlessui/react'
import { FaCheck } from 'react-icons/fa'
import { ArrowRight2 } from '@/icons'
import {IProductType } from '@/types'

interface Props {
  selectedProductType: IProductType | null
  setSelectedProductType: Dispatch<SetStateAction<IProductType | null>>
}

const typesOptions: IProductType[] = [
  { id: 'Product', name: 'کالا برای فروش' },
  { id: 'ProductFile', name: 'فایل برای فروش' }
];


const ProductTypeCombobox: React.FC<Props> = ({ selectedProductType, setSelectedProductType }) => {
  const [query, setQuery] = useState('')

  const filteredProductTypes =
    query === '' ? typesOptions : typesOptions.filter((type) => type.name.toLowerCase().includes(query.toLowerCase()))

  const handleSelect = (status: IProductType) => {
    setSelectedProductType(status)
  }

  return (
    <div className="w-full h-[44px] relative">
      <Combobox value={selectedProductType} onChange={handleSelect}>
        <div className="relative">
          <Combobox.Button className="absolute w-full top-1 -left-1 flex items-center justify-end pr-2">
            <ArrowRight2 className="text-4xl text-gray-400  rotate-90 ml-1 -mt-0.5" />
          </Combobox.Button>
          <Combobox.Input
            className="w-full  h-[44px] rounded-md rounded-r-none border border-gray-300 py-1.5 pr-8 pl-3 text-gray-900"
            displayValue={(status: IProductType) => status?.name}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="انتخاب کنید"
          />
        </div>
        <Combobox.Options className="absolute z-[60] mt-1 max-h-60 w-full overflow-auto  rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {filteredProductTypes.length === 0 && query !== '' ? (
            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">هیچ وضعیتی یافت نشد.</div>
          ) : (
            filteredProductTypes.map((status) => (
              <Combobox.Option
                key={status.id}
                value={status}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-gray-100 text-white' : 'text-gray-900'
                  }`
                }
              >
                {({ selected, active }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{status.name}</span>
                    {selected ? (
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                          active ? 'text-[#e90089]' : 'text-[#e90089]'
                        }`}
                      >
                        <FaCheck className="h-4 w-4" />
                      </span>
                    ) : null}
                  </>
                )}
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </Combobox>
    </div>
  )
}

export default ProductTypeCombobox
