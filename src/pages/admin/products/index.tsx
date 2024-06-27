import type { NextPage } from 'next'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDisclosure, useChangeRoute } from '@/hooks'
import { ICategory } from '@/types'
import { DashboardLayout } from '@/components/Layouts'

export interface SelectedCategories {
  levelOne?: ICategory
  levelTwo?: ICategory
  levelThree?: ICategory
}
const Products: NextPage = () => {
  // ? Assets
  const { query, push } = useRouter()
  const page = query.page ? +query.page : 1
  const category = (query.category as string) ?? ''

  const initialSelectedCategories = {
    levelOne: {} as ICategory,
    levelTwo: {} as ICategory,
    levelThree: {} as ICategory,
  }

  return (
    <main>
      <Head>
        <title>مدیریت | محصولات</title>
      </Head>
      <DashboardLayout>
        <section>
            محصولات
        </section>
      </DashboardLayout>
    </main>
  )
}

export default dynamic(() => Promise.resolve(Products), { ssr: false })