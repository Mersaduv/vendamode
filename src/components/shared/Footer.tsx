import { useAppSelector } from '@/hooks'
import {
  useGetCopyrightQuery,
  useGetDesignItemsQuery,
  useGetRedirectsQuery,
  useGetSloganFooterQuery,
  useGetSupportQuery,
} from '@/services'
import Link from 'next/link'

const Footer = () => {
  //  ? Query
  const { data: copyrightData, isLoading: isLoadingCopyright, isError: isErrorCopyright } = useGetCopyrightQuery()
  const {
    data: designItemsData,
    isLoading: isLoadingDesignItems,
    isError: isErrorDesignItems,
  } = useGetDesignItemsQuery()
  const {
    data: sloganFooterData,
    isLoading: isLoadingSloganFooter,
    isError: isErrorSloganFooter,
  } = useGetSloganFooterQuery()
  const { data: supportData, isLoading: isLoadingSupport, isError: isErrorSupport } = useGetSupportQuery()

  // ? States
  const { logoImages } = useAppSelector((state) => state.design)
  return (
    <footer className="w-full bg-gray-100 text-gray-800 py-8 mt-20">
      <div className="mx-auto flex flex-col px-8">
        <div className="flex flex-col  justify-between items-center lg:items-center">
          <div className=" text-center mx-20 mb-8 lg:mb-0">
            <h2 className="text-xl font-bold mb-4">{sloganFooterData?.data?.headline}</h2>
            <p
              className="ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred"
              dangerouslySetInnerHTML={{ __html: sloganFooterData?.data?.introductionText || '' }}
            />
          </div>

          <div className=" w-full bg-blue-950 my-8 rounded-lg">
            <div className="flex items-center w-full">
              {' '}
              <div className="text-white flex flex-col justify-center pr-6 h-full w-[30%]">
                <div className="text-[#e90089] line-clamp-2 overflow-hidden text-ellipsis">
                  {supportData?.data?.contactAndSupport}
                </div>
                <div>{supportData?.data?.responseTime}</div>
              </div>
              <div className="w-full py-4">
                <div className="flex flex-wrap items-center justify-center gap-16 w-full border-x px-2">
                  {designItemsData?.data
                    ?.filter((item) => item.type === 'services')
                    .map((designItem) => {
                      return (
                        <a key={designItem.id} href={designItem.link}>
                          <div className="flex justify-center flex-col items-center gap-1.5">
                            <img
                              className="w-[50px] h-[50px]"
                              src={designItem.image.imageUrl}
                              alt={designItem.title || 'تصویر سرویس ها'}
                            />
                            <div className="text-center text-white text-xs">{designItem.title || ''}</div>
                          </div>
                        </a>
                      )
                    })}
                </div>
              </div>
              <div className="flex flex-col pt-0 justify-center h-full w-[30%] pl-2 pr-6 gap-1">
                <div className="text-white flex flex-col justify-center ">
                  <div className="text-[#e90089] whitespace-nowrap">همراه ما باشید</div>
                </div>
                <div className="flex flex-col  justify-center">
                  <div className="flex gap-4 flex-wrap">
                    {designItemsData?.data
                      ?.filter((item) => item.type === 'socialMedia')
                      .map((designItem) => {
                        return (
                          <a key={designItem.id} href={designItem.link}>
                            <div>
                              <img
                                className="w-[30px] h-[30px]"
                                src={designItem.image.imageUrl}
                                alt={designItem.title || 'تصویر شبکه های اجتماعی'}
                              />
                            </div>
                          </a>
                        )
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between w-full">
            <div className="w-1/2">
              <Link className="w-[38%] flex justify-center items-start" passHref href="/">
                <img
                  width={200}
                  src={(logoImages?.orgImage && logoImages?.orgImage.imageUrl) || ''}
                  alt="online shop"
                />
              </Link>
              <div
                className="ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred w-[46%] mt-8 "
                dangerouslySetInnerHTML={{ __html: supportData?.data?.address || '' }}
              />
            </div>
            {/* خرید از وندامد */}

            <div className="flex justify-between w-full">
              <div className=" flex justify-around w-full">
                <div className="mb-8 lg:mb-0  text-center lg:text-start">
                  <h3 className="text-lg font-bold mb-4">خرید از وندامد</h3>
                  <ul>
                    <li>
                      <a href="#" className="text-sm p-2">
                        رویه ارسال سفارش
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-sm p-2">
                        رویه استرداد کالا
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-sm p-2">
                        نحوه پرداخت مبلغ سفارش
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-sm p-2">
                        نحوه خرید از وندامد
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="mb-8 lg:mb-0  text-center lg:text-start">
                  <h3 className="text-lg font-bold mb-4">فروش در وندامد</h3>
                  <ul>
                    <li>
                      <a href="#" className="text-sm p-2">
                        قوانین فروش در وندامد
                      </a>
                    </li>
                  </ul>
                </div>
                <div className=" text-center lg:text-start">
                  <h3 className="text-lg font-bold mb-4 ">با وندامد</h3>
                  <ul>
                    <li>
                      <a href="#" className="text-sm p-2">
                        تماس با ما
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-sm p-2">
                        سوالات متداول!
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-sm p-2">
                        گزارش ایراد در سایت
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center border-t pt-6">
          <img className="w-28" src="/logo/E nemad.png" alt="ای نماد" />
          <img className="w-28" src="/logo/shamed.png" alt="ای نماد" />
        </div>
        <div className="flex flex-col lg:flex-row justify-between items-center mt-8 border-t pt-4">
          <div className="mb-4 lg:mb-0">
            <p className="text-sm">{copyrightData?.data?.name}</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* <img src="logo-samandehi.png" alt="Samandehi Logo" className="w-12 h-12" /> */}
            <p className="text-sm">
              طراحی شده در{' '}
              <a href="www.vendateam.ir" className="text-sky-500">
                ونداتیم
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
