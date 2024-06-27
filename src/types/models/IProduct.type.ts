export interface IProduct {
  id: string
  title: string
  imagesSrc: {
    id: string
    imageUrl: string
    placeholder: string
  }[]
  code: string
  slug: string
  price: number
  isFake: boolean
  brandId?: string
  brandName?: string
  inStock: number
  productSizeInfo?: IProductSizeInfo
  productFeatureInfo?: IProductFeatureInfo
  description: string
  discount: number
  categoryList?: string[]
  categoryLevels?: ICategoryLevel[]
  categoryId: string
  size?: string[]
  sold?: number
  rating?: number
  reviewCount?: number
  created?: string
  lastUpdated?: string
}

export interface IProductSizeInfo {
  sizeType: '0' | '1'
  columns?: ISizeDTO[]
  rows?: ISizeInfoModel[]
  imagesSrc?: {
    id: string
    imageUrl: string
    placeholder: string
  }
}

export interface ISizeDTO {
  id: string
  name: string
  count: number
  description: string
  isDeleted: boolean
}

export interface ISizeInfoModel {
  productSizeValue: string
  scaleValues?: string[]
}

export interface IProductFeatureInfo {
  productSizeInfo?: IProductSizeInfo[]
  colorDTOs?: IColorDTO[]
  featureValueInfos?: IObjectValue[]
}

export interface IColorDTO {
  id: string
  name: string
  hexCode: string
}

export interface IObjectValue {
  id: string
  title: string
  value?: {id:string, name:string}[]
}

export interface ICategoryLevel {
  id: string
  name: string
  slug: string
  url: string
  imagesSrc?: {
    id: string
    imageUrl: string
    placeholder: string
  }[]
  parentCategoryId?: number
  level: number
}
