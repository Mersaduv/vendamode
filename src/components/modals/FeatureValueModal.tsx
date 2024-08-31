import { Modal, Button } from '@/components/ui'
import { useCreateFeatureValueMutation, useUpdateFeatureValueMutation } from '@/services'
import { useEffect, useState } from 'react'
import { HandleResponse } from '../shared'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { singleSchema } from '@/utils'
import { FeatureValue, FeatureValueDTO, ProductFeature } from '@/services/feature/types'

interface Props {
  title: string
  featureValue?: FeatureValue
  productFeature?: ProductFeature | null
  isShow: boolean
  onClose: () => void
  refetch: () => void
}

const FeatureValueModal: React.FC<Props> = (props) => {
  const { isShow, onClose, refetch, title, featureValue, productFeature } = props
  const [isColor, setIsColor] = useState(false)
  const [
    createFeatureValue,
    {
      data: dataCreate,
      isSuccess: isSuccessCreate,
      isError: isErrorCreate,
      error: errorCreate,
      isLoading: isLoadingCreate,
    },
  ] = useCreateFeatureValueMutation()

  const [
    updateFeatureValue,
    {
      data: dataUpdate,
      isSuccess: isSuccessUpdate,
      isError: isErrorUpdate,
      error: errorUpdate,
      isLoading: isLoadingUpdate,
    },
  ] = useUpdateFeatureValueMutation()

  const {
    handleSubmit,
    formState: { errors: formErrors, isValid },
    register,
    setValue,
    reset,
  } = useForm<FeatureValueDTO>({
    resolver: yupResolver(singleSchema),
  })

  useEffect(() => {
    if (productFeature?.name === 'رنگ') {
      setIsColor(true)
    } else {
      setIsColor(false)
    }
  }, [productFeature])

  useEffect(() => {
    if (featureValue) {
      reset({
        id: featureValue.id,
        name: featureValue.name,
        hexCode: isColor ? featureValue.hexCode || '#FFFFFFF' : undefined,
        description: featureValue.description ?? '',
        productFeatureId: featureValue.productFeatureId ?? '',
      })
    }
  }, [featureValue, reset])

  const onConfirm: SubmitHandler<FeatureValueDTO> = (data) => {
    if (data.id != undefined) {
      updateFeatureValue({
        id: data.id,
        name: data.name,
        hexCode: isColor ? data.hexCode : undefined,
        description: data.description,
        productFeatureId: data.productFeatureId,
      })
    } else {
      createFeatureValue({
        name: data.name,
        hexCode: isColor ? data.hexCode : undefined,
        description: data.description,
        productFeatureId: productFeature?.id,
      })
    }
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
              {title === 'ویرایش' ? (
                'ویرایش'
              ) : (
                <div className="flex">
                  {title} مقدار برای <div className="text-sky-500 mx-2">{productFeature?.name}</div>{' '}
                </div>
              )}{' '}
              <div className="text-sky-500">{featureValue?.name}</div>
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

              <div className="flex items-center w-full gap-x-12 px-6">
                <div className="relative mb-3 w-full">
                  <input
                    type="text"
                    className="peer m-0 pr-3 block rounded-lg h-[50px] w-full border border-solid border-gray-200 bg-transparent bg-clip-padding pl-3 py-4 text-xl font-normal leading-tight text-neutral-700 transition duration-200 ease-linear placeholder:text-transparent focus:border-primary focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-primary dark:border-neutral-400 dark:text-white dark:autofill:shadow-autofill dark:focus:border-primary dark:peer-focus:text-primary [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]"
                    id="floatingInput"
                    placeholder="توضیحات"
                    {...register('description')}
                  />
                  <label
                    htmlFor="floatingInput"
                    className="pointer-events-none absolute right-0 top-0 origin-[0_0] border border-solid border-transparent pr-3 pb-4 pt-3.5 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary"
                  >
                    توضیحات
                  </label>
                </div>
              </div>

              {isColor && (
                <div className="flex items-center border rounded-lg py-1 mx-6 px-3.5">
                  <span>رنگ</span>
                  <div className="flex items-center gap-x-12 px-6">
                    <div className="relative w-full">
                      <input
                        type="color"
                        className="block h-10 border border-gray-200 rounded-lg focus:outline-none"
                        {...register('hexCode')}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-y-4 px-5 py-3 justify-between items-center gap-x-20 bg-[#f5f8fa]">
                <div className="flex flex-col">
                  {formErrors.name && <p className="text-red-500 px-10">{formErrors.name.message}</p>}
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

export default FeatureValueModal
