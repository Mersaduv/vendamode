import { ICategoryForm } from '@/types'
import React, { ForwardedRef, forwardRef } from 'react'
import { Control, UseFormRegister, useController } from 'react-hook-form'

interface CustomCheckboxProps {
  label?: string
  name: string
  checked: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  customStyle?: string
  register?: UseFormRegister<ICategoryForm>
}

export const CustomCheckbox = forwardRef(function CustomCheckboxComponent(
  props: CustomCheckboxProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  const { label, name, checked, onChange, customStyle } = props

  return (
    <div className={`flex items-center justify-between ${customStyle ? ""  :"py-2.5"} w-full`}>
      <span className="w-3/4 font-medium text-gray-700">{label}</span>
      <div className="relative mr-2 inline-block w-11 select-none align-middle">
        <input
          type="checkbox"
          name={name}
          id={name}
          checked={checked}
          onChange={onChange}
          ref={ref}
          className="absolute right-[17px] md:right-5 top-1 border-none block h- w-4 cursor-pointer appearance-none rounded-full bg-white duration-200 ease-in checked:right-1 checked:bg-white"
        />
        <label
          htmlFor={name}
          className={`block h-6 cursor-pointer overflow-hidden rounded-full ${
            checked ? `  ${customStyle ? customStyle : "bg-[#e90089]" } ` : 'bg-gray-200'
          }`}
        ></label>
      </div>
    </div>
  )
})

interface ControlledCheckboxProps {
  name: string
  control: Control<any>
  label: string
}

export const ControlledCheckbox: React.FC<ControlledCheckboxProps> = ({ name, control, ...restProps }) => {
  const { field } = useController({ name, control })

  return <CustomCheckbox checked={field.value} name={field.name} onChange={field.onChange} {...restProps} />
}
