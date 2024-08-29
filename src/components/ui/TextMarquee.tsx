import { useAppDispatch } from '@/hooks'
import { useGetHeaderTextQuery } from '@/services'
import { setHeaderText } from '@/store'
import React, { useEffect, useRef } from 'react'

const TextMarquee: React.FC = () => {
  const { data: headerTextData, isLoading: isLoadingHeaderText, isError: isErrorHeaderText } = useGetHeaderTextQuery()
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (headerTextData?.data) {
      dispatch(setHeaderText(headerTextData.data))
    }
  }, [headerTextData, dispatch])
  return (
    <>
      {headerTextData?.data?.isActive && (
        <div className="w-full h-10 sm:h-12 md:h-14 lg:h-16 bg-[#e90089] overflow-hidden flex justify-start items-center text-white">
          <div className="whitespace-nowrap text-sm sm:text-base  md:text-lg font-bold px-5 inline-block marquee w-full">
            {headerTextData.data.name}
          </div>
        </div>
      )}
    </>
  )
}

export default TextMarquee
