import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Head from 'next/head'

import { SubmitHandler } from 'react-hook-form'

import { useLoginMutation } from '@/services'

import Logo from '../../../../public/logo/Logo.png'
import { LoginForm } from '@/components/form'
import { HandleResponse } from '@/components/shared'

import type { ILoginForm } from '@/types'
import Image from 'next/image'

function LoginPage() {
  // ? Assets
  const { replace, query } = useRouter()

  // ? Login User
  const [login, { data, isSuccess, isError, isLoading, error }] = useLoginMutation()

  // ? Handlers
  const submitHander: SubmitHandler<ILoginForm> = ({ mobileNumber, password }) => {
    login({ mobileNumber, password })
  }

  const onSuccess = () => replace(query?.redirectTo?.toString() || '/')

  // ? Render(s)
  return (
    <>
      {/*  Handle Login Response */}
      {(isSuccess || isError) && (
        <HandleResponse
          isError={isError}
          isSuccess={isSuccess}
          error={error}
          message={data?.message}
          onSuccess={onSuccess}
        />
      )}
      <main className="grid min-h-screen items-center">
        <Head>
          <title>وندامود | ورود</title>
        </Head>
        <section className="container max-w-xl space-y-6 px-12 py-6 lg:rounded-lg lg:border-gray-100">
          <Link className="flex justify-center" passHref href="/">
            <img width={280} src={'/logo/Logo.png'} alt="Venda Mode" />
          </Link>

          <LoginForm isLoading={isLoading} onSubmit={submitHander} />
        </section>
      </main>
    </>
  )
}

export default dynamic(() => Promise.resolve(LoginPage), { ssr: false })
