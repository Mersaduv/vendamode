import type { NextPage } from 'next'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import { useDisclosure, useChangeRoute, useAppSelector } from '@/hooks'
import { ICategory, IProduct } from '@/types'
import { DashboardLayout } from '@/components/Layouts'
import {
  useBulkUpdateProductMutation,
  useDeleteProductMutation,
  useGetCategoriesTreeQuery,
  useGetProductsQuery,
} from '@/services'
import { DataStateDisplay, HandleResponse } from '@/components/shared'
import { ProductSkeleton, TableSkeleton } from '@/components/skeleton'
import { EmptyCustomList } from '@/components/emptyList'
import { MenuAlt1 } from 'heroicons-react'
import { HiMenuAlt1 } from 'react-icons/hi'
import { digitsEnToFa } from '@persian-tools/persian-tools'
import { Menu, Tab, TabGroup, TabList, TabPanel, TabPanels, Transition } from '@headlessui/react'
import { useDispatch } from 'react-redux'
import { setUpdated } from '@/store'
import { ConfirmDeleteModal } from '@/components/modals'
import { LuSearch } from 'react-icons/lu'
import { Pagination } from '@/components/navigation'

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
  product: IProduct
}
const Products: NextPage = () => {
  // ? Assets
  const { query, push } = useRouter()
  const category = (query.category as string) ?? ''
  const dispatch = useDispatch()
  const isUpdated = useAppSelector((state) => state.stateUpdate.isUpdated)
  const featureIds = typeof query.featureIds === 'string' ? query.featureIds.split(',') : undefined
  const featureValueIds = typeof query.featureValueIds === 'string' ? query.featureValueIds.split(',') : undefined
  const sizes = typeof query.sizes === 'string' ? query.sizes.split(',') : undefined
  const brands = typeof query.brands === 'string' ? query.brands.split(',') : undefined

  // ? state
  const [selectedCategories, setSelectedCategories] = useState<SelectedCategories>(initialSelectedCategories)
  const [allCategories, setAllCategories] = useState<ICategory[]>([])
  const [selectedProducts, setSelectedProducts] = useState<IProduct[]>([])
  const [deleteInfo, setDeleteInfo] = useState({
    id: '',
  })
  const [bulkAction, setBulkAction] = useState<string>('')
  const [bulkUpdateProduct] = useBulkUpdateProductMutation()
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined)
  const [selectInStock, setSelectInStock] = useState<string | undefined>(undefined)
  const [selectInStockState, setSelectInStockState] = useState<string | undefined>(undefined)
  const [searchTerm, setSearchTerm] = useState('')

  // ? Get Categories Query
  const { categoriesData } = useGetCategoriesTreeQuery(undefined, {
    selectFromResult: ({ data }) => ({
      categoriesData: data?.data,
    }),
  })

  // ? Querirs
  //* Get Products Data
  const { refetch, data, productData, isError, isFetching, isSuccess } = useGetProductsQuery(
    {
      sortBy: 'LastUpdated',
      pageSize: 6,
      page: query.page ? +query.page : 1,
      categoryId: selectedCategoryId ? selectedCategoryId : undefined,
      inStock: selectInStockState !== undefined ? selectInStockState : undefined,
      search: searchTerm,
      category: category != '' ? category : undefined,
      featureIds: featureIds,
      featureValueIds: featureValueIds,
      sizes: sizes,
      brands: brands,
      isAdmin: true,
    },
    {
      selectFromResult: (data) => ({
        productData: data?.data?.data?.pagination.data,
        data: data.data?.data,
        isError: data.isError,
        isFetching: data.isFetching,
        isSuccess: data.isSuccess,
      }),
    }
  )

  //*    Delete Product
  const [
    deleteProduct,
    {
      isSuccess: isSuccessDelete,
      isError: isErrorDelete,
      error: errorDelete,
      data: dataDelete,
      isLoading: isLoadingDelete,
    },
  ] = useDeleteProductMutation()

  const [isShowConfirmDeleteModal, confirmDeleteModalHandlers] = useDisclosure()

  useEffect(() => {
    if (isUpdated) {
      refetch()
      dispatch(setUpdated(false))
    }
  }, [isUpdated, dispatch, refetch])

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
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleStockChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const stockType: string = event.target.value
    if (stockType === '1' || stockType === '2') {
      setSelectInStock(stockType)
    } else {
      setSelectInStock(undefined)
    }
  }

  const handleInStockClick = () => {
    setSelectInStockState(selectInStock)
    refetch()
  }

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryId = event.target.value
    setSelectedCategory(selectedCategoryId !== '' ? selectedCategoryId : undefined)
  }

  const handleFilterClick = () => {
    setSelectedCategoryId(selectedCategory !== undefined ? selectedCategory : undefined)
  }

  const handleBulkAction = async () => {
    if (bulkAction && selectedProducts.length > 0) {
      const isActive = bulkAction === '2'
      const productIds = selectedProducts.map((product) => product.id)
      await bulkUpdateProduct({ productIds, isActive })
    }
    refetch()
    setSelectedProducts([])
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

  //*   Delete Handlers
  const handleDelete = (id: string) => {
    setDeleteInfo({ id })
    confirmDeleteModalHandlers.open()
  }

  const onCancel = () => {
    setDeleteInfo({ id: '' })
    confirmDeleteModalHandlers.close()
  }

  const onConfirm = () => {
    deleteProduct({ id: deleteInfo.id })
  }

  const onSuccess = () => {
    refetch()
    confirmDeleteModalHandlers.close()
    setDeleteInfo({ id: '' })
  }
  const onError = () => {
    confirmDeleteModalHandlers.close()
    setDeleteInfo({ id: '' })
  }
  return (
    <>
      <ConfirmDeleteModal
        title="محصول"
        isLoading={isLoadingDelete}
        isShow={isShowConfirmDeleteModal}
        onClose={confirmDeleteModalHandlers.close}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
      {/* Handle Delete Response */}
      {(isSuccessDelete || isErrorDelete) && (
        <HandleResponse
          isError={isErrorDelete}
          isSuccess={isSuccessDelete}
          error={errorDelete}
          message={dataDelete?.message}
          onSuccess={onSuccess}
          onError={onError}
        />
      )}
      <main>
        <Head>
          <title>مدیریت | محصولات</title>
        </Head>
        <DashboardLayout>
          <div className="w-full  mt-8 mb-5  px-2 xs:px-8 lg:px-14">
            <div className=" bg-white p-6 rounded-lg shadow-other">
              <div className="bg-[#e90089] cursor-pointer hover:bg-[#c70174] w-fit px-3 py-3 rounded-xl text-white text-sm">
                همه محصولات
              </div>
            </div>
          </div>
          <section id="_adminProducts" className=" w-full px-2 xs:px-8 lg:px-14">
            <div className="bg-white rounded-lg shadow-other">
              {/* filter control  */}
              <div className="flex justify-center gap-x-6 gap-y-2.5 flex-wrap py-4">
                {/* first group work */}
                <div className="flex border w-fit rounded-lg">
                  <select
                    className="w-44 text-sm focu appearance-none border-none rounded-r-lg"
                    name="انتخاب "
                    id=""
                    value={bulkAction}
                    onChange={(e) => setBulkAction(e.target.value)}
                  >
                    <option className="appearance-none text-sm" value="">
                      کارهای گروهی
                    </option>
                    <option value="1">انتقال به زباله دان</option>
                    <option value="2">فعال کردن</option>
                    <option value="3">غیر فعال کردن</option>
                  </select>
                  <div
                    className="bg-gray-100 cursor-pointer hover:bg-gray-200 mr-[1px] rounded-l-md text-sm flex justify-center items-center w-14"
                    onClick={handleBulkAction}
                  >
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
                  <div
                    className="bg-gray-100 hover:bg-gray-200 mr-[1px] rounded-l-md text-sm flex justify-center cursor-pointer items-center w-14"
                    onClick={handleFilterClick}
                  >
                    صافی
                  </div>
                </div>

                {/* stock filter */}
                <div className="flex border w-fit rounded-lg">
                  <select
                    className="w-44 text-sm focus:outline-none appearance-none border-none rounded-r-lg"
                    name="انتخاب"
                    id=""
                    onChange={handleStockChange}
                  >
                    <option className="appearance-none text-sm" value="">
                      فیلتر بر اساس موجودی
                    </option>
                    <option value="1">موجود در انبار</option>
                    <option value="2">پایان موجودی</option>
                  </select>
                  <div
                    onClick={handleInStockClick}
                    className="bg-gray-100 hover:bg-gray-200 mr-[1px] rounded-l-md text-sm flex justify-center cursor-pointer items-center w-14 "
                  >
                    صافی
                  </div>
                </div>
                {/* search filter */}
                <div className="flex border w-fit rounded-lg">
                  <label
                    htmlFor="search"
                    className="bg-gray-100 hover:bg-gray-200 ml-[1px] rounded-r-md flex justify-center cursor-pointer items-center w-14"
                  >
                    <LuSearch className="icon text-gray-500" />
                  </label>
                  <input
                    id="search"
                    type="text"
                    className="w-44 text-sm placeholder:text-center focus:outline-none appearance-none border-none rounded-l-lg"
                    placeholder="جستجو"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
              {/* tab changed  */}
              <div className="relative overflow-x-auto min-h-96">
                {selectedProducts.length > 0 && (
                  <div className="sm:absolute top-3 left-4 pr-4">
                    {digitsEnToFa(selectedProducts.length)} کالا انتخاب شد
                  </div>
                )}
                <Tab.Group>
                  <Tab.List className="flex gap-4 p-2 border-b-2 border-gray-200">
                    <Tab
                      className={({ selected }) =>
                        selected
                          ? 'px-4 py-2 text-sky-500 rounded cursor-pointer text-sm'
                          : 'px-4 py-2 hover:text-sky-500 rounded cursor-pointer text-sm'
                      }
                    >
                      همه ({digitsEnToFa(productData?.length ?? 0)})
                    </Tab>
                    <Tab
                      className={({ selected }) =>
                        selected
                          ? 'px-4 py-2 text-sky-500 rounded cursor-pointer text-sm'
                          : 'px-4 py-2 hover:text-sky-500 rounded cursor-pointer text-sm'
                      }
                    >
                      فعال ({digitsEnToFa(productData?.filter((product) => product.isActive).length ?? 0)})
                    </Tab>
                    <Tab
                      className={({ selected }) =>
                        selected
                          ? 'px-4 py-2 text-sky-500 rounded cursor-pointer text-sm'
                          : 'px-4 py-2 hover:text-sky-500 rounded cursor-pointer text-sm'
                      }
                    >
                      غیرفعال ({digitsEnToFa(productData?.filter((product) => !product.isActive).length ?? 0)})
                    </Tab>

                    <Tab
                      className={({ selected }) =>
                        selected
                          ? 'px-4 py-2 text-sky-500 rounded cursor-pointer text-sm'
                          : 'px-4 py-2 hover:text-sky-500 rounded cursor-pointer text-sm'
                      }
                    >
                      زباله دان ({digitsEnToFa(0)})
                    </Tab>
                  </Tab.List>

                  <Tab.Panels className="mt-3 rounded-xl bg-white p-3">
                    <Tab.Panel>
                      <div id="_adminProducts">
                        <DataStateDisplay
                          isError={isError}
                          refetch={refetch}
                          isFetching={isFetching}
                          isSuccess={isSuccess}
                          dataLength={data?.pagination.data ? data.productsLength : 0}
                          loadingComponent={<TableSkeleton count={5} />}
                        >
                          <table className="w-[700px] md:w-[800px] lg:w-[900px] xl:w-full mx-auto">
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
                                <th className="text-sm py-3 px-2 pr-0 text-gray-600 font-normal w-[150px] text-start">
                                  نام محصول
                                </th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">کد</th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal w-[150px]">دسته بندی</th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">نوع</th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">تعداد</th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">فروشنده</th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">وضعیت</th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">عملیات</th>
                              </tr>
                            </thead>
                            <tbody>
                              {data?.pagination.data &&
                                data.pagination.data.map((product, index) => (
                                  <tr
                                    key={product.id}
                                    className={`h-16 border-b ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
                                  >
                                    <td className="text-sm py-3 px-2 pr-3 font-normal w-[1%] text-center">
                                      <input
                                        className="appearance-none border border-gray-300 checked:bg-[#e90089] focus:ring-offset-0 focus:outline-offset-0 focus:outline-0 focus:ring-0 rounded-md text-xl w-4 h-4"
                                        type="checkbox"
                                        checked={selectedProducts.includes(product)}
                                        onChange={() => handleSelectProduct(product)}
                                      />
                                    </td>
                                    <td>
                                      <img
                                        className="w-[50px] h-[50px] rounded"
                                        src={product.mainImageSrc.imageUrl}
                                        alt="p-img"
                                      />
                                    </td>
                                    <td className="text-sm text-gray-600 ">
                                      <Link className="text-sky-500" href={`/products/${product.slug}`}>
                                        {product.title}
                                      </Link>
                                    </td>
                                    <td className="text-center text-sm text-gray-600">{digitsEnToFa(product.code)}</td>
                                    <td className="text-sm text-gray-600 text-center">
                                      {product.parentCategories.category.name}
                                    </td>
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
                                              <Link
                                                href={`/admin/products/edit/${product.id}`}
                                                className="flex justify-start gap-x-2 px-3 py-2 hover:bg-gray-100 w-full"
                                              >
                                                <span>ویرایش</span>
                                              </Link>
                                            </Menu.Item>
                                            <Menu.Item>
                                              <button
                                                onClick={() => handleDelete(product.id)}
                                                className="flex justify-start gap-x-2 px-3 py-2 hover:bg-gray-100 w-full"
                                              >
                                                <span>زباله دان</span>
                                              </button>
                                            </Menu.Item>
                                          </Menu.Items>
                                        </Transition>
                                      </Menu>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </DataStateDisplay>

                        {data && data?.productsLength > 0 && (
                          <div className="mx-auto py-4 lg:max-w-5xl">
                            <Pagination pagination={data?.pagination} section="_adminProducts" client />
                          </div>
                        )}
                      </div>
                    </Tab.Panel>
                    <Tab.Panel>
                      <div id="_adminProducts">
                        <DataStateDisplay
                          isError={isError}
                          refetch={refetch}
                          isFetching={isFetching}
                          isSuccess={isSuccess}
                          dataLength={data?.pagination.data ? data.productsLength : 0}
                          loadingComponent={<TableSkeleton count={5} />}
                        >
                          <table className="w-[700px] md:w-[800px] lg:w-[900px] xl:w-full mx-auto">
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
                                <th className="text-sm py-3 px-2 pr-0 text-gray-600 font-normal w-[150px] text-start">
                                  نام محصول
                                </th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">کد</th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal w-[150px]">دسته بندی</th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">نوع</th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">تعداد</th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">فروشنده</th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">وضعیت</th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">عملیات</th>
                              </tr>
                            </thead>
                            <tbody>
                              {data?.pagination.data &&
                                data.pagination.data
                                  .filter((product) => product.isActive)
                                  .map((product, index) => (
                                    <tr
                                      key={product.id}
                                      className={`h-16 border-b ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
                                    >
                                      <td className="text-sm py-3 px-2 pr-3 font-normal w-[1%] text-center">
                                        <input
                                          className="appearance-none border border-gray-300 checked:bg-[#e90089] focus:ring-offset-0 focus:outline-offset-0 focus:outline-0 focus:ring-0 rounded-md text-xl w-4 h-4"
                                          type="checkbox"
                                          checked={selectedProducts.includes(product)}
                                          onChange={() => handleSelectProduct(product)}
                                        />
                                      </td>
                                      <td>
                                        <img
                                          className="w-[50px] h-[50px] rounded"
                                          src={product.mainImageSrc.imageUrl}
                                          alt="p-img"
                                        />
                                      </td>
                                      <td className="text-sm text-gray-600 ">
                                        <Link className="text-sky-500" href={`/products/${product.slug}`}>
                                          {product.title}
                                        </Link>
                                      </td>
                                      <td className="text-center text-sm text-gray-600">
                                        {digitsEnToFa(product.code)}
                                      </td>
                                      <td className="text-sm text-gray-600 text-center">
                                        {product.parentCategories.category.name}
                                      </td>
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
                                                <Link
                                                  href={`/admin/products/edit/${product.id}`}
                                                  className="flex justify-start gap-x-2 px-3 py-2 hover:bg-gray-100 w-full"
                                                >
                                                  <span>ویرایش</span>
                                                </Link>
                                              </Menu.Item>
                                              <Menu.Item>
                                                <button
                                                  onClick={() => handleDelete(product.id)}
                                                  className="flex justify-start gap-x-2 px-3 py-2 hover:bg-gray-100 w-full"
                                                >
                                                  <span>زباله دان</span>
                                                </button>
                                              </Menu.Item>
                                            </Menu.Items>
                                          </Transition>
                                        </Menu>
                                      </td>
                                    </tr>
                                  ))}
                            </tbody>
                          </table>
                        </DataStateDisplay>

                        {data && data?.productsLength > 0 && (
                          <div className="mx-auto py-4 lg:max-w-5xl">
                            <Pagination pagination={data?.pagination} section="_adminProducts" client />
                          </div>
                        )}
                      </div>
                    </Tab.Panel>
                    <Tab.Panel>
                      <div id="_adminProducts">
                        <DataStateDisplay
                          isError={isError}
                          refetch={refetch}
                          isFetching={isFetching}
                          isSuccess={isSuccess}
                          dataLength={data?.pagination.data ? data.productsLength : 0}
                          loadingComponent={<TableSkeleton count={5} />}
                        >
                          <table className="w-[700px] md:w-[800px] lg:w-[900px] xl:w-full mx-auto">
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
                                <th className="text-sm py-3 px-2 pr-0 text-gray-600 font-normal w-[150px] text-start">
                                  نام محصول
                                </th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">کد</th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal w-[150px]">دسته بندی</th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">نوع</th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">تعداد</th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">فروشنده</th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">وضعیت</th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">عملیات</th>
                              </tr>
                            </thead>
                            <tbody>
                              {data?.pagination.data &&
                                data.pagination.data
                                  .filter((product) => !product.isActive)
                                  .map((product, index) => (
                                    <tr
                                      key={product.id}
                                      className={`h-16 border-b ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
                                    >
                                      <td className="text-sm py-3 px-2 pr-3 font-normal w-[1%] text-center">
                                        <input
                                          className="appearance-none border border-gray-300 checked:bg-[#e90089] focus:ring-offset-0 focus:outline-offset-0 focus:outline-0 focus:ring-0 rounded-md text-xl w-4 h-4"
                                          type="checkbox"
                                          checked={selectedProducts.includes(product)}
                                          onChange={() => handleSelectProduct(product)}
                                        />
                                      </td>
                                      <td>
                                        <img
                                          className="w-[50px] h-[50px] rounded"
                                          src={product.mainImageSrc.imageUrl}
                                          alt="p-img"
                                        />
                                      </td>
                                      <td className="text-sm text-gray-600 ">
                                        <Link className="text-sky-500" href={`/products/${product.slug}`}>
                                          {product.title}
                                        </Link>
                                      </td>
                                      <td className="text-center text-sm text-gray-600">
                                        {digitsEnToFa(product.code)}
                                      </td>
                                      <td className="text-sm text-gray-600 text-center">
                                        {product.parentCategories.category.name}
                                      </td>
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
                                                <Link
                                                  href={`/admin/products/edit/${product.id}`}
                                                  className="flex justify-start gap-x-2 px-3 py-2 hover:bg-gray-100 w-full"
                                                >
                                                  <span>ویرایش</span>
                                                </Link>
                                              </Menu.Item>
                                              <Menu.Item>
                                                <button
                                                  onClick={() => handleDelete(product.id)}
                                                  className="flex justify-start gap-x-2 px-3 py-2 hover:bg-gray-100 w-full"
                                                >
                                                  <span>زباله دان</span>
                                                </button>
                                              </Menu.Item>
                                            </Menu.Items>
                                          </Transition>
                                        </Menu>
                                      </td>
                                    </tr>
                                  ))}
                            </tbody>
                          </table>
                        </DataStateDisplay>

                        {data && data?.productsLength > 0 && (
                          <div className="mx-auto py-4 lg:max-w-5xl">
                            <Pagination pagination={data?.pagination} section="_adminProducts" client />
                          </div>
                        )}
                      </div>
                    </Tab.Panel>
                    <Tab.Panel>
                      <div>زباله </div>
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </div>
              <div></div>
            </div>
          </section>
        </DashboardLayout>
      </main>
    </>
  )
}
// ? Local Components
export default dynamic(() => Promise.resolve(Products), { ssr: false })
