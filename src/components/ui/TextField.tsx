import React, { forwardRef } from 'react';
import { Control, FieldError, useController } from 'react-hook-form';
import { DisplayError } from '@/components/ui';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  classStyle?: string | null;
  label?: string;
  errors?: FieldError | undefined;
  name: string;
  control: Control<any>;
}

const TextField = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { classStyle, label, errors, name, type = 'text', control, ...restProps } = props;

  const { field } = useController({ name, control, rules: { required: true } });

  const direction = /^[a-zA-Z0-9]+$/.test(field.value?.[0]) ? 'ltr' : 'rtl';

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (type === 'number' && inputValue.length !== 0) {
      field.onChange(parseInt(inputValue));
    } else {
      field.onChange(inputValue);
    }
  }

  return (
    <div>
      {label && (
        <label className="mb-3 block text-xs text-gray-700 md:min-w-max lg:text-sm" htmlFor={name}>
          {label}
        </label>
      )}
      <input
        className={`block w-full ${classStyle ? classStyle : "rounded-md"} border border-gray-200 bg-zinc-100 px-3 py-1.5 text-base outline-none transition-colors placeholder:text-center focus:border-[#ffb9e2] lg:text-lg`}
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
  );
});

export default TextField;