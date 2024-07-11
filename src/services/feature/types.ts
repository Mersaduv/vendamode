interface BaseClass<T> {
  id: T
  created: string
  updated: string
}

interface SizeDTO extends BaseClass<string> {
  name: string
  count: number | null
  description: string | null
  isDeleted: boolean | null
}

interface ProductSizeDTO extends BaseClass<string> {
  sizeType: string 
  productSizeValues: ProductSizeValuesDTO[] | null
  imagesSrc: {
    id: string
    imageUrl: string
    placeholder: string | null
  }
}
interface BaseClass<T> {
  id: T
  created: string
  updated: string
}

interface ProductFeature extends BaseClass<string> {
  name: string
  values: FeatureValue[] | undefined
  count: number
  isDeleted: boolean
  productId: string | null
  categoryId: string | null
}



interface FeatureValue extends BaseClass<string> {
  name: string
  hexCode: string | null
  count: number | null
  description: string | null
  isDeleted: boolean
  productFeatureId: string | null
}

interface GetCategoryFeaturesByCategory {
  productFeatures: ProductFeature[] | null
  productSizes: ProductSizeDTO[] | null
  sizeDTOs: SizeDTO[] | null
}

interface ProductFeatureUpdateDTO {
  id: string
  name: string
  description: string
  hexCode: string | null
}

interface FeatureValueCreateDTO {
  name: string
  description: string
  hexCode: string | null
  productFeatureId: string
}

interface ProductFeatureCreateDTO {
  name: string
}

interface ProductSizeValuesDTO {
  id: string
  name: string
  productSizeId: string
}
