import { digitsEnToFa } from '@persian-tools/persian-tools'

export default function ProductDiscountTag({
  discount,
  price,
  tag,
}: {
  discount: number
  price: number
  tag?: string
}) {
  const discountPercentage = Math.max((discount / price) * 100, 1)
  return (
    <>
      {tag ? (
        <span className="farsi-digits absolute top-6 left-0  inline-block rounded-r-xl bg-[#e90089] px-2 py-1 tracking-widest text-white">
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
