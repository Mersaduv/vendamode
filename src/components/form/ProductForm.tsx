import { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

import { SubmitHandler, useForm, Resolver } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { FaLongArrowAltDown } from 'react-icons/fa'
import { FaArrowDownLong } from 'react-icons/fa6'
import { Modal, DisplayError, TextField, SubmitModalButton, Combobox } from '@/components/ui'
import { AddressSkeleton } from '../skeleton'
import { Address, Delete, Edit, Location, Location2, Phone, Plus, Post, User, UserLocation, Users } from '@/icons'
import { BsTelephoneOutboundFill } from 'react-icons/bs'

import { productSchema } from '@/utils'

import type {
  IProduct,
  ICategory,
  IProductForm,
  IBrand,
  IProductSizeInfo,
  IStockItem,
  IProductScaleCreate,
} from '@/types'
import { CategorySelector } from '../categories'
import {
  useGetBrandsQuery,
  useGetCategoriesTreeQuery,
  useGetFeaturesByCategoryQuery,
  useGetFeaturesQuery,
} from '@/services'
import TextEditor from './TextEditor'
import { AddFeatureCombobox, BrandCombobox, CategoryCombobox, FeatureCombobox } from '../selectorCombobox'
import { Button } from '../ui'
import { useGetSizeByCategoryIdQuery } from '@/services/size/apiSlice'
import { digitsEnToFa, digitsFaToEn } from '@persian-tools/persian-tools'
import { useAppDispatch, useDisclosure } from '@/hooks'
import { showAlert } from '@/store'
import { MdClose } from 'react-icons/md'

const generateUniqueId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

interface CreateProductFormProps {
  mode: 'create'
  createHandler: (data: FormData) => void
  updateHandler?: never
  isLoadingCreate: boolean
  selectedProduct?: never
  isLoadingUpdate?: never
}

interface EditProductFormProps {
  mode: 'edit'
  createHandler?: never
  updateHandler: (data: FormData) => void
  selectedProduct: IProduct
  isLoadingCreate?: never
  isLoadingUpdate: boolean
}

type Props = CreateProductFormProps | EditProductFormProps

export interface SelectedCategories {
  categorySelected?: ICategory
}

const initialSelectedCategories = {
  categorySelected: {} as ICategory,
}

interface PropTable {
  features: ProductFeature[]
  sizeList: SizeDTO[]
  setStateSizeFeature: Dispatch<SetStateAction<SizeDTO[]>>
  setStateFeature: Dispatch<SetStateAction<ProductFeature[]>>
  setStateStockItems: Dispatch<SetStateAction<IStockItem[]>>
  setProductSizeScale: Dispatch<SetStateAction<IProductSizeInfo>>
  selectedFiles: File[]
}

interface PropSetStockImage {
  selectedFiles: File[]
  selectedStockFiles: File | null
  setSelectedStockFiles: (file: File, index: number) => void
  isShow?: boolean
  onClose?: () => void
  open?: () => void
}

interface CurrentRow {
  [key: string]: any
  sizeId?: string
  featureValueIds?: string[]
}

const ProductForm: React.FC<Props> = (props) => {
  // ? Props
  const { mode, createHandler, isLoadingCreate, isLoadingUpdate, updateHandler, selectedProduct } = props

  // ? States
  const [isDetailsSkip, setIsDetailsSkip] = useState(true)
  const [isProductScale, setIsProductScale] = useState(false)
  const [isStock, setIsStock] = useState(false)
  const [isFeaturesSkip, setIsFeaturesSkip] = useState(false)
  const [isRemoveProductSize, setIsRemoveProductSize] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<SelectedCategories>(initialSelectedCategories)
  const [mainCategories, setMainCategories] = useState<ICategory[]>([])
  const [childCategories, setChildCategories] = useState<ICategory[]>([])
  const [selectedMainFile, setMainSelectedFiles] = useState<any[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [stateBrand, setStateBrand] = useState<IBrand | null>(null)
  const [stateStockItems, setStateStockItems] = useState<IStockItem[]>([])
  const [stateFeatureListForTable, setStateFeatureListForTable] = useState<ProductFeature[]>([])
  const [stateFeature, setStateFeature] = useState<ProductFeature[]>([])
  const [stateSizeFeature, setStateSizeFeature] = useState<SizeDTO[]>([])
  const [selectedMainFeature, setMainSelectedFeatures] = useState<ProductFeature>()
  const [selectedAddFeature, setSelectedAddFeature] = useState<ProductFeature[]>([])
  const [stateFeatureData, setStateFeatureData] = useState<ProductFeature[]>([])
  const [stateFeatureDataByCategory, setStateFeatureDataByCategory] = useState<ProductFeature[]>([])
  const [productSizeScale, setProductSizeScale] = useState<IProductSizeInfo>({
    sizeType: '0', // provide a default value for sizeType
    rows: [],
    columns: null,
    imagesSrc: undefined,
  })
  const [selectedMainCategory, setSelectedMainCategory] = useState<ICategory | null>(null)
  const [selectedBrand, setSelectedBrand] = useState<IBrand | null>(null)
  const [productScaleCreate, setProductScaleCreate] = useState<IProductScaleCreate>()

  // ? Form Hook
  const {
    handleSubmit,
    register,
    reset,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors: formErrors, isValid },
  } = useForm<IProductForm>({
    resolver: yupResolver(productSchema) as unknown as Resolver<IProductForm>,
    defaultValues: {
      IsActive: true,
    },
  })

  const { productScales } = useGetSizeByCategoryIdQuery(
    {
      id: selectedCategories?.categorySelected?.id as string,
    },
    {
      selectFromResult: ({ data }) => ({
        productScales: data?.data,
      }),
    }
  )

  useEffect(() => {
    if (productScales) {
      // console.log(productScales)
      if (productSizeScale?.columns == null) {
        setProductSizeScale({
          sizeType: productScales.sizeType,
          rows:
            productScales.productSizeValues?.map((productSizeValue) => ({ productSizeValue: productSizeValue.name })) ||
            [],
          columns: [],
          imagesSrc: productScales.imagesSrc,
        })
      }
    }
  }, [productScales])

  if (productSizeScale) {
    // console.log(productSizeScale)
  }
  //؟ all Features Query
  const { data: allFeatures } = useGetFeaturesQuery()

  // ? Get Categories Query
  const { categoriesData } = useGetCategoriesTreeQuery(undefined, {
    selectFromResult: ({ data }) => ({
      categoriesData: data?.data,
    }),
  })

  useEffect(() => {
    if (categoriesData) {
      const mainCats = categoriesData.filter((category) => category.level === 0)
      setMainCategories(mainCats)
    }
  }, [categoriesData])

  // ? Queries
  //*   Get Details
  const { data: features } = useGetFeaturesByCategoryQuery(selectedCategories?.categorySelected?.id as string, {
    skip: isDetailsSkip,
  })

  useEffect(() => {
    if (features?.data?.productFeatures) {
      setStateFeatureDataByCategory(features.data.productFeatures)
    }
  }, [features])

  // if (stateFeatureDataByCategory) {
  //   console.log(stateFeatureDataByCategory)
  // }

  // ? Queries
  //*   Get Brands
  const { data: brandData } = useGetBrandsQuery({ page: 1, pageSize: 200 })

  // ? Re-Renders
  //*   Select Category To Fetch Details
  useEffect(() => {
    if (selectedCategories?.categorySelected?.id) {
      setIsDetailsSkip(false)
      setIsProductScale(false)
      setStateFeature([])
      setStateSizeFeature([])
      setValue('CategoryId', selectedCategories?.categorySelected?.id, { shouldValidate: true })
    }
  }, [selectedCategories?.categorySelected?.id])

  //*   Set Details
  // useEffect(() => {
  //   if (features && getValues('Title') != '') {
  //     // setValue('info', details.info)
  //     // setValue('specification', details.specification)
  //     // setValue('optionsType', details.optionsType)
  //     var titledata = getValues('Title')
  //     // console.log(features, titledata)
  //     setIsFeaturesSkip(true)
  //   }
  // }, [features, getValues('Title')])

  // ? Handlers
  const editedCreateHandler: SubmitHandler<IProductForm> = (data) => {
    const formData = new FormData()

    formData.append('Title', data.Title)
    formData.append('IsActive', data.IsActive.toString())
    if (data.MainThumbnail) {
      formData.append('MainThumbnail', data.MainThumbnail)
    }

    if (data.Thumbnail && data.Thumbnail.length > 0) {
      data.Thumbnail.forEach((file, index) => {
        formData.append('Thumbnail', file)
      })
    }

    formData.append('CategoryId', data.CategoryId)
    formData.append('Description', data.Description)
    formData.append('IsFake', data.IsFake.toString())
    if (data.BrandId) {
      formData.append('BrandId', data.BrandId)
    }
    if (data.FeatureValueIds) {
      data.FeatureValueIds.forEach((id) => {
        formData.append('FeatureValueIds', id)
      })
    }

    if (data.StockItems) {
      const stockItemsWithoutFile = data.StockItems.map((item) => {
        const { thumbnailsStock, ...rest } = item
        return rest
      })

      formData.append('StockItems', JSON.stringify(stockItemsWithoutFile))

      data.StockItems.forEach((item, index) => {
        if (item.imageStock) {
          formData.append(`ImageStock_${item.stockId || index}`, item.imageStock)
        }
      })
    }
    if (data.ProductScale) {
      formData.append('ProductScale', JSON.stringify(data.ProductScale))
      console.log(data.ProductScale, 'data.ProductScale')
    }

    if (mode == 'create') {
      createHandler(formData)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles])
      if (newFiles.length > 0) {
        setValue('Thumbnail', ((getValues('Thumbnail') as File[]) || []).concat(newFiles))
      } else {
        setValue('Thumbnail', [])
      }
    }
  }

  const handleMainFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMainSelectedFiles([...Array.from(e.target.files)])
      if ([...Array.from(e.target.files)].length > 0) {
        setValue('MainThumbnail', e.target.files[0])
      } else {
        setValue('MainThumbnail', null)
      }
    }
  }

  // onSelect Combobox selector
  const handleMainCategorySelect = (category: ICategory) => {
    setChildCategories(category?.childCategories || ([] as ICategory[]))
  }

  const handleBrandSelect = (brand: IBrand) => {
    if (brand) {
      setValue('BrandId', brand.id)
    }
    setStateBrand(brand || ({} as IBrand))
  }

  const handleFeatureSelect = (features: SizeDTO[] | ProductFeature) => {
    if (Array.isArray(features)) {
      // console.log(features)
      setStateSizeFeature((prevState) => {
        const newState = prevState.filter((item) => features.some((feature) => feature.id === item.id))
        features.forEach((feature) => {
          if (!newState.some((item) => item.id === feature.id)) {
            newState.push(feature)
          }
        })
        setProductSizeScale(
          (prevState): IProductSizeInfo => ({
            ...prevState,
            columns: newState,
          })
        )
        return newState
      })
    } else {
      setStateFeature((prevState) => {
        const featureExists = prevState.some((item) => item.id === features.id)

        if (!featureExists) {
          return [...prevState, features]
        } else {
          return prevState
            .map((item) => {
              if (item.id === features.id) {
                return { ...item, values: features.values }
              }
              return item
            })
            .filter((item) => item.values && item.values.length > 0) // حذف feature اگر values خالی باشد
        }
      })
    }
  }

  useEffect(() => {
    if (stateSizeFeature.length > 0) {
      setIsProductScale(true)
    } else {
      setIsProductScale(false)
    }
  }, [stateSizeFeature])

  useEffect(() => {
    if (stateFeature.length > 0) {
      setIsStock(true)
    } else {
      setIsStock(false)
    }
    console.log(stateFeature, stateSizeFeature)
  }, [stateFeature])

  useEffect(() => {
    // console.log(stateFeature)

    if (stateFeature) {
      const featureValueIds = stateFeature.flatMap((feature) => feature.values ?? []).map((value) => value.id)
      setValue('FeatureValueIds', featureValueIds)
    }
  }, [stateFeature])

  useEffect(() => {}, [])

  const handleMainFeatureSelect = (newFeatures: ProductFeature) => {
    setMainSelectedFeatures(newFeatures || ({} as ProductFeature))
  }

  const handleAddFeature = () => {
    const newFeature = selectedMainFeature ?? ({} as ProductFeature)

    // Check if the feature already exists in stateFeatureDataByCategory
    const existingFeatureInState = stateFeatureDataByCategory.find((feature) => feature.id === newFeature.id)

    if (!existingFeatureInState) {
      setStateFeatureDataByCategory((prevFeatures) => [...prevFeatures, newFeature])

      // Filter out the newly added feature from stateFeatureData
      setStateFeatureData((prevStateFeatures) =>
        prevStateFeatures.filter((stateFeature) => stateFeature.id !== newFeature.id)
      )
    }
  }

  const handleRemoveFeatureToAddOnStateFeatureData = (feature: ProductFeature) => {
    setStateFeatureData((prevFeatures) => [...prevFeatures, feature])
    setStateFeatureDataByCategory((prevFeatures) => prevFeatures.filter((f) => f.id !== feature.id))
  }

  const handleRemoveProductSize = () => {
    setIsRemoveProductSize((prev) => !prev)
  }

  useEffect(() => {
    if (allFeatures?.data && features?.data?.productFeatures) {
      const filteredData = allFeatures.data.filter(
        (allFeature) => !features?.data?.productFeatures?.some((feature) => feature.id === allFeature.id)
      )
      setStateFeatureData(filteredData)
    }
  }, [allFeatures, features])

  if (stateSizeFeature) {
    // console.log(stateSizeFeature)
  }

  useEffect(() => {
    if (stateStockItems) {
      setValue('StockItems', stateStockItems)
      console.log(stateStockItems, 'stateStockItems-2')
    }
  }, [stateStockItems])

  useEffect(() => {
    if (productSizeScale) {
      setProductScaleCreate({
        columnSizes: productSizeScale?.columns?.map((col) => ({ id: col.id, name: col.name })),
        Rows:
          productSizeScale?.rows?.map((row, rowIndex) => ({
            id: rowIndex.toString(),
            idx: rowIndex.toString(),
            scaleValues: productSizeScale?.columns?.map(() => ''),
            productSizeValue: row.productSizeValue,
            productSizeValueId: rowIndex.toString(),
          })) || [],
      })
    }
  }, [productSizeScale])
  useEffect(() => {
    console.log(productScaleCreate, 'productScaleCreatec')
    setValue('ProductScale', productScaleCreate)
  }, [productScaleCreate])
  console.log(formErrors)

  // Function to handle input changes
  const handleChange = (rowIndex: number, colIndex: number, value: any) => {
    if (!isNaN(value) || value === '') {
      setProductScaleCreate((prevValues) => {
        const updatedRows = [...(prevValues?.Rows || [])]
        if (updatedRows[rowIndex]?.scaleValues) {
          updatedRows[rowIndex].scaleValues![colIndex] = value
        }
        return { ...prevValues, Rows: updatedRows }
      })
    }
  }
  const handleDelete = (index: number) => {
    setSelectedFiles((prevFiles) => {
      const updatedFiles = [...prevFiles]
      updatedFiles.splice(index, 1)
      return updatedFiles
    })

    setValue(
      'Thumbnail',
      ((getValues('Thumbnail') as File[]) || []).filter((_, i) => i !== index)
    )
  }
  return (
    <section>
      <form className="flex gap-4 flex-col pt-4 lg:pt-14" onSubmit={handleSubmit(editedCreateHandler)}>
        {/* register title , isActive */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-1">
            <div className="bg-white w-full rounded-md shadow-item">
              <h3 className="border-b p-6 text-gray-600">محصول جدید</h3>
              <div className="flex flex-col xs:flex-row px-10 py-10 pt-6">
                <label
                  htmlFor="title"
                  className="flex items-center xs:py-0 py-2 justify-center px-3 rounded-l-none rounded-md bg-[#f5f8fa]"
                >
                  <img className="w-5 h-5" src="/assets/svgs/duotone/text.svg" alt="" />
                  <span className="whitespace-nowrap text-center w-[113px]">نام محصول</span>
                </label>
                <input
                  className="w-full border rounded-r-none border-gray-200 rounded-md "
                  type="text"
                  id="title"
                  {...register('Title')}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-1">
            <div className="bg-white w-full rounded-md shadow-item">
              <h3 className="border-b p-6 text-gray-600">وضعیت محصول</h3>
              <div className="flex px-10 py-10 pt-6 flex-col xs:flex-row">
                <label
                  htmlFor="title"
                  className="flex items-center justify-center xs:py-0 py-2 px-3 rounded-l-none rounded-md bg-[#f5f8fa]"
                >
                  <img className="w-5 h-5" src="/assets/svgs/duotone/eye.svg" alt="" />
                  <span className="whitespace-nowrap text-center w-[113px]">قابل مشاهده</span>
                </label>
                <select
                  className="w-full rounded-md rounded-r-none border border-gray-300"
                  id="isActive"
                  {...register('IsActive')}
                >
                  <option value={'false'}>غیر فعال</option>
                  <option value={'true'}>فعال</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        {/*register image and category  */}
        <div className="flex flex-col md:flex-row gap-4  h-auto">
          <div className="flex flex-1 md:max-w-[370px]">
            <div className="bg-white w-full rounded-md shadow-item">
              <h3 className="border-b p-6 text-gray-600">دسته بندی محصول</h3>
              <div className="flex px-6 py-10 pt-6">
                {mode === 'create' && (
                  <div className="w-full">
                    <CategoryCombobox
                      selectedMainCategory={selectedMainCategory}
                      setSelectedMainCategory={setSelectedMainCategory}
                      mainCategories={mainCategories}
                      onCategorySelect={handleMainCategorySelect}
                    />
                    <CategorySelector
                      setSelectedCategories={setSelectedCategories}
                      selectedCategories={selectedCategories}
                      categories={childCategories}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-1 relative">
            <div className="bg-white  flex-col w-full h-full rounded-md shadow-item">
              <h3 className="border-b p-6 text-gray-600">تصویر محصول</h3>
              {/* negare  */}
              <div className="flex justify-center mt-8">
                <div className="">
                  <input type="file" className="hidden" id="MainThumbnail" onChange={handleMainFileChange} />
                  <label htmlFor="MainThumbnail" className="block cursor-pointer p-6  text-sm font-normal">
                    <h3 className="font-medium text-center mb-6">نگاره اول</h3>
                    {selectedMainFile.length > 0 ? (
                      selectedMainFile.map((file: any, index: number) => (
                        <div key={index} className="text-sm shadow-item rounded-lg p-2 text-gray-600">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-[125px] object-contain h-[125px] rounded-md"
                          />
                        </div>
                      ))
                    ) : (
                      <img
                        className="w-[125px] h-[125px] rounded-md"
                        src="/images/other/product-placeholder.png"
                        alt="product-placeholder"
                      />
                    )}
                  </label>
                </div>
              </div>
              <div className="flex flex-col justify-between h-fit py-10 pt-6 pb-0">
                {/* drag files  */}
                <div className="mt-4">
                  {/* Thumbnail upload */}
                  <div className="mb-6">
                    <h3 className="font-medium text-center mb-6">گالری محصول</h3>
                    <div className="border  mx-8  border-dashed border-[#009ef7] bg-[#f1faff] rounded text-center">
                      <input
                        // {...register('Thumbnail')}
                        type="file"
                        multiple
                        className="hidden"
                        id="Thumbnail"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="Thumbnail" className="block cursor-pointer p-6  text-sm font-normal">
                        عکس و فیلم ها را به اینجا بکشید یا برای انتخاب کلیک کنید{' '}
                      </label>
                    </div>

                    {selectedFiles.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4 px-8">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="text-sm text-gray-600 relative">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-[80px] h-[88px] object-cover  rounded-lg shadow-product"
                            />
                            <button
                              type="button"
                              className="absolute -top-2 -right-2 shadow-product bg-gray-50 p-0.5 rounded-full text-gray-500"
                              onClick={() => handleDelete(index)}
                            >
                              <MdClose className="text-base" /> {/* Add your delete icon here */}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="bg-gray-50 bottom-0 w-full  rounded-b-lg px-8 flex flex-col pb-2">
                    <span className="font-normal text-[11px] pt-2">حجم عکس ها می بایست حداکثر 70 کیلوبایت باشد</span>
                    <span className="font-normal text-[11px]">سایز عکس ها می بایست 700*700 پیکسل باشد</span>
                    <span className="font-normal text-[11px]">فرمت عکس ها می بایست jpg باشد</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {!isDetailsSkip && (
          <>
            {/*is show  add product descriptions*/}
            <div className="flex flex-1">
              <div className="bg-white w-full rounded-md shadow-item">
                <h3 className="border-b p-6 text-gray-600">توضیحات محصول</h3>
                <TextEditor control={control} />
                <div className="bg-gray-50 bottom-0 w-full  rounded-b-lg px-8 flex flex-col pb-2">
                  <span className="font-normal text-[11px] pt-2">حجم عکس ها می بایست حداکثر 100 کیلوبایت باشد</span>
                </div>
              </div>
            </div>
            {/* is show Product features,size */}
            <div className="flex flex-1 ">
              <div className="bg-white w-full rounded-md shadow-item">
                <h3 className="border-b p-6 text-gray-600">ویژگی محصول</h3>
                {/*select isFake , brand and feature*/}
                <div className="flex mt-8 md:justify-center px-3 md:px-0 mb-10">
                  <div className="space-y-9 flex flex-col ">
                    <div className="flex gap-10">
                      <label htmlFor="IsFake" className="w-[95px]  font-normal text-gray-600 text-sm  cursor-pointer">
                        محصول غیر اصل
                      </label>
                      <input
                        id="isFake"
                        {...register('IsFake')}
                        className="bg-[#f7f8fa]  cursor-pointer checked:text-2xl outline-none ring-0 border-none rounded-md w-[24px] h-[24px] "
                        type="checkbox"
                      />
                    </div>
                    {/* selector*/}
                    <div className="flex flex-col md:flex-row  md:items-center md:gap-10 gap-2">
                      <label htmlFor="BrandId" className="w-[95px] font-normal  text-gray-600 text-sm  cursor-pointer">
                        انتخاب برند{' '}
                      </label>
                      {brandData?.data?.data && (
                        <BrandCombobox
                          selectedBrand={selectedBrand}
                          setSelectedBrand={setSelectedBrand}
                          brands={brandData?.data?.data ?? []}
                          onBrandSelect={handleBrandSelect}
                        />
                      )}
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center md:gap-10 gap-2">
                      <label htmlFor="BrandId" className="w-[95px] font-normal  text-gray-600 text-sm  cursor-pointer">
                        ویژگی محصول{' '}
                      </label>
                      <div className="flex gap-1">
                        {stateFeatureData && (
                          <AddFeatureCombobox
                            features={stateFeatureData}
                            onFeatureSelect={handleMainFeatureSelect}
                            setIsRemoveProductSize={setIsRemoveProductSize}
                            isRemoveProductSize={isRemoveProductSize}
                          />
                        )}
                        <Button
                          onClick={handleAddFeature}
                          className="bg-white hover:text-white text-blue-400 text-sm border border-blue-500 hover:bg-blue-500 px-4 py-1.5"
                        >
                          افزودن
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* feature */}

                <div
                  style={{ background: 'rgba(169, 243, 252,0.2)' }}
                  className={`px-2 py-4 flex flex-col space-y-8 mb-6 mx-7 rounded-xl ${
                    stateFeatureDataByCategory.length === 0 && features?.data?.sizeDTOs?.length === 0 && 'invisible'
                  }`}
                >
                      {stateFeatureDataByCategory &&
                        stateFeatureDataByCategory
                          ?.filter((feature) => feature.values?.some((value) => value.hexCode !== null))
                          .map((feature) => {
                            const filteredFeature = {
                              ...feature,
                              values: feature.values?.filter((value) => value.hexCode !== null) ?? [],
                            }
                            return (
                              <div className="flex items-center flex-col xs:flex-row w-full gap-2 xs:gap-5" key={feature.id}>
                                <div className="text-gray-600 text-sm w-[190px] px-2"> {filteredFeature.name} </div>
                                <div className="w-full">
                                  <FeatureCombobox onFeatureSelect={handleFeatureSelect} features={filteredFeature} />
                                </div>
                                <Button
                                  onClick={() => handleRemoveFeatureToAddOnStateFeatureData(feature)}
                                  className="bg-white hover:bg-red-600 hover:text-white text-red-600 text-sm border border-red-600 px-4 py-1.5"
                                >
                                  حذف
                                </Button>
                              </div>
                            )
                          })}

                      {features?.data?.sizeDTOs && features.data.sizeDTOs.length > 0 && (
                        <div className="flex items-center flex-col xs:flex-row  w-full gap-2 xs:gap-5">
                          <div className="text-gray-600 text-sm w-[190px] px-2"> سایزبندی </div>
                          <div className="w-full">
                            <FeatureCombobox
                              onFeatureSelect={handleFeatureSelect}
                              sizeList={features.data.sizeDTOs ?? []}
                            />
                          </div>
                          <Button
                            onClick={handleRemoveProductSize}
                            className="bg-white hover:bg-red-600 hover:text-white text-red-600 text-sm border border-red-600 px-4 py-1.5"
                          >
                            حذف
                          </Button>
                        </div>
                      )}
                      {stateFeatureDataByCategory &&
                        stateFeatureDataByCategory
                          ?.filter((feature) => feature.values?.some((value) => value.hexCode == null))
                          .map((feature) => {
                            const filteredFeature = {
                              ...feature,
                              values: feature.values?.filter((value) => value.hexCode == null) ?? [],
                            }
                            return (
                              <div className="flex items-center flex-col xs:flex-row  w-full gap-2 xs:gap-5" key={feature.id}>
                                <div className="text-gray-600 text-sm w-[190px] px-2"> {filteredFeature.name} </div>
                                <div className="w-full">
                                  <FeatureCombobox onFeatureSelect={handleFeatureSelect} features={filteredFeature} />
                                </div>
                                <Button
                                  onClick={() => handleRemoveFeatureToAddOnStateFeatureData(feature)}
                                  className="bg-white hover:bg-red-600 hover:text-white text-red-600 text-sm border border-red-600 px-4 py-1.5"
                                >
                                  حذف
                                </Button>
                              </div>
                            )
                          })}
                    </div>
               
              </div>
            </div>
            {/* is show Product features, quantity, price , discount */}
            <div className="flex flex-1">
              <div className="bg-white w-full rounded-md shadow-item">
                <h3 className="border-b p-6 text-gray-600">تعداد و قیمت محصول</h3>
                <Table
                  features={stateFeature}
                  sizeList={stateSizeFeature}
                  setStateStockItems={setStateStockItems}
                  selectedFiles={selectedFiles}
                  setStateFeature={setStateFeature}
                  setStateSizeFeature={setStateSizeFeature}
                  setProductSizeScale={setProductSizeScale}
                />
              </div>
            </div>
            {/* is show product scale  */}
            {isProductScale && (
              <div className="flex flex-1">
                <div className="bg-white w-full rounded-md shadow-item  overflow-auto">
                  <h3 className="border-b p-6 text-gray-600">اندازه ها</h3>
                  <div className="flex flex-col-reverse md:w-[1000px] lg:w-[1300px] mx-auto mt-6 items-start mdx:flex-row gap-x-6 pb-4 px-7">
                    <div className="flex flex-col items-start flex-1 mdx:w-auto w-full overflow-auto">
                      <table className="table-auto border-collapse w-full">
                        <thead className="bg-[#8fdcff]">
                          <tr>
                            <th className=" px-4 py-2"></th>
                            {productSizeScale?.columns?.map((column) => (
                              <th key={column.id} className="px-4 py-2 w-[135px] font-normal">
                                {column.name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="">
                          {productSizeScale?.rows?.map((row, rowIndex) => (
                            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : ''}>
                              <td className="px-4 py-2 h-[60.5px] whitespace-nowrap">{row.productSizeValue}</td>
                              {productSizeScale?.columns?.map((column, colIndex) => (
                                <td key={colIndex} className="px-4 py-2 font-normal">
                                  <input
                                    inputMode="numeric"
                                    dir="ltr"
                                    type="text"
                                    className=" appearance-none border border-gray-200 rounded-lg"
                                    value={digitsEnToFa(
                                      productScaleCreate?.Rows![rowIndex].scaleValues![colIndex] || ''
                                    )}
                                    onChange={(e) => handleChange(rowIndex, colIndex, digitsFaToEn(e.target.value))}
                                    onBlur={(e) => {
                                      const currentValue =
                                        productScaleCreate?.Rows![rowIndex].scaleValues![colIndex] ?? ''
                                      e.target.value = digitsEnToFa(currentValue)
                                    }}
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className=" mdx:w-fit flex justify-center w-full mdx:mb-0 mb-4">
                      <div className="rounded-lg  shadow-product w-[240px] h-[240px]">
                        <img
                          className="w-full h-full rounded-lg"
                          src={productSizeScale.imagesSrc?.imageUrl}
                          alt="عکس اندازه محصول"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-100 bottom-0 w-full  rounded-b-lg px-8 flex flex-col pb-2">
                    <span className="font-normal text-[11px] pt-2">
                      اندازه ها را به{' '}
                      <span className="text-[11px] text-[#f1416c]">
                        {productSizeScale.sizeType == '0' ? 'سانتیمتر' : 'میلیمتر'}
                      </span>{' '}
                      وارد کنید
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        {/* validation errors */}
        <div className="flex flex-col">
          {formErrors.Title && <p className="text-red-500 px-10">{formErrors.Title.message}</p>}

          {formErrors.CategoryId && <p className="text-red-500 px-10">{formErrors.CategoryId?.message}</p>}

          {formErrors.MainThumbnail && <p className="text-red-500 px-10">{formErrors.MainThumbnail?.message}</p>}

          {formErrors.Thumbnail && <p className="text-red-500 px-10">{formErrors.Thumbnail?.message}</p>}

          {formErrors.StockItems && (
            <div className="text-red-500 px-10">
              {Array.isArray(formErrors.StockItems) &&
                formErrors.StockItems.map((stockItem, index) => (
                  <div key={index}>
                    {stockItem?.quantity && (
                      <div>
                        شناسه {'1' + index} {stockItem.quantity.message}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}

          {formErrors.StockItems && (
            <div className="text-red-500 px-10">
              {Array.isArray(formErrors.StockItems) &&
                formErrors.StockItems.map((stockItem, index) => (
                  <div key={index}>
                    {stockItem?.price && (
                      <div>
                        شناسه {'1' + index} {stockItem.price.message}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
        <div className="flex justify-end w-full">
          {' '}
          <Button
            // disabled={!isValid}
            type="submit"
            className={`w-0 px-11 py-3 ${!isValid ? 'bg-gray-300' : 'hover:text-black'}  mb-10 float-start`}
          >
            انتشار
          </Button>
        </div>
      </form>
    </section>
  )
}

const Table: React.FC<PropTable> = (props) => {
  const {
    features,
    sizeList,
    setStateStockItems,
    selectedFiles,
    setStateFeature,
    setStateSizeFeature,
    setProductSizeScale,
  } = props
  const [featuresAndSizeSelected, setFeaturesAndSizeSelected] = useState<ProductFeature[]>([])
  const [isShowSetImageStockModal, setImageStockModalHandlers] = useDisclosure()
  const [selectedStockFiles, setSelectedStockFiles] = useState<(File | null)[]>([])
  const [stockItems, setStockItems] = useState<IStockItem[]>([])
  const [currentRowIndex, setCurrentRowIndex] = useState<number | null>(null)
  const [rows, setRows] = useState<CurrentRow[]>([])
  const [defaultRow, setDefaultRow] = useState<CurrentRow>({ id: 11 })

  const dispatch = useAppDispatch()

  let combinedFeatures: ProductFeature[]
  const newRows: CurrentRow[] = []
  let idCounter = 10
  useEffect(() => {
    if (features.length > 0 || sizeList.length > 0) {
      combinedFeatures =
        sizeList.length > 0
          ? [
              ...features,
              {
                name: 'سایزبندی',
                values: sizeList.map((size) => ({
                  name: size.name,
                  hexCode: null,
                  count: null,
                  description: null,
                  isDeleted: false,
                  productFeatureId: null,
                  id: size.id,
                  created: size.created,
                  updated: size.updated,
                })),
                count: 0,
                isDeleted: false,
                productId: null,
                categoryId: generateUniqueId(),
                id: generateUniqueId(),
                created: '2024-06-30T09:50:46.827222Z',
                updated: '2024-06-30T09:50:46.827222Z',
              },
            ]
          : [...features]
      setFeaturesAndSizeSelected(combinedFeatures)

      const createRows = (index = 0, currentRow: CurrentRow = { featureValueIds: [] }) => {
        if (index === combinedFeatures.length) {
          newRows.push({ id: idCounter++, ...currentRow })
          return
        }

        combinedFeatures[index]?.values?.forEach((value) => {
          let updatedRow = { ...currentRow, [combinedFeatures[index].name]: value.name }

          if (combinedFeatures[index].name === 'سایزبندی') {
            updatedRow.sizeId = value.id
          } else {
            updatedRow.featureValueIds = [...(updatedRow.featureValueIds || []), value.id]
          }

          createRows(index + 1, updatedRow)
        })
      }

      if (combinedFeatures.length > 0) {
        createRows()
      } else {
        newRows.push(defaultRow)
      }

      setRows(newRows)
    } else {
      setFeaturesAndSizeSelected([])
      setRows([defaultRow])
    }
  }, [features, sizeList])

  const handleInputChange = (index: number, field: string, value: any) => {
    const numericValue = Number(digitsFaToEn(value))
    if (!isNaN(value) || value === '') {
      const updatedStockItems = [...stockItems]
      const item = updatedStockItems[index]

      const itemPrice = Number(item.price)

      if (field === 'discount' && numericValue > itemPrice) {
        dispatch(
          showAlert({
            status: 'error',
            title: 'تخفیف باید کمتر از قیمت باشد',
          })
        )
        return
      }
      updatedStockItems[index] = {
        ...item,
        [field]: value,
      }

      setStockItems(updatedStockItems)
    }
  }

  const handleCheckboxChange = (field: string, checked: boolean) => {
    const updatedStockItems = stockItems.map((item, index) => ({
      ...item,
      [field]: checked ? stockItems[0][field] : index === 0 ? item[field] : '',
    }))

    setStockItems(updatedStockItems)
  }

  useEffect(() => {
    const initialStockItems = rows.map((row) => {
      const dynamicProperties: any = {}
      for (const key in row) {
        if (key !== 'id' && key !== 'featureValueIds' && key !== 'sizeId') {
          dynamicProperties[key] = row[key]
        }
      }
      return {
        stockId: row.id,
        featureValueId: row.featureValueIds || [],
        sizeId: row.sizeId || undefined,
        ...dynamicProperties,
      }
    })
    setStockItems(initialStockItems)
  }, [rows, featuresAndSizeSelected])

  useEffect(() => {
    if (stockItems) {
      setStateStockItems(stockItems)
      console.log(stockItems, 'stockItems set')
    }
  }, [stockItems])

  const shouldHideHeader = featuresAndSizeSelected.every((feature) => feature?.values?.length === 1)
  const handleImageClick = (index: number) => {
    setCurrentRowIndex(index)
    setImageStockModalHandlers.open()
  }

  const handleImageSelect = (file: File) => {
    if (currentRowIndex !== null) {
      const updatedSelectedStockFiles = [...selectedStockFiles]
      updatedSelectedStockFiles[currentRowIndex] = file
      setSelectedStockFiles(updatedSelectedStockFiles)

      const updatedStockItems = stockItems.map((item, index) => {
        if (index === currentRowIndex) {
          return { ...item, imageStock: file }
        }
        return item
      })
      setStockItems(updatedStockItems)
    }
  }

  if (selectedStockFiles) {
    console.log(selectedStockFiles, 'selectedStockFiles')
  }

  const handleRemoveRow = (index: number) => {
    const updatedStockItems = stockItems.filter((_, i) => i !== index)
    setStockItems(updatedStockItems)

    const updatedSelectedStockFiles = selectedStockFiles.filter((_, i) => i !== index)
    setSelectedStockFiles(updatedSelectedStockFiles)

    const updatedRows = rows.filter((_, i) => i !== index)
    setRows(updatedRows)

    const remainingFeatureValueIds = updatedRows.flatMap((row) => row.featureValueIds || [])
    const remainingSizeIds = updatedRows.map((row) => row.sizeId).filter((sizeId) => sizeId)

    const updatedFeaturesAndSizeSelected = featuresAndSizeSelected
      .map((feature) => {
        if (feature.name === 'سایزبندی') {
          const updatedValues = feature?.values?.filter((value) => remainingSizeIds.includes(value.id))
          return { ...feature, values: updatedValues }
        } else {
          const updatedValues = feature?.values?.filter((value) => remainingFeatureValueIds.includes(value.id))
          return { ...feature, values: updatedValues }
        }
      })
      .filter((feature) => feature?.values?.length > 0)

    setFeaturesAndSizeSelected(updatedFeaturesAndSizeSelected)

    // به‌روزرسانی stateFeature و stateSizeFeature
    setStateFeature((prevFeatures) => {
      return prevFeatures
        .map((feature) => {
          const updatedValues = feature?.values?.filter((value) => remainingFeatureValueIds.includes(value.id))
          return { ...feature, values: updatedValues }
        })
        .filter((feature) => feature?.values?.length > 0)
    })

    setStateSizeFeature((prevSizes) => {
      return prevSizes.filter((size) => remainingSizeIds.includes(size.id))
    })

    // setProductSizeScale((prevScale) => {
    //   return prevScale.columns?.filter((size) => remainingSizeIds.includes(size.id))
    // })
    console.log(updatedFeaturesAndSizeSelected, 'Updated features and sizes')
  }

  return (
    <div className="px-4 py-10 pt-3 overflow-auto">
      <table className="table-auto overflow-auto w-full border-collapse border-gray-200">
        {!shouldHideHeader && (
          <thead>
            <tr className="bg-[#8fdcff]">
              <th className="px-4 whitespace-nowrap py-2 font-normal">تصویر</th>
              <th className="px-4 whitespace-nowrap py-2 font-normal">شناسه</th>
              {featuresAndSizeSelected.map(
                (feature) =>
                  feature?.values?.length! > 1 && (
                    <th key={feature.id} className="px-4 whitespace-nowrap py-2 font-normal">
                      {feature.name}
                    </th>
                  )
              )}
              <th className="px-4 whitespace-nowrap py-2 font-normal">موجودی</th>
              <th className="px-4 whitespace-nowrap py-2 font-normal">
                <div className="flex items-center gap-1">
                  <div>
                    قیمت محصول
                    <input
                      className="bg-gray-200 border-gray-400 focus:outline-0 focus:ring-0 text-2xl w-5  h-5 mr-1 cursor-pointer focus:border-none rounded appearance-none checked:bg-[#e90089]"
                      type="checkbox"
                      onChange={(e) => handleCheckboxChange('price', e.target.checked)}
                    />
                  </div>{' '}
                  <FaArrowDownLong className="text-gray-400" />
                </div>
              </th>
              <th className="px-4 whitespace-nowrap py-2 font-normal">
                <div className="flex items-center gap-1">
                  <div>
                    فروش فوق العاده
                    <input
                      className="bg-gray-200 border-gray-400 focus:outline-0 focus:ring-0 text-2xl w-5  h-5 mr-1 cursor-pointer focus:border-none rounded appearance-none checked:bg-[#e90089]"
                      type="checkbox"
                      onChange={(e) => handleCheckboxChange('discount', e.target.checked)}
                    />
                  </div>{' '}
                  <FaArrowDownLong className="text-gray-400" />
                </div>{' '}
              </th>
              {!shouldHideHeader && <th className="px-4 whitespace-nowrap py-2 font-normal"></th>}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.id} className={`border-b ${idx % 2 !== 0 ? 'bg-gray-50' : ''}`}>
              {!shouldHideHeader && (
                <Fragment>
                  <td className="w-[50px] h-[50px] bg-center py-2 pr-2">
                    {selectedStockFiles[idx] ? (
                      <img
                        onClick={() => handleImageClick(idx)}
                        className="w-[50px] h-[50px] rounded-lg cursor-pointer bg-center"
                        src={URL.createObjectURL(selectedStockFiles[idx]!)}
                        alt={selectedStockFiles[idx]!.name}
                      />
                    ) : (
                      <img
                        onClick={() => handleImageClick(idx)}
                        className="w-[50px] h-[50px] rounded-lg cursor-pointer bg-center"
                        src="/images/other/product-placeholder.png"
                        alt="product-placeholder"
                      />
                    )}
                    <DialogSetStockItemImage
                      isShow={isShowSetImageStockModal}
                      open={setImageStockModalHandlers.open}
                      setSelectedStockFiles={handleImageSelect}
                      selectedFiles={selectedFiles}
                      selectedStockFiles={selectedStockFiles[idx] || null}
                      onClose={setImageStockModalHandlers.close}
                      index={idx}
                    />
                  </td>
                  <td className="px-4 whitespace-nowrap text-center py-2">{digitsEnToFa(row.id)}</td>
                  {featuresAndSizeSelected.map(
                    (feature) =>
                      feature?.values?.length! > 1 && (
                        <td key={feature.id} className="px-4 whitespace-nowrap text-center py-2">
                          {digitsEnToFa(row[feature.name])}
                        </td>
                      )
                  )}
                </Fragment>
              )}
              <td className="px-4 whitespace-nowrap text-center py-2">
                {shouldHideHeader ? (
                  <div className="relative mb-3">
                    <input
                      dir="ltr"
                      type="text"
                      className="peer m-0 block rounded-lg h-[50px] w-full border border-solid border-gray-200 bg-transparent bg-clip-padding pr-0 pl-3 py-4 text-xl font-normal leading-tight text-neutral-700 transition duration-200 ease-linear placeholder:text-transparent focus:border-primary focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-primary dark:border-neutral-400 dark:text-white dark:autofill:shadow-autofill dark:focus:border-primary dark:peer-focus:text-primary [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]"
                      id="floatingInput"
                      placeholder="موجودی انبار"
                      value={digitsEnToFa(stockItems[idx]?.quantity || 0)}
                      onChange={(e) => handleInputChange(idx, 'quantity', digitsFaToEn(e.target.value))}
                      onFocus={(e) => (e.target.value = digitsEnToFa(stockItems[idx]?.quantity || ''))}
                      onBlur={(e) => (e.target.value = digitsEnToFa(stockItems[idx]?.quantity || 0))}
                    />
                    <label
                      htmlFor="floatingInput"
                      className="pointer-events-none absolute right-0 top-0 origin-[0_0] border border-solid border-transparent pr-3 pb-4 pt-3.5 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary"
                    >
                      موجودی انبار
                    </label>
                  </div>
                ) : (
                  <input
                    dir="ltr"
                    type="text"
                    placeholder=""
                    value={digitsEnToFa(stockItems[idx]?.quantity || 0)}
                    onChange={(e) => handleInputChange(idx, 'quantity', digitsFaToEn(e.target.value))}
                    className="w-36 h-9 rounded-lg text-center border border-gray-300"
                    onFocus={(e) => (e.target.value = digitsEnToFa(stockItems[idx]?.quantity || ''))}
                    onBlur={(e) => (e.target.value = digitsEnToFa(stockItems[idx]?.quantity || 0))}
                  />
                )}
              </td>
              <td className="px-4 text-center py-2">
                {shouldHideHeader ? (
                  <div className="relative mb-3">
                    <input
                      dir="ltr"
                      type="text"
                      className="peer m-0 block rounded-lg h-[50px] w-full border border-solid border-gray-200 bg-transparent bg-clip-padding pr-0 pl-3 py-4 text-xl font-normal leading-tight text-neutral-700 transition duration-200 ease-linear placeholder:text-transparent focus:border-primary focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-primary dark:border-neutral-400 dark:text-white dark:autofill:shadow-autofill dark:focus:border-primary dark:peer-focus:text-primary [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]"
                      id="floatingInput"
                      placeholder="قیمت محصول"
                      onChange={(e) => handleInputChange(idx, 'price', digitsFaToEn(e.target.value))}
                      value={digitsEnToFa(stockItems[idx]?.price || '')}
                    />
                    <label
                      htmlFor="floatingInput"
                      className="pointer-events-none absolute right-0 top-0 origin-[0_0] border border-solid border-transparent pr-3 pb-4 pt-3.5 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary"
                    >
                      قیمت محصول
                    </label>
                  </div>
                ) : (
                  <input
                    dir="ltr"
                    type="text"
                    placeholder=""
                    value={digitsEnToFa(stockItems[idx]?.price || '')}
                    onChange={(e) => handleInputChange(idx, 'price', digitsFaToEn(e.target.value))}
                    className="w-36 h-9 rounded-lg text-center border border-gray-300"
                  />
                )}
              </td>
              <td className="px-4 text-center py-2">
                {shouldHideHeader ? (
                  <div className="relative mb-3">
                    <input
                      dir="ltr"
                      type="text"
                      className="peer m-0 block rounded-lg h-[50px] w-full border border-solid border-gray-200 bg-transparent bg-clip-padding pr-0 pl-3 py-4 text-xl font-normal leading-tight text-neutral-700 transition duration-200 ease-linear placeholder:text-transparent focus:border-primary focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-primary dark:border-neutral-400 dark:text-white dark:autofill:shadow-autofill dark:focus:border-primary dark:peer-focus:text-primary [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]"
                      id="floatingInput"
                      placeholder="فروش فوق العاده"
                      onChange={(e) => handleInputChange(idx, 'discount', digitsFaToEn(e.target.value))}
                      value={digitsEnToFa(stockItems[idx]?.discount || '')}
                    />
                    <label
                      htmlFor="floatingInput"
                      className="pointer-events-none absolute right-0 top-0 origin-[0_0] border border-solid border-transparent pr-3 pb-4 pt-3.5 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary"
                    >
                      فروش فوق العاده
                    </label>
                  </div>
                ) : (
                  <input
                    dir="ltr"
                    type="text"
                    placeholder=""
                    value={digitsEnToFa(stockItems[idx]?.discount || '')}
                    onChange={(e) => handleInputChange(idx, 'discount', digitsFaToEn(e.target.value))}
                    className="w-36 h-9 rounded-lg text-center border border-gray-300"
                  />
                )}
              </td>
              {!shouldHideHeader && (
                <td>
                  <Button
                    onClick={() => handleRemoveRow(idx)}
                    className="bg-white ml-4 hover:bg-red-600 hover:text-white text-red-600 text-sm border border-red-600 px-4 py-1.5"
                  >
                    حذف
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const DialogSetStockItemImage = (props: PropSetStockImage & { index: number }) => {
  const { isShow, onClose, selectedFiles, setSelectedStockFiles, open, selectedStockFiles, index } = props
  const [selectItem, setSelectItem] = useState<File>()

  const handleSelect = () => {
    if (selectItem != undefined) {
      setSelectedStockFiles(selectItem, index)
    }
    if (typeof onClose === 'function') {
      onClose()
    }
  }

  if (selectedStockFiles) {
    console.log(selectedStockFiles)
  }
  return (
    <>
      <Modal isShow={isShow!} onClose={onClose!} effect="ease-out">
        <Modal.Content
          onClose={onClose!}
          className="flex h-full max-h-[640px] overflow-auto flex-col gap-y-5 bg-white px-5 py-5 md:rounded-lg "
        >
          <Modal.Header notBar onClose={onClose!}>
            گالری
          </Modal.Header>
          <Modal.Body>
            {selectedFiles.length > 0 && (
              <div className="flex flex-wrap gap-6 mt-4 px-8">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectItem(file)}
                    className="text-sm text-gray-600 cursor-pointer "
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className={`${
                        selectItem == file ? 'border-2 border-[#e90089]' : ''
                      } w-[85px] h-[95px] object-cover  rounded-lg shadow-product`}
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="border-t-2 gap-2 border-gray-200 py-3 lg:pb-0 flex justify-start ">
              <button type="button" className="bg-gray-100 text-gray-400 rounded-lg px-5 py-3" onClick={onClose}>
                لغو{' '}
              </button>
              <button type="button" className="bg-[#009ef7] text-white rounded-lg px-5 py-3" onClick={handleSelect}>
                ذخیره{' '}
              </button>
            </div>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  )
}

export default ProductForm