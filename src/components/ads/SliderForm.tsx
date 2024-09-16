import { ICategory, ISliderForm, ITextMarqueeForm } from '@/types'
import { profileFormSchema, textMarqueeSchema } from '@/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'

import { useFormContext, Controller } from 'react-hook-form'
import { Button, ControlledCheckbox } from '../ui'
import { useEffect, useState } from 'react'
import { MdClose } from 'react-icons/md'
import { useDeleteSliderMutation, useGetAllCategoriesQuery, useGetCategoriesTreeQuery } from '@/services'
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
interface SliderFormProps {
  sliders: ISliderForm[]
  setSliders: React.Dispatch<React.SetStateAction<ISliderForm[]>>
  setDeletedSliders: React.Dispatch<React.SetStateAction<ISliderForm[]>>
}

const SliderForm: React.FC<SliderFormProps> = ({ sliders, setSliders, setDeletedSliders }) => {
  const { control, setValue, getValues, watch } = useFormContext()

  const [allCategories, setAllCategories] = useState<ICategory[]>([])
  const dispatch = useAppDispatch()
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
    const slidersWithThumbnail = sliders.filter((slider) => slider.thumbnail !== null)
    setValue('sliders', slidersWithThumbnail)
  }, [sliders, setValue])

  const handleAddSlider = () => {
    if (sliders.length === 7) {
      dispatch(
        showAlert({
          status: 'error',
          title: 'حداکثر تعداد اسلایدر ها 7 عدد میباشد',
        })
      )
      return
    }
    setSliders([...sliders, { id: '', thumbnail: null, link: '', category: '', type: 'link', isActive: false }])
  }

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newSliders = [...sliders]
    const files = e.target.files

    if (files) {
      const validFiles: any[] = []
      const maxFileSize = 150 * 1024 // 150 KB
      const exactWidth = 1900
      const exactHeight = 600

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
              title: 'حجم عکس ها می بایست حداکثر 150 کیلوبایت باشد',
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
                title: 'سایز عکس ها می بایست 600*1900 پیکسل باشد',
              })
            )
          } else {
            validFiles.push(file)
            newSliders[index].thumbnail = file
            setSliders(newSliders)
          }
        }
      })
    } else {
      newSliders[index].thumbnail = null
      setSliders(newSliders)
    }
  }

  const handleInputChange = (index: number, name: string, value: string) => {
    const newSliders = [...sliders]
    newSliders[index].link = value
    setSliders(newSliders)
  }

  const handleRadioChange = (index: number, value: string) => {
    const newSliders = [...sliders]
    newSliders[index].type = value
    setSliders(newSliders)
  }

  // const handleDelete = (index: number, slider: ISliderForm) => {
  //   if (slider.id !== undefined && slider.id !== '') {
  //     deleteSlider(slider.id)
  //     setSliders((prevFiles) => {
  //       const updatedFiles = [...prevFiles]
  //       updatedFiles.splice(index, 1)
  //       return updatedFiles
  //     })
  //   } else {
  //     setSliders((prevFiles) => {
  //       const updatedFiles = [...prevFiles]
  //       updatedFiles.splice(index, 1)
  //       return updatedFiles
  //     })
  //   }
  // }
  const handleDelete = (index: number, slider: ISliderForm) => {
    if (slider.id) {
      setDeletedSliders((prevDeleted) => [...prevDeleted, slider])
    }
    setSliders((prevFiles) => {
      const updatedFiles = [...prevFiles]
      updatedFiles.splice(index, 1)
      return updatedFiles
    })
  }

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const selectedCategoryId = event.target.value
    const newSliders = [...sliders]
    newSliders[index].category = selectedCategoryId
    setSliders(newSliders)
  }

  return (
    <div className="flex flex-1">
      <div className="bg-white w-full rounded-md shadow-item">
        <div className="flex justify-between items-center border-b p-5 px-6">
          <h3 className=" text-gray-600 whitespace-nowrap">اسلایدر</h3>
          <div className="flex justify-end w-[260px] gap-4 items-center">
            <Button className=" px-5 py-2.5 bg-sky-500 hover:bg-sky-400" onClick={handleAddSlider}>
              {'افزودن '}
            </Button>
            <ControlledCheckbox name="slidersIsActive" control={control} label="وضعیت نمایش" inLabel />
          </div>
        </div>
        <div className="flex flex-col px-6 pb-10 pt-4">
          <div className="flex justify-end mb-4"></div>
          <div className="grid justify-center sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 ">
            {sliders.length === 0 ? (
              <div className="flex justify-center col-span-5">اسلایدر مورد نظر را اضافه کنید</div>
            ) : (
              sliders.map((slider, index) => (
                <div key={index} className="mb-4 border w-fit flex-1 rounded-lg shadow-item relative">
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 shadow-product bg-gray-50 hover:bg-red-600 hover:text-white p-1 rounded-full text-gray-500"
                    onClick={() => handleDelete(index, slider)}
                  >
                    <MdClose className="text-lg" /> {/* Add your delete icon here */}
                  </button>
                  <div className="flex flex-col items-start p-6">
                    <div className="flex items-center justify-center w-full mb-4">
                      <label
                        htmlFor={`file-${index}`}
                        className="flex justify-center items-center cursor-pointer text-sm font-normal"
                      >
                        {slider.thumbnail ? (
                          <img
                            src={URL.createObjectURL(slider.thumbnail)}
                            alt="Slider Item"
                            className="w-[225px] h-[125px] object-cover rounded-md"
                          />
                        ) : (
                          <img
                            className="w-[225px] h-[125px] rounded-md"
                            src="/images/other/product-placeholder.png"
                            alt="product-placeholder"
                          />
                        )}
                      </label>
                      <input
                        type="file"
                        id={`file-${index}`}
                        className="hidden"
                        onChange={(e) => handleFileChange(index, e)}
                        accept="image/jpeg"
                      />
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      {/* url link */}
                      <div className="flex gap-3 items-center">
                        <div className="flex items-center">
                          <input
                            className="focus:ring-1 cursor-pointer"
                            type="radio"
                            id={`linkSlider-${slider.id}`}
                            name={`type-${index}}`}
                            value="link"
                            checked={slider.type === 'link'}
                            onChange={() => handleRadioChange(index, 'link')}
                          />
                        </div>
                        <div className="relative w-full">
                          <input
                            type="text"
                            placeholder="پیوند"
                            value={slider.link}
                            onChange={(e) => handleInputChange(index, 'link', e.target.value)}
                            className={`peer m-0 block rounded-lg h-[50px] w-full border border-solid ${
                              slider.type !== 'link' ? 'bg-gray-50 border-gray-100' : 'border-gray-300'
                            } bg-clip-padding px-3 py-4 text-neutral-700 transition duration-200 ease-linear placeholder:text-transparent focus:border-primary focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-primary dark:border-neutral-400 dark:text-white dark:autofill:shadow-autofill dark:focus:border-primary dark:peer-focus:text-primary [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]`}
                            id="floatingInput"
                            disabled={slider.type !== 'link'}
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
                            id={`categorySlider-${slider.id}`}
                            name={`type-${index}}`}
                            value="category"
                            checked={slider.type === 'category'}
                            onChange={() => handleRadioChange(index, 'category')}
                          />
                        </div>
                        <div className="flex border w-full rounded-lg">
                          <select
                            className={`w-full h-[50px] cursor-pointer ${
                              slider.type !== 'category' ? 'bg-gray-50 border-gray-100' : 'border-gray-300'
                            } slider-selector text-sm focus:outline-none appearance-none border-none rounded-lg`}
                            name="انتخاب"
                            id=""
                            value={slider.category !== null ? slider.category : ''}
                            onChange={(e) => handleCategoryChange(e, index)}
                            disabled={slider.type !== 'category'}
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
              ))
            )}
          </div>
        </div>
        <div className="bg-gray-50 bottom-0 w-full rounded-b-lg px-8 flex flex-col pb-2">
          <span className="font-normal text-[11px] pt-2">سایز تصاویر میبایست 600*1900 پیکسل باشد</span>
          <span className="font-normal text-[11px]">حجم تصاویر میبایست حداکثر 150 کیلوبایت باشد</span>
          <span className="font-normal text-[11px]">فرمت عکس می بایست jpg باشد</span>
        </div>
      </div>
    </div>
  )
}

export default SliderForm
