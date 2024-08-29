import type { IPagination, IProduct, QueryParams, ServiceResponse } from '@/types'

export type MsgResult = ServiceResponse<boolean>
export type IdQuery = { id: string }
export type ProductsResult = {
  productsLength: number
  mainMaxPrice: number
  mainMinPrice: number
  pagination: IPagination<IProduct[]>
}

export type GetProductsResult = ServiceResponse<ProductsResult>
export type GetProductsQuery = QueryParams

export type GetProductResult = ServiceResponse<IProduct>
export type GetSimilarProductResult = ServiceResponse<IProduct[]>
export type GetSingleProductResult = IProduct
// export type CreateProductQuery = { body: IProductForm }
// export type UpdateProductQuery = { body: IProduct; id: string }
export type BulkRequest = {
  productIds: string[]
  action: string
}
