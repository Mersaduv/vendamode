import { Modal, Button, CustomCheckbox } from '@/components/ui'
import { useCreateBrandMutation, useUpdateBrandMutation } from '@/services'
import { useEffect, useRef, useState } from 'react'
import { HandleResponse } from '../shared'
import { Resolver, SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { brandSchema } from '@/utils'
import { IBrand, IBrandForm } from '@/types'
import { useAppDispatch } from '@/hooks'
import { setUpdated, showAlert } from '@/store'
import { digitsEnToFa } from '@persian-tools/persian-tools'

interface Props {
  title: string
  mode: 'create' | 'edit'
  brand?: IBrand
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

const BrandModal: React.FC<Props> = (props) => {
  const { isShow, onClose, refetch, title, brand, mode } = props
  const [isActive, setIsActive] = useState(false)
  const [isSlider, setIsSlider] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File[]>([])
  const dispatch = useAppDispatch()
  // ? Assets
  const defaultValues: Partial<IBrandForm> = {
    inSlider: false,
    isActive: false,
  }
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [
    createBrand,
    {
      data: dataCreate,
      isSuccess: isSuccessCreate,
      isError: isErrorCreate,
      error: errorCreate,
      isLoading: isLoadingCreate,
    },
  ] = useCreateBrandMutation()

  const [
    updateBrand,
    {
      data: dataUpdate,
      isSuccess: isSuccessUpdate,
      isError: isErrorUpdate,
      error: errorUpdate,
      isLoading: isLoadingUpdate,
    },
  ] = useUpdateBrandMutation()

  const {
    handleSubmit,
    formState: { errors: formErrors, isValid },
    register,
    setValue,
    reset,
  } = useForm<IBrandForm>({
    resolver: yupResolver(brandSchema) as unknown as Resolver<IBrandForm>,
    defaultValues,
  })
  useEffect(() => {
    if (isShow && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isShow])
  useEffect(() => {
    const loadData = async () => {
      if (brand) {
        setIsSlider(brand.inSlider)
        setIsActive(brand.isActive)
        if (brand.imagesSrc) {
          const imageFile = await fetchImageAsFile(brand.imagesSrc.imageUrl)
          if (imageFile) {
            setSelectedFile([imageFile])
            setValue('Thumbnail', imageFile)
          }
          reset({
            id: brand.id,
            nameFa: brand.nameFa,
            nameEn: brand.nameEn,
            isActive: brand.isActive,
            inSlider: brand.inSlider,
            description: brand.description,
            isDeleted: brand.isDelete,
            Thumbnail: imageFile,
          })
        } else {
          reset({
            id: brand.id,
            nameFa: brand.nameFa,
            nameEn: brand.nameEn,
            isActive: brand.isActive,
            inSlider: brand.inSlider,
            description: brand.description,
            isDeleted: brand.isDelete,
          })
        }
      }
    }
    loadData()
  }, [brand])

  // ? Handlers
  const onConfirm: SubmitHandler<IBrandForm> = (data) => {
    const formData = new FormData()

    formData.append('NameFa', data.nameFa)
    formData.append('NameEn', data.nameEn)
    formData.append('Thumbnail', data.Thumbnail)
    formData.append('InSlider', data.inSlider.toString())
    formData.append('IsActive', data.isActive.toString())

    if (data.description) {
      formData.append('Description', data.description)
    }
    if (data.id !== undefined) {
      formData.append('Id', data.id)
      updateBrand(formData)
    } else {
      createBrand(formData)
    }
    dispatch(setUpdated(true))
  }

  const handleIsActiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    var isActive = e.target.checked
    setIsActive(isActive)
    setValue('isActive', isActive)
  }

  const handleIsSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    var isSlide = e.target.checked
    setIsSlider(isSlide)
    setValue('inSlider', isSlide)
  }

  const handleMainFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // if (e.target.files) {
    //   setSelectedFile([...Array.from(e.target.files)])
    //   if ([...Array.from(e.target.files)].length > 0) {
    //     var file = e.target.files[0]
    //     setValue('Thumbnail', file)
    //   }
    // }
    const files = e.target.files
    if (files) {
      const validFiles: any[] = []
      const maxFileSize = 40 * 1024 // 40 KB
      const exactWidth = 300
      const exactHeight = 200

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
              title: 'حجم عکس ها می بایست حداکثر 40 کیلوبایت باشد',
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
                title: 'سایز عکس ها می بایست 300*200 پیکسل باشد',
              })
            )
          } else {
            validFiles.push(file)
            setValue('Thumbnail', file)
            setSelectedFile([...validFiles])
          }
        }
      })
    }
  }
  console.log(formErrors)

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
            setSelectedFile([])
            setIsSlider(false)
            setIsActive(false)
            onClose()
            refetch()
          }}
        />
      )}

      {(isSuccessUpdate || isErrorUpdate) && (
        <HandleResponse
          isError={isErrorUpdate}
          isSuccess={isSuccessUpdate}
          error={errorUpdate}
          message={dataUpdate?.message}
          onSuccess={() => {
            reset()
            setSelectedFile([])
            onClose()
            refetch()
          }}
        />
      )}

      <Modal isShow={isShow} onClose={onClose} effect="bottom-to-top">
        <Modal.Content
          onClose={onClose}
          className="flex h-full flex-col z-[199] gap-y-5 bg-white py-5 pb-0 md:rounded-lg"
        >
          <Modal.Header notBar onClose={onClose}>
            <div className="text-start text-base flex gap-2">
              {' '}
              {title} {title === 'افزودن' && ' برند'}
              <div className="text-sky-500">{brand?.nameFa}</div>
            </div>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit(onConfirm)} className="space-y-4 bg-white text-center md:rounded-lg w-full">
              <div className="flex justify-between flex-col sm:flex-row">
                <div className="flex flex-col flex-1">
                  <div className="flex items-center w-full gap-x-12 px-6">
                    <div className="relative mb-3 w-full">
                      <input
                        type="text"
                        className="peer m-0 pr-3 block rounded-lg h-[50px] w-full border border-solid border-gray-200 bg-transparent bg-clip-padding pl-3 py-4 text-xl font-normal leading-tight text-neutral-700 transition duration-200 ease-linear placeholder:text-transparent focus:border-primary focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-primary dark:border-neutral-400 dark:text-white dark:autofill:shadow-autofill dark:focus:border-primary dark:peer-focus:text-primary [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]"
                        id={`nameFaInput-${mode}`}
                        placeholder="نام فارسی"
                        {...register('nameFa')}
                        ref={(e) => {
                          register('nameFa').ref(e)
                          inputRef.current = e
                        }}
                      />
                      <label
                        htmlFor={`nameFaInput-${mode}`}
                        className="pointer-events-none absolute right-0 top-0 origin-[0_0] border border-solid border-transparent pr-3 pb-4 pt-3.5 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary"
                      >
                        نام فارسی
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center w-full gap-x-12 px-6">
                    <div className="relative mb-3 w-full">
                      <input dir='ltr'
                        type="text"
                        className="peer m-0 pr-3 block rounded-lg h-[50px] w-full border border-solid border-gray-200 bg-transparent bg-clip-padding pl-3 py-4 text-xl font-normal leading-tight text-neutral-700 transition duration-200 ease-linear placeholder:text-transparent focus:border-primary focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-primary dark:border-neutral-400 dark:text-white dark:autofill:shadow-autofill dark:focus:border-primary dark:peer-focus:text-primary [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]"
                        id={`nameEnInput-${mode}`}
                        placeholder="نام انگلیسی"
                        {...register('nameEn')}
                        ref={(e) => {
                          register('nameEn').ref(e)
                          inputRef.current = e
                        }}
                      />
                      <label
                        htmlFor={`nameEnInput-${mode}`}
                        className="pointer-events-none absolute right-0 top-0 origin-[0_0] border border-solid border-transparent pr-3 pb-4 pt-3.5 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary"
                      >
                        نام انگلیسی
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center w-full gap-x-12 px-6">
                    <div className="relative mb-3 w-full">
                      <input
                        type="text"
                        className="peer m-0 pr-3 block rounded-lg h-[50px] w-full border border-solid border-gray-200 bg-transparent bg-clip-padding pl-3 py-4 text-xl font-normal leading-tight text-neutral-700 transition duration-200 ease-linear placeholder:text-transparent focus:border-primary focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-primary dark:border-neutral-400 dark:text-white dark:autofill:shadow-autofill dark:focus:border-primary dark:peer-focus:text-primary [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]"
                        id={`descriptionInput-${mode}`}
                        placeholder="توضیحات"
                        {...register('description')}
                      />
                      <label
                        htmlFor={`descriptionInput-${mode}`}
                        className="pointer-events-none absolute right-0 top-0 origin-[0_0] border border-solid border-transparent pr-3 pb-4 pt-3.5 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary"
                      >
                        توضیحات
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col py-3 items-start gap-4 border mx-6 rounded-lg px-2">
                    <label htmlFor={`isActive-${mode}`} className="flex items-center gap-x-2">
                      <CustomCheckbox
                        name={`isActive-${mode}`}
                        checked={isActive}
                        onChange={handleIsActiveChange}
                        label="وضعیت نمایش"
                        customStyle="bg-sky-500"
                      />
                    </label>
                  </div>
                </div>
                {/* thumbnail  */}
                <div className="sm:w-1/3 mt-8 sm:mt-0 flex justify-center w-full">
                  <div className=" flex flex-col items-center justify-center">
                    <input
                      type="file"
                      className="hidden"
                      id={`thumbnailBrand-${mode}`}
                      onChange={handleMainFileChange}
                    />
                    <label
                      htmlFor={`thumbnailBrand-${mode}`}
                      className="block w-fit  rounded-lg cursor-pointer text-sm font-normal"
                    >
                      {selectedFile.length === 0 ? (
                        <img
                          className="w-[185px] h-[185px] rounded-md"
                          src="/images/other/product-placeholder.png"
                          alt="product-placeholder"
                        />
                      ) : (
                        <div className="text-sm shadow-item rounded-lg p-2 text-gray-600">
                          <img
                            src={URL.createObjectURL(selectedFile[0])}
                            alt={selectedFile[0].name}
                            className="w-[185px] object-contain h-[185px] rounded-md"
                          />
                        </div>
                      )}
                    </label>
                    <div className="text-xs mt-3">تصویر</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-y-4 px-5 py-3 justify-between items-center gap-x-20 bg-[#f5f8fa]">
                <div className="bg-gray-50 flex flex-col">
                  <span className="font-normal text-[11px] text-start">سایز عکس میبایست 300*200 پیکسل باشد</span>
                  <span className="font-normal text-[11px] text-start">حجم عکس میبایست حداکثر 40 کیلوبایت باشد</span>
                  <span className="font-normal text-[11px] text-start">نوع عکس میبایست png باشد</span>
                </div>
                <div className="flex flex-col">
                  {formErrors.nameFa && <p className="text-red-500 px-10">{formErrors.nameFa.message}</p>}
                  {formErrors.nameEn && <p className="text-red-500 px-10">{formErrors.nameEn.message}</p>}
                  {formErrors.Thumbnail && <p className="text-red-500 px-10">{formErrors.Thumbnail.message}</p>}
                </div>
                <Button
                  type="submit"
                  className={`bg-sky-500 px-5 py-2.5 hover:bg-sky-600 ${!isValid ? 'bg-gray-300' : ''} `}
                  isLoading={isLoadingCreate || isLoadingUpdate}
                >
                  {title === 'افزودن' ? 'انتشار ' : 'بروزرسانی'}
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  )
}

export default BrandModal
