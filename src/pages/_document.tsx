import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="fa" dir="rtl">
      <Head>
        <link rel="icon" href="/logo/TinyLogo.ico" />
        
        <link rel="preload" href="/fonts/Iransans/IRANSansWeb_Black.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Iransans/IRANSansWeb_Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Iransans/IRANSansWeb_Light.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Iransans/IRANSansWeb_Medium.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Iransans/IRANSansWeb_UltraLight.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Iransans/IRANSansWeb.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />

      </Head>
      <body>
        <Main></Main>
        <NextScript />
      </body>
    </Html>
  );
}
