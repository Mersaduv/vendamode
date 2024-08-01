import { Modal, Button, CustomCheckbox } from '@/components/ui'
import { ICategory, ICategoryForm } from '@/types'
import SizesCombobox from '../selectorCombobox/SizesCombobox'
import {
  useCreateCategoryMutation,
  useGetSizesQuery,
  useUpdateCategoryFeatureMutation,
  useUpdateCategoryMutation,
} from '@/services'
import { useEffect, useState } from 'react'
import { HandleResponse } from '../shared'
import { CategoryFeatureForm } from '@/services/category/types'
import { Resolver, SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { categorySchema } from '@/utils'
import { SelectParentCategoryCombobox } from '../selectorCombobox'
import { useAppDispatch } from '@/hooks'
import { setUpdated } from '@/store'

interface Props {
  title: string
  category?: ICategory
  categoryParent: ICategory
  categoryList: ICategory[]
  isShow: boolean
  onClose: () => void
  refetch: () => void
}

const SubCategoryModal: React.FC<Props> = (props) => {
  const { isShow, onClose, refetch, title, categoryList, categoryParent } = props
  const dispatch = useAppDispatch()
  const [stateCategoryData, setStateCategoryData] = useState<ICategoryForm>({
    level: 0,
    name: '',
    isActive: false,
  } as ICategoryForm)
  const [selectedFile, setSelectedFile] = useState<File[]>([])
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null)
  const [parentCategory, setParentCategory] = useState<ICategory | undefined>(undefined)
  const [
    createCategory,
    {
      data: dataCreate,
      isSuccess: isSuccessCreate,
      isError: isErrorCreate,
      error: errorCreate,
      isLoading: isLoadingCreate,
    },
  ] = useCreateCategoryMutation()

  // ? Assets
  const defaultValues: Partial<ICategoryForm> = {
    name: '',
    level: 0,
    isActive: false, // Add default value for isActive
  }

  // ? Form Hook
  const {
    handleSubmit,
    formState: { errors: formErrors, isValid },
    register,
    setValue,
    reset,
  } = useForm<ICategoryForm>({
    resolver: yupResolver(categorySchema) as unknown as Resolver<ICategoryForm>,
    defaultValues,
  })

  const handleMainFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile([...Array.from(e.target.files)])
      if ([...Array.from(e.target.files)].length > 0) {
        var ffff = e.target.files[0]
        setValue('thumbnail', ffff)
      } else {
        setValue('thumbnail', null)
      }
    }
  }

  const handleCategorySelect = (category: ICategory) => {
    if (category) {
      setParentCategory(category)
      setValue('parentCategoryId', category.id)
    }
  }

  const onConfirm: SubmitHandler<ICategoryForm> = (data) => {
    const formData = new FormData()

    formData.append('Name', data.name)
    formData.append('IsActive', data.isActive.toString())

    if (data.thumbnail) {
      formData.append('Thumbnail', data.thumbnail)
    }

    if (data.level) {
      formData.append('Level', data.level.toString())
    }

    if (parentCategory === undefined) {
      formData.append('ParentCategoryId', categoryParent.id)
    } else {
      if (data.parentCategoryId) formData.append('ParentCategoryId', data.parentCategoryId)
    }
      formData.append('MainId', categoryParent.id)

    if (data.id != undefined) {
      formData.append('Id', data.id)
    } else {
      createCategory(formData)
    }
    dispatch(setUpdated(true))
  }

  return (
    <>
      {(isSuccessCreate || isErrorCreate) && (
        <HandleResponse
          isError={isErrorCreate}
          isSuccess={isSuccessCreate}
          error={errorCreate}
          message={dataCreate?.message}
          onSuccess={() => {
            reset()
            onClose()
            refetch()
            setStateCategoryData({} as ICategoryForm)
            setSelectedFile([])
          }}
        />
      )}
      <Modal
        isShow={isShow}
        onClose={() => {
          onClose()
          // setStateCategoryData({} as ICategoryForm)
          setSelectedFile([])
        }}
        effect="bottom-to-top"
      >
        <Modal.Content
          onClose={onClose}
          className="flex h-full flex-col z-[199] gap-y-5 bg-white py-5 pb-0 md:rounded-lg"
        >
          <Modal.Header notBar onClose={onClose}>
            <div className="text-start text-base">{title} دسته بندی</div>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit(onConfirm)} className="space-y-4 bg-white text-center md:rounded-lg">
              <div className="flex items-center w-full gap-x-12 px-6">
                <div className="relative mb-3 w-full">
                  <input
                    type="text"
                    className="peer m-0 pr-3 block rounded-lg h-[50px] w-full border border-solid border-gray-200 bg-transparent bg-clip-padding pl-3 py-4 text-xl font-normal leading-tight text-neutral-700 transition duration-200 ease-linear placeholder:text-transparent focus:border-primary focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-primary dark:border-neutral-400 dark:text-white dark:autofill:shadow-autofill dark:focus:border-primary dark:peer-focus:text-primary [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]"
                    id="floatingInput"
                    placeholder="نام دسته"
                    {...register('name')}
                  />
                  <label
                    htmlFor="floatingInput"
                    className="pointer-events-none absolute right-0 top-0 origin-[0_0] border border-solid border-transparent pr-3 pb-4 pt-3.5 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary"
                  >
                    نام دسته
                  </label>
                </div>
              </div>

              <div className="flex py-3 pt-2 items-start gap-x-12 border mx-6 rounded-lg px-2">
                <div className="flex flex-col w-full">
                  <h3 className="text-start pb-2">زیر دسته بندی</h3>
                  {categoryList.length > 0 && (
                    <SelectParentCategoryCombobox
                      setParentCategory={setParentCategory}
                      selectedCategory={selectedCategory}
                      setSelectedCategory={setSelectedCategory}
                      categories={categoryList ?? []}
                      onCategorySelect={handleCategorySelect}
                    />
                  )}
                </div>
              </div>

              <div className=" flex flex-col items-center justify-center">
                <input type="file" className="hidden" id="thumbnailSubCreate" onChange={handleMainFileChange} />
                <label
                  htmlFor="thumbnailSubCreate"
                  className="block w-fit  rounded-lg cursor-pointer text-sm font-normal"
                >
                  {selectedFile.length === 0 ? (
                    <img
                      className="w-[125px] h-[125px] rounded-md"
                      src="/images/other/product-placeholder.png"
                      alt="product-placeholder"
                    />
                  ) : (
                    <div className="text-sm shadow-item rounded-lg p-2 text-gray-600">
                      <img
                        src={URL.createObjectURL(selectedFile[0])}
                        alt={selectedFile[0].name}
                        className="w-[125px] object-contain h-[125px] rounded-md"
                      />
                    </div>
                  )}
                </label>
                <div className="text-xs mt-3">تصویر</div>
              </div>

              <div className="flex flex-col md:flex-row gap-y-4 px-5 py-3 justify-between items-center gap-x-20 bg-[#f5f8fa]">
                <div className="flex flex-col items-start">
                  <p className="text-xs text-gray-500 whitespace-nowrap ">سایز عکس میبایست 200*200 پیکسل باشد</p>
                  <p className="text-xs text-gray-500 whitespace-nowrap ">حجم عکس میبایست حداکثر 30 کیلوبایت باشد</p>
                  <p className="text-xs text-gray-500 whitespace-nowrap ">نوع عکس میبایست png باشد</p>
                </div>
                {/* validation errors */}
                <div className="flex flex-col">
                  {formErrors.name && <p className="text-red-500 px-10">{formErrors.name.message}</p>}

                  {formErrors.thumbnail && <p className="text-red-500 px-10">{formErrors.thumbnail?.message}</p>}
                </div>
                <Button
                  type="submit"
                  className={`bg-sky-500 px-5 py-2.5 hover:bg-sky-600 ${
                    !isValid ? 'bg-gray-300' : 'hover:text-black'
                  } `}
                  isLoading={isLoadingCreate}
                >
                  {'انتشار'}
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  )
}

export default SubCategoryModal
