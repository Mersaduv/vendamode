export interface ICategory {
  id: string
  name: string
  slug: string
  imagesSrc?: {
    id: string
    imageUrl: string
    placeholder: string
  } | null
  parentCategoryId?: string
  level: number
  count: number
  subCategoryCount: number
  featureCount: number
  sizeCount: number
  brandCount: number
  isActive: boolean
  isDeleted: boolean
  parentCategory?: ICategory
  parentCategories?: ICategory[]
  parentCategoriesTree?: ICategory[]
  childCategories?: ICategory[]
  categories?: ICategory[]
}
