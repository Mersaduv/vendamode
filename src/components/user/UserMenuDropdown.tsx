import Link from 'next/link'
import { Fragment } from 'react'
import { AiOutlineProduct } from 'react-icons/ai'
import { BiUser, BiBasket, BiHeart } from 'react-icons/bi'

import { Menu, Transition } from '@headlessui/react'

import { ArrowDown, ArrowLeft, Person, User } from '@/icons'
import { LogoutButton } from '@/components/user'

interface Props {
  name: string
}

const UserMenuDropdown: React.FC<Props> = (props) => {
  // ? Props
  const { name } = props
  const nameParts = name.split(' ')
  const firstName = nameParts[0]
  // ? Render(s)
  return (
    <Menu as="div" className="dropdown">
      <Menu.Button className="dropdown__button">
        <span className="text-xs xl:text-sm ml-auto mr-2.5 text-gray-700 font-semibold">سلام {firstName} عزیز</span>
        <ArrowDown className="icon" />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="dropdown__items">
          <Menu.Item>
            <div className="transition-colors">
              <Link
                href="/admin"
                className="flex-center justify-start gap-x-1 py-2.5 text-xs xl:text-sm ml-auto pr-4 text-gray-700 hover:text-[#e90089] font-medium hover:bg-gray-50"
              >
                <div>
                  <AiOutlineProduct className="h-6 w-6 text-black ml-1.5" />
                </div>
                پیشخوان وندا
              </Link>
            </div>
          </Menu.Item>
          <Menu.Item>
            <div className="transition-colors">
              <Link
                href="/profile"
                className="flex-center justify-start gap-x-1 py-2.5 text-xs xl:text-sm ml-auto pr-4 text-gray-700 hover:text-[#e90089] font-medium hover:bg-gray-50"
              >
                <div>
                  <BiUser className="h-6 w-6 text-black ml-1.5" />
                </div>
                حساب کاربری{' '}
              </Link>
            </div>
          </Menu.Item>
          <Menu.Item>
            <div className="transition-colors">
              <Link
                href="/profile"
                className="flex-center justify-start gap-x-1 py-2.5 text-xs xl:text-sm ml-auto pr-4 text-gray-700 hover:text-[#e90089] font-medium hover:bg-gray-50"
              >
                <div>
                  <BiBasket className="h-6 w-6 text-black ml-1.5" />
                </div>
                سفارش های من{' '}
              </Link>
            </div>
          </Menu.Item>
          <Menu.Item>
            <div className="transition-colors">
              <Link
                href="/profile"
                className="flex-center justify-start gap-x-1 py-2.5 text-xs xl:text-sm ml-auto pr-4 text-gray-700 hover:text-[#e90089] font-medium hover:bg-gray-50"
              >
                <div>
                  <BiHeart className="h-6 w-6 text-black ml-1.5" />
                </div>
                علاقه مندی ها{' '}
              </Link>
            </div>
          </Menu.Item>

          <LogoutButton isShowDropDown/>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default UserMenuDropdown
