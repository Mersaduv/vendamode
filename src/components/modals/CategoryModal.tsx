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

interface Props {
  title: string
  category?: ICategory
  isShow: boolean
  onClose: () => void
  refetch: () => void
}

const fetchImageAsFile = async (url: string): Promise<File> => {
  const response = await fetch(url)
  const blob = await response.blob()
  const fileName = url.split('/').pop()
  return new File([blob], fileName || 'image.jpg', { type: blob.type })
}

const CategoryModal: React.FC<Props> = (props) => {
  const [stateCategoryData, setStateCategoryData] = useState<ICategoryForm>({
    level: 0,
    name: '',
    isActive: false, // Initialize isActive
  } as ICategoryForm)
  const [selectedMainFile, setSelectedMainFile] = useState<File[]>([])

  const { category, isShow, onClose, refetch, title } = props

  const [
    updateCategory,
    {
      data: dataUpdate,
      isSuccess: isSuccessUpdate,
      isError: isErrorUpdate,
      error: errorUpdate,
      isLoading: isLoadingUpdate,
    },
  ] = useUpdateCategoryMutation()

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
    // Add other fields with default values if needed
  }

  // ? Form Hook
  const {
    handleSubmit,
    control,
    formState: { errors: formErrors },
    reset,
    register,
    watch,
    getValues,
    setValue,
  } = useForm<ICategoryForm>({
    resolver: yupResolver(categorySchema) as unknown as Resolver<ICategoryForm>,
    defaultValues,
  })

  useEffect(() => {
    const loadData = async () => {
      onClose()
      setStateCategoryData({} as ICategoryForm)
      reset()
      setSelectedMainFile([])
      if (category) {
        setStateCategoryData({
          id: category.id,
          name: category.name,
          isActive: category.isActive ?? false, // Ensure isActive has a boolean value
          level: category.level,
          parentCategoryId: category.parentCategoryId,
          mainCategoryId: category.parentCategoryId,
          thumbnail: undefined,
        })
        if (category.imagesSrc) {
          const imageFile = await fetchImageAsFile(category.imagesSrc.imageUrl)
          if (imageFile) {
            setSelectedMainFile([imageFile])
          }

          console.log(category, imageFile)

          reset({
            id: category.id,
            name: category.name,
            isActive: category.isActive ?? false, // Ensure isActive has a boolean value
            parentCategoryId: category.parentCategoryId,
            mainCategoryId: category.parentCategoryId,
            level: category.level,
            thumbnail: imageFile,
          })
        }
      }
    }
    loadData()
  }, [category])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      if (files.length > 0) {
        setValue('thumbnail', files[0])
        setSelectedMainFile(files)
      } else {
        setValue('thumbnail', undefined)
        setSelectedMainFile([])
      }
    }
  }

  const handleIsActiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    var isActive = e.target.checked
    setStateCategoryData({
      ...stateCategoryData,
      isActive,
    })
    setValue('isActive', isActive)
  }

  const onConfirm: SubmitHandler<ICategoryForm> = (data) => {
    console.log(data, 'data--data')

    const formData = new FormData()

    formData.append('Name', data.name)
    formData.append('IsActive', data.isActive.toString())

    if (data.thumbnail) {
      formData.append('Thumbnail', data.thumbnail)
    }

    if (data.level) {
      formData.append('Level', data.level.toString())
    }
    if (data.id != undefined) {
      formData.append('Id', data.id)
      console.log('formData', stateCategoryData, 'stateCategoryData', data.id)

      updateCategory(formData)
    } else {
      createCategory(formData)
    }
  }

  if (formErrors) {
    console.log(formErrors, 'formErrors')
  }

  return (
    <>
      {(isSuccessUpdate || isErrorUpdate) && (
        <HandleResponse
          isError={isErrorUpdate}
          isSuccess={isSuccessUpdate}
          error={errorUpdate}
          message={dataUpdate?.message}
          onSuccess={() => {
            onClose()
            refetch()
            setStateCategoryData({} as ICategoryForm)
            setSelectedMainFile([])
          }}
        />
      )}
      {(isSuccessCreate || isErrorCreate) && (
        <HandleResponse
          isError={isErrorCreate}
          isSuccess={isSuccessCreate}
          error={errorCreate}
          message={dataCreate?.message}
          onSuccess={() => {
            onClose()
            refetch()
            setStateCategoryData({} as ICategoryForm)
            setSelectedMainFile([])
          }}
        />
      )}
      <Modal
        isShow={isShow}
        onClose={() => {
          onClose()
          // setStateCategoryData({} as ICategoryForm)
          // setSelectedMainFile([])
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
                    placeholder="نام"
                    {...register('name')}
                  />
                  <label
                    htmlFor="floatingInput"
                    className="pointer-events-none absolute right-0 top-0 origin-[0_0] border border-solid border-transparent pr-3 pb-4 pt-3.5 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary"
                  >
                    نام
                  </label>
                </div>
              </div>

              <div className="flex py-3 items-center gap-x-12 border mx-6 rounded-lg px-2">
                <label htmlFor="isActive" className="flex items-center gap-x-2">
                <CustomCheckbox
                    name="isActive"
                    checked={stateCategoryData.isActive}
                    onChange={handleIsActiveChange}
                    label="وضعیت نمایش"
                    customStyle="bg-sky-500"
                  />
                </label>
              </div>

              <div className=" flex flex-col items-center justify-center">
                <input type="file" className="hidden" id="Thumbnail" onChange={handleFileChange} />
                <label htmlFor="Thumbnail" className="block w-fit  rounded-lg cursor-pointer text-sm font-normal">
                  {selectedMainFile.length === 0 ? (
                    <img
                      className="w-[125px] h-[125px] rounded-md"
                      src="/images/other/product-placeholder.png"
                      alt="product-placeholder"
                    />
                  ) : (
                    selectedMainFile.map((file, index) => (
                      <div key={index} className="text-sm shadow-item rounded-lg p-2 text-gray-600">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-[125px] object-contain h-[125px] rounded-md"
                        />
                      </div>
                    ))
                  )}
                </label>
                <div className="text-xs mt-3">تصویر</div>
              </div>

              <div className="flex px-5 py-3 justify-between items-center gap-x-20 bg-[#f5f8fa]">
                <div className="flex flex-col items-start">
                  <p className="text-xs text-gray-500 ">سایز عکس میبایست 200*200 پیکسل باشد</p>
                  <p className="text-xs text-gray-500 ">حجم عکس میبایست حداکثر 30 کیلوبایت باشد</p>
                  <p className="text-xs text-gray-500 ">نوع عکس میبایست png باشد</p>
                </div>
                <Button
                  type="submit"
                  className="bg-sky-500 px-5 py-2.5 hover:bg-sky-600"
                  // onClick={onConfirm}
                  isLoading={isLoadingCreate || isLoadingUpdate}
                >
                  {stateCategoryData.id ? 'به‌روزرسانی' : 'انتشار'}
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  )
}

export default CategoryModal
