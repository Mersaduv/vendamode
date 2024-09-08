import { Logo, Question, Search } from '@/icons'
import Link from 'next/link'

// import { Logo, Question } from "@/icons";
import { SearchModal } from '@/components/modals'
import { UserAuthLinks } from '@/components/user'
import { CartDisplay } from '@/components/cart'
import { Sidebar, Navbar } from '@/components/shared'
import { useState } from 'react'
import TextMarquee from '../ui/TextMarquee'
import { useAppSelector } from '@/hooks'
import { useGetDesignItemsQuery, useGetStoreCategoriesQuery } from '@/services'
const Header = () => {
  const [isShowSearch, setIsShowSearch] = useState(false)
  const { logoImages } = useAppSelector((state) => state.design)

  const {
    data: designItemsData,
    isLoading: isLoadingDesignItems,
    isError: isErrorDesignItems,
  } = useGetDesignItemsQuery()

  return (
    <>
      <header className="bg-white shadow xl:inset-x-0 top-0 fixed w-full z-[101] transition duration-700 ease-in-out">
        <TextMarquee />
        {/* Tablet and Desktop */}
        <div className="pr-4 sm:px-4 flex flex-col items-center">
          <div className="container mx-10 hidden sm:block z-[99] items-center max-w-[1700px] lg:flex lg:py-2 w-full">
            <div className="inline-flex w-full items-center justify-between border-b lg:ml-8 lg:max-w-min lg:border-b-0">
              <Sidebar />
              <Link className="w-32 md:w-52" passHref href="/">
                <img
                  width={250}
                  src={(logoImages?.orgImage && logoImages?.orgImage.imageUrl) || ''}
                  alt="online shop"
                />
              </Link>
              <Question className="icon lg:hidden" />
            </div>
            <div className="inline-flex w-full items-center justify-between gap-x-10 border-b py-2 lg:border-b-0">
              <div className="flex grow gap-x-7 lg:justify-center">
                <SearchModal />
              </div>
              <div className=" inline-flex items-center gap-x-4">
                <CartDisplay />
                <span className="hidden h-8 w-0.5 bg-gray-300 lg:block" />
                <UserAuthLinks />
              </div>
            </div>
          </div>
          <div className="relative gap-8 flex max-w-[1700px] justify-start w-full ">
            <Navbar />
            <div className=" gap-8 hidden lg:flex">
              {designItemsData &&
                designItemsData.data
                  ?.filter((item) => item.type === 'lists')
                  .map((designItem) => {
                    return (
                      <div
                        className="flex gap-2 border-[#e90089] hover:border-b-2 cursor-pointer py-3"
                        key={designItem.id}
                      >
                        <div>
                          <img
                            className="w-5 h-5 rounded-lg opacity-55"
                            src={designItem.image.imageUrl}
                            alt={designItem.title}
                          />
                        </div>
                        <div className='text-sm'>{designItem.title}</div>
                      </div>
                    )
                  })}
            </div>
            {/* <AddressBar /> */}
          </div>

          {/* mobile  */}
          <div className="container block sm:hidden z-[99] items-center max-w-[1700px] py-2 transition duration-700 ease-in-out">
            <div className="inline-flex w-full items-center justify-between">
              <div className="flex">
                <Sidebar />
                <Search
                  onClick={() => setIsShowSearch((prev) => !prev)}
                  className="icon m-2 cursor-pointer z-50 text-gray-500"
                />
              </div>
              <Link className="w-24 md:w-52" passHref href="/">
                <img width={250} src={'/logo/Logo.png'} alt="Venda Mode" />
              </Link>
              <div className=" inline-flex items-center gap-x-4">
                <CartDisplay />
                <span className="hidden h-8 w-0.5 bg-gray-300 lg:block" />
                <UserAuthLinks />
              </div>
            </div>
            <div className={`${isShowSearch ? '-mt-0' : '-mt-6'} `}>
              <div
                className={`inline-flex w-full items-center justify-between gap-x-10 border-b py-2 lg:border-b-0 transition-all duration-700 ease-in-out ${
                  isShowSearch ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0  overflow-hidden'
                }`}
              >
                <div className="flex pl-2 sm:pl-0 grow gap-x-7 lg:mr-8 w-full">
                  <SearchModal />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
