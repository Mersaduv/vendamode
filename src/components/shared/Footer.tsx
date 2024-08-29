const Footer = () => {
  return (
    <footer className="w-full bg-gray-100 text-gray-800 py-8 mt-20">
      <div className="container mx-auto flex flex-col px-4">
        <div className="flex flex-col  justify-between items-center lg:items-center">
          <div className=" text-center mb-8 lg:mb-0">
            <h2 className="text-xl font-bold mb-4">منحصر به فرد باش! سلامت باش! خوشحال باش!</h2>
            <p className="text-sm">
              در دنیای پیشرفته امروزی، هر چیزی که به دنبالش باشید تنها یک کلیک با شما فاصله دارد و این امکان به شما
              توانایی داده تا به خرید طلا و جواهرات خود را آگاهانه خرید خود را انجام دهید. شاید تصویری که در حال بررسی
              آن هستید، در سایت ما موجود نباشد، در این حالت می‌توانید خرید خود را به سرعت انجام داده و در منزل خود تحویل
              بگیرید.
            </p>
          </div>
          <div className="grid grid-cols-4 gap-8 xs:gap-10">
            <div className="flex justify-center flex-col items-center gap-1.5">
                <img className="w-[50px] h-[50px]" src="/images//Design/Attr/Attrimage4.png" alt="" />
                <div className="text-center">پشتیبانی 24+7</div>
            </div>
            <div className="flex justify-center flex-col items-center gap-1.5">
                <img className="w-[50px] h-[50px]" src="/images//Design/Attr/Attrimage3.png" alt="" />
                <div className="text-center">ضمانت کالا</div>
            </div>
            <div className="flex justify-center flex-col items-center gap-1.5">
                <img className="w-[50px] h-[50px]" src="/images//Design/Attr/Attrimage2.png" alt="" />
                <div className="text-center">اصالت کالا</div>
            </div>
            <div className="flex justify-center flex-col items-center gap-1.5">
                <img className="w-[50px] h-[50px]" src="/images//Design/Attr/Attrimage1.png" alt="" />
                <div className="text-center">ارسال فوری</div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-12">
            <div className="mb-8 lg:mb-0  text-center lg:text-start">
              <h3 className="text-lg font-bold mb-4">خرید از وندامد</h3>
              <ul>
                <li>
                  <a href="#" className="text-sm p-2">
                    رویه ارسال سفارش
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm p-2">
                    رویه استرداد کالا
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm p-2">
                    نحوه پرداخت مبلغ سفارش
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm p-2">
                    نحوه خرید از وندامد
                  </a>
                </li>
              </ul>
            </div>
            <div className="mb-8 lg:mb-0  text-center lg:text-start">
              <h3 className="text-lg font-bold mb-4">فروش در وندامد</h3>
              <ul>
                <li>
                  <a href="#" className="text-sm p-2">
                    قوانین فروش در وندامد
                  </a>
                </li>
              </ul>
            </div>
            <div className=" text-center lg:text-start">
              <h3 className="text-lg font-bold mb-4 ">با وندامد</h3>
              <ul>
                <li>
                  <a href="#" className="text-sm p-2">
                    تماس با ما
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm p-2">
                    سوالات متداول!
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm p-2">
                    گزارش ایراد در سایت
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-bold mb-4 ">همراه باشید</h3>
              <div className="flex gap-4">
                <img src="/images/Design/SM/SMimage1.png" alt="aparat" />
                <img src="/images//Design/SM/SMimage2.png" alt="insta" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row justify-between items-center mt-8">
          <div className="mb-4 lg:mb-0">
            <p className="text-sm">کلیه حقوق این سایت متعلق به شرکت توسعه خلاقیت مدیسا می باشد</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* <img src="logo-samandehi.png" alt="Samandehi Logo" className="w-12 h-12" /> */}
            <p className="text-sm">پشتیبانی 24/7 - 021-91692410</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
