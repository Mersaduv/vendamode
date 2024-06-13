import { useEffect } from 'react'
import Link from 'next/link'

import { useGetCategoriesQuery } from '@/services'

import { Disclosure } from '@headlessui/react'
import useDisclosure from '@/hooks/useDisclosure'
import { SidebarSkeleton } from '@/components/skeleton'
import { ArrowDown, ArrowLeft, Bars, LogoPersian } from '@/icons'

export default function Sidebar() {
  // ? Assets
  const [isSidebar, sidebarHandlers] = useDisclosure()

  // ? Get Categories Query
  const { isLoading , data } = useGetCategoriesQuery(undefined, {
    selectFromResult: ({ data, isLoading }) => ({
      data,
      isLoading,
    }),
  })

  // ? Handlers
  const handleClose = () => sidebarHandlers.close()

  // ? Re-Renders
  //*    prevent scroll
  useEffect(() => {
    if (isSidebar) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'

    
  }, [isSidebar])

  if (data != undefined) {
    // console.log(data)
  }
  // ? Render(s)
  return (
    <>
      <button className="p-1 lg:hidden" type="button" onClick={sidebarHandlers.open}>
        <Bars className="icon" />
      </button>
      <div
        className={`fixed top-0 z-10 h-screen w-full duration-200 lg:hidden ${isSidebar ? 'right-0' : '-right-full'} `}
      >
        <div
          className={`${
            isSidebar ? 'visible opacity-100 delay-200 duration-300' : 'invisible opacity-0 '
          }  z-10  h-full w-full bg-gray-100/50`}
          onClick={sidebarHandlers.close}
        />

        <div className="absolute right-0 top-0 z-20 h-screen w-3/4 max-w-sm space-y-4 overflow-y-auto bg-white py-4">
          {/* <LogoPersian className="mr-3 h-10 w-28" /> */}
          VENDA MODE
          <h5 className="border-t-2 border-gray-200  p-3">دسته‌بندی کالاها</h5>
          {isLoading ? (
            <SidebarSkeleton />
          ) : data?.data ? (
            <div>
              {data.data!.categoryList &&
                data.data!.categoryList.map((category) => (
                  <Disclosure key={category.id}>
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="!mt-0 flex w-full items-center justify-between px-4 py-2">
                          <span
                            className={`pl-3 font-semibold tracking-wide ${open ? 'text-[#e90089]' : 'text-gray-600'}`}
                          >
                            {category.name}
                          </span>

                          <ArrowDown
                            className={` ${
                              open ? 'rotate-180 text-[#e90089]' : 'text-gray-700'
                            } h-7 w-7 rounded-2xl bg-gray-50`}
                          />
                        </Disclosure.Button>
                        <Disclosure.Panel className=" !mt-0 bg-gray-100 text-sm text-gray-500">

                          {category?.childCategories &&
                            category.childCategories.map((category) => (
                              <Disclosure key={category.id}>
                                {({ open }) => (
                                  <>
                                    <Disclosure.Button className="!mt-0 flex w-full items-center justify-between px-4 py-2 pr-7">
                                      <span className={`font-medium ${open ? 'text-[#e90089]' : 'text-gray-600'}`}>
                                        {category.name}
                                      </span>
                                      <ArrowDown
                                        className={` ${
                                          open ? 'rotate-180 text-[#e90089]' : 'text-gray-700'
                                        } h-7 w-7 rounded-2xl bg-gray-50`}
                                      />
                                    </Disclosure.Button>
                                    <Disclosure.Panel
                                      className={`!mt-0 px-4 pb-1 pt-2 text-sm text-gray-500 
                                     ${open ? 'border-b border-gray-50' : ''}
                                    `}
                                    >
                                      <Link
                                        href={`/products?category=${category.slug}`}
                                        className="inline-flex max-w-max items-center py-2 pr-9 text-sm text-gray-500"
                                        onClick={handleClose}
                                      >
                                        تمام موارد این دسته
                                        <ArrowLeft className="icon text-gray-500" />
                                      </Link>
                                      {category.childCategories &&
                                        category.childCategories.map((category) => (
                                          <Link
                                            key={category.id}
                                            href={`/products?category=${category.slug}`}
                                            className="my-2 block py-2.5 pr-9 font-normal tracking-wide"
                                            onClick={handleClose}
                                          >
                                            {category.name}
                                          </Link>
                                        ))}
                                    </Disclosure.Panel>
                                  </>
                                )}
                              </Disclosure>
                            ))}
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}
