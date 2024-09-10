import { IColumnFooter, ITextMarqueeForm } from '@/types'
import { profileFormSchema, textMarqueeSchema } from '@/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'

import { useFormContext, Controller } from 'react-hook-form'
import { Button, ControlledCheckbox } from '../ui'
import dynamic from 'next/dynamic'
import { showAlert } from '@/store'
import { useAppDispatch } from '@/hooks'
import { MdClose } from 'react-icons/md'
import { digitsEnToFa } from '@persian-tools/persian-tools'
import { useEffect, useState } from 'react'
const CustomEditor = dynamic(() => import('@/components/form/TextEditor'), { ssr: false })
interface Props {
  setColumnFooter: React.Dispatch<React.SetStateAction<IColumnFooter[]>>
  columnFooters: IColumnFooter[]
  setDeletedColumnFooter: React.Dispatch<React.SetStateAction<IColumnFooter[]>>
}
const AdditionalForm: React.FC<Props> = ({ columnFooters, setColumnFooter, setDeletedColumnFooter }) => {
  const { control, setValue } = useFormContext()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const columnFootersWithThumbnail = columnFooters.filter((slider) => slider.name !== '')
    setValue('columnFooters', columnFootersWithThumbnail)
  }, [columnFooters, setValue])

  const handleAdd = () => {
    if (columnFooters.length === 4) {
      dispatch(
        showAlert({
          status: 'error',
          title: 'حداکثر تعداد ستون های فوتر 4 عدد میباشد',
        })
      );
      return;
    }
  
    const nextIndex = columnFooters.length + 2;
  
    setColumnFooter([
      ...columnFooters,
      { id: '', name: '', index: nextIndex },
    ]);
  };
  

  const handleDelete = (index: number, columnFooter: IColumnFooter) => {
    if (columnFooter.id) {
      setDeletedColumnFooter((prevDeleted) => [...prevDeleted, columnFooter])
    }
    setColumnFooter((prevFiles) => {
      const updatedFiles = [...prevFiles]
      updatedFiles.splice(index, 1)
      return updatedFiles
    })
  }
  const handleInputChange = (index: number, value: string) => {
    const newColumnFooters = columnFooters.map((columnFooter, i) =>
      i === index ? { ...columnFooter, name: value } : columnFooter
    );
  
    setColumnFooter(newColumnFooters);
  };
  
  return (
    <div className="flex flex-1">
      <div className="bg-white flex flex-col justify-between w-full rounded-md shadow-item">
        <div>
          {/* <div className="flex justify-between items-center border-b p-5 px-6">
            <h3 className=" text-gray-600 whitespace-nowrap"></h3>
          </div> */}
          <div className="flex justify-between items-center border-b p-5 px-6">
            <h3 className=" text-gray-600 whitespace-nowrap">ستون فوتر</h3>
            <div className="flex justify-end w-[260px] gap-4 items-center">
              <Button className=" px-5 py-2.5 bg-sky-500 hover:bg-sky-400" onClick={handleAdd}>
                {'افزودن'}
              </Button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row  py-10 pt-6 gap-4">
            {columnFooters.length === 0 ? (
              <div className="text-center w-full">ستون ها خالی است</div>
            ) : (
              <div className="flex flex-wrap w-full">
                {columnFooters.map((columnFooter, index) => {
                  return (
                    <div key={index} className="mb-4 w-full max-w-[25%] flex-1 rounded-lg  relative">
                      <button
                        type="button"
                        className="absolute -top-4 right-1  shadow-product bg-gray-50 hover:bg-red-600 hover:text-white p-1 rounded-full text-gray-500"
                        onClick={() => handleDelete(index, columnFooter)}
                      >
                        <MdClose className="text-lg" /> {/* Add your delete icon here */}
                      </button>
                      <div className="px-[18px] w-full">
                        <input
                          type="text"
                          placeholder={`ستون ${digitsEnToFa(index + 1)}`}
                          value={columnFooter.name}
                          onChange={(e) => handleInputChange(index, e.target.value)}
                          className={`peer m-0 block rounded-lg h-[50px] w-full border border-solid border-gray-200 bg-clip-padding px-3 py-4 text-neutral-700 transition duration-200 ease-linear placeholder:text-transparent focus:border-primary focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-primary dark:border-neutral-400 dark:text-white dark:focus:border-primary dark:peer-focus:text-primary [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]`}
                          id="floatingCopy"
                        />
                        <label
                          htmlFor="floatingCopy"
                          className="pointer-events-none absolute right-0 top-0 origin-[0_0] border border-solid border-transparent pr-6 pb-4 pt-3.5 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary"
                        >
                          ستون {digitsEnToFa(index + 1)}{' '}
                        </label>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
        <div className="bg-gray-50 h-[56px] w-full rounded-b-lg px-8 flex flex-col pb-2">
          <span className="font-normal text-[11px] pt-2">.....</span>
        </div>
      </div>
    </div>
  )
}

export default AdditionalForm
