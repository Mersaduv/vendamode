import Link from 'next/link'

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight2,
  ArrowUp,
  Bag,
  Category,
  Comment,
  Image,
  Location,
  Logo,
  Plus,
  Save,
  Slider,
  Users,
} from '@/icons'
import { LiaAdSolid } from 'react-icons/lia'
import { MdOutlineAdsClick } from 'react-icons/md'
import { GrGallery } from 'react-icons/gr'
import { PiUserDuotone } from 'react-icons/pi'
import { AiTwotoneMail } from 'react-icons/ai'
import { FaCalculator } from 'react-icons/fa'
import { IoSettings } from 'react-icons/io5'
import { HiMail } from 'react-icons/hi'

import { BoxLink } from '@/components/ui'
import { LogoutButton } from '@/components/user'
import { BiGrid, BiSolidGridAlt, BiWindow } from 'react-icons/bi'
import { IoCart } from 'react-icons/io5'
import { TbPointFilled } from 'react-icons/tb'
import { RiShoppingBag2Fill } from 'react-icons/ri'
import { IconType } from 'react-icons'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { IoMdDocument } from 'react-icons/io'
import Drawer from './Drawer'

interface ProfilePath {
  id: number
  name: string
  Icon: any
  subItem?: {
    id: number
    name: string
    Icon: any
    path: string
  }[]
  path?: string
  pathName?: string
}

function makeIdsUnique(arr: ProfilePath[]) {
  let idCounter = 1

  const recursiveIdUpdate = (arr: ProfilePath[]) => {
    arr.forEach((item: any) => {
      item.id = idCounter
      idCounter++

      if (item.subItem && Array.isArray(item.subItem)) {
        recursiveIdUpdate(item.subItem)
      }
    })
  }

  recursiveIdUpdate(arr)
  return arr
}

const profileData: ProfilePath[] = [
  { id: 1, name: 'پیشخوان', Icon: BiSolidGridAlt, path: '/admin' },
  { id: 1, name: 'سفارشات', Icon: IoCart, path: '/admin/orders' },
  {
    id: 1,
    name: 'محصولات',
    Icon: RiShoppingBag2Fill,
    subItem: [
      {
        id: 1,
        name: 'محصول جدید',
        Icon: TbPointFilled,
        path: '/admin/products/create',
      },
      {
        id: 1,
        name: 'همه محصولات',
        Icon: TbPointFilled,
        path: '/admin/products',
      },
    ],
    pathName: '/admin/products/create' || '/admin/products',
  },
  {
    id: 2,
    name: 'تبلیغات',
    Icon: MdOutlineAdsClick,
    subItem: [
      {
        id: 2,
        name: 'صفحه اصلی',
        Icon: TbPointFilled,
        path: '/admin/sub',
      },
      {
        id: 2,
        name: 'پیشنهاد شگفت انگیز',
        Icon: TbPointFilled,
        path: '/admin/sub',
      },
      {
        id: 2,
        name: 'هدایا',
        Icon: TbPointFilled,
        path: '/admin/sub',
      },
      {
        id: 2,
        name: 'کوپن تخفیف',
        Icon: TbPointFilled,
        path: '/admin/sub',
      },
    ],
  },
  {
    id: 3,
    name: 'مقالات',
    Icon: IoMdDocument,
    subItem: [
      {
        id: 3,
        name: 'مقاله جدید',
        Icon: TbPointFilled,
        path: '/admin/article',
      },
      {
        id: 3,
        name: 'همه مقالات',
        Icon: TbPointFilled,
        path: '/admin/article',
      },
    ],
  },
  { id: 4, name: 'گالری', Icon: GrGallery, path: '/admin/categories' },
  {
    id: 5,
    name: 'کاربران',
    Icon: PiUserDuotone,
    subItem: [
      {
        id: 5,
        name: 'کاربر جدید',
        Icon: TbPointFilled,
        path: '/admin/users',
      },
      {
        id: 5,
        name: 'همه کاربران',
        Icon: TbPointFilled,
        path: '/admin/users',
      },
      {
        id: 5,
        name: 'سمت ها',
        Icon: TbPointFilled,
        path: '/admin/users',
      },
    ],
  },
  {
    id: 6,
    name: 'پشتیبانی',
    Icon: HiMail,
    subItem: [
      {
        id: 6,
        name: 'پیام ها',
        Icon: TbPointFilled,
        path: '/admin/support',
      },
      {
        id: 6,
        name: 'دیدگاه',
        Icon: TbPointFilled,
        path: '/admin/support',
      },
    ],
  },
  {
    id: 7,
    name: 'تجزیه تحلیل',
    Icon: FaCalculator,
    subItem: [
      {
        id: 7,
        name: 'درآمد',
        Icon: TbPointFilled,
        path: '/admin/analyze',
      },
      {
        id: 7,
        name: 'مالیات',
        Icon: TbPointFilled,
        path: '/admin/analyze',
      },
      {
        id: 7,
        name: 'نمودار فروش',
        Icon: TbPointFilled,
        path: '/admin/analyze',
      },
    ],
  },
  {
    id: 8,
    name: 'تنظیمات',
    Icon: IoSettings,
    subItem: [
      {
        id: 8,
        name: 'دیزاین',
        Icon: TbPointFilled,
        path: '/admin/setting',
      },
      {
        id: 8,
        name: 'پیکربندی محصول',
        Icon: TbPointFilled,
        path: '/admin/product-configuration',
      },
      {
        id: 8,
        name: 'مبالغ و هزینه ها',
        Icon: TbPointFilled,
        path: '/admin/setting',
      },
      {
        id: 8,
        name: 'دپارتمان',
        Icon: TbPointFilled,
        path: '/admin/setting',
      },
    ],
  },
]

const profilePaths = makeIdsUnique(profileData)
interface Props {
  openRight: boolean
  setOpenRight: Dispatch<SetStateAction<boolean>>
}
export default function DashboardAdminAside(props: Props) {
  const { openRight, setOpenRight } = props
  const router = useRouter()

  const [openIndex, setOpenIndex] = useState<number | null>(null)

  useEffect(() => {
    profilePaths.forEach((item, index) => {
      if (item.subItem) {
        item.subItem.forEach((subItem) => {
          if (router.pathname === subItem.path) {
            setOpenIndex(item.id)
          }
        })
      }
    })
  }, [router.pathname])

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const isPathActive = (path: string) => router.pathname === path

  const isParentPathActive = (subItems?: { path: string }[]) => {
    return subItems?.some((subItem) => isPathActive(subItem.path))
  }

  return (
    <>
      <aside className="sticky top-[60px] w-[265px] bg-[#1e1e2d] hidden lg2:block">
        <div className="py-5 flex flex-col justify-between h-screen">
          <div className="overflow-auto">
            {profilePaths.map((item, index) =>
              item.path ? (
                <Link href={item.path} key={index}>
                  <div
                    className={`flex cursor-pointer hover:bg-[#1b1b28] justify-between items-center py-2.5 text-sm px-6 pl-4 w-full gap-3 text-[#9899ac] ${
                      router.pathname === item.path ? 'text-[#e90089] bg-[#1b1b28]' : ' text-gray-700'
                    }`}
                    onClick={() => handleToggle(item.id)}
                  >
                    <div className="flex gap-3 items-center">
                      <item.Icon
                        className={`text-xl ${router.pathname === item.path ? 'text-[#e90089]' : 'text-[#5a6080]'}`}
                      />
                      <span className={`ml-2 ${router.pathname === item.path ? 'text-white' : ' text-gray-400'}`}>
                        {item.name}
                      </span>
                    </div>{' '}
                    {item.subItem && (
                      <span className="text-white">
                        <ArrowLeft
                          className={`transition-all ease-in-out duration-500 ${
                            openIndex == item.id ? '-rotate-90' : ''
                          } text-3xl hover:shadow-xl rounded-full text-[#e90089]`}
                        />
                      </span>
                    )}
                  </div>
                </Link>
              ) : (
                <div key={index}>
                  <div
                    className={`flex cursor-pointer hover:bg-[#1b1b28] justify-between items-center py-2.5 text-sm px-6 pl-4 w-full gap-3 text-[#9899ac] ${
                      router.pathname === item.pathName
                        ? 'text-[#e90089] bg-[#1b1b28]'
                        : openIndex === item.id
                        ? 'bg-[#1b1b28]'
                        : 'text-gray-700'
                    }`}
                    onClick={() => handleToggle(item.id)}
                  >
                    <div className="flex gap-3 items-center">
                      <item.Icon className="text-xl text-[#5a6080]" />
                      <span
                        className={`ml-2 ${
                          isPathActive(item.pathName || '') || isParentPathActive(item.subItem)
                            ? 'text-white'
                            : 'text-gray-400'
                        }`}
                      >
                        {item.name}
                      </span>
                    </div>{' '}
                    {item.subItem && (
                      <span className="text-white">
                        <ArrowLeft
                          className={`transition-all ease-in-out duration-500 ${
                            openIndex == item.id ? '-rotate-90' : ''
                          } text-3xl hover:shadow-xl rounded-full text-[#e90089]`}
                        />
                      </span>
                    )}
                  </div>

                  <div
                    className={`overflow-hidden w-full transition-all ease-in-out duration-500 ${
                      item.subItem && openIndex === item.id ? 'max-h-screen' : 'max-h-0'
                    }`}
                  >
                    {item.subItem?.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subItem.path}
                        className="flex items-center hover:bg-[#1b1b28] py-2.5 text-sm px-6 w-full gap-3 text-[#9899ac]"
                      >
                        <subItem.Icon
                          className={`mr-4 text-sm ${isPathActive(subItem.path) ? 'text-[#e90089]' : 'text-[#5a6080]'}`}
                        />
                        <span className={`${isPathActive(subItem.path) ? 'text-white' : 'text-gray-400'}`}>
                          {subItem.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
          <LogoutButton isShowDrawer />
        </div>
      </aside>

      <Drawer open={openRight} side="right" setOpen={setOpenRight}>
        {openRight && (
          <aside className="sticky  pt-[70px] top-[60px] w-[265px] bg-[#1e1e2d] block lg2:hidden">
            <div className="py-5 flex flex-col justify-between h-screen">
              <div className="overflow-auto">
                {profilePaths.map((item, index) =>
                  item.path ? (
                    <Link href={item.path} key={index}>
                      <div
                        className={`flex cursor-pointer hover:bg-[#1b1b28] justify-between items-center py-2.5 text-sm px-6 pl-4 w-full gap-3 text-[#9899ac] ${
                          router.pathname === item.path ? 'text-[#e90089] bg-[#1b1b28]' : ' text-gray-700'
                        }`}
                        onClick={() => handleToggle(item.id)}
                      >
                        <div className="flex gap-3 items-center">
                          <item.Icon
                            className={`text-xl ${router.pathname === item.path ? 'text-[#e90089]' : 'text-[#5a6080]'}`}
                          />
                          <span className={`ml-2 ${router.pathname === item.path ? 'text-white' : ' text-gray-400'}`}>
                            {item.name}
                          </span>
                        </div>{' '}
                        {item.subItem && (
                          <span className="text-white">
                            <ArrowLeft
                              className={`transition-all ease-in-out duration-500 ${
                                openIndex == item.id ? '-rotate-90' : ''
                              } text-3xl hover:shadow-xl rounded-full text-[#e90089]`}
                            />
                          </span>
                        )}
                      </div>
                    </Link>
                  ) : (
                    <div key={index}>
                      <div
                        className={`flex cursor-pointer hover:bg-[#1b1b28] justify-between items-center py-2.5 text-sm px-6 pl-4 w-full gap-3 text-[#9899ac] ${
                          router.pathname === item.pathName
                            ? 'text-[#e90089] bg-[#1b1b28]'
                            : openIndex === item.id
                            ? 'bg-[#1b1b28]'
                            : 'text-gray-700'
                        }`}
                        onClick={() => handleToggle(item.id)}
                      >
                        <div className="flex gap-3 items-center">
                          <item.Icon className="text-xl text-[#5a6080]" />
                          <span
                            className={`ml-2 ${
                              isPathActive(item.pathName || '') || isParentPathActive(item.subItem)
                                ? 'text-white'
                                : 'text-gray-400'
                            }`}
                          >
                            {item.name}
                          </span>
                        </div>{' '}
                        {item.subItem && (
                          <span className="text-white">
                            <ArrowLeft
                              className={`transition-all ease-in-out duration-500 ${
                                openIndex == item.id ? '-rotate-90' : ''
                              } text-3xl hover:shadow-xl rounded-full text-[#e90089]`}
                            />
                          </span>
                        )}
                      </div>

                      <div
                        className={`overflow-hidden w-full transition-all ease-in-out duration-500 ${
                          item.subItem && openIndex === item.id ? 'max-h-screen' : 'max-h-0'
                        }`}
                      >
                        {item.subItem?.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            href={subItem.path}
                            className="flex items-center hover:bg-[#1b1b28] py-2.5 text-sm px-6 w-full gap-3 text-[#9899ac]"
                          >
                            <subItem.Icon
                              className={`mr-4 text-sm ${
                                isPathActive(subItem.path) ? 'text-[#e90089]' : 'text-[#5a6080]'
                              }`}
                            />
                            <span className={`${isPathActive(subItem.path) ? 'text-white' : 'text-gray-400'}`}>
                              {subItem.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )
                )}
                <LogoutButton isShowDrawer />
              </div>
            </div>
          </aside>
        )}
      </Drawer>
    </>
  )
}
