import { digitsEnToFa } from '@persian-tools/persian-tools'

export default function ProductDiscountTag({ discount, tag }: { discount: number; tag?: string }) {
  return (
    <>
      {tag ? (
        <span className="farsi-digits absolute top-6 left-0  inline-block rounded-r-xl bg-[#e90089] px-2 py-1 tracking-widest text-white">
          {tag}
        </span>
      ) : (
        <span className="farsi-digits absolute top-6 left-0  inline-block rounded-r-xl bg-[#e90089] px-2 py-1 tracking-widest text-white">
          {digitsEnToFa(`${discount}%`)}
        </span>
      )}
    </>
  )
}
