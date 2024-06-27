import { useState } from 'react'

import { SubmitHandler, useForm, Resolver } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { productSchema } from '@/utils'

import type { IProduct, ICategory, IProductForm } from '@/types'

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
  levelOne?: ICategory
  levelTwo?: ICategory
  levelThree?: ICategory
}

const initialSelectedCategories = {
  levelOne: {} as ICategory,
  levelTwo: {} as ICategory,
  levelThree: {} as ICategory,
}

const ProductForm: React.FC<Props> = (props) => {
  // ? Props
  const { mode, createHandler, isLoadingCreate, isLoadingUpdate, updateHandler, selectedProduct } = props

  // ? States
  const [isDetailsSkip, setIsDetailsSkip] = useState(true)
  const [selectedCategories, setSelectedCategories] = useState<SelectedCategories>(initialSelectedCategories)

  // ? Form Hook
  const {
    handleSubmit,
    register,
    reset,
    control,
    watch,
    setValue,
    formState: { errors: formErrors },
  } = useForm<IProductForm>({
    resolver: yupResolver(productSchema) as unknown as Resolver<IProductForm>,
  })

  // ? Queries
  //*   Get Details

  // ? Re-Renders
  //*   Select Category To Fetch Details

  //*   Set Details

  //*   Set Product Details On Edit Mode

  // ? Handlers
  const editedCreateHandler: SubmitHandler<IProductForm> = (data) => {
    const formData = new FormData()

    formData.append('Title', data.Title)
    formData.append('IsActive', data.IsActive.toString())
    formData.append('CategoryId', data.CategoryId)
    formData.append('Description', data.Description)
    formData.append('IsFake', data.IsFake.toString())
    if (data.BrandId) formData.append('BrandId', data.BrandId)
    if (data.FeatureValueIds) {
      data.FeatureValueIds.forEach((id) => formData.append('FeatureValueIds', id))
    }
    formData.append('InStock', data.InStock.toString())
    formData.append('Price', data.Price.toString())
    if (data.Discount !== undefined && data.Discount !== null) {
      formData.append('Discount', data.Discount.toString())
    }
    if (data.ProductScale) {
      formData.append('ProductScale', JSON.stringify(data.ProductScale))
    }
    if (data.StockItems) {
      formData.append('StockItems', JSON.stringify(data.StockItems))
    }

    // Append the files
    Array.from(data.Thumbnail).forEach((file) => formData.append('Thumbnail', file))

    console.log(formData)
    // Now send the formData to the server using your preferred method, e.g., axios or fetch
    // axios.post('/your-api-endpoint', formData) or fetch('/your-api-endpoint', { method: 'POST', body: formData })
  }

  return (
    <section>
      <form className="flex flex-col pt-4 lg:pt-14" onSubmit={handleSubmit(editedCreateHandler)}>
        {/* Your form fields go here, for example: */}
        <div className='flex gap-3'>
          <div className="bg-white rounded-md shadow-item">
            <h3 className="border-b p-6">محصول جدید</h3>
            <div className="flex px-10 py-10 pt-6">
              <label htmlFor="title" className="flex items-center justify-center px-3 rounded-l-none rounded-md bg-[#f5f8fa]">
                <img className="w-5 h-5" src="/assets/svgs/text.svg" alt="" />
                <span className="whitespace-nowrap text-center w-[113px]">نام محصول</span>
              </label>
              <input className="w-full border rounded-r-none border-gray-200 rounded-md " type="text" id="title" {...register('Title')} />
            </div>
          </div>
          <div className="bg-white rounded-md shadow-item">
            <h3 className="border-b p-6">وضعیت محصول</h3>
            <div className="flex px-10 py-10 pt-6">
              <label htmlFor="title" className="flex items-center justify-center px-3 rounded-l-none rounded-md bg-[#f5f8fa]">
                <img className="w-5 h-5" src="/assets/svgs/duotone/text.svg" alt="" />
                <span className="whitespace-nowrap text-center w-[113px]">قابل مشاهده</span>
              </label>
              <input className="w-full border rounded-r-none border-gray-200 rounded-md " type="text" id="title" {...register('Title')} />
            </div>
          </div>
        </div>
        {/* <input type="checkbox" {...register('IsActive')} />
        <input type="file" {...register('Thumbnail')} multiple />
        <input type="text" {...register('CategoryId')} />
        <textarea {...register('Description')} />
        <input type="checkbox" {...register('IsFake')} />
        <input type="text" {...register('BrandId')} />
        <input type="text" {...register('FeatureValueIds')} />
        <input type="number" {...register('InStock')} />
        <input type="number" {...register('Price')} />
        <input type="number" {...register('Discount')} /> */}
        {/* Other fields for ProductScale and StockItems */}
        <button type="submit">Submit</button>
      </form>
    </section>
  )
}

export default ProductForm
