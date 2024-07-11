import * as Yup from 'yup'

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
    .max(11, 'شماره موبایل وارد شده باید 11 رقم باشد')
    .matches(/^[0-9]+$/, 'شماره وارد شده معتبر نیست'),
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
  slug: Yup.string().required('نام مسیر نباید خالی باشد'),
  image: Yup.object().shape({
    placeholder: Yup.string(),
    url: Yup.string()
      .required('آدرس تصویر را وارد کنید')
      .url('آدرس تصویر معتبر نیست')
      .matches(/\.(gif|jpe?g|png|webp)$/i, 'آدرس تصویر باید یک URL تصویر معتبر باشد'),
  }),
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
  fullName: Yup.string().required('نام و نام خانوادگی الزامی است'),
  mobileNumber: Yup.string()
    .required('شماره موبایل الزامی است')
    .matches(/^[0-9]{11}$/, 'شماره موبایل باید 11 رقم باشد'),
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
  fullAddress: Yup.string().required('آدرس کامل الزامی است'),
  postalCode: Yup.string().required('کد پستی الزامی است'),
})

export const reviewSchema = Yup.object().shape({
  userId: Yup.string(),
  productId: Yup.string(),
  rating: Yup.number().required('امتیاز الزامی است').min(1, 'امتیاز باید حداقل ۱ باشد').max(5, 'امتیاز نباید بیشتر از ۵ باشد'),
  positivePoints: Yup.array().of(
    Yup.object().shape({
      id: Yup.string(),
      title: Yup.string()
    })
  ),
  negativePoints: Yup.array().of(
    Yup.object().shape({
      id: Yup.string(),
      title: Yup.string()
    })
  ),
  comment: Yup.string().required('نظر الزامی است').min(4, 'نظر باید حداقل ۴ کاراکتر باشد'),
  Thumbnail: Yup.mixed()
});

export const productSchema = Yup.object().shape({
  Title: Yup.string().required("نام محصول الزامی است"),
  IsActive: Yup.boolean(),
  MainThumbnail: Yup.mixed().required("نگاره اول برای محصول الزامی است"),
  Thumbnail: Yup.mixed().required("حداقل یک عکس در گالری باید اضافه شود"),
  CategoryId: Yup.string().required("دسته بندی برای محصول الزامی است"),
  Description: Yup.string(),
  IsFake: Yup.boolean(),
  BrandId: Yup.string().nullable(),
  FeatureValueIds: Yup.array().of(Yup.string()),
  ProductScale: Yup.object().nullable(),
  StockItems: Yup.array().of(
    Yup.object().shape({
      id: Yup.string().nullable(),
      featureValueId: Yup.array().of(Yup.string()),
      price: Yup.number().nullable().required("تعیین قیمت محصول الزامی است"),
      discoint: Yup.number().nullable(),
      sizeId: Yup.string().nullable(),
      quantity: Yup.string().required("تعیین تعداد محصول الزامی است"),
    })
  ).nullable(),
});

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
  firstName: Yup.string().required('نام لازم است'),
  familyName: Yup.string().required('نام خانوادگی لازم است'),
  nationalCode: Yup.string().optional(),
  bankAccountNumber: Yup.string().optional(),
  shabaNumber: Yup.string().optional(),
  email: Yup.string().email('پست الکترونیک وارد شده معتبر نیست').optional(),
})
