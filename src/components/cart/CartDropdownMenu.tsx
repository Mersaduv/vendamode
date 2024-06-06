import { Fragment } from 'react'
import { useRouter } from 'next/router'

import { formatNumber } from '@/utils'

import { useDisclosure, useAppSelector } from '@/hooks'

import { Menu, Transition } from '@headlessui/react'
import { RedirectToLogin } from '@/components/modals'
import { CartIconBadge } from '@/components/cart'
import { ArrowLink, Button } from '@/components/ui'
import { Toman, EmptyCart } from '@/icons'

export default function CartDropdownMenu() {
  // ? Assets
  const { push } = useRouter()

  // ? Get UserInfo
  // const { userInfo } = useUserInfo()

  const [isShowRedirectModal, redirectModalHandlers] = useDisclosure()

  // ? Store
  // const { totalItems, cartItems, totalDiscount, totalPrice } = useAppSelector((state) => state.cart)

  // ? Handlers
  // const handleRoute = () => {
  //   if (!userInfo) return redirectModalHandlers.open()

  //   push('/checkout/shipping')
  // }

  // ? Render(s)
  return (
    <>
      {/* <RedirectToLogin
        title="شما هنوز وارد نشدید"
        text=""
        onClose={redirectModalHandlers.close}
        isShow={isShowRedirectModal}
      /> */}

      <Menu as="div" className="dropdown">
        <Menu.Button className="dropdown__button">
          <CartIconBadge />
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
          <Menu.Items
            className="dropdown__items w-[440px]
       "
          >
              <>
                <EmptyCart className="mx-auto h-44 w-44" />
                <p className="pt-2 text-center text-base font-bold">سبد خرید شما خالی است!</p>
              </>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  )
}
