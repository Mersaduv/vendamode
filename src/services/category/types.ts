import type { ICategoriesList, ICategory, ICategoryForm, ServiceResponse } from '@/types'

export type MsgResult = { msg: string }
export type IdQuery = { id: string }
export type CategoriesResult = {
  categoryDTO: ICategory[]
  categoryList: ICategory[]
}
export type SubCategoryResult = {
  category: ICategory
  children: ICategory[] | []
}

export type GetCategoriesResult = ServiceResponse<CategoriesResult>

export type GetCategoriesTreeResult = ServiceResponse<ICategory[]>

export type GetSingleCategoryResult = ServiceResponse<ICategory>
export type UpdateCategoryQuery = ICategoryForm
export type CreateCategoryQuery = ICategoryForm
export type GetSubCategoriesQuery = { id?: string; slug?: string }
export type GetSubCategoriesResult = ServiceResponse<SubCategoryResult>
