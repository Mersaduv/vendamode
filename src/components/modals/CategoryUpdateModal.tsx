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
import { showAlert } from '@/store'
import { useAppDispatch } from '@/hooks'

interface Props {
  title: string
  mode?: 'create' | 'edit'
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

const CategoryUpdateModal: React.FC<Props> = (props) => {
  const [stateCategoryData, setStateCategoryData] = useState<ICategoryForm>({
    level: 0,
    name: '',
    isActive: true,
  } as ICategoryForm)
  const [selectedMainFile, setSelectedMainFile] = useState<File[]>([])

  const { category, isShow, onClose, refetch, title, mode } = props

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
    isActive: true, // Add default value for isActive
  }
  const dispatch = useAppDispatch()
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
    setStateCategoryData({} as ICategoryForm)
    setSelectedMainFile([])
    const loadData = async () => {
      if (category) {
        setStateCategoryData({
          id: category.id,
          name: category.name,
          isActive: category.isActive ?? false, // Ensure isActive has a boolean value
          isActiveProduct: category.isActiveProduct,
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

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {

  //     const files = Array.from(e.target.files)
  //     console.log(files);
  //     if (files.length > 0) {
  //       setSelectedMainFile(files)
  //       setValue('thumbnail', files[0])
  //     } else {
  //       setSelectedMainFile([])
  //       setValue('thumbnail', undefined)
  //     }
  //   }
  // }

  const handleMainFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // if (e.target.files) {
    //   setSelectedMainFile([...Array.from(e.target.files)])
    //   if ([...Array.from(e.target.files)].length > 0) {
    //     var ffff = e.target.files[0]
    //     setValue('thumbnail', ffff)
    //   } else {
    //     setValue('thumbnail', null)
    //   }
    // }
    const files = e.target.files
    if (files) {
      const validFiles: any[] = []
      const maxFileSize = 30 * 1024 // 40 KB
      const exactWidth = 200
      const exactHeight = 200

      // تبدیل FileList به آرایه
      Array.from(files).forEach((file) => {
        if (file.type !== 'image/png') {
          dispatch(
            showAlert({
              status: 'error',
              title: 'فرمت عکس ها می بایست png باشد',
            })
          )
          return
        }

        if (file.size > maxFileSize) {
          dispatch(
            showAlert({
              status: 'error',
              title: 'حجم عکس ها می بایست حداکثر 30 کیلوبایت باشد',
            })
          )
          return
        }

        const img = new Image()
        img.src = URL.createObjectURL(file)

        img.onload = () => {
          URL.revokeObjectURL(img.src)

          if (img.width !== exactWidth || img.height !== exactHeight) {
            dispatch(
              showAlert({
                status: 'error',
                title: 'سایز عکس ها می بایست 200*200 پیکسل باشد',
              })
            )
          } else {
            validFiles.push(file)
            setValue('thumbnail', file)
            setSelectedMainFile([...validFiles])
          }
        }
      })
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

      updateCategory(formData)
    } else {
      createCategory(formData)
    }
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
            <div className="text-start text-base flex gap-2">
              {title} <div className="text-sky-500">{category?.name}</div>
            </div>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit(onConfirm)} className="space-y-4 bg-white text-center md:rounded-lg w-full">
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
                <input type="file" className="hidden" id="thumbnail" onChange={handleMainFileChange} />
                <label htmlFor="thumbnail" className="block w-fit  rounded-lg cursor-pointer text-sm font-normal">
                  {selectedMainFile.length === 0 ? (
                    <img
                      className="w-[125px] h-[125px] rounded-md"
                      src="/images/other/product-placeholder.png"
                      alt="product-placeholder"
                    />
                  ) : (
                    <div className="text-sm shadow-item rounded-lg p-2 text-gray-600">
                      <img
                        src={URL.createObjectURL(selectedMainFile[0])}
                        alt={selectedMainFile[0].name}
                        className="w-[125px] object-contain h-[125px] rounded-md"
                      />
                    </div>
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
                  {stateCategoryData.id ? 'بروزرسانی' : 'انتشار'}
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  )
}

export default CategoryUpdateModal
