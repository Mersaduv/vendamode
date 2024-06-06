import type { ICategoriesList, ICategory, ICategoryForm, ServiceResponse } from '@/types'

export type MsgResult = { msg: string }
export type IdQuery = { id: string }
export type CategoriesResult = {
  categoryDTO: ICategory[]
  categoryList: ICategory[]
}
export type GetCategoriesResult = ServiceResponse<CategoriesResult>

export type GetSingleCategoryResult = ServiceResponse<ICategory>
export type UpdateCategoryQuery = ICategoryForm
export type CreateCategoryQuery = ICategoryForm
export type GetSubCategoriesQuery = { id?: string; slug?: string }
export type GetSubCategoriesResult = {
  category: ICategory
  children: ICategory[] | []
}
