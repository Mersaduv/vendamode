import { useRouter } from 'next/router'

import { EmptyComment } from '@/components/emptyList'
import { ReviewModal } from '@/components/modals'
import { DataStateDisplay } from '@/components/shared'
import { ReveiwSkeleton } from '@/components/skeleton'
import { ReviewProductCard } from '@/components/review'
import { Pagination } from '@/components/navigation'

import { useGetProductReviewsQuery } from '@/services'
import { IPagination, IProduct, IReview } from '@/types'

interface Porps {
  numReviews: number
  product: IProduct
}

const ReviewsList: React.FC<Porps> = (props) => {
  // ? Props
  const { numReviews,product } = props

  // ? Assets
  const { query } = useRouter()
  const page = query.page ? +query.page : 1

  // ? Get Product-Reviews Query
  const { data, ...productsReviewQueryProps } = useGetProductReviewsQuery(
    {
      id: product.id,
      page,
    },
    { skip: !(numReviews > 0) }
  )

  // ? Render(s)
  return (
    <>
      <section className="space-y-4 p-3 l xl:max-w-7xl" id="_productReviews">
        <div className=" ">
          <div className="mb-4">
            <ReviewModal productTitle={product.title} prdouctID={product.id}  productImg={product.imagesSrc} />
          </div>

          <DataStateDisplay
            {...productsReviewQueryProps}
            dataLength={data ? data.data?.reviewsLength! : 0}
            emptyComponent={<EmptyComment />}
            loadingComponent={<ReveiwSkeleton />}
          >
            <div className="space-y-2 divide-y-2 py-3 sm:px-2 lg:px-6">
              {data?.data?.pagination?.data?.map((item) => (
                <ReviewProductCard item={item} key={item.id} />
              ))}
            </div>
          </DataStateDisplay>

          {data && data?.data?.reviewsLength! > 2 && data.data?.pagination && (
            <Pagination pagination={data.data?.pagination} section="_productReviews" client />
          )}
        </div>
      </section>
    </>
  )
}

export default ReviewsList