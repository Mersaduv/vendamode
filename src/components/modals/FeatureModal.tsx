import { Modal, Button, CustomCheckbox } from '@/components/ui'
import { ICategory, ICategoryForm } from '@/types'
import SizesCombobox from '../selectorCombobox/SizesCombobox'
import {
  useCreateCategoryMutation,
  useCreateFeatureMutation,
  useGetSizesQuery,
  useUpdateCategoryFeatureMutation,
  useUpdateCategoryMutation,
} from '@/services'
import { useEffect, useState } from 'react'
import { HandleResponse } from '../shared'
import { CategoryFeatureForm } from '@/services/category/types'
import { Resolver, SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { categorySchema, singleSchema } from '@/utils'

interface Props {
  title: string
  feature?: ProductFeature
  isShow: boolean
  onClose: () => void
  refetch: () => void
}

const FeatureModal: React.FC<Props> = (props) => {
  const { isShow, onClose, refetch, title } = props

  const [
    createFeature,
    {
      data: dataCreate,
      isSuccess: isSuccessCreate,
      isError: isErrorCreate,
      error: errorCreate,
      isLoading: isLoadingCreate,
    },
  ] = useCreateFeatureMutation()

  // ? Form Hook
  const {
    handleSubmit,
    formState: { errors: formErrors, isValid },
    register,
    setValue,
    reset,
  } = useForm<{ id?: string; name: string }>({
    resolver: yupResolver(singleSchema),
  })

  const onConfirm: SubmitHandler<{ id?: string; name: string }> = (data) => {
    if (data.id != undefined) {
    } else {
      createFeature({ name: data.name })
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
      <Modal
        isShow={isShow}
        onClose={() => {
          onClose()
        }}
        effect="bottom-to-top"
      >
        <Modal.Content
          onClose={onClose}
          className="flex h-full flex-col z-[199] gap-y-5 bg-white py-5 pb-0 md:rounded-lg"
        >
          <Modal.Header notBar onClose={onClose}>
            <div className="text-start text-base">{title} ویژگی</div>
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

              <div className="flex flex-col md:flex-row gap-y-4 px-5 py-3 justify-between items-center gap-x-20 bg-[#f5f8fa]">
                {/* validation errors */}
                <div className="flex flex-col">
                  {formErrors.name && <p className="text-red-500 px-10">{formErrors.name.message}</p>}
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

export default FeatureModal
