import React, { useEffect } from 'react'
import { Close } from '@/icons'

interface ModalProps {
  isShow: boolean
  onClose: () => void
  effect: 'bottom-to-fix' | 'bottom-to-top' | 'ease-out' | 'buttom-to-fit'  | 'bottom-to-top-scale'
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = (props) => {
  // ? Porps
  const { isShow, onClose, effect, children } = props

  // ? Re-Renders
  //* abort to scroll
  useEffect(() => {
    document.body.style.overflow = isShow ? 'hidden' : 'unset'
  }, [isShow])

  //* close modal on press Escape
  useEffect(() => {
    const closeModalOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isShow) {
      document.addEventListener('keydown', closeModalOnEscape)
    }

    return () => {
      document.removeEventListener('keydown', closeModalOnEscape)
    }
  }, [isShow, onClose])

  // ? Styles
  const effectClasses =
  effect === 'bottom-to-top-scale' ? `  ${isShow ? 'bottom-0 md:top-20' : '-bottom-full md:top-60'} w-full h-full  md:h-fit md:max-w-6xl 
   fixed transition-all duration-700 left-0 right-0 mx-auto`
   : 'bottom-to-top'
      ? `
  ${isShow ? 'bottom-0 md:top-20' : '-bottom-full md:top-60'} w-full h-full  md:h-fit md:max-w-3xl 
   fixed transition-all duration-700 left-0 right-0 mx-auto`
      : effect === 'ease-out'
      ? `
  ${isShow ? 'top-40 transform scale-100' : 'top-40 transform scale-50 '} max-w-3xl 
   fixed transition-all duration-700 left-0 right-0 mx-auto`
      : effect === 'buttom-to-fit'
      ? `
  ${isShow ? 'bottom-0' : '-bottom-full'} w-full h-fit lg:max-w-3xl 
   fixed transition-all duration-700 left-0 right-0 mx-auto`
      : ''

  // ? Render(s)
  return (
    <div
      className={`z-[110] ${
        isShow ? 'visible opacity-100' : 'invisible opacity-0 '
      } fixed inset-0 z-[100] transition-all duration-500`}
    >
      <div className="h-screen w-screen bg-gray-400/20" onClick={onClose} />
      <div className={effectClasses}>
        {React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? // eslint-disable-next-line no-use-before-define
              React.cloneElement(child as React.ReactElement<ContentProps>, {
                onClose,
              })
            : child
        )}
      </div>
    </div>
  )
}

interface ContentProps {
  onClose: () => void
  children: React.ReactNode
  className?: string
}
const Content: React.FC<ContentProps> = (props) => {
  // ? Props
  const { onClose, children, ...restProps } = props

  // ? Render(s)
  return (
    <div {...restProps}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<ContentProps>, {
              onClose,
            })
          : child
      )}
    </div>
  )
}

interface HeaderProps {
  onClose: () => void
  notBar?: boolean
  children: React.ReactNode
}

const Header: React.FC<HeaderProps> = (props) => {
  // ? Props
  const { onClose, children, notBar } = props

  // ? Render(s)
  if (notBar)
    return (
      <div
        onClick={onClose}
        className="text-base pt-2 flex items-center justify-between md:text-xl md:font-medium  font-normal border-b px-5 pb-3"
      >
        {children}
        <button type='button' onClick={onClose} className="">
          <Close className="icon " />
        </button>
      </div>
    )

  return (
    <div className="flex items-center justify-between border bg-[#fdebf6]  border-[#e90089] py-3.5 px-3 rounded-md">
      <span className="text-sm font-normal text-[#e90089]">{children}</span>
      <button onClick={onClose} className="">
        <Close className="icon text-[#e90089]" />
      </button>
    </div>
  )
}

interface BodyProps {
  children: React.ReactNode
}

const Body: React.FC<BodyProps> = ({ children }) => {
  return <div className="flex justify-center">{children}</div>
}

const _default = Object.assign(Modal, {
  Modal,
  Content,
  Header,
  Body,
})

export default _default
