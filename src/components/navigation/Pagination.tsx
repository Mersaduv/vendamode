import { useRouter } from 'next/router'

import { ArrowLeft, ArrowRight2 } from '@/icons'

import { useMediaQuery, useChangeRoute } from '@/hooks'

import type { IPagination, IProduct, QueryParams } from '@/types'

interface Props {
  pagination: IPagination<any[]>
  section: string
  client?: boolean
}

const Pagination: React.FC<Props> = (props) => {
  // ? Props
  const { pagination, section, client } = props
  if (!pagination) {
    return null
  }

  const { currentPage, nextPage, previousPage, hasNextPage, hasPreviousPage, lastPage } = pagination

  // ? Assets
  const isDesktop = useMediaQuery('(min-width:1024px)')
  const changeRoute = useChangeRoute()
  const { query } = useRouter()

  // ? Handlers
  const scrollToTop = () => {
    const element = document.getElementById(section)!

    const scrollY = client && isDesktop ? element?.offsetTop - 115 : element?.offsetTop

    window.scrollTo(0, scrollY)
  }

  const handleChangePage = (pageQuery: QueryParams) => {
    changeRoute({
      ...query,
      ...pageQuery,
    })
  }

  // ? Render(s)
  return (
    <nav>
      <ul className="justify-center inline-flex w-full items-center gap-x-2 px-10">
        <div className="ml-0">
          {hasPreviousPage && (
            <li
              className="flex cursor-pointer items-center p-1 text-[#e90089]"
              onClick={() => {
                handleChangePage({ page: previousPage })
                scrollToTop()
              }}
            >
              <ArrowRight2 className="text-4xl hover:shadow-xl rounded-full text-[#e90089]" />
            </li>
          )}
        </div>
        {currentPage !== 1 && previousPage !== 1 && (
          <li
            className="h-8 w-8 cursor-pointer rounded-md border-2 border-transparent p-1 text-center transition-colors hover:border-[#e90089] hover:text-[#e90089]"
            onClick={() => {
              handleChangePage({ page: 1 })
              scrollToTop()
            }}
          >
            1
          </li>
        )}
        {hasPreviousPage && previousPage !== 1 && <li>...</li>}

        {hasPreviousPage && (
          <li
            className="h-8 w-8 cursor-pointer rounded-md border-2 border-transparent p-1 text-center transition-colors hover:border-[#e90089] hover:text-[#e90089]"
            onClick={() => {
              handleChangePage({ page: previousPage })
              scrollToTop()
            }}
          >
            {previousPage}
          </li>
        )}
        <li
          className="h-8 w-8 cursor-pointer rounded-md bg-[#e90089] p-1.5 text-center text-white"
          onClick={() => {
            handleChangePage({ page: currentPage })
            scrollToTop()
          }}
        >
          {currentPage}
        </li>
        {hasNextPage && (
          <li
            className="h-8 w-8 cursor-pointer rounded-md border-2 border-transparent p-1 text-center transition-colors hover:border-[#e90089] hover:text-[#e90089]"
            onClick={() => {
              handleChangePage({ page: nextPage })
              scrollToTop()
            }}
          >
            {nextPage}
          </li>
        )}
        {hasNextPage && nextPage !== lastPage && <li>...</li>}
        {lastPage !== currentPage && lastPage !== nextPage && (
          <li
            className="h-8 w-8 cursor-pointer rounded-md border-2 border-transparent p-1 text-center transition-colors hover:border-[#e90089] hover:text-[#e90089]"
            onClick={() => {
              handleChangePage({ page: lastPage })
              scrollToTop()
            }}
          >
            {lastPage}
          </li>
        )}
        <div className="mr-0">
          {hasNextPage && (
            <li
              className="flex cursor-pointer items-center p-1 text-[#e90089]"
              onClick={() => {
                handleChangePage({ page: nextPage })
                scrollToTop()
              }}
            >
              <ArrowLeft className="text-4xl hover:shadow-xl rounded-full text-[#e90089]" />
            </li>
          )}
        </div>
      </ul>
    </nav>
  )
}

export default Pagination
