import { GeneralSettingForm, LogoImagesForm } from '@/components/ads'
import { DesignItemForm, RedirectForm, StoreBrandForm, StoreCategoryForm } from '@/components/designs'
import { DashboardLayout } from '@/components/Layouts'
import DesignTabDashboardLayout from '@/components/Layouts/DesignTabDashboardLayout'
import { Button } from '@/components/ui'
import { useAppDispatch } from '@/hooks'
import {
  useDeleteDesignItemsMutation,
  useDeleteStoreCategoryMutation,
  useGetDesignItemsQuery,
  useGetGeneralSettingQuery,
  useGetLogoImagesQuery,
  useGetRedirectsQuery,
  useGetStoreCategoriesQuery,
  useUpsertDesignItemsMutation,
  useUpsertGeneralSettingMutation,
  useUpsertLogoImagesMutation,
  useUpsertRedirectsMutation,
  useUpsertStoreCategoriesMutation,
} from '@/services'
import { StoreCategoryBulkForm } from '@/services/design/types'
import { showAlert } from '@/store'
import { IDesignItemForm, IGeneralSettingForm, ILogosForm, IRedirect, IStoreCategory } from '@/types'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form'
const fetchImageAsFile = async (url: string): Promise<File> => {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      console.error(`Failed to fetch image from `)
    }
    const blob = await response.blob()
    const fileName = url.split('/').pop()
    return new File([blob], fileName || 'image.jpg', { type: blob.type })
  } catch (error) {
    console.error(`Failed to fetch image from ${url}:`, error)
    throw error
  }
}
interface FormData {
  designItems: IDesignItemForm[]
  redirects: IRedirect
}
const GeneralSettings: NextPage = () => {
  // asset
  const dispatch = useAppDispatch()

  const methods: UseFormReturn<FormData> = useForm<FormData>({
    defaultValues: {
      designItems: [],
      redirects: {},
    },
  })

  // ? State
  const [storeCategories, setStoreCategories] = useState<IStoreCategory[]>([])
  const [deletedStoreCategories, setDeletedStoreCategories] = useState<IStoreCategory[]>([])
  const [listItems, setListItems] = useState<IDesignItemForm[]>([])
  const [deletedDesignItems, setDeletedDesignItems] = useState<IDesignItemForm[]>([])

  // ? Query
  const {
    data: designItemsData,
    isLoading: isLoadingDesignItems,
    isError: isErrorDesignItems,
  } = useGetDesignItemsQuery()
  const { data: redirectData, isLoading: isLoadingRedirect, isError: isErrorRedirect } = useGetRedirectsQuery()
  // ? Upsert
  const [
    upsertRedirect,
    {
      isLoading: isUpsertLoadingRedirect,
      isSuccess: isUpsertSuccessRedirect,
      isError: isUpsertErrorRedirect,
      error: upsertRedirectError,
    },
  ] = useUpsertRedirectsMutation()
  const [
    upsertDesignItems,
    {
      isLoading: isUpsertDesignItemsSetting,
      isSuccess: isUpsertSuccessDesignItems,
      isError: isUpsertErrorDesignItems,
      error: upsertDesignItemsError,
    },
  ] = useUpsertDesignItemsMutation()

  // ? Delete
  const [
    deleteDesignItem,
    {
      isSuccess: isSuccessDelete,
      isError: isErrorDelete,
      error: errorDelete,
      data: dataDelete,
      isLoading: isLoadingDelete,
    },
  ] = useDeleteDesignItemsMutation()


  // ? SUBMIT From
  const onSubmit = async (data: FormData) => {
    console.log(data, 'data all')

    const promises = []
    // ? delete Design Items
    if (deletedDesignItems.length > 0) {
      promises.push(
        Promise.all(
          deletedDesignItems.map((deletedDesign) => {
            if (deletedDesign.id) {
              return deleteDesignItem(deletedDesign.id)
            }
          })
        )
      )
    }

    // redirects
    if (data.redirects) {
      const upsertRedirectPromise = (async () => {
        const upsertData: IRedirect = {
          id: data.redirects.id || undefined,
          articleId: data.redirects.articleId,
        }
        await upsertRedirect(upsertData)
      })()
      promises.push(upsertRedirectPromise)
    }

    // design items
    const upsertDesignItemsPromise = (async () => {
      if (data.designItems && data.designItems.length > 0) {
        const formSliderData = new FormData()
        data.designItems.forEach((designItem, index) => {
          if (designItem.id !== undefined && designItem.id !== '')
            formSliderData.append(`DesignItems[${index}].Id`, designItem.id)
          formSliderData.append(`DesignItems[${index}].Title`, designItem.title)
          formSliderData.append(`DesignItems[${index}].Thumbnail`, designItem.thumbnail!)
          formSliderData.append(`DesignItems[${index}].Link`, designItem.link)
          formSliderData.append(`DesignItems[${index}].Type`, designItem.type)
          formSliderData.append(`DesignItems[${index}].Index`, designItem.index.toString())
        })

        await upsertDesignItems(formSliderData)
      }
    })()
    promises.push(upsertDesignItemsPromise)

    await Promise.all(promises)
  }

  // load data
  useEffect(() => {
    const loadAllData = async () => {
      const listItems: IDesignItemForm[] = []

      if (designItemsData?.data) {
        await Promise.all(
          designItemsData.data.map(async (designItem) => {
            const imageFile = designItem.image ? await fetchImageAsFile(designItem.image.imageUrl) : null
            const item: IDesignItemForm = {
              id: designItem.id,
              thumbnail: imageFile,
              title: designItem.title,
              link: designItem.link,
              type: designItem.type,
              index: designItem.index,
              created: designItem.created,
              lastUpdated: designItem.lastUpdated,
            }

            if (designItem.type === 'lists') listItems.push(item)
          })
        )
      }

      setListItems(listItems)
      methods.reset({

        redirects: redirectData?.data || {},
      })
    }

    loadAllData()
  }, [designItemsData, redirectData, methods])

  //   handle success alert
  useEffect(() => {
    let alertMessage = 'بروزرسانی با موفقیت انجام شد'

    const errors = []

    if (isUpsertErrorDesignItems) {
      errors.push('به‌روزرسانی  فهرست')
    }
    if (isUpsertErrorRedirect) {
      errors.push('به‌روزرسانی ریدایرکت')
    }

    if (errors.length > 0) {
      alertMessage += ` (خطا در: ${errors.join(', ')})`
    }

    if (
      isUpsertSuccessRedirect ||
      isUpsertSuccessDesignItems ||
      isUpsertErrorRedirect ||
      isUpsertErrorDesignItems
    ) {
      dispatch(
        showAlert({
          status: errors.length > 0 ? 'warning' : 'success',
          title: alertMessage,
        })
      )
    }
  }, [
    isUpsertSuccessRedirect,
    isUpsertSuccessDesignItems,
    isUpsertErrorRedirect,
    isUpsertErrorDesignItems,
  ])

  const showAlertForMaxItems = (type: string) => {
    const title = type === 'lists' ? 'فهرست ها' : type === 'services' ? 'سرویس ها' : 'شبکه های اجتماعی'
    dispatch(
      showAlert({
        status: 'error',
        title: `حداکثر تعداد ${title} 6 عدد می‌باشد`,
      })
    )
  }

  const handleAddDesignItem = (type: string) => {
    let newItem: IDesignItemForm

    switch (type) {
      case 'lists':
        if (listItems.length === 6) {
          showAlertForMaxItems(type)
          return
        }
        newItem = {
          id: '',
          thumbnail: null,
          link: '',
          title: '',
          type: type,
          isActive: false,
          index: listItems.length,
          created: new Date().toISOString(),
        }
        setListItems([...listItems, newItem])
        break

      default:
        break
    }
  }
  const isFormSubmitting = isUpsertDesignItemsSetting || isUpsertLoadingRedirect
  return (
    <>
      <DashboardLayout>
        <DesignTabDashboardLayout>
          <Head>
            <title>مدیریت | دیزاین</title>
          </Head>
          <FormProvider {...methods}>
            <form className="space-y-5 mb-2 mx-3" onSubmit={methods.handleSubmit(onSubmit)}>
              <DesignItemForm
                type="lists"
                designItems={listItems}
                setDesignItems={setListItems}
                setDeletedDesignItems={setDeletedDesignItems}
                onAddDesignItem={() => handleAddDesignItem('lists')}
              />
              <RedirectForm />
              <div className="w-full flex justify-end mt-6">
                <Button
                  isLoading={isFormSubmitting}
                  type="submit"
                  className="bg-[#e90089] px-5 py-2.5 hover:bg-[#e90088bb]"
                  // disabled={isFormSubmitting}
                >
                  {'بروزسانی'}
                </Button>
              </div>
            </form>
          </FormProvider>
        </DesignTabDashboardLayout>
      </DashboardLayout>
    </>
  )
}

export default dynamic(() => Promise.resolve(GeneralSettings), { ssr: false })
