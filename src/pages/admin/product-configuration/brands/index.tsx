import Head from 'next/head'
import dynamic from 'next/dynamic'
import { DashboardLayout, TabDashboardLayout } from '@/components/Layouts'
import type { NextPage } from 'next'
import { DataStateDisplay, HandleResponse } from '@/components/shared'
import { TableSkeleton } from '@/components/skeleton'
import { EmptyCustomList } from '@/components/emptyList'
import { digitsEnToFa } from '@persian-tools/persian-tools'
import { Menu, Tab, Transition } from '@headlessui/react'
import {
  useDeleteBrandMutation,
  useDeleteCategoryMutation,
  useDeleteFeatureMutation,
  useGetAllCategoriesQuery,
  useGetBrandsQuery,
  useGetFeaturesQuery,
  useGetParenSubCategoriesQuery,
} from '@/services'
import { useRouter } from 'next/router'
import { IBrand, ICategory } from '@/types'
import { useAppDispatch, useAppSelector, useDisclosure } from '@/hooks'
import {
  BrandModal,
  CategoryModal,
  CategoryUpdateModal,
  ConfirmDeleteModal,
  FeatureModal,
  SizesModal,
} from '@/components/modals'
import { Fragment, useEffect, useState } from 'react'
import { Pagination } from '@/components/navigation'
import { useDispatch } from 'react-redux'
import { LuSearch } from 'react-icons/lu'
import { Button } from '@/components/ui'
import { ParentSubCategoriesTree } from '@/components/categories'
import { FeatureValue, ProductFeature } from '@/services/feature/types'
import { showAlert } from '@/store'

const Brands: NextPage = () => {
  // States
  const [isShowBrandModal, brandModalHandlers] = useDisclosure()
  const [isShowEditBrandModal, editBrandModalHandlers] = useDisclosure()
  const [isShowConfirmDeleteModal, confirmDeleteModalHandlers] = useDisclosure()

  const [deleteInfo, setDeleteInfo] = useState({
    id: '',
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [stateBrand, setStateBrand] = useState<IBrand>()
  // ? Assets
  const dispatch = useAppDispatch()
  const { query, push } = useRouter()
  const featurePage = query.page ? +query.page : 1
  // ? Features Query
  const {
    data: brandData,
    refetch,
    ...brandsQueryProps
  } = useGetBrandsQuery({
    pageSize: 5,
    page: featurePage,
    search: searchTerm,
  })

  //*    Delete Category
  const [
    deleteBrand,
    {
      isSuccess: isSuccessDelete,
      isError: isErrorDelete,
      error: errorDelete,
      data: dataDelete,
      isLoading: isLoadingDelete,
    },
  ] = useDeleteBrandMutation()

  const handleChangePage = (id: string) => {
    push(`/admin/products?brands=${id}`)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handlerEditBrandModal = (brand: IBrand) => {
    setStateBrand(brand)
    editBrandModalHandlers.open()
  }

  //*   Delete Handlers
  const handleDelete = (brand: IBrand) => {
    if (brand.count !== 0) {
      return dispatch(
        showAlert({
          status: 'error',
          title: 'برند مد نظر دارایی محصول مرتبط است',
        })
      )
    } else {
      setDeleteInfo({ id: brand.id })
      confirmDeleteModalHandlers.open()
    }
  }

  const onCancel = () => {
    setDeleteInfo({ id: '' })
    confirmDeleteModalHandlers.close()
  }

  const onConfirm = () => {
    deleteBrand({ id: deleteInfo.id })
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

      <BrandModal
        title="افزودن"
        mode="create"
        refetch={refetch}
        isShow={isShowBrandModal}
        onClose={() => {
          brandModalHandlers.close()
        }}
      />

      <BrandModal
        title="بروزرسانی"
        mode="edit"
        refetch={refetch}
        brand={stateBrand}
        isShow={isShowEditBrandModal}
        onClose={() => {
          editBrandModalHandlers.close()
        }}
      />

      <ConfirmDeleteModal
        title="برند"
        isLoading={isLoadingDelete}
        isShow={isShowConfirmDeleteModal}
        onClose={confirmDeleteModalHandlers.close}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />

      <DashboardLayout>
        <TabDashboardLayout>
          <Head>
            <title>مدیریت | برندها</title>
          </Head>

          <div id="_adminBrands">
            <div className="">
              <Tab.Group>
                <Tab.List className="flex flex-col xl2:flex-row justify-between px-2 py-4 border-b gap-4 border-gray-200 overflow-auto">
                  <div className="flex flex-col items-start justify-center">
                    <h2 className="pr-4 pb-2">برندها</h2>
                    <div className="flex items-center">
                      <Tab
                        className={({ selected }) =>
                          `whitespace-nowrap ${
                            selected ? 'text-sky-500' : 'hover:text-sky-500'
                          } px-4 py-2 rounded cursor-pointer text-sm`
                        }
                      >
                        همه ({digitsEnToFa(brandData?.data?.data?.length ?? 0)})
                      </Tab>
                      <Tab
                        className={({ selected }) =>
                          `whitespace-nowrap ${
                            selected ? 'text-sky-500' : 'hover:text-sky-500'
                          } px-4 py-2 rounded cursor-pointer text-sm`
                        }
                      >
                        نمایش فعال ({digitsEnToFa(brandData?.data?.data?.filter((brand) => brand.isActive).length ?? 0)}
                        )
                      </Tab>
                      <Tab
                        className={({ selected }) =>
                          `whitespace-nowrap ${
                            selected ? 'text-sky-500' : 'hover:text-sky-500'
                          } px-4 py-2 rounded cursor-pointer text-sm`
                        }
                      >
                        نمایش غیرفعال (
                        {digitsEnToFa(brandData?.data?.data?.filter((brand) => !brand.isActive).length ?? 0)})
                      </Tab>
                      <Tab
                        className={({ selected }) =>
                          `whitespace-nowrap ${
                            selected ? 'text-sky-500' : 'hover:text-sky-500'
                          } px-4 py-2 rounded cursor-pointer text-sm`
                        }
                      >
                        اسلایدر فعال (
                        {digitsEnToFa(brandData?.data?.data?.filter((brand) => brand.inSlider).length ?? 0)})
                      </Tab>
                      <Tab
                        className={({ selected }) =>
                          `whitespace-nowrap ${
                            selected ? 'text-sky-500' : 'hover:text-sky-500'
                          } px-4 py-2 rounded cursor-pointer text-sm`
                        }
                      >
                        اسلایدر غیرفعال (
                        {digitsEnToFa(brandData?.data?.data?.filter((brand) => !brand.inSlider).length ?? 0)})
                      </Tab>
                      <Tab
                        className={({ selected }) =>
                          `whitespace-nowrap ${
                            selected ? 'text-sky-500' : 'hover:text-sky-500'
                          } px-4 py-2 rounded cursor-pointer text-sm`
                        }
                      >
                        زباله دان ({digitsEnToFa(brandData?.data?.data?.filter((brand) => brand.isDelete).length ?? 0)})
                      </Tab>
                    </div>
                  </div>{' '}
                  <div className="flex items-end px-3 pr-3 xl2:pr-0 gap-y-4 sm:flex-row flex-col justify-between">
                    <div className="flex flex-col xs:flex-row items-center gap-4">
                      <Button
                        onClick={brandModalHandlers.open}
                        className="hover:bg-sky-600 bg-sky-500 px-3 py-2.5 text-sm whitespace-nowrap"
                      >
                        افزودن برند
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
                </Tab.List>
                <Tab.Panels className="mt-3 rounded-xl bg-white p-3">
                  <Tab.Panel>
                    <div id="_adminBrandsAll">
                      <DataStateDisplay
                        {...brandsQueryProps}
                        refetch={refetch}
                        dataLength={(brandData && brandData?.data?.data?.length) || 0}
                        emptyComponent={<EmptyCustomList />}
                        loadingComponent={<TableSkeleton count={4} />}
                      >
                        <table className="w-[700px] md:w-full mx-auto">
                          <thead className="bg-sky-300">
                            <tr>
                              <th className="text-sm py-3 px-2 text-gray-600 font-normal">عکس</th>
                              <th className="text-sm py-3 px-2 pr-0 text-gray-600 font-normal w-[150px] text-center">
                                <div className="">نام برند</div>
                              </th>
                              <th className="text-sm py-3 px-2 text-gray-600 font-normal">نمایش در اسلایدر</th>
                              <th className="text-sm py-3 px-2 text-gray-600 font-normal">وضعیت</th>
                              <th className="text-sm py-3 px-2 text-gray-600 font-normal">محصولات مرتبط</th>
                              <th className="text-sm py-3 px-2 text-gray-600 font-normal">توضیحات</th>
                              <th className="text-sm py-3 px-2 text-gray-600 font-normal">عملیات</th>
                            </tr>
                          </thead>
                          <tbody>
                            {brandData?.data?.data &&
                              brandData?.data?.data.map((brand, index) => {
                                return (
                                  <tr key={brand.id} className={`h-16 border-b ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                                    <td className="">
                                      <div className="w-full flex justify-center">
                                        <img
                                          className="w-[100px] object-contain rounded-lg h-[70px]"
                                          src={brand.imagesSrc.imageUrl}
                                          alt={brand.name}
                                        />
                                      </div>
                                    </td>
                                    <td className="text-center">
                                      <div className="text-sm text-gray-700 cursor-pointer px-2">{brand.name}</div>
                                    </td>
                                    <td className="text-center">
                                      <div className="flex justify-center">
                                        {brand.inSlider ? (
                                          <div className="text-[#50cd89] font-semibold cursor-pointer bg-[#dcffed] w-[24px] h-[26px] pt-0.5 flex items-center justify-center rounded ">
                                            ✓
                                          </div>
                                        ) : (
                                          <div className="text-[#cd5050] text-lg font-semibold cursor-pointer bg-[#ffdcdc] w-[24px] h-[26px] pt-0.5 flex items-center justify-center rounded ">
                                            x
                                          </div>
                                        )}
                                      </div>{' '}
                                    </td>

                                    <td className="text-center">
                                      <div>
                                        {brand.isActive ? (
                                          <span className="text-sm text-[#50cd89] bg-[#dcffed] px-1.5 rounded font-medium">
                                            فعال
                                          </span>
                                        ) : (
                                          <span className="text-sm text-[#cd5050] bg-[#ffdcdc] px-1.5 rounded font-medium">
                                            غیر فعال
                                          </span>
                                        )}
                                      </div>
                                    </td>

                                    <td className="text-center text-sm text-gray-600">
                                      <div
                                        className="text-sky-500 cursor-pointer"
                                        onClick={() => handleChangePage(brand.id)}
                                      >
                                        {digitsEnToFa(brand.count)}
                                      </div>
                                    </td>

                                    <td className="text-center">
                                      <div className="text-sky-500 cursor-pointer">-</div>
                                    </td>
                                    <td className="text-center text-sm text-gray-600">
                                      <Menu as="div" className="dropdown">
                                        <Menu.Button className="">
                                          <div className="w-full flex justify-center items-center">
                                            <span className="text-2xl hover:bg-gray-300 cursor-pointer bg-gray-200 text-gray-700 p-1 pb-1.5 px-1.5 h-8 flex justify-center items-center rounded-md">
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
                                                onClick={() => handlerEditBrandModal(brand)}
                                                className="flex justify-start gap-x-2 px-3 py-2 hover:bg-gray-100 w-full"
                                              >
                                                <span>پیکربندی</span>
                                              </button>
                                            </Menu.Item>
                                            <Menu.Item>
                                              <button
                                                onClick={() => handleDelete(brand)}
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
                                )
                              })}
                          </tbody>
                        </table>
                      </DataStateDisplay>

                      {brandData?.data?.data && brandData?.data?.data?.length > 0 && brandData.data?.data && (
                        <div className="mx-auto py-4 lg:max-w-5xl">
                          <Pagination pagination={brandData?.data} section="_adminBrands" client />
                        </div>
                      )}
                    </div>
                  </Tab.Panel>
                  <Tab.Panel>
                    <div id="_adminBrandsActive">
                      <DataStateDisplay
                        {...brandsQueryProps}
                        refetch={refetch}
                        dataLength={(brandData && brandData?.data?.data?.length) || 0}
                        emptyComponent={<EmptyCustomList />}
                        loadingComponent={<TableSkeleton count={4} />}
                      >
                        <table className="w-[700px] md:w-full mx-auto">
                          <thead className="bg-sky-300">
                            <tr>
                              <th className="text-sm py-3 px-2 text-gray-600 font-normal">عکس</th>
                              <th className="text-sm py-3 px-2 pr-0 text-gray-600 font-normal w-[150px] text-center">
                                <div className="">نام برند</div>
                              </th>
                              <th className="text-sm py-3 px-2 text-gray-600 font-normal">نمایش در اسلایدر</th>
                              <th className="text-sm py-3 px-2 text-gray-600 font-normal">وضعیت</th>
                              <th className="text-sm py-3 px-2 text-gray-600 font-normal">محصولات مرتبط</th>
                              <th className="text-sm py-3 px-2 text-gray-600 font-normal">توضیحات</th>
                              <th className="text-sm py-3 px-2 text-gray-600 font-normal">عملیات</th>
                            </tr>
                          </thead>
                          <tbody>
                            {brandData?.data?.data &&
                              brandData?.data?.data
                                .filter((brand) => brand.isActive)
                                .map((brand, index) => {
                                  return (
                                    <tr
                                      key={brand.id}
                                      className={`h-16 border-b ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
                                    >
                                      <td className="">
                                        <div className="w-full flex justify-center">
                                          <img
                                            className="w-[100px] object-contain rounded-lg h-[70px]"
                                            src={brand.imagesSrc.imageUrl}
                                            alt={brand.name}
                                          />
                                        </div>
                                      </td>
                                      <td className="text-center">
                                        <div className="text-sm text-gray-700 cursor-pointer px-2">{brand.name}</div>
                                      </td>
                                      <td className="text-center">
                                        <div className="flex justify-center">
                                          {brand.inSlider ? (
                                            <div className="text-[#50cd89] font-semibold cursor-pointer bg-[#dcffed] w-[24px] h-[26px] pt-0.5 flex items-center justify-center rounded ">
                                              ✓
                                            </div>
                                          ) : (
                                            <div className="text-[#cd5050] text-lg font-semibold cursor-pointer bg-[#ffdcdc] w-[24px] h-[26px] pt-0.5 flex items-center justify-center rounded ">
                                              x
                                            </div>
                                          )}
                                        </div>{' '}
                                      </td>

                                      <td className="text-center">
                                        <div>
                                          {brand.isActive ? (
                                            <span className="text-sm text-[#50cd89] bg-[#dcffed] px-1.5 rounded font-medium">
                                              فعال
                                            </span>
                                          ) : (
                                            <span className="text-sm text-[#cd5050] bg-[#ffdcdc] px-1.5 rounded font-medium">
                                              غیر فعال
                                            </span>
                                          )}
                                        </div>
                                      </td>

                                      <td className="text-center text-sm text-gray-600">
                                        <div
                                          className="text-sky-500 cursor-pointer"
                                          onClick={() => handleChangePage(brand.id)}
                                        >
                                          {digitsEnToFa(brand.count)}
                                        </div>
                                      </td>

                                      <td className="text-center">
                                        <div className="text-sky-500 cursor-pointer">-</div>
                                      </td>
                                      <td className="text-center text-sm text-gray-600">
                                        <Menu as="div" className="dropdown">
                                          <Menu.Button className="">
                                            <div className="w-full flex justify-center items-center">
                                              <span className="text-2xl hover:bg-gray-300 cursor-pointer bg-gray-200 text-gray-700 p-1 pb-1.5 px-1.5 h-8 flex justify-center items-center rounded-md">
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
                                                  onClick={() => handlerEditBrandModal(brand)}
                                                  className="flex justify-start gap-x-2 px-3 py-2 hover:bg-gray-100 w-full"
                                                >
                                                  <span>پیکربندی</span>
                                                </button>
                                              </Menu.Item>
                                              <Menu.Item>
                                                <button
                                                  onClick={() => handleDelete(brand)}
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
                                  )
                                })}
                          </tbody>
                        </table>
                      </DataStateDisplay>
                      {brandData?.data?.data && brandData?.data?.data?.length > 0 && brandData.data?.data && (
                        <div className="mx-auto py-4 lg:max-w-5xl">
                          <Pagination pagination={brandData?.data} section="_adminBrandsActive" client />
                        </div>
                      )}
                    </div>
                  </Tab.Panel>
                  <Tab.Panel>
                    <div id="_adminBrandsInactive">
                      {' '}
                      <DataStateDisplay
                        {...brandsQueryProps}
                        refetch={refetch}
                        dataLength={(brandData && brandData?.data?.data?.length) || 0}
                        emptyComponent={<EmptyCustomList />}
                        loadingComponent={<TableSkeleton count={4} />}
                      >
                        <table className="w-[700px] md:w-full mx-auto">
                          <thead className="bg-sky-300">
                            <tr>
                              <th className="text-sm py-3 px-2 text-gray-600 font-normal">عکس</th>
                              <th className="text-sm py-3 px-2 pr-0 text-gray-600 font-normal w-[150px] text-center">
                                <div className="">نام برند</div>
                              </th>
                              <th className="text-sm py-3 px-2 text-gray-600 font-normal">نمایش در اسلایدر</th>
                              <th className="text-sm py-3 px-2 text-gray-600 font-normal">وضعیت</th>
                              <th className="text-sm py-3 px-2 text-gray-600 font-normal">محصولات مرتبط</th>
                              <th className="text-sm py-3 px-2 text-gray-600 font-normal">توضیحات</th>
                              <th className="text-sm py-3 px-2 text-gray-600 font-normal">عملیات</th>
                            </tr>
                          </thead>
                          <tbody>
                            {brandData?.data?.data &&
                              brandData?.data?.data
                                .filter((brand) => brand.isActive)
                                .map((brand, index) => {
                                  return (
                                    <tr
                                      key={brand.id}
                                      className={`h-16 border-b ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
                                    >
                                      <td className="">
                                        <div className="w-full flex justify-center">
                                          <img
                                            className="w-[100px] object-contain rounded-lg h-[70px]"
                                            src={brand.imagesSrc.imageUrl}
                                            alt={brand.name}
                                          />
                                        </div>
                                      </td>
                                      <td className="text-center">
                                        <div className="text-sm text-gray-700 cursor-pointer px-2">{brand.name}</div>
                                      </td>
                                      <td className="text-center">
                                        <div className="flex justify-center">
                                          {brand.inSlider ? (
                                            <div className="text-[#50cd89] font-semibold cursor-pointer bg-[#dcffed] w-[24px] h-[26px] pt-0.5 flex items-center justify-center rounded ">
                                              ✓
                                            </div>
                                          ) : (
                                            <div className="text-[#cd5050] text-lg font-semibold cursor-pointer bg-[#ffdcdc] w-[24px] h-[26px] pt-0.5 flex items-center justify-center rounded ">
                                              x
                                            </div>
                                          )}
                                        </div>{' '}
                                      </td>

                                      <td className="text-center">
                                        <div>
                                          {brand.isActive ? (
                                            <span className="text-sm text-[#50cd89] bg-[#dcffed] px-1.5 rounded font-medium">
                                              فعال
                                            </span>
                                          ) : (
                                            <span className="text-sm text-[#cd5050] bg-[#ffdcdc] px-1.5 rounded font-medium">
                                              غیر فعال
                                            </span>
                                          )}
                                        </div>
                                      </td>

                                      <td className="text-center text-sm text-gray-600">
                                        <div
                                          className="text-sky-500 cursor-pointer"
                                          onClick={() => handleChangePage(brand.id)}
                                        >
                                          {digitsEnToFa(brand.count)}
                                        </div>
                                      </td>

                                      <td className="text-center">
                                        <div className="text-sky-500 cursor-pointer">-</div>
                                      </td>
                                      <td className="text-center text-sm text-gray-600">
                                        <Menu as="div" className="dropdown">
                                          <Menu.Button className="">
                                            <div className="w-full flex justify-center items-center">
                                              <span className="text-2xl hover:bg-gray-300 cursor-pointer bg-gray-200 text-gray-700 p-1 pb-1.5 px-1.5 h-8 flex justify-center items-center rounded-md">
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
                                                  onClick={() => handlerEditBrandModal(brand)}
                                                  className="flex justify-start gap-x-2 px-3 py-2 hover:bg-gray-100 w-full"
                                                >
                                                  <span>پیکربندی</span>
                                                </button>
                                              </Menu.Item>
                                              <Menu.Item>
                                                <button
                                                  onClick={() => handleDelete(brand)}
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
                                  )
                                })}
                          </tbody>
                        </table>
                      </DataStateDisplay>
                      {brandData?.data?.data && brandData?.data?.data?.length > 0 && brandData.data?.data && (
                        <div className="mx-auto py-4 lg:max-w-5xl">
                          <Pagination pagination={brandData?.data} section="_adminBrandsInactive" client />
                        </div>
                      )}
                    </div>
                  </Tab.Panel>
                  <Tab.Panel>
                    <div id="_adminSliderActive">
                      {' '}
                      <DataStateDisplay
                        {...brandsQueryProps}
                        refetch={refetch}
                        dataLength={(brandData && brandData?.data?.data?.length) || 0}
                        emptyComponent={<EmptyCustomList />}
                        loadingComponent={<TableSkeleton count={4} />}
                      >
                        <table className="w-[700px] md:w-full mx-auto">
                          <thead className="bg-sky-300">
                            <tr>
                              <th className="text-sm py-3 px-2 text-gray-600 font-normal">عکس</th>
                              <th className="text-sm py-3 px-2 pr-0 text-gray-600 font-normal w-[150px] text-center">
                                <div className="">نام برند</div>
                              </th>
                              <th className="text-sm py-3 px-2 text-gray-600 font-normal">نمایش در اسلایدر</th>
                              <th className="text-sm py-3 px-2 text-gray-600 font-normal">وضعیت</th>
                              <th className="text-sm py-3 px-2 text-gray-600 font-normal">محصولات مرتبط</th>
                              <th className="text-sm py-3 px-2 text-gray-600 font-normal">توضیحات</th>
                              <th className="text-sm py-3 px-2 text-gray-600 font-normal">عملیات</th>
                            </tr>
                          </thead>
                          <tbody>
                            {brandData?.data?.data &&
                              brandData?.data?.data
                                .filter((brand) => brand.inSlider)
                                .map((brand, index) => {
                                  return (
                                    <tr
                                      key={brand.id}
                                      className={`h-16 border-b ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
                                    >
                                      <td className="">
                                        <div className="w-full flex justify-center">
                                          <img
                                            className="w-[100px] object-contain rounded-lg h-[70px]"
                                            src={brand.imagesSrc.imageUrl}
                                            alt={brand.name}
                                          />
                                        </div>
                                      </td>
                                      <td className="text-center">
                                        <div className="text-sm text-gray-700 cursor-pointer px-2">{brand.name}</div>
                                      </td>
                                      <td className="text-center">
                                        <div className="flex justify-center">
                                          {brand.inSlider ? (
                                            <div className="text-[#50cd89] font-semibold cursor-pointer bg-[#dcffed] w-[24px] h-[26px] pt-0.5 flex items-center justify-center rounded ">
                                              ✓
                                            </div>
                                          ) : (
                                            <div className="text-[#cd5050] text-lg font-semibold cursor-pointer bg-[#ffdcdc] w-[24px] h-[26px] pt-0.5 flex items-center justify-center rounded ">
                                              x
                                            </div>
                                          )}
                                        </div>{' '}
                                      </td>

                                      <td className="text-center">
                                        <div>
                                          {brand.isActive ? (
                                            <span className="text-sm text-[#50cd89] bg-[#dcffed] px-1.5 rounded font-medium">
                                              فعال
                                            </span>
                                          ) : (
                                            <span className="text-sm text-[#cd5050] bg-[#ffdcdc] px-1.5 rounded font-medium">
                                              غیر فعال
                                            </span>
                                          )}
                                        </div>
                                      </td>

                                      <td className="text-center text-sm text-gray-600">
                                        <div
                                          className="text-sky-500 cursor-pointer"
                                          onClick={() => handleChangePage(brand.id)}
                                        >
                                          {digitsEnToFa(brand.count)}
                                        </div>
                                      </td>

                                      <td className="text-center">
                                        <div className="text-sky-500 cursor-pointer">-</div>
                                      </td>
                                      <td className="text-center text-sm text-gray-600">
                                        <Menu as="div" className="dropdown">
                                          <Menu.Button className="">
                                            <div className="w-full flex justify-center items-center">
                                              <span className="text-2xl hover:bg-gray-300 cursor-pointer bg-gray-200 text-gray-700 p-1 pb-1.5 px-1.5 h-8 flex justify-center items-center rounded-md">
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
                                                  onClick={() => handlerEditBrandModal(brand)}
                                                  className="flex justify-start gap-x-2 px-3 py-2 hover:bg-gray-100 w-full"
                                                >
                                                  <span>پیکربندی</span>
                                                </button>
                                              </Menu.Item>
                                              <Menu.Item>
                                                <button
                                                  onClick={() => handleDelete(brand)}
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
                                  )
                                })}
                          </tbody>
                        </table>
                      </DataStateDisplay>
                      {brandData?.data?.data && brandData?.data?.data?.length > 0 && brandData.data?.data && (
                        <div className="mx-auto py-4 lg:max-w-5xl">
                          <Pagination pagination={brandData?.data} section="_adminSliderActive" client />
                        </div>
                      )}
                    </div>
                  </Tab.Panel>
                  <Tab.Panel>
                    <div id="_adminSliderInactive">
                      {' '}
                      <DataStateDisplay
                        {...brandsQueryProps}
                        refetch={refetch}
                        dataLength={(brandData && brandData?.data?.data?.length) || 0}
                        emptyComponent={<EmptyCustomList />}
                        loadingComponent={<TableSkeleton count={4} />}
                      >
                        <table className="w-[700px] md:w-full mx-auto">
                          <thead className="bg-sky-300">
                            <tr>
                              <th className="text-sm py-3 px-2 text-gray-600 font-normal">عکس</th>
                              <th className="text-sm py-3 px-2 pr-0 text-gray-600 font-normal w-[150px] text-center">
                                <div className="">نام برند</div>
                              </th>
                              <th className="text-sm py-3 px-2 text-gray-600 font-normal">نمایش در اسلایدر</th>
                              <th className="text-sm py-3 px-2 text-gray-600 font-normal">وضعیت</th>
                              <th className="text-sm py-3 px-2 text-gray-600 font-normal">محصولات مرتبط</th>
                              <th className="text-sm py-3 px-2 text-gray-600 font-normal">توضیحات</th>
                              <th className="text-sm py-3 px-2 text-gray-600 font-normal">عملیات</th>
                            </tr>
                          </thead>
                          <tbody>
                            {brandData?.data?.data &&
                              brandData?.data?.data
                                .filter((brand) => !brand.inSlider)
                                .map((brand, index) => {
                                  return (
                                    <tr
                                      key={brand.id}
                                      className={`h-16 border-b ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
                                    >
                                      <td className="">
                                        <div className="w-full flex justify-center">
                                          <img
                                            className="w-[100px] object-contain rounded-lg h-[70px]"
                                            src={brand.imagesSrc.imageUrl}
                                            alt={brand.name}
                                          />
                                        </div>
                                      </td>
                                      <td className="text-center">
                                        <div className="text-sm text-gray-700 cursor-pointer px-2">{brand.name}</div>
                                      </td>
                                      <td className="text-center">
                                        <div className="flex justify-center">
                                          {brand.inSlider ? (
                                            <div className="text-[#50cd89] font-semibold cursor-pointer bg-[#dcffed] w-[24px] h-[26px] pt-0.5 flex items-center justify-center rounded ">
                                              ✓
                                            </div>
                                          ) : (
                                            <div className="text-[#cd5050] text-lg font-semibold cursor-pointer bg-[#ffdcdc] w-[24px] h-[26px] pt-0.5 flex items-center justify-center rounded ">
                                              x
                                            </div>
                                          )}
                                        </div>{' '}
                                      </td>

                                      <td className="text-center">
                                        <div>
                                          {brand.isActive ? (
                                            <span className="text-sm text-[#50cd89] bg-[#dcffed] px-1.5 rounded font-medium">
                                              فعال
                                            </span>
                                          ) : (
                                            <span className="text-sm text-[#cd5050] bg-[#ffdcdc] px-1.5 rounded font-medium">
                                              غیر فعال
                                            </span>
                                          )}
                                        </div>
                                      </td>

                                      <td className="text-center text-sm text-gray-600">
                                        <div
                                          className="text-sky-500 cursor-pointer"
                                          onClick={() => handleChangePage(brand.id)}
                                        >
                                          {digitsEnToFa(brand.count)}
                                        </div>
                                      </td>

                                      <td className="text-center">
                                        <div className="text-sky-500 cursor-pointer">-</div>
                                      </td>
                                      <td className="text-center text-sm text-gray-600">
                                        <Menu as="div" className="dropdown">
                                          <Menu.Button className="">
                                            <div className="w-full flex justify-center items-center">
                                              <span className="text-2xl hover:bg-gray-300 cursor-pointer bg-gray-200 text-gray-700 p-1 pb-1.5 px-1.5 h-8 flex justify-center items-center rounded-md">
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
                                                  onClick={() => handlerEditBrandModal(brand)}
                                                  className="flex justify-start gap-x-2 px-3 py-2 hover:bg-gray-100 w-full"
                                                >
                                                  <span>پیکربندی</span>
                                                </button>
                                              </Menu.Item>
                                              <Menu.Item>
                                                <button
                                                  onClick={() => handleDelete(brand)}
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
                                  )
                                })}
                          </tbody>
                        </table>
                      </DataStateDisplay>
                      {brandData?.data?.data && brandData?.data?.data?.length > 0 && brandData.data?.data && (
                        <div className="mx-auto py-4 lg:max-w-5xl">
                          <Pagination pagination={brandData?.data} section="_adminSliderInactive" client />
                        </div>
                      )}
                    </div>
                  </Tab.Panel>
                  <Tab.Panel>
                    <div id="_adminTrash">
                      {' '}
                      <DataStateDisplay
                        {...brandsQueryProps}
                        refetch={refetch}
                        dataLength={(brandData && brandData?.data?.data?.length) || 0}
                        emptyComponent={<EmptyCustomList />}
                        loadingComponent={<TableSkeleton count={4} />}
                      >
                        <table className="w-[700px] md:w-full mx-auto">
                          <thead className="bg-sky-300">
                            <tr>
                              <th className="text-sm py-3 px-2 text-gray-600 font-normal">عکس</th>
                              <th className="text-sm py-3 px-2 pr-0 text-gray-600 font-normal w-[150px] text-center">
                                <div className="">نام برند</div>
                              </th>
                              <th className="text-sm py-3 px-2 text-gray-600 font-normal">نمایش در اسلایدر</th>
                              <th className="text-sm py-3 px-2 text-gray-600 font-normal">وضعیت</th>
                              <th className="text-sm py-3 px-2 text-gray-600 font-normal">محصولات مرتبط</th>
                              <th className="text-sm py-3 px-2 text-gray-600 font-normal">توضیحات</th>
                              <th className="text-sm py-3 px-2 text-gray-600 font-normal">عملیات</th>
                            </tr>
                          </thead>
                          <tbody>
                            {brandData?.data?.data &&
                              brandData?.data?.data
                                .filter((brand) => brand.isDelete)
                                .map((brand, index) => {
                                  return (
                                    <tr
                                      key={brand.id}
                                      className={`h-16 border-b ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
                                    >
                                      <td className="">
                                        <div className="w-full flex justify-center">
                                          <img
                                            className="w-[100px] object-contain rounded-lg h-[70px]"
                                            src={brand.imagesSrc.imageUrl}
                                            alt={brand.name}
                                          />
                                        </div>
                                      </td>
                                      <td className="text-center">
                                        <div className="text-sm text-gray-700 cursor-pointer px-2">{brand.name}</div>
                                      </td>
                                      <td className="text-center">
                                        <div className="flex justify-center">
                                          {brand.inSlider ? (
                                            <div className="text-[#50cd89] font-semibold cursor-pointer bg-[#dcffed] w-[24px] h-[26px] pt-0.5 flex items-center justify-center rounded ">
                                              ✓
                                            </div>
                                          ) : (
                                            <div className="text-[#cd5050] text-lg font-semibold cursor-pointer bg-[#ffdcdc] w-[24px] h-[26px] pt-0.5 flex items-center justify-center rounded ">
                                              x
                                            </div>
                                          )}
                                        </div>{' '}
                                      </td>

                                      <td className="text-center">
                                        <div>
                                          {brand.isActive ? (
                                            <span className="text-sm text-[#50cd89] bg-[#dcffed] px-1.5 rounded font-medium">
                                              فعال
                                            </span>
                                          ) : (
                                            <span className="text-sm text-[#cd5050] bg-[#ffdcdc] px-1.5 rounded font-medium">
                                              غیر فعال
                                            </span>
                                          )}
                                        </div>
                                      </td>

                                      <td className="text-center text-sm text-gray-600">
                                        <div
                                          className="text-sky-500 cursor-pointer"
                                          onClick={() => handleChangePage(brand.id)}
                                        >
                                          {digitsEnToFa(brand.count)}
                                        </div>
                                      </td>

                                      <td className="text-center">
                                        <div className="text-sky-500 cursor-pointer">-</div>
                                      </td>
                                      <td className="text-center text-sm text-gray-600">
                                        <Menu as="div" className="dropdown">
                                          <Menu.Button className="">
                                            <div className="w-full flex justify-center items-center">
                                              <span className="text-2xl hover:bg-gray-300 cursor-pointer bg-gray-200 text-gray-700 p-1 pb-1.5 px-1.5 h-8 flex justify-center items-center rounded-md">
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
                                                  onClick={() => handlerEditBrandModal(brand)}
                                                  className="flex justify-start gap-x-2 px-3 py-2 hover:bg-gray-100 w-full"
                                                >
                                                  <span>پیکربندی</span>
                                                </button>
                                              </Menu.Item>
                                              <Menu.Item>
                                                <button
                                                  onClick={() => handleDelete(brand)}
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
                                  )
                                })}
                          </tbody>
                        </table>
                      </DataStateDisplay>
                      {brandData?.data?.data && brandData?.data?.data?.length > 0 && brandData.data?.data && (
                        <div className="mx-auto py-4 lg:max-w-5xl">
                          <Pagination pagination={brandData?.data} section="_adminTrash" client />
                        </div>
                      )}
                    </div>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
          </div>
        </TabDashboardLayout>
      </DashboardLayout>
    </>
  )
}

export default dynamic(() => Promise.resolve(Brands), { ssr: false })
