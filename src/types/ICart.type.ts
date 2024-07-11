import { IColorDTO, IObjectValue, ISizeDTO } from "./models/IProduct.type"

export default interface ICart {
  itemID: string
  productID: string
  name: string
  slug: string
  price: number
  discount: number
  inStock: number
  sold: number
  cancelOrder: ICanceled | null
  color: IColorDTO | null
  size: ISizeDTO | null
  features: IObjectValue | null
  img: {
    id: string
    imageUrl: string
    placeholder: string
  }
  quantity: number
}

interface ICanceled {
  id:string
  title:string
  isActive: string
}
