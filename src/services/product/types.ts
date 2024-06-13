import type { IPagination, IProduct, QueryParams, ServiceResponse } from '@/types'

export type MsgResult = { msg: string }
export type IdQuery = { id: string }
type ProductsResult = {
  productsLength: number
  mainMaxPrice: number
  mainMinPrice: number
  pagination: IPagination<IProduct[]>
}

export type GetProductsResult = ServiceResponse<ProductsResult>
export type GetProductsQuery = QueryParams
// export type GetSingleProductResult = IProduct
// export type CreateProductQuery = { body: IProductForm }
// export type UpdateProductQuery = { body: IProduct; id: string }
