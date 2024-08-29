import { ITextMarqueeForm } from '@/types'
import { profileFormSchema, textMarqueeSchema } from '@/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'

import { useFormContext, Controller } from 'react-hook-form';
import { ControlledCheckbox } from '../ui';

const TextMarqueeForm: React.FC = () => {
  const { control } = useFormContext();

  return (
    <div className="flex flex-1">
      <div className="bg-white w-full rounded-md shadow-item">
        <div className='flex justify-between items-center border-b p-6'>
          <h3 className=" text-gray-600 whitespace-nowrap">متن متحرک</h3>
          <ControlledCheckbox
            name="textMarquee.isActive"
            control={control}
            label="وضعیت نمایش" 
          />
        </div>
        <div className="flex flex-col xs:flex-row px-10 py-10 pt-6">
          <Controller
            name="textMarquee.name"
            control={control}
            render={({ field }) => (
              <input
                className="w-full border border-gray-200 rounded-md"
                type="text"
                {...field}
              />
            )}
          />
        </div>
        <div className="bg-gray-50 bottom-0 w-full rounded-b-lg px-8 flex flex-col pb-2">
          <span className="font-normal text-[11px] pt-2">
            متن مورد نظر برای نمایش در بنر بالای سایت را وارد کنید
          </span>
        </div>
      </div>
    </div>
  );
};

export default TextMarqueeForm;