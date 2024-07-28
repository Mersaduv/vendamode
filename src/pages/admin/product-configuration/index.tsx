// import type { NextPage } from 'next'
// import dynamic from 'next/dynamic'
// import Head from 'next/head'
// import { DashboardLayout, TabDashboardLayout } from '@/components/Layouts'
// import { DataStateDisplay, HandleResponse } from '@/components/shared'
// import { TableSkeleton } from '@/components/skeleton'
// import { EmptyCustomList } from '@/components/emptyList'
// import { digitsEnToFa } from '@persian-tools/persian-tools'
// import { Menu, Tab, Transition } from '@headlessui/react'
// import {
//   useDeleteCategoryMutation,
//   useGetAllCategoriesQuery,
//   useGetFeaturesQuery,
//   useGetParenSubCategoriesQuery,
// } from '@/services'
// import { useRouter } from 'next/router'
// import { ICategory } from '@/types'
// import { useAppSelector, useDisclosure } from '@/hooks'
// import { CategoryModal, CategoryUpdateModal, ConfirmDeleteModal, FeatureModal, SizesModal } from '@/components/modals'
// import { Fragment, useEffect, useState } from 'react'
// import { Pagination } from '@/components/navigation'
// import { useDispatch } from 'react-redux'
// import { LuSearch } from 'react-icons/lu'
// import { Button } from '@/components/ui'
// import { ParentSubCategoriesTree } from '@/components/categories'
// import { ProductFeature } from '@/services/feature/types'
// const ProductConfiguration: NextPage = () => {
//   // States
//   const [isShowSizesModal, sizesModalHandlers] = useDisclosure()
//   const [isShowCategoryModal, categoryModalHandlers] = useDisclosure()
//   const [isShowFeatureModal, featureModalHandlers] = useDisclosure()
//   const [isShowEditFeatureModal, editFeatureModalHandlers] = useDisclosure()
//   const [isShowEditCategoryModal, editCategoryModalHandlers] = useDisclosure()
//   const [isShowConfirmDeleteModal, confirmDeleteModalHandlers] = useDisclosure()
//   const [isShowSubCategories, setIsShowSubCategories] = useState(false)
//   const [deleteInfo, setDeleteInfo] = useState({
//     id: '',
//   })
//   const [searchTerm, setSearchTerm] = useState('')
//   const [featureSearchTerm, setFeatureSearchTerm] = useState('')
//   const [stateCategory, setStateCategory] = useState<ICategory>()
//   const [stateFeature, setStateFeature] = useState<ProductFeature>()
//   const [stateCategorySize, setStateCategorySize] = useState<ICategory>()
//   const [categoryParent, setCategoryParent] = useState<ICategory | undefined>(undefined)
//   const [stateSubCategories, setStateSubCategories] = useState<ICategory[]>([])
//   const [subCategorySearchTerm, setSubCategorySearchTerm] = useState('')
//   // ? Assets
//   const { query, push } = useRouter()
//   const categoryPage = query.categoryPage ? +query.categoryPage : 1
//   const featurePage = query.featurePage ? +query.featurePage : 1
//   const { data, refetch, ...categoriesQueryProps } = useGetAllCategoriesQuery({
//     pageSize: 5,
//     page: categoryPage,
//     search: searchTerm,
//   })

//   const {
//     data: featureData,
//     refetch: refetchFeatures,
//     ...featuresQueryProps
//   } = useGetFeaturesQuery({
//     pageSize: 5,
//     page: featurePage,
//     search: searchTerm,
//   })

//   // ? Queries
//   //* Get Categories
//   const {
//     data: subCategories,
//     refetch: subRefetch,
//     isLoading: isLoadingSubCategory,
//   } = useGetParenSubCategoriesQuery(
//     {
//       id: categoryParent != undefined ? categoryParent.id : undefined,
//       query: { searchTerm: subCategorySearchTerm },
//     },
//     {
//       skip: categoryParent === undefined,
//     }
//   )

//   //*    Delete Category
//   const [
//     deleteCategory,
//     {
//       isSuccess: isSuccessDelete,
//       isError: isErrorDelete,
//       error: errorDelete,
//       data: dataDelete,
//       isLoading: isLoadingDelete,
//     },
//   ] = useDeleteCategoryMutation()

//   useEffect(() => {
//     if (subCategories) {
//       setStateSubCategories(subCategories.data ?? [])
//     }
//   }, [subCategories])

//   const countAllChildCategories = (category: ICategory | undefined): number => {
//     if (!category || !category.childCategories) return 0

//     let totalCount = category.childCategories.length

//     for (const childCategory of category.childCategories) {
//       totalCount += countAllChildCategories(childCategory)
//     }

//     return totalCount
//   }

//   // ? Handlers
//   const handleSearchSubCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSubCategorySearchTerm(event.target.value)
//   }
//   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(event.target.value)
//   }
//   const handleFeatureSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setFeatureSearchTerm(event.target.value)
//   }

//   const handleChangePage = (slugQuery: string) => {
//     push(`/admin/products?category=${slugQuery}`)
//   }

//   const handleChangePageFeature = (id: string) => {
//     push(`/admin/products?featureIds=${id}`)
//   }

//   const handlerEditCategoryModal = (category: ICategory) => {
//     setStateCategory(category)
//     editCategoryModalHandlers.open()
//   }

//   const handlerEditFeatureModal = (feature: ProductFeature) => {
//     setStateFeature(feature)
//     editFeatureModalHandlers.open()
//   }

//   const handlerEditSizeModal = (category: ICategory) => {
//     setStateCategorySize(category)
//     sizesModalHandlers.open()
//   }

//   //*   Delete Handlers
//   const handleDelete = (id: string) => {
//     setDeleteInfo({ id })
//     confirmDeleteModalHandlers.open()
//   }

//   const onCancel = () => {
//     setDeleteInfo({ id: '' })
//     confirmDeleteModalHandlers.close()
//   }

//   const onConfirm = () => {
//     deleteCategory({ id: deleteInfo.id })
//   }

//   const onSuccess = () => {
//     refetch()
//     confirmDeleteModalHandlers.close()
//     setDeleteInfo({ id: '' })
//   }
//   const onError = () => {
//     confirmDeleteModalHandlers.close()
//     setDeleteInfo({ id: '' })
//   }

//   const handleChangeRouteToSubFeature = (feature: ICategory) => {
//     setIsShowSubFeature(true)
//     setFeatureValue(categoryParent)
//   }

//   return (
//     <>
//       <ConfirmDeleteModal
//         title="دسته بندی"
//         isLoading={isLoadingDelete}
//         isShow={isShowConfirmDeleteModal}
//         onClose={confirmDeleteModalHandlers.close}
//         onCancel={onCancel}
//         onConfirm={onConfirm}
//       />
//       {/* Handle Delete Response */}
//       {(isSuccessDelete || isErrorDelete) && (
//         <HandleResponse
//           isError={isErrorDelete}
//           isSuccess={isSuccessDelete}
//           error={errorDelete}
//           message={dataDelete?.message}
//           onSuccess={onSuccess}
//           onError={onError}
//         />
//       )}

//       <CategoryModal
//         title="افزودن"
//         refetch={refetch}
//         isShow={isShowCategoryModal}
//         onClose={() => {
//           categoryModalHandlers.close()
//           setStateCategory(undefined)
//         }}
//       />

//       <FeatureModal
//         title="افزودن"
//         refetch={refetchFeatures}
//         feature={stateFeature}
//         isShow={isShowFeatureModal}
//         onClose={() => {
//           featureModalHandlers.close()
//         }}
//       />

//       <CategoryUpdateModal
//         title="ویرایش"
//         refetch={refetch}
//         category={stateCategory}
//         isShow={isShowEditCategoryModal}
//         onClose={() => {
//           editCategoryModalHandlers.close()
//         }}
//       />

//       <SizesModal
//         refetch={refetch}
//         category={stateCategorySize ?? undefined}
//         isShow={isShowSizesModal}
//         onClose={sizesModalHandlers.close}
//       />

//       <main>
//         <Head>
//           <title>مدیریت | پیکربندی محصول</title>
//         </Head>
//         <DashboardLayout>
//           <section className="w-full px-2 sm:px-6 pt-7 h-screen">
//             {/* tab changed  */}
//             <div className="relative flex justify-center w-full overflow-x-auto min-h-96">
//               <TabDashboardLayout>
//                 <></>
//               </TabDashboardLayout>
//             </div>
//           </section>
//         </DashboardLayout>
//       </main>
//     </>
//   )
// }
// export default dynamic(() => Promise.resolve(ProductConfiguration), { ssr: false })

import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { DashboardLayout } from '@/components/Layouts'
import { DataStateDisplay, HandleResponse } from '@/components/shared'
import { TableSkeleton } from '@/components/skeleton'
import { EmptyCustomList } from '@/components/emptyList'
import { digitsEnToFa } from '@persian-tools/persian-tools'
import { Menu, Tab, Transition } from '@headlessui/react'
import {
  useDeleteCategoryMutation,
  useGetAllCategoriesQuery,
  useGetFeaturesQuery,
  useGetParenSubCategoriesQuery,
} from '@/services'
import { useRouter } from 'next/router'
import { ICategory } from '@/types'
import { useAppSelector, useDisclosure } from '@/hooks'
import { CategoryModal, CategoryUpdateModal, ConfirmDeleteModal, FeatureModal, SizesModal } from '@/components/modals'
import { Fragment, useEffect, useState } from 'react'
import { Pagination } from '@/components/navigation'
import { useDispatch } from 'react-redux'
import { LuSearch } from 'react-icons/lu'
import { Button } from '@/components/ui'
import { ParentSubCategoriesTree } from '@/components/categories'
import { ProductFeature } from '@/services/feature/types'
const ProductConfiguration: NextPage = () => {
  // States
  const [isShowSizesModal, sizesModalHandlers] = useDisclosure()
  const [isShowCategoryModal, categoryModalHandlers] = useDisclosure()
  const [isShowFeatureModal, featureModalHandlers] = useDisclosure()
  const [isShowEditFeatureModal, editFeatureModalHandlers] = useDisclosure()
  const [isShowEditCategoryModal, editCategoryModalHandlers] = useDisclosure()
  const [isShowConfirmDeleteModal, confirmDeleteModalHandlers] = useDisclosure()
  const [isShowSubCategories, setIsShowSubCategories] = useState(false)
  const [deleteInfo, setDeleteInfo] = useState({
    id: '',
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [featureSearchTerm, setFeatureSearchTerm] = useState('')
  const [stateCategory, setStateCategory] = useState<ICategory>()
  const [stateFeature, setStateFeature] = useState<ProductFeature>()
  const [stateCategorySize, setStateCategorySize] = useState<ICategory>()
  const [categoryParent, setCategoryParent] = useState<ICategory | undefined>(undefined)
  const [stateSubCategories, setStateSubCategories] = useState<ICategory[]>([])
  const [subCategorySearchTerm, setSubCategorySearchTerm] = useState('')
  // ? Assets
  const { query, push } = useRouter()
  const categoryPage = query.categoryPage ? +query.categoryPage : 1
  const featurePage = query.featurePage ? +query.featurePage : 1
  const { data, refetch, ...categoriesQueryProps } = useGetAllCategoriesQuery({
    pageSize: 5,
    page: categoryPage,
    search: searchTerm,
  })

  const {
    data: featureData,
    refetch: refetchFeatures,
    ...featuresQueryProps
  } = useGetFeaturesQuery({
    pageSize: 5,
    page: featurePage,
    search: searchTerm,
  })

  // ? Queries
  //* Get Categories
  const {
    data: subCategories,
    refetch: subRefetch,
    isLoading: isLoadingSubCategory,
  } = useGetParenSubCategoriesQuery(
    {
      id: categoryParent != undefined ? categoryParent.id : undefined,
      query: { searchTerm: subCategorySearchTerm },
    },
    {
      skip: categoryParent === undefined,
    }
  )

  //*    Delete Category
  const [
    deleteCategory,
    {
      isSuccess: isSuccessDelete,
      isError: isErrorDelete,
      error: errorDelete,
      data: dataDelete,
      isLoading: isLoadingDelete,
    },
  ] = useDeleteCategoryMutation()

  useEffect(() => {
    if (subCategories) {
      setStateSubCategories(subCategories.data ?? [])
    }
  }, [subCategories])

  const countAllChildCategories = (category: ICategory | undefined): number => {
    if (!category || !category.childCategories) return 0

    let totalCount = category.childCategories.length

    for (const childCategory of category.childCategories) {
      totalCount += countAllChildCategories(childCategory)
    }

    return totalCount
  }

  // ? Handlers
  const handleSearchSubCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubCategorySearchTerm(event.target.value)
  }
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }
  const handleFeatureSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFeatureSearchTerm(event.target.value)
  }

  const handleChangePage = (slugQuery: string) => {
    push(`/admin/products?category=${slugQuery}`)
  }

  const handleChangePageFeature = (id: string) => {
    push(`/admin/products?featureIds=${id}`)
  }

  const handlerEditCategoryModal = (category: ICategory) => {
    setStateCategory(category)
    editCategoryModalHandlers.open()
  }

  const handlerEditFeatureModal = (feature: ProductFeature) => {
    setStateFeature(feature)
    editFeatureModalHandlers.open()
  }

  const handlerEditSizeModal = (category: ICategory) => {
    setStateCategorySize(category)
    sizesModalHandlers.open()
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
    deleteCategory({ id: deleteInfo.id })
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

  const handleChangeRouteToSubCategories = (categoryParent: ICategory) => {
    setIsShowSubCategories(true)
    setCategoryParent(categoryParent)
  }

  return (
    <>
      <ConfirmDeleteModal
        title="دسته بندی"
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

      <CategoryModal
        title="افزودن"
        refetch={refetch}
        isShow={isShowCategoryModal}
        onClose={() => {
          categoryModalHandlers.close()
          setStateCategory(undefined)
        }}
      />

      <FeatureModal
        title="افزودن"
        refetch={refetchFeatures}
        feature={stateFeature}
        isShow={isShowFeatureModal}
        onClose={() => {
          featureModalHandlers.close()
        }}
      />

      <CategoryUpdateModal
        title="ویرایش"
        refetch={refetch}
        category={stateCategory}
        isShow={isShowEditCategoryModal}
        onClose={() => {
          editCategoryModalHandlers.close()
        }}
      />

      <SizesModal
        refetch={refetch}
        category={stateCategorySize ?? undefined}
        isShow={isShowSizesModal}
        onClose={sizesModalHandlers.close}
      />

      <main>
        <Head>
          <title>مدیریت | پیکربندی محصول</title>
        </Head>
        <DashboardLayout>
          <section className="w-full px-2 sm:px-6 pt-7 h-screen">
            {/* tab changed  */}
            <div className="relative overflow-x-auto min-h-96">
              <Tab.Group>
                <Tab.List className="py-4 overflow-auto flex gap-4 p-2 shadow-item mx-2 bg-white rounded-lg border-gray-200">
                  <Tab
                    className={({ selected }) =>
                      selected
                        ? 'px-3 py-2.5 whitespace-nowrap bg-[#e90089] text-white rounded-[10px] shadow-item2 cursor-pointer text-sm'
                        : 'px-3 py-2.5 whitespace-nowrap hover:shadow rounded-[10px] cursor-pointer text-sm'
                    }
                  >
                    دسته بندی محصولات
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      selected
                        ? 'px-3 py-2.5 whitespace-nowrap bg-[#e90089] text-white rounded-[10px] shadow-item2 cursor-pointer text-sm'
                        : 'px-3 py-2.5 whitespace-nowrap hover:shadow rounded-[10px] cursor-pointer text-sm'
                    }
                  >
                    ویژگی محصولات{' '}
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      selected
                        ? 'px-3 whitespace-nowrap py-2.5 text-sky-500 rounded cursor-pointer text-sm'
                        : 'px-3 whitespace-nowrap py-2.5 hover:shadow rounded-[10px] cursor-pointer text-sm'
                    }
                  >
                    برندها{' '}
                  </Tab>

                  <Tab
                    className={({ selected }) =>
                      selected
                        ? 'px-3 whitespace-nowrap py-2.5 text-sky-500 rounded cursor-pointer text-sm'
                        : 'px-3 whitespace-nowrap py-2.5 hover:shadow rounded-[10px] cursor-pointer text-sm'
                    }
                  >
                    زیورالات{' '}
                  </Tab>
                </Tab.List>

                <Tab.Panels className="mt-4 mb-4 overflow-auto rounded-lg shadow-item mx-2 bg-white">
                  <Tab.Panel>
                    <div>
                      {isShowSubCategories ? (
                        isLoadingSubCategory ? (
                          <TableSkeleton count={4} />
                        ) : (
                          <ParentSubCategoriesTree
                            subCategorySearchTerm={subCategorySearchTerm}
                            handleSearchSubCategoryChange={handleSearchSubCategoryChange}
                            isShowSubCategories={isShowSubCategories}
                            setIsShowSubCategories={setIsShowSubCategories}
                            categoryParent={categoryParent ?? ({} as ICategory)}
                            refetch={subRefetch}
                            subCategories={stateSubCategories}
                          />
                        )
                      ) : (
                        <div id="_adminCategories">
                          <div className="flex gap-y-4 pt-4 px-6 sm:flex-row flex-col items-center justify-between">
                            <h3>دسته بندی محصولات</h3>
                            <div className="flex flex-col xs:flex-row items-center gap-4">
                              <Button
                                onClick={categoryModalHandlers.open}
                                className="hover:bg-sky-600 bg-sky-500 px-3 py-2.5 text-sm whitespace-nowrap"
                              >
                                افزودن دسته بندی
                              </Button>
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
                          </div>
                          <hr className="mt-5 mb-6" />
                          <div className="px-3">
                            <DataStateDisplay
                              {...categoriesQueryProps}
                              refetch={refetch}
                              dataLength={(data && data?.data?.data?.length) || 0}
                              emptyComponent={<EmptyCustomList />}
                              loadingComponent={<TableSkeleton count={4} />}
                            >
                              <table className="w-[700px] md:w-[800px] lg:w-[900px] xl:w-full mx-auto">
                                <thead className="bg-sky-300">
                                  <tr>
                                    <th className="text-sm py-3 px-2  font-normal w-[70px] text-center">عکس</th>
                                    <th className="text-sm py-3 px-2 pr-0 text-gray-600 font-normal w-[150px] text-center">
                                      نام
                                    </th>
                                    <th className="text-sm py-3 px-2 text-gray-600 font-normal">سایزبندی</th>
                                    <th className="text-sm py-3 px-2 text-gray-600 font-normal w-[150px]">برند</th>
                                    <th className="text-sm py-3 px-2 text-gray-600 font-normal">زیردسته</th>
                                    <th className="text-sm py-3 px-2 text-gray-600 font-normal">محصولات مرتبط</th>
                                    <th className="text-sm py-3 px-2 text-gray-600 font-normal">وضعیت</th>
                                    <th className="text-sm py-3 px-2 text-gray-600 font-normal">عملیات</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {data?.data?.data &&
                                    data?.data?.data.map((category, index) => (
                                      <tr
                                        key={category.id}
                                        className={`h-16 border-b ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
                                      >
                                        <td className="">
                                          <img
                                            className="w-[50px] h-[50px] rounded mr-2"
                                            src={category.imagesSrc?.imageUrl}
                                            alt="p-img"
                                          />
                                        </td>
                                        <td className="text-center">
                                          <div
                                            onClick={() => handlerEditCategoryModal(category)}
                                            className="text-sm text-sky-500 cursor-pointer "
                                          >
                                            {category.name}
                                          </div>
                                        </td>
                                        <td className="text-center">
                                          <div
                                            className="text-sky-500 cursor-pointer"
                                            onClick={() => handlerEditSizeModal(category)}
                                          >
                                            {digitsEnToFa(category.sizeCount)}
                                          </div>
                                        </td>
                                        <td className="text-sm text-gray-600 text-center">{digitsEnToFa(0)}</td>
                                        <td className="text-center text-sm text-gray-600">
                                          {digitsEnToFa(countAllChildCategories(category))}
                                        </td>
                                        <td className="text-center text-sm text-gray-600">
                                          <div
                                            className="text-sky-500 cursor-pointer"
                                            onClick={() => handleChangePage(category.slug)}
                                          >
                                            {digitsEnToFa(category.count)}
                                          </div>
                                        </td>
                                        <td className="text-center">
                                          {category.isActive ? (
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
                                                  <button
                                                    onClick={() => handleChangeRouteToSubCategories(category)}
                                                    className="flex justify-start gap-x-2 px-3 py-2 hover:bg-gray-100 w-full"
                                                  >
                                                    <span>پیکربندی</span>
                                                  </button>
                                                </Menu.Item>
                                                <Menu.Item>
                                                  <button
                                                    onClick={() => handleDelete(category.id)}
                                                    className="flex justify-start gap-x-2 px-3 py-2 hover:bg-gray-100 w-full"
                                                  >
                                                    <span>حذف</span>
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

                            {data?.data?.data && data?.data?.data?.length > 0 && data.data?.data && (
                              <div className="mx-auto py-4 lg:max-w-5xl">
                                <Pagination pagination={data?.data} section="categoryPage" client />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </Tab.Panel>

                  <Tab.Panel>
                    <div id="_adminFeatures">
                      <div className="flex gap-y-4 pt-4 px-6 sm:flex-row flex-col items-center justify-between">
                        <h3>ویژگی محصولات</h3>
                        <div className="flex flex-col xs:flex-row items-center gap-4">
                          <Button
                            onClick={featureModalHandlers.open}
                            className="hover:bg-sky-600 bg-sky-500 px-3 py-2.5 text-sm whitespace-nowrap"
                          >
                            افزودن ویژگی
                          </Button>
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
                              value={featureSearchTerm}
                              onChange={handleFeatureSearchChange}
                            />
                          </div>
                        </div>
                      </div>
                      <hr className="mt-5 mb-6" />
                      <div className="px-3">
                        <DataStateDisplay
                          {...featuresQueryProps}
                          refetch={refetchFeatures}
                          dataLength={(featureData && featureData?.data?.data?.length) || 0}
                          emptyComponent={<EmptyCustomList />}
                          loadingComponent={<TableSkeleton count={4} />}
                        >
                          <table className="w-[700px] md:w-full mx-auto">
                            <thead className="bg-sky-300">
                              <tr>
                                <th className="text-sm py-3 px-2 pr-0 text-gray-600 font-normal w-[150px] text-start">
                                  <div className="pr-2">نام ویژگی</div>
                                </th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">مقدار</th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">محصولات مرتبط</th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">عملیات</th>
                              </tr>
                            </thead>
                            <tbody>
                              {featureData?.data?.data &&
                                featureData?.data?.data.map((feature, index) => (
                                  <tr
                                    key={feature.id}
                                    className={`h-16 border-b ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
                                  >
                                    <td className="text-start">
                                      <div
                                        onClick={() => handlerEditFeatureModal(feature)}
                                        className="text-sm text-sky-500 cursor-pointer px-2"
                                      >
                                        {feature.name}
                                      </div>
                                    </td>
                                    <td className="text-center">
                                      <div className="text-sky-500 cursor-pointer">
                                        {digitsEnToFa(feature.valueCount)}
                                      </div>
                                    </td>
                                    <td className="text-center text-sm text-gray-600">
                                      <div
                                        className="text-sky-500 cursor-pointer"
                                        onClick={() => handleChangePageFeature(feature.id)}
                                      >
                                        {digitsEnToFa(feature.count)}
                                      </div>
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
                                              <button
                                                // onClick={() => handleChangeRouteToSubCategories(feature)}
                                                className="flex justify-start gap-x-2 px-3 py-2 hover:bg-gray-100 w-full"
                                              >
                                                <span>پیکربندی</span>
                                              </button>
                                            </Menu.Item>
                                            <Menu.Item>
                                              <button
                                                onClick={() => handleDelete(feature.id)}
                                                className="flex justify-start gap-x-2 px-3 py-2 hover:bg-gray-100 w-full"
                                              >
                                                <span>حذف</span>
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

                        {featureData?.data?.data && featureData?.data?.data?.length > 0 && featureData.data?.data && (
                          <div className="mx-auto py-4 lg:max-w-5xl">
                            <Pagination pagination={featureData?.data} section="featurePage" client />
                          </div>
                        )}
                      </div>
                    </div>
                  </Tab.Panel>

                  <Tab.Panel>
                    <div>زباله </div>
                  </Tab.Panel>

                  <Tab.Panel>
                    <div>زباله </div>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
          </section>
        </DashboardLayout>
      </main>
    </>
  )
}
export default dynamic(() => Promise.resolve(ProductConfiguration), { ssr: false })
