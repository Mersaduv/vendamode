import React, { useEffect, useState } from 'react'
import { useForm, FormProvider, UseFormReturn } from 'react-hook-form'
import { ArticlesAdsForm, BannerForm, FooterBannerForm, SliderForm, TextMarqueeForm } from '../ads'
import { Button } from '../ui'
import {
  IArticleBannerForm,
  IArticleForm,
  IBannerForm,
  IFooterBannerForm,
  ISlider,
  ISliderForm,
  ITextMarqueeForm,
} from '@/types'
import {
  useDeleteSliderMutation,
  useGetAllArticleBannersQuery,
  useGetAllBannersQuery,
  useGetAllFooterBannersQuery,
  useGetAllSlidersQuery,
  useGetArticlesQuery,
  useGetHeaderTextQuery,
  useUpsertArticleBannerMutation,
  useUpsertBannerMutation,
  useUpsertFooterBannerMutation,
  useUpsertHeaderTextMutation,
  useUpsertSlidersMutation,
} from '@/services'
import { IHeaderText } from '@/types/IHeaderText.type'
import { ArticleBannerBulkForm } from '@/services/design/types'
import { HandleResponse } from '../shared'
import { useAppDispatch } from '@/hooks'
import { showAlert } from '@/store'
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
  sliders: ISliderForm[]
  slidersIsActive: boolean
  textMarquee: IHeaderText
  bannersIsActive: boolean
  footerBannersIsActive: boolean
  articleBannersIsActive: boolean
  articleBanners: IArticleBannerForm[]
  banners: IBannerForm[]
  footerBanners: IFooterBannerForm[]
}
const MainPageAdsForm: React.FC = () => {
  //states :
  const [sliders, setSliders] = useState<ISliderForm[]>([])
  const [deletedSliders, setDeletedSliders] = useState<ISliderForm[]>([])

  const [banners, setBanners] = useState<IBannerForm[]>([])
  const [articleBanners, setArticleBanners] = useState<IArticleBannerForm[]>([])
  const [footerBanner, setFooterBanner] = useState<IFooterBannerForm[]>([])
  const dispatch = useAppDispatch()
  // Queries
  const { data: headerTextData, isLoading: isLoadingHeaderText, isError: isErrorHeaderText } = useGetHeaderTextQuery()
  const { data: sliderData, isLoading: isLoadingSlider, isError: isErrorSlider } = useGetAllSlidersQuery()
  const { data: bannerData, isLoading: isLoadingBanner, isError: isErrorBanner } = useGetAllBannersQuery()
  const {
    data: articleBannerData,
    isLoading: isLoadingArticleBanner,
    isError: isErrorArticleBanner,
  } = useGetAllArticleBannersQuery()
  const {
    data: articleData,
    isLoading: isLoadingArticle,
    isError: isErrorArticle,
  } = useGetArticlesQuery({
    page: 1,
    pageSize: 99999,
  })

  const {
    data: footerBannerData,
    isLoading: isLoadingFooterBanner,
    isError: isErrorFooterBanner,
  } = useGetAllFooterBannersQuery()

  // Upsert
  const [
    upsertHeaderText,
    {
      isLoading: isUpsertLoadingHeaderText,
      isSuccess: isUpsertSuccessHeaderText,
      isError: isUpsertErrorHeaderText,
      error: upsertHeaderTextError,
    },
  ] = useUpsertHeaderTextMutation()

  const [
    upsertSlider,
    {
      isLoading: isUpsertLoadingSlider,
      isSuccess: isUpsertSuccessSlider,
      isError: isUpsertErrorSlider,
      error: upsertSliderError,
    },
  ] = useUpsertSlidersMutation()

  const [
    upsertBanner,
    {
      isLoading: isUpsertLoadingBanner,
      isSuccess: isUpsertSuccessBanner,
      isError: isUpsertErrorBanner,
      error: upsertBannerError,
    },
  ] = useUpsertBannerMutation()

  const [
    upsertArticleBanner,
    {
      isLoading: isUpsertLoadingArticleBanner,
      isSuccess: isUpsertSuccessArticleBanner,
      isError: isUpsertErrorArticleBanner,
      error: upsertArticleBannerError,
    },
  ] = useUpsertArticleBannerMutation()

  const [
    upsertFooterBanner,
    {
      isLoading: isUpsertLoadingFooterBanner,
      isSuccess: isUpsertSuccessFooterBanner,
      isError: isUpsertErrorFooterBanner,
      error: upsertFooterBannerError,
    },
  ] = useUpsertFooterBannerMutation()

  //*    Delete Slider
  const [
    deleteSlider,
    {
      isSuccess: isSuccessDelete,
      isError: isErrorDelete,
      error: errorDelete,
      data: dataDelete,
      isLoading: isLoadingDelete,
    },
  ] = useDeleteSliderMutation()

  const methods: UseFormReturn<FormData> = useForm<FormData>({
    defaultValues: {
      textMarquee: {
        id: '',
        name: '',
        isActive: false,
      },
      slidersIsActive: false,
      bannersIsActive: false,
      footerBannersIsActive: false,
      articleBannersIsActive: false,
      sliders: [],
      banners: [],
      articleBanners: [],
      footerBanners: [],
    },
  })

  useEffect(() => {
    if (banners.length === 0) {
      setBanners([
        { index: 1, id: '', thumbnail: null, link: '', category: '', type: 'link' },
        { index: 2, id: '', thumbnail: null, link: '', category: '', type: 'link' },
        { index: 3, id: '', thumbnail: null, link: '', category: '', type: 'link' },
        { index: 4, id: '', thumbnail: null, link: '', category: '', type: 'link' },
      ])
    }
  }, [banners])

  useEffect(() => {
    if (articleBanners.length === 0) {
      setArticleBanners([
        { index: 1, id: '', articleId: '', isActive: false },
        { index: 2, id: '', articleId: '', isActive: false },
        { index: 3, id: '', articleId: '', isActive: false },
        { index: 4, id: '', articleId: '', isActive: false },
      ])
    }
  }, [articleBanners])

  useEffect(() => {
    if (footerBanner.length === 0) {
      setFooterBanner([{ id: '', thumbnail: null, link: '', category: '', type: 'link', isActive: false }])
    }
  }, [sliders])

  // load data
  useEffect(() => {
    const loadAllData = async () => {
      if (
        headerTextData &&
        headerTextData.data &&
        sliderData &&
        sliderData.data &&
        bannerData &&
        bannerData.data &&
        footerBannerData &&
        footerBannerData.data &&
        articleBannerData &&
        articleBannerData.data
      ) {
        // Load slider images
        const slidersWithFiles = await Promise.all(
          sliderData.data.map(async (slider) => {
            const imageFile = await fetchImageAsFile(slider.image.imageUrl)
            return {
              id: slider.id,
              thumbnail: imageFile,
              category: slider.categoryId,
              link: slider.link,
              type: slider.type,
              isActive: slider.isActive,
            }
          })
        )

        // Load banner images
        const bannersWithFiles = await Promise.all(
          bannerData.data.map(async (banner) => {
            const imageFile = await fetchImageAsFile(banner.image.imageUrl)
            return {
              id: banner.id,
              index: banner.index,
              thumbnail: imageFile,
              category: banner.categoryId,
              link: banner.link,
              type: banner.type,
              isActive: banner.isActive,
            }
          })
        )

        // Load Article Banner
        const articleBanners = await Promise.all(
          articleBannerData.data.map(async (articleBanner) => {
            return {
              id: articleBanner.id,
              index: articleBanner.index,
              isActive: articleBanner.isActive,
              articleId: articleBanner.articleId,
            }
          })
        )

        // Load footer banner images
        const footerBannersWithFiles = await Promise.all(
          footerBannerData.data.map(async (banner) => {
            const imageFile = await fetchImageAsFile(banner.image.imageUrl)
            return {
              id: banner.id,
              thumbnail: imageFile,
              category: banner.categoryId,
              link: banner.link,
              type: banner.type,
              isActive: banner.isActive,
            }
          })
        )

        methods.reset({
          textMarquee: {
            id: headerTextData.data.id || '',
            name: headerTextData.data.name || '',
            isActive: headerTextData.data.isActive || false,
          },
          sliders: slidersWithFiles,
          slidersIsActive: sliderData.data.length > 0 && sliderData.data[0].isActive,
          banners: bannersWithFiles,
          bannersIsActive: bannerData.data.length > 0 && bannerData.data[0].isActive,
          footerBanners: footerBannersWithFiles,
          footerBannersIsActive: footerBannerData.data.length > 0 && footerBannerData.data[0].isActive,
          articleBanners: articleBanners,
          articleBannersIsActive: articleBannerData.data.length > 0 && articleBannerData.data[0].isActive,
        })
        console.log(articleBannerData, 'articleBannerData - load')

        setSliders(slidersWithFiles)
        // setBanners(bannersWithFiles)
        setArticleBanners((prev) => {
          return prev.map((defaultArticleBanner) => {
            const newArticleBanner = articleBanners.find(
              (articleBanner) => articleBanner.index === defaultArticleBanner.index
            )
            return newArticleBanner ? newArticleBanner : defaultArticleBanner
          })
        })

        setBanners((prevBanners) =>
          prevBanners.map((defaultBanner) => {
            const newBanner = bannersWithFiles.find((banner) => banner.index === defaultBanner.index)
            return newBanner ? newBanner : defaultBanner
          })
        )
        setFooterBanner(footerBannersWithFiles)
      }
    }

    loadAllData()
  }, [headerTextData, sliderData, bannerData, footerBannerData, methods])

  const onSubmit = async (data: FormData) => {
    console.log(data, 'data all')
    // sliders items
    if (deletedSliders.length > 0) {
      await Promise.all(
        deletedSliders.map((slider) => {
          if (slider.id) {
            return deleteSlider(slider.id)
          }
        })
      )
    }
    if (data.sliders && data.sliders.length > 0) {
      console.log(data.sliders, 'data.sliders')
      const formSliderData = new FormData()
      data.sliders.forEach((slider, index) => {
        if (slider.id !== undefined && slider.id !== '') formSliderData.append(`Sliders[${index}].Id`, slider.id)
        if (slider.category != null) {
          formSliderData.append(`Sliders[${index}].CategoryId`, slider.category)
        }
        formSliderData.append(`Sliders[${index}].Thumbnail`, slider.thumbnail!)
        formSliderData.append(`Sliders[${index}].Link`, slider.link)
        formSliderData.append(`Sliders[${index}].Type`, slider.type)
        formSliderData.append(`Sliders[${index}].IsActive`, data.slidersIsActive.toString())
      })

      upsertSlider(formSliderData)
    }
    // text header
    if (data.textMarquee) {
      const upsertData = {
        id: data.textMarquee.id || undefined,
        name: data.textMarquee.name,
        isActive: data.textMarquee.isActive,
      }
      upsertHeaderText(upsertData)
    }

    // banner items
    if (data.banners && data.banners.length > 0) {
      console.log(data.banners, 'data.banners')
      const formBannerData = new FormData()
      data.banners.forEach((banner, index) => {
        if (banner.id !== undefined && banner.id !== '') formBannerData.append(`Banners[${index}].Id`, banner.id)
        if (banner.category !== null) formBannerData.append(`Banners[${index}].CategoryId`, banner.category)
        formBannerData.append(`Banners[${index}].Index`, banner.index.toString())
        formBannerData.append(`Banners[${index}].Thumbnail`, banner.thumbnail!)
        formBannerData.append(`Banners[${index}].Link`, banner.link)
        formBannerData.append(`Banners[${index}].Type`, banner.type)
        formBannerData.append(`Banners[${index}].IsActive`, data.bannersIsActive.toString())
      })

      upsertBanner(formBannerData)
    }

    // articleBanners items
    if (data.articleBanners && data.articleBanners.length > 0) {
      const articleBanners: IArticleBannerForm[] = data.articleBanners.map((articleBanner, index) => ({
        id: articleBanner.id || undefined,
        articleId: articleBanner.articleId || undefined,
        index: articleBanner.index,
        isActive: data.articleBannersIsActive,
      }))

      const jsonData: ArticleBannerBulkForm = {
        articleBanners: articleBanners,
      }

      upsertArticleBanner(jsonData)
    }

    // banner items
    if (data.footerBanners && data.footerBanners.length > 0) {
      console.log(data.footerBanners, 'data.footerBanners')

      var banner = data.footerBanners
      const formFooterBannerData = new FormData()
      if (banner[0].id !== undefined) formFooterBannerData.append('Id', banner[0].id)
      if (banner[0].category !== null && banner[0].id !== '') {
        formFooterBannerData.append('CategoryId', banner[0].category)
      }
      formFooterBannerData.append('Thumbnail', banner[0].thumbnail!)
      formFooterBannerData.append('Link', banner[0].link)
      formFooterBannerData.append('Type', banner[0].type)
      formFooterBannerData.append('IsActive', data.footerBannersIsActive.toString())

      upsertFooterBanner(formFooterBannerData)
    }
  }
  // handle success alert
  useEffect(() => {
    let alertMessage = 'عملیات بروزرسانی با موفقیت انجام شد'

    const errors = []

    if (isUpsertErrorHeaderText) {
      errors.push('به‌روزرسانی متن هدر')
    }
    if (isUpsertErrorSlider) {
      errors.push('به‌روزرسانی اسلایدر')
    }
    if (isUpsertErrorBanner) {
      errors.push('به‌روزرسانی بنر')
    }
    if (isUpsertErrorFooterBanner) {
      errors.push('به‌روزرسانی بنر فوتر')
    }
    if (isUpsertErrorArticleBanner) {
      errors.push('به‌روزرسانی بنر مقاله')
    }

    if (errors.length > 0) {
      alertMessage += ` (خطا در: ${errors.join(', ')})`
    }

    if (
      isUpsertSuccessHeaderText ||
      isUpsertSuccessSlider ||
      isUpsertSuccessBanner ||
      isUpsertSuccessFooterBanner ||
      isUpsertSuccessArticleBanner
    ) {
      dispatch(
        showAlert({
          status: errors.length > 0 ? 'warning' : 'success',
          title: alertMessage,
        })
      )
    }
  }, [
    isUpsertSuccessHeaderText,
    isUpsertSuccessSlider,
    isUpsertSuccessBanner,
    isUpsertSuccessFooterBanner,
    isUpsertSuccessArticleBanner,
    isUpsertErrorHeaderText,
    isUpsertErrorSlider,
    isUpsertErrorBanner,
    isUpsertErrorFooterBanner,
    isUpsertErrorArticleBanner,
  ])

  return (
    <>
      <FormProvider {...methods}>
        <form className="space-y-5 mb-2 mx-3" onSubmit={methods.handleSubmit(onSubmit)}>
          {/* 1. متن متحرک */}
          <TextMarqueeForm />
          {/* 2. اسلایدر اصلی */}
          <SliderForm sliders={sliders} setSliders={setSliders} setDeletedSliders={setDeletedSliders} />
          {/* 3.  بنر*/}
          <BannerForm banners={banners} setBanners={setBanners} />
          {/* 4.بنر مقالات  */}
          <ArticlesAdsForm articleBanners={articleBanners} setArticleBanners={setArticleBanners} />
          {/* 5. بنر فوتر  */}
          <FooterBannerForm banners={footerBanner} setBanners={setFooterBanner} />
          <div className="w-full flex justify-end mt-6">
            <Button type="submit" className="bg-[#e90089] px-5 py-2.5 hover:bg-[#e90088bb]">
              {'بروزسانی'}
            </Button>
          </div>
        </form>
      </FormProvider>

      {/* {(isUpsertSuccessHeaderText || isUpsertErrorHeaderText) && (
        <HandleResponse
          isError={isUpsertErrorHeaderText}
          isSuccess={isUpsertSuccessHeaderText}
          error={upsertHeaderTextError}
          onSuccess={() => {
            // هر کار دیگری که پس از موفقیت‌آمیز بودن عملیات می‌خواهید انجام دهید
          }}
        />
      )}

      {(isUpsertSuccessSlider || isUpsertErrorSlider) && (
        <HandleResponse
          isError={isUpsertErrorSlider}
          isSuccess={isUpsertSuccessSlider}
          error={upsertSliderError}
          message={isUpsertSuccessSlider ? 'اسلایدر با موفقیت بروزرسانی شد!' : undefined}
          onSuccess={() => {
            // هر کار دیگری که پس از موفقیت‌آمیز بودن عملیات می‌خواهید انجام دهید
          }}
        />
      )} */}
    </>
  )
}

export default MainPageAdsForm
