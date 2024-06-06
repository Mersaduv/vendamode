import type { ICategory } from '@/types'

export default interface ICategoriesList extends ICategory {
  childCategories?: ICategoriesList[]
}
