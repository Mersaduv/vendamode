import { useAppDispatch, useDisclosure } from '@/hooks'
import { ICategory } from '@/types'
import {
  ConfirmDeleteModal,
  FeaturesModal,
  SubCategoryModal,
  SubCategorySizesModal,
  SubCategoryUpdateModal,
} from '../modals'
import { Button } from '../ui'
import { Dispatch, SetStateAction, useState } from 'react'
import { LuSearch } from 'react-icons/lu'
import { digitsEnToFa } from '@persian-tools/persian-tools'
import { EmptyCustomList } from '../emptyList'
import { ArrowRight } from '@/icons'
import { useRouter } from 'next/router'
import { useDeleteCategoryMutation } from '@/services'
import { HandleResponse } from '../shared'
import { showAlert } from '@/store'
import { ProductFeature } from '@/services/feature/types'

interface Props {
  subCategories: ICategory[]
  refetch: () => void
  categoryParent: ICategory | undefined
  setIsShowSubCategories: Dispatch<SetStateAction<boolean>>
  isShowSubCategories: boolean
  handleSearchSubCategoryChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  subCategorySearchTerm: string
}

const ParentSubCategoriesTree: React.FC<Props> = (props) => {
  const {
    subCategories,
    handleSearchSubCategoryChange,
    subCategorySearchTerm,
    refetch,
    categoryParent,
    isShowSubCategories,
    setIsShowSubCategories,
  } = props

  // States
  const [isShowSubCategoryModal, subCategoryModalHandlers] = useDisclosure()
  const [isShowEditSubCategoryModal, editSubCategoryModalHandlers] = useDisclosure()
  const [stateSubCategory, setStateSubCategory] = useState<ICategory>()
  const [isShowSizesModal, sizesModalHandlers] = useDisclosure()
  const [stateCategorySize, setStateCategorySize] = useState<ICategory>()

  // ? Handlers
  const handlerEditSubCategoryModal = (category: ICategory) => {
    setStateSubCategory(category)
    editSubCategoryModalHandlers.open()
  }

  const CategoryTree: React.FC<{ categories: ICategory[] }> = ({ categories }) => {
    const { query, push } = useRouter()
    const dispatch = useAppDispatch()
    const [isShowConfirmDeleteModal, confirmDeleteModalHandlers] = useDisclosure()
    const [isShowFeaturesModal, featuresModalHandlers] = useDisclosure()
    const [stateCategoryFeatures, setStateCategoryFeatures] = useState<ICategory>()
    const [deleteInfo, setDeleteInfo] = useState({
      id: '',
    })
    const [featureDb, setFeatureDb] = useState<ProductFeature[]>()
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

    const handleChangePage = (slugQuery: string) => {
      push(`/admin/products?category=${slugQuery}`)
    }
    const handlerEditSizeModal = (category: ICategory) => {
      setStateCategorySize(category)
      sizesModalHandlers.open()
    }

    const handlerEditFeaturesModal = (category: ICategory) => {
      setStateCategoryFeatures(category)
      featuresModalHandlers.open()
    }

    //*   Delete Handlers
    const handleDelete = (category: ICategory) => {
      if (category.count !== 0) {
        return dispatch(
          showAlert({
            status: 'error',
            title: 'دسته بندی مد نظر دارایی محصول مرتبط است',
          })
        )
      } else {
        setDeleteInfo({ id: category.id })
        confirmDeleteModalHandlers.open()
      }
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

    return (
      <>
        <FeaturesModal
          setFeatureDb={setFeatureDb}
          featureDb={[]}
          refetch={refetch}
          category={stateCategoryFeatures ?? undefined}
          isShow={isShowFeaturesModal}
          onClose={featuresModalHandlers.close}
        />
        <ConfirmDeleteModal
          title="زیر دسته بندی"
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

        <ul className="flex flex-col">
          {categories.map((category) => (
            <li key={category.id} className={`w-[750px] ${category.level > 1 ? 'mr-10' : ''}`}>
              <div className="bg-[#eee] px-1.5 py-1 border border-[#ccc] rounded-lg mb-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img className="w-8 h-8 object-contain" src={category.imagesSrc?.imageUrl} alt={category.name} />
                  <div
                    onClick={() => handlerEditSubCategoryModal(category)}
                    className="text-sky-500 cursor-pointer text-sm"
                  >
                    {category.name}
                  </div>
                </div>
                {/* buttons logic */}
                <div className="flex gap-3.5 items-center">
                  <Button
                    onClick={() => handlerEditFeaturesModal(category)}
                    className="text-white text-xs font-medium bg-sky-500 rounded-md px-2 py-1"
                  >
                    ویژگی {digitsEnToFa(category.featureCount)}
                  </Button>
                  <Button
                    onClick={() => handlerEditSizeModal(category)}
                    className="text-white text-xs font-medium bg-sky-500 rounded-md px-2 py-1"
                  >
                    اندازه ها {digitsEnToFa(category.productSizeCount ?? 0)}
                  </Button>

                  <Button
                    onClick={() => handleChangePage(category.slug)}
                    className="text-white text-xs font-medium bg-sky-500 rounded-md px-2 py-1"
                  >
                    محصول {digitsEnToFa(category.count ?? 0)}
                  </Button>

                  <Button
                    onClick={() => handleDelete(category)}
                    className="text-white text-xs font-medium bg-red-500 rounded-md px-2 py-1"
                  >
                    حذف{' '}
                  </Button>

                  <div className="pl-1 pr-0.5 py-2 cursor-grab">
                    <img className="w-4 h-4" src="/images/icons/menu-burger.png" alt="" />
                  </div>
                </div>
              </div>
              {category.childCategories && category.childCategories.length > 0 && (
                <CategoryTree categories={category.childCategories} />
              )}
            </li>
          ))}
        </ul>
      </>
    )
  }

  return (
    <div>
      <SubCategoryModal
        categoryParent={categoryParent ?? ({} as ICategory)}
        title="افزودن زیر دسته"
        categoryList={subCategories}
        refetch={refetch}
        isShow={isShowSubCategoryModal}
        onClose={() => {
          subCategoryModalHandlers.close()
          setStateSubCategory(undefined)
        }}
      />

      <SubCategoryUpdateModal
        categoryParent={categoryParent ?? ({} as ICategory)}
        title="ویرایش زیر دسته"
        categoryList={subCategories}
        refetch={refetch}
        category={stateSubCategory}
        isShow={isShowEditSubCategoryModal}
        onClose={() => {
          editSubCategoryModalHandlers.close()
        }}
      />
      <SubCategorySizesModal
        refetch={refetch}
        category={stateCategorySize ?? undefined}
        isShow={isShowSizesModal}
        onClose={sizesModalHandlers.close}
      />
      <div className="flex gap-y-4 px-6 sm:flex-row flex-col items-center justify-between">
        <div className="flex items-center gap-3">
          <ArrowRight
            onClick={() => setIsShowSubCategories(false)}
            className="text-[#e90089] text-3xl  hover:shadow rounded-full cursor-pointer"
          />
          <h3>پیکربندی {categoryParent?.name}</h3>
        </div>
        <div className="flex flex-col xs:flex-row items-center gap-4">
          <Button
            onClick={subCategoryModalHandlers.open}
            className="hover:bg-sky-600 bg-sky-500 px-3 py-2.5 text-sm whitespace-nowrap"
          >
            افزودن زیر دسته بندی
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
              value={subCategorySearchTerm}
              onChange={handleSearchSubCategoryChange}
            />
          </div>
        </div>
      </div>
      <hr className="mt-5 mb-6" />
      <div className="pr-2 xs:pr-8 sm:pr-14">
        {subCategories && subCategories.length > 0 ? <CategoryTree categories={subCategories} /> : <EmptyCustomList />}
      </div>
    </div>
  )
}

export default ParentSubCategoriesTree
