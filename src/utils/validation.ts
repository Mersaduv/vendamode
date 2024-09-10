import * as Yup from 'yup'

export const articleFormValidationSchema = Yup.object().shape({
  id: Yup.string().optional(),
  title: Yup.string().required('عنوان الزامی است'),
  thumbnail: Yup.mixed().required('تصویر نمایه الزامی است'),
})

export const registerSchema = Yup.object().shape({
  name: Yup.string()
    .required('نام و نام خانوادگی  لازم است ثبت شود')
    .min(3, 'نام و نام خانوادگی  باید بیشتر از 2 کارکتر باشد'),
  email: Yup.string().required('آدرس ایمیل لازم است ثبت شود').email('آدرس ایمیل وارد شده معتبر نیست'),
  password: Yup.string().required('رمز عبور لازم است ثبت شود').min(6, 'رمز عبور باید بیشتر از 5 کارکتر باشد'),
  confirmPassword: Yup.string()
    .required('تکرار کلمه عبور الزامی می باشد')
    .oneOf([Yup.ref('password')], 'تکرار کلمه عبور صحیح نیست'),
})

export const logInSchema = Yup.object().shape({
  mobileNumber: Yup.string()
    .required('شماره موبایل لازم است وارد شود')
    .min(11, 'شماره موبایل وارد شده باید 11 رقم باشد')
    .max(11, 'شماره موبایل وارد شده باید 11 رقم باشد'),
  password: Yup.string().required('رمز عبور لازم است وارد شود').min(4, 'رمز عبور نباید کمتر از 4 کارکتر باشد!'),
})

export const nameSchema = Yup.object().shape({
  name: Yup.string()
    .required('نام و نام خانوادگی  لازم است ثبت شود')
    .min(3, 'نام و نام خانوادگی  باید بیشتر از 2 کارکتر باشد'),
})

export const mobileSchema = Yup.object().shape({
  mobile: Yup.string()
    .required('شماره تلفن همراه  لازم است ثبت شود')
    .min(11, 'شماره تلفن همراه باید 11 رقم باشد')
    .max(11, 'شماره تلفن همراه باید 11 رقم باشد'),
})

export const categorySchema = Yup.object().shape({
  name: Yup.string().required('نام دسته‌بندی نباید خالی باشد'),
  thumbnail: Yup.mixed().required('تصویر برای دسته بندی الزامی است'),
  level: Yup.number().required(),
})

export const singleSchema = Yup.object().shape({
  name: Yup.string().required('مقدار نباید خالی باشد'),
})

export const brandSchema = Yup.object().shape({
  id: Yup.string().optional(),
  nameFa: Yup.string().required('نام فارسی برند نباید خالی باشد'),
  nameEn: Yup.string().required('نام انگلیسی برند نباید خالی باشد'),
  Thumbnail: Yup.mixed().required('تصویر برند الزامی است'),
  description: Yup.string().optional(),
})

export const sliderSchema = Yup.object().shape({
  title: Yup.string().required('نام اسلایدر نباید خالی باشد'),
  image: Yup.object().shape({
    placeholder: Yup.string(),
    url: Yup.string()
      .required('آدرس تصویر را وارد کنید')
      .url('آدرس تصویر معتبر نیست')
      .matches(/\.(gif|jpe?g|png|webp)$/i, 'آدرس تصویر باید یک URL تصویر معتبر باشد'),
  }),
})

export const bannerSchema = Yup.object().shape({
  title: Yup.string().required('نام بنر نباید خالی باشد'),
  image: Yup.object().shape({
    placeholder: Yup.string(),
    url: Yup.string()
      .required('آدرس تصویر را وارد کنید')
      .url('آدرس تصویر معتبر نیست')
      .matches(/\.(gif|jpe?g|png|webp)$/i, 'آدرس تصویر باید یک URL تصویر معتبر باشد'),
  }),
})

export const addressSchema = Yup.object().shape({
  // fullName: Yup.string().required('نام و نام خانوادگی الزامی است'),
  fullName: Yup.string()
  .matches(/^[\u0600-\u06FF\s]+$/, 'نام باید فقط شامل حروف فارسی باشد')
  .required('نام لازم است'),
  // mobileNumber: Yup.string().required('شماره موبایل الزامی است'),
  mobileNumber: Yup.string().required('شماره موبایل الزامی است')
  .test(
    'length-check',
    'لطفا شماره موبایل را به طور صحیح وارد کنید',
    (value) => !value || (value.length >= 11 && value.length <= 11)
  ),
  city: Yup.object().shape({
    id: Yup.number().optional(),
    name: Yup.string().required('نام شهر الزامی است'),
    slug: Yup.string().optional(),
    province_id: Yup.number().optional(),
  }),
  province: Yup.object().shape({
    id: Yup.number().optional(),
    name: Yup.string().required('نام استان الزامی است'),
    slug: Yup.string().optional(),
  }),
  fullAddress: Yup.string().matches(/^[\u0600-\u06FF\s]+$/, 'نام باید فقط شامل حروف فارسی باشد').required('آدرس کامل الزامی است'),
  postalCode: Yup.string().required('کد پستی الزامی است')
  .test(
    'length-check',
    'لطفا کد پستی را به طور صحیح وارد کنید',
    (value) => !value || (value.length >= 10 && value.length <= 10)
  ),
})

export const reviewSchema = Yup.object().shape({
  userId: Yup.string(),
  productId: Yup.string(),
  rating: Yup.number()
    .required('امتیاز الزامی است')
    .min(1, 'امتیاز باید حداقل ۱ باشد')
    .max(5, 'امتیاز نباید بیشتر از ۵ باشد'),
  positivePoints: Yup.array().of(
    Yup.object().shape({
      id: Yup.string(),
      title: Yup.string(),
    })
  ),
  negativePoints: Yup.array().of(
    Yup.object().shape({
      id: Yup.string(),
      title: Yup.string(),
    })
  ),
  comment: Yup.string().required('نظر الزامی است').min(4, 'نظر باید حداقل ۴ کاراکتر باشد'),
  Thumbnail: Yup.mixed(),
})

export const productSchema = Yup.object().shape({
  Title: Yup.string().required('وارد کردن نام محصول الزامی است'),
  IsActive: Yup.boolean(),
  MainThumbnail: Yup.mixed().required('انتخاب تصویر نگاره الزامی است'),
  CategoryId: Yup.string().required('انتخاب دسته بندی برای محصول الزامی است'),
  Description: Yup.string(),
  IsFake: Yup.boolean(),
  BrandId: Yup.string().nullable(),
  FeatureValueIds: Yup.array().of(Yup.string()),
  ProductScale: Yup.object().nullable(),
})

export const productSizeSchema = Yup.object().shape({
  id: Yup.string().nullable(),
  sizeType: Yup.string().required('نوع سایز لازم است ثبت شود').oneOf(['0', '1'], 'نوع سایز معتبر نیست'),
  productSizeValues: Yup.array()
    .of(Yup.string().required('مقدار سایز لازم است ثبت شود'))
    .required('لیست مقادیر سایز لازم است ثبت شود')
    .min(1, 'لطفاً حداقل یک مقدار سایز را وارد کنید'),
  thumbnail: Yup.mixed().nullable().required('تصویر برای اندازه دسته بندی الزامی است'),
  categoryIds: Yup.array(),
})

export const detailsSchema = Yup.object().shape({
  info: Yup.array().of(
    Yup.object().shape({
      title: Yup.string().required('نام ویژگی الزامی است'),
    })
  ),
  specification: Yup.array().of(
    Yup.object().shape({
      title: Yup.string().required('نام مشخصات الزامی است'),
    })
  ),
  optionsType: Yup.string().required('نوع انتخاب را مشخص کنید'),
})

export const profileFormSchema = Yup.object().shape({
  mobileNumber: Yup.string().optional(),
  gender: Yup.string().oneOf(['آقا', 'بانو']).required('جنسیت لازم است'),
  firstName: Yup.string()
    .matches(/^[\u0600-\u06FF\s]+$/, 'نام باید فقط شامل حروف فارسی باشد')
    .required('نام لازم است'),
  familyName: Yup.string()
    .matches(/^[\u0600-\u06FF\s]+$/, 'نام خانوادگی باید فقط شامل حروف فارسی باشد')
    .required('نام خانوادگی لازم است'),
  nationalCode: Yup.string()
    .optional()
    .test(
      'length-check',
      'لطفا شماره ملی را به طور صحیح وارد کنید',
      (value) => !value || (value.length >= 10 && value.length <= 10)
    ),
  bankAccountNumber: Yup.string()
    .optional()
    .test(
      'length-check',
      'لطفا شماره کارت را به طور صحیح وارد کنید',
      (value) => !value || (value.length >= 16 && value.length <= 16)
    ),
  shabaNumber: Yup.string()
    .optional()
    .test(
      'length-check',
      'لطفا شماره شبا را به طور صحیح وارد کنید',
      (value) => !value || (value.length >= 24 && value.length <= 24)
    ),
  email: Yup.string().email('پست الکترونیک وارد شده معتبر نیست').optional(),
})

// export const profileFormSchema = Yup.object().shape({
//   mobileNumber: Yup.string().optional(),
//   gender: Yup.string().oneOf(['آقا', 'بانو']).required('جنسیت لازم است'),
//   firstName: Yup.string()
//     .matches(/^[\u0600-\u06FF\s]+$/, 'نام باید فقط شامل حروف فارسی باشد')
//     .required('نام لازم است'),
//   familyName: Yup.string()
//     .matches(/^[\u0600-\u06FF\s]+$/, 'نام خانوادگی باید فقط شامل حروف فارسی باشد')
//     .required('نام خانوادگی لازم است'),
//   nationalCode: Yup.string()
//     .notRequired()
//     .min(10, 'لطفا شماره ملی را به طور صحیح وارد کنید')
//     .max(10, 'لطفا شماره ملی را به طور صحیح وارد کنید'),
//   bankAccountNumber: Yup.string()
//     .notRequired()
//     .min(16, 'لطفا شماره کارت را به طور صحیح وارد کنید')
//     .max(16, 'لطفا شماره کارت را به طور صحیح وارد کنید'),
//   shabaNumber: Yup.string()
//     .notRequired()
//     .min(24, 'لطفا شماره شبا را به طور صحیح وارد کنید')
//     .max(24, 'لطفا شماره شبا را به طور صحیح وارد کنید'),
//   email: Yup.string().email('پست الکترونیک وارد شده معتبر نیست').optional(),
// })

export const textMarqueeSchema = Yup.object().shape({
  name: Yup.string().optional(),
  isActive: Yup.boolean().required(),
})
