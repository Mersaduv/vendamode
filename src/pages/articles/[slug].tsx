// import { ClientLayout } from "@/components/Layouts"
// import { MetaTags } from "@/components/shared"
// import { useAppDispatch } from "@/hooks"
// import { GetServerSideProps, NextPage } from "next"
// import { useRouter } from "next/router"

// interface Props {
//     product: IProduct
//     smilarProducts: {
//       title: string
//       products: IProduct[]
//     }
//   }
  
//   const classNames = (...classes: string[]) => {
//     return classes.filter(Boolean).join(' ')
//   }
  
//   export const getServerSideProps: GetServerSideProps<Props, { slug: string }> = async ({ params }) => {
//     const { data: product } = await getProductBySlug(params?.slug ?? '')
  
//     if (!product) return { notFound: true }
  
//     const productCategoryID = product.categoryId
  
//     const { data } = await getProductByCategory(productCategoryID)
//     const similarProduct = data?.filter((p: any) => p.id !== product.id)
//     return {
//       props: {
//         product: JSON.parse(JSON.stringify(product)),
//         smilarProducts: {
//           title: 'کالاهای مشابه',
//           products: JSON.parse(JSON.stringify(similarProduct)),
//         },
//       },
//     }
//   }
  
//   const SingleProduct: NextPage<Props> = (props) => {
//     // ? Props
//     const { product, smilarProducts } = props
  
//     // ? Assets
//     const dispatch = useAppDispatch()
//     const router = useRouter()

//       // ? Render(s)
//   return (
//     <>
//       <MetaTags
//         title={generalSetting?.title + ' | ' + `خرید ${product.title}` || 'فروشگاه اینترنتی'}
//         description={generalSetting?.shortIntroduction + product.title || 'توضیحاتی فروشگاه اینترنتی'}
//         keywords={generalSetting?.googleTags || ' اینترنتی, فروشگاه'}
//       />
//       <ClientLayout>
//         <main className="mx-auto space-y-4 py-4 lg:max-w-[1550px] lg:mt-4 sm:mt-4 md:mt-6  -mt-20">

//         </main>
//       </ClientLayout>
//     </>
//   )
// }

// export default SingleProduct
