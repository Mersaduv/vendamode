import { CategorySizeDTO } from "@/services/category/types"

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
  categorySizes?: CategorySizeDTO
  brandCount: number
  isActive: boolean
  isDeleted: boolean
  parentCategory?: ICategory
  parentCategories?: ICategory[]
  parentCategoriesTree?: ICategory[]
  childCategories?: ICategory[]
  categories?: ICategory[]
}
