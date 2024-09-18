import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useAppDispatch, useAppSelector, useDisclosure, useDisclosureWithData } from '@/hooks'
import { Tab } from '@headlessui/react'
import { Fragment } from 'react'
import { setTempColor, setTempSize, addToLastSeen, setTempObjectValue } from '@/store'
import parse from 'html-react-parser'

import { ClientLayout } from '@/components/Layouts'
import {
  ProductBreadcrumb,
  ProductGallery,
  ProductColorSelector,
  ProductSizeSelector,
  ProductObjectValueSelector,
} from '@/components/product'
import { ReviewsList } from '@/components/review'
import { RecentVisitedSlider, SmilarProductsSlider } from '@/components/sliders'
import { AddToCartButton } from '@/components/cart'

import type { GetServerSideProps, NextPage } from 'next'
import type { EntityImage, IObjectValue, IProduct, IProductSizeInfo } from '@/types'
import { getProductByCategory, getProductBySlug } from '@/services'
import { Button } from '@/components/ui'
import { ProductScaleModal } from '@/components/modals'
import { BsHeart } from 'react-icons/bs'
import { BiShareAlt } from 'react-icons/bi'
import { TfiMenuAlt, TfiRulerAlt2 } from 'react-icons/tfi'
import { FaStar } from 'react-icons/fa'
import { RiMenu5Fill } from 'react-icons/ri'
import { digitsEnToFa } from '@persian-tools/persian-tools'
import { MetaTags } from '@/components/shared'

interface Props {
  product: IProduct
  smilarProducts: {
    title: string
    products: IProduct[]
  }
}

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ')
}

export const getServerSideProps: GetServerSideProps<Props, { slug: string }> = async ({ params }) => {
  const { data: product } = await getProductBySlug(params?.slug ?? '')

  if (!product) return { notFound: true }

  const productCategoryID = product.categoryId

  const { data } = await getProductByCategory(productCategoryID)
  const similarProduct = data?.filter((p: any) => p.id !== product.id)
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      smilarProducts: {
        title: 'کالاهای مشابه',
        products: JSON.parse(JSON.stringify(similarProduct)),
      },
    },
  }
}

const SingleProduct: NextPage<Props> = (props) => {
  // ? Props
  const { product, smilarProducts } = props
  console.log(smilarProducts, ' smilarProducts')

  // ? Assets
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { lastSeen } = useAppSelector((state) => state.lastSeen)
  const { generalSetting } = useAppSelector((state) => state.design)
  // ? initial color or size
  // useEffect(() => {
  //   if (product?.productSizeInfo?.columns != undefined) {
  //     dispatch(setTempSize(product?.productSizeInfo?.columns![0]!))
  //   }
  //   if (product.productFeatureInfo?.colorDTOs != undefined) {
  //     dispatch(setTempColor(product.productFeatureInfo?.colorDTOs![0]!))
  //   }
  //   if (product.productFeatureInfo?.colorDTOs == undefined && product?.productSizeInfo?.columns == undefined) {
  //     dispatch(setTempColor(null))
  //     dispatch(setTempSize(null))
  //   }
  // }, [router.query.id])

  useEffect(() => {
    if (product.productFeatureInfo?.colorDTOs?.length! > 0) {
      dispatch(setTempColor(product.productFeatureInfo?.colorDTOs![0]!))
    }
    if (product?.productSizeInfo?.columns?.length! > 0) {
      dispatch(setTempSize(product?.productSizeInfo?.columns![0]!))
    }
    if (product?.productFeatureInfo?.featureValueInfos?.length! > 0) {
      var val = product?.productFeatureInfo?.featureValueInfos![0]!.value![0]!
      dispatch(
        setTempObjectValue({
          id: product?.productFeatureInfo?.featureValueInfos![0]!.id,
          title: product?.productFeatureInfo?.featureValueInfos![0]!.title,
          value: [val],
        } as IObjectValue)
      )
    }
  }, [router.query.id])

  const { tempSize, tempColor, tempObjectValue } = useAppSelector((state) => state.cart)
  // ? Add To LastSeen
  useEffect(() => {
    dispatch(
      addToLastSeen({
        productID: product.id,
        image: product.mainImageSrc,
        title: product.title,
        slug: product.slug,
        discount: product.stockItems[0].discount ?? 0,
        price: product.stockItems[0].price ?? 0,
        inStock: product.inStock,
      })
    )
  }, [product.id])

  // modal
  const [isOpen, selectedAddress, { open, close }] = useDisclosureWithData()
  const [isShowModal, modalHandlers] = useDisclosure()

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const halfStar = rating % 1 !== 0
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-xl text-[#FFD700]" />)
    }

    if (halfStar) {
      stars.push(<FaStar key="half" className="text-xl text-[#FFD700]" />)
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-xl text-[#eee]" />)
    }

    return stars
  }
  const addMainImageToList = (mainImageSrc: EntityImage, imagesSrcList: EntityImage[]) => {
    return [mainImageSrc, ...imagesSrcList]
  }
  const updatedImagesSrcList = addMainImageToList(product.mainImageSrc, product.imagesSrc ?? [])

  // ? Render(s)
  return (
    <>
      <MetaTags
        title={generalSetting?.title + ' | ' + `خرید ${product.title}` || 'فروشگاه اینترنتی'}
        description={generalSetting?.shortIntroduction + product.title || 'توضیحاتی فروشگاه اینترنتی'}
        keywords={generalSetting?.googleTags || ' اینترنتی, فروشگاه'}
      />
      <ClientLayout>
        <main className="mx-auto space-y-4 py-4 lg:max-w-[1550px] lg:mt-4 sm:mt-4 md:mt-6  -mt-20">
          <div className="flex items-center mr-6">
            <div className="text-sm text-gray-400">دسته بندی محصول:</div>{' '}
            <ProductBreadcrumb categoryLevels={product.parentCategories ?? []} isAdminTable />
          </div>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex lg:justify-start justify-end ml-4 lg:ml-0 mb-4 lg:mb-0">
              <div className="flex lg:flex-col items-center shadow-product h-fit rounded-lg mr-4">
                <div
                  className="py-2 lg:py-5 px-4 lg:px-2 cursor-pointer hover:bg-slate-50 rounded-lg"
                  title="افزودن به علاقه مندی ها"
                >
                  <BsHeart className="text-xl" />
                </div>
                <div
                  className="py-2 lg:py-5 px-4 lg:px-2 cursor-pointer hover:bg-slate-50 rounded-lg"
                  title="اشتراک گذاری"
                >
                  <BiShareAlt className="icon" />
                </div>
              </div>
            </div>
            <ProductGallery
              images={product.imagesSrc && product.imagesSrc.length > 0 ? updatedImagesSrcList : [product.mainImageSrc]}
              discount={product.discount}
              inStock={product.inStock}
              productName={product.title}
            />

            <div className="flex px-3 flex-col w-full ml-8 mr-10">
              <div className="border-b-2 py-2 flex justify-between items-center h-[52px]">
                <div className="flex">
                  <div className="text-gray-400 text-sm md:text-base">نام محصول :</div>
                  <div className="mr-1  text-sm md:text-base">{product.title}</div>
                </div>
                {product.status !== 0 && <div className="bg-[#f7d439] text-xs px-1.5 p-1 rounded-3xl">کارکرده</div>}
              </div>

              <div className="border-b-2 py-2 flex h-[52px]  items-center">
                <div className="text-gray-400 text-sm md:text-base">کد محصول :</div>
                <div className="mr-1  text-sm md:text-base">{product.code}</div>
              </div>

              {product.brandName && (
                <div className="border-b-2 py-2 flex justify-between items-center h-[52px]">
                  <div className="flex">
                    <div className="text-gray-400 text-sm md:text-base">برند محصول :</div>
                    <div className="mr-1  text-sm md:text-base">{product.brandName}</div>
                  </div>
                  {product.isFake && <div className="bg-[#f7d439] text-xs px-1.5 p-1 rounded-3xl">غیر اصل</div>}
                </div>
              )}

              {product.productSizeInfo?.columns?.length! > 0 && (
                <div className="border-b-2 py-2 flex items-center justify-between sm:h-[52px]">
                  <div className="flex justify-between flex-col gap-2 sm:gap-0 sm:flex-row w-[44%]">
                    <div className="flex">
                      <div className="text-gray-400 text-sm md:text-base whitespace-nowrap">سایزبندی :</div>
                      <div className="mr-1  text-sm  md:text-base">{tempSize?.name}</div>
                    </div>
                    <div className="flex gap-2.5">
                      <ProductSizeSelector sizes={product.productSizeInfo?.columns ?? []} />
                    </div>
                  </div>
                  <Button onClick={modalHandlers.open} className="p-2 text-xs rounded">
                    راهنمایی سایز
                  </Button>
                </div>
              )}

              {product.productFeatureInfo?.colorDTOs?.length! > 0 && (
                <div className="border-b-2 pt-1 items-center flex sm:h-[52px]">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between w-[44%]">
                    <div className="flex">
                      <div className="text-gray-400 text-sm md:text-base whitespace-nowrap">رنگ :</div>
                      <div className="mr-1 whitespace-nowrap  text-sm  md:text-base">{tempColor?.name}</div>
                    </div>
                    <div className="mr-1 mb-2 sm:mb-0">
                      <ProductColorSelector colors={product.productFeatureInfo?.colorDTOs ?? []} />
                    </div>
                  </div>
                </div>
              )}
              {product.productFeatureInfo?.featureValueInfos?.length! > 0 && (
                <div className="border-b-2 pt-1 items-center flex sm:h-[52px]">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between w-[44%]">
                    <div className="flex">
                      <div className="text-gray-400 text-sm md:text-base whitespace-nowrap">
                        {tempObjectValue?.title} :
                      </div>
                      <div className="mr-1 whitespace-nowrap  text-sm  md:text-base">
                        {tempObjectValue?.value ? tempObjectValue?.value![0].name : null}
                      </div>
                    </div>
                    <div className="mr-1 mb-2 sm:mb-0">
                      <ProductObjectValueSelector objectValues={product.productFeatureInfo?.featureValueInfos ?? []} />
                    </div>
                  </div>
                </div>
              )}
              <div className="z-[99]">
                {product.inStock > 0 ? (
                  <AddToCartButton product={product} />
                ) : (
                  <div className="w-full flex justify-center pt-20">
                    {' '}
                    <Button className="btn bg-gray-300 text-sm xs:px-12 whitespace-nowrap xs:text-base md:w-1/2 ">
                      اتمام موجودی
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <ProductScaleModal
              isShow={isShowModal}
              productSizeInfo={product.productSizeInfo ?? ({} as IProductSizeInfo)}
              onClose={modalHandlers.close}
            />
          </div>

          {/* product features tabs :  */}
          <div className="w-full px-2 sm:py-16 sm:px-0 pt-28 pb-6">
            <Tab.Group className="sm:mx-4 mx-0">
              <Tab.List className="flex justify-center xs:justify-start xs:flex-nowrap flex-wrap gap-3 rounded-md bg-[#f7f5f8] border p-4">
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={classNames(
                        'w-36 rounded flex  items-center justify-center py-2.5 text-sm sm:text-base  font-light  ',
                        selected ? 'text-white bg-[#3F3A42] shadow ' : 'bg-[#f7f5f8] text-[#6b6b6b]'
                      )}
                    >
                      <TfiMenuAlt className="-mr-2 ml-1" />
                      ویژگی محصول
                    </button>
                  )}
                </Tab>
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={classNames(
                        'w-36 rounded flex  items-center justify-center py-2.5 text-sm sm:text-base  font-light  ',
                        selected ? 'text-white bg-[#3F3A42] shadow ' : 'bg-[#f7f5f8] text-[#6b6b6b]'
                      )}
                    >
                      <RiMenu5Fill className="-mr-2 ml-1" />
                      توضیحات
                    </button>
                  )}
                </Tab>

                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={classNames(
                        'w-36 rounded flex  items-center justify-center py-2.5 text-sm sm:text-base  font-light  ',
                        selected ? 'text-white bg-[#3F3A42] shadow ' : 'bg-[#f7f5f8] text-[#6b6b6b]'
                      )}
                    >
                      <TfiRulerAlt2 className="-mr-2 ml-1" />
                      راهنمای سایز
                    </button>
                  )}
                </Tab>
              </Tab.List>
              <Tab.Panels className="mt-2">
                <Tab.Panel className={classNames('bg-white rounded-xl p-3', 'bg-opacity-100')}>
                  <div className="text-gray-700">
                    <div className="w-full flex mb-6">
                      <div className="text-[#9e9e9e]  sm:text-base w-[150px]">سایزبندی</div>
                      <div className="flex items-center">
                        {product.productSizeInfo?.columns?.map((size, index) => (
                          <div key={size.id} className="flex items-center">
                            <div className=" text-sm">{size.name}</div>
                            {index < product.productSizeInfo?.columns!.length! - 1 && (
                              <div className="text-red-600 mx-1">|</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    {product.inStock > 0 && product.productFeatureInfo?.colorDTOs?.length! > 0 && (
                      <div className="w-full flex">
                        <div className="text-[#9e9e9e]  sm:text-base w-[150px]">رنگ</div>
                        {product.productFeatureInfo?.colorDTOs?.map((color, index) => (
                          <div key={color.id} className="flex items-center">
                            <div className=" whitespace-nowrap text-sm">{color.name}</div>
                            {index < product.productFeatureInfo?.colorDTOs!.length! - 1 && (
                              <div className="text-red-600 mx-1">|</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {product.inStock > 0 &&
                      product.productFeatureInfo?.featureValueInfos?.length! > 0 &&
                      product.productFeatureInfo?.featureValueInfos?.map((item, index) => (
                        <div key={item.id} className="w-full flex mt-6">
                          <div className="text-[#9e9e9e]  sm:text-base w-[150px]">{item.title}</div>
                          {item.value?.map((itemValue, index) => (
                            <div key={itemValue.id} className="flex items-center">
                              <div className=" whitespace-nowrap text-sm">{itemValue.name}</div>
                              {index < item.value?.length! - 1 && <div className="text-red-600 mx-1">|</div>}
                            </div>
                          ))}
                        </div>
                      ))}
                  </div>
                </Tab.Panel>
                <Tab.Panel className={classNames('bg-white rounded-xl p-3 border', 'bg-opacity-100')}>
                  {/* محتوای توضیحات */}
                  <div
                    className="ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred max-h-[500px]"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </Tab.Panel>

                <Tab.Panel className={classNames('bg-white rounded-xl p-3', 'bg-opacity-100')}>
                  {product.productSizeInfo?.columns?.length! > 0 && (
                    <div className="flex flex-col-reverse  items-center sm:flex-row gap-x-6 pb-4 px-5">
                      <div className="flex flex-col flex-1">
                        <div className="text-center sm:text-start">
                          <span className="font-normal">
                            - تلورانس اندازه گیری تا {digitsEnToFa('5%')} طبیعی است <br /> - اعداد بر حسب{' '}
                            <span className="text-red-600">
                              {product.productSizeInfo?.sizeType === '0' ? 'سانتیمتر' : 'میلیمتر'}
                            </span>{' '}
                            میباشد
                          </span>
                        </div>
                        <Button className="bg-white mt-1.5 text-gray-800 font-semibold border rounded">سایز</Button>
                        <table className="table-auto mt-4 border-collapse w-full">
                          <thead className="bg-[#8fdcff]">
                            <tr>
                              <th className=" px-4 py-2"></th>
                              {product.productSizeInfo?.columns?.map((column) => (
                                <th key={column.id} className="px-4 py-2 w-[135px] font-normal">
                                  {column.name}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {product.productSizeInfo?.rows?.map((row, rowIndex) => (
                              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-100' : ''}>
                                <td className="px-4 py-2">{row.productSizeValue}</td>
                                {product.productSizeInfo?.columns?.map((column, colIndex) => (
                                  <td key={colIndex} className="px-4 py-2 font-normal">
                                    <div className="border h-9 w-full flex justify-start  items-center pr-1 rounded-md bg-white">
                                      {row.scaleValues![colIndex] || ''}
                                    </div>
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="rounded-lg shadow-product w-[400px] h-[400px]">
                        <img
                          className="w-full h-full rounded-lg"
                          src={product.productSizeInfo?.imagesSrc?.imageUrl}
                          alt="عکس اندازه محصول"
                        />
                      </div>
                    </div>
                  )}
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>

          {/* reviews */}
          <div className="w-full px-2 sm:py-16 sm:px-0 pt-28 pb-6">
            <Tab.Group className="sm:mx-4 mx-0">
              <Tab.List className="flex justify-center xs:justify-start sm:flex-nowrap flex-wrap gap-3 rounded-md bg-[#f7f5f8] border p-4">
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={classNames(
                        'w-40 rounded flex  items-center justify-center whitespace-nowrap py-2.5 text-sm sm:text-base  font-light  ',
                        selected ? 'text-white bg-[#3F3A42] shadow ' : 'bg-[#f7f5f8] text-[#6b6b6b]'
                      )}
                    >
                      دیدگاه کاربران{' '}
                      <span className={`${selected ? 'text-white' : ' text-[#6b6b6b]'} mr-0.5`}>
                        ({digitsEnToFa(`${product.reviewCount}`)} نظر)
                      </span>
                    </button>
                  )}
                </Tab>
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={classNames(
                        'w-36 rounded flex  items-center justify-center whitespace-nowrap py-2.5 text-sm sm:text-base  font-light  ',
                        selected ? 'text-white bg-[#3F3A42] shadow ' : 'bg-[#f7f5f8] text-[#6b6b6b]'
                      )}
                    >
                      پرسش و پاسخ
                    </button>
                  )}
                </Tab>

                <div className="whitespace-nowrap flex items-center gap-3">
                  <div className="font-light">میانگین امتیاز این محصول</div>
                  <div className="flex gap-1">{renderStars(product.rating ?? 0)}</div>
                </div>
              </Tab.List>
              <Tab.Panels className="mt-2">
                <Tab.Panel>
                  <ReviewsList numReviews={product.reviewCount ?? 0} product={product} />
                </Tab.Panel>
                <Tab.Panel>در اینجا پرسش و پاسخ قرار میگیرد</Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
          <div className="relative w-full flex pt-28">
            <div className="bg-[#dee2e6] w-full h-[410px] xs:h-[330px] sm:h-[360px] relative">
              <SmilarProductsSlider products={smilarProducts.products} isFetching={false} />
            </div>
          </div>
          <div className="relative w-full flex pt-28">
            <div className="bg-[#dee2e6] w-full h-[410px] xs:h-[330px] sm:h-[360px] relative">
              <RecentVisitedSlider lastSeenProduct={{ products: lastSeen, title: 'بازدید های اخیر' }} />
            </div>
          </div>
        </main>
      </ClientLayout>
    </>
  )
}

export default SingleProduct
