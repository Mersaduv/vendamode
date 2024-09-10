import { digitsEnToFa } from '@persian-tools/persian-tools'

export default function ProductDiscountTag({
  discount,
  price,
  tag,
  isSlider,
}: {
  discount: number
  price: number
  tag?: string
  isSlider?: boolean
}) {
  const discountPercentage = Math.max((discount / price) * 100, 1)
  return (
    <>
      {isSlider ? (
        <span className=" absolute top-0 left-0 w-[40px] inline-block rounded-r-xl bg-[#e90089] px-2 py-1 tracking-widest text-white">
          {digitsEnToFa(`${Math.round(discountPercentage)}%`)}{' '}
        </span>
      ) : tag ? (
        <span className=" absolute top-6 left-0  inline-block rounded-r-xl bg-[#e90089] px-2 py-1 tracking-widest text-white">
          {tag}
        </span>
      ) : (
        <span className="farsi-digits absolute top-6 left-0  inline-block rounded-r-xl bg-[#e90089] px-2 py-1 tracking-widest text-white">
          {digitsEnToFa(`${Math.round(discountPercentage)}%`)}{' '}
        </span>
      )}
    </>
  )
}
