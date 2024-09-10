import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

import { useChangeRoute, useDebounce, useDisclosure } from '@/hooks'

import { ArrowDown, Close, Search, Toman } from '@/icons'
import { CustomCheckbox } from '@/components/ui'

import { IBrand, QueryParams } from '@/types'
import PriceRange from './PriceRange'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { digitsEnToFa, digitsFaToEn } from '@persian-tools/persian-tools'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { useGetBrandsQuery } from '@/services'

interface Props {
  mainMaxPrice: number | undefined
  mainMinPrice: number | undefined
  onClose?: () => void
}
const ProductFilterControls: React.FC<Props> = (props) => {
  // ? Props
  const { mainMaxPrice, mainMinPrice, onClose } = props

  // ? Assets
  const { query, push } = useRouter()
  const inStockQuery = !!query?.inStock || false
  const discountQuery = !!query?.discount || false
  const minPriceQuery = query.price && +query.price.toString().split('-')[0]
  const maxPriceQuery = query.price && +query.price.toString().split('-')[1]
  const pageQuery = Number(query?.page)
  const [isOpenPrice, setIsOpenPrice] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const changeRoute = useChangeRoute()

  // ? State
  const [price, setPrice] = useState({
    minPrice: mainMinPrice,
    maxPrice: mainMaxPrice,
  })

  // ? Debounced Values
  const debouncedMinPrice = useDebounce(price.minPrice!, 1200)
  const debouncedMaxPrice = useDebounce(price.maxPrice!, 1200)

  // ? Handlers
  const handleChangeRoute = (newQueries: QueryParams) => {
    changeRoute({
      ...query,
      page: pageQuery && pageQuery > 1 ? 1 : '',
      ...newQueries,
    })
  }

  useEffect(() => {
    handleChangeRoute({ minPrice: debouncedMinPrice, maxPrice: debouncedMaxPrice })
  }, [debouncedMinPrice, debouncedMaxPrice])

  const handlefilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target
    var numValue  =Number(digitsFaToEn(value))
    if (type === 'checkbox') handleChangeRoute({ [name]: checked })
    if (type === 'text') setPrice((prev) => ({ ...prev, [name]: +numValue }))
  }

  const handleResetFilters = () => {
    handleChangeRoute({ inStock: '', discount: '', price: '' })
    onClose?.()
  }

  const canReset =
    inStockQuery || discountQuery || mainMinPrice !== debouncedMinPrice || mainMaxPrice !== debouncedMaxPrice

  //*   Close Modal on Change Filter
  useEffect(() => {
    onClose?.()
  }, [discountQuery, inStockQuery, debouncedMaxPrice, debouncedMinPrice])

  //*  Change prices when mainMaxPrice and mainMinPrice of category changes
  useEffect(() => {
    if (minPriceQuery && maxPriceQuery)
      setPrice({
        minPrice: minPriceQuery,
        maxPrice: maxPriceQuery,
      })
    else {
      setPrice({
        minPrice: mainMinPrice,
        maxPrice: mainMaxPrice,
      })
    }
  }, [minPriceQuery, maxPriceQuery])

  //search filter
  //..................
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredBrands, setFilteredBrands] = useState<IBrand[]>([])
  // ? brand Query
  const { data } = useGetBrandsQuery({
    page: 1,
    pageSize: 15,
  })

  const [selectedBrands, setSelectedBrands] = useState<string[]>([])

  useEffect(() => {
    if (data?.data?.data) {
      setFilteredBrands(data.data.data)
    }
  }, [data])

  useEffect(() => {
    if (data?.data?.data) {
      const filtered = data.data.data.filter((brand) => brand.name.toLowerCase().includes(searchTerm.toLowerCase()))
      setFilteredBrands(filtered)
    }
  }, [searchTerm, data])

  const handleBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target

    if (checked) {
      setSelectedBrands([...selectedBrands, value])
    } else {
      setSelectedBrands(selectedBrands.filter((brand) => brand !== value))
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  useEffect(() => {
    if (selectedBrands.length > 0) {
      handleChangeRoute({
        brands: selectedBrands.length ? selectedBrands.join(',') : '',
      });
    } else {
      // push('/products'); // Resets the URL
    }
  }, [selectedBrands]);
  

  // ? Render(s)
  return (
    <>
      <div className="flex justify-between border py-1 px-2 w-full rounded-lg mb-5 -mt-4">
        <CustomCheckbox name="inStock" checked={inStockQuery} onChange={handlefilter} label="فقط کالاهای موجود" />
      </div>

      {/* <CustomCheckbox name="discount" checked={discountQuery} onChange={handlefilter} label="فقط کالاهای فروش ویژه" /> */}
      {/* price filter */}
      <div className="border px-4 pt-4 pb-1 rounded-lg mb-5">
        <Menu>
          {({ open }) => (
            <>
              <Menu.Button
                className="flex justify-between w-full py-4 mb-3 bg-gray-100 px-5 rounded-lg"
                onClick={() => setIsOpenPrice(!isOpenPrice)}
              >
                قیمت
                {isOpenPrice ? <IoIosArrowUp className="icon" /> : <IoIosArrowDown className="icon" />}
              </Menu.Button>

              <Transition
                show={isOpenPrice}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items static className="">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <div>
                          {/* price filter */}
                          <div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center justify-between gap-x-1">
                                <span className="text-base">از</span>
                                <input
                                  type="text"
                                  className="w-3/4 border-b border-gray-200 pt-3 text-xl outline-none rounded-md text-center"
                                  style={{ direction: 'ltr' }}
                                  name="minPrice"
                                  value={digitsEnToFa(price.minPrice ?? 0)}
                                  onChange={handlefilter}
                                />
                              </div>
                              <div className="flex items-center justify-between gap-x-1">
                                <span className="text-base pr-3.5">تا</span>
                                <input
                                  type="text"
                                  className="w-3/4 border-b pt-3 border-gray-200 px-1 rounded-md text-center text-xl outline-none"
                                  style={{ direction: 'ltr' }}
                                  name="maxPrice"
                                  value={digitsEnToFa(price.maxPrice ?? 0)}
                                  onChange={handlefilter}
                                />
                              </div>
                            </div>
                            {/* <PriceRange
                              minPrice={price.minPrice}
                              maxPrice={price.maxPrice}
                              onPriceChange={(newPrice) => setPrice(newPrice)}
                            /> */}
                          </div>
                          {/* <div className="py-4">
                            <span className="font-medium text-gray-700">محدوده قیمت</span>
                            <div className="flex items-center justify-between gap-x-1">
                              <span className="text-base">از</span>
                              <input
                                type="number"
                                className="w-3/4 border-b pt-3 border-gray-200 px-1 rounded-md text-center text-xl outline-none"                                style={{ direction: 'ltr' }}
                                name="minPrice"
                                value={digitsEnToFa(price.minPrice ?? 0)}
                                onChange={handlefilter}
                              />
                             تومان
                            </div>
                            <div className="mb-4 mt-2 flex items-center justify-between gap-x-1">
                              <span className="text-base">تا</span>
                              <input
                                type="number"
                                className="w-3/4 border-b border-gray-200 px-1 text-left text-xl outline-none"
                                style={{ direction: 'ltr' }}
                                name="maxPrice"
                                value={digitsEnToFa(price.maxPrice ?? 0)}
                                onChange={handlefilter}
                              />
                              تومان{' '}
                            </div>
                          </div> */}
                        </div>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>
      </div>
      {/* brand filter */}
      <div className="border px-4 pt-4 pb-1 rounded-lg">
        <Menu>
          {({ open }) => (
            <>
              <Menu.Button
                className="flex justify-between w-full py-4 mb-3 bg-gray-100 px-5 rounded-lg"
                onClick={() => setIsOpen(!isOpen)}
              >
                برند
                {isOpen ? <IoIosArrowUp className="icon" /> : <IoIosArrowDown className="icon" />}
              </Menu.Button>

              <Transition
                show={isOpen}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items static className="">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <div>
                          <div className="my-3 flex flex-row-reverse rounded-xl border">
                            <button type="button" className="p-2.5" onClick={() => setSearchTerm('')}>
                              <Close className="h-4 w-4 text-gray-700 md:h-5 md:w-5" />
                            </button>
                            <input
                              type="text"
                              placeholder="جستجو در برند"
                              className="input grow bg-transparent p-1 text-right outline-none border-none placeholder:text-sm placeholder:font-light placeholder:pr-1.5"
                              value={searchTerm}
                              onChange={handleSearchChange}
                            />
                          </div>
                          <div className="overflow-auto max-h-[105px]">
                            {filteredBrands.map((brand) => (
                              <div className="mb-1.5 flex justify-between px-4" key={brand.id}>
                                <label className="ml-2">{brand.name}</label>
                                <input
                                  className="bg-gray-200 border-none rounded checked:bg-[#e90089]"
                                  type="checkbox"
                                  value={brand.id}
                                  onChange={handleBrandChange}
                                  checked={selectedBrands.includes(brand.id)}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>
      </div>
    </>
  )
}

export default ProductFilterControls
