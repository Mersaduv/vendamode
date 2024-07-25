import { Modal, Button } from '@/components/ui'
import { ICategory, IProductSizeForm } from '@/types'
import SizesCombobox from '../selectorCombobox/SizesCombobox'
import {
  useCreateCategorySizeMutation,
  useGetSizeByCategoryIdQuery,
  useGetSizesQuery,
  useUpdateCategoryFeatureMutation,
  useUpdateCategorySizeMutation,
} from '@/services'
import { HandleResponse } from '../shared'
import { CategoryFeatureForm } from '@/services/category/types'
import { AiOutlineClose } from 'react-icons/ai'
import React, { ChangeEvent, KeyboardEvent, useEffect, useState, FocusEvent } from 'react'
import { useForm, Resolver, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { productSizeSchema } from '@/utils'
import { skipToken } from '@reduxjs/toolkit/query'
import { GetProductSizeResult } from '@/services/size/types'

interface Props {
    category: ICategory | undefined
    isShow: boolean
    onClose: () => void
    refetch: () => void
    productSizeCategoryData: GetProductSizeResult | undefined
  }
  interface Tags {
    id: string
    name: string
  }
  
  const fetchImageAsFile = async (url: string): Promise<File> => {
    const response = await fetch(url)
    const blob = await response.blob()
    const fileName = url.split('/').pop()
    return new File([blob], fileName || 'image.jpg', { type: blob.type })
  }
  
  const SubCategorySizesUpdateModal: React.FC<Props> = (props) => {
    // ? Props
    const { category, isShow, onClose, refetch ,productSizeCategoryData} = props
    // States
    const [tags, setTags] = useState<Tags[]>([])
    const [inputValue, setInputValue] = useState('')
    const [selectSizeType, setSelectSizeType] = useState<string>('0')
    const [selectedFile, setSelectedFile] = useState<File[]>([])
  
    const {
      handleSubmit,
      control,
      formState: { errors: formErrors, isValid },
      setValue,
      getValues,
      watch,
      reset,
    } = useForm<IProductSizeForm>({
      resolver: yupResolver(productSizeSchema) as unknown as Resolver<IProductSizeForm>,
      defaultValues: { sizeType: '0' },
    })
  
    const [
      updateSizeCategoryFeature,
      {
        data: dataUpdate,
        isSuccess: isSuccessUpdate,
        isError: isErrorUpdate,
        error: errorUpdate,
        isLoading: isLoadingUpdate,
      },
    ] = useUpdateCategorySizeMutation()
  
    useEffect(() => {
      setSelectedFile([])
      setInputValue('')
      setTags([])
      const loadData = async () => {
        console.log(productSizeCategoryData)
  
        if (productSizeCategoryData && productSizeCategoryData?.data !== null) {
          console.log(productSizeCategoryData, 'productSizeCategoryData')
  
          const imageFile = await fetchImageAsFile(productSizeCategoryData.data.imagesSrc?.imageUrl ?? '')
          if (imageFile) {
            setSelectedFile([imageFile])
          }
          const productSizeValues = productSizeCategoryData.data.productSizeValues || []
          const tagsData = productSizeValues.map((value) => ({
            id: value.id,
            name: value.name,
          }))
          setTags(tagsData)
          reset({
            id: productSizeCategoryData.data.id,
            sizeType: productSizeCategoryData.data.sizeType,
            categoryIds: [category?.id],
            thumbnail: imageFile,
          })
        }
      }
      loadData()
    }, [productSizeCategoryData])
  
    useEffect(() => {
      setValue(
        'productSizeValues',
        tags.map((item) => item.name)
      )
    }, [tags])
  
    // ؟ Handler
    const handleMainFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setSelectedFile([...Array.from(e.target.files)])
        if ([...Array.from(e.target.files)].length > 0) {
          setValue('thumbnail', e.target.files[0])
        } else {
          setValue('thumbnail', null)
        }
      }
    }
    const addTag = () => {
      if (inputValue.trim() !== '') {
        setTags([...tags, { id: Date.now().toString(), name: inputValue.trim() }])
        setInputValue('')
      }
    }
  
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        addTag()
      }
    }
  
    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      addTag()
    }
  
    const handleRemove = (item: Tags) => {
      setTags(tags.filter((tag) => tag.id !== item.id))
    }
  
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value)
    }
    const handleSizeTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const sizeType = event.target.value
      setSelectSizeType(sizeType)
  
      if (sizeType === '0' || sizeType === '1') {
        console.log(sizeType)
        setValue('sizeType', sizeType)
      }
    }
  
    const onConfirm: SubmitHandler<IProductSizeForm> = (data) => {
      console.log(productSizeCategoryData, 'sub data')
  
      const formData = new FormData()
  
      if (data.id !== null && data.id !== undefined) {
        formData.append('Id', data.id)
      }
  
      if (category !== undefined) {
        const categoryIds = [category.id]
        categoryIds.forEach((value, index) => {
          formData.append(`CategoryIds`, value)
        })
      }
      formData.append('SizeType', data.sizeType)
  
      data.productSizeValues.forEach((value, index) => {
        formData.append(`ProductSizeValues`, value)
      })
  
      if (data.thumbnail) {
        formData.append('Thumbnail', data.thumbnail)
      }
      if (productSizeCategoryData?.data !== null) {
        updateSizeCategoryFeature(formData)
      } else {
      }
    }
  
    const handleFormKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
      }
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
            refetch()
          }}
          effect="bottom-to-top"
        >
          <Modal.Content
            onClose={onClose}
            className="flex h-full flex-col z-[199] gap-y-5 bg-white  py-5 pb-0 md:rounded-lg "
          >
            <Modal.Header notBar onClose={onClose}>
              <div className="text-start text-base">انتخاب اندازه برای {category?.name}</div>
            </Modal.Header>
            <Modal.Body>
              <form
                onSubmit={handleSubmit(onConfirm)}
                onKeyDown={handleFormKeyDown}
                className="space-y-4 bg-white   text-center md:rounded-lg"
              >
                <div className="flex items-center gap-12 px-6">
                  <span>مقادیر</span>
  
                  <div className="flex border w-1/2 rounded-lg">
                    <select
                      className="w-full rounded-lg text-sm focus:outline-none appearance-none border-none"
                      name="انتخاب"
                      id=""
                      onChange={handleSizeTypeChange}
                    >
                      <option value={'0'}>سانتیمتر</option>
                      <option value={'1'}>میلیمتر</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center w-full gap-x-12 px-6">
                  <span>مقادیر</span>
                  <div className="w-full">
                    <div
                      className="border min-h-[46px] py-1 px-1 relative flex flex-col justify-center bg-white border-gray-200 rounded-md"
                      id="childrens"
                    >
                      <div className="flex-wrap flex gap-2">
                        {tags.map((item) => (
                          <div key={item.id} className="flex custom-z4 items-center bg-gray-100 rounded-md px-2 h-9">
                            <span className="text-gray-900 text-sm whitespace-nowrap">{item.name}</span>
                            <button type="button" onClick={() => handleRemove(item)}>
                              <AiOutlineClose className="mr-1 text-gray-400 hover:text-gray-900" size={14} />
                            </button>
                          </div>
                        ))}
                        <input
                          type="text"
                          className="p-0 border-none focus:border-none focus:outline-none focus:ring-0 appearance-none outline-none flex-1 min-w-[100px]"
                          value={inputValue}
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                          onBlur={handleBlur}
                        />
                      </div>
                    </div>
                  </div>
                </div>
  
                <div className=" flex flex-col items-center justify-center">
                  <input type="file" className="hidden" id="thumbnailProductSizeUpdate" onChange={handleMainFileChange} />
                  <label
                    htmlFor="thumbnailProductSizeUpdate"
                    className="block w-fit  rounded-lg cursor-pointer text-sm font-normal"
                  >
                    {selectedFile.length == 0 ? (
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
                {formErrors.sizeType && <p className="text-red-500 px-10">{formErrors.sizeType.message}</p>}
  
                {formErrors.productSizeValues && (
                  <p className="text-red-500 px-10">{formErrors.productSizeValues?.message}</p>
                )}
  
                {formErrors.thumbnail && <p className="text-red-500 px-10">{formErrors.thumbnail?.message}</p>}
  
                <div className="flex px-5 py-3 justify-between items-center gap-x-20 bg-[#f5f8fa]">
                  <div className="flex flex-col items-start">
                    <p className="text-xs">ابعاد تصویر میبایست 600*600 پیکسل باشد</p>
                    <p className="text-xs">نوع عکس میبایست jpg باشد</p>
                  </div>
                  <Button
                    type="submit"
                    className="bg-sky-500 px-5 py-3 hover:bg-sky-600"
                    isLoading={isLoadingUpdate}
                  >
                    ذخیره
                  </Button>
                </div>
              </form>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </>
    )
  }
  
  export default SubCategorySizesUpdateModal
  