import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Combobox } from '@headlessui/react'
import { FaCheck } from 'react-icons/fa'
import { AiOutlineClose } from 'react-icons/ai'
import { FeatureValue, SizeDTO } from '@/services/feature/types'

interface Props {
  sizeList?: SizeDTO[]
  onFeatureSelect: (features: SizeDTO[]) => void
  stateSizeData?: SizeDTO[] | undefined
}

const SizesCombobox: React.FC<Props> = ({ onFeatureSelect, sizeList, stateSizeData }) => {
  const [query, setQuery] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<SizeDTO[]>([]);

  useEffect(() => {
    if (stateSizeData) {
      handleSelectSize(stateSizeData)
    }
  }, [stateSizeData?.length]);

  const filteredFeatures = sizeList && sizeList.length > 0 
    ? query === '' 
      ? sizeList 
      : sizeList.filter(sizeItem => sizeItem.name.toLowerCase().includes(query.toLowerCase())) 
    : [];

  const handleSelectSize = (sizes: SizeDTO[]) => {
    setSelectedSizes(sizes);
    onFeatureSelect(sizes);
  };

  const handleRemoveSize = (item: SizeDTO) => {
    const newSelectedSizes = selectedSizes.filter(size => size.id !== item.id);
    setSelectedSizes(newSelectedSizes);
    onFeatureSelect(newSelectedSizes);
  };
  return (
    <div className="flex items-center gap-2">
      <div className="w-full relative">
        {sizeList && (
          <Combobox multiple value={selectedSizes} onChange={handleSelectSize}>
            <div
              id="parent"
              className="border min-h-[36px] py-1 px-1 relative flex flex-col bg-white border-gray-200 rounded-md"
            >
              <div id="childrens" className=" flex-wrap flex gap-2">
                {selectedSizes.map((item) => (
                  <div key={item.id} className="flex custom-z4 items-center bg-gray-100 rounded-md px-2 py-1">
                    <span className="text-gray-900  text-sm whitespace-nowrap">{item.name}</span>
                    <button type="button" className="" onClick={() => handleRemoveSize(item)}>
                      <AiOutlineClose className="mr-1  text-gray-400 hover:text-gray-900" size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <Combobox.Button className={`flex gap-2 custom-z2 `}>
                <Combobox.Input
                  className={`w-full absolute h-[28px] right-0 top-0.5 py-0 border-b  placeholder:text-sm   rounded-md border-transparent focus:border-transparent focus:ring-0   text-gray-900 ${
                    selectedSizes.length > 0 ? 'placeholder:text-white' : ''
                  }`}
                  displayValue={(feature: FeatureValue) => feature?.name}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="انتخاب مشخصه"
                  id="inputFeature"
                />
              </Combobox.Button>
            </div>

            <Combobox.Options className="absolute z-[60] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredFeatures.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">هیچ سایزی یافت نشد.</div>
              ) : (
                filteredFeatures.map((size) => (
                  <Combobox.Option
                    key={size.id}
                    value={size}
                    className={({ active }) =>
                      `relative cursor-pointer select-none text-start py-2 pl-10 pr-4 ${
                        active ? 'bg-gray-100 text-white' : 'text-gray-900'
                      }`
                    }
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {size.name}
                        </span>
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
        )}
      </div>
    </div>
  )
}

export default SizesCombobox
