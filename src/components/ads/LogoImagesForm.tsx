import { useAppDispatch } from '@/hooks'
import { showAlert } from '@/store'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'

interface Props {
  setFaviconFile: React.Dispatch<React.SetStateAction<any[]>>
  selectedFaviconFile: any[]
  setMainSelectedFiles: React.Dispatch<React.SetStateAction<any[]>>
  selectedMainFile: any[]
}
const LogoImagesForm: React.FC<Props> = (prop) => {
  const { selectedFaviconFile, selectedMainFile, setFaviconFile, setMainSelectedFiles } = prop
  //  ? Assets
  const dispatch = useAppDispatch()

  const { control, setValue, getValues, watch } = useFormContext()

  const handleMainFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const validFiles: any[] = []
      const maxFileSize = 70 * 1024 // 70 KB
      const exactWidth = 700
      const exactHeight = 700

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

        // if (file.size > maxFileSize) {
        //   dispatch(
        //     showAlert({
        //       status: 'error',
        //       title: 'حجم عکس ها می بایست حداکثر 70 کیلوبایت باشد',
        //     })
        //   )
        //   return
        // }

        const img = new Image()
        img.src = URL.createObjectURL(file)

        img.onload = () => {
          URL.revokeObjectURL(img.src)

          //   if (img.width !== exactWidth || img.height !== exactHeight) {
          // dispatch(
          //   showAlert({
          //     status: 'error',
          //     title: 'سایز عکس ها می بایست 700*700 پیکسل باشد',
          //   })
          // )
          //   } else {
          validFiles.push(file)
          setValue('logoImages.orgThumbnail', file)
          setMainSelectedFiles([...validFiles])
          //   }
        }
      })
    }
  }

  const handleFaviconFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const validFiles: any[] = []
      const maxFileSize = 70 * 1024 // 70 KB
      const exactWidth = 700
      const exactHeight = 700

      Array.from(files).forEach((file) => {
        if (file.type !== 'image/x-icon') {
          dispatch(
            showAlert({
              status: 'error',
              title: 'فرمت عکس ها می بایست ico باشد',
            })
          )
          return
        }

        // if (file.size > maxFileSize) {
        //   dispatch(
        //     showAlert({
        //       status: 'error',
        //       title: 'حجم عکس ها می بایست حداکثر 70 کیلوبایت باشد',
        //     })
        //   )
        //   return
        // }

        const img = new Image()
        img.src = URL.createObjectURL(file)

        img.onload = () => {
          URL.revokeObjectURL(img.src)

          //   if (img.width !== exactWidth || img.height !== exactHeight) {
          // dispatch(
          //   showAlert({
          //     status: 'error',
          //     title: 'سایز عکس ها می بایست 700*700 پیکسل باشد',
          //   })
          // )
          //   } else {
          validFiles.push(file)
          setValue('logoImages.faviconThumbnail', file)
          setFaviconFile([...validFiles])
          //   }
        }
      })
    }
  }
  return (
    <div className="flex flex-1">
      <div className="bg-white w-full rounded-md shadow-item">
        <div className="flex justify-between items-center border-b p-5 px-6">
          <h3 className=" text-gray-600 whitespace-nowrap">لوگو ها</h3>
        </div>
        <div className="w-full px-6">
          <div className="flex justify-center items-center flex-col mdx:flex-row  gap-8 mt-8 mb-4">
            <div className="">
              <input
                type="file"
                className="hidden"
                id="MainThumbnail"
                onChange={handleMainFileChange}
                accept="image/png"
              />
              <label htmlFor="MainThumbnail" className="block cursor-pointer p-4 text-sm font-normal">
                <h3 className="font-iransans text-center mb-6">لوگو</h3>
                {selectedMainFile.length > 0 ? (
                  selectedMainFile.map((file: any, index: number) => (
                    <div key={index} className="text-sm shadow-item rounded-lg p-2 text-gray-600">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-[125px] h-[125px] object-contain  rounded-md"
                      />
                    </div>
                  ))
                ) : (
                  <img
                    className="w-[141px] h-[141px]  rounded-md"
                    src="/images/other/product-placeholder.png"
                    alt="product-placeholder"
                  />
                )}
              </label>
            </div>

            <div className="">
              <input
                type="file"
                className="hidden"
                id="Thumbnail"
                onChange={handleFaviconFileChange}
                accept="image/ico"
              />
              <label htmlFor="Thumbnail" className="block cursor-pointer p-4 text-sm font-normal">
                <h3 className="font-iransans text-center mb-6">آیکون (favicon)</h3>
                {selectedFaviconFile.length > 0 ? (
                  selectedFaviconFile.map((file: any, index: number) => (
                    <div key={index} className="text-sm shadow-item rounded-lg p-2 text-gray-600">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-[125px] h-[125px] object-contain  rounded-md"
                      />
                    </div>
                  ))
                ) : (
                  <img
                    className="w-[141px] h-[141px] rounded-md"
                    src="/images/other/product-placeholder.png"
                    alt="product-placeholder"
                  />
                )}
              </label>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 bottom-0 w-full rounded-b-lg px-8 flex flex-col py-2">
          <span className="font-normal text-[11px] ">سایز عکس لوگو میبایست 170 * 500 پیکسل با فرمت png با نهایت حجم 50 کیلوبایت باشد</span>
          <span className="font-normal text-[11px] pt-0.1">
            سایز عکس آیکون (favicon) میبایست 32*32 پیکسل با فرمت ico باشد
          </span>
        </div>
      </div>
    </div>
  )
}

export default LogoImagesForm
