import React, { forwardRef } from 'react'
import { Control, FieldError, useController } from 'react-hook-form'
import { DisplayError } from '@/components/ui'
import { digitsEnToFa } from '@persian-tools/persian-tools'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  classStyle?: string | null
  label?: string
  errors?: FieldError | undefined
  name: string
  control: Control<any>
  isSheba?: boolean
  isBankNumber?: boolean
  isBirthDay?: boolean
}
interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  classStyle?: string | null
  label?: string
  errors?: FieldError | undefined
  name: string
  control: Control<any>
}
const TextField = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const {
    classStyle,
    label,
    isSheba,
    isBankNumber,
    errors,
    name,
    isBirthDay,
    type = 'text',
    control,
    ...restProps
  } = props

  const { field } = useController({ name, control, rules: { required: true } })

  const direction = /^[a-zA-Z0-9]+$/.test(field.value?.[0]) ? 'rtl' : 'rtl'

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    if (type === 'number' && inputValue.length !== 0) {
      const faInputValue = digitsEnToFa(inputValue)
      field.onChange(parseInt(faInputValue))
    } else {
      console.log('type', type)

      const faInputValue = digitsEnToFa(inputValue)
      field.onChange(faInputValue)
    }
  }

  return (
    <>
      {isSheba || isBankNumber ? (
        <div>
          {label && (
            <label className="mb-3 block text-xs text-gray-700 md:min-w-max lg:text-sm" htmlFor={name}>
              {label}
            </label>
          )}
          <label
            className={`flex items-center rounded-md ${isBankNumber && 'pl-2'}   bg-zinc-100 border border-gray-200 `}
            htmlFor={name}
          >
            {/* <input
              className={`block appearance-none focus:outline-none bg-transparent outline-none ring-0 focus:ring-0 w-full ${
                classStyle ? classStyle : ''
              } border-none pl-0  pr-3 py-1.5 text-base outline-none transition-colors placeholder:text-center focus:border-[#ffb9e2] lg:text-lg`}
              style={{ direction }}
              id={name}
              type={type}
              value={field?.value}
              name={field.name}
              onBlur={field.onBlur}
              onChange={onChangeHandler}
              ref={ref}
              {...restProps}
            /> */}
            <TextFieldFa
              label={label}
              control={control}
              errors={errors}
              name={name}
              classStyle={classStyle}
              // type="number"
              inputMode="numeric"
            />
            {!isBankNumber && <div className="text-lg font-normal px-1.5">IR</div>}
          </label>
          <DisplayError errors={errors} />
        </div>
      ) : (
        <div>
          {label && (
            <label className="mb-3 block text-xs text-gray-700 md:min-w-max lg:text-sm" htmlFor={name}>
              {label}
            </label>
          )}
          <input
            className={`block ${
              isBirthDay && 'border-l-0 rounded-l-none  text-center'
            } appearance-none focus:outline-none outline-none ring-0 focus:ring-0 w-full ${
              classStyle ? classStyle : 'rounded-md bg-zinc-100'
            } border border-gray-200  px-3 py-1.5 text-base outline-none transition-colors placeholder:text-center focus:border-[#ffb9e2] lg:text-lg`}
            style={{ direction }}
            id={name}
            type={type}
            value={field?.value}
            name={field.name}
            onBlur={field.onBlur}
            onChange={onChangeHandler}
            ref={ref}
            {...restProps}
          />
          <DisplayError errors={errors} />
        </div>
      )}
    </>
  )
})

const TextFieldFa = forwardRef<HTMLInputElement, FieldProps>((props, ref) => {
  const { classStyle, label, errors, name, type = 'text', control, ...restProps } = props

  const { field } = useController({ name, control, rules: { required: true } })

  const direction = /^[a-zA-Z0-9]+$/.test(field.value?.[0]) ? 'ltr' : 'ltr'
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    // فیلتر کردن کاراکترهای غیر عددی
    const filteredValue = inputValue.replace(/[^0-9۰-۹]/g, '')

    // تبدیل اعداد انگلیسی به فارسی
    const faInputValue = digitsEnToFa(filteredValue)

    field.onChange(faInputValue)
  }

  return (
    <input
      className={`block appearance-none focus:outline-none bg-transparent outline-none ring-0 focus:ring-0 w-full ${
        classStyle ? classStyle : ''
      } border-none pl-0  pr-3 py-1.5 text-base outline-none transition-colors placeholder:text-center focus:border-[#ffb9e2] lg:text-lg`}
      style={{ direction }}
      id={name}
      type="tel"
      value={field?.value}
      name={field.name}
      onBlur={field.onBlur}
      onChange={onChangeHandler}
      ref={ref}
      {...restProps}
    />
  )
})
export default TextField
