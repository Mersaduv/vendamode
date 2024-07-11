import type { NextPage } from 'next'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import { useDisclosure, useChangeRoute } from '@/hooks'
import { ICategory, IProduct } from '@/types'
import { DashboardLayout } from '@/components/Layouts'
import { useGetCategoriesTreeQuery, useGetProductsQuery } from '@/services'
import { DataStateDisplay } from '@/components/shared'
import { ProductSkeleton } from '@/components/skeleton'
import { EmptyCustomList } from '@/components/emptyList'
import { MenuAlt1 } from 'heroicons-react'
import { HiMenuAlt1 } from 'react-icons/hi'
import { digitsEnToFa } from '@persian-tools/persian-tools'
import { Menu, Tab, Transition } from '@headlessui/react'

interface SelectedCategories {
  categorySelected?: ICategory
}
const initialSelectedCategories: SelectedCategories = {}
const extractChildCategories = (category: ICategory): ICategory[] => {
  let childCategories: ICategory[] = []
  if (category.childCategories && category.childCategories.length > 0) {
    category.childCategories.forEach((child) => {
      childCategories.push(child)
      childCategories = childCategories.concat(extractChildCategories(child))
    })
  }
  return childCategories
}
interface LocalProps {
  product : IProduct
}
const Products: NextPage = () => {
  // ? Assets
  const { query, push } = useRouter()
  const page = query.page ? +query.page : 1
  const category = (query.category as string) ?? ''

  // ? state
  const [selectedCategories, setSelectedCategories] = useState<SelectedCategories>(initialSelectedCategories)
  const [allCategories, setAllCategories] = useState<ICategory[]>([])
  const [selectedProducts, setSelectedProducts] = useState<IProduct[]>([])
  const [deleteInfo, setDeleteInfo] = useState({
    id: '',
  })
  
  // ? Get Categories Query
  const { categoriesData } = useGetCategoriesTreeQuery(undefined, {
    selectFromResult: ({ data }) => ({
      categoriesData: data?.data,
    }),
  })

  // ? Querirs
  //*    Get Products Data
  const { data, productData, ...productsQueryProps } = useGetProductsQuery(query, {
    selectFromResult: (data) => ({
      productData: data?.data?.data?.pagination.data,
      data,
    }),
  })

  useEffect(() => {
    if (categoriesData) {
      let allCats: ICategory[] = []
      categoriesData.forEach((category: ICategory) => {
        allCats.push(category)
        allCats = allCats.concat(extractChildCategories(category))
      })
      setAllCategories(allCats)
    }
  }, [categoriesData])

  // ? Handlers
  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryId = event.target.value
    const selectedCategory = categoriesData?.find((cat) => cat.id === selectedCategoryId)
    setSelectedCategories({ categorySelected: selectedCategory })
  }

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      if (productData != null) {
        setSelectedProducts(productData.map((product) => product))
      }
    } else {
      setSelectedProducts([])
    }
  }

  const handleSelectProduct = (product: IProduct) => {
    setSelectedProducts((prevSelected) => {
      if (prevSelected.includes(product)) {
        return prevSelected.filter((selectedProduct) => selectedProduct !== product)
      } else {
        return [...prevSelected, product]
      }
    })
  }

  function handleIsChangeable({ productFeatureInfo, productSizeInfo }: IProduct) {
    let isChangeable = false
    if (productFeatureInfo?.colorDTOs?.length! > 1) {
      isChangeable = true
    }

    productFeatureInfo?.featureValueInfos?.forEach((featureValueInfo) => {
      if (featureValueInfo?.value?.length! > 1) {
        isChangeable = true
      }
    })

    if (productSizeInfo?.columns?.length! > 1) {
      isChangeable = true
    }
    return isChangeable
  }

  useEffect(() => {
    if (selectedProducts) {
      console.log(selectedProducts, 'one by one dynamic')
    }
  }, [selectedProducts])

  return (
    <main>
      <Head>
        <title>مدیریت | محصولات</title>
      </Head>
      <DashboardLayout>
        <div className="w-full  mt-14 mb-5  px-8 lg:px-14">
          <div className=" bg-white p-6 rounded-lg shadow-other">
            <div className="bg-[#e90089] cursor-pointer hover:bg-[#c70174] w-fit px-3 py-3 rounded-xl text-white text-sm">
              همه محصولات
            </div>
          </div>
        </div>
        <section className=" w-full px-8 lg:px-14">
          <div className="bg-white rounded-lg shadow-other">
            {/* filter control  */}
            <div className="flex gap-6">
              {/* first */}
              <div className="flex border w-fit rounded-lg">
                <select className="w-44 text-sm focu appearance-none border-none rounded-r-lg" name="انتخاب " id="">
                  <option className="appearance-none text-sm" value="">
                    کارهای گروهی
                  </option>
                  <option value="2">انتقال به زباله دان</option>
                  <option value="3">فعال کردن</option>
                  <option value="3">غیر فعال کردن</option>
                </select>
                <div className="bg-gray-100  cursor-pointer hover:bg-gray-200 mr-[1px] rounded-l-md text-sm flex justify-center items-center w-14 ">
                  اجرا
                </div>
              </div>
              {/* category filter */}
              <div className="flex border w-fit rounded-lg">
                <select
                  className="w-44 text-sm focus:outline-none appearance-none border-none rounded-r-lg"
                  name="انتخاب"
                  id=""
                  onChange={handleCategoryChange}
                >
                  <option className="appearance-none text-sm" value="">
                    همه دسته بندی ها
                  </option>
                  {allCategories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="bg-gray-100 hover:bg-gray-200 mr-[1px] rounded-l-md text-sm flex justify-center cursor-pointer items-center w-14 ">
                  صافی
                </div>
              </div>
            </div>
            {/* tab changed   */}
            <div>
              <table className="w-full">
                <thead className="bg-sky-300">
                  <tr>
                    <th className="text-sm py-3 px-2 pr-3 font-normal w-[1%] text-center">
                      <input
                        className="appearance-none checked:bg-[#e90089] border-none focus:ring-offset-0 focus:outline-offset-0 focus:outline-0 focus:ring-0 rounded-md text-xl w-4 h-4"
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={selectedProducts.length === productData?.length}
                      />
                    </th>
                    <th className="text-sm py-3 px-2 font-normal w-[70px] text-start"></th>
                    <th className="text-sm py-3 px-2 text-gray-600 font-normal w-[150px] text-start">نام محصول</th>
                    <th className="text-sm py-3 px-2 text-gray-600 font-normal">کد</th>
                    <th className="text-sm py-3 px-2 text-gray-600 font-normal w-[150px]">دسته بندی</th>
                    <th className="text-sm py-3 px-2 text-gray-600 font-normal">نوع</th>
                    <th className="text-sm py-3 px-2 text-gray-600 font-normal">تعداد</th>
                    <th className="text-sm py-3 px-2 text-gray-600 font-normal">فروشنده</th>
                    <th className="text-sm py-3 px-2 text-gray-600 font-normal">وضعیت</th>
                    <th className="text-sm py-3 px-2 text-gray-600 font-normal">عملیات</th>
                  </tr>{' '}
                </thead>
                <tbody>
                  {productData &&
                    productData.map((product, index) => (
                      <tr key={product.id} className={`h-16 border-b ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                        <td className="text-sm py-3 px-2 pr-3 font-normal w-[1%] text-center">
                          <input
                            className="appearance-none border border-gray-300 checked:bg-[#e90089] focus:ring-offset-0 focus:outline-offset-0 focus:outline-0 focus:ring-0 rounded-md text-xl w-4 h-4"
                            type="checkbox"
                            checked={selectedProducts.includes(product)}
                            onChange={() => handleSelectProduct(product)}
                          />
                        </td>
                        <td>
                          <img className="w-[50px] h-[50px] rounded" src={product.mainImageSrc.imageUrl} alt="p-img" />
                        </td>
                        <td className="text-sm text-gray-600">
                          <Link className="text-sky-500" href={`/products/${product.slug}`}>
                            {product.title}
                          </Link>
                        </td>
                        <td className="text-center text-sm text-gray-600">{digitsEnToFa(product.code)}</td>
                        <td className="text-sm text-gray-600 text-center">{product.parentCategories.category.name}</td>
                        <td className="text-center text-sm text-gray-600">
                          {handleIsChangeable(product) ? 'متغیر' : 'ساده'}
                        </td>
                        <td className="text-center text-sm text-gray-600">
                          {handleIsChangeable(product) ? '✓' : digitsEnToFa('1')}
                        </td>
                        <td className="text-center text-sm text-gray-600">وندامد</td>
                        <td className="text-center">
                          {product.isActive ? (
                            <span className="text-sm text-green-500">فعال</span>
                          ) : (
                            <span className="text-sm text-red-500">غیر فعال</span>
                          )}
                        </td>
                        <td className="text-center text-sm text-gray-600">
                          {/* <div className="w-full flex justify-center items-center">
                            <span className="text-2xl hover:bg-gray-300 cursor-pointer  bg-gray-200 text-gray-700 p-1 pb-1.5 px-1.5 h-8 flex justify-center items-center rounded-md">
                              :
                            </span>
                          </div> */}
                          <DropDown product={product}/>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </DashboardLayout>
    </main>
  )
}
// ? Local Components
const DropDown = ({product} : LocalProps) => (
  <Menu as="div" className="dropdown">
    <Menu.Button className="">
      <div className="w-full flex justify-center items-center">
        <span className="text-2xl hover:bg-gray-300 cursor-pointer  bg-gray-200 text-gray-700 p-1 pb-1.5 px-1.5 h-8 flex justify-center items-center rounded-md">
          :
        </span>
      </div>
    </Menu.Button>

    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <Menu.Items className="dropdown__items w-32 ">
        <Menu.Item>
          <Link href={`/admin/products/edit/${product.id}`} className="flex justify-start gap-x-2 px-3 py-2 hover:bg-gray-100 w-full">
            <span>ویرایش</span>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <button onClick={() => handleDelete(product.id)} className="flex justify-start gap-x-2 px-3 py-2 hover:bg-gray-100 w-full">
            <span>زباله دان</span>
          </button>
        </Menu.Item>
      </Menu.Items>
    </Transition>
  </Menu>
)
export default dynamic(() => Promise.resolve(Products), { ssr: false })
