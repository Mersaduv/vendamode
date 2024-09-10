import { GeneralSettingForm, LogoImagesForm } from '@/components/ads'
import { AdditionalForm, CopyrightForm, DesignItemForm, SloganFooterForm, SupportForm } from '@/components/designs'
import { DashboardLayout } from '@/components/Layouts'
import DesignTabDashboardLayout from '@/components/Layouts/DesignTabDashboardLayout'
import { Button } from '@/components/ui'
import { useAppDispatch } from '@/hooks'
import {
  useDeleteColumnFooterMutation,
  useDeleteDesignItemsMutation,
  useGetColumnFootersQuery,
  useGetCopyrightQuery,
  useGetDesignItemsQuery,
  useGetGeneralSettingQuery,
  useGetLogoImagesQuery,
  useGetSloganFooterQuery,
  useGetSupportQuery,
  useUpsertColumnFooterMutation,
  useUpsertCopyrightMutation,
  useUpsertDesignItemsMutation,
  useUpsertGeneralSettingMutation,
  useUpsertLogoImagesMutation,
  useUpsertSloganFooterMutation,
  useUpsertSupportMutation,
} from '@/services'
import { ColumnFooterBulkForm } from '@/services/design/types'
import { showAlert } from '@/store'
import {
  IColumnFooter,
  ICopyright,
  IDesignItemForm,
  IGeneralSettingForm,
  ILogosForm,
  ISloganFooter,
  ISupport,
} from '@/types'
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
  sloganFooter: ISloganFooter
  support: ISupport
  columnFooters: IColumnFooter[]
  copyright: ICopyright
}
const Footer: NextPage = () => {
  // asset
  const dispatch = useAppDispatch()

  const methods: UseFormReturn<FormData> = useForm<FormData>({
    defaultValues: {
      designItems: [],
      sloganFooter: {},
      support: {},
      columnFooters: [],
      copyright: {},
    },
  })

  // Queries
  const {
    data: designItemsData,
    isLoading: isLoadingDesignItems,
    isError: isErrorDesignItems,
  } = useGetDesignItemsQuery()
  const {
    data: sloganFooterData,
    isLoading: isLoadingSloganFooter,
    isError: isErrorSloganFooter,
  } = useGetSloganFooterQuery()

  const { data: supportData, isLoading: isLoadingSupport, isError: isErrorSupport } = useGetSupportQuery()
  const { data: copyrightData, isLoading: isLoadingCopyright, isError: isErrorCopyright } = useGetCopyrightQuery()
  const {
    data: columnFootersData,
    isLoading: isLoadingColumnFooter,
    isError: isErrorColumnFooter,
  } = useGetColumnFootersQuery()

  // ? State
  const [serviceItems, setServiceItems] = useState<IDesignItemForm[]>([])
  const [socialMediaItems, setSocialMediaItems] = useState<IDesignItemForm[]>([])
  const [deletedDesignItems, setDeletedDesignItems] = useState<IDesignItemForm[]>([])
  const [columnFooters, setColumnFooters] = useState<IColumnFooter[]>([])
  const [deletedColumnFooter, setDeletedColumnFooter] = useState<IColumnFooter[]>([])
  // ? Upsert
  const [
    upsertDesignItems,
    {
      isLoading: isUpsertLoadingDesignItemsSetting,
      isSuccess: isUpsertSuccessDesignItems,
      isError: isUpsertErrorDesignItems,
      error: upsertDesignItemsError,
    },
  ] = useUpsertDesignItemsMutation()

  const [
    upsertSupport,
    {
      isLoading: isUpsertLoadingSupport,
      isSuccess: isUpsertSuccessSupport,
      isError: isUpsertErrorSupport,
      error: upsertSupportError,
    },
  ] = useUpsertSupportMutation()

  const [
    upsertColumnFooter,
    {
      isLoading: isUpsertLoadingColumnFooter,
      isSuccess: isUpsertSuccessColumnFooter,
      isError: isUpsertErrorColumnFooter,
      error: upsertColumnFooterError,
    },
  ] = useUpsertColumnFooterMutation()

  const [
    upsertCopyright,
    {
      isLoading: isUpsertLoadingCopyright,
      isSuccess: isUpsertSuccessCopyright,
      isError: isUpsertErrorCopyright,
      error: upsertCopyrightError,
    },
  ] = useUpsertCopyrightMutation()

  const [
    upsertSloganFooter,
    {
      isLoading: isUpsertLoadingSloganFooter,
      isSuccess: isUpsertSuccessSloganFooter,
      isError: isUpsertErrorSloganFooter,
      error: upsertSloganFooterError,
    },
  ] = useUpsertSloganFooterMutation()

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
  const [
    deleteColumnFooter,
    {
      isSuccess: isSuccessColumnFooterDelete,
      isError: isErrorColumnFooterDelete,
      error: errorColumnFooterDelete,
      data: dataColumnFooterDelete,
      isLoading: isLoadingColumnFooterDelete,
    },
  ] = useDeleteColumnFooterMutation()

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
    // ? delete Column Footer
    if (deletedColumnFooter.length > 0) {
      promises.push(
        Promise.all(
          deletedColumnFooter.map((deletedColumnFooterItem) => {
            if (deletedColumnFooterItem.id) {
              return deleteColumnFooter(deletedColumnFooterItem.id)
            }
          })
        )
      )
    }

    //  columnFooters
    if (data.columnFooters && data.columnFooters.length > 0) {
      const upsertColumnFooterPromise = (async () => {
        const columnFooters: IColumnFooter[] = data.columnFooters.map((columnFooter, index) => ({
          id: columnFooter.id || undefined,
          name: columnFooter.name,
          index: columnFooter.index,
          footerArticleColumn: columnFooter.footerArticleColumn,
        }))

        const jsonData: ColumnFooterBulkForm = {
          columnFooters: columnFooters,
        }

        await upsertColumnFooter(jsonData)
      })()
      promises.push(upsertColumnFooterPromise)
    }

    // copyright
    if (data.copyright) {
      const upsertCopyrightPromise = (async () => {
        const upsertData: ICopyright = {
          id: data.copyright.id || undefined,
          name: data.copyright.name,
        }
        await upsertCopyright(upsertData)
      })()
      promises.push(upsertCopyrightPromise)
    }

    // support
    if (data.support) {
      const upsertSupportPromise = (async () => {
        const upsertData: ISupport = {
          id: data.support.id || undefined,
          contactAndSupport: data.support.contactAndSupport,
          responseTime: data.support.responseTime,
          address: data.support.address,
        }
        await upsertSupport(upsertData)
      })()
      promises.push(upsertSupportPromise)
    }

    // slogan Footer
    if (data.sloganFooter) {
      const upsertSloganFooterPromise = (async () => {
        const upsertData: ISloganFooter = {
          id: data.sloganFooter.id || undefined,
          headline: data.sloganFooter.headline,
          introductionText: data.sloganFooter.introductionText,
        }
        await upsertSloganFooter(upsertData)
      })()
      promises.push(upsertSloganFooterPromise)
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
      const serviceItems: IDesignItemForm[] = []
      const socialMediaItems: IDesignItemForm[] = []

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

            if (designItem.type === 'services') serviceItems.push(item)
            else if (designItem.type === 'socialMedia') socialMediaItems.push(item)
          })
        )
      }

      setServiceItems(serviceItems)
      setSocialMediaItems(socialMediaItems)
      if (columnFootersData?.data) {
        setColumnFooters(columnFootersData.data)
      }

      methods.reset({
        sloganFooter: sloganFooterData?.data || {},
        support: supportData?.data || {},
        copyright: copyrightData?.data || {},
        columnFooters: columnFootersData?.data || [],
      })
    }

    loadAllData()
  }, [sloganFooterData, supportData, designItemsData, copyrightData, columnFootersData, methods])

  // handle success alert
  useEffect(() => {
    let alertMessage = ' بروزرسانی با موفقیت انجام شد'

    const errors = []

    if (isUpsertErrorSloganFooter) {
      errors.push('به‌روزرسانی شعار فوتر')
    }

    if (isUpsertErrorSupport) {
      errors.push('به‌روزرسانی تماس و پشتیبانی')
    }

    if (isUpsertErrorDesignItems) {
      errors.push('به‌روزرسانی سرویس ها یا شبکه های اجتماعی')
    }
    if (isUpsertErrorCopyright) {
      errors.push('به‌روزرسانی در کپی رایت')
    }

    if (isUpsertErrorColumnFooter) {
      errors.push('به‌روزرسانی ستون های فوتر')
    }

    if (errors.length > 0) {
      alertMessage += ` (خطا در: ${errors.join(', ')})`
    }

    if (
      isUpsertSuccessSloganFooter ||
      isUpsertSuccessSupport ||
      isUpsertSuccessDesignItems ||
      isUpsertSuccessCopyright ||
      isUpsertSuccessColumnFooter ||
      isUpsertErrorSloganFooter ||
      isUpsertErrorSupport ||
      isUpsertErrorDesignItems ||
      isUpsertErrorCopyright ||
      isUpsertErrorColumnFooter
    ) {
      dispatch(
        showAlert({
          status: errors.length > 0 ? 'warning' : 'success',
          title: alertMessage,
        })
      )
    }
  }, [
    isUpsertSuccessSloganFooter,
    isUpsertSuccessSupport,
    isUpsertSuccessDesignItems,
    isUpsertSuccessCopyright,
    isUpsertSuccessColumnFooter,
    isUpsertErrorSloganFooter,
    isUpsertErrorSupport,
    isUpsertErrorDesignItems,
    isUpsertErrorCopyright,
    isUpsertErrorColumnFooter,
  ])

  useEffect(() => {
    if (columnFooters.length === 0) {
      setColumnFooters([
        { index: 1, id: '', name: '', footerArticleColumn: [] },
        { index: 2, id: '', name: '', footerArticleColumn: [] },
        { index: 3, id: '', name: '', footerArticleColumn: [] },
        { index: 4, id: '', name: '', footerArticleColumn: [] },
      ])
    }
  }, [columnFooters])

  const handleAddDesignItem = (type: string) => {
    let newItem: IDesignItemForm

    switch (type) {
      case 'services':
        if (serviceItems.length === 6) {
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
          index: serviceItems.length,
          created: new Date().toISOString(),
        }
        setServiceItems([...serviceItems, newItem])
        break

      case 'socialMedia':
        if (socialMediaItems.length === 6) {
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
          index: socialMediaItems.length,
          created: new Date().toISOString(),
        }
        setSocialMediaItems([...socialMediaItems, newItem])
        break

      default:
        break
    }
  }

  const showAlertForMaxItems = (type: string) => {
    const title = type === 'lists' ? 'فهرست ها' : type === 'services' ? 'سرویس ها' : 'شبکه های اجتماعی'
    dispatch(
      showAlert({
        status: 'error',
        title: `حداکثر تعداد ${title} 6 عدد می‌باشد`,
      })
    )
  }

  const isFormSubmitting =
    isUpsertLoadingSloganFooter ||
    isUpsertLoadingSupport ||
    isUpsertLoadingDesignItemsSetting ||
    isUpsertLoadingCopyright

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
                type="services"
                designItems={serviceItems}
                setDesignItems={setServiceItems}
                setDeletedDesignItems={setDeletedDesignItems}
                onAddDesignItem={() => handleAddDesignItem('services')}
              />
              <DesignItemForm
                type="socialMedia"
                designItems={socialMediaItems}
                setDesignItems={setSocialMediaItems}
                setDeletedDesignItems={setDeletedDesignItems}
                onAddDesignItem={() => handleAddDesignItem('socialMedia')}
              />
              <SloganFooterForm />

              <SupportForm />

              <AdditionalForm
                columnFooters={columnFooters}
                setColumnFooter={setColumnFooters}
                setDeletedColumnFooter={setDeletedColumnFooter}
              />

              <CopyrightForm />
              <div className="flex justify-end">
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

export default dynamic(() => Promise.resolve(Footer), { ssr: false })
