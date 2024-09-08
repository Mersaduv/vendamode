import { useEffect, useRef, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { BiRightArrowAlt } from 'react-icons/bi'

import { logInSchema } from '@/utils'

import { DisplayError, LoginButton } from '@/components/ui'

import type { ILoginForm } from '@/types'
import Link from 'next/link'
import { digitsEnToFa } from '@persian-tools/persian-tools'
import React, { forwardRef } from 'react'
import { Control, FieldError, useController } from 'react-hook-form'
import { useGetRedirectsQuery } from '@/services'

interface Props {
  onSubmit: (data: ILoginForm) => void
  isLoading: boolean
}

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  classStyle?: string | null
  label?: string
  errors?: FieldError | undefined
  name: string
  control: Control<any>
}

const LoginForm: React.FC<Props> = (props) => {
  const { onSubmit, isLoading } = props

  const [stage, setStage] = useState<'mobileNumber' | 'password'>('mobileNumber')
  const { data: redirectData, isLoading: isLoadingRedirect, isError: isErrorRedirect } = useGetRedirectsQuery()

  const {
    handleSubmit,
    control,
    formState: { errors: formErrors },
    setFocus,
    trigger,
  } = useForm<ILoginForm>({
    resolver: yupResolver(logInSchema),
    defaultValues: { mobileNumber: '', password: '' },
  })

  const mobileNumberRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const handleMobileNumberSubmit = async () => {
    const isValid = await trigger('mobileNumber')
    if (isValid) {
      setStage('password')
    }
  }

  const handleBackToMobileNumber = () => {
    setStage('mobileNumber')
  }

  useEffect(() => {
    if (stage === 'mobileNumber') {
      setFocus('mobileNumber')
      mobileNumberRef.current?.focus()
    } else if (stage === 'password') {
      setFocus('password')
      passwordRef.current?.focus()
    }
  }, [stage, setFocus])

  return (
    <form className="space-y-0.5" onSubmit={handleSubmit(onSubmit)}>
      {stage === 'mobileNumber' && (
        <>
          <h2 className="text-gray-300 text-base text-center mb-8">شماره همراه خود را وارد کنید</h2>
          <TextField
            id="mobileNumber"
            control={control}
            errors={formErrors.mobileNumber}
            placeholder={digitsEnToFa('09...')}
            name="mobileNumber"
            classStyle="rounded-3xl shadow-lg"
            ref={mobileNumberRef}
            // type='number'
          />
          <LoginButton isLoading={isLoading} onClick={handleMobileNumberSubmit}>
            ادامه
          </LoginButton>
          <div className="pt-4 flex items-center w-full">
            <div className=" text-gray-800 text-sm flex">
              شرایط استفاده از{' '}
              <Link href={`/articles/${redirectData?.data?.slug}`} className="text-blue-400 text-sm mx-1">
                قوانین و حریم خصوصی{' '}
              </Link>{' '}
              وندامد را میپذیرم
            </div>
          </div>
        </>
      )}

      {stage === 'password' && (
        <>
          <h2 className="text-gray-300 text-base text-center mb-8">رمز خود را وارد کنید</h2>
          <button type="button" onClick={handleBackToMobileNumber}>
            <BiRightArrowAlt className="text-[#e90089]" size={34} />
          </button>
          <TextField
            control={control}
            errors={formErrors.password}
            type="password"
            placeholder="رمز عبور"
            name="password"
            classStyle="rounded-3xl"
            ref={passwordRef}
          />
          <LoginButton isLoading={isLoading}>ورود</LoginButton>

          <div className="pt-4 flex items-center">
            <p className="ml-1 inline text-gray-800 text-sm">رمز عبور رو فراموش کردی؟</p>
            <div className="text-blue-400 text-sm">فراموشی رمز عبور</div>
          </div>
        </>
      )}
    </form>
  )
}

const TextField = forwardRef<HTMLInputElement, FieldProps>((props, ref) => {
  const { classStyle, label, errors, name, type = 'text', control, ...restProps } = props

  const { field } = useController({ name, control, rules: { required: true } })

  const direction = /^[a-zA-Z0-9]+$/.test(field.value?.[0]) ? 'ltr' : 'ltr'
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    // فیلتر کردن کاراکترهای غیر عددی
    const filteredValue = inputValue.replace(/[^0-9۰-۹]/g, '')

    // تبدیل اعداد انگلیسی به فارسی
    const faInputValue = digitsEnToFa(filteredValue)

    field.onChange(faInputValue)
  }

  return (
    <div>
      {label && (
        <label className="mb-3 block text-xs text-gray-700 md:min-w-max lg:text-sm" htmlFor={name}>
          {label}
        </label>
      )}
      <input
        className={`block appearance-none focus:outline-none outline-none ring-0 focus:ring-0 w-full ${
          classStyle ? classStyle : 'rounded-md bg-zinc-100'
        } border border-gray-200  px-3 py-1.5 text-base outline-none transition-colors placeholder:text-center focus:border-[#ffb9e2] lg:text-lg`}
        style={{ direction }}
        id={name}
        type="tel"
        value={field?.value}
        name={field.name}
        onBlur={field.onBlur}
        onChange={onChangeHandler}
        ref={ref}
        {...restProps}
      />
      <DisplayError errors={errors} />
    </div>
  )
})

export default LoginForm
