import { Dispatch, SetStateAction, useState } from 'react'
import { Combobox } from '@headlessui/react'
import { FaCheck } from 'react-icons/fa'
import { ArrowRight2 } from '@/icons'
import { IProductIsFake, IProductStatus } from '@/types'

interface Props {
  selectedStatus: IProductIsFake | null
  setSelectedStatus: Dispatch<SetStateAction<IProductIsFake | null>>
}

const statusOptions: IProductIsFake[] = [
  { id: 'false', name: 'محصول اصل' },
  { id: 'true', name: 'محصول غیر اصل' }
];


const IsFakeCombobox: React.FC<Props> = ({ selectedStatus, setSelectedStatus }) => {
  const [query, setQuery] = useState('')

  const filteredStatuses =
    query === '' ? statusOptions : statusOptions.filter((status) => status.name.toLowerCase().includes(query.toLowerCase()))

  const handleSelect = (status: IProductIsFake) => {
    setSelectedStatus(status)
  }

  return (
    <div className="md:w-[318px] relative">
      <Combobox value={selectedStatus} onChange={handleSelect}>
        <div className="relative">
          <Combobox.Button className="absolute w-full top-1 -left-1 flex items-center justify-end pr-2">
            <ArrowRight2 className="text-4xl text-gray-400  rotate-90 ml-1 -mt-0.5" />
          </Combobox.Button>
          <Combobox.Input
            className="w-full rounded-md border border-gray-300 py-1.5 pr-8 pl-3 text-gray-900"
            displayValue={(status: IProductStatus) => status?.name}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="انتخاب کنید"
          />
        </div>
        <Combobox.Options className="absolute z-[60] mt-1 max-h-60 w-full overflow-auto  rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {filteredStatuses.length === 0 && query !== '' ? (
            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">هیچ وضعیتی یافت نشد.</div>
          ) : (
            filteredStatuses.map((status) => (
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

export default IsFakeCombobox
