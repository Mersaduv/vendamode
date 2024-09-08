import { IDesignItemForm } from '@/types'
import { useFormContext } from 'react-hook-form'
import { Button } from '../ui'
import { MdClose } from 'react-icons/md'
import { useAppDispatch } from '@/hooks'
import { showAlert } from '@/store'
import { useEffect } from 'react'

interface Props {
  type: string
  designItems: IDesignItemForm[]
  setDesignItems: React.Dispatch<React.SetStateAction<IDesignItemForm[]>>
  setDeletedDesignItems: React.Dispatch<React.SetStateAction<IDesignItemForm[]>>
  onAddDesignItem: () => void
}

const DesignItemForm: React.FC<Props> = ({
  designItems,
  setDeletedDesignItems,
  setDesignItems,
  type,
  onAddDesignItem,
}) => {
  const { control, setValue, getValues, watch } = useFormContext()
  // ? Assets
  const dispatch = useAppDispatch()

  useEffect(() => {
    const currentDesignItems = getValues('designItems') || []

    const updatedDesignItems = [
      ...currentDesignItems.filter((item: IDesignItemForm) => item.type !== type),
      ...designItems.filter((designItem) => designItem.thumbnail !== null),
    ]

    setValue('designItems', updatedDesignItems)
  }, [designItems, setValue, type, getValues])

  const handleDelete = (index: number, designItem: IDesignItemForm) => {
    if (designItem.id) {
      setDeletedDesignItems((prevDeleted) => [...prevDeleted, designItem])
    }
    setDesignItems((prevFiles) => {
      const updatedFiles = [...prevFiles]
      updatedFiles.splice(index, 1)
      return updatedFiles
    })
  }

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newDesignItems = [...designItems]
    const files = e.target.files

    if (files) {
      const validFiles: any[] = []

      // تعیین مقادیر پیش‌فرض
      let maxFileSize = 15 * 1024 // 15 کیلوبایت
      let exactWidth = 50
      let exactHeight = 50

      // بررسی نوع آیتم
      if (newDesignItems[index].type === 'services') {
        maxFileSize = 60 * 1024 // 60 کیلوبایت
        exactWidth = 250
        exactHeight = 250
      }

      Array.from(files).forEach((file) => {
        if (file.type !== 'image/png') {
          dispatch(
            showAlert({
              status: 'error',
              title: 'فرمت عکس ها می بایست png باشد',
            })
          )
          return
        }

        if (file.size > maxFileSize) {
          dispatch(
            showAlert({
              status: 'error',
              title: `حجم عکس ها می بایست حداکثر ${maxFileSize / 1024} کیلوبایت باشد`,
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
                title: `سایز عکس ها می بایست ${exactWidth}*${exactHeight} پیکسل باشد`,
              })
            )
          } else {
            validFiles.push(file)
            newDesignItems[index].thumbnail = file
            setDesignItems(newDesignItems)
          }
        }
      })
    } else {
      newDesignItems[index].thumbnail = null
      setDesignItems(newDesignItems)
    }
  }

  const handleInputChange = (index: number, name: string, value: string) => {
    const newDesignItems = [...designItems]
    if (name === 'link') newDesignItems[index].link = value
    if (name === 'title') newDesignItems[index].title = value
    setDesignItems(newDesignItems)
  }

  return (
    <div className="flex flex-1">
      <div className="bg-white w-full rounded-md shadow-item">
        <div className="flex justify-between items-center border-b p-5 px-6">
          <h3 className=" text-gray-600 whitespace-nowrap">
            {type === 'lists'
              ? 'فهرست ها'
              : type === 'services'
              ? 'سرویس ها'
              : type === 'socialMedia'
              ? 'شبکه های اجتماعی'
              : ''}
          </h3>
          <div className="flex justify-end w-[260px] gap-4 items-center">
            <Button className=" px-5 py-2.5 bg-sky-500 hover:bg-sky-400" onClick={onAddDesignItem}>
              افزودن
            </Button>
          </div>
        </div>
        <div className="flex flex-col px-6 pb-7 pt-4">
          <div className="flex justify-end mb-4"></div>
          <div className="grid justify-center sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 ">
            {designItems.length === 0 ? (
              <div className="flex justify-center col-span-6">
                {' '}
                {type === 'lists'
                  ? 'فهرست '
                  : type === 'services'
                  ? 'سرویس '
                  : type === 'socialMedia'
                  ? 'شبکه اجتماعی'
                  : ''}{' '}
                مورد نظر را اضافه کنید
              </div>
            ) : (
              designItems
                .sort((a, b) => {
                  const dateA = b.created ? new Date(b.created).getTime() : 0
                  const dateB = a.created ? new Date(a.created).getTime() : 0
                  return dateB - dateA
                  // return dateA - dateB
                })
                .map((designItem, index) => (
                  <div key={index} className="mb-4 border w-fit flex-1 rounded-lg shadow-item relative">
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 shadow-product bg-gray-50 hover:bg-red-600 hover:text-white p-1 rounded-full text-gray-500"
                      onClick={() => handleDelete(index, designItem)}
                    >
                      <MdClose className="text-lg" /> {/* Add your delete icon here */}
                    </button>
                    <div className="flex flex-col items-start p-5">
                      <div className="flex items-center justify-center w-full mb-4">
                        <label
                          htmlFor={`file-${type}-${index}`}
                          className="flex justify-center items-center cursor-pointer text-sm font-normal"
                        >
                          {designItem.thumbnail ? (
                            <img
                              src={URL.createObjectURL(designItem.thumbnail)}
                              alt="Design Item"
                              className="w-[210px] h-[125px] object-contain rounded-md"
                            />
                          ) : (
                            <img
                              className="w-[210px] h-[125px] rounded-md"
                              src="/images/other/product-placeholder.png"
                              alt="product-placeholder"
                            />
                          )}
                        </label>
                        <input
                          type="file"
                          id={`file-${type}-${index}`}
                          className="hidden"
                          onChange={(e) => handleFileChange(index, e)}
                          accept="image/png"
                        />
                      </div>
                      <div className="flex flex-col gap-2 w-full">
                        {/* title */}
                        <div className="flex gap-3 items-center">
                          <div className="relative w-full">
                            <input
                              type="text"
                              placeholder="عنوان"
                              value={designItem.title}
                              onChange={(e) => handleInputChange(index, 'title', e.target.value)}
                              className={`peer m-0 block rounded-lg h-[50px] w-full border border-solid border-gray-100 bg-clip-padding px-3 py-4 text-neutral-700 transition duration-200 ease-linear placeholder:text-transparent focus:border-primary focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-primary dark:border-neutral-400 dark:text-white dark:autofill:shadow-autofill dark:focus:border-primary dark:peer-focus:text-primary [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]`}
                              id="floatingInput"
                            />
                            <label
                              htmlFor="floatingInput"
                              className="pointer-events-none absolute right-0 top-0 origin-[0_0] border border-solid border-transparent pr-3 pb-4 pt-3.5 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary"
                            >
                              عنوان
                            </label>
                          </div>
                        </div>
                        {/* url link */}
                        <div className="flex gap-3 items-center">
                          <div className="relative w-full">
                            <input
                              type="text"
                              placeholder="پیوند"
                              value={designItem.link}
                              onChange={(e) => handleInputChange(index, 'link', e.target.value)}
                              className={`peer m-0 block rounded-lg h-[50px] w-full border border-solid border-gray-100 bg-clip-padding px-3 py-4 text-neutral-700 transition duration-200 ease-linear placeholder:text-transparent focus:border-primary focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-primary dark:border-neutral-400 dark:text-white dark:autofill:shadow-autofill dark:focus:border-primary dark:peer-focus:text-primary [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]`}
                              id="floatingInput"
                            />
                            <label
                              htmlFor="floatingInput"
                              className="pointer-events-none absolute right-0 top-0 origin-[0_0] border border-solid border-transparent pr-3 pb-4 pt-3.5 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary"
                            >
                              پیوند
                            </label>
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
          {type === 'services' ? (
            <span className="font-normal text-[11px] pt-2">سایز تصاویر میبایست 250*250 پیکسل باشد</span>
          ) : (
            <span className="font-normal text-[11px] pt-2">سایز تصاویر میبایست 50*50 پیکسل باشد</span>
          )}

          {type === 'services' ? (
            <span className="font-normal text-[11px]">حجم تصاویر میبایست حداکثر 60 کیلوبایت باشد</span>
          ) : (
            <span className="font-normal text-[11px]">حجم تصاویر میبایست حداکثر 15 کیلوبایت باشد</span>
          )}

          <span className="font-normal text-[11px]">فرمت عکس می با یست png باشد</span>
        </div>
      </div>
    </div>
  )
}
export default DesignItemForm
