import { ResponsiveImage } from '@/components/ui'

import type { IBanner } from '@/types'

interface Props {
  data: IBanner[]
}

const LargeBanner: React.FC<Props> = (props) => {
  // ? Props
  const { data: bannerAds } = props;

  if (bannerAds.length === 0) return null;

  return (
    <section className="bg-white dark:bg-gray-800 h-full py-6 sm:py-8 lg:py-12">
      <div className="mx-auto max-w-[1550px] px-2 md:px-3">
        <div className="grid xs:grid-cols-2 gap-2 md:grid-cols-3 md:gap-6 xl:gap-4">
          {bannerAds[0] && bannerAds[0].isActive && (
            <a
              href={
                bannerAds[0].type === 'link'
                  ? bannerAds[0].link
                  : bannerAds[0].type === 'category'
                  ? `/products?categoryId=${bannerAds[0].categoryId}`
                  : '#'
              }
              target={bannerAds[0].type === 'link' ? '_blank' : '_self'}
              rel={bannerAds[0].type === 'link' ? 'noopener noreferrer' : undefined}
              className="group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-80"
            >
              <img
                src={bannerAds[0].image.imageUrl}
                loading="lazy"
                alt={'بنر '}
                className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50"></div>
            </a>
          )}

          {bannerAds[1] && bannerAds[1].isActive && (
            <a
              href={
                bannerAds[1].type === 'link'
                  ? bannerAds[1].link
                  : bannerAds[1].type === 'category'
                  ? `/products?categoryId=${bannerAds[1].categoryId}`
                  : '#'
              }
              target={bannerAds[1].type === 'link' ? '_blank' : '_self'}
              rel={bannerAds[1].type === 'link' ? 'noopener noreferrer' : undefined}
              className="group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:col-span-2 md:h-80"
            >
              <img
                src={bannerAds[1].image.imageUrl}
                loading="lazy"
                alt={'بنر '}
                className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50"></div>
            </a>
          )}

          {bannerAds[2] && bannerAds[2].isActive && (
            <a
              href={
                bannerAds[2].type === 'link'
                  ? bannerAds[2].link
                  : bannerAds[2].type === 'category'
                  ? `/products?categoryId=${bannerAds[2].categoryId}`
                  : '#'
              }
              target={bannerAds[2].type === 'link' ? '_blank' : '_self'}
              rel={bannerAds[2].type === 'link' ? 'noopener noreferrer' : undefined}
              className="group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:col-span-2 md:h-80"
            >
              <img
                src={bannerAds[2].image.imageUrl}
                loading="lazy"
                alt={'بنر '}
                className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50"></div>
            </a>
          )}

          {bannerAds[3] && bannerAds[3].isActive && (
            <a
              href={
                bannerAds[3].type === 'link'
                  ? bannerAds[3].link
                  : bannerAds[3].type === 'category'
                  ? `/products?categoryId=${bannerAds[3].categoryId}`
                  : '#'
              }
              target={bannerAds[3].type === 'link' ? '_blank' : '_self'}
              rel={bannerAds[3].type === 'link' ? 'noopener noreferrer' : undefined}
              className="group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-80"
            >
              <img
                src={bannerAds[3].image.imageUrl}
                loading="lazy"
                alt={'بنر '}
                className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50"></div>
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default LargeBanner;
