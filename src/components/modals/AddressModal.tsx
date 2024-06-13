import { useEffect, useState } from 'react'
import { useEditUserAddressMutation, useGetUserAddressInfoQuery } from '@/services'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { addressSchema } from '@/utils'
import { HandleResponse } from '@/components/shared'
import { Modal, DisplayError, TextField, SubmitModalButton, Combobox } from '@/components/ui'
import type { AddressForm, IAddress } from '@/types'

const iranCity = require('iran-city')

interface Props {
  isShow: boolean
  onClose: () => void
  address: IAddress
  refetch: () => void
}

const AddressModal: React.FC<Props> = (props) => {
  const { isShow, onClose, address, refetch } = props
  const AllProvinces = iranCity.allProvinces()
  const { data: userInfo } = useGetUserAddressInfoQuery({ page: 1 })

  const [cities, setCities] = useState([])

  const {
    handleSubmit,
    control,
    formState: { errors: formErrors },
    setValue,
    getValues,
    watch,
    reset,
  } = useForm<Omit<IAddress, 'id' | 'userId'>>({
    resolver: yupResolver(addressSchema),
    defaultValues: {
      fullName: address.fullName || '',
      mobileNumber: address.mobileNumber || '',
      fullAddress: address.fullAddress || '',
      province: address.province || {},
      city: address.city || {},
      postalCode: address.postalCode || '',
    },
  })

  const [editAddress, { data, isSuccess, isLoading, isError, error }] = useEditUserAddressMutation()

  useEffect(() => {
    if (address.province) {
      setCities(iranCity.citiesOfProvince(address.province.id))
    }
    reset(address)
  }, [address, reset])

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === 'province') {
        setCities(iranCity.citiesOfProvince(value.province?.id))
        setValue('city', {} as IAddress['city'])
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, setValue])

  useEffect(() => {
    if (userInfo?.data) {
      setValue('city', userInfo.data.city)
    }
  }, [userInfo, setValue])

  const submitHandler: SubmitHandler<Omit<IAddress, 'id' | 'userId'>> = async (address) => {
    try {
      await editAddress({
        body: address,
      }).unwrap()
      refetch()
    } catch (error) {
      console.error('Failed to update user data:', error)
    }
  }

  return (
    <>
      {(isSuccess || isError) && (
        <HandleResponse
          isError={isError}
          isSuccess={isSuccess}
          error={error}
          message={data?.message}
          onSuccess={onClose}
        />
      )}

      <Modal isShow={isShow} onClose={onClose} effect="bottom-to-top">
        <Modal.Content onClose={onClose} className="flex h-full flex-col gap-y-5 bg-white px-5 py-5 md:rounded-lg ">
          <Modal.Header onClose={onClose}>ثبت آدرس</Modal.Header>
          <Modal.Body>
            <p>لطفا اطلاعات موقعیت مکانی خود را وارد کنید.</p>
            <form
              className="flex flex-1 flex-col justify-between overflow-y-auto pl-4"
              onSubmit={handleSubmit(submitHandler)}
            >
              <div className="grid md:grid-cols-2 gap-4">
                <TextField label="نام کامل گیرنده" control={control} errors={formErrors.fullName} name="fullName" />
                <TextField
                  control={control}
                  errors={formErrors.mobileNumber}
                  name="mobileNumber"
                  label="شماره موبایل گیرنده"
                />
                <div className="space-y-2">
                  <Combobox
                    control={control}
                    name="province"
                    list={AllProvinces}
                    placeholder="لطفا استان خود را انتخاب کنید"
                  />
                  <DisplayError errors={formErrors.province?.name} />
                </div>

                <div className="space-y-2 ">
                  <Combobox control={control} name="city" list={cities} placeholder="لطفا شهرستان خود را انتخاب کنید" />
                  <DisplayError errors={formErrors.city?.name} />
                </div>

                <div className='col-span-2'>  
                  <TextField
                    label="آدرس کامل گیرنده"
                    control={control}
                    errors={formErrors.fullAddress}
                    name="fullAddress"
                  />
                </div>

                <TextField
                  label="کد پستی"
                  control={control}
                  errors={formErrors.postalCode}
                  name="postalCode"
                  type="number"
                  inputMode="numeric"
                />
              </div>

              <div className="border-t-2 border-gray-200 py-3 lg:pb-0 flex justify-end">
                <SubmitModalButton className='' isLoading={isLoading}>ثبت اطلاعات</SubmitModalButton>
              </div>
            </form>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  )
}

export default AddressModal
