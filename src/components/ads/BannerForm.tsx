import { IBannerForm, ICategory } from '@/types'

import { useFormContext } from 'react-hook-form'
import { ControlledCheckbox } from '../ui'
import { useEffect, useState } from 'react'
import { useGetAllCategoriesQuery, useGetCategoriesTreeQuery } from '@/services'
import { digitsEnToFa } from '@persian-tools/persian-tools'
import { useAppDispatch } from '@/hooks'
import { showAlert } from '@/store'
const extractChildCategories = (category: ICategory): ICategory[] => {
  let childCategories: ICategory[] = []
  if (category.childCategories && category.childCategories.length > 0) {
    category.childCategories.forEach((child) => {
      childCategories.push(child)
      childCategories = childCategories.concat(extractChildCategories(child))
    })
  }
  return childCategories
}
interface BannerFormProps {
  banners: IBannerForm[]
  setBanners: React.Dispatch<React.SetStateAction<IBannerForm[]>>
}

const BannerForm: React.FC<BannerFormProps> = ({ banners, setBanners }) => {
  const { control, setValue, getValues, watch } = useFormContext()
  const dispatch = useAppDispatch()

  const [allCategories, setAllCategories] = useState<ICategory[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)

  // ? Get Categories Query
  const { categoriesData } = useGetAllCategoriesQuery(
    { pageSize: 999999, isActive: true },
    {
      selectFromResult: ({ data }) => ({
        categoriesData: data?.data,
      }),
    }
  )
  useEffect(() => {
    if (selectedCategoryId) {
    }
  }, [selectedCategoryId])

  useEffect(() => {
    if (categoriesData) {
      let allCats: ICategory[] = []
      categoriesData.data?.forEach((category: ICategory) => {
        allCats.push(category)
        allCats = allCats.concat(extractChildCategories(category))
      })
      setAllCategories(allCats)
    }
  }, [categoriesData])

  useEffect(() => {
    const bannersWithThumbnail = banners.filter((banner) => banner.thumbnail !== null)
    setValue('banners', bannersWithThumbnail)
  }, [banners, setValue])

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    // const newBanners = [...banners]
    // if (e.target.files && e.target.files[0]) {
    //   console.log(e.target.files[0], 'e.target.files[0]', index, 'index')

    //   newBanners[index].thumbnail = e.target.files[0]
    // } else {
    //   newBanners[index].thumbnail = null
    // }
    // setBanners(newBanners)
    const newBanners = [...banners]
    const files = e.target.files

    if (files) {
      const validFiles: any[] = []
      const maxFileSize = 50 * 1024 // 50 KB

      let exactWidth: number
      let exactHeight: number

      switch (index) {
        case 0:
          exactWidth = 450
          exactHeight = 350
          break
        case 1:
        case 2:
          exactWidth = 900
          exactHeight = 350
          break
        default:
          exactWidth = 450
          exactHeight = 350
          break
      }

      Array.from(files).forEach((file) => {
        if (file.type !== 'image/jpeg') {
          dispatch(
            showAlert({
              status: 'error',
              title: 'فرمت عکس ها می بایست jpg باشد',
            })
          )
          return
        }

        if (file.size > maxFileSize) {
          dispatch(
            showAlert({
              status: 'error',
              title: 'حجم عکس ها می بایست حداکثر 50 کیلوبایت باشد',
            })
          )
          return
        }

        const img = new Image()
        img.src = URL.createObjectURL(file)

        img.onload = () => {
          URL.revokeObjectURL(img.src)

          if (img.width !== exactWidth || img.height !== exactHeight) {
            dispatch(
              showAlert({
                status: 'error',
                title: `سایز عکس ها می بایست ${exactHeight}*${exactWidth} پیکسل باشد`,
              })
            )
          } else {
            validFiles.push(file)
            newBanners[index].thumbnail = file
            setBanners(newBanners)
          }
        }
      })
    } else {
      newBanners[index].thumbnail = null
      setBanners(newBanners)
    }
  }

  const handleInputChange = (index: number, name: string, value: string) => {
    const newBanners = [...banners]
    newBanners[index].link = value
    setBanners(newBanners)
  }

  const handleRadioChange = (index: number, value: string) => {
    const newBanners = [...banners]
    newBanners[index].type = value
    setBanners(newBanners)
  }

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    setSelectedCategoryId(event.target.value)
    const newBanners = [...banners]
    newBanners[index].category = selectedCategoryId ?? ''
    setBanners(newBanners)
  }

  if (banners) {
  }
  return (
    <div className="flex flex-1">
      <div className="bg-white w-full rounded-md shadow-item">
        <div className="flex justify-between items-center border-b p-5 px-6">
          <h3 className=" text-gray-600 whitespace-nowrap">بنر تبلیغات</h3>
          <ControlledCheckbox name="bannersIsActive" control={control} label="وضعیت نمایش" />
        </div>
        <div className="flex flex-col px-6 pb-10 pt-4">
          <div className="grid justify-center sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 ">
            {banners.map((banner, index) => (
              <div key={index} className="mb-4 border w-fit flex-1 rounded-lg shadow-item relative">
                <div className="flex flex-col items-center p-6">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-lg font-normal mb-2">
                      {banner.index === 1
                        ? digitsEnToFa('350px * 450px')
                        : banner.index === 2
                        ? digitsEnToFa('350px * 900px')
                        : banner.index === 3
                        ? digitsEnToFa('350px * 900px')
                        : digitsEnToFa('350px * 450px')}
                    </span>
                    <div className="flex items-center justify-center w-full mb-4">
                      <label
                        htmlFor={`banner-file-${index}`}
                        className="flex justify-center items-center cursor-pointer text-sm font-normal"
                      >
                        {banner.thumbnail ? (
                          <img
                            src={URL.createObjectURL(banner.thumbnail)}
                            alt="banner Item"
                            className={`${
                              banner.index === 1 || banner.index === 4  ? 'w-[155px]' : 'w-[225px]'
                            } h-[125px] object-cover rounded-md`}
                          />
                        ) : (
                          <img
                            className={`${
                              banner.index === 1 || banner.index === 4  ? 'w-[155px]' : 'w-[225px]'
                            } h-[125px] rounded-md`}
                            src="/images/other/product-placeholder.png"
                            alt="product-placeholder"
                          />
                        )}
                      </label>
                      <input
                        type="file"
                        id={`banner-file-${index}`}
                        className="hidden"
                        onChange={(e) => handleFileChange(index, e)}
                        accept="image/jpeg"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    {/* url link */}
                    <div className="flex gap-3 items-center">
                      <div className="flex items-center">
                        <input
                          className="focus:ring-1 cursor-pointer"
                          type="radio"
                          id={`link-${banner.id}`}
                          name={`type-${banner.index}`}
                          value="link"
                          checked={banner.type === 'link'}
                          onChange={() => handleRadioChange(index, 'link')}
                        />
                      </div>
                      <div className="relative w-full">
                        <input
                          type="text"
                          placeholder="پیوند"
                          value={banner.link}
                          onChange={(e) => handleInputChange(index, 'link', e.target.value)}
                          className={`peer m-0 block rounded-lg h-[50px] w-full border border-solid ${
                            banner.type !== 'link' ? 'bg-gray-50 border-gray-100' : 'border-gray-300'
                          } bg-clip-padding px-3 py-4 text-neutral-700 transition duration-200 ease-linear placeholder:text-transparent focus:border-primary focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-primary dark:border-neutral-400 dark:text-white dark:autofill:shadow-autofill dark:focus:border-primary dark:peer-focus:text-primary [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]`}
                          id="floatingInput"
                          disabled={banner.type !== 'link'}
                        />
                        <label
                          htmlFor="floatingInput"
                          className="pointer-events-none absolute right-0 top-0 origin-[0_0] border border-solid border-transparent pr-3 pb-4 pt-3.5 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary"
                        >
                          پیوند
                        </label>
                      </div>
                    </div>
                    {/* category url */}
                    <div className="flex gap-3 items-center">
                      <div className="flex items-center">
                        <input
                          className="focus:ring-1 cursor-pointer"
                          type="radio"
                          id={`category-${banner.id}`}
                          name={`type-${banner.index}`}
                          value="category"
                          checked={banner.type === 'category'}
                          onChange={() => handleRadioChange(index, 'category')}
                        />
                      </div>
                      <div className="flex border w-full rounded-lg">
                        <select
                          className={`w-full h-[50px] cursor-pointer ${
                            banner.type !== 'category' ? 'bg-gray-50 border-gray-100' : 'border-gray-300'
                          } banner-selector text-sm focus:outline-none appearance-none border-none rounded-lg`}
                          name={`link-${banner.index}`}
                          id={`link-${banner.index}`}
                          value={banner.category !== null ? banner.category : ''}
                          onChange={(e) => handleCategoryChange(e, index)}
                          disabled={banner.type !== 'category'}
                        >
                          <option className="appearance-none text-sm" value="">
                          انتخاب دسته بندی
                          </option>
                          {allCategories?.map((category) => (
                            <option
                              key={category.id}
                              value={category.id}
                              className={category.level === 0 ? 'text-blue-600' : ''}
                            >
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-50 bottom-0 w-full rounded-b-lg px-8 flex flex-col pb-2">
          <span className="font-normal text-[11px] pt-2">
            حجم تصاویر میبایست حداکثر {digitsEnToFa(50)} کیلوبایت باشد
          </span>
          <span className="font-normal text-[11px]">فرمت عکس می بایست jpg باشد</span>
        </div>
      </div>
    </div>
  )
}

export default BannerForm
