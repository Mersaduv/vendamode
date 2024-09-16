import { Dispatch, SetStateAction, useState } from 'react'
import { Combobox } from '@headlessui/react'
import { IArticle, IBrand, ICategory } from '@/types'
import { ArrowDown, CheckCircleOutline } from 'heroicons-react'
import { IoChevronDownCircleOutline } from 'react-icons/io5'
import { FaCheck } from 'react-icons/fa'
import { ArrowRight, ArrowRight2 } from '@/icons'

interface ArticleComboboxProps {
  articles: IArticle[]
  onArticleSelect: (article: IArticle) => void
  selectedArticle: IArticle | null
  setSelectedArticle: Dispatch<SetStateAction<IArticle | null>>
}

const ArticleCombobox: React.FC<ArticleComboboxProps> = ({
  articles,
  onArticleSelect,
  selectedArticle,
  setSelectedArticle,
}) => {
  const [query, setQuery] = useState('')

  const controlledSelectedArticle = selectedArticle || { id: '', title: '' }

  const articlesWithDefault = [
    { id: '', title: 'انتخاب کنید' },
    ...articles,
  ]

  const filteredArticles =
    query === ''
      ? articlesWithDefault
      : articlesWithDefault.filter((article) =>
          article.title.toLowerCase().includes(query.toLowerCase())
        )

  const handleSelect = (article: IArticle) => {
    setSelectedArticle(article)
    onArticleSelect(article)
  }

  return (
    <div className="w-full relative">
      <Combobox value={controlledSelectedArticle} onChange={handleSelect}>
        <div className="relative">
          <Combobox.Button className="absolute w-full top-1 -left-1 flex items-center justify-end pr-2">
            <ArrowRight2 className="text-4xl text-gray-400 rotate-90 ml-1 -mt-0.5" />
          </Combobox.Button>
          <Combobox.Input
            className="w-full rounded-md border border-gray-300 py-1.5 pr-8 pl-3 text-gray-900"
            displayValue={(article: IArticle) => article?.title}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="مقاله‌ای را انتخاب کنید"
          />
        </div>
        <Combobox.Options className="absolute z-[60] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {filteredArticles.length === 0 && query !== '' ? (
            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">هیچ مقاله‌ای یافت نشد.</div>
          ) : (
            filteredArticles.map((article) => (
              <Combobox.Option
                key={article.id}
                value={article}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-gray-100 text-white' : 'text-gray-900'
                  }`
                }
              >
                {({ selected, active }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      {article.title}
                    </span>
                    {selected ? (
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                          active ? 'text-[#e90089]' : 'text-[#e90089]'
                        }`}
                      >
                        <FaCheck className="h-4 w-4" />
                      </span>
                    ) : null}
                  </>
                )}
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </Combobox>
    </div>
  )
}

export default ArticleCombobox
