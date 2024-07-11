import { useState, useEffect } from 'react'

import { addToCart, showAlert } from '@/store'

import { exsitItem } from '@/utils'

import { useAppDispatch, useAppSelector } from '@/hooks'

import { CartItemActions } from '@/components/cart'
import { ArrowLink } from '@/components/ui'
import { ProductPriceDisplay } from '@/components/product'

import type { IProduct, ICart } from '@/types'

interface Porps {
  product: IProduct
}

const CartOperations: React.FC<Porps> = (props) => {
  // ? Props
  const { product } = props

  // ? Assets
  const dispatch = useAppDispatch()

  // ? Store
  const { cartItems, tempColor, tempSize, tempObjectValue } = useAppSelector((state) => state.cart)

  // ? State
  const [currentItemInCart, setCurrentItemInCart] = useState<ICart | undefined>(undefined)

  // ? Re-Renders
  useEffect(() => {
    const item = exsitItem(cartItems, product.id, tempColor, tempSize, tempObjectValue)
    setCurrentItemInCart(item)
  }, [tempColor, tempSize, cartItems, tempObjectValue, product.id])

  // ? handlers
  const handleAddItem = () => {
    if (product.inStock === 0)
      return dispatch(
        showAlert({
          status: 'error',
          title: 'موجودی این محصول به اتمام رسیده',
        })
      )

    dispatch(
      addToCart({
        productID: product.id,
        name: product.title,
        slug: product.slug,
        price: product.price,
        discount: product.discount,
        inStock: product.inStock,
        sold: product.sold ?? 0,
        color: tempColor,
        size: tempSize,
        features: tempObjectValue,
        img: product.imagesSrc[0],
        quantity: 1,
        cancelOrder : null
      })
    )
  }

  // ? Render(s)
  return (
    <div className="flex items-center md:justify-center justify-between bg-white sm:px-5  md:flex-col-reverse md:gap-y-4  px-3 py-2 border md:border-none shadow-add md:p-0 md:py-3">
      {currentItemInCart ? (
        <div className="flex w-full gap-x-4 md:flex-col md:justify-center md:items-center md:gap-y-4 mt-4">
          <div className="w-44 md:w-1/2 ">
            <CartItemActions item={currentItemInCart} />
          </div>
          <div className="hidden md:block">
            <ArrowLink path="/checkout/cart">مشاهده سبد خرید</ArrowLink>
          </div>
        </div>
      ) : (
        <button onClick={handleAddItem} className="btn text-sm xs:px-12 whitespace-nowrap xs:text-base md:w-1/2 ">
          افزودن به سید خرید{' '}
        </button>
      )}

      <div className="min-w-fit md:flex md:justify-center md:w-full md:self-end">
        <ProductPriceDisplay
          inStock={product.inStock}
          discount={product.discount}
          price={product.price}
          singleProduct
        />
      </div>
    </div>
  )
}

export default CartOperations
