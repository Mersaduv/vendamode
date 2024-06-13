import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

import { useChangeRoute, useDebounce, useDisclosure } from '@/hooks'

import { ArrowDown, Close, Search, Toman } from '@/icons'
import { CustomCheckbox } from '@/components/ui'

import { QueryParams } from '@/types'
import PriceRange from './PriceRange'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { digitsEnToFa } from '@persian-tools/persian-tools'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'

interface Props {
  mainMaxPrice: number | undefined
  mainMinPrice: number | undefined
  onClose?: () => void
}
const ProductFilterControls: React.FC<Props> = (props) => {
  // ? Props
  const { mainMaxPrice, mainMinPrice, onClose } = props

  // ? Assets
  const { query } = useRouter()
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

  const handlefilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target
    if (type === 'checkbox') handleChangeRoute({ [name]: checked })
    if (type === 'number') setPrice((prev) => ({ ...prev, [name]: +value }))
  }

  const handleResetFilters = () => {
    handleChangeRoute({ inStock: '', discount: '', price: '' })
    onClose?.()
  }

  const canReset =
    inStockQuery || discountQuery || mainMinPrice !== debouncedMinPrice || mainMaxPrice !== debouncedMaxPrice

  // ? Re-Renders
  //*   Change Route After Debounce
  useEffect(() => {
    if (debouncedMinPrice && mainMinPrice !== debouncedMinPrice)
      handleChangeRoute({
        price: `${debouncedMinPrice}-${debouncedMaxPrice}`,
      })
  }, [debouncedMinPrice])

  useEffect(() => {
    if (debouncedMaxPrice && mainMaxPrice !== debouncedMaxPrice)
      handleChangeRoute({
        price: `${debouncedMinPrice}-${debouncedMaxPrice}`,
      })
  }, [debouncedMaxPrice])

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
  }, [mainMinPrice, mainMaxPrice, minPriceQuery, maxPriceQuery])

  //search filter
  const [search, setSearch] = useState('')
  const searchRef = useRef<HTMLInputElement | null>(null)
  const [isShowSearchModal, searchModalHanlders] = useDisclosure()
  const debouncedSearch = useDebounce(search, 1200)

  // ? Search Products Query
  // const { data, ...productQueryProps } = useGetBrandsQuery(
  //   {
  //     search,
  //   },
  //   { skip: !debouncedSearch }
  // )

  // ? Re-Renders
  //* Reset Search
  useEffect(() => {
    if (!isShowSearchModal) {
      setSearch('')
    }
  }, [isShowSearchModal])

  //* Use useEffect to set focus after a delay when the modal is shown
  useEffect(() => {
    if (isShowSearchModal) {
      const timeoutId = setTimeout(() => {
        searchRef.current?.focus()
      }, 100)

      return () => clearTimeout(timeoutId)
    }
  }, [isShowSearchModal])

  // ? Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleRemoveSearch = () => {
    setSearch('')
  }



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
                                  value={price.minPrice}
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
                                  value={price.maxPrice}
                                  onChange={handlefilter}
                                />
                              </div>
                            </div>
                            <PriceRange
                              minPrice={price.minPrice}
                              maxPrice={price.maxPrice}
                              onPriceChange={(newPrice) => setPrice(newPrice)}
                            />
                          </div>

                          {/* brand filter */}
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
                            <button type="button" className="p-2.5" onClick={handleRemoveSearch}>
                              <Close className="h-4 w-4 text-gray-700 md:h-5 md:w-5" />
                            </button>
                            <input
                              type="text"
                              placeholder="جستجو در برند"
                              className="input grow bg-transparent p-1 text-right outline-none border-none placeholder:text-sm placeholder:font-light placeholder:pr-1.5"
                              ref={searchRef}
                              value={search}
                              onChange={handleChange}
                            />
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
