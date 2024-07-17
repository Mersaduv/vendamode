import type { NextPage } from 'next'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { DashboardLayout } from '@/components/Layouts'
import { DataStateDisplay, HandleResponse } from '@/components/shared'
import { ProductSkeleton, TableSkeleton } from '@/components/skeleton'
import { EmptyCustomList } from '@/components/emptyList'
import { MenuAlt1 } from 'heroicons-react'
import { HiMenuAlt1 } from 'react-icons/hi'
import { digitsEnToFa } from '@persian-tools/persian-tools'
import { Menu, Tab, TabGroup, TabList, TabPanel, TabPanels, Transition } from '@headlessui/react'
import { useGetAllCategoriesQuery } from '@/services'
import { useRouter } from 'next/router'
import { ICategory, QueryParams } from '@/types'
import { useAppSelector, useChangeRoute, useDisclosure } from '@/hooks'
import { CategoryModal, SizesModal } from '@/components/modals'
import { Fragment, useEffect, useState } from 'react'
import { Pagination } from '@/components/navigation'
import { setUpdated } from '@/store'
import { useDispatch } from 'react-redux'
import { LuSearch } from 'react-icons/lu'
import { Button } from '@/components/ui'
const ProductConfiguration: NextPage = () => {
  // States
  const [isShowSizesModal, sizesModalHandlers] = useDisclosure()
  const [isShowCategoryModal, categoryModalHandlers] = useDisclosure()
  const [isShowEditCategoryModal, editCategoryModalHandlers] = useDisclosure()

  const [searchTerm, setSearchTerm] = useState('')
  const [stateCategory, setStateCategory] = useState<ICategory>()
  // ? Assets
  const { query, push } = useRouter()
  const dispatch = useDispatch()
  const isUpdated = useAppSelector((state) => state.stateUpdate.isUpdated)
  const { data, refetch, ...categoriesQueryProps } = useGetAllCategoriesQuery({
    pageSize: 5,
    page: query.page ? +query.page : 1,
    search: searchTerm,
  })

  const countAllChildCategories = (category: ICategory | undefined): number => {
    if (!category || !category.childCategories) return 0

    let totalCount = category.childCategories.length

    for (const childCategory of category.childCategories) {
      totalCount += countAllChildCategories(childCategory)
    }

    return totalCount
  }

  if (data) {
    console.log(data, 'data-data')
  }

  // ? Handlers
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleChangePage = (slugQuery: string) => {
    push(`/admin/products?category=${slugQuery}`)
  }

  const handlerEditCategoryModal = (category: ICategory) => {
    setStateCategory(category)
    editCategoryModalHandlers.open()
  }

  return (
    <>
      {stateCategory === undefined ? (
        <CategoryModal
          title="افزودن"
          refetch={refetch}
          isShow={isShowCategoryModal}
          onClose={() => {
            categoryModalHandlers.close()
            setStateCategory(undefined)
          }}
        />
      ) : (
        <CategoryModal
          title="ویرایش"
          refetch={refetch}
          category={stateCategory}
          isShow={isShowEditCategoryModal}
          onClose={() => {
            editCategoryModalHandlers.close()
            setStateCategory(undefined)
          }}
        />
      )}

      <main>
        <Head>
          <title>مدیریت | پیکربندی محصول</title>
        </Head>
        <DashboardLayout>
          <section className="w-full px-2 sm:px-6 pt-7">
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
                        ? 'px-3 whitespace-nowrap py-2.5  text-sky-500 rounded cursor-pointer text-sm'
                        : 'px-3 whitespace-nowrap py-2.5 hover:shadow rounded-[10px] cursor-pointer text-sm'
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

                <Tab.Panels className="mt-4 overflow-auto rounded-lg shadow-item mx-2 bg-white">
                  <Tab.Panel>
                    <div id="_adminCategories">
                      <div className="flex gap-y-4 pt-4 px-6 sm:flex-row flex-col items-center justify-between">
                        <h3>دسته بندی محصولات</h3>
                        <div className="flex items-center gap-x-4">
                          <Button
                            onClick={categoryModalHandlers.open}
                            className="hover:bg-sky-600 bg-sky-500 px-3 py-2.5 text-sm"
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
                                      <div className="text-sky-500 cursor-pointer" onClick={sizesModalHandlers.open}>
                                        {digitsEnToFa(category.sizeCount)}
                                      </div>
                                      <SizesModal
                                        refetch={refetch}
                                        category={category}
                                        isShow={isShowSizesModal}
                                        onClose={sizesModalHandlers.close}
                                      />
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
                                        {digitsEnToFa(0)}
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
                                              <Link
                                                href={`/admin/products/edit/${category.id}`}
                                                className="flex justify-start gap-x-2 px-3 py-2 hover:bg-gray-100 w-full"
                                              >
                                                <span>پیکربندی</span>
                                              </Link>
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
                            <Pagination pagination={data?.data} section="_adminCategories" client />
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
