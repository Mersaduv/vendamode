import { useEffect, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { BiRightArrowAlt } from 'react-icons/bi'

import { logInSchema } from '@/utils'

import { TextField, LoginButton } from '@/components/ui'

import type { ILoginForm } from '@/types'
import Link from 'next/link'

interface Props {
  onSubmit: (data: ILoginForm) => void
  isLoading: boolean
}

const LoginForm: React.FC<Props> = (props) => {
  const { onSubmit, isLoading } = props

  const [stage, setStage] = useState<'mobileNumber' | 'password'>('mobileNumber')

  const {
    handleSubmit,
    control,
    formState: { errors: formErrors },
    setFocus,
    getValues,
    trigger,
  } = useForm<ILoginForm>({
    resolver: yupResolver(logInSchema),
    defaultValues: { mobileNumber: '', password: '' },
  })

  useEffect(() => {
    setFocus('mobileNumber')
  }, [setFocus])

  const handleMobileNumberSubmit = async () => {
    const isValid = await trigger('mobileNumber')
    if (isValid) {
      setStage('password')
    }
  }

  const handleBackToMobileNumber = () => {
    setStage('mobileNumber')
  }

  return (
    <form className="space-y-0.5" onSubmit={handleSubmit(onSubmit)}>
      {stage === 'mobileNumber' && (
        <>
          <h2 className="text-gray-300 text-base text-center mb-8">شماره همراه خود را وارد کنید</h2>
          <TextField
            control={control}
            errors={formErrors.mobileNumber}
            placeholder="09..."
            name="mobileNumber"
            inputMode="numeric"
            classStyle="rounded-3xl shadow-lg"
          />
          <LoginButton isLoading={isLoading} onClick={handleMobileNumberSubmit}>
            ادامه
          </LoginButton>
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
          />
          <LoginButton isLoading={isLoading}>ورود</LoginButton>
          
          <div className='pt-4 flex items-center'>
            <p className="ml-1 inline text-gray-800 text-sm">رمز عبور رو فراموش کردی؟</p>
            <div className="text-blue-400 text-sm">
              فراموشی رمز عبور
            </div>
          </div>
        </>
      )}
    </form>
  )
}

export default LoginForm