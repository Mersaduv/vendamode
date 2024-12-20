import { ICategory, ISliderForm, IStoreBrand, IStoreCategory, ITextMarqueeForm } from '@/types'
import { profileFormSchema, textMarqueeSchema } from '@/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'

import { useFormContext, Controller } from 'react-hook-form'
import { Button, ControlledCheckbox } from '../ui'
import { useEffect, useState } from 'react'
import { MdClose } from 'react-icons/md'
import {
  useDeleteSliderMutation,
  useGetAllCategoriesQuery,
  useGetBrandsQuery,
  useGetCategoriesTreeQuery,
} from '@/services'
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
  storeBrands: IStoreBrand[]
  setStoreBrands: React.Dispatch<React.SetStateAction<IStoreBrand[]>>
  setDeletedStoreBrands: React.Dispatch<React.SetStateAction<IStoreBrand[]>>
}

const StoreBrandForm: React.FC<Props> = ({ setDeletedStoreBrands, setStoreBrands, storeBrands }) => {
  const { control, setValue, getValues, watch } = useFormContext()
  const { generalSetting } = useAppSelector((state) => state.design)
  const dispatch = useAppDispatch()
  // ? Get Categories Query
  const { brandData } = useGetBrandsQuery(
    { pageSize: 999999, isActive: true },
    {
      selectFromResult: ({ data }) => ({
        brandData: data?.data,
      }),
    }
  )

  useEffect(() => {
    const storeBrandsWithCategoryId = storeBrands.filter((storeBrand) => storeBrand.brandId !== '')
    setValue('storeBrands', storeBrandsWithCategoryId)
  }, [storeBrands, setValue])

  const handleAddStoreBrand = () => {
    if (storeBrands.length === 10) {
      dispatch(
        showAlert({
          status: 'error',
          title: 'حداکثر تعداد برند ها 10 عدد میباشد',
        })
      )
      return
    }
    setStoreBrands([...storeBrands, { id: '', brandId: '', isActive: false }])
  }

  const handleDelete = (index: number, storeBrand: IStoreBrand) => {
    if (storeBrand.id) {
      setDeletedStoreBrands((prevDeleted) => [...prevDeleted, storeBrand])
    }
    setStoreBrands((prevFiles) => {
      const updatedFiles = [...prevFiles]
      updatedFiles.splice(index, 1)
      return updatedFiles
    })
  }

  const handleBrandChange = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const selectedBrandId = event.target.value

    const newStoreBrands = storeBrands.map((storeBrand, i) =>
      i === index ? { ...storeBrand, brandId: selectedBrandId } : storeBrand
    )

    setStoreBrands(newStoreBrands)
  }

  return (
    <div className="flex flex-1">
      <div className="bg-white w-full rounded-md shadow-item">
        {/* <div className="flex justify-between items-center border-b p-5 px-6">
          <h3 className=" text-gray-600 whitespace-nowrap">برند ها</h3>
          <div className="flex justify-end w-[260px] gap-4 items-center">
            <Button className=" px-5 py-2.5 bg-sky-500 hover:bg-sky-400" onClick={handleAddStoreBrand}>
              {'افزودن'}
            </Button>
          </div>
        </div> */}
        <div className="flex justify-between items-center border-b p-5 px-6">
          <h3 className=" text-gray-600 whitespace-nowrap">برند ها</h3>
          <div className="flex justify-end w-[260px] gap-4 items-center">
            <Button className=" px-5 py-2.5 bg-sky-500 hover:bg-sky-400" onClick={handleAddStoreBrand}>
              {'افزودن'}
            </Button>
            <ControlledCheckbox name="storeBrandIsActive" control={control} label="وضعیت نمایش" inLabel />
          </div>
        </div>
        <div className="flex flex-col px-6 pb-10 pt-4">
          <div className="flex justify-end mb-4"></div>
          <div className="grid w-full justify-center  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 ">
            {storeBrands.length === 0 ? (
              <div className="flex justify-center col-span-5">برند مورد نظر را اضافه کنید</div>
            ) : (
              storeBrands.map((storeBrand, index) => (
                <div key={index} className="mb-4 w-full flex-1 rounded-lg  relative">
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 shadow-product bg-gray-50 hover:bg-red-600 hover:text-white p-1 rounded-full text-gray-500"
                    onClick={() => handleDelete(index, storeBrand)}
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
                            value={storeBrand.brandId !== null ? storeBrand.brandId : ''}
                            onChange={(e) => handleBrandChange(e, index)}
                          >
                            <option className="appearance-none text-sm" value="">
                              انتخاب برند
                            </option>
                            {brandData?.data?.map((brand) => (
                              <option key={brand.id} value={brand.id}>
                                {brand.nameFa}
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
          <span className="font-normal text-[11px] pt-2">برند مورد نظر را برای نمایش در صفحه اصلی انتخاب کنید</span>
        </div>
      </div>
    </div>
  )
}
export default StoreBrandForm
