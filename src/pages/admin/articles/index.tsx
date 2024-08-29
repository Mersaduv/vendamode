import type { NextPage } from 'next'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { DashboardLayout } from '@/components/Layouts'
import {
  useDeleteArticleMutation,
  useDeleteTrashArticleMutation,
  useGetArticlesQuery,
  useRestoreArticleMutation,
} from '@/services'
import { Fragment, useEffect, useState } from 'react'
import { GetArticlesResult } from '@/services/design/types'
import { DataStateDisplay, HandleResponse } from '@/components/shared'
import { useAppSelector, useDisclosure } from '@/hooks'
import { ConfirmDeleteModal, ConfirmUpdateModal } from '@/components/modals'
import { Menu, Tab, TabGroup, TabList, TabPanel, TabPanels, Transition } from '@headlessui/react'
import { ArrowDown } from '@/icons'
import { digitsEnToFa } from '@persian-tools/persian-tools'
import { IArticle } from '@/types'
import { TableSkeleton } from '@/components/skeleton'
import { Pagination } from '@/components/navigation'
import { LuSearch } from 'react-icons/lu'

const Articles: NextPage = () => {
  // ? Assets
  const { query, push } = useRouter()
  const articlePage = query.page ? +query.page : 1
  // ? States
  const { name } = useAppSelector((state) => state.stateString)
  const [tabKey, setTabKey] = useState('allArticles')
  const [deleteInfo, setDeleteInfo] = useState({
    id: '',
  })
  const [deleteTrashInfo, setDeleteTrashInfo] = useState({
    id: '',
  })
  const [restoreInfo, setRestoreInfo] = useState({
    id: '',
  })
  const [selectedPlace, setSelectedPlace] = useState<string | undefined>(undefined)
  const [selectedPlaceNum, setSelectedPlaceNum] = useState<string | undefined>(undefined)
  const [searchTerm, setSearchTerm] = useState('')

  const [isShowConfirmDeleteModal, confirmDeleteModalHandlers] = useDisclosure()
  const [isShowConfirmTrashDeleteModal, confirmTrashDeleteModalHandlers] = useDisclosure()
  const [isShowConfirmUpdateModal, confirmUpdateModalHandlers] = useDisclosure()

  // ? Querirs
  //* Get Articles Data
  const [articlesPagination, setArticlesPagination] = useState<GetArticlesResult>()
  const [articlesActivePagination, setArticlesActivePagination] = useState<GetArticlesResult>()
  const [articlesInActivePagination, setArticlesInActivePagination] = useState<GetArticlesResult>()
  const [articlesIsDeletedPagination, setArticlesIsDeletedPagination] = useState<GetArticlesResult>()

  const useFetchArticles = (status: string) => {
    const commonQueryParams = {
      sortBy: 'LastUpdated',
      pageSize: 20,
      page: articlePage,
      search: searchTerm,
      place: selectedPlaceNum,
      isActive: status === 'isActive',
      inActive: status === 'inActive',
      isDeleted: status === 'isDeleted',
      adminList: status === 'adminList',
    }
    const { data, isError, isFetching, isSuccess, refetch } = useGetArticlesQuery({ ...commonQueryParams })

    return {
      data,
      isError,
      isFetching,
      isSuccess,
      refetch,
    }
  }

  const {
    data: allArticles,
    isError: isAllArticlesError,
    isFetching: isAllArticlesFetching,
    isSuccess: isAllArticlesSuccess,
    refetch: refetchAllArticles,
  } = useFetchArticles('adminList')
  const {
    data: activeArticles,
    isError: isActiveArticlesError,
    isFetching: isActiveArticlesFetching,
    isSuccess: isActiveArticlesSuccess,
    refetch: refetchActiveArticles,
  } = useFetchArticles('isActive')
  const {
    data: inactiveArticles,
    isError: isInactiveArticlesError,
    isFetching: isInactiveArticlesFetching,
    isSuccess: isInactiveArticlesSuccess,
    refetch: refetchInactiveArticles,
  } = useFetchArticles('inActive')
  const {
    data: deletedArticles,
    isError: isDeletedArticlesError,
    isFetching: isDeletedArticlesFetching,
    isSuccess: isDeletedArticlesSuccess,
    refetch: refetchDeletedArticles,
  } = useFetchArticles('isDeleted')

  useEffect(() => {
    console.log(allArticles, 'allArticles')

    if (allArticles) setArticlesPagination(allArticles)
  }, [allArticles])

  useEffect(() => {
    console.log(activeArticles, 'activeArticles')

    if (activeArticles) setArticlesActivePagination(activeArticles)
  }, [activeArticles])

  useEffect(() => {
    console.log(inactiveArticles, 'inactiveArticles')

    if (inactiveArticles) setArticlesInActivePagination(inactiveArticles)
  }, [inactiveArticles])

  useEffect(() => {
    console.log(deletedArticles, 'deletedArticles')

    if (deletedArticles) setArticlesIsDeletedPagination(deletedArticles)
  }, [deletedArticles])

  useEffect(() => {
    switch (name) {
      case 'allArticles':
        setTabKey('allArticles')
        break
      case 'activeArticles':
        setTabKey('activeArticles')
        break
      case 'inactiveArticles':
        setTabKey('inactiveArticles')
        break
      case 'deletedArticles':
        setTabKey('deletedArticles')
        break
      default:
        setTabKey('allArticles')
    }
  }, [name])

  //*    Delete Article
  const [
    deleteArticle,
    {
      isSuccess: isSuccessDelete,
      isError: isErrorDelete,
      error: errorDelete,
      data: dataDelete,
      isLoading: isLoadingDelete,
    },
  ] = useDeleteArticleMutation()
  const [
    deleteTrashArticle,
    {
      isSuccess: isSuccessTrashDelete,
      isError: isErrorTrashDelete,
      error: errorTrashDelete,
      data: dataTrashDelete,
      isLoading: isLoadingTrashDelete,
    },
  ] = useDeleteTrashArticleMutation()

  const [
    restoreArticle,
    {
      isSuccess: isSuccessRestore,
      isError: isErrorRestore,
      error: errorRestore,
      data: dataRestore,
      isLoading: isLoadingRestore,
    },
  ] = useRestoreArticleMutation()

  // ? Handlers
  const handleFilterClick = () => {
    setSelectedPlaceNum(selectedPlace !== undefined ? selectedPlace : undefined)
  }
  const handlePlaceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPlace = event.target.value
    setSelectedPlace(selectedPlace !== '' ? selectedPlace : undefined)
  }
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }
  const CheckPlaceArticle = (place: number) => {
    let placeString = ''
    switch (place) {
      case 0:
        placeString = '-'
        break
      case 1:
        placeString = 'خواندنی ها'
        break
      case 2:
        placeString = 'فروش در وندامد'
        break
      case 3:
        placeString = 'با وندامد'
        break
      case 4:
        placeString = 'خرید از وندامد'
        break

      default:
        placeString = '-'
        break
    }

    return placeString
  }

  //*  Restore Handlers
  const handleRestoreTrash = (id: string) => {
    setRestoreInfo({ id })
    confirmUpdateModalHandlers.open()
  }
  const onConfirmRestore = () => {
    restoreArticle({ id: restoreInfo.id })
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
    deleteTrashArticle({ id: deleteTrashInfo.id })
  }
  const onConfirmDelete = () => {
    deleteArticle({ id: deleteInfo.id })
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
  const handleAllRefetch = () => {
    refetchAllArticles()
    refetchDeletedArticles()
    refetchInactiveArticles()
    refetchActiveArticles()
  }

  return (
    <>
      {/* Handle Delete Trash Article Response */}
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
      {/* Handle Delete Article Response */}
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

      {/* Handle restore Article Response */}
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
      {/* Confirm Delete Trash Article Modal */}
      <ConfirmDeleteModal
        title="مقاله در زباله‌دان"
        isLoading={isLoadingTrashDelete}
        isShow={isShowConfirmTrashDeleteModal}
        onClose={confirmTrashDeleteModalHandlers.close}
        onCancel={onCancel}
        onConfirm={onConfirmTrashDelete}
      />

      <ConfirmUpdateModal
        title="مقاله"
        isLoading={isLoadingRestore}
        isShow={isShowConfirmUpdateModal}
        onClose={confirmUpdateModalHandlers.close}
        onConfirm={onConfirmRestore}
        onCancel={onCancel}
      />
      {/* Confirm Delete Article Modal */}
      <ConfirmDeleteModal
        title="مقاله"
        deleted
        isLoading={isLoadingDelete}
        isShow={isShowConfirmDeleteModal}
        onClose={confirmDeleteModalHandlers.close}
        onCancel={onCancel}
        onConfirm={onConfirmDelete}
      />
      <main>
        <Head>
          <title>مدیریت | مقالات</title>
        </Head>
        <DashboardLayout>
          <section className="w-full mt-7 flex flex-col">
            <div className="mx-3 bg-white rounded-xl shadow-item">
              <div className="flex justify-between">
                <h2 className="p-4 text-gray-600">همه مقالات</h2>
                {/* filter control  */}
                <div className="flex justify-end px-4 gap-x-6 gap-y-2.5 flex-wrap py-4">
                  {/* category filter */}
                  <div className="flex border w-fit rounded-lg">
                    <select
                      className="w-44 text-sm focus:outline-none appearance-none border-none rounded-r-lg"
                      name="انتخاب"
                      id=""
                      onChange={handlePlaceChange}
                    >
                      <option className="appearance-none text-sm" value="0">
                        همه مقالات
                      </option>

                      <option value={'1'}>خواندنی ها</option>
                      <option value={'2'}>فروش در وندامد</option>
                      <option value={'3'}>با وندامد</option>
                      <option value={'4'}>خرید از وندامد</option>
                    </select>
                    <div
                      className="bg-gray-100 hover:bg-gray-200 mr-[1px] rounded-l-md text-sm flex justify-center cursor-pointer items-center w-14"
                      onClick={handleFilterClick}
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
              </div>

              {/* tab changed  */}
              <div className="relative overflow-x-auto min-h-96">
                <Tab.Group
                  selectedIndex={
                    tabKey === 'allArticles'
                      ? 0
                      : tabKey === 'activeArticles'
                      ? 1
                      : tabKey === 'inactiveArticles'
                      ? 2
                      : tabKey === 'deletedArticles'
                      ? 3
                      : 0
                  }
                  onChange={(index) => {
                    switch (index) {
                      case 0:
                        setTabKey('allArticles')
                        break
                      case 1:
                        setTabKey('activeArticles')
                        break
                      case 2:
                        setTabKey('inactiveArticles')
                        break
                      case 3:
                        setTabKey('deletedArticles')
                        break
                      default:
                        setTabKey('allArticles')
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
                      همه ({digitsEnToFa(articlesPagination?.data?.totalCount ?? 0)})
                    </Tab>
                    <Tab
                      className={({ selected }) =>
                        selected
                          ? 'px-4 py-2 text-sky-500 rounded cursor-pointer text-sm'
                          : 'px-4 py-2 hover:text-sky-500 rounded cursor-pointer text-sm'
                      }
                    >
                      فعال ({digitsEnToFa(articlesActivePagination?.data?.totalCount ?? 0)})
                    </Tab>
                    <Tab
                      className={({ selected }) =>
                        selected
                          ? 'px-4 py-2 text-sky-500 rounded cursor-pointer text-sm'
                          : 'px-4 py-2 hover:text-sky-500 rounded cursor-pointer text-sm'
                      }
                    >
                      غیرفعال ({digitsEnToFa(articlesInActivePagination?.data?.totalCount ?? 0)})
                    </Tab>
                    <Tab
                      className={({ selected }) =>
                        selected
                          ? 'px-4 py-2 text-sky-500 rounded cursor-pointer text-sm'
                          : 'px-4 py-2 hover:text-sky-500 rounded cursor-pointer text-sm'
                      }
                    >
                      زباله دان ({digitsEnToFa(articlesIsDeletedPagination?.data?.totalCount ?? 0)})
                    </Tab>
                  </Tab.List>

                  <Tab.Panels className="mt-3 p-3">
                    <Tab.Panel>
                      <div id="_adminArticle">
                        <DataStateDisplay
                          isError={isAllArticlesError}
                          refetch={refetchAllArticles}
                          isFetching={isAllArticlesFetching}
                          isSuccess={isAllArticlesSuccess}
                          dataLength={articlesPagination?.data?.data ? articlesPagination.data?.data.length : 0}
                          loadingComponent={<TableSkeleton count={20} />}
                        >
                          <table className="w-[780px] md:w-full mx-auto">
                            <thead className="bg-sky-300">
                              <tr>
                                <th className="text-sm py-3 px-2 font-normal w-[130px] text-center text-gray-600 ">
                                  عکس
                                </th>
                                <th className="text-sm py-3 px-2 pr-0 text-gray-600 font-normal w-[150px] text-start">
                                  عنوان
                                </th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">کد مقاله</th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">جایگاه</th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">دسته بندی </th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">دیدگاه</th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">نویسنده</th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">وضعیت</th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">عملیات</th>
                              </tr>
                            </thead>
                            <tbody>
                              {articlesPagination?.data?.data &&
                                articlesPagination?.data?.data.map((article, index) => (
                                  <tr
                                    key={article.id}
                                    className={`h-16 border-b ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
                                  >
                                    <td>
                                      <img
                                        className="w-[108px] h-[70px] rounded-md my-2 mr-2"
                                        src={article.image.imageUrl}
                                        alt="a-img"
                                      />
                                    </td>
                                    <td className="text-sm text-gray-600 ">
                                      <Link className="text-sky-500" href={`/articles/${article.slug}`}>
                                        {article.title}
                                      </Link>
                                    </td>
                                    <td className="text-center text-sm text-gray-600">{digitsEnToFa(article.code)}</td>
                                    <td className="text-center text-sm text-gray-600">
                                      {digitsEnToFa(CheckPlaceArticle(article.place))}
                                    </td>
                                    <td className="text-center text-sm text-gray-600">
                                      {article.category === '' ? <span className="text-lg">-</span> : article.category}
                                    </td>
                                    <td className="text-center text-sm text-gray-600">
                                      {digitsEnToFa(article.numReviews)}
                                    </td>
                                    <td className="text-center text-sm text-gray-600">{article.author}</td>
                                    <td className="text-center">
                                      {article.isActive ? (
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
                                                    href={`/admin/articles/edit/${article.id}`}
                                                    onClick={close}
                                                    className="flex justify-start gap-x-2 px-3 py-2 hover:bg-gray-100 w-full"
                                                  >
                                                    <span>ویرایش</span>
                                                  </Link>
                                                  <button
                                                    onClick={() => {
                                                      handleDeleteTrash(article.id)
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

                        {articlesPagination &&
                          articlesPagination.data &&
                          articlesPagination?.data?.data &&
                          articlesPagination?.data?.data?.length > 0 && (
                            <div className="mx-auto py-4 lg:max-w-5xl">
                              <Pagination pagination={articlesPagination?.data} section="_adminArticle" client />
                            </div>
                          )}
                      </div>
                    </Tab.Panel>
                    <Tab.Panel>
                      <div id="_adminActiveArticle">
                        <DataStateDisplay
                          isError={isActiveArticlesError}
                          refetch={refetchActiveArticles}
                          isFetching={isActiveArticlesFetching}
                          isSuccess={isActiveArticlesSuccess}
                          dataLength={
                            articlesActivePagination?.data?.data ? articlesActivePagination.data?.data.length : 0
                          }
                          loadingComponent={<TableSkeleton count={20} />}
                        >
                          <table className="w-[780px] md:w-full mx-auto">
                            <thead className="bg-sky-300">
                              <tr>
                                <th className="text-sm py-3 px-2 font-normal w-[130px] text-center text-gray-600 ">
                                  عکس
                                </th>
                                <th className="text-sm py-3 px-2 pr-0 text-gray-600 font-normal w-[150px] text-start">
                                  عنوان
                                </th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">کد مقاله</th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">جایگاه</th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">دسته بندی </th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">دیدگاه</th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">نویسنده</th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">وضعیت</th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">عملیات</th>
                              </tr>
                            </thead>
                            <tbody>
                              {articlesActivePagination?.data?.data &&
                                articlesActivePagination?.data?.data.map((article, index) => (
                                  <tr
                                    key={article.id}
                                    className={`h-16 border-b ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
                                  >
                                    <td>
                                      <img
                                        className="w-[108px] h-[70px] rounded-md my-2 mr-2"
                                        src={article.image.imageUrl}
                                        alt="a-img"
                                      />
                                    </td>
                                    <td className="text-sm text-gray-600 ">
                                      <Link className="text-sky-500" href={`/articles/${article.slug}`}>
                                        {article.title}
                                      </Link>
                                    </td>
                                    <td className="text-center text-sm text-gray-600">{digitsEnToFa(article.code)}</td>
                                    <td className="text-center text-sm text-gray-600">
                                      {digitsEnToFa(CheckPlaceArticle(article.place))}
                                    </td>
                                    <td className="text-center text-sm text-gray-600">
                                      {article.category === '' ? <span className="text-lg">-</span> : article.category}
                                    </td>
                                    <td className="text-center text-sm text-gray-600">
                                      {digitsEnToFa(article.numReviews)}
                                    </td>
                                    <td className="text-center text-sm text-gray-600">{article.author}</td>
                                    <td className="text-center">
                                      {article.isActive ? (
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
                                                    href={`/admin/articles/edit/${article.id}`}
                                                    onClick={close}
                                                    className="flex justify-start gap-x-2 px-3 py-2 hover:bg-gray-100 w-full"
                                                  >
                                                    <span>ویرایش</span>
                                                  </Link>
                                                  <button
                                                    onClick={() => {
                                                      handleDeleteTrash(article.id)
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

                        {articlesActivePagination &&
                          articlesActivePagination.data &&
                          articlesActivePagination?.data?.data &&
                          articlesActivePagination?.data?.data?.length > 0 && (
                            <div className="mx-auto py-4 lg:max-w-5xl">
                              <Pagination
                                pagination={articlesActivePagination?.data}
                                section="_adminActiveArticle"
                                client
                              />
                            </div>
                          )}
                      </div>
                    </Tab.Panel>
                    <Tab.Panel>
                      <div id="_adminInActiveArticle">
                        <DataStateDisplay
                          isError={isInactiveArticlesError}
                          refetch={refetchInactiveArticles}
                          isFetching={isInactiveArticlesFetching}
                          isSuccess={isInactiveArticlesSuccess}
                          dataLength={
                            articlesInActivePagination?.data?.data ? articlesInActivePagination.data?.data.length : 0
                          }
                          loadingComponent={<TableSkeleton count={20} />}
                        >
                          <table className="w-[780px] md:w-full mx-auto">
                            <thead className="bg-sky-300">
                              <tr>
                                <th className="text-sm py-3 px-2 font-normal w-[130px] text-center text-gray-600 ">
                                  عکس
                                </th>
                                <th className="text-sm py-3 px-2 pr-0 text-gray-600 font-normal w-[150px] text-start">
                                  عنوان
                                </th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">کد مقاله</th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">جایگاه</th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">دسته بندی </th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">دیدگاه</th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">نویسنده</th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">وضعیت</th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">عملیات</th>
                              </tr>
                            </thead>
                            <tbody>
                              {articlesInActivePagination?.data?.data &&
                                articlesInActivePagination?.data?.data.map((article, index) => (
                                  <tr
                                    key={article.id}
                                    className={`h-16 border-b ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
                                  >
                                    <td>
                                      <img
                                        className="w-[108px] h-[70px] rounded-md my-2 mr-2"
                                        src={article.image.imageUrl}
                                        alt="a-img"
                                      />
                                    </td>
                                    <td className="text-sm text-gray-600 ">
                                      <Link className="text-sky-500" href={`/articles/${article.slug}`}>
                                        {article.title}
                                      </Link>
                                    </td>
                                    <td className="text-center text-sm text-gray-600">{digitsEnToFa(article.code)}</td>
                                    <td className="text-center text-sm text-gray-600">
                                      {digitsEnToFa(CheckPlaceArticle(article.place))}
                                    </td>
                                    <td className="text-center text-sm text-gray-600">
                                      {article.category === '' ? <span className="text-lg">-</span> : article.category}
                                    </td>
                                    <td className="text-center text-sm text-gray-600">
                                      {digitsEnToFa(article.numReviews)}
                                    </td>
                                    <td className="text-center text-sm text-gray-600">{article.author}</td>
                                    <td className="text-center">
                                      {article.isActive ? (
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
                                                    href={`/admin/articles/edit/${article.id}`}
                                                    onClick={close}
                                                    className="flex justify-start gap-x-2 px-3 py-2 hover:bg-gray-100 w-full"
                                                  >
                                                    <span>ویرایش</span>
                                                  </Link>
                                                  <button
                                                    onClick={() => {
                                                      handleDeleteTrash(article.id)
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

                        {articlesInActivePagination &&
                          articlesInActivePagination.data &&
                          articlesInActivePagination?.data?.data &&
                          articlesInActivePagination?.data?.data?.length > 0 && (
                            <div className="mx-auto py-4 lg:max-w-5xl">
                              <Pagination
                                pagination={articlesInActivePagination?.data}
                                section="_adminInActiveArticle"
                                client
                              />
                            </div>
                          )}
                      </div>
                    </Tab.Panel>
                    <Tab.Panel>
                      <div id="_adminIsDeletedArticle">
                        <DataStateDisplay
                          isError={isDeletedArticlesError}
                          refetch={refetchDeletedArticles}
                          isFetching={isDeletedArticlesFetching}
                          isSuccess={isDeletedArticlesSuccess}
                          dataLength={
                            articlesIsDeletedPagination?.data?.data ? articlesIsDeletedPagination.data?.data.length : 0
                          }
                          loadingComponent={<TableSkeleton count={20} />}
                        >
                          <table className="w-[780px] md:w-full mx-auto">
                            <thead className="bg-sky-300">
                              <tr>
                                <th className="text-sm py-3 px-2 font-normal w-[130px] text-center text-gray-600 ">
                                  عکس
                                </th>
                                <th className="text-sm py-3 px-2 pr-0 text-gray-600 font-normal w-[150px] text-start">
                                  عنوان
                                </th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">کد مقاله</th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">جایگاه</th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">دسته بندی </th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">دیدگاه</th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">نویسنده</th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">وضعیت</th>
                                <th className="text-sm py-3 px-2 text-gray-600 font-normal">عملیات</th>
                              </tr>
                            </thead>
                            <tbody>
                              {articlesIsDeletedPagination?.data?.data &&
                                articlesIsDeletedPagination?.data?.data.map((article, index) => (
                                  <tr
                                    key={article.id}
                                    className={`h-16 border-b ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
                                  >
                                    <td>
                                      <img
                                        className="w-[108px] h-[70px] rounded-md my-2 mr-2"
                                        src={article.image.imageUrl}
                                        alt="a-img"
                                      />
                                    </td>
                                    <td className="text-sm text-gray-600 ">
                                      <Link className="text-sky-500" href={`/articles/${article.slug}`}>
                                        {article.title}
                                      </Link>
                                    </td>
                                    <td className="text-center text-sm text-gray-600">{digitsEnToFa(article.code)}</td>
                                    <td className="text-center text-sm text-gray-600">
                                      {digitsEnToFa(CheckPlaceArticle(article.place))}
                                    </td>
                                    <td className="text-center text-sm text-gray-600">
                                      {article.category === '' ? <span className="text-lg">-</span> : article.category}
                                    </td>
                                    <td className="text-center text-sm text-gray-600">
                                      {digitsEnToFa(article.numReviews)}
                                    </td>
                                    <td className="text-center text-sm text-gray-600">{article.author}</td>
                                    <td className="text-center">
                                      {article.isActive ? (
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
                                                      handleRestoreTrash(article.id)
                                                      close()
                                                    }}
                                                    className="flex justify-start gap-x-2 px-3 py-2 hover:bg-gray-100 w-full"
                                                  >
                                                    <span>بازگردانی</span>
                                                  </button>
                                                  <button
                                                    onClick={() => {
                                                      handleDelete(article.id)
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

                        {articlesIsDeletedPagination &&
                          articlesIsDeletedPagination.data &&
                          articlesIsDeletedPagination?.data?.data &&
                          articlesIsDeletedPagination?.data?.data?.length > 0 && (
                            <div className="mx-auto py-4 lg:max-w-5xl">
                              <Pagination
                                pagination={articlesIsDeletedPagination?.data}
                                section="_adminIsDeletedArticle"
                                client
                              />
                            </div>
                          )}
                      </div>
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </div>
            </div>
          </section>
        </DashboardLayout>
      </main>
    </>
  )
}
// ? Local Components
export default dynamic(() => Promise.resolve(Articles), { ssr: false })
