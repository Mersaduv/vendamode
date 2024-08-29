import { Dispatch, SetStateAction, useState } from 'react'
import { Combobox } from '@headlessui/react'
import { ICategory } from '@/types'
import { FaCheck } from 'react-icons/fa'
import { ArrowRight2 } from '@/icons'

interface Props {
  categories: ICategory[]
  onCategorySelect: (category: ICategory) => void
  selectedCategory: ICategory | null
  setSelectedCategory: Dispatch<SetStateAction<ICategory | null>>
  setParentCategory: Dispatch<SetStateAction<ICategory | undefined>>
}

const SelectParentCategoryCombobox: React.FC<Props> = ({
  categories,
  onCategorySelect,
  selectedCategory,
  setSelectedCategory,
  setParentCategory,
}) => {
  const [query, setQuery] = useState('')

  const filteredCategories =
    query === ''
      ? categories
      : categories.filter((category) => category.name.toLowerCase().includes(query.toLowerCase()))

  const handleSelect = (category: ICategory | null) => {
    setSelectedCategory(category)
    if (category && category.id !== 'default') {
      onCategorySelect(category)
      setParentCategory(category)
    } else {
      setParentCategory(undefined)
    }
  }

  // گزینه پیش فرض
  const defaultCategory: ICategory = { id: 'default', name: 'انتخاب کنید' } as ICategory

  // local component
  const CategoryOptions: React.FC<{ categories: ICategory[] }> = ({ categories }) => {
    return (
      <>
        {categories.map((category) => (
          <div key={category.id}>
            <Combobox.Option
              value={category}
              className={({ active }) =>
                `relative cursor-pointer text-start select-none py-2 pl-4 pr-4 ${
                  active ? 'bg-gray-100 text-white' : 'text-gray-900'
                }`
              }
            >
              {({ selected, active }) => (
                <>
                  <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{category.name}</span>
                  {selected && (
                    <span
                      className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                        active ? 'text-[#e90089]' : 'text-[#e90089]'
                      }`}
                    >
                      <FaCheck className="h-4 w-4" />
                    </span>
                  )}
                </>
              )}
            </Combobox.Option>
            {category.childCategories && category.childCategories.length > 0 && (
              <div>
                <CategoryOptions categories={category.childCategories} />
              </div>
            )}
          </div>
        ))}
      </>
    )
  }

  return (
    <div className="relative w-full">
      <Combobox value={selectedCategory} onChange={handleSelect}>
        <div className="relative">
          <Combobox.Button className="absolute w-full top-1 -left-1 flex items-center justify-end pr-2">
            <ArrowRight2 className="text-4xl text-gray-400 rotate-90 ml-1 -mt-0.5" />
          </Combobox.Button>
          <Combobox.Input
            className="w-full rounded-md border border-gray-300 py-1.5 pr-4 pl-3 text-gray-900"
            displayValue={(category: ICategory) => category?.name || defaultCategory.name}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="انتخاب کنید"
          />
        </div>
        <Combobox.Options className="absolute z-[60] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {filteredCategories.length === 0 && query !== '' ? (
            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">هیچ دسته بندی یافت نشد.</div>
          ) : (
            <CategoryOptions categories={[defaultCategory, ...filteredCategories]} />
          )}
        </Combobox.Options>
      </Combobox>
    </div>
  )
}

export default SelectParentCategoryCombobox
