import React, { Fragment, useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Modal from 'react-modal'
import { profileFormSchema } from '@/utils'
import { ProfileForm as ProfileFormType } from '@/types'
import { TextField, LoginButton, Button, BackIconButton, DeleteIconButton, CloseIconButton } from '@/components/ui'
import { user2, user3 } from '@/icons'
import { Dialog, Transition } from '@headlessui/react'
import jalaali from 'jalaali-js'
import { showAlert } from '@/store'
import { useAppDispatch } from '@/hooks'
interface Props {
  onSubmit: (data: ProfileFormType) => void
  isLoading: boolean
  defaultValues: ProfileFormType
}

const toJalaali = (date: Date) => {
  const jalaaliDate = jalaali.toJalaali(date)
  return {
    day: jalaaliDate.jd,
    month: jalaaliDate.jm,
    year: jalaaliDate.jy,
  }
}

const days = Array.from({ length: 31 }, (_, i) => i + 1)
const months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند']
const currentDateJalaali = toJalaali(new Date())
const currentYearJalaali = currentDateJalaali.year
const years = Array.from({ length: 100 }, (_, i) => currentYearJalaali - i)

const ProfileForm: React.FC<Props> = ({ onSubmit, isLoading, defaultValues }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setFocus,
    reset,
    setValue,
    watch,
  } = useForm<ProfileFormType>({
    resolver: yupResolver(profileFormSchema),
    defaultValues,
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [birthDate, setBirthDate] = useState({ day: '', month: '', year: '' })

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (defaultValues.birthDate !== '' && defaultValues.birthDate != '--') {
      const defaultBirthDate = new Date(defaultValues.birthDate!)
      const jalaaliBirthDate = toJalaali(defaultBirthDate)
      setValue('birthDate', `${jalaaliBirthDate.year}-${jalaaliBirthDate.month}-${jalaaliBirthDate.day}`)
    }
    reset(defaultValues)
  }, [defaultValues, reset, setValue])

  const handleModalOpen = () => setIsModalOpen(true)
  const handleModalClose = () => setIsModalOpen(false)

  const handleDateChange = (field: 'day' | 'month' | 'year', value: string) => {
    const birthDate = watch('birthDate') || ''
    const [year, month, day] = birthDate.split('-')
    const newBirthDate = {
      day: field === 'day' ? value : day,
      month: field === 'month' ? value : month,
      year: field === 'year' ? value : year,
    }
    setValue('birthDate', `${newBirthDate.year}-${newBirthDate.month}-${newBirthDate.day}`)
  }

  return (
    <form className="gap-x-5 grid md:grid-cols-2 w-full md:relative" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="mobileNumber"
        disabled
        control={control}
        render={({ field }) => (
          <TextField {...field} control={control} errors={errors.mobileNumber} label="شماره کاربری / موبایل" />
        )}
      />
      <Controller
        name="gender"
        control={control}
        render={({ field }) => (
          <div className="flex gap-8">
            <div className="flex items-center">
              <input
                id="default-radio-1"
                type="radio"
                {...field}
                value="بانو"
                checked={field.value === 'بانو'}
                name="default-radio"
                className="w-4 h-4  mb-6 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="default-radio-1"
                className="ms-2 cursor-pointer flex items-center gap-3 ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                بانو
                <img className="w-10" src={user2.src} alt="user2" />
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="default-radio-2"
                type="radio"
                {...field}
                value="آقا"
                checked={field.value === 'آقا'}
                name="default-radio"
                className="w-4 h-4  mb-6 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="default-radio-2"
                className="ms-2 cursor-pointer flex items-center gap-3 ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                آقا
                <img className="w-10" src={user3.src} alt="user2" />
              </label>
            </div>
          </div>
        )}
      />
      <Controller
        name="firstName"
        control={control}
        render={({ field }) => <TextField {...field} control={control} errors={errors.firstName} label="نام" />}
      />
      <Controller
        name="familyName"
        control={control}
        render={({ field }) => (
          <TextField {...field} control={control} errors={errors.familyName} label="نام خانوادگی" />
        )}
      />
      <Controller
        name="nationalCode"
        control={control}
        render={({ field }) => (
          <TextField {...field} control={control} errors={errors.nationalCode} label="کد ملی (اختیاری)" />
        )}
      />
      <Controller
        name="birthDate"
        control={control}
        render={({ field }) => (
          <>
            <TextField
              {...field}
              value={field.value}
              control={control}
              errors={errors.birthDate}
              label="تاریخ تولد"
              onClick={handleModalOpen}
              readOnly
            />
            <Transition appear show={isModalOpen} as={Fragment}>
              <Dialog as="div" className="relative z-10" onClose={handleModalClose}>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-black/25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                  <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
                        <Dialog.Title
                          as="h3"
                          className="text-lg p-4 font-medium leading-6 text-gray-900 flex items-center justify-between -mt-1.5"
                        >
                          انتخاب تاریخ تولد
                          <CloseIconButton className="-ml-2" onClick={handleModalClose} />
                        </Dialog.Title>
                        <hr className="" />
                        <div className="select-container flex gap-2 pt-4 px-4 w-full">
                          <select
                            className="w-full border-none"
                            onChange={(e) => handleDateChange('day', e.target.value)}
                            value={field.value?.split('-')[2] || ''}
                          >
                            <option value="">روز</option>
                            {days.map((day) => (
                              <option key={day} value={day}>
                                {day}
                              </option>
                            ))}
                          </select>
                          <select
                            className="w-full border-none"
                            onChange={(e) => handleDateChange('month', e.target.value)}
                            value={field.value?.split('-')[1] || ''}
                          >
                            <option value="">ماه</option>
                            {months.map((month, index) => (
                              <option key={index + 1} value={index + 1}>
                                {month}
                              </option>
                            ))}
                          </select>
                          <select
                            className="w-full border-none"
                            onChange={(e) => handleDateChange('year', e.target.value)}
                            value={field.value?.split('-')[0] || ''}
                          >
                            <option value="">سال</option>
                            {years.map((year) => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="p-3.5">
                          <button
                            type="button"
                            className="inline-flex justify-center w-full rounded-md border border-transparent bg-[#e90089] px-4 py-2 text-sm font-medium text-white hover:bg-[#f844aa] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                            onClick={handleModalClose}
                          >
                            ثبت
                          </button>
                        </div>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition>
          </>
        )}
      />
      <Controller
        name="bankAccountNumber"
        control={control}
        render={({ field }) => (
          <TextField {...field} control={control} errors={errors.bankAccountNumber} label="شماره کارت بانکی" />
        )}
      />
      <Controller
        name="shabaNumber"
        control={control}
        render={({ field }) => <TextField {...field} control={control} errors={errors.shabaNumber} label="شماره شبا" />}
      />
      <Controller
        name="email"
        control={control}
        render={({ field }) => <TextField {...field} control={control} errors={errors.email} label="پست الکترونیک" />}
      />
      <div className="w-full flex justify-end">
        {' '}
        <Button type="submit" className="md:mx-auto w-28 h-11 rounded-md md:absolute bottom-4 left-4">
          {' '}
          ذخیره{' '}
        </Button>{' '}
      </div>{' '}
    </form>
  )
}
export default ProfileForm
