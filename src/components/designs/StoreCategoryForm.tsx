import { ICategory, ISliderForm, IStoreCategory, ITextMarqueeForm } from '@/types'
import { profileFormSchema, textMarqueeSchema } from '@/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'

import { useFormContext, Controller } from 'react-hook-form'
import { Button, ControlledCheckbox } from '../ui'
import { useEffect, useState } from 'react'
import { MdClose } from 'react-icons/md'
import { useDeleteSliderMutation, useGetAllCategoriesQuery, useGetCategoriesTreeQuery } from '@/services'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { showAlert } from '@/store'
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
interface Props {
  storeCategories: IStoreCategory[]
  setStoreCategories: React.Dispatch<React.SetStateAction<IStoreCategory[]>>
  setDeletedStoreCategories: React.Dispatch<React.SetStateAction<IStoreCategory[]>>
}

const StoreCategoryForm: React.FC<Props> = ({ storeCategories, setStoreCategories, setDeletedStoreCategories }) => {
  const { control, setValue, getValues, watch } = useFormContext()
  const { generalSetting } = useAppSelector((state) => state.design)
  const [allCategories, setAllCategories] = useState<ICategory[]>([])
  const dispatch = useAppDispatch()
  // ? Get Categories Query
  const { categoriesData } = useGetAllCategoriesQuery(
    { pageSize: 999999, isActive: true },
    {
      selectFromResult: ({ data }) => ({
        categoriesData: data?.data,
      }),
    }
  )

  useEffect(() => {
    if (categoriesData) {
      let allCats: ICategory[] = []
      categoriesData.data?.forEach((category: ICategory) => {
        allCats.push(category)
        allCats = allCats.concat(extractChildCategories(category))
      })
      setAllCategories(allCats)
    }
  }, [categoriesData])

  useEffect(() => {
    const storeCategoriesWithCategoryId = storeCategories.filter((storeCategory) => storeCategory.categoryId !== '')
    setValue('storeCategories', storeCategoriesWithCategoryId)
  }, [storeCategories, setValue])

  const handleAddStoreCategory = () => {
    if (storeCategories.length === 10) {
      dispatch(
        showAlert({
          status: 'error',
          title: 'حداکثر تعداد دسته بندی ها 10 عدد میباشد',
        })
      )
      return
    }
    setStoreCategories([...storeCategories, { id: '', categoryId: '', isActive: false }])
  }

  const handleDelete = (index: number, storeCategory: IStoreCategory) => {
    if (storeCategory.id) {
      setDeletedStoreCategories((prevDeleted) => [...prevDeleted, storeCategory])
    }
    setStoreCategories((prevFiles) => {
      const updatedFiles = [...prevFiles]
      updatedFiles.splice(index, 1)
      return updatedFiles
    })
  }

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const selectedCategoryId = event.target.value

    const newStoreCategories = storeCategories.map((category, i) =>
      i === index ? { ...category, categoryId: selectedCategoryId } : category
    )

    setStoreCategories(newStoreCategories)
  }

  return (
    <div className="flex flex-1">
      <div className="bg-white w-full rounded-md shadow-item">
        {/* <div className="flex justify-between items-center border-b p-5 px-6">
          <h3 className=" text-gray-600 whitespace-nowrap">دسته بندی ها</h3>
          <div className="flex justify-end w-[260px] gap-4 items-center">
            <Button className=" px-5 py-2.5 bg-sky-500 hover:bg-sky-400" onClick={handleAddStoreCategory}>
              {'افزودن'}
            </Button>
          </div>
        </div> */}
        <div className="flex justify-between items-center border-b p-5 px-6">
          <h3 className=" text-gray-600 whitespace-nowrap">دسته بندی ها</h3>
          <div className="flex justify-end w-[260px] gap-4 items-center">
            <Button className=" px-5 py-2.5 bg-sky-500 hover:bg-sky-400" onClick={handleAddStoreCategory}>
              {'افزودن'}
            </Button>
            <ControlledCheckbox name="storeCategoryIsActive" control={control} label="وضعیت نمایش" inLabel />
          </div>
        </div>
        <div className="flex flex-col px-6 pb-10 pt-4">
          <div className="flex justify-end mb-4"></div>
          <div className="grid w-full justify-center  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 ">
            {storeCategories.length === 0 ? (
              <div className="flex justify-center col-span-5">دسته بندی مورد نظر را اضافه کنید</div>
            ) : (
              storeCategories.map((storeCategory, index) => (
                <div key={index} className="mb-4 w-full flex-1 rounded-lg  relative">
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 shadow-product bg-gray-50 hover:bg-red-600 hover:text-white p-1 rounded-full text-gray-500"
                    onClick={() => handleDelete(index, storeCategory)}
                  >
                    <MdClose className="text-lg" /> {/* Add your delete icon here */}
                  </button>
                  <div className="flex flex-col w-full items-start p-1">
                    <div className="flex flex-col gap-2 w-full">
                      {/* category url */}
                      <div className="flex gap-3 w-full items-center">
                        <div className="flex border w-full rounded-lg">
                          <select
                            className={`w-full h-[50px] cursor-pointer border-gray-200 slider-selector text-sm focus:outline-none appearance-none border-none rounded-lg`}
                            name="انتخاب"
                            id=""
                            value={storeCategory.categoryId !== null ? storeCategory.categoryId : ''}
                            onChange={(e) => handleCategoryChange(e, index)}
                          >
                            <option className="appearance-none text-sm" value="">
                            انتخاب دسته بندی
                            </option>
                            {allCategories?.map((category) => (
                              <option
                                key={category.id}
                                value={category.id}
                                className={category.level === 0 ? 'text-blue-600' : ''}
                              >
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="bg-gray-50 bottom-0 w-full rounded-b-lg px-8 flex flex-col pb-2">
          <span className="font-normal text-[11px] pt-2">
            دسته بندی مورد نظر را برای نمایش در صفحه اصلی انتخاب کنید
          </span>
        </div>
      </div>
    </div>
  )
}
export default StoreCategoryForm
