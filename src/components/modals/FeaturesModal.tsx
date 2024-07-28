import { Modal, Button } from '@/components/ui'
import { ICategory } from '@/types'
import SizesCombobox from '../selectorCombobox/SizesCombobox'
import { useGetFeaturesQuery, useGetSizesQuery, useUpdateCategoryFeatureMutation } from '@/services'
import { useEffect, useState } from 'react'
import { HandleResponse } from '../shared'
import { CategoryFeatureForm } from '@/services/category/types'
import { ProductFeatureCombobox } from '../selectorCombobox'
import { ProductFeature } from '@/services/feature/types'

interface Props {
  category: ICategory | undefined
  isShow: boolean
  onClose: () => void
  refetch: () => void
}

const FeaturesModal: React.FC<Props> = (props) => {
  // States
  const [stateFeature, setStateFeature] = useState<ProductFeature[]>([])
  const [featureDb, setFeatureDb] = useState<ProductFeature[]>()

  // ? Props
  const { category, isShow, onClose, refetch } = props

  const { data, isLoading } = useGetFeaturesQuery(
    {},
    {
      selectFromResult: ({ data, isLoading }) => ({
        data: data?.data?.data,
        isLoading,
      }),
    }
  )
  const [
    updateCategoryFeature,
    {
      data: dataUpdate,
      isSuccess: isSuccessUpdate,
      isError: isErrorUpdate,
      error: errorUpdate,
      isLoading: isLoadingUpdate,
    },
  ] = useUpdateCategoryFeatureMutation()

  useEffect(() => {
    if (data) {
      setFeatureDb(data)
    }
  }, [data])

  const handleFeatureSelect = (features: ProductFeature[]) => {
    setStateFeature((prevState) => {
      const newState = prevState.filter((item) => features.some((feature) => feature.id === item.id))
      features.forEach((feature) => {
        if (!newState.some((item) => item.id === feature.id)) {
          newState.push(feature)
        }
      })
      return newState
    })
  }

  const onConfirm = () => {
    const featureListIds = stateFeature.map((feature) => feature.id)

    updateCategoryFeature({
      categoryId: category!.id,
      featureIds: featureListIds,
    })
  }

  // ? Render(s)
  return (
    <>
      {/* Handle Response */}
      {(isSuccessUpdate || isErrorUpdate) && (
        <HandleResponse
          isError={isErrorUpdate}
          isSuccess={isSuccessUpdate}
          error={errorUpdate}
          message={dataUpdate?.message}
          onSuccess={() => {
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
          className="flex h-full flex-col z-[199] gap-y-5 bg-white  py-5 pb-0 md:rounded-lg "
        >
          <Modal.Header notBar onClose={onClose}>
            <div className="text-start text-base">انتخاب سایزبندی برای {category?.name}</div>
          </Modal.Header>
          <Modal.Body>
            <div className="space-y-4 bg-white   text-center md:rounded-lg">
              <div className="flex items-center w-full gap-x-12 px-6">
                <span>ویژگی ها</span>
                <div className="w-full">
                  <ProductFeatureCombobox
                    onFeatureSelect={handleFeatureSelect}
                    featureList={data ?? []}
                    stateFeatureData={featureDb?.filter((feature) => category?.featureIds?.includes(feature.id))}
                  />
                </div>
              </div>
              <div className="flex px-5 py-3 justify-between items-center gap-x-20 bg-[#f5f8fa]">
                <span className="text-xs">ویژگی های مربوط به محصولات این دسته یندی را وارد کنید</span>
                <Button
                  className="bg-sky-500 px-5 py-3 hover:bg-sky-600"
                  onClick={onConfirm}
                  isLoading={isLoadingUpdate}
                >
                  ذخیره
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  )
}

export default FeaturesModal
