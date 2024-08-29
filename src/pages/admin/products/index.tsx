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
  useDeleteTrashProductMutation,
  useGetCategoriesTreeQuery,
  useGetProductsQuery,
  useRestoreProductMutation,
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
import { ConfirmDeleteModal, ConfirmUpdateModal } from '@/components/modals'
import { LuSearch } from 'react-icons/lu'
import { Pagination } from '@/components/navigation'
import { ProductBreadcrumb } from '@/components/product'
import { CustomCheckbox } from '@/components/ui'
import { GetProductsResult, ProductsResult } from '@/services/product/types'
import { ArrowDown } from '@/icons'

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
const Products: NextPage = () => {
  // ? Assets
  const { query, push } = useRouter()
  const category = (query.category as string) ?? ''
  const categoryId = (query.categoryId as string) ?? ''
  const featureIds = typeof query.featureIds === 'string' ? query.featureIds.split(',') : undefined
  const featureValueIds = typeof query.featureValueIds === 'string' ? query.featureValueIds.split(',') : undefined
  const productIds = typeof query.productIds === 'string' ? query.productIds.split(',') : undefined
  const sizes = typeof query.sizes === 'string' ? query.sizes.split(',') : undefined
  const brands = typeof query.brands === 'string' ? query.brands.split(',') : undefined
  const productPage = query.page ? +query.page : 1
  const dispatch = useDispatch()
  const isUpdated = useAppSelector((state) => state.stateUpdate.isUpdated)
  const { name } = useAppSelector((state) => state.stateString)

  // ? state
  const [tabKey, setTabKey] = useState('allProducts')
  const [selectedCategories, setSelectedCategories] = useState<SelectedCategories>(initialSelectedCategories)
  const [allCategories, setAllCategories] = useState<ICategory[]>([])
  // const [selectedProducts, setSelectedProducts] = useState<IProduct[]>([])
  const [selectedProducts, setSelectedProducts] = useState<{ [key: string]: IProduct[] }>({})

  const [deleteInfo, setDeleteInfo] = useState({
    id: '',
  })
  const [deleteTrashInfo, setDeleteTrashInfo] = useState({
    id: '',
  })
  const [restoreInfo, setRestoreInfo] = useState({
    id: '',
  })
  const [bulkAction, setBulkAction] = useState<string>('')
  const [bulkUpdateProduct] = useBulkUpdateProductMutation()
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined)
  const [selectInStock, setSelectInStock] = useState<string | undefined>(undefined)
  const [selectInStockState, setSelectInStockState] = useState<string | undefined>(undefined)
  const [searchTerm, setSearchTerm] = useState('')
  const [singleCategory, setSingleCategory] = useState(false)

  // ? Get Categories Query
  const { categoriesData } = useGetCategoriesTreeQuery(undefined, {
    selectFromResult: ({ data }) => ({
      categoriesData: data?.data,
    }),
  })
  if (productIds) {
    console.log(productIds, 'productIds')
  }
  // ? Querirs
  //* Get Products Data
  const [productsPagination, setProductsPagination] = useState<GetProductsResult>()
  const [productsActivePagination, setProductsActivePagination] = useState<GetProductsResult>()
  const [productsInActivePagination, setProductsInActivePagination] = useState<GetProductsResult>()
  const [productsIsDeletedPagination, setProductsIsDeletedPagination] = useState<GetProductsResult>()

  // دریافت محصولات با وضعیت خاص
  const useFetchProducts = (status: string) => {
    const commonQueryParams = {
      sortBy: 'LastUpdated',
      pageSize: 20,
      page: productPage, // یا مقدار مناسب دیگری
      categoryId: selectedCategoryId || categoryId,
      inStock: selectInStockState,
      search: searchTerm,
      category: category || undefined,
      featureIds: featureIds,
      featureValueIds: featureValueIds,
      productIds: productIds,
      sizes: sizes,
      brands: brands,
      isAdmin: true,
      singleCategory: singleCategory,
      isActive: status === 'isActive',
      inActive: status === 'inActive',
      isDeleted: status === 'isDeleted',
      adminList: status === 'adminList',
    }
    const { data, isError, isFetching, isSuccess, refetch } = useGetProductsQuery({ ...commonQueryParams })

    return {
      data,
      isError,
      isFetching,
      isSuccess,
      refetch,
    }
  }

  // استفاده از هوک برای هر وضعیت محصول
  const {
    data: allProducts,
    isError: isAllProductsError,
    isFetching: isAllProductsFetching,
    isSuccess: isAllProductsSuccess,
    refetch: refetchAllProducts,
  } = useFetchProducts('adminList')
  const {
    data: activeProducts,
    isError: isActiveProductsError,
    isFetching: isActiveProductsFetching,
    isSuccess: isActiveProductsSuccess,
    refetch: refetchActiveProducts,
  } = useFetchProducts('isActive')
  const {
    data: inactiveProducts,
    isError: isInactiveProductsError,
    isFetching: isInactiveProductsFetching,
    isSuccess: isInactiveProductsSuccess,
    refetch: refetchInactiveProducts,
  } = useFetchProducts('inActive')
  const {
    data: deletedProducts,
    isError: isDeletedProductsError,
    isFetching: isDeletedProductsFetching,
    isSuccess: isDeletedProductsSuccess,
    refetch: refetchDeletedProducts,
  } = useFetchProducts('isDeleted')

  useEffect(() => {
    console.log(allProducts, 'allProducts')

    if (allProducts) setProductsPagination(allProducts)
  }, [allProducts])

  useEffect(() => {
    console.log(activeProducts, 'activeProducts')

    if (activeProducts) setProductsActivePagination(activeProducts)
  }, [activeProducts])

  useEffect(() => {
    console.log(inactiveProducts, 'inactiveProducts')

    if (inactiveProducts) setProductsInActivePagination(inactiveProducts)
  }, [inactiveProducts])

  useEffect(() => {
    console.log(deletedProducts, 'deletedProducts')

    if (deletedProducts) setProductsIsDeletedPagination(deletedProducts)
  }, [deletedProducts])
  useEffect(() => {
    switch (name) {
      case 'allProducts':
        setTabKey('allProducts')
        break
      case 'activeProducts':
        setTabKey('activeProducts')
        break
      case 'inactiveProducts':
        setTabKey('inactiveProducts')
        break
      case 'deletedProducts':
        setTabKey('deletedProducts')
        break
      default:
        setTabKey('allArticles')
    }
  }, [name])

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
  const [
    deleteTrashProduct,
    {
      isSuccess: isSuccessTrashDelete,
      isError: isErrorTrashDelete,
      error: errorTrashDelete,
      data: dataTrashDelete,
      isLoading: isLoadingTrashDelete,
    },
  ] = useDeleteTrashProductMutation()

  const [
    restoreProduct,
    {
      isSuccess: isSuccessRestore,
      isError: isErrorRestore,
      error: errorRestore,
      data: dataRestore,
      isLoading: isLoadingRestore,
    },
  ] = useRestoreProductMutation()

  const handleAllRefetch = () => {
    refetchAllProducts()
    refetchDeletedProducts()
    refetchInactiveProducts()
    refetchActiveProducts()
  }

  const [isShowConfirmDeleteModal, confirmDeleteModalHandlers] = useDisclosure()

  const [isShowConfirmUpdateModal, confirmUpdateModalHandlers] = useDisclosure()

  const [isShowConfirmTrashDeleteModal, confirmTrashDeleteModalHandlers] = useDisclosure()
  // useEffect(() => {
  //   if (name) {
  //     console.log(name , "name -- name");

  //     setTabKey('deletedProducts')
  //   }
  // }, [name])
  useEffect(() => {
    if (isUpdated) {
      handleAllRefetch()
      dispatch(setUpdated(false))
    }
  }, [isUpdated, dispatch, handleAllRefetch])

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
    handleAllRefetch()
  }

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryId = event.target.value
    setSelectedCategory(selectedCategoryId !== '' ? selectedCategoryId : undefined)
  }

  const handleFilterClick = () => {
    setSelectedCategoryId(selectedCategory !== undefined ? selectedCategory : undefined)
  }

  const handleBulkAction = async () => {
    const selectedTabProducts = selectedProducts[tabKey] || []

    if (bulkAction && selectedTabProducts.length > 0) {
      const productIds = selectedTabProducts.map((product) => product.id)
      await bulkUpdateProduct({ productIds, action: bulkAction })
    }

    handleAllRefetch()

    setSelectedProducts((prev) => ({
      ...prev,
      [tabKey]: [],
    }))
  }

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>, data: IProduct[]) => {
    if (e.target.checked) {
      if (data != null) {
        setSelectedProducts((prev) => ({
          ...prev,
          [tabKey]: e.target.checked ? data : [],
        }))
      }
    } else {
      setSelectedProducts((prev) => ({
        ...prev,
        [tabKey]: [],
      }))
    }
  }

  const handleSelectProduct = (product: IProduct) => {
    setSelectedProducts((prevSelected) => {
      const selectedTabProducts = prevSelected[tabKey] || []

      if (selectedTabProducts.includes(product)) {
        return {
          ...prevSelected,
          [tabKey]: selectedTabProducts.filter((selectedProduct) => selectedProduct !== product),
        }
      } else {
        return {
          ...prevSelected,
          [tabKey]: [...selectedTabProducts, product],
        }
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
  //*  Restore Handlers
  const handleRestoreTrash = (id: string) => {
    setRestoreInfo({ id })
    confirmUpdateModalHandlers.open()
  }
  const onConfirmRestore = () => {
    restoreProduct({ id: restoreInfo.id })
  }

  //*   Delete Handlers
  const handleDeleteTrash = (id: string) => {
    setDeleteTrashInfo({ id })
    confirmTrashDeleteModalHandlers.open()
  }
  const handleDelete = (id: string) => {
    setDeleteInfo({ id })
    confirmDeleteModalHandlers.open()
  }

  const onCancel = () => {
    setDeleteTrashInfo({ id: '' })
    setDeleteInfo({ id: '' })
    setRestoreInfo({ id: '' })
    confirmDeleteModalHandlers.close()
    confirmTrashDeleteModalHandlers.close()
    confirmUpdateModalHandlers.close()
  }

  const onConfirmTrashDelete = () => {
    deleteTrashProduct({ id: deleteTrashInfo.id })
  }
  const onConfirmDelete = () => {
    deleteProduct({ id: deleteInfo.id })
  }

  const onSuccess = () => {
    handleAllRefetch()
    confirmDeleteModalHandlers.close()
    confirmTrashDeleteModalHandlers.close()
    confirmUpdateModalHandlers.close()
    setRestoreInfo({ id: '' })
    setDeleteTrashInfo({ id: '' })
    setDeleteInfo({ id: '' })
  }
  const onError = () => {
    confirmDeleteModalHandlers.close()
    confirmTrashDeleteModalHandlers.close()
    confirmUpdateModalHandlers.close()
    setRestoreInfo({ id: '' })
    setDeleteTrashInfo({ id: '' })
    setDeleteInfo({ id: '' })
  }
  const handleTheOnlyCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    var checked = e.target.checked
    if (checked) {
      setSingleCategory(checked)
    } else {
      setSingleCategory(false)
    }
  }
    console.log(categoryId , "categoryId")
  
  return (
    <>
      {/* Confirm Delete Product Modal */}
      <ConfirmDeleteModal
        title="محصول"
        deleted
        isLoading={isLoadingDelete}
        isShow={isShowConfirmDeleteModal}
        onClose={confirmDeleteModalHandlers.close}
        onCancel={onCancel}
        onConfirm={onConfirmDelete}
      />

      {/* Handle Delete Product Response */}
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

      {/* Handle restore Product Response */}
      {(isSuccessRestore || isErrorRestore) && (
        <HandleResponse
          isError={isErrorRestore}
          isSuccess={isSuccessRestore}
          error={errorRestore}
          message={dataRestore?.message}
          onSuccess={onSuccess}
          onError={onError}
        />
      )}

      {/* Confirm Delete Trash Product Modal */}
      <ConfirmDeleteModal
        title="محصول در زباله‌دان"
        isLoading={isLoadingTrashDelete}
        isShow={isShowConfirmTrashDeleteModal}
        onClose={confirmTrashDeleteModalHandlers.close}
        onCancel={onCancel}
        onConfirm={onConfirmTrashDelete}
      />

      <ConfirmUpdateModal
        title="محصول"
        isLoading={isLoadingRestore}
        isShow={isShowConfirmUpdateModal}
        onClose={confirmUpdateModalHandlers.close}
        onConfirm={onConfirmRestore}
        onCancel={onCancel}
      />

      {/* Handle Delete Trash Product Response */}
      {(isSuccessTrashDelete || isErrorTrashDelete) && (
        <HandleResponse
          isError={isErrorTrashDelete}
          isSuccess={isSuccessTrashDelete}
          error={errorTrashDelete}
          message={dataTrashDelete?.message}
          onSuccess={onSuccess}
          onError={onError}
        />
      )}
      <main>
        <Head>
          <title>مدیریت | محصولات</title>
        </Head>
        <DashboardLayout>
          <div className="w-full  mt-7 mb-4">
            <div className=" bg-white p-4 rounded-lg shadow-item mx-3">
              <div className="bg-[#e90089] cursor-pointer hover:bg-[#c70174] w-fit px-3 py-2.5 rounded-lg text-white text-sm">
                همه محصولات
              </div>
            </div>
          </div>
          <section id="_adminProducts" className=" w-full">
            <div className="bg-white rounded-lg shadow-item mx-3">
              {/* filter control  */}
              <div className="flex justify-end px-4 gap-x-6 gap-y-2.5 flex-wrap py-4">
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
                    <option value="1">فعال کردن</option>
                    <option value="2">غیر فعال کردن</option>
                    <option value="3">انتقال به زباله دان</option>
                    <option value="4">بازگردانی محصول</option>
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
                  <label
                    title="نمایش محصولات زیر دسته"
                    className="bg-gray-100 hover:bg-gray-200 rounded-r-md text-sm flex justify-center cursor-pointer items-center w-14"
                  >
                    <input
                      onChange={handleTheOnlyCategory}
                      checked={singleCategory}
                      type="checkbox"
                      name=""
                      id=""
                      className="appearance-none border border-gray-300 checked:bg-sky-500 focus:ring-offset-0 focus:outline-offset-0 focus:outline-0 cursor-pointer focus:ring-0 rounded-md text-xl w-5 h-5"
                    />
                  </label>
                  <select
                    className="w-44 text-sm focus:outline-none appearance-none border-none"
                    name="انتخاب"
                    id=""
                    value={categoryId ?? ""}
                    onChange={handleCategoryChange}
                  >
                    <option className="appearance-none text-sm" value="">
                      همه دسته بندی ها
                    </option>
                    {allCategories?.map((category) => (
                      <option
                        className={category.level === 0 ? 'text-blue-600' : ''}
                        key={category.id}
                        value={category.id}
                      >
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
                {selectedProducts[tabKey]?.length > 0 && (
                  <div className="sm:absolute top-3 left-4 pr-4">
                    {digitsEnToFa(selectedProducts[tabKey].length)} کالا انتخاب شد
                  </div>
                )}

                <Tab.Group
                  selectedIndex={
                    tabKey === 'allProducts'
                      ? 0
                      : tabKey === 'activeProducts'
                      ? 1
                      : tabKey === 'inactiveProducts'
                      ? 2
                      : tabKey === 'deletedProducts'
                      ? 3
                      : 0
                  }
                  onChange={(index) => {
                    switch (index) {
                      case 0:
                        setTabKey('allProducts')
                        break
                      case 1:
                        setTabKey('activeProducts')
                        break
                      case 2:
                        setTabKey('inactiveProducts')
                        break
                      case 3:
                        setTabKey('deletedProducts')
                        break
                      default:
                        setTabKey('allProducts')
                    }
                  }}
                >
                  <Tab.List className="flex gap-4 p-2 border-b-2 border-gray-200">
                    <Tab
                      className={({ selected }) =>
                        selected
                          ? 'px-4 py-2 text-sky-500 rounded cursor-pointer text-sm'
                          : 'px-4 py-2 hover:text-sky-500 rounded cursor-pointer text-sm'
                      }
                    >
                      همه ({digitsEnToFa(productsPagination?.data?.pagination.totalCount ?? 0)})
                    </Tab>
                    <Tab
                      className={({ selected }) =>
                        selected
                          ? 'px-4 py-2 text-sky-500 rounded cursor-pointer text-sm'
                          : 'px-4 py-2 hover:text-sky-500 rounded cursor-pointer text-sm'
                      }
                    >
                      فعال ({digitsEnToFa(productsActivePagination?.data?.pagination.totalCount ?? 0)})
                    </Tab>
                    <Tab
                      className={({ selected }) =>
                        selected
                          ? 'px-4 py-2 text-sky-500 rounded cursor-pointer text-sm'
                          : 'px-4 py-2 hover:text-sky-500 rounded cursor-pointer text-sm'
                      }
                    >
                      غیرفعال ({digitsEnToFa(productsInActivePagination?.data?.pagination.totalCount ?? 0)})
                    </Tab>
                    <Tab
                      className={({ selected }) =>
                        selected
                          ? 'px-4 py-2 text-sky-500 rounded cursor-pointer text-sm'
                          : 'px-4 py-2 hover:text-sky-500 rounded cursor-pointer text-sm'
                      }
                    >
                      زباله دان ({digitsEnToFa(productsIsDeletedPagination?.data?.pagination.totalCount ?? 0)})
                    </Tab>
                  </Tab.List>

                  <Tab.Panels className="mt-3 rounded-xl bg-white p-3">
                    <Tab.Panel>
                      <div id="_adminProducts">
                        <DataStateDisplay
                          isError={isAllProductsError}
                          refetch={refetchAllProducts}
                          isFetching={isAllProductsFetching}
                          isSuccess={isAllProductsSuccess}
                          dataLength={
                            productsPagination?.data?.pagination.data ? productsPagination.data?.productsLength : 0
                          }
                          loadingComponent={<TableSkeleton count={20} />}
                        >
                          <table className="w-[700px] md:w-full mx-auto z-10">
                            <thead className="bg-sky-300">
                              <tr>
                                <th className="text-sm py-3 px-2 pr-3 font-normal w-[1%] text-center">
                                  <div className="flex items-center">
                                    <input
                                      className="appearance-none checked:bg-sky-500 border-none focus:ring-offset-0 focus:outline-offset-0 focus:outline-0 focus:ring-0 rounded-md text-xl w-4 h-4"
                                      type="checkbox"
                                      onChange={(e) =>
                                        handleSelectAll(e, productsPagination?.data?.pagination?.data ?? [])
                                      }
                                      checked={
                                        selectedProducts[tabKey]?.length ===
                                        productsPagination?.data?.pagination.data?.length
                                      }
                                    />
                                    <ArrowDown className="icon text-gray-500" />
                                  </div>
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
                              {productsPagination?.data?.pagination?.data &&
                                productsPagination.data?.pagination.data.map((product, index) => (
                                  <tr
                                    key={product.id}
                                    className={`h-16 border-b ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
                                  >
                                    <td className="text-sm py-3 px-2 pr-3 font-normal w-[1%] text-start">
                                      <input
                                        className="appearance-none border border-gray-300 checked:bg-sky-500 focus:ring-offset-0 focus:outline-offset-0 focus:outline-0 focus:ring-0 rounded-md text-xl w-4 h-4"
                                        type="checkbox"
                                        checked={selectedProducts[tabKey]?.includes(product) || false}
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
                                    {/* <td
                                      title={`${product.parentCategories.category.name}`}
                                      className="text-sm text-gray-600 text-center"
                                    >
                                      {product.parentCategories.category.name}
                                    </td> */}
                                    <td className="tooltip-container text-sm text-gray-600 text-center cursor-pointer">
                                      {product.parentCategories.category.name}
                                      <span className="tooltip-text">
                                        <ProductBreadcrumb isAdmin categoryLevels={product.parentCategories} />
                                      </span>
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
                                              {({ close }) => (
                                                <>
                                                  <Link
                                                    href={`/admin/products/edit/${product.id}`}
                                                    onClick={close}
                                                    className="flex justify-start gap-x-2 px-3 py-2 hover:bg-gray-100 w-full"
                                                  >
                                                    <span>ویرایش</span>
                                                  </Link>
                                                  <button
                                                    onClick={() => {
                                                      handleDeleteTrash(product.id)
                                                      close()
                                                    }}
                                                    className="flex justify-start gap-x-2 px-3 py-2 hover:bg-gray-100 w-full"
                                                  >
                                                    <span>زباله دان</span>
                                                  </button>
                                                </>
                                              )}
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

                        {productsPagination &&
                          productsPagination.data &&
                          productsPagination?.data?.productsLength > 0 && (
                            <div className="mx-auto py-4 lg:max-w-5xl">
                              <Pagination
                                pagination={productsPagination?.data.pagination}
                                section="_adminProducts"
                                client
                              />
                            </div>
                          )}
                      </div>
                    </Tab.Panel>

                    <Tab.Panel>
                      <div id="_adminActiveProducts">
                        <DataStateDisplay
                          isError={isActiveProductsError}
                          refetch={refetchActiveProducts}
                          isFetching={isActiveProductsFetching}
                          isSuccess={isActiveProductsSuccess}
                          dataLength={
                            productsActivePagination?.data?.pagination.data
                              ? productsActivePagination.data?.productsLength
                              : 0
                          }
                          loadingComponent={<TableSkeleton count={20} />}
                        >
                          <table className=" w-[700px] md:w-full mx-auto">
                            <thead className="bg-sky-300">
                              <tr>
                                <th className="text-sm py-3 px-2 pr-3 font-normal w-[1%] text-center">
                                  <div className="flex items-center">
                                    <input
                                      className="appearance-none checked:bg-sky-500 border-none focus:ring-offset-0 focus:outline-offset-0 focus:outline-0 focus:ring-0 rounded-md text-xl w-4 h-4"
                                      type="checkbox"
                                      onChange={(e) =>
                                        handleSelectAll(e, productsActivePagination?.data?.pagination?.data ?? [])
                                      }
                                      checked={
                                        selectedProducts[tabKey]?.length ===
                                        productsActivePagination?.data?.pagination.data?.length
                                      }
                                    />
                                    <ArrowDown className="icon text-gray-500" />
                                  </div>
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
                              {productsActivePagination?.data?.pagination?.data &&
                                productsActivePagination.data?.pagination.data.map((product, index) => (
                                  <tr
                                    key={product.id}
                                    className={`h-16 border-b ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
                                  >
                                    <td className="text-sm py-3 px-2 pr-3 font-normal w-[1%] text-start">
                                      <input
                                        className="appearance-none border border-gray-300 checked:bg-sky-500 focus:ring-offset-0 focus:outline-offset-0 focus:outline-0 focus:ring-0 rounded-md text-xl w-4 h-4"
                                        type="checkbox"
                                        checked={selectedProducts[tabKey]?.includes(product) || false}
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
                                    {/* <td
                                      title={`${product.parentCategories.category.name}`}
                                      className="text-sm text-gray-600 text-center"
                                    >
                                      {product.parentCategories.category.name}
                                    </td> */}
                                    <td className="tooltip-container text-sm text-gray-600 text-center cursor-pointer">
                                      {product.parentCategories.category.name}
                                      <span className="tooltip-text">
                                        <ProductBreadcrumb categoryLevels={product.parentCategories} isAdmin />
                                      </span>
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
                                              {({ close }) => (
                                                <>
                                                  <Link
                                                    href={`/admin/products/edit/${product.id}`}
                                                    onClick={close}
                                                    className="flex justify-start gap-x-2 px-3 py-2 hover:bg-gray-100 w-full"
                                                  >
                                                    <span>ویرایش</span>
                                                  </Link>
                                                  <button
                                                    onClick={() => {
                                                      handleDeleteTrash(product.id)
                                                      close()
                                                    }}
                                                    className="flex justify-start gap-x-2 px-3 py-2 hover:bg-gray-100 w-full"
                                                  >
                                                    <span>زباله دان</span>
                                                  </button>
                                                </>
                                              )}
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

                        {productsActivePagination &&
                          productsActivePagination.data &&
                          productsActivePagination?.data?.productsLength > 0 && (
                            <div className="mx-auto py-4 lg:max-w-5xl">
                              <Pagination
                                pagination={productsActivePagination?.data.pagination}
                                section="_adminActiveProducts"
                                client
                              />
                            </div>
                          )}
                      </div>
                    </Tab.Panel>

                    <Tab.Panel>
                      <div id="_adminInActiveProducts">
                        <DataStateDisplay
                          isError={isInactiveProductsError}
                          refetch={refetchInactiveProducts}
                          isFetching={isInactiveProductsFetching}
                          isSuccess={isInactiveProductsSuccess}
                          dataLength={
                            productsInActivePagination?.data?.pagination.data
                              ? productsInActivePagination.data?.productsLength
                              : 0
                          }
                          loadingComponent={<TableSkeleton count={20} />}
                        >
                          <table className=" w-[700px] md:w-full mx-auto">
                            <thead className="bg-sky-300">
                              <tr>
                                <th className="text-sm py-3 px-2 pr-3 font-normal w-[1%] text-center">
                                  <div className="flex items-center">
                                    <input
                                      className="appearance-none checked:bg-sky-500 border-none focus:ring-offset-0 focus:outline-offset-0 focus:outline-0 focus:ring-0 rounded-md text-xl w-4 h-4"
                                      type="checkbox"
                                      onChange={(e) =>
                                        handleSelectAll(e, productsInActivePagination?.data?.pagination?.data ?? [])
                                      }
                                      checked={
                                        selectedProducts[tabKey]?.length ===
                                        productsInActivePagination?.data?.pagination.data?.length
                                      }
                                    />
                                    <ArrowDown className="icon text-gray-500" />
                                  </div>
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
                              {productsInActivePagination?.data?.pagination?.data &&
                                productsInActivePagination.data?.pagination.data.map((product, index) => (
                                  <tr
                                    key={product.id}
                                    className={`h-16 border-b ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
                                  >
                                    <td className="text-sm py-3 px-2 pr-3 font-normal w-[1%] text-start">
                                      <input
                                        className="appearance-none border border-gray-300 checked:bg-sky-500 focus:ring-offset-0 focus:outline-offset-0 focus:outline-0 focus:ring-0 rounded-md text-xl w-4 h-4"
                                        type="checkbox"
                                        checked={selectedProducts[tabKey]?.includes(product) || false}
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
                                    {/* <td
                                      title={`${product.parentCategories.category.name}`}
                                      className="text-sm text-gray-600 text-center"
                                    >
                                      {product.parentCategories.category.name}
                                    </td> */}
                                    <td className="tooltip-container text-sm text-gray-600 text-center cursor-pointer">
                                      {product.parentCategories.category.name}
                                      <span className="tooltip-text">
                                        <ProductBreadcrumb categoryLevels={product.parentCategories} isAdmin />
                                      </span>
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
                                              {({ close }) => (
                                                <>
                                                  <Link
                                                    href={`/admin/products/edit/${product.id}`}
                                                    onClick={close}
                                                    className="flex justify-start gap-x-2 px-3 py-2 hover:bg-gray-100 w-full"
                                                  >
                                                    <span>ویرایش</span>
                                                  </Link>
                                                  <button
                                                    onClick={() => {
                                                      handleDeleteTrash(product.id)
                                                      close()
                                                    }}
                                                    className="flex justify-start gap-x-2 px-3 py-2 hover:bg-gray-100 w-full"
                                                  >
                                                    <span>زباله دان</span>
                                                  </button>
                                                </>
                                              )}
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

                        {productsInActivePagination &&
                          productsInActivePagination.data &&
                          productsInActivePagination?.data?.productsLength > 0 && (
                            <div className="mx-auto py-4 lg:max-w-5xl">
                              <Pagination
                                pagination={productsInActivePagination?.data.pagination}
                                section="_adminInActiveProducts"
                                client
                              />
                            </div>
                          )}
                      </div>
                    </Tab.Panel>

                    <Tab.Panel>
                      <div className="_adminIsDeletedProducts">
                        <DataStateDisplay
                          isError={isDeletedProductsError}
                          refetch={refetchDeletedProducts}
                          isFetching={isDeletedProductsFetching}
                          isSuccess={isDeletedProductsSuccess}
                          dataLength={
                            productsIsDeletedPagination?.data?.pagination.data
                              ? productsIsDeletedPagination.data?.productsLength
                              : 0
                          }
                          loadingComponent={<TableSkeleton count={20} />}
                        >
                          <table className=" w-[700px] md:w-full mx-auto">
                            <thead className="bg-sky-300">
                              <tr>
                                <th className="text-sm py-3 px-2 pr-3 font-normal w-[1%] text-center">
                                  <div className="flex items-center">
                                    <input
                                      className="appearance-none checked:bg-sky-500 border-none focus:ring-offset-0 focus:outline-offset-0 focus:outline-0 focus:ring-0 rounded-md text-xl w-4 h-4"
                                      type="checkbox"
                                      onChange={(e) =>
                                        handleSelectAll(e, productsIsDeletedPagination?.data?.pagination?.data ?? [])
                                      }
                                      checked={
                                        selectedProducts[tabKey]?.length ===
                                        productsIsDeletedPagination?.data?.pagination.data?.length
                                      }
                                    />
                                    <ArrowDown className="icon text-gray-500" />
                                  </div>
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
                              {productsIsDeletedPagination?.data?.pagination?.data &&
                                productsIsDeletedPagination.data?.pagination.data.map((product, index) => (
                                  <tr
                                    key={product.id}
                                    className={`h-16 border-b ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
                                  >
                                    <td className="text-sm py-3 px-2 pr-3 font-normal w-[1%] text-start">
                                      <input
                                        className="appearance-none border border-gray-300 checked:bg-sky-500 focus:ring-offset-0 focus:outline-offset-0 focus:outline-0 focus:ring-0 rounded-md text-xl w-4 h-4"
                                        type="checkbox"
                                        checked={selectedProducts[tabKey]?.includes(product) || false}
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
                                    {/* <td
                                      title={`${product.parentCategories.category.name}`}
                                      className="text-sm text-gray-600 text-center"
                                    >
                                      {product.parentCategories.category.name}
                                    </td> */}
                                    <td className="tooltip-container text-sm text-gray-600 text-center cursor-pointer">
                                      {product.parentCategories.category.name}
                                      <span className="tooltip-text">
                                        <ProductBreadcrumb categoryLevels={product.parentCategories} isAdmin />
                                      </span>
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
                                              {({ close }) => (
                                                <>
                                                  <button
                                                    onClick={() => {
                                                      handleRestoreTrash(product.id)
                                                      close()
                                                    }}
                                                    className="flex justify-start gap-x-2 px-3 py-2 hover:bg-gray-100 w-full"
                                                  >
                                                    <span>بازگردانی</span>
                                                  </button>
                                                  <button
                                                    onClick={() => {
                                                      handleDelete(product.id)
                                                      close()
                                                    }}
                                                    className="flex justify-start gap-x-2 px-3 py-2 hover:bg-gray-100 w-full"
                                                  >
                                                    <span>حذف</span>
                                                  </button>
                                                </>
                                              )}
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

                        {productsIsDeletedPagination &&
                          productsIsDeletedPagination.data &&
                          productsIsDeletedPagination?.data?.productsLength > 0 && (
                            <div className="mx-auto py-4 lg:max-w-5xl">
                              <Pagination
                                pagination={productsIsDeletedPagination?.data.pagination}
                                section="_adminIsDeletedProducts"
                                client
                              />
                            </div>
                          )}
                      </div>
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
